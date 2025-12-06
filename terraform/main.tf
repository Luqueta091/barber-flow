terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

########################
# Networking helpers
########################

data "aws_caller_identity" "current" {}

locals {
  vpc_id             = var.vpc_id
  private_subnet_ids = var.private_subnet_ids
  public_subnet_ids  = coalesce(var.public_subnet_ids, var.private_subnet_ids)
}

########################
# Security groups
########################

resource "aws_security_group" "app_ingress" {
  name        = "${var.project}-app-ingress"
  description = "Ingress rules for app dependencies"
  vpc_id      = local.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group_rule" "app_ingress_cidrs" {
  for_each = { for idx, cidr in var.allowed_cidr_blocks : idx => cidr }

  type              = "ingress"
  security_group_id = aws_security_group.app_ingress.id
  from_port         = 0
  to_port           = 65535
  protocol          = "tcp"
  cidr_blocks       = [each.value]
  description       = "Allow app traffic from ${each.value}"
}

########################
# Postgres (RDS)
########################

resource "random_password" "db" {
  length           = 20
  special          = true
  override_char_set = "!#$%&*()-_=+[]{}<>?:"
}

resource "aws_db_subnet_group" "db" {
  name       = "${var.project}-db-subnets"
  subnet_ids = local.private_subnet_ids
}

resource "aws_db_parameter_group" "db" {
  name   = "${var.project}-db-params"
  family = "postgres15"
}

resource "aws_db_instance" "db" {
  identifier              = "${var.project}-postgres"
  engine                  = "postgres"
  engine_version          = "15.5"
  instance_class          = var.db_instance_class
  allocated_storage       = 20
  storage_type            = "gp3"
  db_subnet_group_name    = aws_db_subnet_group.db.name
  vpc_security_group_ids  = [aws_security_group.app_ingress.id]
  username                = var.db_username
  password                = random_password.db.result
  db_name                 = var.db_name
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"
  multi_az                = true
  deletion_protection     = false
  skip_final_snapshot     = true
  storage_encrypted       = true
  copy_tags_to_snapshot   = true
  publicly_accessible     = false
  parameter_group_name    = aws_db_parameter_group.db.name
}

########################
# Redis (ElastiCache)
########################

resource "random_password" "redis_auth" {
  length  = 32
  special = false
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project}-redis-subnets"
  subnet_ids = local.private_subnet_ids
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "${var.project}-redis"
  description                   = "Redis for ${var.project}"
  engine                        = "redis"
  engine_version                = "7.1"
  node_type                     = var.redis_node_type
  parameter_group_name          = "default.redis7"
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.redis.name
  security_group_ids            = [aws_security_group.app_ingress.id]
  automatic_failover_enabled    = true
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = true
  multi_az_enabled              = true
  num_node_groups               = 1
  replicas_per_node_group       = 1
  auth_token                    = random_password.redis_auth.result
  snapshot_retention_limit      = 3
  apply_immediately             = true
  auto_minor_version_upgrade    = true
  maintenance_window            = "sun:03:00-sun:04:00"
}

########################
# Message broker (RabbitMQ on AWS MQ)
########################

resource "random_password" "broker" {
  length  = 24
  special = false
}

resource "aws_mq_broker" "broker" {
  broker_name        = "${var.project}-broker"
  engine_type        = "RabbitMQ"
  engine_version     = "3.11.20"
  host_instance_type = var.broker_instance_type
  subnet_ids         = local.private_subnet_ids
  security_groups    = [aws_security_group.app_ingress.id]
  publicly_accessible = false

  user {
    username = var.broker_username
    password = random_password.broker.result
  }

  maintenance_window_start_time {
    day_of_week = "SUNDAY"
    time_of_day = "04:00"
    time_zone   = "UTC"
  }
}

########################
# Object storage (S3)
########################

resource "aws_s3_bucket" "objects" {
  bucket = "${var.project}-objects-${data.aws_caller_identity.current.account_id}"

  tags = {
    Project = var.project
  }
}

resource "aws_s3_bucket_versioning" "objects" {
  bucket = aws_s3_bucket.objects.id

  versioning_configuration {
    status = "Enabled"
  }
}

########################
# Secrets Manager
########################

resource "aws_secretsmanager_secret" "db" {
  name        = "${var.secret_prefix}/db"
  description = "Postgres credentials and connection string for ${var.project}"
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id     = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    username          = var.db_username
    password          = random_password.db.result
    host              = aws_db_instance.db.address
    port              = aws_db_instance.db.port
    database          = var.db_name
    connection_string = "postgresql://${var.db_username}:${random_password.db.result}@${aws_db_instance.db.address}:${aws_db_instance.db.port}/${var.db_name}"
  })
}

resource "aws_secretsmanager_secret" "redis" {
  name        = "${var.secret_prefix}/redis"
  description = "Redis credentials for ${var.project}"
}

resource "aws_secretsmanager_secret_version" "redis" {
  secret_id     = aws_secretsmanager_secret.redis.id
  secret_string = jsonencode({
    auth_token   = random_password.redis_auth.result
    primary_host = aws_elasticache_replication_group.redis.primary_endpoint_address
    reader_host  = aws_elasticache_replication_group.redis.reader_endpoint_address
    port         = aws_elasticache_replication_group.redis.port
  })
}

resource "aws_secretsmanager_secret" "broker" {
  name        = "${var.secret_prefix}/broker"
  description = "RabbitMQ connection for ${var.project}"
}

resource "aws_secretsmanager_secret_version" "broker" {
  secret_id     = aws_secretsmanager_secret.broker.id
  secret_string = jsonencode({
    username       = var.broker_username
    password       = random_password.broker.result
    host           = aws_mq_broker.broker.instances[0].endpoints[0]
    management_url = aws_mq_broker.broker.instances[0].console_url
    vhost          = "/"
    amqps_url      = "amqps://${var.broker_username}:${random_password.broker.result}@${aws_mq_broker.broker.instances[0].endpoints[0]}"
  })
}

########################
# Outputs
########################

output "postgres_endpoint" {
  description = "Postgres endpoint (host:port)"
  value       = "${aws_db_instance.db.address}:${aws_db_instance.db.port}"
}

output "redis_primary_endpoint" {
  description = "Redis primary endpoint"
  value       = aws_elasticache_replication_group.redis.primary_endpoint_address
}

output "broker_endpoint" {
  description = "RabbitMQ endpoint"
  value       = aws_mq_broker.broker.instances[0].endpoints[0]
}

output "object_bucket" {
  description = "S3 bucket for object storage"
  value       = aws_s3_bucket.objects.bucket
}

output "secret_arns" {
  description = "Secrets Manager ARNs"
  value = {
    db     = aws_secretsmanager_secret.db.arn
    redis  = aws_secretsmanager_secret.redis.arn
    broker = aws_secretsmanager_secret.broker.arn
  }
}

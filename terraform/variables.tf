variable "project" {
  description = "Project name prefix for resources"
  type        = string
  default     = "barber-flow"
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "vpc_id" {
  description = "VPC ID where resources will be created"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for RDS, Redis, MQ"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Optional public subnet IDs (if you want MQ console accessible via public subnet)"
  type        = list(string)
  default     = null
}

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to reach dependencies (db/redis/broker). Keep this narrow."
  type        = list(string)
  default     = []
}

variable "db_instance_class" {
  description = "Instance class for Postgres RDS"
  type        = string
  default     = "db.t3.micro"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "app_user"
}

variable "db_name" {
  description = "Database name to create"
  type        = string
  default     = "barber_flow"
}

variable "redis_node_type" {
  description = "Node type for Redis replication group"
  type        = string
  default     = "cache.t3.micro"
}

variable "broker_instance_type" {
  description = "Instance type for RabbitMQ (AWS MQ)"
  type        = string
  default     = "mq.t3.micro"
}

variable "broker_username" {
  description = "RabbitMQ admin username"
  type        = string
  default     = "app-broker"
}

variable "secret_prefix" {
  description = "Prefix for storing secrets in AWS Secrets Manager"
  type        = string
  default     = "barber-flow"
}

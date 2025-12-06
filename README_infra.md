# INF-001 – Infra básica (Postgres, Redis, Broker, Object Storage, Secrets)

Este diretório `terraform/` descreve a infraestrutura mínima para o sistema de agendamento:

- Postgres (RDS) com backups automáticos.
- Redis (ElastiCache) com `auth_token` e TLS.
- RabbitMQ (AWS MQ) como broker.
- S3 para object storage.
- Secrets no AWS Secrets Manager com connection strings.

> Modelo pensado para AWS. Ajuste se usar outro provedor.

## Pré-requisitos
- Terraform >= 1.5
- Credenciais AWS com permissão para VPC, RDS, ElastiCache, MQ, S3 e Secrets Manager.
- VPC e subnets já criadas (private subnets para RDS/Redis/MQ).

## Como usar
1) Crie um arquivo `terraform.tfvars` (não commit) com seus IDs de rede e, idealmente, CIDRs permitidos:
   ```hcl
   aws_region          = "us-east-1"
   project             = "barber-flow"
   vpc_id              = "vpc-xxxx"
   private_subnet_ids  = ["subnet-aaa", "subnet-bbb"]
   # opcional, se quiser console do MQ em subnet pública
   # public_subnet_ids   = ["subnet-ccc", "subnet-ddd"]
   allowed_cidr_blocks = ["10.0.0.0/16"] # restrinja ao app/bastion
   ```

2) Inicialize e revise o plano:
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

3) Outputs principais:
   - `postgres_endpoint`
   - `redis_primary_endpoint`
   - `broker_endpoint`
   - `object_bucket`
   - `secret_arns` (db, redis, broker)

## Notas de conformidade com INF-001
- **Postgres com backup**: RDS com `backup_retention_period = 7`, janelas de backup/maintenance definidas, storage encrypted, multi-AZ ligado.
- **Redis com auth**: ElastiCache com `auth_token`, TLS (`transit_encryption_enabled`), multi-AZ e snapshot retention.
- **Broker configurado**: AWS MQ (RabbitMQ) com usuário/password gerados.
- **Secrets em Secret Manager**: DB, Redis e Broker expostos em Secrets Manager (ARNs nos outputs) com connection strings/hosts.

## Próximos passos e hardening
- Adicionar VPC/NAT/route tables se quiser rede totalmente isolada (hoje assume VPC/subnets existentes).
- Ajustar classes de instância conforme carga (valores default são econômicos).
- Configurar políticas de rota/SG específicas para os serviços que vão consumir DB/Redis/Broker (use `allowed_cidr_blocks` com cuidado).
- Integrar backend com Secrets Manager via SDK/IMDS ou injetar via pipeline.

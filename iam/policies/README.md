# IAM policies (SEC-001)

- Criar role para deploy com permissão restrita a aplicar manifests no namespace alvo.
- Role para worker de notificações com permissão apenas de consumir da fila e enviar para provider (sem acesso amplo).
- Policies para Secrets Manager apenas leitura dos secrets necessários.

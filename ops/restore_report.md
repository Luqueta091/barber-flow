# OPS-DR-001 – Restore test (RTO/RPO)

Status: placeholder; rodar restore em ambiente isolado.

Procedimento:
1. Obter backup (dump) e DB alvo (staging/isolado).
2. Executar: `./scripts/restore.sh postgresql://user:pass@host:5432/db backup.dump`
3. Medir RTO (tempo total) e RPO (idade do backup).
4. Validar integridade: `SELECT COUNT(*)` em tabelas principais.

Campos a preencher após execução real:
- Data do teste:
- Backup timestamp:
- RTO observado:
- RPO observado:
- Gaps/ações:

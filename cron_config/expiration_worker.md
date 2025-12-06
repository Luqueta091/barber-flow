# Expiration worker (AVA-006)

Responsável por limpar reservas expiradas e publicar evento/invalidate cache.

## Execução
- Script: `node workers/expiration_worker.ts`
- Intervalo: configurar via env `EXPIRATION_INTERVAL_MS` (default 60000ms).

## Cron (exemplo)
```
* * * * * cd /app && node workers/expiration_worker.ts >> /var/log/expiration_worker.log 2>&1
```

## Expectativas
- Reservas expiradas são removidas do store e gera evento `ReservationExpired`.
- Cache de disponibilidade é invalidado para a data correspondente.

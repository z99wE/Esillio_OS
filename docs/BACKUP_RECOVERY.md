# Esillio OS — Backup & Recovery Plan

**Owner:** Engineering Lead  
**Effective Date:** {{ DATE }}  
**Review Cycle:** Quarterly + after any data incident

---

## 1. What Is Backed Up

| Data Store | Backup Method | Frequency | Retention |
|------------|--------------|-----------|-----------|
| **Supabase Postgres (PHI)** | Supabase point-in-time recovery (PITR) | Continuous | 7 days (Pro plan) |
| **Supabase Storage (document uploads)** | Supabase built-in replication | N/A (replicated) | Indefinite |
| **App configuration / secrets** | Stored in env vars (GitHub Actions / Cloud Run secrets) — NOT in DB | On change | Git history |
| **Audit logs** | Written to `audit_logs` table in Supabase | Real-time | 90 days |

> ⚠ **HIPAA Note:** Supabase's Pro/Enterprise plans provide PITR and are eligible for a BAA. Confirm BAA is signed before go-live.

---

## 2. Recovery Point Objective (RPO) & Recovery Time Objective (RTO)

| Scenario | RPO | RTO |
|----------|-----|-----|
| Full database loss (Supabase failure) | 24 hours | 4 hours |
| Accidental table truncation | < 5 min (PITR) | 1 hour |
| App deployment failure (Cloud Run) | 0 (no data lost) | 15 min (rollback) |

---

## 3. Restore Procedure — Supabase PITR

```bash
# 1. Log in to Supabase Dashboard → Project → Database → Backups
# 2. Select "Point in Time Recovery"
# 3. Choose timestamp BEFORE the incident
# 4. Click "Restore" — Supabase spins up a new instance
# 5. Update DATABASE_URL environment variable in Cloud Run / hosting
# 6. Run migrations if needed:
uv run alembic upgrade head   # (if using Alembic for schema)
# 7. Smoke-test: curl https://api.esillio.com/health
```

---

## 4. Restore Procedure — Manual Table Backup

For an ad-hoc backup before a risky migration:

```bash
# Export specific table to CSV via Supabase SQL editor
COPY (SELECT * FROM health_events) TO '/tmp/health_events_backup.csv' CSV HEADER;

# Or use pg_dump:
pg_dump --table=health_events $DATABASE_URL > health_events_$(date +%Y%m%d).sql
```

---

## 5. Document / File Recovery

Uploaded files are stored in Supabase Storage with built-in object replication. To restore a deleted object:

```sql
-- Find deleted uploads in audit_logs
SELECT * FROM audit_logs WHERE action = 'upload_document' AND user_id = '<user_id>';
-- Contact Supabase support for storage-level recovery (Pro+ plan feature)
```

---

## 6. Environment Variable Backup

All secrets are stored in:
- **GitHub Actions secrets** (CI/CD)
- **Google Cloud Secret Manager** (production)

To recover: re-create from the secure vault held by the DPO / founder. Never store secrets in plain-text or in the repository.

---

## 7. Backup Verification

Run a quarterly restore test:
1. Spin up a temporary Supabase project.
2. Restore the latest backup into it.
3. Run the contract test suite: `pytest tests/test_contracts.py`
4. Confirm all 16 tests pass.
5. Destroy the temporary project.

Document results in `docs/postmortems/YYYY-MM-DD-backup-drill.md`.

---

## 8. Escalation

| Situation | Action |
|-----------|--------|
| PITR not available (free plan) | Contact Supabase support + initiate manual restore from last export |
| Complete Supabase data loss | Activate DRaaS contract / migrate to new provider using last export |
| Encryption key lost | Contact DPO — legal hold + user notification required |

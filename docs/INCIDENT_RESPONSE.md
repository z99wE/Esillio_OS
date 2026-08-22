# Esillio OS — Incident Response Playbook

**Owner:** Engineering Lead  
**Effective Date:** {{ DATE }}  
**Review Cycle:** Quarterly

---

## 1. Severity Levels

| Level | Name | Example | Response Time |
|-------|------|---------|---------------|
| P0 | Critical | PHI data breach, service fully down | 15 min |
| P1 | High | Auth broken, AI pipeline failing for all users | 1 hour |
| P2 | Medium | Single feature broken, high error rate | 4 hours |
| P3 | Low | UI bug, minor degradation | 1 business day |

---

## 2. Roles

| Role | Responsibility |
|------|---------------|
| **Incident Commander (IC)** | Declare severity, own the bridge, approve comms |
| **On-Call Engineer** | First responder; investigate and fix |
| **Comms Lead** | Draft and send status page / user notifications |
| **Data Protection Officer (DPO)** | Required for any P0 involving PHI |

---

## 3. Detection Sources

- Supabase alerts (DB CPU > 80%, auth errors > 5%)
- FastAPI `/health` endpoint polling (configured in CI/CD and Uptime Robot)
- Sentry error rate spike alerts
- User-reported issues via support@esillio.com
- GitHub Actions deployment failure notifications

---

## 4. Response Runbook

### P0 — PHI Breach or Full Outage

```
00:00  On-call receives alert / report
00:05  Declare P0. Notify IC and DPO on Slack #incidents
00:10  Enable maintenance mode: set MAINTENANCE_MODE=1 env var and redeploy
00:15  Identify blast radius: which users / which tables?
00:30  Rotate compromised credentials (Supabase anon key, JWT secret)
00:45  Preserve evidence: Supabase Audit log export, app logs
01:00  Notify affected users per HIPAA Breach Notification Rule (if applicable)
       — Timeline: notify within 60 days of discovery
24:00  File draft post-mortem in /docs/postmortems/YYYY-MM-DD-title.md
72:00  Publish final post-mortem and corrective actions
```

### P1 — Feature / Auth Failure

```
00:00  Identify failing service (auth, AI, export)
00:15  Check recent deploys — rollback if deployment caused issue:
       git revert HEAD && push → triggers CD pipeline
00:30  Hotfix branch if rollback is not possible
00:60  Verify fix in staging before promoting to prod
```

---

## 5. Rollback Procedure

```bash
# 1. Identify the last known-good image tag from GitHub Actions
# 2. Redeploy via Cloud Run (or your hosting provider):
gcloud run deploy esillio-api \
  --image gcr.io/PROJECT/esillio-api:LAST_GOOD_TAG \
  --region us-central1

# 3. Confirm health check passes
curl https://api.esillio.com/health
```

---

## 6. Communication Templates

### Status Page Update (during incident)
> **[STATUS: INVESTIGATING]** We are aware of an issue affecting [feature]. Our team is actively investigating. Updates every 30 minutes.

### User Email (P0 PHI Breach — template for DPO)
> Subject: Important Security Notice — Esillio OS
> 
> We are writing to inform you that on [DATE], we identified [brief description]. We have taken the following steps: [actions]. If you have questions, contact dpo@esillio.com.

---

## 7. Post-Mortem Template

File at: `docs/postmortems/YYYY-MM-DD-title.md`

```markdown
## Summary
## Timeline (UTC)
## Root Cause
## Impact
## What Went Well
## What Went Wrong
## Corrective Actions (with owners and due dates)
```

---

## 8. Key Contacts

| Contact | Detail |
|---------|--------|
| Supabase Support | support.supabase.com |
| Google Cloud Run | console.cloud.google.com |
| DPO / Legal | dpo@esillio.com |
| On-call rotation | Configured in PagerDuty / Linear |

# Esillio OS — Deployment Verification Checklist

Use this checklist before every production deployment.  
**Gate rule:** All P0 items must be ✅ before promoting to production. P1 items must be resolved within 24 hours.

---

## Pre-Deployment (run before merging to main)

### Code Quality
- [ ] All CI tests pass (`pytest tests/` — currently 19 tests)
- [ ] No new ESLint errors in the frontend (`npm run lint`)
- [ ] No secrets or credentials committed (run `git log -p | grep -E "sk-|AIza|postgres://"`)
- [ ] PR reviewed and approved by at least one other person (or self-review with checklist)

### Security
- [ ] CORS origins updated in `app/main.py` if new frontend domain added
- [ ] No new unauthenticated endpoints (all non-public routes use `Depends(get_current_user)`)
- [ ] Rate limiting verified for AI endpoints
- [ ] Security headers present in `/health` response (`X-Frame-Options`, `X-Content-Type-Options`)

### Schema / Database
- [ ] Supabase migration file created for any new tables or columns
- [ ] RLS policies written and tested for any new tables
- [ ] No raw SQL queries that concatenate user input (parameterized queries only)

---

## Deployment Steps

### Backend (FastAPI on Cloud Run / Fly.io)

```bash
# 1. Run full test suite
pytest tests/ -v

# 2. Build and push Docker image
docker build -t gcr.io/PROJECT/esillio-api:$(git rev-parse --short HEAD) .
docker push gcr.io/PROJECT/esillio-api:$(git rev-parse --short HEAD)

# 3. Deploy
gcloud run deploy esillio-api \
  --image gcr.io/PROJECT/esillio-api:$(git rev-parse --short HEAD) \
  --region us-central1

# 4. Smoke test
curl https://api.esillio.com/health
```

### Frontend (Vite on Vercel / Netlify)

```bash
# 1. Build
cd web && npm run build

# 2. Check bundle size — warn if > 2 MB
du -sh dist/

# 3. Deploy preview first (automatic in Vercel PR previews)
# 4. Promote to production after manual verification
```

---

## Post-Deployment Verification (within 15 minutes of deploy)

### P0 — Must pass before declaring deploy complete
- [ ] `GET /health` returns `{"status": "healthy"}`
- [ ] Auth flow works: sign-up → email confirm → sign-in → lands on Timeline
- [ ] AI timeline generation returns a result for a test event
- [ ] No spike in Sentry error rate (check dashboard)

### P1 — Must pass within 24 hours
- [ ] Data export (`/api/export/my-data`) returns valid JSON for test user
- [ ] Account deletion (`DELETE /api/export/delete-account`) completes for test account
- [ ] Clinician queue shows pending items
- [ ] Waitlist join → onboarding funnel redirect works end-to-end
- [ ] Admin console `/admin` loads metrics heatmap

### P2 — Good to verify within 48 hours
- [ ] PWA install prompt appears on mobile Chrome
- [ ] ICE QR code generates correctly
- [ ] Doctor Packet PDF downloads successfully
- [ ] Medication reminders schedule notification
- [ ] Zero-AI toggle disables all LLM calls

---

## Rollback Trigger Criteria

Initiate immediate rollback if any of the following are true within 30 minutes of deploy:

| Condition | Threshold |
|-----------|-----------|
| HTTP 5xx error rate | > 2% of requests |
| Auth failure rate | > 1% of sign-in attempts |
| `/health` returns `"degraded"` | Immediate |
| Sentry new issue volume | > 50 new issues / 10 min |
| PHI-related error in logs | Any |

**Rollback command:**
```bash
gcloud run services update-traffic esillio-api --to-revisions=PREV_REVISION=100
```

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| On-call Engineer | | | |
| Product Owner | | | |

# Esillio OS Checklist

This checklist breaks Esillio OS into build phases so the product can become production-ready, fundable, and moat-driven without unnecessary bloat.

## Phase 1: Foundation Hardening
Purpose: make the app secure and stable enough to build on.

- [x] Replace hardcoded auth secrets with environment-based configuration
- [x] Use real password hashing instead of plain SHA-256
- [x] Remove insecure demo/token shortcuts from production paths
- [x] Add security headers on the FastAPI app
- [x] Add upload file type and size guardrails
- [x] Add basic usage budgeting and daily credit limits
- [x] Stop exposing provider API keys to the browser
- [x] Add CI checks for backend tests and frontend builds

Why this phase matters:
- Prevents obvious security failures
- Creates a safe base for Supabase migration
- Gives the app a cost floor so free users cannot burn through the budget

Phase 1 code status:
- [x] All planned code changes for Phase 1 are implemented
- [x] Backend tests pass
- [x] Frontend production build passes

What is still left for Phase 1 before real production deployment:
- [x] Set a real `JWT_SECRET_KEY` in the deployment environment
- [x] Set `ENABLE_GUEST_LOGIN=false` for production
- [x] Configure real admin AI keys or key pool values in the backend environment
- [x] Add an `.env.example` or deployment secrets template
- [ ] Do a manual browser QA pass for login, logout, guest mode, upload limits, and credit exhaustion messaging

Important note:
- There is no more Phase 1 feature work left to build in code.
- What remains is deployment configuration and final validation, not product development.

## Phase 2: Supabase Core Migration
Purpose: move from local-only persistence to a real multi-tenant backend.

- [x] Replace SQLite as the primary production datastore with Supabase Postgres
- [x] Move authentication to Supabase Auth
- [x] Configure backend APIs to verify tokens (via `supabase_client.auth.get_user`).
- [x] Migrate Document Storage to Supabase Storage.
- [x] Integrate `AuditService` with Supabase PostgreSQL (replace local SQLite triggers).
- [x] Refactor RBAC using roles from the `profiles` table.
- [x] Implement robust unit testing around Phase 2 modules.

Why this phase matters:
- Enables production tenancy
- Makes sharing and permissions enforceable
- Improves trust, portability, and fundraising credibility

## Phase 3: Moat Data Model
Purpose: make Esillio a patient-owned continuity layer instead of a simple tracker.

- [x] Build source-linked timeline records
- [x] Store provenance for every extracted insight
- [x] Add change-diff views between visits and uploads
- [x] Add condition-specific history summaries
- [x] Add structured source references (insight_provenance) for summaries and education

Why this phase matters:
- Creates switching cost
- Makes the product meaningfully different from trackers and chatbots
- Lets users trust the output because it is tied to sources

## Phase 4: Clinician-Approved Education
Purpose: add a trust layer that generic health apps do not have.

- [ ] Build a clinician review queue
- [x] Generate patient education drafts from the source timeline
- [x] Require explicit clinician approval before patient publication
- [x] Version every approved education card
- [x] Mark education as stale when newer records arrive

Why this phase matters:
- Makes the app safer
- Creates a clinician workflow moat
- Turns AI output into a reviewed medical education layer

## Phase 5: Patient Follow-Up Workflows
Purpose: turn insights into actions.

- [x] Create follow-up task objects
- [x] Add appointment prep checklists
- [x] Add lab follow-up reminders
- [x] Add medication change follow-ups
- [x] Add “ask your doctor” prompts
- [x] Add stale task detection when context changes

Why this phase matters:
- Increases retention
- Gives users a reason to return
- Makes the app operational, not just informational

## Phase 6: Permissioned Sharing
Purpose: support real-world collaboration without losing privacy.

- [x] Add share links with expiration
- [x] Add caregiver-specific access modes
- [x] Add clinician view modes
- [x] Add summary-only sharing
- [x] Add document-level permissions

Why this phase matters:
- Enables family and care-team collaboration
- Makes Esillio useful in actual healthcare settings
- Builds trust through control and least-privilege access

## Phase 7: Usage-Aware AI Budgeting
Purpose: keep the product affordable at scale.

- [x] Add daily credit limits for free users
- [x] Add provider fallback routing
- [x] Add admin-managed LLM key pool rotation
- [x] Add per-tenant cost tracking
- [x] Add graceful downgrade when limits are reached
- [x] Add BYOK support for power users

Why this phase matters:
- Prevents runaway AI spend
- Lets free users keep using the app
- Makes the product financially survivable before monetization

## Phase 8: Multi-Platform Delivery
Purpose: make Esillio usable everywhere.

- [x] Make the web app fully PWA-ready
- [x] Add offline-friendly surfaces for core browsing
- [x] Add Capacitor packaging for Android
- [x] Add Capacitor packaging for iOS
- [x] Keep the website as the primary distribution channel

Why this phase matters:
- Avoids app store dependency early
- Gives mobile access without a rewrite
- Lets the same product ship across web and mobile

## Phase 9: Production Quality
Purpose: make the app actually feel reliable and shippable.

- [x] Add and run backend tests
- [x] Make frontend production builds pass
- [x] Add more unit tests for critical services
- [x] Add API contract tests
- [x] Add accessibility checks
- [x] Add error boundaries and graceful UI fallbacks
- [x] Add logging and observability
- [x] Add CI pipeline for tests and builds
- [x] Add CD pipeline for deploy previews and production releases

Why this phase matters:
- Reduces regressions
- Supports team velocity
- Makes the product feel real to users and investors

## Phase 10: "Fundability" Surfaces [COMPLETED]
Goal: Add the minimum viable pages needed to look like a real company to an investor (Waitlist, FAQ, Demo flow), plus the Admin Console.
Dependencies: Phase 2, Phase 3
Status: ✅ DONE
- [x] Build clinician workspace
- [x] Build admin console
- [x] Add cohort and retention analytics
- [x] Add safe product metrics without PHI leakage
- [x] Add waitlist and onboarding funnel
- [x] Add public FAQ and product narrative pages
- [x] Add case-study style demo flows

Why this phase matters:
- Shows traction and retention
- Proves the product has workflow depth
- Makes the company easier to explain and fund

## Phase 11: Launch Readiness [COMPLETED]
Purpose: prepare for public beta.

- [x] Add privacy policy
- [x] Add terms of service
- [x] Add medical disclaimer
- [x] Add data export flow
- [x] Add account deletion flow
- [x] Add incident response notes
- [x] Add backup and recovery plan
- [x] Add deployment verification checklist

Status: ✅ DONE — see docs/INCIDENT_RESPONSE.md, docs/BACKUP_RECOVERY.md, docs/DEPLOYMENT_CHECKLIST.md

Why this phase matters:
- Reduces legal and operational risk
- Makes the beta launch credible
- Prevents avoidable trust damage

## Phase 12: Zero-AI / Offline Mode
Purpose: provide a bare-minimum utility mode that costs nothing in server compute and works completely locally/offline.

- [x] Architect a "Zero-AI Toggle" in settings to disable all LLM features globally
- [x] Implement Emergency ICE Profile (QR code generator) for offline access
- [x] Implement Local Medication Reminders using native device APIs (Capacitor/Web)
- [x] Implement One-Click Doctor Packet for client-side PDF generation

Why this phase matters:
- Gives users full privacy control
- Drastically reduces server costs by offloading compute to the client
- Makes the app useful even when offline or when AI limits are reached

## Build Order

1. Phase 2: Supabase Core Migration
2. Phase 3: Moat Data Model
3. Phase 4: Clinician-Approved Education
4. Phase 5: Patient Follow-Up Workflows
5. Phase 6: Permissioned Sharing
6. Phase 7: Usage-Aware AI Budgeting
7. Phase 8: Multi-Platform Delivery
8. Phase 9: Production Quality
9. Phase 10: Fundability Surfaces
10. Phase 11: Launch Readiness
11. Phase 12: Zero-AI / Offline Mode

## Current Status

- Phases 1 through 9, Phase 11, and Phase 12 are completely implemented in the codebase.
- The web app is fully functional with Supabase backend, AI timelines, clinician queues, usage-aware budgeting, Zero-AI mode, local reminders, and is now a PWA with Capacitor wrappers for iOS and Android.
- Next up is Phase 10: Fundability Surfaces.

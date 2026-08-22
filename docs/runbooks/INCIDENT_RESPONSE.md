# Incident Response Runbook

This document defines the process for responding to production incidents in Esillio OS, according to the Google SRE Production Readiness Review (PRR) model.

## 1. Incident Classification

| Severity | Definition | Target Response Time | Example |
| :--- | :--- | :--- | :--- |
| **SEV-1** | Critical production failure. Data loss, complete outage, or active security breach. | < 15 minutes | Auth bypass, DB cluster down. |
| **SEV-2** | Major feature broken for many users. No workaround. | < 30 minutes | File uploads failing for all users. |
| **SEV-3** | Minor feature broken or performance degraded. Workaround exists. | < 4 hours | Timeline taking > 5s to load. |
| **SEV-4** | Non-critical bug or internal tooling issue. | Next business day | Admin dashboard typo. |

## 2. Roles and Responsibilities

During a SEV-1 or SEV-2 incident, the following roles must be explicitly assigned:

*   **Incident Commander (IC):** Drives the incident to resolution. Responsible for communication, coordination, and making final decisions. Does *not* write code or execute commands.
*   **Operations Lead (Ops):** Executes the technical mitigation and investigation. Can be multiple people.
*   **Communications Lead (Comms):** Manages external communication to users and stakeholders.

## 3. Incident Lifecycle

### Phase 1: Detection and Triage
1. Acknowledge the alert or report.
2. Determine the severity based on the classification matrix.
3. If SEV-1 or SEV-2, page the on-call engineer and declare an incident in the designated Slack channel (`#incidents-esillio`).

### Phase 2: Containment and Mitigation
*Goal: Stop the bleeding. Do not worry about root cause yet if a quick mitigation exists.*
1. **Rollback:** If the incident started immediately after a deployment, rollback is the default action. Use the GitHub Actions rollback workflow.
2. **Feature Flags:** If the issue is tied to a new feature behind a flag, disable the flag.
3. **Failover:** If a specific region or dependency is failing, attempt to route traffic away or failover to a replica.
4. **Isolate:** If a security breach is suspected, isolate the affected resources (e.g., revoke API keys, isolate network).

### Phase 3: Investigation and Root Cause Analysis
1. Check monitoring dashboards (Latency, Traffic, Errors, Saturation).
2. Review application and system logs for anomalies.
3. Check recent configuration or infrastructure changes.
4. Consult relevant service-specific runbooks (e.g., `docs/runbooks/database-failover.md`).

### Phase 4: Resolution and Recovery
1. Implement the fix or long-term mitigation.
2. Verify the system is healthy across all critical user journeys.
3. Monitor closely for at least 30 minutes post-recovery.
4. Declare the incident resolved and notify stakeholders.

### Phase 5: Post-Mortem
1. A blameless post-mortem must be written for all SEV-1 and SEV-2 incidents within 48 hours.
2. The post-mortem must identify the root cause, timeline of events, and actionable steps to prevent recurrence.
3. Action items must be added to the engineering backlog with high priority.

## 4. Emergency Contacts & Escalation

*   **Primary On-Call:** [Link to PagerDuty/Opsgenie schedule]
*   **Secondary On-Call:** [Link to PagerDuty/Opsgenie schedule]
*   **Engineering Manager:** [Contact Info]
*   **Security Lead:** [Contact Info]

## 5. Useful Commands and Links

*   **Rollback Deployment:** `[Link to CI/CD Rollback Job]`
*   **Production Dashboards:** `[Link to Grafana/Datadog]`
*   **Log Search:** `[Link to Log Aggregator (e.g., Kibana, Splunk)]`
*   **Database Admin Console:** `[Link to DB console]` (Requires break-glass access)

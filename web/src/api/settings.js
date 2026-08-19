import client from "./client";

// ── User: current AI settings (BYOK status) ──────────────────────────────
export async function getAISettings() {
    const response = await client.get("/settings/ai");
    return response.data;
}

// ── User: save BYOK key ───────────────────────────────────────────────────
export async function saveAISettings(data) {
    const response = await client.post("/settings/ai", data);
    return response.data;
}

// ── User: remove BYOK key (revert to managed) ────────────────────────────
export async function deleteBYOKKey() {
    const response = await client.delete("/settings/ai/byok");
    return response.data;
}

// ── User: test the active provider ───────────────────────────────────────
export async function testAIConnection() {
    const response = await client.post("/settings/ai/test");
    return response.data;
}

// ── User: current usage (credits used, remaining, cost) ──────────────────
export async function getUsage() {
    const response = await client.get("/usage/current");
    return response.data;
}

// ── Admin: list all system keys in pool ──────────────────────────────────
export async function listAdminKeys() {
    const response = await client.get("/settings/ai/keys");
    return response.data;
}

// ── Admin: add a new key to pool ─────────────────────────────────────────
export async function addAdminKey(data) {
    const response = await client.post("/settings/ai/keys", data);
    return response.data;
}

// ── Admin: deactivate a specific key ─────────────────────────────────────
export async function deactivateAdminKey(keyId) {
    const response = await client.delete(`/settings/ai/keys/${keyId}`);
    return response.data;
}
// <reference lib="deno.unstable" />
import { createClient } from "npm:@supabase/supabase-js@2.39.5";
/* -------------------------------------------------
   Configuration & helpers
   ------------------------------------------------- */ const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NOTION_CLIENT_ID, NOTION_CLIENT_SECRET, DEBUG } = Deno.env.toObject();
function requiredEnv(name) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required env var ${name}`);
  return value;
}
function logDebug(...args) {
  if (DEBUG === "true") console.debug("[DEBUG]", ...args);
}
function jsonError(status, message, meta) {
  if (meta) console.error("[ERROR]", message, meta);
  else console.error("[ERROR]", message);
  return new Response(JSON.stringify({
    error: message
  }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}
class NotionApiError extends Error {
  details;
  constructor(details){
    super("Notion API error");
    this.details = details;
  }
}
class SupabaseUpsertError extends Error {
  details;
  constructor(details){
    super("Supabase upsert error");
    this.details = details;
  }
}
function notionBasicAuth() {
  const id = requiredEnv("NOTION_CLIENT_ID");
  const secret = requiredEnv("NOTION_CLIENT_SECRET");
  return `Basic ${btoa(`${id}:${secret}`)}`;
}
const supabase = createClient(requiredEnv("SUPABASE_URL"), requiredEnv("SUPABASE_SERVICE_ROLE_KEY"));
console.info("🚀 Notion callback function initialized");
Deno.serve(async (req)=>{
  // -----------------------------------------------------------------
  // 1️⃣ Parse query parameters – fail fast
  // -----------------------------------------------------------------
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // optional CSRF token
  if (!code) return jsonError(400, "`code` query param is required");
  // -----------------------------------------------------------------
  // 2️⃣ Exchange auth code for Notion access + refresh token
  // -----------------------------------------------------------------
  const notionAbort = new AbortController();
  const NOTION_TIMEOUT_MS = 10_000;
  const timeoutId = setTimeout(()=>notionAbort.abort(), NOTION_TIMEOUT_MS);
  let tokenData;
  try {
    const tokenRes = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      signal: notionAbort.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: notionBasicAuth()
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: `https://oucuwnsrjwrrydnszkuy.supabase.co/functions/v1/notion-callback`,
        ...state ? {
          state
        } : {}
      })
    });
    clearTimeout(timeoutId);
    const payload = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new NotionApiError({
        status: tokenRes.status,
        body: payload
      });
    }
    if (!payload.access_token) {
      throw new NotionApiError({
        missing: "access_token",
        payload
      });
    }
    tokenData = payload;
    logDebug("✅ Notion token retrieved", {
      workspace_id: payload.workspace_id
    });
  } catch (e) {
    if (e instanceof NotionApiError) {
      return jsonError(502, "Failed to obtain Notion token – see logs for details", e.details);
    }
    if (e.name === "AbortError") {
      return jsonError(504, "Notion token request timed out");
    }
    return jsonError(500, "Unexpected error while fetching Notion token", e);
  }
  // -----------------------------------------------------------------
  // 3️⃣ Persist the token (access + refresh) in Supabase – fire‑and‑forget
  // -----------------------------------------------------------------
  const { access_token, refresh_token, expires_in, workspace_id, workspace_name } = tokenData;
  // Compute an absolute expiry timestamp if `expires_in` is present
  const expires_at = expires_in ? new Date(Date.now() + expires_in * 1000) : null;
  const upsertPromise = supabase.from("appuser").upsert({
    workID: workspace_id,
    notion_access_token: access_token,
    notion_refresh_token: refresh_token,
    notion_access_expires_at: expires_at,
    notion_workspace_name: workspace_name
  }, {
    onConflict: "workID"
  }).then(({ error })=>{
    if (error) throw new SupabaseUpsertError(error);
    logDebug("✅ Token stored for workspace", workspace_id);
  }).catch((e)=>{
    if (e instanceof SupabaseUpsertError) {
      console.error("Supabase upsert failed:", e.details);
    } else {
      console.error("Unexpected DB error:", e);
    }
  });
  EdgeRuntime.waitUntil(upsertPromise);
  // -----------------------------------------------------------------
  // 4️⃣ Redirect back to the front‑end
  // -----------------------------------------------------------------
  const redirectTarget = "https://notepack.vercel.app/";
  return Response.redirect(redirectTarget, 302);
});

// functions/api/sync/push.ts — Cloudflare Pages Function: Push Local Deltas to D1
import { Env, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  try {
    const body: {
      userId?: string;
      familyId?: string;
      profileId?: string;
      app?: string;
      deltas?: Array<{
        domain: string;
        version: number;
        payload: Record<string, any>;
        clientUpdatedAt: number;
      }>;
    } = await request.json();

    const familyId = body.familyId || 'fam_default';
    const profileId = body.profileId || body.userId || 'prof_tudor';
    const app = body.app || 'miorita';
    const deltas = body.deltas || [];
    const now = Date.now();

    const db = env.MIORITA_DB || env.CLAWEY_DB;

    if (!db) {
      // Mock success for local dev / environments without D1 binding
      return jsonResponse({
        success: true,
        syncedDomains: deltas.map((d) => d.domain),
        serverTimestamp: now,
      });
    }

    // Ensure multi-tenant table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS profile_sync_deltas (
        id TEXT PRIMARY KEY,
        family_id TEXT NOT NULL,
        profile_id TEXT NOT NULL,
        app TEXT NOT NULL,
        domain TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        payload_json TEXT NOT NULL,
        client_updated_at INTEGER NOT NULL,
        server_updated_at INTEGER NOT NULL,
        UNIQUE(family_id, profile_id, app, domain)
      );
    `);

    const syncedDomains: string[] = [];

    for (const delta of deltas) {
      const payloadJson = JSON.stringify(delta.payload);
      await db
        .prepare(`
          INSERT INTO profile_sync_deltas (id, family_id, profile_id, app, domain, version, payload_json, client_updated_at, server_updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(family_id, profile_id, app, domain) DO UPDATE SET
            version = CASE WHEN excluded.version > profile_sync_deltas.version THEN excluded.version ELSE profile_sync_deltas.version + 1 END,
            payload_json = excluded.payload_json,
            client_updated_at = excluded.client_updated_at,
            server_updated_at = excluded.server_updated_at
        `)
        .bind(
          crypto.randomUUID(),
          familyId,
          profileId,
          app,
          delta.domain,
          delta.version,
          payloadJson,
          delta.clientUpdatedAt || now,
          now
        )
        .run();

      syncedDomains.push(delta.domain);
    }

    return jsonResponse({
      success: true,
      syncedDomains,
      serverTimestamp: now,
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Sync push failed' }, 500);
  }
}

export async function onRequestOptions(): Promise<Response> {
  return jsonResponse({}, 204);
}

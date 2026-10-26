// functions/api/sync/pull.ts — Cloudflare Pages Function: Pull Remote Deltas from D1
import { Env, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  try {
    const body: {
      userId?: string;
      familyId?: string;
      profileId?: string;
      app?: string;
      domainVersions?: Record<string, number>;
    } = await request.json();

    const familyId = body.familyId || 'fam_default';
    const profileId = body.profileId || body.userId || 'prof_tudor';
    const app = body.app || 'miorita';
    const domainVersions = body.domainVersions || {};
    const now = Date.now();

    const db = env.MIORITA_DB || env.CLAWEY_DB;

    if (!db) {
      // Mock empty delta response for dev environments without D1 binding
      return jsonResponse({
        success: true,
        deltas: [],
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

    const { results } = await db
      .prepare(`
        SELECT domain, version, payload_json, client_updated_at 
        FROM profile_sync_deltas 
        WHERE family_id = ? AND profile_id = ? AND app = ?
      `)
      .bind(familyId, profileId, app)
      .all();

    const deltas: Array<{
      domain: string;
      version: number;
      payload: Record<string, any>;
      clientUpdatedAt: number;
    }> = [];

    if (results) {
      for (const row of results as any[]) {
        const clientVer = domainVersions[row.domain] || 0;
        if (row.version > clientVer) {
          deltas.push({
            domain: row.domain,
            version: row.version,
            payload: JSON.parse(row.payload_json || '{}'),
            clientUpdatedAt: row.client_updated_at,
          });
        }
      }
    }

    return jsonResponse({
      success: true,
      deltas,
      serverTimestamp: now,
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Sync pull failed' }, 500);
  }
}

export async function onRequestOptions(): Promise<Response> {
  return jsonResponse({}, 204);
}

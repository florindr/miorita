// functions/api/auth/profiles.ts — Cloudflare Pages Function: Child Profiles CRUD
import { Env, jsonResponse } from '../_db';

export async function onRequestGet(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const familyId = url.searchParams.get('familyId');

  if (!familyId) {
    return jsonResponse({ success: false, error: 'familyId is required' }, 400);
  }

  const db = env.MIORITA_DB || env.CLAWEY_DB;
  if (!db) {
    return jsonResponse({
      success: true,
      profiles: [{ id: 'prof_tudor', familyId, name: 'Tudor', age: 8, avatar: 'lamb' }],
    });
  }

  try {
    const result = await db
      .prepare('SELECT * FROM child_profiles WHERE family_id = ? ORDER BY created_at ASC')
      .bind(familyId)
      .all<any>();

    return jsonResponse({
      success: true,
      profiles: (result.results || []).map((p) => ({
        id: p.id,
        familyId: p.family_id,
        name: p.name,
        age: p.age,
        avatar: p.avatar,
        dominantLanguage: p.dominant_language,
      })),
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Failed to list profiles' }, 500);
  }
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  try {
    const body: {
      familyId?: string;
      name?: string;
      age?: number;
      avatar?: string;
      dominantLanguage?: string;
    } = await request.json();

    const familyId = body.familyId;
    const name = body.name?.trim();
    const age = body.age || 8;
    const avatar = body.avatar || 'lamb';
    const dominantLanguage = body.dominantLanguage || 'en-GB';

    if (!familyId || !name) {
      return jsonResponse({ success: false, error: 'familyId and name are required' }, 400);
    }

    const db = env.MIORITA_DB || env.CLAWEY_DB;
    const profileId = 'prof_' + crypto.randomUUID().slice(0, 8);
    const now = Date.now();

    if (!db) {
      return jsonResponse({
        success: true,
        profile: { id: profileId, familyId, name, age, avatar, dominantLanguage },
      });
    }

    await db
      .prepare(`
        INSERT INTO child_profiles (id, family_id, name, age, avatar, dominant_language, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(profileId, familyId, name, age, avatar, dominantLanguage, now, now)
      .run();

    return jsonResponse({
      success: true,
      profile: { id: profileId, familyId, name, age, avatar, dominantLanguage },
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Failed to create child profile' }, 500);
  }
}

export async function onRequestDelete(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const profileId = url.searchParams.get('profileId');
  const familyId = url.searchParams.get('familyId');

  if (!profileId || !familyId) {
    return jsonResponse({ success: false, error: 'profileId and familyId required' }, 400);
  }

  const db = env.MIORITA_DB || env.CLAWEY_DB;
  if (!db) {
    return jsonResponse({ success: true, deleted: profileId });
  }

  try {
    await db
      .prepare('DELETE FROM child_profiles WHERE id = ? AND family_id = ?')
      .bind(profileId, familyId)
      .run();

    return jsonResponse({ success: true, deleted: profileId });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Failed to delete profile' }, 500);
  }
}

export async function onRequestOptions(): Promise<Response> {
  return jsonResponse({}, 204);
}

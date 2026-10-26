// functions/api/auth/google.ts — Cloudflare Pages Function: Google Parent Auth & Family Provisioning
import { Env, generateToken, hashSecret, hashToken, jsonResponse, parseJwtPayload } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  try {
    const body: {
      credential?: string;
      demoUser?: { email: string; name: string };
      deviceName?: string;
    } = await request.json();

    let email = '';
    let name = '';
    let googleSub = '';

    if (body.credential) {
      // Decode Google ID Token payload
      const payload = parseJwtPayload(body.credential);
      if (!payload || !payload.sub || !payload.email) {
        return jsonResponse({ success: false, error: 'Invalid Google credential token' }, 400);
      }
      email = payload.email.toLowerCase();
      name = payload.name || payload.given_name || 'Parent';
      googleSub = payload.sub;
    } else if (body.demoUser) {
      // Dev/Demo fallback for testing without Google Cloud OAuth configuration
      email = body.demoUser.email.toLowerCase();
      name = body.demoUser.name || 'Demo Parent';
      googleSub = 'demo-' + email;
    } else {
      return jsonResponse({ success: false, error: 'Missing credential' }, 400);
    }

    const deviceName = body.deviceName || 'Web Client';
    const db = env.MIORITA_DB || env.CLAWEY_DB;

    // Synthetic fallback when running in local vite dev server without Cloudflare D1
    if (!db) {
      const syntheticToken = generateToken();
      const familyId = 'fam_' + googleSub.slice(0, 12);
      const defaultProfile = {
        id: 'prof_tudor',
        familyId,
        name: 'Tudor',
        age: 8,
        avatar: 'lamb',
        dominantLanguage: 'en-GB',
      };

      return jsonResponse({
        success: true,
        token: syntheticToken,
        family: {
          id: familyId,
          email,
          name,
          hasPin: true,
        },
        profiles: [defaultProfile],
        activeProfile: defaultProfile,
      });
    }

    const now = Date.now();

    // 1. Find or create family record
    let family = await db
      .prepare('SELECT * FROM families WHERE google_sub = ? OR parent_email = ? LIMIT 1')
      .bind(googleSub, email)
      .first<any>();

    let familyId = family?.id;

    if (!family) {
      familyId = 'fam_' + crypto.randomUUID().slice(0, 12);
      const defaultPinHash = await hashSecret('1234'); // Default initial parent PIN
      await db
        .prepare(`
          INSERT INTO families (id, google_sub, parent_email, parent_name, parent_pin_hash, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(familyId, googleSub, email, name, defaultPinHash, now, now)
        .run();
    }

    // 2. Query child profiles for this family
    const profilesResult = await db
      .prepare('SELECT * FROM child_profiles WHERE family_id = ? ORDER BY created_at ASC')
      .bind(familyId)
      .all<any>();

    let profiles = profilesResult.results || [];

    // If first time family is created, auto-seed with Tudor (or first child)
    if (profiles.length === 0) {
      const childId = 'prof_' + crypto.randomUUID().slice(0, 8);
      await db
        .prepare(`
          INSERT INTO child_profiles (id, family_id, name, age, avatar, dominant_language, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(childId, familyId, 'Tudor', 8, 'lamb', 'en-GB', now, now)
        .run();

      profiles = [{
        id: childId,
        family_id: familyId,
        name: 'Tudor',
        age: 8,
        avatar: 'lamb',
        dominant_language: 'en-GB',
        created_at: now,
        updated_at: now,
      }];
    }

    const activeProfile = profiles[0];

    // 3. Issue device session token (90 days validity)
    const rawToken = generateToken();
    const tokenHash = await hashToken(rawToken);
    const expiresAt = now + 90 * 24 * 60 * 60 * 1000;

    await db
      .prepare(`
        INSERT INTO device_sessions (id, family_id, active_profile_id, token_hash, device_name, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(crypto.randomUUID(), familyId, activeProfile.id, tokenHash, deviceName, now, expiresAt)
      .run();

    return jsonResponse({
      success: true,
      token: rawToken,
      family: {
        id: familyId,
        email,
        name,
        hasPin: true,
      },
      profiles: profiles.map((p) => ({
        id: p.id,
        familyId: p.family_id,
        name: p.name,
        age: p.age,
        avatar: p.avatar,
        dominantLanguage: p.dominant_language,
      })),
      activeProfile: {
        id: activeProfile.id,
        familyId: activeProfile.family_id,
        name: activeProfile.name,
        age: activeProfile.age,
        avatar: activeProfile.avatar,
        dominantLanguage: activeProfile.dominant_language,
      },
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Google authentication failed' }, 500);
  }
}

export async function onRequestOptions(): Promise<Response> {
  return jsonResponse({}, 204);
}

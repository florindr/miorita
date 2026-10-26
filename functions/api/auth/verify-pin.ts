// functions/api/auth/verify-pin.ts — Cloudflare Pages Function: Parent PIN Verification
import { Env, hashSecret, jsonResponse } from '../_db';

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  try {
    const body: {
      familyId?: string;
      pin?: string;
      newPin?: string;
    } = await request.json();

    const familyId = body.familyId;
    const pin = body.pin?.trim();

    if (!familyId || !pin) {
      return jsonResponse({ success: false, error: 'familyId and pin are required' }, 400);
    }

    const db = env.MIORITA_DB || env.CLAWEY_DB;

    // Offline / Dev fallback
    if (!db) {
      const isDefaultMatch = pin === '1234';
      return jsonResponse({
        success: isDefaultMatch,
        error: isDefaultMatch ? undefined : 'PIN Incorect (Default dev PIN: 1234)',
      }, isDefaultMatch ? 200 : 401);
    }

    const family = await db
      .prepare('SELECT parent_pin_hash FROM families WHERE id = ? LIMIT 1')
      .bind(familyId)
      .first<any>();

    if (!family) {
      return jsonResponse({ success: false, error: 'Family not found' }, 404);
    }

    const inputHash = await hashSecret(pin);
    if (family.parent_pin_hash !== inputHash) {
      return jsonResponse({ success: false, error: 'PIN Incorect' }, 401);
    }

    // If requesting PIN change
    if (body.newPin && body.newPin.length >= 4) {
      const newHash = await hashSecret(body.newPin.trim());
      await db
        .prepare('UPDATE families SET parent_pin_hash = ?, updated_at = ? WHERE id = ?')
        .bind(newHash, Date.now(), familyId)
        .run();
    }

    return jsonResponse({ success: true, verified: true });
  } catch (err: any) {
    return jsonResponse({ success: false, error: err?.message || 'Verification failed' }, 500);
  }
}

export async function onRequestOptions(): Promise<Response> {
  return jsonResponse({}, 204);
}

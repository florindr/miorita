// tests/familyAuth.test.ts — Unit tests for Multi-Child and Family Auth Manager
import test from 'node:test';
import assert from 'node:assert';
import { FamilyAuth, AVATAR_MAP } from '../src/auth/familyAuth';

test('FamilyAuth & Multi-Child Profile Management', async (t) => {
  // Clear any existing localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }

  await t.test('initializes with default Tudor profile under Drăghici family', () => {
    const state = FamilyAuth.init();
    assert.ok(state.family.id);
    assert.strictEqual(state.profiles.length, 1);
    assert.strictEqual(state.activeProfile.name, 'Tudor');
    assert.strictEqual(state.activeProfile.avatar, 'lamb');
    assert.strictEqual(state.isParentUnlocked, false);
  });

  await t.test('provides avatar mappings for Romanian folk mascots', () => {
    assert.strictEqual(AVATAR_MAP.lamb.icon, '🐑');
    assert.strictEqual(AVATAR_MAP.rooster.icon, '🐓');
    assert.strictEqual(AVATAR_MAP.wolf.icon, '🐺');
    assert.strictEqual(AVATAR_MAP.bear.icon, '🐻');
    assert.strictEqual(AVATAR_MAP.owl.icon, '🦉');
  });

  await t.test('unlocks parent mode with default PIN and allows relocking', async () => {
    const failed = await FamilyAuth.unlockParentWithPin('9999');
    assert.strictEqual(failed.success, false);
    assert.strictEqual(FamilyAuth.isParentUnlocked(), false);

    const ok = await FamilyAuth.unlockParentWithPin('1234');
    assert.strictEqual(ok.success, true);
    assert.strictEqual(FamilyAuth.isParentUnlocked(), true);

    FamilyAuth.lockParent();
    assert.strictEqual(FamilyAuth.isParentUnlocked(), false);
  });

  await t.test('supports adding sibling child profile and switching active profile', async () => {
    const newChild = await FamilyAuth.addChildProfile('Maria', 6, 'owl');
    assert.ok(newChild);
    assert.strictEqual(newChild?.name, 'Maria');
    assert.strictEqual(newChild?.age, 6);
    assert.strictEqual(newChild?.avatar, 'owl');

    const profiles = FamilyAuth.getProfiles();
    assert.strictEqual(profiles.length, 2);

    FamilyAuth.setActiveProfile(newChild!.id);
    assert.strictEqual(FamilyAuth.getActiveProfile().name, 'Maria');

    // Switch back to Tudor
    FamilyAuth.setActiveProfile(profiles[0].id);
    assert.strictEqual(FamilyAuth.getActiveProfile().name, 'Tudor');
  });
});

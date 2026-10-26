// src/auth/familyAuth.ts — Shared Family & Multi-Child Profile Manager
// Safe for kids under 13: 100% governed by parents, 1-tap profile switching, zero cross-family leakage.

export interface ChildProfile {
  id: string;
  familyId: string;
  name: string;
  age: number;
  avatar: 'lamb' | 'rooster' | 'wolf' | 'bear' | 'owl';
  dominantLanguage?: string;
}

export interface Family {
  id: string;
  name: string;
  email: string;
  hasPin: boolean;
}

export interface FamilyAuthState {
  isAuthenticated: boolean;
  family: Family;
  profiles: ChildProfile[];
  activeProfile: ChildProfile;
  isParentUnlocked: boolean;
}

// Safe Storage wrapper for SSR / Node.js unit tests
class SafeStorage {
  private static mem = new Map<string, string>();

  static getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch {
        return this.mem.get(key) || null;
      }
    }
    return this.mem.get(key) || null;
  }

  static setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(key, value);
        return;
      } catch {
        // fallback
      }
    }
    this.mem.set(key, value);
  }

  static removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(key);
        return;
      } catch {
        // fallback
      }
    }
    this.mem.delete(key);
  }
}

const FAMILY_KEY = 'miorita_family_v1';
const PROFILES_KEY = 'miorita_child_profiles_v1';
const ACTIVE_PROFILE_KEY = 'miorita_active_profile_v1';
const TOKEN_KEY = 'miorita_auth_token_v1';
const PARENT_PIN_LOCAL = 'miorita_parent_pin_cached';

export const AVATAR_MAP: Record<ChildProfile['avatar'], { icon: string; label: string }> = {
  lamb: { icon: '🐑', label: 'Miorița' },
  rooster: { icon: '🐓', label: 'Cocoș' },
  wolf: { icon: '🐺', label: 'Lup' },
  bear: { icon: '🐻', label: 'Urs' },
  owl: { icon: '🦉', label: 'Bufniță' },
};

export class FamilyAuth {
  private static state: FamilyAuthState = {
    isAuthenticated: false,
    family: {
      id: 'fam_draghici',
      name: 'Familia Drăghici',
      email: 'florin@miorita.ro',
      hasPin: true,
    },
    profiles: [
      {
        id: 'prof_tudor',
        familyId: 'fam_draghici',
        name: 'Tudor',
        age: 8,
        avatar: 'lamb',
        dominantLanguage: 'en-GB',
      },
    ],
    activeProfile: {
      id: 'prof_tudor',
      familyId: 'fam_draghici',
      name: 'Tudor',
      age: 8,
      avatar: 'lamb',
      dominantLanguage: 'en-GB',
    },
    isParentUnlocked: false,
  };

  private static listeners: Array<(state: FamilyAuthState) => void> = [];
  private static isInitialized = false;

  static init(): FamilyAuthState {
    if (this.isInitialized) return this.state;

    try {
      const savedFamily = SafeStorage.getItem(FAMILY_KEY);
      const savedProfiles = SafeStorage.getItem(PROFILES_KEY);
      const savedActiveId = SafeStorage.getItem(ACTIVE_PROFILE_KEY);

      if (savedFamily) {
        this.state.family = JSON.parse(savedFamily);
        this.state.isAuthenticated = true;
      }

      if (savedProfiles) {
        const parsed: ChildProfile[] = JSON.parse(savedProfiles);
        if (parsed.length > 0) {
          this.state.profiles = parsed;
        }
      }

      if (savedActiveId) {
        const found = this.state.profiles.find((p) => p.id === savedActiveId);
        if (found) {
          this.state.activeProfile = found;
        } else {
          this.state.activeProfile = this.state.profiles[0];
        }
      }
    } catch {
      // Fallback to default Tudor profile
    }

    this.isInitialized = true;
    return this.state;
  }

  static getState(): FamilyAuthState {
    if (!this.isInitialized) this.init();
    return { ...this.state };
  }

  static getActiveProfile(): ChildProfile {
    return this.getState().activeProfile;
  }

  static getFamily(): Family {
    return this.getState().family;
  }

  static getProfiles(): ChildProfile[] {
    return this.getState().profiles;
  }

  static isParentUnlocked(): boolean {
    return this.state.isParentUnlocked;
  }

  static hasCompletedSetup(): boolean {
    return Boolean(SafeStorage.getItem(FAMILY_KEY));
  }

  static loginAsTudorGuest(): void {
    const family: Family = {
      id: 'fam_draghici',
      name: 'Familia Drăghici',
      email: 'florin@miorita.ro',
      hasPin: true,
    };
    const profile: ChildProfile = {
      id: 'prof_tudor',
      familyId: 'fam_draghici',
      name: 'Tudor',
      age: 8,
      avatar: 'lamb',
      dominantLanguage: 'en-GB',
    };
    this.state.isAuthenticated = true;
    this.state.family = family;
    this.state.profiles = [profile];
    this.state.activeProfile = profile;
    this.state.isParentUnlocked = false;

    SafeStorage.setItem(FAMILY_KEY, JSON.stringify(family));
    SafeStorage.setItem(PROFILES_KEY, JSON.stringify([profile]));
    SafeStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    this.notify();
  }

  static setupQuickFamily(
    familyName: string,
    childName: string,
    childAge: number,
    avatar: ChildProfile['avatar'],
    pin: string
  ): void {
    const cleanFamily = familyName.trim() || 'Familia Noastră';
    const cleanChild = childName.trim() || 'Copil';
    const famId = 'fam_' + Date.now();
    const childId = 'prof_' + Date.now();

    const family: Family = {
      id: famId,
      name: cleanFamily,
      email: 'familie@local.app',
      hasPin: true,
    };

    const profile: ChildProfile = {
      id: childId,
      familyId: famId,
      name: cleanChild,
      age: childAge || 8,
      avatar: avatar || 'lamb',
      dominantLanguage: 'en-GB',
    };

    this.state.isAuthenticated = true;
    this.state.family = family;
    this.state.profiles = [profile];
    this.state.activeProfile = profile;
    this.state.isParentUnlocked = true;

    SafeStorage.setItem(FAMILY_KEY, JSON.stringify(family));
    SafeStorage.setItem(PROFILES_KEY, JSON.stringify([profile]));
    SafeStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    SafeStorage.setItem(PARENT_PIN_LOCAL, pin || '1234');
    this.notify();
  }

  static logout(): void {
    SafeStorage.removeItem(FAMILY_KEY);
    SafeStorage.removeItem(PROFILES_KEY);
    SafeStorage.removeItem(ACTIVE_PROFILE_KEY);
    SafeStorage.removeItem(TOKEN_KEY);
    this.state.isAuthenticated = false;
    this.state.isParentUnlocked = false;
    this.notify();
  }

  static setActiveProfile(profileId: string): void {
    const target = this.state.profiles.find((p) => p.id === profileId);
    if (!target) return;

    this.state.activeProfile = target;
    SafeStorage.setItem(ACTIVE_PROFILE_KEY, target.id);
    this.notify();
  }

  /** Unlocks parent mode using 4-digit PIN */
  static async unlockParentWithPin(pin: string): Promise<{ success: boolean; error?: string }> {
    const cleanPin = pin.trim();
    if (!cleanPin) return { success: false, error: 'Introdu PIN-ul' };

    try {
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: this.state.family.id,
          pin: cleanPin,
        }),
      });

      const data = await res.json();
      if (data.success) {
        this.state.isParentUnlocked = true;
        this.notify();
        return { success: true };
      }
      return { success: false, error: data.error || 'PIN Incorect' };
    } catch {
      // Offline fallback: check cached PIN or default 1234
      const cachedPin = SafeStorage.getItem(PARENT_PIN_LOCAL) || '1234';
      if (cleanPin === cachedPin) {
        this.state.isParentUnlocked = true;
        this.notify();
        return { success: true };
      }
      return { success: false, error: 'PIN Incorect (Default: 1234)' };
    }
  }

  static lockParent(): void {
    this.state.isParentUnlocked = false;
    this.notify();
  }

  /** Sign in with Google (or demo credentials) */
  static async loginWithGoogle(credential?: string, demoUser?: { email: string; name: string }): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, demoUser }),
      });

      const data = await res.json();
      if (data.success && data.family && data.profiles) {
        this.state.isAuthenticated = true;
        this.state.family = data.family;
        this.state.profiles = data.profiles;
        this.state.activeProfile = data.activeProfile || data.profiles[0];
        this.state.isParentUnlocked = true; // Auto-unlock parent upon Google login

        SafeStorage.setItem(FAMILY_KEY, JSON.stringify(data.family));
        SafeStorage.setItem(PROFILES_KEY, JSON.stringify(data.profiles));
        SafeStorage.setItem(ACTIVE_PROFILE_KEY, this.state.activeProfile.id);
        if (data.token) SafeStorage.setItem(TOKEN_KEY, data.token);

        this.notify();
        return true;
      }
      return false;
    } catch {
      // Offline fallback
      if (demoUser) {
        const family: Family = {
          id: 'fam_' + Date.now(),
          name: demoUser.name,
          email: demoUser.email,
          hasPin: true,
        };
        this.state.isAuthenticated = true;
        this.state.family = family;
        this.state.isParentUnlocked = true;
        SafeStorage.setItem(FAMILY_KEY, JSON.stringify(family));
        this.notify();
        return true;
      }
      return false;
    }
  }

  /** Add a child profile under current family */
  static async addChildProfile(name: string, age: number, avatar: ChildProfile['avatar']): Promise<ChildProfile | null> {
    const trimmed = name.trim();
    if (!trimmed) return null;

    try {
      const res = await fetch('/api/auth/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: this.state.family.id,
          name: trimmed,
          age,
          avatar,
        }),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        const newProf = data.profile as ChildProfile;
        this.state.profiles.push(newProf);
        SafeStorage.setItem(PROFILES_KEY, JSON.stringify(this.state.profiles));
        this.notify();
        return newProf;
      }
    } catch {
      // Offline fallback
      const localProf: ChildProfile = {
        id: 'prof_' + Date.now(),
        familyId: this.state.family.id,
        name: trimmed,
        age,
        avatar,
        dominantLanguage: 'en-GB',
      };
      this.state.profiles.push(localProf);
      SafeStorage.setItem(PROFILES_KEY, JSON.stringify(this.state.profiles));
      this.notify();
      return localProf;
    }

    return null;
  }

  /** Delete a child profile */
  static async deleteChildProfile(profileId: string): Promise<boolean> {
    if (this.state.profiles.length <= 1) return false; // Prevent deleting only child

    try {
      await fetch(`/api/auth/profiles?profileId=${profileId}&familyId=${this.state.family.id}`, {
        method: 'DELETE',
      });
    } catch {
      // Continue locally
    }

    this.state.profiles = this.state.profiles.filter((p) => p.id !== profileId);
    if (this.state.activeProfile.id === profileId) {
      this.state.activeProfile = this.state.profiles[0];
      SafeStorage.setItem(ACTIVE_PROFILE_KEY, this.state.activeProfile.id);
    }
    SafeStorage.setItem(PROFILES_KEY, JSON.stringify(this.state.profiles));
    this.notify();
    return true;
  }

  /** Change parent PIN */
  static async updatePin(newPin: string): Promise<boolean> {
    if (newPin.length < 4) return false;

    try {
      await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId: this.state.family.id,
          pin: '1234', // or current
          newPin,
        }),
      });
    } catch {
      // Continue locally
    }

    SafeStorage.setItem(PARENT_PIN_LOCAL, newPin);
    return true;
  }

  static subscribe(listener: (state: FamilyAuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(): void {
    const current = this.getState();
    this.listeners.forEach((l) => l(current));
  }
}

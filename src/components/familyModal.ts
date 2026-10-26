// src/components/familyModal.ts — Family & Child Profile Switcher Modal
import { FamilyAuth, AVATAR_MAP, type ChildProfile } from '../auth/familyAuth';
import { sound } from '../audio/synth';

export class FamilyModal {
  private container: HTMLElement;
  private onClose: () => void;
  private onProfileChanged: (profile: ChildProfile) => void;
  private onLogout?: () => void;
  private activeTab: 'kids' | 'parent' = 'kids';

  constructor(
    container: HTMLElement,
    onClose: () => void,
    onProfileChanged: (profile: ChildProfile) => void,
    onLogout?: () => void
  ) {
    this.container = container;
    this.onClose = onClose;
    this.onProfileChanged = onProfileChanged;
    this.onLogout = onLogout;
  }

  render() {
    const state = FamilyAuth.getState();
    const active = state.activeProfile;

    this.container.innerHTML = `
      <div style="position: fixed; inset: 0; background: rgba(43, 38, 34, 0.65); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;">
        <div style="background: var(--linen-pure); border: 3px solid var(--walnut); border-radius: var(--radius-lg); width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 16px 40px rgba(0,0,0,0.35); display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--walnut-light); padding-bottom: 12px;">
            <div>
              <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gold-bell);">
                🏡 ${state.family.name || 'Familia Ta'}
              </span>
              <h2 style="font-family: var(--font-serif); font-size: 22px; color: var(--walnut); margin: 2px 0 0;">
                Profiluri Copii & Părinte
              </h2>
            </div>
            <button id="btnCloseFamilyModal" style="background: var(--linen-card); border: 2px solid var(--walnut); border-radius: 50%; width: 36px; height: 36px; font-size: 18px; cursor: pointer; color: var(--walnut); font-weight: bold;">✕</button>
          </div>

          <!-- Navigation Tabs -->
          <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--walnut-light); padding-bottom: 8px;">
            <button id="tabKidsBtn" style="flex: 1; padding: 10px; border-radius: 8px; border: 2px solid ${this.activeTab === 'kids' ? 'var(--walnut)' : 'transparent'}; background: ${this.activeTab === 'kids' ? 'var(--walnut)' : 'var(--linen-card)'}; color: ${this.activeTab === 'kids' ? '#FFF' : 'var(--walnut)'}; font-weight: bold; cursor: pointer; font-size: 14px;">
              🧒 Cine se joacă? (${state.profiles.length} ${state.profiles.length === 1 ? 'copil' : 'copii'})
            </button>
            <button id="tabParentBtn" style="flex: 1; padding: 10px; border-radius: 8px; border: 2px solid ${this.activeTab === 'parent' ? 'var(--walnut)' : 'transparent'}; background: ${this.activeTab === 'parent' ? 'var(--walnut)' : 'var(--linen-card)'}; color: ${this.activeTab === 'parent' ? '#FFF' : 'var(--walnut)'}; font-weight: bold; cursor: pointer; font-size: 14px;">
              🛡️ Zona Părinților ${state.isParentUnlocked ? '🔓' : '🔒'}
            </button>
          </div>

          <!-- Tab Content -->
          <div id="tabContentArea">
            ${this.activeTab === 'kids' ? this.renderKidsTab(state, active) : this.renderParentTab(state)}
          </div>

        </div>
      </div>
    `;

    this.bindEvents();
  }

  private renderKidsTab(state: ReturnType<typeof FamilyAuth.getState>, active: ChildProfile): string {
    return `
      <div>
        <p style="font-size: 14px; color: #5C4E43; margin-bottom: 14px;">
          Alege profilul copilului pentru a încărca propriul covor, punctele și repetările zilnice:
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 14px; margin-bottom: 18px;">
          ${state.profiles.map((p) => {
            const isSelected = p.id === active.id;
            const avatarInfo = AVATAR_MAP[p.avatar] || AVATAR_MAP.lamb;
            return `
              <div class="child-profile-card" data-id="${p.id}" style="background: ${isSelected ? 'linear-gradient(135deg, #FFF9EB 0%, #FFF3D6 100%)' : '#FFF'}; border: 2.5px solid ${isSelected ? 'var(--gold-bell)' : 'var(--walnut-light)'}; border-radius: var(--radius-md); padding: 16px; text-align: center; cursor: pointer; box-shadow: ${isSelected ? '0 6px 16px rgba(212, 160, 23, 0.25)' : 'none'}; transition: all 0.2s;">
                <div style="font-size: 42px; margin-bottom: 6px;">
                  ${avatarInfo.icon}
                </div>
                <div style="font-family: var(--font-serif); font-size: 18px; font-weight: bold; color: var(--walnut); margin-bottom: 2px;">
                  ${p.name}
                </div>
                <div style="font-size: 12px; color: #7E6C5F; font-weight: 600;">
                  ${p.age} ani • ${avatarInfo.label}
                </div>
                <div style="margin-top: 10px;">
                  <span style="font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 999px; background: ${isSelected ? 'var(--gold-bell)' : '#EFE8DA'}; color: ${isSelected ? '#FFF' : '#6E5D4F'};">
                    ${isSelected ? '✓ Activ Acum' : 'Selectează'}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="background: var(--linen-card); border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #6E5D4F; display: flex; align-items: center; justify-content: space-between;">
          <span>🔒 Ai mai mulți copii sau vrei să adaugi un profil nou?</span>
          <button id="btnGoToParent" style="background: none; border: none; color: var(--gen-masculin); font-weight: bold; cursor: pointer; text-decoration: underline;">
            Deschide Zona Părinților →
          </button>
        </div>
      </div>
    `;
  }

  private renderParentTab(state: ReturnType<typeof FamilyAuth.getState>): string {
    if (!state.isParentUnlocked) {
      return `
        <div style="background: var(--linen-card); border-radius: var(--radius-md); padding: 24px; text-align: center;">
          <div style="font-size: 36px; margin-bottom: 8px;">🔐</div>
          <h3 style="font-family: var(--font-serif); font-size: 18px; color: var(--walnut); margin-bottom: 6px;">
            Acces Securizat pentru Părinți
          </h3>
          <p style="font-size: 13px; color: #6E5D4F; max-width: 440px; margin: 0 auto 18px; line-height: 1.4;">
            Pentru a proteja setările și Caietul de greșeli, introdu PIN-ul parental din 4 cifre sau conectează-te cu contul Google.
          </p>

          <div style="display: inline-flex; flex-direction: column; align-items: center; gap: 12px;">
            <div style="display: flex; gap: 8px; justify-content: center;">
              <input type="password" id="inputParentPin" maxlength="4" placeholder="••••" style="width: 120px; font-size: 24px; text-align: center; letter-spacing: 8px; padding: 8px 12px; border: 2px solid var(--walnut); border-radius: 8px; background: #FFF;" />
              <button id="btnVerifyPin" style="background: var(--walnut); color: #FFF; border: none; border-radius: 8px; padding: 0 18px; font-weight: bold; font-size: 14px; cursor: pointer;">
                Deblochează
              </button>
            </div>
            <span id="pinErrorMsg" style="font-size: 12px; color: var(--gen-feminin); min-height: 16px;"></span>

            <div style="border-top: 1px dashed var(--walnut-light); width: 100%; max-width: 300px; margin: 10px 0;"></div>

            <!-- Google Sign-In Option for Friends/Parents -->
            <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
              <button id="btnGoogleAuth" style="background: #FFF; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 10px 18px; display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; font-weight: 600; color: #1E293B; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                <span>Conectează contul Google al Părintelui</span>
              </button>
              <span style="font-size: 11px; color: #888;">(Pentru tine și prietenii tăi — creează automat spațiul privat al familiei)</span>

              <button id="btnLogoutFamilyFromLocked" style="background: none; border: none; color: #888; font-size: 12px; cursor: pointer; text-decoration: underline; margin-top: 10px;">
                🚪 Schimbă Familia / Ieși din Cont
              </button>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 18px;">
        <!-- Family Details Card -->
        <div style="background: var(--linen-card); border-radius: var(--radius-md); padding: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-family: var(--font-serif); font-size: 16px; font-weight: bold; color: var(--walnut);">
              ${state.family.name}
            </div>
            <div style="font-size: 12px; color: #6E5D4F;">
              Email părinte: <strong>${state.family.email}</strong> • PIN Parental: <strong>Activat (••••)</strong>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btnLockParent" style="background: #FFF; border: 1.5px solid var(--walnut-light); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: bold; cursor: pointer; color: var(--walnut);">
              🔒 Blochează
            </button>
            <button id="btnLogoutFamily" style="background: #FFF; border: 1.5px solid var(--gen-feminin); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: bold; cursor: pointer; color: var(--gen-feminin);">
              🚪 Schimbă Familia
            </button>
          </div>
        </div>

        <!-- Add Child Profile Section -->
        <div style="background: #FFF; border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 18px;">
          <h3 style="font-family: var(--font-serif); font-size: 16px; color: var(--walnut); margin-bottom: 12px;">
            ➕ Adaugă un Profil de Copil Nou
          </h3>

          <div style="display: grid; grid-template-columns: 2fr 1fr 2fr; gap: 10px; margin-bottom: 12px;">
            <div>
              <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">Numele copilului:</label>
              <input type="text" id="newChildName" placeholder="ex: Maria, Andrei" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--walnut-light); border-radius: 6px; font-size: 14px;" />
            </div>
            <div>
              <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">Vârstă:</label>
              <input type="number" id="newChildAge" value="8" min="4" max="16" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--walnut-light); border-radius: 6px; font-size: 14px;" />
            </div>
            <div>
              <label style="font-size: 12px; font-weight: bold; display: block; margin-bottom: 4px;">Alege Mascota:</label>
              <select id="newChildAvatar" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--walnut-light); border-radius: 6px; font-size: 14px; font-weight: bold;">
                <option value="lamb">🐑 Miorița (Oiță)</option>
                <option value="rooster">🐓 Cocoș de Horezu</option>
                <option value="wolf">🐺 Lup Carpatin</option>
                <option value="bear">🐻 Urs Bun</option>
                <option value="owl">🦉 Bufniță Înțeleaptă</option>
              </select>
            </div>
          </div>

          <div style="text-align: right;">
            <button id="btnSaveChild" style="background: var(--gen-neutru); color: #FFF; border: none; border-radius: 6px; padding: 8px 18px; font-weight: bold; font-size: 14px; cursor: pointer;">
              Salvează Copilul ✓
            </button>
          </div>
        </div>

        <!-- Privacy & COPPA/GDPR Compliance Note -->
        <div style="background: rgba(47, 93, 138, 0.08); border-left: 4px solid var(--gen-masculin); border-radius: 6px; padding: 12px 14px; font-size: 12px; color: #334E68; line-height: 1.45;">
          <strong>🛡️ Protecție & Izolare (GDPR-K / COPPA):</strong> Profilul copilului nu conține date personale de identificare și este guvernat exclusiv din contul tău de părinte. Prietenii tăi care folosesc aplicația au propriile familii izolate și nu pot vedea niciodată copiii sau rezultatele tale.
        </div>
      </div>
    `;
  }

  private bindEvents() {
    this.container.querySelector('#btnCloseFamilyModal')?.addEventListener('click', () => {
      this.close();
    });

    this.container.querySelector('#tabKidsBtn')?.addEventListener('click', () => {
      this.activeTab = 'kids';
      this.render();
    });

    this.container.querySelector('#tabParentBtn')?.addEventListener('click', () => {
      this.activeTab = 'parent';
      this.render();
    });

    this.container.querySelector('#btnGoToParent')?.addEventListener('click', () => {
      this.activeTab = 'parent';
      this.render();
    });

    // Kids tab: Profile switching
    this.container.querySelectorAll('.child-profile-card').forEach((el) => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        if (id) {
          sound.playWoodenTap();
          FamilyAuth.setActiveProfile(id);
          const active = FamilyAuth.getActiveProfile();
          this.onProfileChanged(active);
          this.close();
        }
      });
    });

    // Parent PIN Verification
    const inputPin = this.container.querySelector('#inputParentPin') as HTMLInputElement;
    const btnVerifyPin = this.container.querySelector('#btnVerifyPin') as HTMLButtonElement;
    const pinErrorMsg = this.container.querySelector('#pinErrorMsg') as HTMLSpanElement;

    const doVerifyPin = async () => {
      if (!inputPin) return;
      const res = await FamilyAuth.unlockParentWithPin(inputPin.value);
      if (res.success) {
        sound.playBrassBell();
        this.render();
      } else {
        if (pinErrorMsg) pinErrorMsg.textContent = res.error || 'PIN Incorect';
        inputPin.value = '';
        inputPin.focus();
      }
    };

    btnVerifyPin?.addEventListener('click', doVerifyPin);
    inputPin?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') doVerifyPin();
    });

    // Parent Mode: Lock
    this.container.querySelector('#btnLockParent')?.addEventListener('click', () => {
      sound.playWoodenTap();
      FamilyAuth.lockParent();
      this.render();
    });

    // Parent Mode: Add Child
    this.container.querySelector('#btnSaveChild')?.addEventListener('click', async () => {
      const nameInput = this.container.querySelector('#newChildName') as HTMLInputElement;
      const ageInput = this.container.querySelector('#newChildAge') as HTMLInputElement;
      const avatarSelect = this.container.querySelector('#newChildAvatar') as HTMLSelectElement;

      if (!nameInput?.value) return;

      const created = await FamilyAuth.addChildProfile(
        nameInput.value,
        parseInt(ageInput.value || '8', 10),
        (avatarSelect.value || 'lamb') as any
      );

      if (created) {
        sound.playBrassBell();
        alert(`Profilul pentru ${created.name} a fost creat cu succes!`);
        this.render();
      }
    });

    // Google Sign-In Demo/Simulation button
    this.container.querySelector('#btnGoogleAuth')?.addEventListener('click', async () => {
      const demoEmail = prompt('Introdu adresa de email (Google) a părintelui:', 'prieten@exemplu.ro');
      if (!demoEmail) return;
      const demoName = prompt('Numele tău sau al familiei:', 'Familia ' + demoEmail.split('@')[0]);

      await FamilyAuth.loginWithGoogle(undefined, {
        email: demoEmail,
        name: demoName || 'Părinte',
      });

      sound.playBrassBell();
      alert(`Bine ai venit, ${demoName || demoEmail}! Spațiul familiei tale a fost creat.`);
      this.render();
    });

    // Logout / Switch Family
    const handleLogout = () => {
      if (confirm('Sigur dorești să ieși din cont și să schimbi familia?')) {
        sound.playWoodenTap();
        FamilyAuth.logout();
        this.close();
        if (this.onLogout) {
          this.onLogout();
        }
      }
    };

    this.container.querySelector('#btnLogoutFamily')?.addEventListener('click', handleLogout);
    this.container.querySelector('#btnLogoutFamilyFromLocked')?.addEventListener('click', handleLogout);
  }

  private close() {
    this.container.innerHTML = '';
    this.onClose();
  }
}

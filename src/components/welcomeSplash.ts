// src/components/welcomeSplash.ts — Mioritic Folk Welcome Splash & Family Onboarding
import { FamilyAuth, AVATAR_MAP, type ChildProfile } from '../auth/familyAuth';
import { renderStitchBand } from './stitchBand';
import { sound } from '../audio/synth';

export class WelcomeSplash {
  private container: HTMLElement;
  private onReady: () => void;
  private selectedAvatar: ChildProfile['avatar'] = 'lamb';

  constructor(container: HTMLElement, onReady: () => void) {
    this.container = container;
    this.onReady = onReady;
  }

  render() {
    this.container.innerHTML = `
      <div class="welcome-splash-wrapper" style="min-height: 100vh; background: var(--linen); display: flex; flex-direction: column; justify-content: space-between;">
        
        ${renderStitchBand(28)}

        <div style="max-width: 840px; margin: 30px auto; padding: 0 20px; width: 100%;">
          
          <!-- Hero Header with Mioritic Theme -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 110px; height: 110px; margin: 0 auto 14px; border-radius: 50%; border: 3.5px solid var(--gold-bell); overflow: hidden; box-shadow: 0 8px 24px rgba(212, 160, 23, 0.28); background: #FFF; position: relative;">
              <img src="/art/mascot.jpg" alt="Miorița" style="width: 100%; height: 100%; object-fit: cover; object-position: 25% 15%; display: block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <span style="display: none; font-size: 56px; line-height: 100px;">🐑</span>
            </div>

            <h1 style="font-family: var(--font-serif); font-size: 38px; color: var(--walnut); margin: 0 0 6px; letter-spacing: -0.5px;">
              Miorița
            </h1>
            <p style="font-size: 17px; color: #6E5D4F; margin: 0 0 16px; font-weight: 500;">
              Satul fermecat al vorbelor românești • Pentru copiii din diaspora
            </p>

            <div style="background: var(--linen-pure); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 14px 20px; max-width: 620px; margin: 0 auto; box-shadow: var(--soft-shadow); font-size: 14.5px; color: var(--ink-charcoal); line-height: 1.5;">
              🐑 <em>„Bună! Eu sunt <strong>Miorița</strong>, oița năzdrăvană cu talangă de alamă. Hai să ne plimbăm prin sat, să reparăm capcanele englezești și să țesem cel mai frumos covor românesc!”</em>
            </div>
          </div>

          <!-- Main Onboarding Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 20px; margin-bottom: 24px;">
            
            <!-- Card 1: Google Sign-In for Parents (Clean, Official, Cross-Family Safe) -->
            <div style="background: #FFF; border: 2.5px solid var(--gen-masculin); border-radius: var(--radius-lg); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--card-shadow);">
              <div>
                <span style="font-size: 11px; font-weight: 800; background: rgba(47, 93, 138, 0.12); color: var(--gen-masculin); padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">
                  Recomandat pentru Părinți
                </span>
                <h3 style="font-family: var(--font-serif); font-size: 20px; color: var(--walnut); margin: 10px 0 8px;">
                  🔐 Creează Spațiul Familiei Tale
                </h3>
                <p style="font-size: 13.5px; color: #5C4E43; line-height: 1.45; margin-bottom: 16px;">
                  Conectează-te cu contul tău Google de părinte. Datele copiilor tăi vor fi <strong>100% private și izolate</strong> de ale altor familii (conform GDPR-K). Copilul nu va avea nevoie de parolă pe tabletă.
                </p>
              </div>

              <div>
                <button id="btnGoogleLogin" style="width: 100%; background: #FFF; border: 2px solid #CBD5E1; border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; font-size: 15px; font-weight: 700; color: #1E293B; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: transform 0.15s;">
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  <span>Intră cu Google</span>
                </button>
                <span style="display: block; text-align: center; font-size: 11px; color: #888; margin-top: 6px;">
                  Autentificare sigură • Fără card bancar
                </span>
              </div>
            </div>

            <!-- Card 2: Quick Family Setup in 15 seconds (No account needed) -->
            <div style="background: #FFF; border: 2.5px solid var(--walnut-light); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--card-shadow);">
              <span style="font-size: 11px; font-weight: 800; background: var(--linen-dark); color: var(--walnut); padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">
                Configurare Rapidă
              </span>
              <h3 style="font-family: var(--font-serif); font-size: 20px; color: var(--walnut); margin: 10px 0 12px;">
                🏡 Configurează Copilul Acum
              </h3>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div>
                  <label style="font-size: 12px; font-weight: 700; color: var(--walnut); display: block; margin-bottom: 2px;">Familia ta:</label>
                  <input type="text" id="splashFamilyName" placeholder="ex: Familia Popescu" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--walnut-light); border-radius: 6px; font-size: 13.5px;" />
                </div>

                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                  <div>
                    <label style="font-size: 12px; font-weight: 700; color: var(--walnut); display: block; margin-bottom: 2px;">Nume copil:</label>
                    <input type="text" id="splashChildName" placeholder="ex: Matei, Sofia" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--walnut-light); border-radius: 6px; font-size: 13.5px;" />
                  </div>
                  <div>
                    <label style="font-size: 12px; font-weight: 700; color: var(--walnut); display: block; margin-bottom: 2px;">Vârstă:</label>
                    <input type="number" id="splashChildAge" value="8" min="4" max="16" style="width: 100%; padding: 8px 12px; border: 1.5px solid var(--walnut-light); border-radius: 6px; font-size: 13.5px;" />
                  </div>
                </div>

                <div>
                  <label style="font-size: 12px; font-weight: 700; color: var(--walnut); display: block; margin-bottom: 4px;">Alege Mascota Copilului:</label>
                  <div style="display: flex; gap: 6px; justify-content: space-between;" id="avatarSelectorStrip">
                    ${(['lamb', 'rooster', 'wolf', 'bear', 'owl'] as const).map((av) => `
                      <button type="button" class="avatar-opt-btn ${av === this.selectedAvatar ? 'active' : ''}" data-avatar="${av}" style="flex: 1; padding: 6px 2px; border: 2px solid ${av === this.selectedAvatar ? 'var(--gold-bell)' : 'var(--walnut-light)'}; border-radius: 8px; background: ${av === this.selectedAvatar ? 'var(--gold-bell)' : '#FFF'}; font-size: 20px; cursor: pointer;" title="${AVATAR_MAP[av].label}">
                        ${AVATAR_MAP[av].icon}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <button id="btnQuickStart" style="margin-top: 6px; background: var(--gen-neutru); color: #FFF; border: none; border-radius: 8px; padding: 12px; font-weight: bold; font-family: var(--font-serif); font-size: 15px; cursor: pointer; box-shadow: 0 4px 10px rgba(94, 125, 83, 0.25);">
                  Pornește Aventura ➔
                </button>
              </div>
            </div>

          </div>

          <!-- Tudor Guest Quick-Launch (1-Tap for Tudor's Tablet) -->
          <div style="background: linear-gradient(135deg, #FFF9EB 0%, #FFF3D6 100%); border: 2px dashed var(--gold-bell); border-radius: var(--radius-md); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div>
              <span style="font-weight: bold; color: var(--walnut); font-size: 14px;">Ești Tudor pe tableta ta sau vrei doar să testezi demo?</span>
              <p style="font-size: 12.5px; color: #7E6C5F; margin: 2px 0 0;">Intră direct în Satul lui Tudor cu un singur click fără nicio setare.</p>
            </div>
            <button id="btnTudorFast" style="background: var(--gold-bell); color: #FFF; border: none; border-radius: 999px; padding: 10px 20px; font-weight: bold; font-family: var(--font-serif); font-size: 14px; cursor: pointer; box-shadow: 0 3px 10px rgba(212, 160, 23, 0.3);">
              🐑 Sunt Tudor! Hai la Joacă ➔
            </button>
          </div>

        </div>

        ${renderStitchBand(28)}

      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    // Avatar selection buttons
    this.container.querySelectorAll('.avatar-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playWoodenTap();
        const av = btn.getAttribute('data-avatar') as ChildProfile['avatar'];
        if (av) {
          this.selectedAvatar = av;
          this.render();
        }
      });
    });

    // 1-Tap Fast Tudor Entry
    this.container.querySelector('#btnTudorFast')?.addEventListener('click', () => {
      sound.playBrassBell();
      FamilyAuth.loginAsTudorGuest();
      this.onReady();
    });

    // Quick Family Setup
    this.container.querySelector('#btnQuickStart')?.addEventListener('click', () => {
      const familyName = (this.container.querySelector('#splashFamilyName') as HTMLInputElement)?.value;
      const childName = (this.container.querySelector('#splashChildName') as HTMLInputElement)?.value;
      const childAge = parseInt((this.container.querySelector('#splashChildAge') as HTMLInputElement)?.value || '8', 10);

      if (!childName) {
        alert('Te rugăm să introduci prenumele copilului (ex: Matei, Sofia).');
        return;
      }

      sound.playBrassBell();
      FamilyAuth.setupQuickFamily(
        familyName || 'Familia Noastră',
        childName,
        childAge,
        this.selectedAvatar,
        '1234'
      );
      this.onReady();
    });

    // Google Sign-In button
    this.container.querySelector('#btnGoogleLogin')?.addEventListener('click', async () => {
      sound.playWoodenTap();
      const parentEmail = prompt('Introdu adresa de email (Google) a părintelui:', 'prieten@gmail.com');
      if (!parentEmail) return;
      const childName = prompt('Cum îl cheamă pe copil? (ex: Matei, Sofia):', 'Matei') || 'Copil';
      const parentName = prompt('Numele familiei:', 'Familia ' + childName);

      await FamilyAuth.loginWithGoogle(undefined, {
        email: parentEmail,
        name: parentName || 'Familia Noastră',
      });

      if (childName) {
        const created = await FamilyAuth.addChildProfile(childName, 8, this.selectedAvatar);
        if (created) {
          FamilyAuth.setActiveProfile(created.id);
        }
      }

      sound.playBrassBell();
      this.onReady();
    });
  }
}

// src/main.ts — App Orchestrator with Village Navigation, Full Station Suite & Caietul lui Tata
import './styles/main.css';
import { renderStitchBand } from './components/stitchBand';
import { renderVillageMap, type ActiveStation } from './components/villageMap';
import { MioritaHud } from './components/mioritaHud';
import { GradinaCuGenuriStation } from './stations/gradinaCuGenuri';
import { PodulCuiStation } from './stations/podulCui';
import { VanatorulDeEnglezismeStation } from './stations/vanatorulDeEnglezisme';
import { MoaraCuArticoleStation } from './stations/moaraCuArticole';
import { PotecaLuiSaStation } from './stations/potecaLuiSa';
import { FantanaPosesivelorStation } from './stations/fantanaPosesivelor';
import { TargulDeNumereStation } from './stations/targulDeNumere';
import { EcoulDinMunteStation } from './stations/ecoulDinMunte';
import { AtelierulDeCuloriStation } from './stations/atelierulDeCulori';
import { AntrenamentulZileiStation } from './stations/antrenamentulZilei';
import { StanaMioriteiStation } from './stations/stanaMioritei';
import { CaietulLuiTataModal } from './components/caietulLuiTata';
import { sound } from './audio/synth';
import { SyncEngine } from './storage/syncEngine';
import { SyncStatusBadge } from './components/syncStatusBadge';

import { FamilyAuth, AVATAR_MAP } from './auth/familyAuth';
import { FamilyModal } from './components/familyModal';
import { WelcomeSplash } from './components/welcomeSplash';

// Initialize Family and Multi-Child Auth
FamilyAuth.init();

// Start cross-device delta sync engine
SyncEngine.init();

const app = document.querySelector<HTMLDivElement>('#app')!;

function initApp() {
  if (!FamilyAuth.hasCompletedSetup()) {
    document.title = 'Miorița — Satul cuvintelor românești';
    const splash = new WelcomeSplash(app, () => {
      renderGameApp();
    });
    splash.render();
  } else {
    renderGameApp();
  }
}

function renderGameApp() {
  const activeChild = FamilyAuth.getActiveProfile();
  document.title = `Miorița — Pentru ${activeChild.name}`;
  let currentStation: ActiveStation = 'gen';
  let globalScore = parseInt(localStorage.getItem(`miorita_score_${activeChild.id}`) || localStorage.getItem('miorita_score') || '0', 10);

  app.innerHTML = `
    <header class="app-header">
      <div class="brand-wrapper">
        <div class="mascot-avatar" id="mascotAvatar" style="display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative; cursor:pointer;" title="Miorița">
          <img src="/art/mascot.jpg" alt="Miorița" style="width:100%; height:100%; object-fit:cover; object-position: 25% 15%; display:block;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
          <span style="display:none; font-size:30px;">🐑</span>
        </div>
        <div class="brand-text">
          <h1>Miorița</h1>
          <p>Satul cuvintelor românești • <span id="brandChildTarget">Pentru ${activeChild.name}</span></p>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <button id="btnProfileSwitch" style="background: var(--linen-card); border: 2px solid var(--gold-bell); border-radius: var(--radius-md); padding: 7px 14px; font-size: 13px; font-weight: 800; cursor: pointer; color: var(--walnut); display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(212, 160, 23, 0.15);" title="Schimbă profilul copilului sau intră în zona părinților">
          <span id="activeChildAvatar">${AVATAR_MAP[activeChild.avatar]?.icon || '🐑'}</span>
          <span id="activeChildName">${activeChild.name} (${activeChild.age} ani)</span>
          <span style="font-size: 10px; color: var(--gold-bell);">▼</span>
        </button>

        <div id="syncBadgeRoot"></div>

        <button id="btnOpenCaiet" style="background: var(--linen-card); border: 1.5px solid var(--walnut); border-radius: var(--radius-md); padding: 8px 14px; font-size: 13px; font-weight: 700; cursor: pointer; color: var(--walnut); display: flex; align-items: center; gap: 6px;">
          📓 <span>Caietul lui Tata</span>
      </button>

      <div class="score-badge">
        <span class="bell-icon">🔔</span>
        <span>Puncte: <span id="scoreDisplay">${globalScore}</span></span>
      </div>
    </div>
  </header>

  ${renderStitchBand(24)}

  <main class="app-main">
    <!-- Village Navigation Hub -->
    <div id="navRoot"></div>

    <!-- Miorița Socratic Mascot HUD (ADHD-friendly with focus mode) -->
    <div id="hudRoot"></div>

    <!-- Active Station Mount Point -->
    <div id="stationRoot"></div>
  </main>

  <div id="modalRoot"></div>

  ${renderStitchBand(24)}
`;

const scoreDisplay = document.querySelector<HTMLSpanElement>('#scoreDisplay')!;
const hudRoot = document.querySelector<HTMLDivElement>('#hudRoot')!;
const stationRoot = document.querySelector<HTMLDivElement>('#stationRoot')!;
const navRoot = document.querySelector<HTMLDivElement>('#navRoot')!;
const modalRoot = document.querySelector<HTMLDivElement>('#modalRoot')!;
const btnOpenCaiet = document.querySelector<HTMLButtonElement>('#btnOpenCaiet')!;
const mascotAvatar = document.querySelector<HTMLDivElement>('#mascotAvatar')!;
const syncBadgeRoot = document.querySelector<HTMLDivElement>('#syncBadgeRoot')!;
const btnProfileSwitch = document.querySelector<HTMLButtonElement>('#btnProfileSwitch')!;
const activeChildAvatar = document.querySelector<HTMLSpanElement>('#activeChildAvatar')!;
const activeChildName = document.querySelector<HTMLSpanElement>('#activeChildName')!;
const brandChildTarget = document.querySelector<HTMLSpanElement>('#brandChildTarget')!;

// Initialize Sync Status Badge
const syncBadge = new SyncStatusBadge();
syncBadgeRoot.appendChild(syncBadge.getElement());

// Initialize Socratic Mascot HUD
const hud = new MioritaHud({
  initialPrompt: `Bună, ${activeChild.name}! Eu sunt <strong>Miorița</strong>. Alege un loc din sat și hai să ne jucăm cu vorbele românești!`
});
hudRoot.appendChild(hud.getElement());

mascotAvatar.addEventListener('click', () => {
  hud.celebrate();
});

function updateScore(points: number) {
  globalScore = points;
  const child = FamilyAuth.getActiveProfile();
  localStorage.setItem(`miorita_score_${child.id}`, globalScore.toString());
  scoreDisplay.textContent = globalScore.toString();
}

function refreshActiveChildUI() {
  const child = FamilyAuth.getActiveProfile();
  document.title = `Miorița — Pentru ${child.name}`;
  globalScore = parseInt(localStorage.getItem(`miorita_score_${child.id}`) || '0', 10);
  scoreDisplay.textContent = globalScore.toString();
  if (activeChildAvatar) activeChildAvatar.textContent = AVATAR_MAP[child.avatar]?.icon || '🐑';
  if (activeChildName) activeChildName.textContent = `${child.name} (${child.age} ani)`;
  if (brandChildTarget) brandChildTarget.textContent = `Pentru ${child.name}`;
  hud.say(`Bine ai venit, <strong>${child.name}</strong>! Satul Mioriței te așteaptă!`);
  loadStation(currentStation);
}

// Profile Switcher Modal
btnProfileSwitch.addEventListener('click', () => {
  sound.playWoodenTap();
  const famModal = new FamilyModal(
    modalRoot,
    () => {},
    (_newProfile) => {
      refreshActiveChildUI();
    },
    () => {
      initApp();
    }
  );
  famModal.render();
});

// Open Caietul lui Tata Modal (Protected by Parent Mode PIN)
btnOpenCaiet.addEventListener('click', () => {
  sound.playWoodenTap();
  if (!FamilyAuth.isParentUnlocked()) {
    // Open Family Modal on Parent Tab to verify PIN first
    const famModal = new FamilyModal(
      modalRoot,
      () => {},
      () => {},
      () => {
        initApp();
      }
    );
    (famModal as any).activeTab = 'parent';
    famModal.render();
  } else {
    const modal = new CaietulLuiTataModal(modalRoot, () => {});
    modal.render();
  }
});

function loadStation(station: ActiveStation) {
  currentStation = station;
  sound.playWoodenTap();
  renderVillageMap(currentStation, loadStation, navRoot);

  if (station === 'quest') {
    hud.say(
      'Suntem la <strong>Antrenamentul Zilei</strong>! 5 capcane alese special pentru tine în 3 minute!',
      'A 3-minute quick session focusing on recent errors and spaced repetition.'
    );
    const questStation = new AntrenamentulZileiStation(
      (state) => {
        hud.say(state.prompt);
        updateScore(globalScore + state.score);
      },
      () => {
        loadStation('map');
      }
    );
    questStation.render(stationRoot);
  } else if (station === 'gen') {
    hud.say(
      'Suntem în <strong>Grădina cu Genuri</strong>! Trage cuvântul în coșul lui (Masculin, Feminin sau Neutru).',
      'English nouns do not have gender (a house, a dog). Romanian nouns are masculine, feminine, or neuter!'
    );
    const genStation = new GradinaCuGenuriStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    genStation.render(stationRoot);
  } else if (station === 'cas') {
    hud.say(
      'Suntem la <strong>Podul „A cui? Cui?”</strong>! Reparăm capcanele englezești (cum ar fi „casa la bunica”).',
      'English says "grandma\'s house". In Romanian we change the ending to -ii: casa bunicii (never casa la bunica)!'
    );
    const casStation = new PodulCuiStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    casStation.render(stationRoot);
  } else if (station === 'clq') {
    hud.say(
      'Suntem la <strong>Vânătorul de Englezisme</strong>! Vânăm expresii traduse mot-à-mot (cum ar fi „sunt 8 ani”).',
      'English says "I am 8 years old" and "makes sense". Romanian says "Am 8 ani" and "are sens"!'
    );
    const clqStation = new VanatorulDeEnglezismeStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    clqStation.render(stationRoot);
  } else if (station === 'art') {
    hud.say(
      'Suntem la <strong>Moara cu Articole</strong>! Măcinăm substantivele și învățăm când punem articolul hotărât.',
      'English says "the dog". Romanian attaches "-le" to the end: câinele!'
    );
    const artStation = new MoaraCuArticoleStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    artStation.render(stationRoot);
  } else if (station === 'sub') {
    hud.say(
      'Suntem pe <strong>Poteca lui Să</strong>! Sărim pe pietrele magice cu puntea «SĂ».',
      'English uses "to" (want to go). Romanian requires "SĂ": vreau SĂ merg!'
    );
    const subStation = new PotecaLuiSaStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    subStation.render(stationRoot);
  } else if (station === 'pos') {
    hud.say(
      'Suntem la <strong>Fântâna cu Al-A-Ai-Ale</strong>! Scoatem apă cu găleata care se potrivește cu substantivul.',
      'In Romanian the possessive article matches the noun gender: un prieten AL meu, o carte A mea!'
    );
    const posStation = new FantanaPosesivelorStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    posStation.render(stationRoot);
  } else if (station === 'num') {
    hud.say(
      'Suntem la <strong>Târgul de Numere</strong>! Cântărim produsele și punem greutatea «DE» de la 20 în sus.',
      'English says "20 apples". Romanian requires "DE" from 20 onwards: douăzeci DE mere!'
    );
    const numStation = new TargulDeNumereStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    numStation.render(stationRoot);
  } else if (station === 'cli') {
    hud.say(
      'Suntem la <strong>Ecoul din Munte</strong>! Muntele repetă persoana cu „L-”, „-o” sau „Îl” și adaugă «pe».',
      'English says "I saw John". Romanian doubles specific people: L-am văzut pe Ion!'
    );
    const cliStation = new EcoulDinMunteStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    cliStation.render(stationRoot);
  } else if (station === 'agr') {
    hud.say(
      'Suntem la <strong>Atelierul de Culori</strong>! Potrivim haina culorilor și așezăm substantivul înaintea culorii.',
      'English adjectives never change (red car, red cars). Romanian adjectives agree in gender and number, and come after the noun (mașina roșie)!'
    );
    const agrStation = new AtelierulDeCuloriStation((state) => {
      hud.say(state.prompt);
      updateScore(state.score);
    });
    agrStation.render(stationRoot);
  } else if (station === 'stana') {
    hud.say(
      'Iată <strong>Covorul tău românesc</strong>! Fiecare exercițiu rezolvat adaugă fire și modele de lăvicer.'
    );
    const stana = new StanaMioriteiStation(globalScore);
    stana.render(stationRoot);
  } else if (station === 'map') {
    renderMapOverview();
  }
}

function renderMapOverview() {
  hud.say('Privire de ansamblu peste <strong>Satul Mioriței</strong>! Alege unde vrei să te antrenezi azi.');
  stationRoot.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
      <div class="station-card" style="grid-column: 1 / -1; background: linear-gradient(135deg, #FFFDF8 0%, #FFF5E0 100%); border: 2.5px solid var(--gold-bell); cursor: pointer; box-shadow: 0 6px 18px rgba(212, 160, 23, 0.18);" onclick="window.dispatchNav('quest')">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="flex: 1; min-width: 260px;">
            <span style="font-size: 11px; font-weight: 800; background: var(--gold-bell); color: #FFF; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px;">Zilnic • 3 Minute</span>
            <h3 style="font-family: var(--font-serif); font-size: 24px; color: var(--walnut); margin: 6px 0 4px;">⚡ Antrenamentul Zilei</h3>
            <p style="font-size: 14px; color: #6C5B4F; line-height: 1.4;">5 capcane selectate din Caietul lui Tata și algoritmul SRS pentru ochiuri de aur pe covor!</p>
          </div>
          <button style="background: var(--gold-bell); color: #FFF; border: none; border-radius: 999px; padding: 12px 24px; font-weight: bold; font-family: var(--font-serif); font-size: 15px; cursor: pointer; box-shadow: var(--soft-shadow);">
            Începe Sesiunea →
          </button>
        </div>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('gen')">
        <div class="station-overview-thumb">
          <img src="/art/stations/gradina_genuri.jpg" alt="Grădina cu Genuri" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--gen-feminin); margin-bottom: 4px;">🧺 Grădina cu Genuri</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Testul un/doi, o/două și un/două pentru substantive.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--gen-feminin); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('cas')">
        <div class="station-overview-thumb">
          <img src="/art/stations/podul_cui.jpg" alt="Podul A cui? Cui?" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--walnut); margin-bottom: 4px;">🪵 Podul „A cui? Cui?”</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Genitivul: „casa bunicii”, nu „casa la bunica”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--walnut); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('clq')">
        <div class="station-overview-thumb">
          <img src="/art/stations/vanatorul_englezisme.jpg" alt="Vânătorul de Englezisme" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--gen-masculin); margin-bottom: 4px;">🦅 Vânătorul de Englezisme</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Scapă de traducerile mot-à-mot: „am 8 ani”, „are sens”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--gen-masculin); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('art')">
        <div class="station-overview-thumb">
          <img src="/art/stations/moara_articole.jpg" alt="Moara cu Articole" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--gold-bell); margin-bottom: 4px;">🌾 Moara cu Articole</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Articolul hotărât: „câinele” și capcana „pe masă”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--gold-bell); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('sub')">
        <div class="station-overview-thumb">
          <img src="/art/stations/poteca_sa.jpg" alt="Poteca lui Să" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--gen-neutru); margin-bottom: 4px;">🪨 Poteca lui Să</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Puntea conjunctivului: „vreau să merg”, „pot să ajut”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--gen-neutru); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('pos')">
        <div class="station-overview-thumb">
          <img src="/art/stations/fantana_posesivelor.jpg" alt="Fântâna Posesivelor" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--clay-terracotta); margin-bottom: 4px;">🪣 Fântâna Al-A-Ai-Ale</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Articolul posesiv: „un prieten al meu”, „o carte a mea”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--clay-terracotta); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('num')">
        <div class="station-overview-thumb">
          <img src="/art/stations/targul_numere.jpg" alt="Târgul de Numere" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--walnut-light); margin-bottom: 4px;">⚖️ Târgul de Numere</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Regula numerelor >= 20: „douăzeci de mere”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--walnut-light); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('cli')">
        <div class="station-overview-thumb">
          <img src="/art/stations/ecoul_munte.jpg" alt="Ecoul din Munte" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--gen-masculin); margin-bottom: 4px;">⛰️ Ecoul din Munte</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Dublarea clitică și «pe»: „L-am văzut pe Ion”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--gen-masculin); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('agr')">
        <div class="station-overview-thumb">
          <img src="/art/stations/atelierul_culori.jpg" alt="Atelierul de Culori" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--gen-feminin); margin-bottom: 4px;">🎨 Atelierul de Culori</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Acordul adjectivelor și topica: „mașina roșie”.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--gen-feminin); margin-top: 8px; display: inline-block;">Pornește →</span>
      </div>

      <div class="station-card" style="cursor:pointer;" onclick="window.dispatchNav('stana')">
        <div class="station-overview-thumb">
          <img src="/art/stations/stana_mioritei.jpg" alt="Stâna Mioriței" onerror="this.parentElement.style.display='none';" />
        </div>
        <h3 style="font-family: var(--font-serif); color: var(--gen-neutru); margin-bottom: 4px;">🐑 Stâna Mioriței</h3>
        <p style="font-size: 13px; color: var(--walnut); line-height: 1.4;">Vezi lăvicerul țesut de tine și motivele populare.</p>
        <span style="font-size: 12px; font-weight: bold; color: var(--gen-neutru); margin-top: 8px; display: inline-block;">Vezi covorul →</span>
      </div>
    </div>
  `;
}

  (window as any).dispatchNav = (station: ActiveStation) => {
    loadStation(station);
  };

  // Initial load
  loadStation('gen');
}

// Start application (Welcome Splash or Game App)
initApp();

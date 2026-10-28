// src/main.ts — App Orchestrator with Village Navigation, Full Station Suite & Caietul lui Tata
import './styles/main.css';
import { renderStitchBand } from './components/stitchBand';
import { type ActiveStation } from './components/villageMap';
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
import { TutoreAgenticStation } from './stations/tutoreAgentic';
import { TutorProgressManager } from './storage/tutorProgress';
import { CaietulLuiTataModal } from './components/caietulLuiTata';
import { CasaGramaticiiModal } from './components/casaGramaticii';
import { RomaniaMap } from './components/romaniaMap';
import { SidebarNav } from './components/sidebarNav';
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
  let currentStation: ActiveStation = 'tutore_agentic';
  let globalScore = parseInt(localStorage.getItem(`miorita_score_${activeChild.id}`) || localStorage.getItem('miorita_score') || '0', 10);

  app.innerHTML = `
    <header class="app-header">
      <div class="brand-wrapper">
        <button id="btnHeaderMenu" class="mobile-menu-btn" style="background: var(--linen-card); border: 2px solid var(--walnut-light); border-radius: var(--radius-sm); padding: 8px 10px; cursor: pointer; font-size: 18px; color: var(--walnut); display: none;" title="Meniu Ateliere">
          ☰
        </button>
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
        <div id="syncBadgeRoot"></div>

        <div class="score-badge">
          <span class="bell-icon">🔔</span>
          <span>Ochiuri: <span id="scoreDisplay">${globalScore}</span></span>
        </div>

        <button id="btnProfileSwitch" style="background: var(--linen-card); border: 1.5px solid var(--walnut-light); border-radius: 999px; padding: 6px 14px; font-size: 13px; font-weight: 800; cursor: pointer; color: var(--walnut); display: flex; align-items: center; gap: 6px;" title="Schimbă profilul copilului sau intră în zona părinților">
          <span id="activeChildAvatar">${AVATAR_MAP[activeChild.avatar]?.icon || '🐑'}</span>
          <span id="activeChildName">${activeChild.name} (${activeChild.age} ani)</span>
          <span style="font-size: 10px; color: var(--walnut);">▼</span>
        </button>
      </div>
  </header>

  ${renderStitchBand(24)}

  <!-- Minimalist Layout: Left Sidebar + Calm Main Stage -->
  <div class="miorita-app-layout">
    <div id="sidebarRoot"></div>

    <main class="miorita-stage-area">
      <!-- Miorița Socratic Mascot HUD (shown only inside individual mini-games) -->
      <div id="hudRoot"></div>

      <!-- Active View Mount Point -->
      <div id="stationRoot"></div>
    </main>
  </div>

  <div id="modalRoot"></div>

  ${renderStitchBand(24)}
`;

const scoreDisplay = document.querySelector<HTMLSpanElement>('#scoreDisplay')!;
const hudRoot = document.querySelector<HTMLDivElement>('#hudRoot')!;
const stationRoot = document.querySelector<HTMLDivElement>('#stationRoot')!;
const sidebarRoot = document.querySelector<HTMLDivElement>('#sidebarRoot')!;
const modalRoot = document.querySelector<HTMLDivElement>('#modalRoot')!;
const btnOpenCaiet = document.querySelector<HTMLButtonElement>('#btnOpenCaiet');
const btnOpenGrammar = document.querySelector<HTMLButtonElement>('#btnOpenGrammar');
const btnHeaderAgenticTutor = document.querySelector<HTMLButtonElement>('#btnHeaderAgenticTutor');
const btnHeaderMenu = document.querySelector<HTMLButtonElement>('#btnHeaderMenu')!;
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
function openCaietulLuiTata() {
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
    const modal = new CaietulLuiTataModal(modalRoot, () => {}, {
      onSelectNugget: () => {
        loadStation('tutore_agentic');
      },
      onOpenFullSyllabus: () => {
        currentStation = 'scoala';
        sidebar.setActiveStation('scoala');
        hudRoot.style.display = 'none';
        openCasaGramaticii(true, 'plan_agentic');
      },
    });
    modal.render();
  }
}

btnOpenCaiet?.addEventListener('click', () => {
  openCaietulLuiTata();
});

// Left Vertical Sidebar Navigation
const sidebar = new SidebarNav(
  sidebarRoot,
  currentStation,
  (station) => {
    loadStation(station);
  },
  () => {
    openCaietulLuiTata();
  }
);
sidebar.render();

btnHeaderMenu?.addEventListener('click', () => {
  sidebar.toggleMobileDrawer();
});

function openCasaGramaticii(inline = true, topic: 'substantiv' | 'plan_agentic' = 'substantiv') {
  const targetContainer = inline ? stationRoot : modalRoot;
  const grammarHub = new CasaGramaticiiModal(
    targetContainer,
    () => {},
    (targetStationKey) => {
      loadStation(targetStationKey as ActiveStation);
    },
    {
      inlineMode: inline,
      initialTopic: topic,
      onStartAgenticLesson: (lessonNumber) => {
        loadStation('tutore_agentic', lessonNumber);
      },
    }
  );
  grammarHub.render();
}

btnOpenGrammar?.addEventListener('click', () => {
  sound.playWoodenTap();
  loadStation('scoala');
});

btnHeaderAgenticTutor?.addEventListener('click', () => {
  sound.playBrassBell();
  loadStation('tutore_agentic');
});

function refreshHeaderCampfireAndScore() {
  const fireEl = document.querySelector('#headerCampfireCount');
  if (fireEl) {
    fireEl.textContent = `${TutorProgressManager.getState().presence.sessionsThisWeek}/2`;
  }
  const stitches = parseInt(localStorage.getItem('miorita_stitches') || String(globalScore), 10);
  if (stitches > globalScore) {
    updateScore(stitches);
  }
}

function loadStation(station: ActiveStation, lessonNumber?: number) {
  currentStation = station;
  sound.playWoodenTap();
  sidebar.setActiveStation(currentStation);
  refreshHeaderCampfireAndScore();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Hide the top MioritaHud banner on self-contained views (Învățăm, Cartea Culorilor, Hartă, Covor, Antrenament Rapid)
  hudRoot.style.display =
    station === 'tutore_agentic' ||
    station === 'scoala' ||
    station === 'map' ||
    station === 'stana' ||
    station === 'quest'
      ? 'none'
      : 'block';

  if (station === 'map') {
    renderMapOverview();
  } else if (station === 'tutore_agentic') {
    new TutoreAgenticStation(
      stationRoot,
      hud,
      () => {
        refreshHeaderCampfireAndScore();
        loadStation('map');
      },
      () => {
        refreshHeaderCampfireAndScore();
      },
      {
        lessonNumber,
        onOpenYearPlan: () => {
          loadStation('scoala');
        },
      }
    );
  } else if (station === 'scoala') {
    openCasaGramaticii(true, 'substantiv');
    return;
  } else if (station === 'quest') {
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
  hud.say(
    'Iată <strong>Harta României Mioritice</strong>! Atinge orice loc din poveste pentru a descoperi atelierul lui.',
    'Explore the interactive storybook map of Romania to choose your learning quest!'
  );
  const romaniaMap = new RomaniaMap(stationRoot, (targetStation) => {
    loadStation(targetStation);
  });
  romaniaMap.render();
}

  (window as any).dispatchNav = (station: ActiveStation) => {
    loadStation(station);
  };

  // Initial load directly on the Minimalist Nugget Card (Învățăm cu Miorița)
  loadStation('tutore_agentic');
}

// Start application (Welcome Splash or Game App)
initApp();

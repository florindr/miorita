// src/components/romaniaMap.ts — Full-Screen Interactive Illustrated Storybook Map of Romania
// Features whimsical folk stations matching the gouache picture book style for 8-year-old Tudor.

import { sound } from '../audio/synth';
import { type ActiveStation } from './villageMap';
import { AdaptiveEngine, TIER_METAS } from '../storage/adaptiveEngine';
import { FamilyAuth } from '../auth/familyAuth';

export interface MapStationPin {
  id: ActiveStation;
  title: string;
  subtitle: string;
  folkTag: string;
  icon: string;
  x: string; // percentage string, e.g. '34%'
  y: string; // percentage string, e.g. '16%'
  color: string;
  domain?: string;
}

export const ROMANIA_MAP_PINS: MapStationPin[] = [
  {
    id: 'tutore_agentic',
    title: 'Călătoria cu Miorița (10 Min)',
    subtitle: 'Sesiunea ta zilnică de poveste, voce și ateliere vizuale (Planul de 1 An)',
    folkTag: 'Inima Carpaților',
    icon: '🐑✨',
    x: '47%',
    y: '45%',
    color: 'var(--gold-bell)',
  },
  {
    id: 'stana',
    title: 'Stâna Mioriței',
    subtitle: 'Covorul de lăvicer țesut cu punctele tale',
    folkTag: 'Plaiul Carpaților',
    icon: '🐑',
    x: '34%',
    y: '15%',
    color: 'var(--gen-neutru)',
  },
  {
    id: 'scoala',
    title: 'Casa Gramaticii (Școala)',
    subtitle: 'Cei 5 Meșteri ai Vorbirii și Detectorul de Cuvinte',
    folkTag: 'Vatra Satului',
    icon: '🏫',
    x: '56.5%',
    y: '16.5%',
    color: 'var(--walnut)',
  },
  {
    id: 'cas',
    title: 'Podul „A cui? Cui?”',
    subtitle: 'Genitivul românesc: „casa bunicii”, nu „casa la bunica”',
    folkTag: 'Pârâul Iute',
    icon: '🪵',
    x: '58%',
    y: '31%',
    color: 'var(--walnut)',
    domain: 'cui',
  },
  {
    id: 'art',
    title: 'Moara cu Articole',
    subtitle: 'Articolul hotărât (-ul, -a, -le) și capcanele prepozițiilor',
    folkTag: 'Valea Morii',
    icon: '🌾',
    x: '70.5%',
    y: '35%',
    color: 'var(--gold-bell)',
    domain: 'articole',
  },
  {
    id: 'cli',
    title: 'Ecoul din Munte',
    subtitle: 'Dublarea clitică și prepoziția „pe”: „L-am văzut pe Ion”',
    folkTag: 'Vârful Ecou',
    icon: '⛰️',
    x: '27%',
    y: '34%',
    color: 'var(--gen-masculin)',
  },
  {
    id: 'gen',
    title: 'Grădina cu Genuri',
    subtitle: 'Testul un/doi, o/două și un/două pentru fructe și flori',
    folkTag: 'Livadă Mândră',
    icon: '🧺',
    x: '64%',
    y: '58%',
    color: 'var(--gen-feminin)',
    domain: 'genuri',
  },
  {
    id: 'sub',
    title: 'Poteca lui Să',
    subtitle: 'Puntea conjunctivului: „vreau să merg”, „pot să ajut”',
    folkTag: 'Pasul de Munte',
    icon: '🪨',
    x: '42%',
    y: '61%',
    color: 'var(--gen-neutru)',
    domain: 'subjunctiv',
  },
  {
    id: 'clq',
    title: 'Vânătorul de Englezisme',
    subtitle: 'Vânăm expresii traduse mot-à-mot: „am 8 ani”, „are sens”',
    folkTag: 'Piscul Vulturilor',
    icon: '🦅',
    x: '23%',
    y: '64%',
    color: 'var(--gen-masculin)',
    domain: 'englezisme',
  },
  {
    id: 'pos',
    title: 'Fântâna Posesivelor',
    subtitle: 'Articolul posesiv: „un prieten al meu”, „o carte a mea”',
    folkTag: 'Câmpia Fântânii',
    icon: '🪣',
    x: '53%',
    y: '68%',
    color: 'var(--clay-terracotta)',
  },
  {
    id: 'num',
    title: 'Târgul de Numere',
    subtitle: 'Regula de la 20 în sus cu „DE”: „douăzeci de mere”',
    folkTag: 'Târgul Mare',
    icon: '⚖️',
    x: '61%',
    y: '77%',
    color: 'var(--walnut-light)',
    domain: 'numere',
  },
  {
    id: 'agr',
    title: 'Atelierul de Culori',
    subtitle: 'Acordul adjectivelor și topica: substantivul înaintea culorii',
    folkTag: 'Boieria de Lut',
    icon: '🎨',
    x: '35%',
    y: '83%',
    color: 'var(--gen-feminin)',
  },
];

export class RomaniaMap {
  private container: HTMLElement;
  private onSelectStation: (station: ActiveStation) => void;
  private selectedPinId: ActiveStation | null = null;
  private viewMode: 'map' | 'cards' = 'map';

  constructor(
    container: HTMLElement,
    onSelectStation: (station: ActiveStation) => void
  ) {
    this.container = container;
    this.onSelectStation = onSelectStation;
  }

  render(): void {
    const activeChild = FamilyAuth.getActiveProfile();

    this.container.innerHTML = `
      <div class="romania-map-wrapper" style="display: flex; flex-direction: column; gap: 12px; max-width: 980px; margin: 0 auto; animation: floatIn 0.25s ease;">
        
        <!-- Quiet, Minimal Map Header Bar -->
        <div class="map-topbar" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #FFFDF9; border: 1.5px solid var(--linen-dark); border-radius: 16px; padding: 10px 16px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <h2 style="font-family: var(--font-serif); font-size: 19px; color: var(--walnut); margin: 0; display: flex; align-items: center; gap: 8px;">
              <span>🗺️</span> Harta României Mioritice
            </h2>
            <span style="font-size: 12px; color: #7C6A58;">
              · Alege un joc din sat
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="background: var(--linen-pure); border: 1px solid var(--linen-dark); border-radius: 999px; padding: 2px; display: inline-flex;">
              <button id="btnViewMap" class="map-view-toggle ${this.viewMode === 'map' ? 'active' : ''}" style="border: none; background: ${this.viewMode === 'map' ? 'var(--walnut)' : 'transparent'}; color: ${this.viewMode === 'map' ? '#FFF' : 'var(--walnut)'}; border-radius: 999px; padding: 5px 12px; font-weight: 700; font-size: 12px; cursor: pointer;">
                🗺️ Harta
              </button>
              <button id="btnViewCards" class="map-view-toggle ${this.viewMode === 'cards' ? 'active' : ''}" style="border: none; background: ${this.viewMode === 'cards' ? 'var(--walnut)' : 'transparent'}; color: ${this.viewMode === 'cards' ? '#FFF' : 'var(--walnut)'}; border-radius: 999px; padding: 5px 12px; font-weight: 700; font-size: 12px; cursor: pointer;">
                📋 Listă
              </button>
            </div>

            <button id="btnHeroQuest" style="background: var(--linen-card); color: var(--walnut); border: 1.5px solid var(--gold-bell); border-radius: 999px; padding: 6px 14px; font-weight: 800; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;">
              <span>⚡</span> Antrenamentul Zilei (3 min)
            </button>
          </div>
        </div>

        ${
          this.viewMode === 'map'
            ? this.renderInteractiveMapCanvas(activeChild.id)
            : this.renderCardsOverview()
        }

      </div>
    `;

    this.bindEvents();
  }

  private renderInteractiveMapCanvas(profileId: string): string {
    const selectedPin = this.selectedPinId
      ? ROMANIA_MAP_PINS.find((p) => p.id === this.selectedPinId)
      : null;

    let selectedTierBadge = '';
    if (selectedPin && selectedPin.domain) {
      const mastery = AdaptiveEngine.getMastery(profileId, selectedPin.domain);
      const meta = TIER_METAS[mastery.currentLevel];
      selectedTierBadge = `
        <span style="background: #FFF; border: 1.5px solid ${meta.color}; color: ${meta.color}; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800;">
          ${meta.badge} (Serie: ${mastery.streak})
        </span>
      `;
    }

    return `
      <div class="map-stage-container" style="position: relative; width: 100%; border-radius: var(--radius-lg); overflow: hidden; border: 3px solid var(--walnut); box-shadow: 0 14px 34px rgba(43, 38, 34, 0.22); background: #FAF5E9;">
        
        <!-- Storybook Map Image -->
        <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: 720px; overflow: hidden; background: #FAF5E9;">
          <img 
            src="/art/romania_map.jpg" 
            alt="Harta României Mioritice" 
            style="width: 100%; height: 100%; object-fit: contain; object-position: center; display: block; user-select: none; pointer-events: none;"
          />

          <!-- Interactive Hotspot Pins -->
          ${ROMANIA_MAP_PINS.map((pin) => {
            const isSelected = this.selectedPinId === pin.id;
            return `
              <div 
                class="map-pin-hotspot ${isSelected ? 'selected' : ''}" 
                data-station-id="${pin.id}"
                style="position: absolute; left: ${pin.x}; top: ${pin.y}; transform: translate(-50%, -50%); cursor: pointer; z-index: ${isSelected ? 20 : 10}; touch-action: manipulation;"
                title="${pin.title}"
              >
                <!-- Animated Pulse Ring -->
                <div class="pin-pulse-ring" style="border-color: ${pin.color};"></div>

                <!-- Pin Medallion -->
                <div class="pin-medallion ${isSelected ? 'active-pulse' : ''}" style="border-color: ${pin.color};">
                  <span style="font-size: 20px; line-height: 1;">${pin.icon}</span>
                </div>

                <!-- Pin Label Pill -->
                <div class="pin-label-pill" style="border-color: ${pin.color};">
                  <span>${pin.title}</span>
                </div>
              </div>
            `;
          }).join('')}

          <!-- Floating Map Medallion: Antrenamentul Zilei -->
          <div 
            id="mapCompassBadge"
            style="position: absolute; top: 16px; left: 16px; background: rgba(255, 253, 248, 0.94); border: 2.5px solid var(--gold-bell); border-radius: var(--radius-md); padding: 8px 14px; box-shadow: 0 6px 16px rgba(0,0,0,0.18); cursor: pointer; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(4px); z-index: 15; transition: transform 0.15s ease;"
          >
            <span style="font-size: 24px;">🧭</span>
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #8A6500; text-transform: uppercase;">Misiunea de azi</div>
              <div style="font-family: var(--font-serif); font-size: 14px; font-weight: bold; color: var(--walnut);">⚡ Antrenamentul Zilei (3 min)</div>
            </div>
          </div>

        </div>

        <!-- Selected Pin Info Drawer / Floating Sheet -->
        ${
          selectedPin
            ? `
          <div class="map-pin-drawer" style="background: var(--linen-pure); border-top: 2px solid var(--walnut); padding: 16px 22px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; animation: floatIn 0.2s ease;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 38px; background: #FFF; border: 2px solid ${selectedPin.color}; border-radius: var(--radius-md); padding: 6px 12px;">
                ${selectedPin.icon}
              </span>
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <h3 style="font-family: var(--font-serif); font-size: 20px; color: var(--walnut); margin: 0;">
                    ${selectedPin.title}
                  </h3>
                  <span style="background: var(--linen-card); color: #8C5B3F; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 999px; border: 1px dashed var(--walnut-light);">
                    📍 ${selectedPin.folkTag}
                  </span>
                  ${selectedTierBadge}
                </div>
                <p style="font-size: 14px; color: #6C5B4F; margin: 4px 0 0 0;">
                  ${selectedPin.subtitle}
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <button id="btnDeselectPin" style="background: #FFF; border: 1.5px solid var(--walnut-light); border-radius: 999px; padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer; color: var(--walnut);">
                ✕ Închide
              </button>
              <button id="btnEnterStation" class="btn-primary-folk" data-station="${selectedPin.id}" style="background: var(--walnut); color: #FFF; border: none; border-radius: 999px; padding: 12px 24px; font-family: var(--font-serif); font-size: 15px; font-weight: bold; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(43, 38, 34, 0.25);">
                <span>Pornește în atelier</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        `
            : `
          <div style="background: var(--linen-card); border-top: 1px solid var(--linen-dark); padding: 10px 20px; font-size: 13px; color: #6C5B4F; text-align: center;">
            💡 <em>Atinge orice pictogramă de pe hartă pentru a explora atelierul și a porni exercițiile!</em>
          </div>
        `
        }

      </div>
    `;
  }

  private renderCardsOverview(): string {
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; animation: floatIn 0.2s ease;">
        ${ROMANIA_MAP_PINS.map(
          (pin) => `
          <div class="station-card" style="cursor: pointer; border: 2px solid ${pin.color}; transition: all 0.2s ease;" data-card-station="${pin.id}">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span style="font-size: 30px;">${pin.icon}</span>
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 18px; color: var(--walnut); margin: 0;">${pin.title}</h3>
                <span style="font-size: 11px; color: #8C5B3F; font-weight: 600;">📍 ${pin.folkTag}</span>
              </div>
            </div>
            <p style="font-size: 13px; color: #6C5B4F; line-height: 1.4; margin: 0 0 10px 0;">${pin.subtitle}</p>
            <span style="font-size: 12px; font-weight: bold; color: ${pin.color}; display: inline-flex; align-items: center; gap: 4px;">
              Deschide atelierul ➔
            </span>
          </div>
        `
        ).join('')}
      </div>
    `;
  }

  private bindEvents(): void {
    // View mode toggle
    const btnMap = this.container.querySelector('#btnViewMap');
    const btnCards = this.container.querySelector('#btnViewCards');

    btnMap?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.viewMode = 'map';
      this.render();
    });

    btnCards?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.viewMode = 'cards';
      this.render();
    });

    // Hero quest button
    const btnHeroQuest = this.container.querySelector('#btnHeroQuest');
    btnHeroQuest?.addEventListener('click', () => {
      sound.playBrassBell();
      this.onSelectStation('quest');
    });

    // Primary 10-Min Agentic Tutor Hero button
    const btnLaunchTutor = this.container.querySelector('#btnLaunchAgenticTutor');
    btnLaunchTutor?.addEventListener('click', () => {
      sound.playBrassBell();
      this.onSelectStation('tutore_agentic');
    });

    // Compass badge on map
    const mapCompass = this.container.querySelector('#mapCompassBadge');
    mapCompass?.addEventListener('click', () => {
      sound.playBrassBell();
      this.onSelectStation('quest');
    });

    // Hotspot pins on map
    const pins = this.container.querySelectorAll('.map-pin-hotspot');
    pins.forEach((pinEl) => {
      pinEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const stationId = pinEl.getAttribute('data-station-id') as ActiveStation;
        if (this.selectedPinId === stationId) {
          // Double click / tap enters station immediately
          sound.playBrassBell();
          this.onSelectStation(stationId);
        } else {
          sound.playWoodenTap();
          this.selectedPinId = stationId;
          this.render();
        }
      });
    });

    // Deselect pin
    const btnDeselect = this.container.querySelector('#btnDeselectPin');
    btnDeselect?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.selectedPinId = null;
      this.render();
    });

    // Enter station button from drawer
    const btnEnter = this.container.querySelector('#btnEnterStation');
    btnEnter?.addEventListener('click', () => {
      const station = btnEnter.getAttribute('data-station') as ActiveStation;
      sound.playBrassBell();
      this.onSelectStation(station);
    });

    // Cards click
    const cards = this.container.querySelectorAll('[data-card-station]');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const station = card.getAttribute('data-card-station') as ActiveStation;
        sound.playBrassBell();
        this.onSelectStation(station);
      });
    });
  }
}

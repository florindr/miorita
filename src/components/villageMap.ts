// src/components/villageMap.ts — Satul Mioriței Navigation Hub
// Renders the rustic village map locations for Tudor to pick his quest station.

export type ActiveStation = 'map' | 'tutore_agentic' | 'quest' | 'scoala' | 'gen' | 'cas' | 'clq' | 'art' | 'sub' | 'pos' | 'num' | 'cli' | 'agr' | 'stana';

export function renderVillageMap(activeStation: ActiveStation, onSelect: (station: ActiveStation) => void, container: HTMLElement) {
  container.innerHTML = `
    <nav class="village-nav" style="display: flex; gap: 8px; overflow-x: auto; padding: 4px 0 16px; scrollbar-width: none;">
      <button class="nav-btn ${activeStation === 'quest' ? 'active' : ''}" data-station="quest" style="background: rgba(212, 160, 23, 0.15); border: 2px solid var(--gold-bell); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: #8A6500;">
        ⚡ Antrenament (3 min)
      </button>
      <button class="nav-btn ${activeStation === 'map' ? 'active' : ''}" data-station="map" style="background: var(--linen-pure); border: 2px solid var(--walnut); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--walnut);">
        🗺️ Harta
      </button>
      <button class="nav-btn ${activeStation === 'scoala' ? 'active' : ''}" data-station="scoala" style="background: rgba(43, 38, 34, 0.08); border: 2px solid var(--walnut); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--walnut);" title="Casa Gramaticii — Învață părțile de vorbire cu Miorița">
        🏫 Școala (Gramatica)
      </button>
      <button class="nav-btn ${activeStation === 'gen' ? 'active' : ''}" data-station="gen" style="background: var(--linen-pure); border: 2px solid var(--gen-feminin); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--gen-feminin);">
        🧺 Genuri
      </button>
      <button class="nav-btn ${activeStation === 'cas' ? 'active' : ''}" data-station="cas" style="background: var(--linen-pure); border: 2px solid var(--walnut); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--walnut);">
        🪵 Podul Cui
      </button>
      <button class="nav-btn ${activeStation === 'clq' ? 'active' : ''}" data-station="clq" style="background: var(--linen-pure); border: 2px solid var(--gen-masculin); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--gen-masculin);">
        🦅 Englezisme
      </button>
      <button class="nav-btn ${activeStation === 'art' ? 'active' : ''}" data-station="art" style="background: var(--linen-pure); border: 2px solid var(--gold-bell); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--walnut);">
        🌾 Articole
      </button>
      <button class="nav-btn ${activeStation === 'sub' ? 'active' : ''}" data-station="sub" style="background: var(--linen-pure); border: 2px solid var(--gen-neutru); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--gen-neutru);">
        🪨 Poteca Să
      </button>
      <button class="nav-btn ${activeStation === 'pos' ? 'active' : ''}" data-station="pos" style="background: var(--linen-pure); border: 2px solid var(--clay-terracotta); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--clay-terracotta);">
        🪣 Al-A-Ai-Ale
      </button>
      <button class="nav-btn ${activeStation === 'num' ? 'active' : ''}" data-station="num" style="background: var(--linen-pure); border: 2px solid var(--walnut-light); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--walnut-light);">
        ⚖️ Numere cu DE
      </button>
      <button class="nav-btn ${activeStation === 'cli' ? 'active' : ''}" data-station="cli" style="background: var(--linen-pure); border: 2px solid var(--gen-masculin); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--gen-masculin);">
        ⛰️ Ecou (Clitic)
      </button>
      <button class="nav-btn ${activeStation === 'agr' ? 'active' : ''}" data-station="agr" style="background: var(--linen-pure); border: 2px solid var(--gen-feminin); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--gen-feminin);">
        🎨 Atelier Culori
      </button>
      <button class="nav-btn ${activeStation === 'stana' ? 'active' : ''}" data-station="stana" style="background: var(--linen-pure); border: 2px solid var(--gen-neutru); border-radius: var(--radius-md); padding: 8px 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: var(--font-serif); font-size: 14px; color: var(--gen-neutru);">
        🐑 Stâna (Covor)
      </button>
    </nav>
  `;

  const buttons = container.querySelectorAll('.nav-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const station = btn.getAttribute('data-station') as ActiveStation;
      onSelect(station);
    });
  });
}

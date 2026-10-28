// src/components/tutorWidgets/widgetTypes.ts — Shared Types & <agent-embed> HTML Exporter
// Traces to: FR-VIS-001..004, Design §3

export type TutorWidgetType =
  | 'WordMorphSlider'
  | 'CalqueZapper'
  | 'BridgeTileSnap'
  | 'RoleReversalDetector'
  | 'GenderBasketMini'
  | 'CheckpointTrailWidget';

export interface WordMorphConfig {
  type: 'WordMorphSlider';
  titleRo: string;
  category: string;
  englishTrapRo: string;       // e.g. "casa la bunica"
  morphedCorrectRo: string;    // e.g. "casa bunicii"
  stemText: string;            // e.g. "casa bunic"
  suffixHighlight: string;     // e.g. "-ii"
  explanationRo: string;       // <= 2 sentences
  bridgeEn: string;
}

export interface CalqueZapperConfig {
  type: 'CalqueZapper';
  titleRo: string;
  category: string;
  calqueBubbleRo: string;      // e.g. "Eu sunt 8 ani și sunt rece!"
  naturalBubbleRo: string;     // e.g. "Eu am 8 ani și mi-e frig!"
  zappedKeywords: Array<{ trap: string; fix: string }>;
  explanationRo: string;
  bridgeEn: string;
}

export interface BridgeTileSnapConfig {
  type: 'BridgeTileSnap';
  titleRo: string;
  category: string;
  leftBankRo: string;          // e.g. "Vreau"
  rightBankRo: string;         // e.g. "construiesc o cetate!"
  correctTile: string;         // e.g. "să"
  distractorTiles: string[];   // e.g. ["la", "de"]
  fullSentenceRo: string;      // e.g. "Vreau să construiesc o cetate!"
  explanationRo: string;
}

export interface RoleReversalConfig {
  type: 'RoleReversalDetector';
  titleRo: string;
  category: string;
  mioritaQuoteWords: string[]; // e.g. ["Miorița", "zice:", "Mingea", "la", "băiat", "este", "în", "poartă!"]
  mistakeWordIndices: number[]; // e.g. [3, 4] ("la băiat")
  mistakePhraseRo: string;     // e.g. "la băiat"
  correctedPhraseRo: string;   // e.g. "băiatului"
  fullCorrectedSentenceRo: string; // e.g. "Mingea băiatului este în poartă!"
  explanationRo: string;
}

export interface GenderBasketMiniItem {
  nounRo: string;
  gender: 'M' | 'F' | 'N';
  countedRo: string;           // e.g. "un tren, două trenuri"
  emoji: string;
}

export interface GenderBasketMiniConfig {
  type: 'GenderBasketMini';
  titleRo: string;
  items: GenderBasketMiniItem[];
}

export interface CheckpointTrailConfig {
  type: 'CheckpointTrailWidget';
  titleRo: string;
  currentSeason: number;
  currentCheckpointId: number;
  completedCheckpoints: number[];
  totalSessionsCompleted: number;
  sessionsThisWeek: number;
  campfireState: 'unlit' | 'glowing' | 'blazing' | 'super_scantei';
  goldenStitchesEarned: number;
  parolaDeCina: string;
}

export type AnyTutorWidgetConfig =
  | WordMorphConfig
  | CalqueZapperConfig
  | BridgeTileSnapConfig
  | RoleReversalConfig
  | GenderBasketMiniConfig
  | CheckpointTrailConfig;

export interface TutorWidgetResult {
  widgetType: TutorWidgetType;
  completed: boolean;
  attempts: number;
  goldenStitches: number;
  spokenOrTappedPhrase?: string;
}

/**
 * Generates a standalone, theme-adaptive (<500px height) HTML document for Antigravity `<agent-embed>`
 * using the allowlisted Tailwind CDN and semantic CSS variables (`FR-VIS-004`).
 */
export function generateAgentEmbedHtml(config: AnyTutorWidgetConfig): string {
  const safeJson = JSON.stringify(config).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.titleRo}</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
</head>
<body class="bg-transparent text-[var(--foreground,#23262F)] antialiased p-3 select-none">
  <div id="agy-widget-root" class="bg-[var(--card,#FBF6EC)] border border-[var(--border,#D9CEB8)] rounded-xl p-4 shadow-sm max-w-xl mx-auto">
    <div class="flex items-center justify-between gap-2 mb-3">
      <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700">
        🐑 Atelierul Mioriței · ${config.type}
      </span>
      <span id="agy-status-pill" class="text-xs font-semibold text-[var(--muted-foreground,#5C5E66)]">
        Atinge pentru a transforma ✨
      </span>
    </div>
    <h3 class="text-base font-bold mb-2">${config.titleRo}</h3>
    <div id="agy-interactive-stage" class="my-3"></div>
  </div>
  <script>
    const CONFIG = ${safeJson};
    const stage = document.getElementById('agy-interactive-stage');
    const statusPill = document.getElementById('agy-status-pill');
    if (CONFIG.type === 'WordMorphSlider') {
      stage.innerHTML = \`
        <div class="p-3 rounded-lg bg-black/5 mb-3 text-center">
          <div id="morph-display" class="text-lg font-bold text-amber-800">\${CONFIG.englishTrapRo}</div>
        </div>
        <button id="morph-btn" class="w-full min-h-[48px] rounded-xl font-bold bg-amber-600 text-white py-2.5 px-4 shadow cursor-pointer">
          ✨ Transformă în românește: \${CONFIG.morphedCorrectRo}
        </button>
      \`;
      document.getElementById('morph-btn').onclick = () => {
        document.getElementById('morph-display').textContent = CONFIG.morphedCorrectRo + ' 🌟';
        statusPill.textContent = '🌟 +2 Ochiuri de Aur!';
      };
    } else {
      stage.innerHTML = \`<div class="text-sm font-medium">\${CONFIG.titleRo}</div>\`;
    }
  </script>
</body>
</html>`;
}


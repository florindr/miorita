// src/motifs/proceduralBanner.ts — On-the-fly Procedural Linocut Folk Banner Generator
// Generates authentic Romanian village linocut SVG illustrations on the fly for any scenario.
// Works 100% offline, zero latency, zero quota, matching the art direction bible.

export type FolkSceneType = 'bridge' | 'garden' | 'mill' | 'hunter' | 'well' | 'mountain' | 'path' | 'market' | 'loom' | 'sheepfold' | 'generic';

interface BannerOptions {
  sceneType?: FolkSceneType;
  title?: string;
  paletteTheme?: 'voronet' | 'iered' | 'sage' | 'ochre' | 'walnut';
}

export function generateProceduralBannerSVG(options: BannerOptions = {}): string {
  const { sceneType = 'generic', paletteTheme = 'walnut' } = options;

  let accentColor = '#B23A2E'; // Ie Red
  let secondaryColor = '#2F5D8A'; // Voroneț Blue
  if (paletteTheme === 'voronet') {
    accentColor = '#2F5D8A';
    secondaryColor = '#6E8B5E';
  } else if (paletteTheme === 'sage') {
    accentColor = '#6E8B5E';
    secondaryColor = '#C8902E';
  } else if (paletteTheme === 'ochre') {
    accentColor = '#C8902E';
    secondaryColor = '#B23A2E';
  }

  // Generate specific station scene elements
  let sceneContent = '';
  switch (sceneType) {
    case 'bridge':
      // Wooden plank bridge crossing river with grandmother cottage
      sceneContent = `
        <!-- River Stream -->
        <path d="M 0 170 Q 250 145 500 180 T 800 160 L 800 220 L 0 220 Z" fill="#D3E2EE" opacity="0.85" />
        <path d="M 40 185 Q 260 170 480 195 T 780 175" stroke="#2F5D8A" stroke-width="1.8" fill="none" stroke-dasharray="8 6" />
        
        <!-- Wooden Bridge -->
        <path d="M 230 180 Q 360 155 490 180 L 490 200 Q 360 175 230 200 Z" fill="#7E5F46" stroke="#2B2622" stroke-width="2.5" />
        <!-- Bridge Planks -->
        ${Array.from({ length: 12 }).map((_, i) => `
          <line x1="${245 + i * 20}" y1="${174 - (i > 3 && i < 9 ? 6 : 0)}" x2="${245 + i * 20}" y2="${194 - (i > 3 && i < 9 ? 6 : 0)}" stroke="#2B2622" stroke-width="2" />
        `).join('')}
        
        <!-- Grandmother Cottage on Right Bank -->
        <g transform="translate(620, 95)">
          <polygon points="10,45 60,5 110,45" fill="#5C402B" stroke="#2B2622" stroke-width="2.5" />
          <rect x="20" y="45" width="80" height="55" fill="#FAF7F2" stroke="#2B2622" stroke-width="2.5" />
          <rect x="48" y="65" width="24" height="35" fill="#7E5F46" stroke="#2B2622" stroke-width="2" />
          <rect x="26" y="55" width="16" height="16" fill="#D3E2EE" stroke="#2B2622" stroke-width="1.5" />
          <rect x="78" y="55" width="16" height="16" fill="#D3E2EE" stroke="#2B2622" stroke-width="1.5" />
          <!-- Cross-stitch frieze under eaves -->
          <line x1="20" y1="48" x2="100" y2="48" stroke="#B23A2E" stroke-width="2" stroke-dasharray="3 3" />
        </g>
      `;
      break;

    case 'garden':
      // Apple orchard with 3 woven baskets
      sceneContent = `
        <!-- Fruit Trees -->
        <g transform="translate(140, 60)">
          <path d="M 50 110 L 50 70 Q 20 40 50 10 Q 80 40 50 70" fill="#5C402B" stroke="#2B2622" stroke-width="3" />
          <circle cx="50" cy="40" r="38" fill="#6E8B5E" stroke="#2B2622" stroke-width="2" />
          <circle cx="36" cy="30" r="6" fill="#B23A2E" />
          <circle cx="62" cy="45" r="6" fill="#B23A2E" />
          <circle cx="48" cy="55" r="6" fill="#B23A2E" />
        </g>
        <g transform="translate(600, 60)">
          <path d="M 50 110 L 50 70 Q 20 40 50 10 Q 80 40 50 70" fill="#5C402B" stroke="#2B2622" stroke-width="3" />
          <circle cx="50" cy="40" r="38" fill="#6E8B5E" stroke="#2B2622" stroke-width="2" />
          <circle cx="40" cy="35" r="6" fill="#C8902E" />
          <circle cx="65" cy="40" r="6" fill="#C8902E" />
        </g>
        <!-- 3 Folk Woven Baskets -->
        <g transform="translate(360, 150)">
          <path d="M 10 20 Q 25 35 40 20 L 36 10 L 14 10 Z" fill="#D8BE9B" stroke="#2B2622" stroke-width="2" />
          <path d="M 18 10 Q 25 0 32 10" fill="none" stroke="#2F5D8A" stroke-width="2.5" />
        </g>
        <g transform="translate(420, 150)">
          <path d="M 10 20 Q 25 35 40 20 L 36 10 L 14 10 Z" fill="#D8BE9B" stroke="#2B2622" stroke-width="2" />
          <path d="M 18 10 Q 25 0 32 10" fill="none" stroke="#B23A2E" stroke-width="2.5" />
        </g>
        <g transform="translate(480, 150)">
          <path d="M 10 20 Q 25 35 40 20 L 36 10 L 14 10 Z" fill="#D8BE9B" stroke="#2B2622" stroke-width="2" />
          <path d="M 18 10 Q 25 0 32 10" fill="none" stroke="#6E8B5E" stroke-width="2.5" />
        </g>
      `;
      break;

    case 'mill':
      // Carpathian water mill
      sceneContent = `
        <g transform="translate(560, 80)">
          <rect x="20" y="40" width="90" height="70" fill="#7E5F46" stroke="#2B2622" stroke-width="2.5" />
          <polygon points="10,40 65,0 120,40" fill="#5C402B" stroke="#2B2622" stroke-width="2.5" />
          <!-- Mill Wheel -->
          <circle cx="125" cy="90" r="28" fill="none" stroke="#5C402B" stroke-width="4" />
          <circle cx="125" cy="90" r="6" fill="#2B2622" />
          <line x1="125" y1="62" x2="125" y2="118" stroke="#2B2622" stroke-width="2" />
          <line x1="97" y1="90" x2="153" y2="90" stroke="#2B2622" stroke-width="2" />
          <line x1="105" y1="70" x2="145" y2="110" stroke="#2B2622" stroke-width="2" />
          <line x1="105" y1="110" x2="145" y2="70" stroke="#2B2622" stroke-width="2" />
          <!-- Water Chute -->
          <path d="M 125 105 Q 160 120 180 160" stroke="#2F5D8A" stroke-width="3" fill="none" />
        </g>
      `;
      break;

    case 'well':
      // Traditional sweep-pole well (cumpănă)
      sceneContent = `
        <g transform="translate(540, 60)">
          <!-- Well Base -->
          <rect x="50" y="80" width="50" height="35" fill="#FAF7F2" stroke="#2B2622" stroke-width="2" rx="4" />
          <line x1="50" y1="92" x2="100" y2="92" stroke="#2B2622" stroke-width="1.5" />
          <!-- Vertical Post Fork -->
          <line x1="20" y1="30" x2="20" y2="115" stroke="#5C402B" stroke-width="5" stroke-linecap="round" />
          <!-- Balancing Beam (Cumpănă) -->
          <line x1="-30" y1="90" x2="80" y2="10" stroke="#5C402B" stroke-width="4" stroke-linecap="round" />
          <!-- Hanging Bucket Rod -->
          <line x1="75" y1="10" x2="75" y2="80" stroke="#2B2622" stroke-width="2" />
          <polygon points="70,80 80,80 78,92 72,92" fill="#7E5F46" stroke="#2B2622" stroke-width="1.5" />
        </g>
      `;
      break;

    case 'mountain':
      // Mountain cliff with echoing soundwaves
      sceneContent = `
        <g transform="translate(480, 50)">
          <!-- Rocky Cliffs -->
          <polygon points="40,140 100,20 160,140" fill="#2F5D8A" opacity="0.3" />
          <polygon points="120,140 180,35 240,140" fill="#2F5D8A" opacity="0.45" />
          <!-- Concentric Soundwaves -->
          <path d="M -80 70 A 40 40 0 0 1 -80 110" fill="none" stroke="#2F5D8A" stroke-width="2" stroke-linecap="round" />
          <path d="M -60 60 A 60 60 0 0 1 -60 120" fill="none" stroke="#2F5D8A" stroke-width="2.5" stroke-linecap="round" />
          <path d="M -40 50 A 80 80 0 0 1 -40 130" fill="none" stroke="#2F5D8A" stroke-width="3" stroke-linecap="round" />
        </g>
      `;
      break;

    default:
      // Calming village backdrop with haystacks and birch trees
      sceneContent = `
        <g transform="translate(620, 110)">
          <!-- Haystack -->
          <ellipse cx="40" cy="40" rx="30" ry="25" fill="#D49B28" stroke="#2B2622" stroke-width="2" />
          <line x1="40" y1="10" x2="40" y2="60" stroke="#5C402B" stroke-width="3" />
        </g>
      `;
      break;
  }

  // Miorița Mascot silhouette in foreground
  const mioritaLamb = `
    <g transform="translate(180, 115) scale(0.75)">
      <!-- Body Wool Cloud -->
      <ellipse cx="60" cy="50" rx="36" ry="26" fill="#FAF7F2" stroke="#2B2622" stroke-width="2.5" />
      <circle cx="36" cy="42" r="14" fill="#FAF7F2" stroke="#2B2622" stroke-width="2" />
      <circle cx="84" cy="42" r="14" fill="#FAF7F2" stroke="#2B2622" stroke-width="2" />
      <circle cx="60" cy="32" r="16" fill="#FAF7F2" stroke="#2B2622" stroke-width="2" />
      
      <!-- Head -->
      <circle cx="102" cy="36" r="16" fill="#FAF7F2" stroke="#2B2622" stroke-width="2.5" />
      <!-- Eyes & Smile -->
      <circle cx="108" cy="32" r="3" fill="#2B2622" />
      <circle cx="109" cy="31" r="1" fill="#FFF" />
      <path d="M 106 40 Q 110 44 114 41" fill="none" stroke="#2B2622" stroke-width="2" stroke-linecap="round" />
      <!-- Small Ear -->
      <path d="M 92 30 Q 82 25 88 36 Z" fill="#2B2622" stroke="#2B2622" stroke-width="1.5" />
      
      <!-- Embroidered Collar with Tiny Brass Bell (Talangă) -->
      <path d="M 94 48 Q 102 52 108 46" stroke="#B23A2E" stroke-width="3" fill="none" stroke-linecap="round" />
      <circle cx="102" cy="53" r="4.5" fill="#D49B28" stroke="#2B2622" stroke-width="1.2" />
      
      <!-- Legs -->
      <rect x="42" y="70" width="7" height="24" rx="3" fill="#2B2622" />
      <rect x="56" y="70" width="7" height="24" rx="3" fill="#2B2622" />
      <rect x="74" y="70" width="7" height="24" rx="3" fill="#2B2622" />
      <rect x="88" y="70" width="7" height="24" rx="3" fill="#2B2622" />
    </g>
  `;

  // Top and bottom authentic folk cross-stitch borders
  const topCrossStitch = Array.from({ length: 40 })
    .map((_, i) => `<path d="M ${i * 20} 8 L ${i * 20 + 8} 16 M ${i * 20 + 8} 8 L ${i * 20} 16" stroke="${i % 3 === 0 ? accentColor : (i % 3 === 1 ? secondaryColor : '#2B2622')}" stroke-width="1.8" />`)
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 240" width="100%" height="100%" style="background:#F4EEE3; display:block;">
      <defs>
        <!-- Linen texture simulation -->
        <pattern id="linenWeave" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#F4EEE3" />
          <line x1="0" y1="0" x2="8" y2="8" stroke="#ECE3D2" stroke-width="0.7" opacity="0.6" />
          <line x1="0" y1="8" x2="8" y2="0" stroke="#ECE3D2" stroke-width="0.7" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#linenWeave)" />

      <!-- Distant Carpathian Hills -->
      <path d="M 0 110 Q 180 60 380 95 T 800 80 L 800 240 L 0 240 Z" fill="#6E8B5E" opacity="0.25" />
      <path d="M 0 135 Q 240 100 520 125 T 800 115 L 800 240 L 0 240 Z" fill="#6E8B5E" opacity="0.4" />
      
      <!-- Foreground Rolling Green Pasture -->
      <path d="M 0 160 Q 320 135 600 155 T 800 150 L 800 240 L 0 240 Z" fill="#6E8B5E" opacity="0.8" />

      <!-- Scene-Specific Content -->
      ${sceneContent}

      <!-- Miorița Mascot -->
      ${mioritaLamb}

      <!-- Folk Cross-Stitch Header Ribbon -->
      <g opacity="0.75">
        ${topCrossStitch}
      </g>
    </svg>
  `.trim();
}

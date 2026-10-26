// src/motifs/motifRenderer.ts — Authentic Romanian Cross-Stitch Pixel Grid & SVG Renderer
// Conforms to Section 4.4 in design.md (FR-REW-001: Motifs as code)

export interface FolkMotif {
  id: string;
  nameRo: string;
  description: string;
  width: number;
  height: number;
  // Character mapping:
  // '.' = empty/transparent linen
  // 'R' = Romanian Folk Red (--ie-red #B23A2E)
  // 'B' = Voroneț Blue (--voronet-blue #2F5D8A)
  // 'K' = Charcoal / Black Stitch (--stitch-black #2B2622)
  // 'Y' = Horezu Ochre (--horezu-ochre #C8902E)
  // 'G' = Sage Green (--sage #6E8B5E)
  grid: string[];
}

export const COLOR_PALETTE: Record<string, string> = {
  R: '#B23A2E', // Folk Red
  B: '#2F5D8A', // Voroneț Blue
  K: '#2B2622', // Charcoal embroidery
  Y: '#C8902E', // Horezu Ochre
  G: '#6E8B5E', // Sage Green
};

export const STARTER_MOTIFS: FolkMotif[] = [
  // 1. Steaua în 8 colțuri (8-point Northern Star)
  {
    id: 'steaua',
    nameRo: 'Steaua în 8 colțuri',
    description: 'Simbol ancestral al călăuzirii și luminii pe cerul nopții.',
    width: 11,
    height: 11,
    grid: [
      '.....K.....',
      '...R.K.R...',
      '..RR.K.RR..',
      '.RRRRKRRRR.',
      '....KKK....',
      'KKKKKKKKKKK',
      '....KKK....',
      '.RRRRKRRRR.',
      '..RR.K.RR..',
      '...R.K.R...',
      '.....K.....',
    ],
  },

  // 2. Coarnele Berbecului (Ram's Horns — strength, pastoral vigilance)
  {
    id: 'coarnele_berbecului',
    nameRo: 'Coarnele Berbecului',
    description: 'Simbol pastoral mioritic al puterii și ocrotirii turmelor.',
    width: 13,
    height: 9,
    grid: [
      '..BBB...BBB..',
      '.B...B.B...B.',
      'B..K..B..K..B',
      'B.KKK...KKK.B',
      '.B.K.....K.B.',
      '..B.......B..',
      '...B.....B...',
      '....B...B....',
      '.....BBB.....',
    ],
  },

  // 3. Pomul Vieții (Tree of Life — growth, nature)
  {
    id: 'pomul_vietii',
    nameRo: 'Pomul Vieții',
    description: 'Creștere armonioasă și legătura dintre pământ și cer.',
    width: 9,
    height: 11,
    grid: [
      '....G....',
      '...GGG...',
      '..G.G.G..',
      '.G..G..G.',
      '....G....',
      '..G.G.G..',
      '.G..G..G.',
      '....G....',
      '...KKK...',
      '....K....',
      '...KKK...',
    ],
  },

  // 4. Rombul Cusut (Diamond Chain — fertility & abundance)
  {
    id: 'romb',
    nameRo: 'Rombul Cusut',
    description: 'Motiv geometric tradițional din cusăturile de pe cămașa cu altiță.',
    width: 9,
    height: 9,
    grid: [
      '....R....',
      '...RYR...',
      '..RYYYR..',
      '.RYYYYYR.',
      'RYYYKYYYR',
      '.RYYYYYR.',
      '..RYYYR..',
      '...RYR...',
      '....R....',
    ],
  },

  // 5. Spicul de Grâu (Wheat Ear — harvest & bounty)
  {
    id: 'spicul',
    nameRo: 'Spicul de Grâu',
    description: 'Simbol al hărniciei și roadelor bogate ale pământului.',
    width: 7,
    height: 11,
    grid: [
      '...Y...',
      '..Y.Y..',
      '.Y..Y..',
      '..Y.Y..',
      '.Y..Y..',
      '..Y.Y..',
      '...Y...',
      '...Y...',
      '...Y...',
      '...Y...',
      '...Y...',
    ],
  },

  // 6. Calea Rătăcită (Wandering Path — border meander)
  {
    id: 'calea_ratacita',
    nameRo: 'Calea Rătăcită',
    description: 'Șir meandric care mărginește lăvicerele și ștergarele tradiționale.',
    width: 12,
    height: 6,
    grid: [
      'KKKK...KKKK.',
      'K..K...K..K.',
      'K..KKKKK..K.',
      'K..K...K..K.',
      'K..K...K..K.',
      '.KKK...KKKK.',
    ],
  },

  // 7. Cocoșul de Horezu (Rooster — awakening & vitality)
  {
    id: 'cocosul',
    nameRo: 'Cocoșul de Horezu',
    description: 'Păstrătorul luminii și simbolul heraldic al ceramicii de Horezu.',
    width: 11,
    height: 11,
    grid: [
      '....RRR....',
      '...R.R.K...',
      '....RRK....',
      '....KKKK...',
      '...KKKKKK..',
      '.BKKKKKKKB.',
      '..BKKKKKB..',
      '...BKKKB...',
      '....K.K....',
      '...KK.KK...',
      '..KK...KK..',
    ],
  },
];

/**
 * Render a FolkMotif as a clean, authentic SVG with cross-stitch "×" stitches
 */
export function renderMotifSVG(motif: FolkMotif, stitchSize = 8): string {
  const svgWidth = motif.width * stitchSize;
  const svgHeight = motif.height * stitchSize;

  let stitchesSvg = '';

  for (let r = 0; r < motif.height; r++) {
    const row = motif.grid[r] || '';
    for (let c = 0; c < motif.width; c++) {
      const char = row[c] || '.';
      const color = COLOR_PALETTE[char];
      if (color) {
        const x = c * stitchSize;
        const y = r * stitchSize;
        const pad = stitchSize * 0.15;
        // Render genuine cross-stitch geometry (two intersecting diagonal lines)
        stitchesSvg += `
          <line x1="${x + pad}" y1="${y + pad}" x2="${x + stitchSize - pad}" y2="${y + stitchSize - pad}" stroke="${color}" stroke-width="${stitchSize * 0.28}" stroke-linecap="square" />
          <line x1="${x + stitchSize - pad}" y1="${y + pad}" x2="${x + pad}" y2="${y + stitchSize - pad}" stroke="${color}" stroke-width="${stitchSize * 0.28}" stroke-linecap="square" />
        `;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" style="display:inline-block; vertical-align:middle;">
      <rect width="100%" height="100%" fill="transparent" />
      ${stitchesSvg}
    </svg>
  `.trim();
}

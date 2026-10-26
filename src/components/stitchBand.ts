// src/components/stitchBand.ts — Folk Cross-Stitch Geometric SVG Border
// Renders the exact red-and-black Romanian embroidery band from miorita_moodboard_linocut.jpg

export function renderStitchBand(height = 28): string {
  // Repeating diamond & 8-pointed star cross-stitch motif (ie traditional pattern)
  return `
    <div class="folk-border-container">
      <svg viewBox="0 0 400 24" width="100%" height="${height}" preserveAspectRatio="repeat" style="display:block;">
        <defs>
          <pattern id="romanianCrossStitch" width="80" height="24" patternUnits="userSpaceOnUse">
            <!-- Central Star / Diamond in Ie Red (#B23A2E) -->
            <path d="M 40 4 L 46 10 L 40 16 L 34 10 Z" fill="#B23A2E" />
            <circle cx="40" cy="10" r="2.5" fill="#FAF7F2" />

            <!-- Charcoal Walnut Crosses (#2B2622) -->
            <path d="M 24 6 L 30 14 M 30 6 L 24 14" stroke="#2B2622" stroke-width="2" stroke-linecap="square" />
            <path d="M 50 6 L 56 14 M 56 6 L 50 14" stroke="#2B2622" stroke-width="2" stroke-linecap="square" />

            <!-- Voroneț Blue Chevrons (#2F5D8A) -->
            <path d="M 10 7 L 16 12 L 10 17" fill="none" stroke="#2F5D8A" stroke-width="2.5" stroke-linecap="square" />
            <path d="M 70 7 L 64 12 L 70 17" fill="none" stroke="#2F5D8A" stroke-width="2.5" stroke-linecap="square" />

            <!-- Boundary running threads -->
            <line x1="0" y1="2" x2="80" y2="2" stroke="#2B2622" stroke-width="1.2" stroke-dasharray="3,3" />
            <line x1="0" y1="22" x2="80" y2="22" stroke="#2B2622" stroke-width="1.2" stroke-dasharray="3,3" />
          </pattern>
        </defs>
        <rect width="100%" height="24" fill="url(#romanianCrossStitch)" />
      </svg>
    </div>
  `;
}

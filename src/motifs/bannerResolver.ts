// src/motifs/bannerResolver.ts — Smart Station Banner Renderer with On-the-fly Procedural Fallback
import { generateProceduralBannerSVG, type FolkSceneType } from './proceduralBanner';

export function getStationBannerHTML(
  stationId: string,
  title: string,
  sceneType: FolkSceneType = 'generic',
  paletteTheme: 'voronet' | 'iered' | 'sage' | 'ochre' | 'walnut' = 'walnut'
): string {
  const proceduralSvg = generateProceduralBannerSVG({ sceneType, title, paletteTheme });
  const encodedSvg = `data:image/svg+xml;utf8,${encodeURIComponent(proceduralSvg)}`;

  return `
    <div class="station-banner" id="banner-${stationId}">
      <img src="/art/stations/${stationId}.jpg" 
           alt="${title}" 
           loading="lazy"
           onerror="this.onerror=null; this.src='${encodedSvg}';" />
    </div>
  `.trim();
}

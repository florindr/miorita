// src/components/sidebarNav.ts — Clean, Streamlined Left Vertical Navigation & Mobile Bar
// Groups primary modes cleanly and tucks the 9 individual practice stations into a collapsible drawer.

import { sound } from '../audio/synth';
import { type ActiveStation } from './villageMap';

export interface SidebarItem {
  id: ActiveStation | 'caiet';
  label: string;
  icon: string;
  badge?: string;
  color?: string;
  group: 'main' | 'ateliere' | 'parent';
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  // Primary Calm Rooms (Top core views)
  { id: 'tutore_agentic', label: 'Învățăm cu Miorița', icon: '🐑', color: 'var(--gold-bell)', group: 'main' },
  { id: 'map', label: 'Harta României', icon: '🗺️', group: 'main' },
  { id: 'scoala', label: 'Cartea Culorilor', icon: '🎨', color: 'var(--walnut)', group: 'main' },
  { id: 'stana', label: 'Covorul Meu', icon: '🧵', group: 'main' },

  // Collapsible Village Mini-Games (9 stations + Quick 3m Review)
  { id: 'quest', label: 'Antrenament Rapid (3m)', icon: '⚡', color: 'var(--gold-bell)', group: 'ateliere' },
  { id: 'gen', label: 'Grădina cu Genuri', icon: '🧺', color: 'var(--gen-feminin)', group: 'ateliere' },
  { id: 'cas', label: 'Podul „A cui? Cui?”', icon: '🪵', group: 'ateliere' },
  { id: 'art', label: 'Moara cu Articole', icon: '🌾', color: 'var(--gold-bell)', group: 'ateliere' },
  { id: 'clq', label: 'Englezisme', icon: '🦅', color: 'var(--gen-masculin)', group: 'ateliere' },
  { id: 'sub', label: 'Poteca lui Să', icon: '🪨', color: 'var(--gen-neutru)', group: 'ateliere' },
  { id: 'pos', label: 'Fântâna Posesivelor', icon: '🪣', color: 'var(--clay-terracotta)', group: 'ateliere' },
  { id: 'num', label: 'Târgul de Numere', icon: '⚖️', color: 'var(--walnut-light)', group: 'ateliere' },
  { id: 'cli', label: 'Ecoul din Munte', icon: '⛰️', color: 'var(--gen-masculin)', group: 'ateliere' },
  { id: 'agr', label: 'Atelierul de Culori', icon: '🎨', color: 'var(--gen-feminin)', group: 'ateliere' },

  // Zona Părinților
  { id: 'caiet', label: 'Caietul lui Tata', icon: '📓', group: 'parent' },
];

export class SidebarNav {
  private container: HTMLElement;
  private activeStation: ActiveStation;
  private onSelectStation: (station: ActiveStation) => void;
  private onOpenCaiet: () => void;
  private isCollapsed = false;
  private isMobileOpen = false;
  private isAteliereExpanded = false;

  constructor(
    container: HTMLElement,
    activeStation: ActiveStation,
    onSelectStation: (station: ActiveStation) => void,
    onOpenCaiet: () => void
  ) {
    this.container = container;
    this.activeStation = activeStation;
    this.onSelectStation = onSelectStation;
    this.onOpenCaiet = onOpenCaiet;

    try {
      this.isCollapsed = localStorage.getItem('miorita_sidebar_collapsed') === 'true';
      this.isAteliereExpanded = localStorage.getItem('miorita_ateliere_expanded') === 'true';
    } catch {
      this.isCollapsed = false;
      this.isAteliereExpanded = false;
    }
  }

  setActiveStation(station: ActiveStation): void {
    this.activeStation = station;
    // Automatically expand the Ateliere drawer if one of the 9 stations is active
    const isAtelier = SIDEBAR_ITEMS.some((i) => i.group === 'ateliere' && i.id === station);
    if (isAtelier) {
      this.isAteliereExpanded = true;
    }
    this.render();
  }

  toggleMobileDrawer(): void {
    this.isMobileOpen = !this.isMobileOpen;
    this.render();
  }

  render(): void {
    const mainItems = SIDEBAR_ITEMS.filter((i) => i.group === 'main');
    const atelierItems = SIDEBAR_ITEMS.filter((i) => i.group === 'ateliere');
    const parentItems = SIDEBAR_ITEMS.filter((i) => i.group === 'parent');
    const activeInAteliere = atelierItems.some((i) => i.id === this.activeStation);
    const showAteliere = this.isAteliereExpanded || activeInAteliere;

    this.container.innerHTML = `
      <!-- Mobile Backdrop for Drawer -->
      <div 
        id="sidebarBackdrop" 
        class="sidebar-backdrop ${this.isMobileOpen ? 'open' : ''}"
        style="display: ${this.isMobileOpen ? 'block' : 'none'}; position: fixed; inset: 0; background: rgba(43, 38, 34, 0.5); z-index: 990; backdrop-filter: blur(2px);"
      ></div>

      <!-- Left Sidebar Container -->
      <aside 
        class="miorita-sidebar-panel ${this.isCollapsed ? 'collapsed' : ''} ${this.isMobileOpen ? 'mobile-open' : ''}"
        aria-label="Navigare Satul Mioriței"
      >
        <!-- Top Lockup & Collapse Button -->
        <div class="sidebar-header">
          <div class="sidebar-brand-mini ${this.isCollapsed ? 'hidden' : ''}">
            <span style="font-size: 20px;">🐑</span>
            <span style="font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: var(--walnut);">Meniu Principal</span>
          </div>
          <button 
            id="btnToggleCollapse" 
            class="sidebar-toggle-btn"
            title="${this.isCollapsed ? 'Extinde meniul' : 'Restrânge meniul'}"
            aria-label="Toggle sidebar"
          >
            ${this.isCollapsed ? '▶' : '◀'}
          </button>
        </div>

        <!-- Navigation Scrollable Area -->
        <div class="sidebar-nav-scroll">
          
          <!-- Group 1: Core Destinations -->
          <div class="sidebar-group">
            <div class="sidebar-links-col">
              ${mainItems.map((item) => this.renderNavItem(item)).join('')}
            </div>
          </div>

          <!-- Group 2: Collapsible Atelierele din Sat (9) -->
          <div class="sidebar-group" style="border-top: 1px dashed var(--linen-dark); padding-top: 8px;">
            <button
              type="button"
              id="btnToggleAteliereGroup"
              class="sidebar-accordion-toggle ${this.isCollapsed ? 'hidden' : ''}"
              style="width: 100%; display: ${this.isCollapsed ? 'none' : 'flex'}; align-items: center; justify-content: space-between; background: transparent; border: none; padding: 6px 10px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #7A6858; cursor: pointer; border-radius: 6px;"
            >
              <span>🎯 Exerciții pe Teme (9)</span>
              <span>${showAteliere ? '▴' : '▾'}</span>
            </button>
            <div
              class="sidebar-links-col ateliere-collapsible"
              style="display: ${showAteliere || this.isCollapsed ? 'flex' : 'none'}; margin-top: 4px;"
            >
              ${atelierItems.map((item) => this.renderNavItem(item)).join('')}
            </div>
          </div>

          <!-- Group 3: Zona Părinților -->
          <div class="sidebar-group" style="margin-top: auto; border-top: 1px solid var(--linen-dark); padding-top: 10px;">
            <div class="sidebar-links-col">
              ${parentItems.map((item) => this.renderNavItem(item)).join('')}
            </div>
          </div>

        </div>
      </aside>

      <!-- Mobile Bottom Navigation Bar (Thumb reachable) -->
      <nav class="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button class="mobile-nav-item ${this.activeStation === 'tutore_agentic' ? 'active' : ''}" data-station="tutore_agentic">
          <span style="font-size: 20px;">🐑</span>
          <span>Miorița AI</span>
        </button>
        <button class="mobile-nav-item ${this.activeStation === 'map' ? 'active' : ''}" data-station="map">
          <span style="font-size: 20px;">🗺️</span>
          <span>Hartă</span>
        </button>
        <button class="mobile-nav-item ${this.activeStation === 'quest' ? 'active' : ''}" data-station="quest">
          <span style="font-size: 20px;">⚡</span>
          <span>3 Min</span>
        </button>
        <button class="mobile-nav-item ${this.activeStation === 'stana' ? 'active' : ''}" data-station="stana">
          <span style="font-size: 20px;">🧵</span>
          <span>Covor</span>
        </button>
        <button id="btnMobileMenuToggle" class="mobile-nav-item">
          <span style="font-size: 20px;">☰</span>
          <span>Mai mult</span>
        </button>
      </nav>
    `;

    this.bindEvents();
  }

  private renderNavItem(item: SidebarItem): string {
    const isActive = this.activeStation === item.id;
    return `
      <button 
        class="sidebar-nav-btn ${isActive ? 'active' : ''} ${item.id === 'tutore_agentic' ? 'hero-quest-btn' : ''}"
        data-sidebar-id="${item.id}"
        title="${item.label}"
      >
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label ${this.isCollapsed ? 'hidden' : ''}">${item.label}</span>
        ${
          item.badge && !this.isCollapsed
            ? `<span class="nav-badge">${item.badge}</span>`
            : ''
        }
      </button>
    `;
  }

  private bindEvents(): void {
    const btnToggle = this.container.querySelector('#btnToggleCollapse');
    btnToggle?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.isCollapsed = !this.isCollapsed;
      try {
        localStorage.setItem('miorita_sidebar_collapsed', String(this.isCollapsed));
      } catch {}
      this.render();
    });

    const btnToggleAteliere = this.container.querySelector('#btnToggleAteliereGroup');
    btnToggleAteliere?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.isAteliereExpanded = !this.isAteliereExpanded;
      try {
        localStorage.setItem('miorita_ateliere_expanded', String(this.isAteliereExpanded));
      } catch {}
      this.render();
    });

    const backdrop = this.container.querySelector('#sidebarBackdrop');
    backdrop?.addEventListener('click', () => {
      this.isMobileOpen = false;
      this.render();
    });

    const btnMobileToggle = this.container.querySelector('#btnMobileMenuToggle');
    btnMobileToggle?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.isMobileOpen = !this.isMobileOpen;
      this.render();
    });

    const navButtons = this.container.querySelectorAll('[data-sidebar-id]');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-sidebar-id');
        this.isMobileOpen = false;
        sound.playWoodenTap();

        if (id === 'caiet') {
          this.onOpenCaiet();
        } else if (id) {
          this.onSelectStation(id as ActiveStation);
        }
      });
    });

    const mobileNavButtons = this.container.querySelectorAll('.mobile-nav-item[data-station]');
    mobileNavButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const station = btn.getAttribute('data-station') as ActiveStation;
        sound.playWoodenTap();
        this.onSelectStation(station);
      });
    });
  }
}

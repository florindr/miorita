// src/components/sidebarNav.ts — Left Vertical Atelier Sidebar & Responsive Navigation
// Inspired by Clawey 11+ with Romanian folk craftsmanship (linocut, walnut, parchment).

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
  // Misiuni Principale
  { id: 'map', label: 'Harta României', icon: '🗺️', group: 'main' },
  { id: 'quest', label: 'Antrenamentul Zilei', icon: '⚡', badge: '3 min', color: 'var(--gold-bell)', group: 'main' },
  { id: 'scoala', label: 'Casa Gramaticii', icon: '🏫', group: 'main' },
  { id: 'stana', label: 'Stâna (Covorul)', icon: '🐑', group: 'main' },

  // Atelierele din Sat
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
  private isCollapsed: boolean = false;
  private isMobileOpen: boolean = false;

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
    } catch {
      this.isCollapsed = false;
    }
  }

  setActiveStation(station: ActiveStation): void {
    this.activeStation = station;
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
            <span style="font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: var(--walnut);">Satul Mioriței</span>
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
          
          <!-- Group 1: Misiuni Principale -->
          <div class="sidebar-group">
            <div class="sidebar-group-title ${this.isCollapsed ? 'hidden' : ''}">
              Misiuni Principale
            </div>
            <div class="sidebar-links-col">
              ${mainItems.map((item) => this.renderNavItem(item)).join('')}
            </div>
          </div>

          <!-- Group 2: Atelierele din Sat -->
          <div class="sidebar-group">
            <div class="sidebar-group-title ${this.isCollapsed ? 'hidden' : ''}">
              Atelierele din Sat
            </div>
            <div class="sidebar-links-col">
              ${atelierItems.map((item) => this.renderNavItem(item)).join('')}
            </div>
          </div>

          <!-- Group 3: Zona Părinților -->
          <div class="sidebar-group" style="margin-top: auto; border-top: 1px solid var(--linen-dark); padding-top: 10px;">
            <div class="sidebar-group-title ${this.isCollapsed ? 'hidden' : ''}">
              Zona Părinților
            </div>
            <div class="sidebar-links-col">
              ${parentItems.map((item) => this.renderNavItem(item)).join('')}
            </div>
          </div>

        </div>
      </aside>

      <!-- Mobile Bottom Navigation Bar (Thumb reachable) -->
      <nav class="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button class="mobile-nav-item ${this.activeStation === 'map' ? 'active' : ''}" data-station="map">
          <span style="font-size: 20px;">🗺️</span>
          <span>Hartă</span>
        </button>
        <button class="mobile-nav-item ${this.activeStation === 'quest' ? 'active' : ''}" data-station="quest">
          <span style="font-size: 20px;">⚡</span>
          <span>Zilnic</span>
        </button>
        <button class="mobile-nav-item ${this.activeStation === 'scoala' ? 'active' : ''}" data-station="scoala">
          <span style="font-size: 20px;">🏫</span>
          <span>Gramatică</span>
        </button>
        <button class="mobile-nav-item ${this.activeStation === 'stana' ? 'active' : ''}" data-station="stana">
          <span style="font-size: 20px;">🐑</span>
          <span>Stână</span>
        </button>
        <button id="btnMobileMenuToggle" class="mobile-nav-item">
          <span style="font-size: 20px;">☰</span>
          <span>Ateliere</span>
        </button>
      </nav>
    `;

    this.bindEvents();
  }

  private renderNavItem(item: SidebarItem): string {
    const isActive = this.activeStation === item.id;
    return `
      <button 
        class="sidebar-nav-btn ${isActive ? 'active' : ''} ${item.id === 'quest' ? 'hero-quest-btn' : ''}"
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
    // Toggle collapse button
    const btnToggle = this.container.querySelector('#btnToggleCollapse');
    btnToggle?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.isCollapsed = !this.isCollapsed;
      try {
        localStorage.setItem('miorita_sidebar_collapsed', String(this.isCollapsed));
      } catch {
        // Safe
      }
      this.render();
    });

    // Mobile backdrop click
    const backdrop = this.container.querySelector('#sidebarBackdrop');
    backdrop?.addEventListener('click', () => {
      this.isMobileOpen = false;
      this.render();
    });

    // Mobile menu toggle button in bottom bar
    const btnMobileToggle = this.container.querySelector('#btnMobileMenuToggle');
    btnMobileToggle?.addEventListener('click', () => {
      sound.playWoodenTap();
      this.isMobileOpen = !this.isMobileOpen;
      this.render();
    });

    // Sidebar navigation buttons
    const navButtons = this.container.querySelectorAll('[data-sidebar-id]');
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-sidebar-id');
        this.isMobileOpen = false; // Close drawer on mobile selection
        sound.playWoodenTap();

        if (id === 'caiet') {
          this.onOpenCaiet();
        } else if (id) {
          this.onSelectStation(id as ActiveStation);
        }
      });
    });

    // Mobile bottom navigation items
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

// tests/romaniaMapAndSidebar.test.ts — Unit tests for Storybook Romania Map & Left Sidebar Navigation
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ROMANIA_MAP_PINS, RomaniaMap } from '../src/components/romaniaMap';
import { SIDEBAR_ITEMS, SidebarNav } from '../src/components/sidebarNav';
import type { ActiveStation } from '../src/components/villageMap';

describe('Storybook Romania Map (Harta României Mioritice)', () => {
  it('defines calibrated map hotspot pins covering all village ateliers and locations', () => {
    const requiredStations: ActiveStation[] = [
      'tutore_agentic',
      'stana',
      'scoala',
      'cas',
      'art',
      'cli',
      'gen',
      'sub',
      'clq',
      'pos',
      'num',
      'agr',
    ];

    const actualPinIds = ROMANIA_MAP_PINS.map((p) => p.id);
    requiredStations.forEach((reqId) => {
      assert.ok(
        actualPinIds.includes(reqId),
        `Missing map pin for station: ${reqId}`
      );
    });
    assert.strictEqual(ROMANIA_MAP_PINS.length, 12);
  });

  it('validates each pin has valid percentage coordinates and folk metadata', () => {
    ROMANIA_MAP_PINS.forEach((pin) => {
      assert.ok(pin.title.length > 3, `Pin title too short: ${pin.title}`);
      assert.ok(pin.subtitle.length > 10, `Pin subtitle too short: ${pin.subtitle}`);
      assert.ok(pin.folkTag.length > 2, `Pin folkTag missing: ${pin.folkTag}`);
      assert.ok(pin.icon.length > 0, `Pin icon missing for ${pin.id}`);

      // Coordinates must be valid percentages between 0% and 100%
      const xVal = parseFloat(pin.x);
      const yVal = parseFloat(pin.y);
      assert.ok(!isNaN(xVal) && xVal >= 0 && xVal <= 100, `Invalid x coordinate: ${pin.x}`);
      assert.ok(!isNaN(yVal) && yVal >= 0 && yVal <= 100, `Invalid y coordinate: ${pin.y}`);
    });
  });

  it('instantiates RomaniaMap cleanly and renders storybook canvas', () => {
    const container = {
      innerHTML: '',
      querySelector: (_sel: string) => null,
      querySelectorAll: (_sel: string) => [],
    } as unknown as HTMLElement;

    let selectedStation = '';
    const map = new RomaniaMap(container, (st) => {
      selectedStation = st;
    });

    assert.ok(map);
    map.render();
    assert.ok(container.innerHTML.includes('Harta României Mioritice'));
    assert.ok(container.innerHTML.includes('/art/romania_map.jpg'));
    assert.ok(container.innerHTML.includes('Antrenamentul Zilei (3 min)'));
  });
});

describe('Left Vertical Sidebar Navigation (Clawey-style Atelier Rail)', () => {
  it('covers main quests, village ateliers, and parent area', () => {
    const mainItems = SIDEBAR_ITEMS.filter((i) => i.group === 'main');
    const atelierItems = SIDEBAR_ITEMS.filter((i) => i.group === 'ateliere');
    const parentItems = SIDEBAR_ITEMS.filter((i) => i.group === 'parent');

    assert.ok(mainItems.length >= 4, 'Should have at least 4 main navigation items');
    assert.ok(atelierItems.length >= 8, 'Should have at least 8 village ateliers');
    assert.ok(parentItems.length >= 1, 'Should have parent zone item');
  });

  it('instantiates SidebarNav and renders desktop rail and mobile bottom bar', () => {
    const container = {
      innerHTML: '',
      querySelector: (_sel: string) => null,
      querySelectorAll: (_sel: string) => [],
    } as unknown as HTMLElement;

    let activeSt: ActiveStation = 'map';
    let openedCaiet = false;

    const sidebar = new SidebarNav(
      container,
      activeSt,
      (st) => {
        activeSt = st;
      },
      () => {
        openedCaiet = true;
      }
    );

    assert.ok(sidebar);
    sidebar.render();

    assert.ok(container.innerHTML.includes('miorita-sidebar-panel'));
    assert.ok(container.innerHTML.includes('mobile-bottom-nav'));
    assert.ok(container.innerHTML.includes('Harta României'));
    assert.ok(container.innerHTML.includes('Caietul lui Tata'));

    // Test setActiveStation
    sidebar.setActiveStation('gen');
    assert.ok(container.innerHTML.includes('data-sidebar-id="gen"'));
  });
});

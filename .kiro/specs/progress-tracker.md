# Miorița — Progress Tracker (Engineering & 1-Year Learning Horizon)

> **Last Updated**: 2026-10-28 · **Model**: Gemini Argon · **Learner**: Tudor (8, Year 4, ADHD)
> **Canonical State File**: [`content/tutor/tudor-progress.json`](../../content/tutor/tudor-progress.json)
> **1-Year Curriculum Map**: [`content/tutor/year-plan.json`](../../content/tutor/year-plan.json)

---

## Part 1: Engineering Implementation Tracker (Antigravity Code)

### v0.1 Foundation Baseline (Phases 0–8) — ✅ 100% Complete (186 / 186 pts)
- [x] **Phase 0–2 (Foundation & Design System):** Vite vanilla-TS PWA (`src/main.ts`), `RomaniaMap` (`src/components/romaniaMap.ts`), `SidebarNav` (`src/components/sidebarNav.ts`), `MioritaHud`, `StitchBand`, `synth.ts` Web Audio, IndexedDB (`db.ts`) & Cloudflare D1 delta sync (`syncEngine.ts`).
- [x] **Phase 3–4 (Art & Motifs):** Storybook Romania map, station banners, 7 cross-stitch SVG motifs (`src/motifs/motifRenderer.ts`).
- [x] **Phase 5 & 8 (All 9 Taxonomy Stations + Grammar School):**
  - [x] `GEN` — Grădina cu Genuri (`src/stations/gradinaCuGenuri.ts`)
  - [x] `CAS` — Podul „A cui? Cui?” (`src/stations/podulCui.ts`)
  - [x] `CLQ` — Vânătorul de Englezisme (`src/stations/vanatorulDeEnglezisme.ts`)
  - [x] `ART` — Moara cu Articole (`src/stations/moaraCuArticole.ts`)
  - [x] `SUB` — Poteca lui Să (`src/stations/potecaLuiSa.ts`)
  - [x] `POS` — Fântâna cu Al-A-Ai-Ale (`src/stations/fantanaPosesivelor.ts`)
  - [x] `NUM` — Târgul de Numere (`src/stations/targulDeNumere.ts`)
  - [x] `CLI` — Ecoul din Munte (`src/stations/ecoulDinMunte.ts`)
  - [x] `AGR`/`ORD` — Atelierul de Culori (`src/stations/atelierulDeCulori.ts`)
  - [x] *Școala din Sat* — Casa Gramaticii: 5 *Meșteri ai Vorbirii*, *Propoziția*, and *Detectorul Vizual de Cuvinte* (`src/components/casaGramaticii.ts`)
- [x] **Phase 6–7 (SRS, Adaptive Engine, Rug & Caiet):**
  - [x] 3-Tier Non-Punitive DDA (`src/storage/adaptiveEngine.ts`: *Ucenic*, *Călător*, *Meșter Mare*)
  - [x] Daily SRS & 10 Quest Sets (`src/stations/antrenamentulZilei.ts`, `src/content/questSets.ts`)
  - [x] *Covorul lui Tudor* & *Lada de Zestre* (`src/stations/stanaMioritei.ts`)
  - [x] Multi-child `FamilyAuth` & *Caietul lui Tata* with dinner recast cards (`src/components/caietulLuiTata.ts`)

---

### v0.2 Gemini Argon Agentic Tutor Roadmap (Phases 9–12) — ✅ 100% Complete (80 / 80 pts)

#### Phase 9: 1-Year Horizon, Tracker & 7-Box Novelty SRS (20 pts)
- [x] **T-9.1.1** Seed `content/tutor/year-plan.json` (4 Seasons, 52 Weeks, 12 Checkpoints)
- [x] **T-9.1.3** Seed `.kiro/specs/progress-tracker.md` & `content/tutor/tudor-progress.json`
- [x] **T-9.1.2** Implement `src/storage/tutorProgress.ts` state manager + IndexedDB/D1 sync integration
- [x] **T-9.2.1** Upgrade `src/storage/srs.ts` to 7-box 1-year scheduler (`1, 3, 7, 14, 30, 60, 120` days) with gentle lapse recovery (`max(2, box - 2)`) and `lastContextTheme`
- [x] **T-9.2.2** Implement **🔥 Focul de la Stână** non-punitive twice-weekly presence logic & *Lână de Aur* bonus
- [x] **T-9.2.3** Implement **Warm Re-Entry** (≥4 days absence) & **Novelty Rotation** guard
- [x] **T-9.2.4** Add unit tests in `tests/tutorProgress.test.ts` and `tests/srsYearHorizon.test.ts`

#### Phase 10: JS-Based In-Chat Visuals & Micro-Interactions (22 pts)
- [x] **T-10.1** Create widget base (`src/components/tutorWidgets/widgetTypes.ts`) & Antigravity `<agent-embed>` HTML generator
- [x] **T-10.2** Build `WordMorphSlider` (*Atelierul de Transformare* — `CAS`, `ART`, `AGR`)
- [x] **T-10.3** Build `CalqueZapper` (*Prinzătorul de Englezisme* — `CLQ`, `ORD`)
- [x] **T-10.4** Build `BridgeTileSnap` (*Podul de Cuvinte* — `SUB`, `NUM`, `POS`, `CLI`)
- [x] **T-10.5** Build `RoleReversalDetector` (*Profesorul Tudor* — catch Miorița's deliberate mistake)
- [x] **T-10.6** Build `GenderBasketMini` & `CheckpointTrailWidget` (*Harta de 1 An & Focul de la Stână*)
- [x] **T-10.7** Add widget unit tests in `tests/tutorWidgets.test.ts`

#### Phase 11: 10-Minute Agentic Tutor Engine, Voice & 12 Checkpoints (28 pts)
- [x] **T-11.1** Build `src/stations/tutoreAgentic.ts` (Full-stage Main UI 4-phase 10-minute session engine mounted in `#stationRoot` — never a corner chat box)
- [x] **T-11.2** Build `src/content/tutorScenarios.ts` contextual novelty generator (Minecraft, football, animals, Carpathians)
- [x] **T-11.2b** Build `src/audio/voiceRecognizer.ts` ("🎤 Spune tu!" Walkie-Talkie push-to-talk `ro-RO` STT, `maxAlternatives: 5` inspection, code-switching tolerance, "Blame the Mountain Wind" fallback, and 🐢 0.85× slow TTS replay)
- [x] **T-11.3** Build 12 Checkpoint Boss-Quests (*Popasuri de Meșter*) unlocked every ~8 sessions
- [x] **T-11.4** Promote Tutor Station as primary Main UI feature across `src/main.ts` (header *Focul de la Stână* CTA), `RomaniaMap` (hero card + central Carpathian pin), `SidebarNav` (#1 item), and `StanaMioriteiStation`
- [x] **T-11.5** Auto-sync caught tutor errors & *Parola de Cină* into `CaietulLuiTataModal`

#### Phase 12: Antigravity Skill & End-to-End Verification (10 pts)
- [x] **T-12.1** Create `.agents/skills/miorita-tutor/SKILL.md` for live Gemini Argon sessions with inline `<agent-embed>` widgets
- [x] **T-12.2** Update `docs/gemini-gem-setup.md` with Gemini Argon Agentic Tutor specification
- [x] **T-12.3** Full test suite & lint verification (`tsc --noEmit`, `vitest run`, `npm run content:lint`)

---

### v0.3 Minimalist 3-Room Declutter, Cumulative Nugget Loop & Golden Halo Audio (Phase 13) — ✅ 100% Complete
- [x] **T-13.1** Build Minimalist Single-Card Cumulative Nugget Engine (`src/storage/grammarProficiencyStore.ts` & `src/stations/tutoreAgentic.ts`) with 3-step repetition (`● ● ●`), slow mixing of previous nuggets, and color-coded word functions
- [x] **T-13.2** Enforce Honest Feedback / Zero False Praise (strip leading praise on wrong answers, allow multi-try until solved, log slips to `Caietul lui Tata`)
- [x] **T-13.3** Context-Aware Studio Audio & Explicit **Golden Audio Halo (`🔊`)** (`src/audio/synth.ts`, `src/stations/tutoreAgentic.ts`)
- [x] **T-13.4** Declutter Main App Chrome, `SidebarNav` ("Calm Rooms" + Parent Notebook), and `RomaniaMap` (remove redundant hero banners and exam toolbars; make `🐑 Învățăm` the default landing experience)
- [x] **T-13.5** Declutter `Casa Gramaticii`, `Stâna Mioriței`, `Antrenamentul Zilei`, and add the 10-Nugget & 1-Year Syllabus Parent Control tab into `Caietul lui Tata`

---

## Part 2: Tudor's 1-Year Learning Horizon Tracker ("Călătoria prin Carpați")

> **Presence Contract:** Target **≥2 sessions/week** (10 min each). Zero penalty for missed days. Checkpoints unlock by cumulative sessions (~8 per Checkpoint).

### Current Snapshot (Synced with `content/tutor/tudor-progress.json`)
- **Active Season:** Season 1 — *Toamna în Satul Mioriței (Fundația Vorbirii Curate)*
- **Active Checkpoint Target:** **Popasul 1: Livada cu Genuri** (`0 / 8` sessions toward Checkpoint 1)
- **🔥 Focul de la Stână (This Week):** `0 / 2` sessions (Waiting for first spark!)
- **Cumulative Weeks Meeting ≥2x Target:** `0` weeks
- **Total 10-Min Tutor Sessions Completed:** `0`
- **Total Golden Stitches (*Ochiuri de Aur*):** `0`

### 12 Checkpoints ("Popasuri de Meșter") — 1-Year Trail

| # | Checkpoint (*Popas*) | Season / Weeks | Target Sessions | Primary Taxonomy & Grammar Focus | Unlockable Motif & Badge | Status |
|---|---|---|---|---|---|---|
| **1** | **Livada cu Genuri** | S1 · W1–W4 | 8 | `GEN` (*un/o, doi/două*) + Moș Substantiv | *Roata Soarelui* · 🐑 *Păstorul Cuvintelor* | 🎯 **Active** |
| **2** | **Vânătoarea de Toamnă** | S1 · W5–W8 | 16 | `CLQ` (*am 8 ani, mi-e frig, are sens*) | *Pomul Vieții* · 🦅 *Vânătorul Iscusit* | 🔒 Locked |
| **3** | **Podul Bunicii** | S1 · W9–W13 | 24 | `CAS` (*casa bunicii*) + `ART` (*câinele, pe masă*) | *Coarnele Berbecului* · 🪵 *Meșterul Podului* | 🔒 Locked |
| **4** | **Poteca Zăpezii** | S2 · W14–W17 | 32 | `SUB` (*vreau să merg*) + Morarul Verb | *Steaua Nordului* · 🪨 *Călătorul Iernii* | 🔒 Locked |
| **5** | **Ecoul Carpaților** | S2 · W18–W21 | 40 | `CLI` (*l-am văzut pe Ion*) + Cascadorul Pronume | *Calea Rătăcită* · ⛰️ *Ecoul Carpaților* | 🔒 Locked |
| **6** | **Târgul de Iarnă** | S2 · W22–W26 | 48 | `POS` (*al/a/ai/ale*) + `NUM` (*20 de...*) | *Spicul de Grâu* · ⚖️ *Negustorul de Aur* | 🔒 Locked |
| **7** | **Atelierul Primăverii** | S3 · W27–W30 | 56 | `AGR` + `ORD` (*mașină roșie*) + Zugravul Adjectiv | *Hora din Sat* · 🎨 *Zugravul Vorbelor* | 🔒 Locked |
| **8** | **Cetatea Propoziției** | S3 · W31–W34 | 64 | Mixed `CAS`/`CLI`/`SUB` + Subiect & Predicat | *Brâul Carpaților* · 🏛️ *Străjerul Cetății* | 🔒 Locked |
| **9** | **Cronicarul cu Diacritice** | S3 · W35–W39 | 72 | Diacritics (**ș, ț, ă, â, î**) + Detectorul de Cuvinte | *Floarea de Colț* · 🔎 *Cronicarul Iscusit* | 🔒 Locked |
| **10** | **Izvorul Proverbelor** | S4 · W40–W43 | 80 | `CLQ` Tier 3 + Expresii românești + Timpurile | *Vulturul de Munte* · 🌟 *Meșterul Proverbelor* | 🔒 Locked |
| **11** | **Sfatul Bătrânilor** | S4 · W44–W48 | 88 | Multi-trap repair in stories + 5 Meșteri synthesis | *Coroana Mioriței* · 👑 *Boierul Vorbelor Curate* | 🔒 Locked |
| **12** | **Marea Sărbătoare a Stânei** | S4 · W49–W52 | 96+ | All 10 Categories at Tier 3 (*Meșter Mare*) | *Covorul Domnesc* · 🏆 *Marele Meșter* | 🔒 Locked |

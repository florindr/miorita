# NORTH STAR: Miorița (Romanian for heritage kids, "Satul Mioriței")

- **Learner:** Tudor (8, Year 4, ADHD). Speaks Romanian at home but **thinks in English**. Gets the meaning across, then trips on the parts of Romanian that English doesn't have.
- **Mission:** find Tudor's *own* English-interference errors (*casa la bunica*, *un casă*, *sunt 8 ani*, *vreau merg*) and repair them through short, high-novelty daily interactions until the authentic Romanian form feels natural.
- **Not a Duolingo clone.** He doesn't need to learn Romanian from zero. He needs targeted repair of a small set of interference patterns, plus a bridge to Romanian Grade 4 grammar (*Casa Gramaticii*). Audio and interactive visuals come first; text supports oral fluency.
- **Mascot & Agentic Tutor:** **Miorița**, a small, warm, slightly cheeky ewe-lamb with an embroidered collar and a tiny brass bell (*talangă*). Powered by **Gemini Argon**, she acts as Tudor's Socratic companion—guiding him through **10-minute byte-sized sessions** over a **1-year horizon**. She never says "greșit"; she says *"Hai să mai ascultăm o dată!"* or playfully lets Tudor catch *her* deliberate mistakes.
- **ADHD-Safe Gamification & Rhythm:**
  - **10-minute session cap** broken into 4 fast-paced micro-phases (2–3 min each) so novelty stays high and dopamine never drops.
  - **Reward effort, never penalize absence:** zero streak-destruction or guilt messages. All earned stitches on *Covorul lui Tudor*, golden bells (*talăngi*), and *Lada de zestre* treasures are permanent.
  - **Twice-weekly presence expectation (≥2x/week):** keeps *Focul de la Stână* (the sheepfold campfire) glowing warmly; extra daily sessions award bonus *Super-Scântei* (Golden Wool) and mystery drops.
  - **1-Year Horizon with 12 Checkpoints (*Popasuri de Meșter*):** 4 seasonal arcs across the Carpathians, with interactive checkpoint quests unlocked by cumulative sessions (~every 8 sessions) rather than rigid calendar dates.
  - **JS-Based In-Chat Visuals & Micro-Interactions:** learning is reinforced immediately inside the chat/session with compact JavaScript interactive widgets (word-ending morph sliders, calque-zappers, bridge tile-snappers, role-reversal error detectors, and live rug weaving) via Antigravity `<agent-embed>` and PWA components.
  - **Contextual Spaced Repetition (SRS + Novelty):** 7-box Leitner/FSRS-lite scheduler (`1, 3, 7, 14, 30, 60, 120` days) where Gemini Argon dynamically re-skins due grammar patterns into fresh contexts (Minecraft, football, animals, Carpathian mysteries) so Tudor never sees boring repeat flashcards.
- **Hardware:** Samsung Galaxy Tab A9+ (1920×1200, 16:10) and PC (Antigravity IDE / PWA). Touch targets ≥48px, 60fps SVG/CSS/JS widgets, no heavy WebGL.
- **Aesthetic:** **rustic Romanian, light touch.** Unbleached linen, red-and-black *ie* cross-stitch, Maramureș carved wood, Horezu pottery earth tones, Voroneț blue as an accent. Ornament appears only as **thin bands and borders**, with lots of breathing room. **No** Brâncovenesc gold arabesques, heavy frames, icons or tourist kitsch.
- **Stack:** Vite + vanilla TypeScript PWA on Cloudflare Pages, local-first IndexedDB with Cloudflare D1 delta sync, complemented by **Antigravity Code + Gemini Argon** agentic tutor workflows, `<agent-embed>` generative UI widgets, and version-controlled progress tracking (`content/tutor/tudor-progress.json`).

## The core loop

```
 Errors heard             Tagged into 10-cat      10-min Gemini Argon       1-Year SRS + 12
 (Parent "Caiet" &  ──▶   taxonomy + 7-box   ──▶  Session (Story + JS  ──▶  Checkpoints ("Popasuri")
  live tutor turns)       SRS priority queue      in-chat visuals)          & Covorul lui Tudor
        ▲                                                                          │
        └──────────────────────────────────────────────────────────────────────────┘
```

## Existing Foundation (Implemented in v0.1)

- **Interactive Map (`RomaniaMap` & `SidebarNav`):** Full storybook map of Romania with all 9 taxonomy stations, *Casa Gramaticii* (5 parts of speech + syntax detector), *Antrenamentul Zilei* (daily SRS + 10 quest sets), and *Stâna Mioriței* (*Covorul lui Tudor* + *Lada de zestre*).
- **Adaptive & Storage Engine:** 3-tier non-punitive DDA (*Ucenic*, *Călător*, *Meșter Mare*), Leitner SRS, multi-child `FamilyAuth` with Parent PIN, `Caietul lui Tata` with 10s quick-log & dinner recast cards, and local-first IndexedDB + D1 delta sync.

## Spec set

| Doc | Purpose |
|---|---|
| [requirements.md](.kiro/specs/requirements.md) | EARS requirements (MoSCoW) — v0.2 with Gemini Argon Agentic Tutor & 1-Year Horizon |
| [design.md](.kiro/specs/design.md) | Architecture, Gemini Argon tutor engine, JS in-chat widgets, 1-year SRS & data model |
| [art-direction.md](.kiro/specs/art-direction.md) | AI imagery, SVG motifs and animation guidelines |
| [backlog.md](.kiro/specs/backlog.md) | Phased epics, completed v0.1 baseline (Phases 0–8) & v0.2 Agentic Tutor roadmap (Phases 9–12) |
| [progress-tracker.md](.kiro/specs/progress-tracker.md) | Dual tracker: engineering implementation status & Tudor's 1-year learning horizon |
| [gemini-gem-setup.md](docs/gemini-gem-setup.md) | Agentic tutor prompt architecture & transition from Gem prototype to Gemini Argon |

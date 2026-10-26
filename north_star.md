# NORTH STAR: Miorița (Romanian for heritage kids, "Satul Mioriței")

- **Learner:** Tudor (8, Year 4, ADHD). Speaks Romanian at home but **thinks in English**. Gets the meaning across, then trips on the parts of Romanian that English doesn't have.
- **Mission:** find Tudor's *own* English-interference errors (*casa la bunica*, *un casă*, *sunt 8 ani*, *vreau merg*) and drill exactly those until the correct form feels natural.
- **Not a Duolingo clone.** He doesn't need to learn Romanian from zero. He needs targeted repair of a small set of patterns. Audio comes first and text second, because his Romanian is oral.
- **Mascot:** **Miorița**, a small, warm, slightly cheeky ewe-lamb with an embroidered collar and a tiny brass bell (*talangă*). She guides him around the village. She never says "greșit"; she says *"Hai să mai ascultăm o dată!"*.
- **Hardware:** Samsung Galaxy Tab A9+ (1920×1200, 16:10) as primary, plus a PC for the parent. Touch targets ≥48px, 60fps SVG/CSS, no WebGL.
- **Aesthetic:** **rustic Romanian, light touch.** Unbleached linen, red-and-black *ie* cross-stitch, Maramureș carved wood, Horezu pottery earth tones, Voroneț blue as an accent. Ornament appears only as **thin bands and borders**, with lots of breathing room. **No** Brâncovenesc gold arabesques, heavy frames, icons or tourist kitsch.
- **Stack:** the proven Clawey stack. Vite + vanilla TypeScript PWA on Cloudflare Pages, local-first IndexedDB with Cloudflare D1 delta sync.
- **AI (Vertex AI, project `antigravity-512715`):** used **at build time** for content drafts, item audio (TTS), illustrations (image models) and animations (Veo). It is **not** used at runtime in v1, so there are no AI calls from the child's device.
- **Out of scope for v1:** the live voice dialog ("Povestește-mi"). For now that role is covered by a **Gemini Gem** ([docs/gemini-gem-setup.md](docs/gemini-gem-setup.md)) whose session summaries can be **imported** into Miorița.

## The core loop

```
 Errors heard            Errors tagged into         Short drills          Re-tested in
 (parent "Caiet",   ──▶  the taxonomy (10      ──▶  (stations +     ──▶  daily review &
  Gem import)            categories)                SRS review)          Gem chats
        ▲                                                                       │
        └───────────────────────────────────────────────────────────────────────┘
```

## Spec set

| Doc | Purpose |
|---|---|
| [requirements.md](.kiro/specs/requirements.md) | EARS requirements (MoSCoW) |
| [design.md](.kiro/specs/design.md) | Architecture, data model, Vertex integration, design system |
| [art-direction.md](.kiro/specs/art-direction.md) | AI imagery and animation, step by step, with prompts |
| [backlog.md](.kiro/specs/backlog.md) | Phased epics, stories and tasks |
| [gemini-gem-setup.md](docs/gemini-gem-setup.md) | Zero-code voice tutor using a Gemini Gem |

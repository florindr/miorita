# Miorița — EARS Requirements Specification

> **Version**: 0.1.0 · **Date**: 2026-10-25 · **Status**: DRAFT
> **Methodology**: EARS (Easy Approach to Requirements Syntax)
> **Priority Scheme**: MoSCoW (Must / Should / Could / Won't this release)

---

## 1. Glossary

| Term | Definition |
|---|---|
| **Tudor** | Learner persona. 8 years old, Year 4 (London), ADHD, Romanian heritage speaker who is English-dominant |
| **Florin** | Parent persona. Native Romanian speaker who logs errors, reviews content and reads the dashboard |
| **Miorița** | Mascot. Ewe-lamb guide, speaks only Romanian, warm and playful |
| **Heritage speaker** | A child who acquired Romanian at home but whose dominant language is English |
| **Interference error** | A Romanian error caused by applying English structure (e.g. *casa la bunica*) |
| **Error Taxonomy** | The 10 categories in §2.1 that every item, drill and logged error is tagged with |
| **Station** | A themed learning area on the village map, focused on one taxonomy category |
| **Item** | One atomic drill unit (prompt, correct answer, distractors, audio, hint, category) |
| **Caiet** | "Caietul lui Tata": the parent's quick log of errors heard at home |
| **Gem** | A custom Gemini app persona used for zero-code voice practice (see docs) |
| **Build-time AI** | Vertex AI calls made by developer scripts on Florin's PC (ADC auth), never from Tudor's device |

---

## 2. Domain Model: Error Taxonomy

### 2.1 Categories (canonical IDs)

| ID | Category | Typical error | Target form |
|---|---|---|---|
| `GEN` | Grammatical gender (*un/o*, *doi/două*) | *un casă*, *doi trenuri* | *o casă*, *două trenuri* |
| `AGR` | Adjective agreement | *mașina frumos*, *scaune albi* | *mașina frumoasă*, *scaune albe* |
| `ART` | Postposed definite article | *am văzut câine*, *pe masa* | *am văzut câinele*, *pe masă* |
| `POS` | Possessive article *al/a/ai/ale* | *un prieten a meu* | *un prieten al meu* |
| `CAS` | Genitive / dative cases (vs. *la*) | *casa la bunica*, *i-am dat la mama* | *casa bunicii*, *i-am dat mamei* |
| `CLI` | Clitic doubling and *pe* | *am văzut Ion* | *l-am văzut pe Ion* |
| `SUB` | Subjunctive *să* | *vreau merg* | *vreau să merg* |
| `NUM` | Numerals ≥20 + *de* | *douăzeci mașini* | *douăzeci de mașini* |
| `CLQ` | English calques | *sunt 8 ani*, *sunt rece*, *face sens*, *pentru 3 ani* | *am 8 ani*, *mi-e frig*, *are sens*, *de 3 ani* |
| `ORD` | Word order (adjective placement) | *roșie mașină* | *mașină roșie* |

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-TAX-001** | **The system shall** tag every item, logged error and imported error with exactly one primary taxonomy ID from §2.1. | Must |
| **FR-TAX-002** | **The system shall** store the taxonomy as data (`content/taxonomy.json`) so that categories can be added without code changes. | Should |

---

## 3. Functional Requirements

### 3.1 Village Map & Navigation

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-MAP-001** | **When** Tudor opens the app, **the system shall** show the illustrated "Satul Mioriței" village map with one tappable location per station. | Must |
| **FR-MAP-002** | **The system shall** show each station's mastery as a small embroidered progress band (0–5 stitched segments) beside its location. | Should |
| **FR-MAP-003** | **When** a daily review is due, **the system shall** show Miorița at "Stâna" (the sheepfold) with a pulsing bell, and route the first tap to the daily review. | Must |

### 3.2 Stations (one per taxonomy category)

> Every station follows the same **ADHD session contract**: ≤5 minutes, ≤8 items, one concept, audio on every prompt, immediate feedback, and a celebratory ending.

| ID | Station (RO) | Category | EARS Statement | Priority |
|---|---|---|---|---|
| **FR-ST-GEN** | **Grădina cu Genuri** | `GEN` | **When** Tudor plays the gender garden, **the system shall** present a noun (audio + picture + text) and let him drag it into one of three baskets: *un–doi* (masculin), *o–două* (feminin), *un–două* (neutru). It **shall** then play the "un/două test" audio (*un tren → două trenuri*). | Must |
| **FR-ST-ART** | **Moara cu Articole** | `ART` | **When** Tudor plays the article mill, **the system shall** feed a bare noun into an animated mill and let him pick the correct articled form (*câine → câinele*, *casă → casa*). Items **shall** include the preposition rule (*pe masă* vs *pe masa mare*). | Must |
| **FR-ST-CAS** | **Podul „A cui? Cui?"** | `CAS` | **When** Tudor plays the case bridge, **the system shall** show an English-shaped sentence (*casa la bunica*) and let him build the correct form with ending tiles (*bunic-* + *-ii*). The bridge plank is laid only when it is correct. | Must |
| **FR-ST-POS** | **Fântâna cu Al-A-Ai-Ale** | `POS` | **When** Tudor plays the possessive well, **the system shall** present a phrase with a gap (*un prieten __ meu*) and four buckets (*al, a, ai, ale*) to choose from. | Should |
| **FR-ST-CLI** | **Ecoul din Munte** | `CLI` | **When** Tudor plays the echo mountain, **the system shall** present a sentence missing its clitic and/or *pe* and animate the echo (*L-am văzut* … *pe Ion*) when he completes it correctly. | Should |
| **FR-ST-SUB** | **Poteca lui Să** | `SUB` | **When** Tudor plays the să-path, **the system shall** present modal and volitional verbs (*vreau, pot, trebuie, îmi place*) and ask him to complete the clause with *să* + the correctly conjugated verb. | Should |
| **FR-ST-NUM** | **Târgul de Numere** | `NUM` | **When** Tudor plays the market, **the system shall** ask him to "buy" quantities (5, 19, 20, 21, 100, 101) and choose whether *de* is needed (*douăzeci de mere*, *nouăsprezece mere*). | Should |
| **FR-ST-CLQ** | **Vânătorul de Englezisme** | `CLQ` | **When** Tudor plays the English-ism hunter, **the system shall** play a sentence containing an English calque, let him "catch" the offending phrase by tapping it, then choose or say the Romanian form. | Must |
| **FR-ST-AGR** | **Atelierul de Culori** | `AGR`, `ORD` | **When** Tudor plays the colour workshop, **the system shall** let him paint an object by choosing the adjective form that agrees with its noun (*o mașină roșie*, *două scaune albe*), placed after the noun. | Could |

### 3.3 Feedback & Explanations

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-FB-001** | **When** Tudor answers incorrectly, **the system shall** play Miorița's pre-authored hint (≤2 sentences, Romanian, no word "greșit") and let him retry once before revealing the correct answer with audio. | Must |
| **FR-FB-002** | **When** Tudor taps the "🇬🇧 Podul englez" toggle, **the system shall** show a one-line contrastive note comparing English and Romanian (e.g. *"In English 'the' goes before. În română, se lipește la sfârșit: câine**le**."*). | Must |
| **FR-FB-003** | **The system shall** play the correct form as audio after every answer, right or wrong, so that the correct form is the last thing he hears. | Must |
| **FR-FB-004** | **The system shall** never display red crosses, buzzers or negative wording. Incorrect states use a neutral "try again" animation. | Must |

### 3.4 Audio-First Content

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-AUD-001** | **The system shall** provide a pre-generated native-quality Romanian audio clip for every item prompt, correct answer and hint, generated at build time via Vertex TTS. | Must |
| **FR-AUD-002** | **The system shall** play audio on tap of any Romanian text, and auto-play prompt audio when an item appears (toggleable). | Must |
| **FR-AUD-003** | **Where** the device supports Web Speech recognition for `ro-RO`, **the system shall** offer a "Spune tu!" mic button on CLQ and SUB items that compares the transcript against accepted answers. | Could |

### 3.5 Daily Review (Spaced Repetition)

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-SRS-001** | **The system shall** schedule items with a Leitner/FSRS-lite scheduler (intervals 1, 3, 7, 14, 30 days). | Must |
| **FR-SRS-002** | **When** Tudor opens the app and items are due, **the system shall** present a "Stâna" daily review of ≤5 items, weighted towards the categories in which errors were most recently logged (Caiet / Gem import). | Must |
| **FR-SRS-003** | **The system shall** cap a daily review at 3 minutes. | Must |

### 3.6 Rewards: "Covorul lui Tudor" (Tudor's Rug)

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-REW-001** | **When** Tudor answers an item correctly, **the system shall** add stitches to a woven rug (*scoarță*) that grows row by row, rendered as SVG from cross-stitch grid data. | Must |
| **FR-REW-002** | **When** Tudor masters a station (≥80% over the last 15 items), **the system shall** unlock that station's folk motif (e.g. rooster, tree of life, ram's horns), which is then woven into the rug. | Should |
| **FR-REW-003** | **When** Tudor completes 5 sessions, **the system shall** unlock a collectible object in the "Lada de zestre" chest (*talangă*, *fluier*, *opincă*, Horezu jug, *cocoș*). | Could |

### 3.7 Parent: "Caietul lui Tata" & Gem Import

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-CAIET-001** | **When** Florin hears an error at home, **the system shall** let him log it in ≤10 seconds: *what Tudor said*, *correct form*, and a category chip (auto-suggested by keyword rules). | Must |
| **FR-CAIET-002** | **When** an error is logged, **the system shall** create a personal item from it that enters the SRS queue with priority. | Must |
| **FR-CAIET-003** | **When** Florin pastes the JSON summary produced by the Miorița Gem, **the system shall** validate it against the import schema and add each error to the Caiet. | Should |
| **FR-CAIET-004** | **The system shall** show a weekly parent card with the top 3 error categories, trend arrows and 3 "say this at dinner" recast prompts. | Should |

### 3.8 Content Pipeline (Build-time AI)

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-CONT-001** | **The system shall** keep all items in version-controlled JSON under `content/items/<category>.json`, with `status: draft \| approved`. | Must |
| **FR-CONT-002** | **The system shall** provide a script (`npm run content:draft -- --category CAS --count 20`) that drafts items via Vertex AI Gemini, writing them as `draft`. | Should |
| **FR-CONT-003** | **The system shall** ship **only** `approved` items. Florin approves them in a local review UI (`/dev/review`) or by editing the JSON. | Must |
| **FR-CONT-004** | **The system shall** provide a script (`npm run content:audio`) that generates missing audio for approved items via Vertex TTS and writes `public/audio/<itemId>-<part>.mp3`. | Must |

### 3.9 Live Voice Dialog ("Povestește-mi")

| ID | EARS Statement | Priority |
|---|---|---|
| **FR-DLG-001** | Push-to-talk Romanian voice conversation with Miorița, with tagged error capture. | **Won't (v1)**. Covered by the Gem for now; planned for v2 |

---

## 4. Non-Functional Requirements

| ID | EARS Statement | Priority |
|---|---|---|
| **NFR-UX-001** | **The system shall** keep each Miorița utterance to ≤2 short sentences. | Must |
| **NFR-UX-002** | **The system shall** keep every interactive element ≥48×48px and use `touch-action: manipulation`. | Must |
| **NFR-UX-003** | **The system shall** keep each station session ≤5 minutes and show a visible progress band (no countdown timers). | Must |
| **NFR-UX-004** | **The system shall** use a consistent gender colour code across the whole app: masculine = Voroneț blue, feminine = *ie* red, neuter = sage green. | Must |
| **NFR-TYPE-001** | **The system shall** use only fonts that correctly render **ș ț** with comma-below (U+0219, U+021B) and **ă â î**, verified by a visual test page. | Must |
| **NFR-PERF-001** | **The system shall** keep the initial load ≤1.5 MB (excluding lazy audio and video) and run animations at 60fps on the Tab A9+. | Must |
| **NFR-PERF-002** | **The system shall** keep any ambient video loop ≤1.5 MB, muted and paused when off-screen, and replace it with a static poster under `prefers-reduced-motion`. | Must |
| **NFR-PWA-001** | **The system shall** work fully offline after first load, including audio for all approved items. | Should |
| **NFR-PRIV-001** | **The system shall not** send Tudor's voice, text or identity to any AI service from the device in v1. | Must |
| **NFR-AI-001** | **The system shall** authenticate all Vertex AI calls in dev scripts via Application Default Credentials (`gcloud auth application-default login --project antigravity-512715`) and **shall not** commit keys. | Must |

---

## 5. Constraints

| ID | Constraint |
|---|---|
| **CON-001** | TypeScript strict mode, Vite, vanilla TS (no framework), same as Clawey |
| **CON-002** | Cloudflare Pages + Pages Functions + D1 for hosting/sync |
| **CON-003** | Primary target device: Samsung Galaxy Tab A9+ (Chrome, 1920×1200) |
| **CON-004** | Vertex AI project `antigravity-512715`; model IDs live in `scripts/vertex.config.ts`, not hard-coded |
| **CON-005** | Romanian content must be approved by a native speaker (Florin) before shipping |

---

## 6. Open Questions

1. **Romanian reading level:** how well does Tudor read Romanian (diacritics)? The design currently assumes **audio-first** with text as support.
2. **Gem vs. app priority:** if the Gem works well, is FR-CAIET-003 (import) a Must?
3. **Voice for Miorița:** pick a single Vertex TTS voice (child-friendly female vs. warm neutral) after an A/B listen.

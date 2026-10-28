# Miorița — EARS Requirements Specification

> **Version**: 0.3.0 · **Date**: 2026-10-28 · **Status**: ACTIVE (Minimalist 3-Room Architecture, Cumulative Nugget Loop & Golden Halo Audio)
> **Methodology**: EARS (Easy Approach to Requirements Syntax)
> **Priority Scheme**: MoSCoW (Must / Should / Could / Won't this release)

---

## 1. Glossary

| Term | Definition |
|---|---|
| **Tudor** | Learner persona. 8 years old, Year 4 (London), ADHD, Romanian heritage speaker who is English-dominant |
| **Florin** | Parent persona. Native Romanian speaker who logs errors, reviews content and inspects the 1-year curriculum |
| **Miorița** | Mascot & Agentic Tutor. Ewe-lamb guide powered by **Gemini AI** (`gemini-3.5-flash-lite` / `gemini-2.5-flash`), speaks warm, clear Romanian |
| **Pepită (Grammar Nugget)** | One of 10 progressive, bite-sized Romanian grammar concepts taught one card at a time via 3-step repetition (`● ● ●`) that slowly mixes in previously learned nuggets |
| **Golden Audio Halo (`🔊`)** | Visual glowing golden ring (`box-shadow` + `🔊` badge) explicitly marking every word or phrase on screen that has a verified studio-recorded Romanian pronunciation |
| **Heritage speaker** | A child who acquired Romanian at home but whose dominant language is English |
| **Interference error** | A Romanian error caused by applying English structure (e.g. *casa la bunica*, *sunt 8 ani*) |
| **Error Taxonomy** | The 10 categories in §2.1 that every item, drill, tutor turn and logged error is tagged with |
| **Three Calm Rooms** | The simplified child-facing information architecture: **1. `🐑 Învățăm` (Default Home Nugget Card)**, **2. `🗺️ Harta Satului` (Clean Map of Visual Games)**, **3. `🧵 Covorul & Culorile` (Woven Rug & Word Role Cards)** |
| **Caietul lui Tata** | PIN-gated parent drawer containing Florin's quick home error log, dinner recast prompts, proficiency scores, and the 1-Year / 96-Lesson Curriculum Inspector |

---

## 2. Domain Model: Error Taxonomy & Word Roles

### 2.1 Interference Error Categories (canonical IDs)

| ID | Category | Typical error | Target form | Village Game (`Harta Satului`) |
|---|---|---|---|---|
| `GEN` | Grammatical gender (*un/o*, *doi/două*) | *un casă*, *doi trenuri* | *o casă*, *două trenuri* | Grădina cu Genuri (`gradinaCuGenuri.ts`) |
| `AGR` | Adjective agreement | *mașina frumos*, *scaune albi* | *mașina frumoasă*, *scaune albe* | Atelierul de Culori (`atelierulDeCulori.ts`) |
| `ART` | Postposed definite article | *am văzut câine*, *pe masa* | *am văzut câinele*, *pe masă* | Moara cu Articole (`moaraCuArticole.ts`) |
| `POS` | Possessive article *al/a/ai/ale* | *un prieten a meu* | *un prieten al meu* | Fântâna Posesivelor (`fantanaPosesivelor.ts`) |
| `CAS` | Genitive / dative cases (vs. *la*) | *casa la bunica*, *i-am dat la mama* | *casa bunicii*, *i-am dat mamei* | Podul „A cui? Cui?” (`podulCui.ts`) |
| `CLI` | Clitic doubling and *pe* | *am văzut Ion* | *l-am văzut pe Ion* | Ecoul din Munte (`ecoulDinMunte.ts`) |
| `SUB` | Subjunctive *să* | *vreau merg* | *vreau să merg* | Poteca lui Să (`potecaLuiSa.ts`) |
| `NUM` | Numerals ≥20 + *de* | *douăzeci mașini* | *douăzeci de mașini* | Târgul de Numere (`targulDeNumere.ts`) |
| `CLQ` | English calques | *sunt 8 ani*, *sunt rece*, *face sens* | *am 8 ani*, *mi-e frig*, *are sens* | Vânătorul de Englezisme (`vanatorulDeEnglezisme.ts`) |
| `ORD` | Word order (adjective placement) | *roșie mașină* | *mașină roșie* | Atelierul de Culori (`atelierulDeCulori.ts`) |

### 2.2 Color-Coded Word Functions (Visual Grammar System)

| Color Token | Word Role (RO) | UK Year 4 SPaG Anchor | Detective Question |
|---|---|---|---|
| 🔵 `#2F5D8A` | **Substantiv** (Subject / Object) | Noun | *Cine? Ce?* |
| 🟢 `#2E7D32` | **Adjectiv** (Agreement & Order) | Adjective | *Ce fel de? Care?* |
| 🔴 `#B23A2E` | **Verb** (Action & Tense) | Verb | *Ce face?* |
| 🟡 `#C8902E` | **Pronume** (Clitics & Person) | Pronoun | *Pe cine? Cui?* |
| 🟣 `#6A3D9A` | **Numeral** (Numbers & *de*) | Number / Determiner | *Câți? Câte?* |
| 🟤 `#8D5B4C` | **Cuvânt de Legătură** (*un/o, să, pe, de, al/a*) | Article / Connector | *Cum legăm cuvintele?* |

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-TAX-001** | **The system shall** tag every item, logged error, nugget card, and mini-game with a canonical taxonomy ID (§2.1) and word role color (§2.2). | Must | ✅ Implemented |
| **FR-TAX-002** | **The system shall** store the taxonomy as data (`content/taxonomy.json`) so categories and metadata remain extensible. | Should | ✅ Implemented |

---

## 3. Functional Requirements

### 3.1 Minimalist "Three Calm Rooms" Navigation & Layout (🔄 v0.3 Declutter)

> **Design Principle:** Eliminate competing banners, multi-pane dashboards, and crowded menus. Tudor sees **one calm centered view at a time** and navigates between **3 primary child rooms** (plus the PIN-gated Parent Notebook).

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-NAV-001** | **When** Tudor opens the app, **the system shall** land directly in **Room 1: `🐑 Învățăm` (`tutore_agentic`)**, presenting the single centered Minimalist Nugget Card (`max-width: 660px`) with zero competing top banners. | Must | 🔄 Implementing in v0.3 |
| **FR-NAV-002** | **The system shall** restrict primary navigation (`SidebarNav` and mobile bar) to **3 clear child destinations**—**1. `🐑 Învățăm cu Miorița`**, **2. `🗺️ Harta Satului`**, **3. `🧵 Covorul & Culorile`**—plus a collapsible drawer for direct access to the 9 village mini-games and **4. `📓 Caietul lui Tata`** for parents. | Must | 🔄 Implementing in v0.3 |
| **FR-NAV-003** | **When** Tudor views **`🗺️ Harta Satului` (`RomaniaMap`)**, **the system shall** display the clean illustrated map of Romania without giant promotional banners or secondary exam toolbars above it. | Must | 🔄 Implementing in v0.3 |
| **FR-NAV-004** | **When** Tudor enters any village mini-game or view, **the system shall** suppress duplicate mascot banners (`MioritaHud` hidden whenever a station or card has its own prompt) so there is never more than one focal card on screen. | Must | 🔄 Implementing in v0.3 |

### 3.2 Room 1: Minimalist Cumulative Nugget Tutor (`🐑 Învățăm`) (🆕 v0.3)

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-NUG-001** | **The system shall** organize grammar learning into a **Cumulative Nugget Ladder (`Pepita 1..10`)** in `src/storage/grammarProficiencyStore.ts`, where each nugget teaches **one focused grammar rule** at a time. | Must | ✅ Implemented |
| **FR-NUG-002** | **For each nugget**, **the system shall** guide Tudor through a **3-step repetition cycle (`● ● ●`)**: Step 1 presents a curated, crystal-clear starter card; Steps 2 and 3 dynamically generate fresh sentences via Gemini AI (`src/ai/mioritaTutorProxy.ts`) that repeat the active nugget while **slowly mixing in previously learned nuggets** (`1..N-1`) and recent words from `Caietul lui Tata`. | Must | ✅ Implemented |
| **FR-NUG-003** | **The system shall** prioritize **knowledge building before testing** on every nugget card:<br>1. A concise 1–2 sentence explanation + 1-line English-to-Romanian contrast.<br>2. An interactive color-coded sentence where tapping any word reveals its 1-line grammatical function.<br>3. A single *"Am înțeles · Verifică rapid ➔"* button that reveals **1 verification question** only when Tudor is ready. | Must | ✅ Implemented |
| **FR-NUG-004** | **The system shall** persist all AI-generated nugget lessons and Tudor's per-pillar proficiency locally (`localStorage` / IndexedDB) so generated cards can be revisited offline. | Must | ✅ Implemented |

### 3.3 Honest Feedback & Zero False Praise (`FR-FB`)

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-FB-001** | **When** Tudor selects an incorrect option on any verification question or mini-game, **the system shall never** display congratulatory words (*"Bravo!"*, *"Excelent!"*, *"Corect!"*, *"Super!"*); any leading praise generated by AI in explanation strings **shall** be stripped automatically. | Must | ✅ Implemented |
| **FR-FB-002** | **When** Tudor selects an incorrect option, **the system shall** mark only that option as tried, display a calm, honest 1-line hint explaining why (*"🤔 Nu este «...». Indiciu: ... — Alege varianta corectă de mai sus!"*), log the slip to `Caietul lui Tata`, and keep the remaining options active so Tudor can try again until he succeeds. | Must | ✅ Implemented |
| **FR-FB-003** | **The system shall** strip raw markdown asterisks (`*...*` / `**...**`) from all AI-generated text before rendering. | Must | ✅ Implemented |

### 3.4 Context-Aware Audio & Explicit Golden Audio Halo (`🔊`) (`FR-AUD`)

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-AUD-001** | **The system shall never** use loose substring matching on long paragraphs that triggers random single-word `.mp3` clips out of context, and **shall never** auto-play long explanation paragraphs when answering or advancing cards. | Must | ✅ Implemented |
| **FR-AUD-002** | **The system shall** explicitly mark every word tile or inline quoted phrase that has a verified studio-recorded audio clip (`src/audio/synth.ts`) with a **Golden Audio Halo (`box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.34)` + `🔊` badge)** so Tudor and Florin know at a glance which exact words can be heard when tapped. | Must | ✅ Implemented |
| **FR-AUD-003** | **The system shall** ensure starter nuggets and AI-generated lessons use **context-aware vocabulary** from the studio-recorded audio catalog matching the active grammar rule (e.g., *un câine / o casă / un tren* for `GEN`, *Băiatul / cartea / pe masă* for `ART`, *o mașină roșie* for `AGR`, *Mingea băiatului / casa bunicii* for `CAS`, *vreau să merg afară* for `SUB`, *Doi câini albi / douăzeci de mere* for `NUM`, *L-am văzut pe Ion* for `CLI`, *am 8 ani / are sens* for `CLQ`). | Must | ✅ Implemented |
| **FR-AUD-004** | **Where** the device supports Web Speech recognition (`ro-RO`), **the system shall** provide an optional microphone button (`🎤`) with fuzzy phonetic & code-switching tolerance (`src/audio/voiceRecognizer.ts`), while keeping 100% of interactions completable via touch/tap. | Should | ✅ Implemented |

### 3.5 Room 2: Village Mini-Games (`🗺️ Harta Satului` & Stations)

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-ST-001** | **The system shall** provide 9 focused visual mini-games on `Harta Satului` (one per taxonomy category: `GEN`, `ART`, `CAS`, `POS`, `CLI`, `SUB`, `NUM`, `CLQ`, `AGR`/`ORD`) plus a quick 5-item mixed practice (`Antrenamentul Zilei`), each presented in a clean single-card layout without exam-paper clutter. | Must | 🔄 Decluttering in v0.3 |
| **FR-ST-002** | **When** any word or option rendered inside a village mini-game has a studio-recorded audio clip, **the system shall** display the **Golden Audio Halo (`🔊`)** or allow tapping it to hear its pronunciation in context. | Should | 🔄 Implementing in v0.3 |

### 3.6 Room 3: Woven Rug & Visual Color Cards (`🧵 Covorul & Culorile`)

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-REW-001** | **When** Tudor completes nuggets or mini-games, **the system shall** weave golden stitches (*ochiuri*) into *Covorul lui Tudor* (`stanaMioritei.ts`), unlocking traditional cross-stitch motifs and *Lada de Zestre* badges. | Must | ✅ Implemented |
| **FR-REW-002** | **The system shall** present the **6 Color-Coded Word Role Cards** (*Cei 6 Meșteri ai Vorbirii*: 🔵 Substantiv, 🟢 Adjectiv, 🔴 Verb, 🟡 Pronume, 🟣 Numeral, 🟤 Legătură) and the visual *Detector de Cuvinte* as a clean, child-friendly reference without overwhelming syllabus spreadsheets. | Must | 🔄 Simplifying in v0.3 |
| **FR-REW-003** | **The system shall** track weekly presence non-punitively via **🔥 Focul de la Stână** (target: ≥2 sessions/week, zero streak resets or penalties for missed days). | Must | ✅ Implemented |

### 3.7 Parent Area: `📓 Caietul lui Tata` & 1-Year Curriculum Inspector

| ID | EARS Statement | Priority | Status |
|---|---|---|---|
| **FR-CAIET-001** | **When** Florin unlocks `Caietul lui Tata` (behind the Parent PIN in `FamilyAuth`), **the system shall** let him log home interference errors in ≤10 seconds, view caught tutor slips, and see dinner recast prompts (*Foaia de Duminică*). | Must | ✅ Implemented |
| **FR-CAIET-002** | **The system shall** house the **1-Year Curriculum & Proficiency Inspector** (the 10 Cumulative Nuggets proficiency dashboard + the 96-slot / 4-Season structured syllabus) inside `Caietul lui Tata` (and accessible as an optional parent tab) so Florin has full visibility and can jump Tudor to any nugget or lesson without cluttering Tudor's daily learning view. | Must | 🔄 Moving to Parent View in v0.3 |

---

## 4. Non-Functional Requirements

| ID | EARS Statement | Priority |
|---|---|---|
| **NFR-UX-001** | **The system shall** keep each Miorița explanation to ≤2 calm sentences and show only one primary card on screen (`max-width: 660px`) during learning. | Must |
| **NFR-UX-002** | **The system shall** keep every interactive element ≥44×44px with clear touch feedback. | Must |
| **NFR-UX-003** | **The system shall** use consistent grammar color codes across all views: 🔵 Substantiv (`#2F5D8A`), 🟢 Adjectiv (`#2E7D32`), 🔴 Verb (`#B23A2E`), 🟡 Pronume (`#C8902E`), 🟣 Numeral (`#6A3D9A`), 🟤 Legătură (`#8D5B4C`), plus a **Golden Halo (`#D4A017`)** for playable audio words. | Must |
| **NFR-TYPE-001** | **The system shall** use only fonts that correctly render **ș ț** with comma-below (U+0219, U+021B) and **ă â î**, and strip any raw markdown asterisks from AI responses. | Must |

---

## 5. Constraints

| ID | Constraint |
|---|---|
| **CON-001** | TypeScript strict mode, Vite, vanilla TS (no heavy frontend framework) |
| **CON-002** | Cloudflare Pages + Pages Functions + D1 for hosting and cross-device delta sync |
| **CON-003** | Primary target devices: Samsung Galaxy Tab A9+ (1920×1200) and Desktop Browser |
| **CON-004** | Live AI lesson generation uses Gemini API (`GEMINI_API_KEY` from `.env`, defaulting to fast `gemini-3.5-flash-lite` / `gemini-2.5-flash` fallback) |

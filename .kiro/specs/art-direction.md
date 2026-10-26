# Miorița: Art Direction & AI Asset Pipeline

> **Goal:** a cohesive set of illustrations and gentle animations that feel **handmade and rustic Romanian**, light and airy, never ornate.
> **Tools:** Vertex AI image models (stills) and Veo (motion), run via `npm run art:image` / `art:video` (see [design.md §2.3](design.md)). The Antigravity `generate_image` tool can be used for quick exploration.

---

## The Style Bible (prefix every prompt with this)

```text
STYLE: flat gouache and linocut illustration for a children's learning app,
rustic Romanian village aesthetic, light and airy, generous negative space,
unbleached linen paper texture, limited palette: linen cream #F4EEE3,
stitch black #2B2622, ie-embroidery red #B23A2E, Voronet blue #2F5D8A,
sage green #6E8B5E, Horezu ochre #C8902E, walnut brown #6B4A2F.
Folk details only as small accents: thin red-and-black cross-stitch bands,
simple Maramures carved-wood shapes, Horezu pottery spirals.
Soft, warm, friendly, slightly naive shapes, visible brush texture.
NOT: Brancovenesc ornament, gold leaf, baroque frames, Byzantine icons,
heavy borders, glossy 3D, photorealism, tourist kitsch, vampires, text or lettering.
```

> [!TIP]
> Keep `art/style-bible.txt` as a file and have the script prepend it automatically, so the style stays consistent. Store the chosen **style reference image** (from Step A1) and the **mascot sheet** (Step A2) in `art/refs/`, and pass them as reference images to every later generation.

---

## Part A: Still Imagery

### Step A1: Style exploration (moodboard)
**Goal:** lock the look before making anything else. Generate 4 variants, pick 1 as `art/refs/style.png`.

```text
{STYLE} A quiet Romanian hillside village at morning: two small wooden houses
with steep shingle roofs, a carved wooden gate, a well, a water mill by a stream,
a sheepfold on the hill, haystacks, a few birch trees. Wide composition,
lots of sky and linen space. 16:10.
```
✅ **Check:** reads as "Romanian village" at thumbnail size, while 80% of the image stays calm.

---

### Step A2: Mascot character sheet: Miorița
**Goal:** one canonical character reference. Use the image *editing* model so that later steps can reuse it.

```text
{STYLE} Character turnaround sheet of "Miorita", a small young ewe-lamb mascot:
round fluffy cream-white wool, soft charcoal face and legs, big kind dark eyes,
small ears, a narrow embroidered collar with red-and-black cross-stitch pattern,
a tiny brass bell (talanga) on the collar. Friendly, a little cheeky, 8-year-old appeal.
Show: front, three-quarter, side, back. Plain linen background, evenly lit, no shadows.
```

Then **expressions sheet** (pass A2 as reference):
```text
Same character Miorita, expression sheet, 6 poses on plain linen background:
happy hop, curious head-tilt, thinking (hoof on chin), cheering with bell ringing,
gentle encouraging smile, sleepy/resting. Consistent proportions and collar.
```
✅ **Check:** collar pattern and face stay identical across poses. Regenerate until they do; this sheet anchors everything else.

---

### Step A3: Hero, the village map ("Satul Mioriței")
**Size:** 1920×1200 (Tab A9+ native), plus 2560×1600 for desktop.

```text
{STYLE} Top-down three-quarter illustrated map of a small Romanian village
for a game home screen, 16:10. Clear, separated locations with space around each
for UI labels: (1) a vegetable garden with three woven baskets, (2) a wooden water mill
on a stream, (3) a small wooden bridge over the stream, (4) a stone well with a bucket,
(5) a mountain with an echo cliff, (6) a winding footpath up a hill, (7) a small village
market with stalls, (8) a forest edge with a hunter's lookout, (9) a sheepfold (stana)
on the hilltop with a little lamb. Winding path connects all. Calm sky, distant hills.
```
✅ **Check:** each location is tappable-sized (≥200px at 1920 width). No baked-in text.

---

### Step A4: Station illustrations (one per station, 4:3, used as session headers)

| ID | Station | Prompt body (after `{STYLE}`, with A2 as reference) |
|---|---|---|
| A4.1 | Grădina cu Genuri | *Miorita in a garden beside three woven baskets: one with a blue ribbon, one with a red ribbon, one with a green ribbon; vegetables and objects nearby waiting to be sorted.* |
| A4.2 | Moara cu Articole | *A small wooden water mill, Miorita pouring wooden word-blocks into the hopper; blocks come out of a chute with a little extra piece attached.* |
| A4.3 | Podul „A cui? Cui?" | *A simple wooden plank bridge over a stream with some planks missing, Miorita on one side, grandmother's cottage on the other.* |
| A4.4 | Fântâna cu Al-A-Ai-Ale | *A traditional Romanian well with a wooden roof and four small buckets hanging, Miorita peering in.* |
| A4.5 | Ecoul din Munte | *Miorita on a rocky ledge calling out, soft concentric echo lines bouncing back from a mountain cliff.* |
| A4.6 | Poteca lui Să | *A winding footpath with stepping stones climbing a hill, Miorita hopping from stone to stone.* |
| A4.7 | Târgul de Numere | *A small village market stall with apples, eggs and clay jugs in rows, Miorita as a shopper with a little basket.* |
| A4.8 | Vânătorul de Englezisme | *Miorita in a tiny explorer hat with a butterfly net, chasing playful little paper birds through a meadow.* |
| A4.9 | Stâna (home / review) | *A cosy hilltop sheepfold with a wooden fence, a woven rug drying on the fence, Miorita resting, evening light.* |

✅ **Check:** same lamb and palette across all 9 when shown side by side.

---

### Step A5: Collectibles: "Lada de zestre" (512×512, transparent)

```text
{STYLE} Single object sticker on a plain linen background, centred, soft shadow:
{OBJECT}. Simple, chunky, readable at 96px.
```
`{OBJECT}` list: brass sheep bell (*talangă*) · wooden shepherd's flute (*fluier*) · leather peasant shoe (*opincă*) · Horezu clay jug with rooster motif · painted Easter egg · woven shoulder bag (*traistă*) · carved wooden spoon · wheat sheaf · lamb's-wool hat (*căciulă*).

---

### Step A6: Textures
```text
Seamless tileable texture, unbleached natural linen fabric, very subtle weave,
warm cream #F4EEE3, flat even lighting, no folds, 1024x1024.
```
Also: *seamless subtle hand-made paper*, and *subtle carved walnut wood grain* (for buttons/headers).
✅ **Check:** tile 3×3 in an image viewer; there must be no visible seams.

---

### Step A7: App icon & splash
```text
{STYLE} App icon: Miorita's face, front view, centered inside a circle of thin
red-and-black cross-stitch band, linen background, bold simple shapes, readable at 48px.
```
Export at 512, 192 and 48 px, plus a maskable variant with a 20% safe zone.

---

### Step A8: Hand-authored (not AI)
- **Cross-stitch motifs** come from grid JSON as code (design.md §4.4).
- **Gender basket ribbons, progress bands and icons** are hand-drawn SVG so they stay crisp and themeable.

---

### Step A9: Post-processing
1. Background removal for mascot and stickers (image model "remove background" edit, or `rembg` locally).
2. `npm run art:optimize`: WebP (q≈82) + AVIF, `srcset` sizes 1x/2x, max 250 KB per station image.
3. Write a `*.meta.json` sidecar for each asset (prompt, model, seed, date).
4. Add the asset to `public/art/manifest.json` and commit.

---

## Part B: Animations

> **Rule:** prefer CSS/SVG. Use AI video only where hand-animation would be costly. All loops are muted, ≤1.5 MB, paused off-screen, and replaced by a poster under reduced motion (NFR-PERF-002).

### Step N1: Micro-interactions (CSS/SVG, no AI)
- Button "squash and settle" (120ms), basket wobble on drop, card flip on answer reveal.
- **Stitch reveal:** motif rects appear one by one, like stitching (40ms/stitch, max 1.2 s).
- Rug row "weave-in": a new row slides in left→right with a shuttle icon.

### Step N2: Ambient village loop (Veo image-to-video)
Input: the approved A3 map.
```text
Subtle ambient animation of this illustrated village, camera completely static:
smoke gently rising from chimneys, the water mill wheel turning slowly, grass and birch
leaves swaying softly, a couple of small birds crossing the sky. Keep the flat gouache
style and colors exactly. No new objects, no camera movement. Seamless loop.
```
Post: trim to a clean 4–6 s loop (crossfade the last 0.5 s into the first, or ping-pong), then `ffmpeg`:
```powershell
ffmpeg -i N2.mp4 -vf "scale=1920:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 38 -an -row-mt 1 N2-map.webm
ffmpeg -i N2.mp4 -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart N2-map.mp4
```

### Step N3: Mascot reaction clips (Veo, from A2 expressions)
One clip per reaction, generated on a **flat chroma-green background** for keying:
| ID | Reaction | Prompt |
|---|---|---|
| N3.1 | Happy hop | *Miorita does one small happy hop and lands, bell jingles, returns to start pose.* |
| N3.2 | Think | *Miorita tilts head and taps hoof on chin, then looks back at viewer.* |
| N3.3 | Cheer | *Miorita jumps and spins once with joy, wool bouncing, returns to start pose.* |
| N3.4 | Encourage | *Miorita nods warmly and gives a small wave of the hoof.* |

Suffix for each: *"Static camera, plain flat #00B140 green background, same flat gouache style, 2–3 seconds, ends in the same pose it starts."*
Post: key out the green, then export as **WebM VP9 with alpha** (Chrome/Android supports it), ≤400 KB each:
```powershell
ffmpeg -i N3.1.mp4 -vf "chromakey=0x00B140:0.12:0.08,scale=512:-2,fps=24" -c:v libvpx-vp9 -pix_fmt yuva420p -crf 36 -b:v 0 -an miorita-hop.webm
```
Fallback: if keying edges look poor, extract 12 frames and build a sprite sheet instead.

### Step N4: Station ambient touches (optional)
Small looping vignettes for the mill wheel (A4.2) and the echo rings (A4.5). These are often easier as **SVG/CSS rotation on a cut-out layer** than as video, so try that first.

### Step N5: Reward moment
When a motif unlocks: the stitch reveal (N1) is followed by Miorița's cheer clip (N3.3) and a soft synthesized Web Audio chime (wooden *toacă*-like tick + bell). No confetti explosions; keep it warm, not loud.

---

## Acceptance checklist (whole art set)
- [ ] Side-by-side contact sheet of A1–A7 looks like one illustrator made it
- [ ] Mascot identical in all stills and clips (collar pattern, face)
- [ ] Ornament ≤10% of any screen; no gold, no heavy frames
- [ ] All assets have `meta.json` and are within size budgets
- [ ] Reduced-motion mode shows only static posters

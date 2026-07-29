# Refex Home Page — Google Video AI (Veo / Flow) Prompts

Use these prompts to generate scroll-scrubbed background clips for the Refex Industries home page.

**Output folder:** `client/public/home/`  
**Used by:** `HomeScrollVideo.tsx` (desktop scroll-scrub) + `bg-poster.jpg` (mobile / reduced motion)

---

## Master brief (paste first in every session)

```
Create a premium corporate website hero background video for Refex Industries Limited — an Indian industrial conglomerate in ash utilization, clean mobility, and renewable wind energy.

Style: cinematic, ultra-smooth, slow camera movement, luxury brand film quality (Apple / L&T / Tata Sustainability level). Moody dark grade with subtle green (#7cd244) and blue accents. Golden hour or overcast industrial light. No text, no logos, no people faces, no watermark.

Camera: slow dolly, crane, or aerial drift — never shaky. Motion should feel "weighted" and elegant, suitable for scroll-scrubbed playback (user scrolls = video scrubs frame by frame).

Format: 16:9, 1920x1080, 24fps feel, 6–8 seconds per clip, seamless loop-friendly ending, clean edges for crossfade between clips. Indian landscape — Tamil Nadu / industrial corridor aesthetic. Photorealistic, not cartoon.
```

---

## Negative prompt (add to every generation)

```
Avoid: shaky camera, fast cuts, handheld jitter, text overlays, logos, watermarks, cartoon, CGI game look, oversaturated colors, lens dirt, vertical video, crowd faces, stock photo clichés, American/European-only scenery, snow, desert
```

---

## Technical specs

| Setting | Value |
|--------|--------|
| Aspect ratio | 16:9 |
| Resolution | 1920×1080 (or 1280×720 for smaller files) |
| Duration | 6–8 sec per clip |
| Motion | Slow — scroll-scrub needs clear frame-by-frame motion |
| File target | Under 3 MB per clip (Indian mobile data) |
| Crossfade | End frame should visually match the next clip’s opening |
| Audio | None (muted on web) |

---

## Page scroll flow

```
Scroll down
    ↓
[Scene 1] Hero: "Where industrial progress meets sustainable purpose"
    ↓ (pinned text fades)
[Scenes 2–6] "Legacy of excellence" → "Discover the ecosystem"
    ↓
[Scene 7] Transition into Business / At Glance sections
    ↓
Mobile (<768px): static poster only — no video
```

---

## Full set — 7 clips (current site)

Generate one clip per prompt. Name files exactly as listed.

### Scene 1 — `bg-01-tipper-ash.mp4`

Hero: *"Where industrial progress meets sustainable purpose"*

```
Cinematic slow aerial shot over an Indian industrial plant at dawn. A heavy ash tipper truck slowly dumps fine grey fly ash in a controlled yard. Dust particles catch soft golden light. Background: power plant silhouettes, muted smoke stacks. Camera drifts left to right at 5% speed. Dark cinematic color grade, green-tinted shadows, premium documentary style. No text, no logos. 6 seconds, loopable, smooth motion for scroll-scrub website background.
```

### Scene 2 — `bg-02-wind-trucks.mp4`

Chapter: *"A legacy of industrial excellence"*

```
Wide cinematic establishing shot: row of white wind turbine towers on a green Indian plateau horizon, overcast sky. In foreground, slow-moving freight trucks on a highway curve toward the turbines. Slow push-in camera, ultra-smooth gimbal motion. Premium sustainability corporate film look. Muted greens and steel blues. No text. 7 seconds, seamless loop, scroll-scrub friendly.
```

### Scene 3 — `bg-03-wind-trucks.mp4`

```
Slow tracking shot along a wind farm in rural India. Three large wind turbines rotate slowly against a hazy sky. Low grass moves in wind. Camera moves parallel to turbines at walking pace. Calm, aspirational, premium energy brand film. Soft vignette, dark lower third for website text overlay. No people, no text. 6 seconds, loopable.
```

### Scene 4 — `bg-04-wind-trucks.mp4`

```
Cinematic side-tracking shot of modern electric and CNG commercial vehicles (buses and vans) moving slowly through an Indian industrial gateway at sunset. Wind turbines visible in far background. Warm amber light, reflective wet asphalt. Premium automotive sustainability ad style. Slow motion feel, smooth camera. No logos on vehicles. 7 seconds.
```

### Scene 5 — `bg-05-wind-trucks.mp4`

Venwind / manufacturing

```
Interior-to-exterior cinematic transition: massive white wind turbine nacelle and blade assembly inside a clean Indian manufacturing facility, then slow crane shot revealing blade length against sky. Workers as distant silhouettes only, no faces. Precision engineering aesthetic. Cool steel lighting with green accent reflections. Slow, weighted camera movement. 8 seconds, premium industrial film.
```

### Scene 6 — `bg-06-wind-trucks.mp4`

```
Dramatic slow aerial over Indian highway corridor: trucks, transmission lines, and wind turbines in one frame — symbolizing integrated energy and logistics. Golden hour, long shadows, cinematic anamorphic lens flare subtle. Camera glides forward smoothly. Dark moody grade for white text overlay. No text. 7 seconds, loop-friendly.
```

### Scene 7 — `bg-07-tipper-ash.mp4`

Chapter: *"Discover the Refex ecosystem"*

```
Close cinematic shot: processed ash being loaded from conveyor to truck, particles in backlight. Pull back slowly to reveal organized green landscaping around industrial site — circular economy, land restored. Hopeful but premium tone. Slow crane up. Green (#7cd244) subtle tint in highlights. 6 seconds, matches opening scene for visual loop closure.
```

---

## Mobile poster — `bg-poster.jpg`

Use Image AI or export a still from Scene 2.

```
Single hero poster frame: wide cinematic shot of wind turbines and trucks on Indian highway at golden hour, dark moody grade, green and blue accent lighting, empty lower third for headline text, ultra sharp, 16:9, photorealistic corporate sustainability film still. No text, no logos.
```

Target: under 500 KB for mobile users on limited data.

---

## Budget option — 3 clips only

If generation cost is a concern, use **3 clips** and duplicate crossfade pairs in code, or loop mid-scroll. Recommended trio:

| File | Covers |
|------|--------|
| `bg-01-tipper-ash.mp4` | Opening — ash / circular economy |
| `bg-02-wind-trucks.mp4` | Mid — wind + logistics (also use for poster) |
| `bg-07-tipper-ash.mp4` | Closing — transformation / ecosystem |

**Combined 3-clip flow prompt:**

```
Three-part premium corporate film for Refex Industries India: (1) dawn ash tipper at industrial plant, slow aerial drift; (2) wind turbines on green plateau with trucks on highway, slow push-in; (3) processed ash conveyor pulling back to green restored land, slow crane up. Same dark cinematic grade throughout, green and blue accents, no text, no logos, slow weighted camera, 20 seconds total, 16:9, scroll-scrub website background.
```

Slice into 3 segments (~6–7 s each) in post (FFmpeg or DaVinci Resolve).

---

## One continuous master clip (optional)

Generate once, slice into 7 segments in post.

```
One continuous premium corporate film for Refex Industries: slow cinematic journey through Indian sustainable industry — ash tipper at dawn → highway trucks toward wind farm → wind turbines on plateau → clean mobility fleet at sunset → turbine manufacturing → aerial energy corridor → ash processing and green restored land. Single uninterrupted slow camera path, no cuts, no text, dark luxury grade, 60 seconds, 16:9, scroll-scrub website background, weighted smooth motion throughout.
```

---

## Post-production checklist

- [ ] Export H.264 MP4, no audio track
- [ ] Compress to under 3 MB per clip ([HandBrake](https://handbrake.fr/) or FFmpeg `-crf 28`)
- [ ] Verify dark lower third — white hero text must stay readable
- [ ] Test crossfade between adjacent clips at 78% segment overlap (see `CROSSFADE_START` in `HomeScrollVideo.tsx`)
- [ ] Replace files in `client/public/home/` keeping exact filenames
- [ ] Regenerate `bg-poster.jpg` from best frame of `bg-02-wind-trucks.mp4`

---

## Generation order (recommended)

1. **Scene 2** (`bg-02-wind-trucks`) — establishes grade and motion
2. **Scene 7** (`bg-07-tipper-ash`) — closing loop match
3. **Scene 1** (`bg-01-tipper-ash`) — opening match to Scene 7
4. Scenes 3–6 using Scene 2 as style reference in Flow

---

## Site integration reference

| Asset | Component |
|-------|-----------|
| `bg-01`, `bg-04`, `bg-02`, `bg-07` | `client/src/pages/home/components/HomeScrollVideo.tsx` (4-clip hero scrub) |
| `bg-poster.jpg` | Mobile + `prefers-reduced-motion` fallback |
| Lenis smooth scroll | `client/src/pages/home/components/HomeSmoothScroll.tsx` |
| Pinned hero text | `client/src/pages/home/components/TerminalHeroChapters.tsx` |
| Stat counters | `client/src/pages/home/components/AtGlanceSection.tsx` |

---

## PERFORMANCE — 3 clips only (current site, lag-free)

The site now uses **4 videos** (hero scrub only). Video **freezes** after ~42% scroll — content sections below no longer trigger seeks.

**Scroll story = 3 businesses + closing shot:**

| File | Business | Scroll zone |
|------|----------|-------------|
| `bg-01-tipper-ash.mp4` | Ash Utilisation & Coal Handling | Opening hero |
| `bg-04-ev-mobility.mp4` | Refex Mobility — EV taxi fleet | Hero chapter 2 |
| `bg-02-wind-trucks.mp4` | Venwind Refex — wind energy | Hero chapter 3 |
| `bg-07-tipper-ash.mp4` | Ecosystem / circular economy close | Hero end → freezes |

### Performance master brief (paste first)

```
Premium Indian industrial corporate B-roll for a scroll-scrub website hero. Photorealistic, dark cinematic grade, subtle green (#7cd244) accent in shadows.

CRITICAL FOR WEB PERFORMANCE:
- 4 seconds duration ONLY (not 6–8)
- 1280x720 resolution (not 1080p)
- Very slow camera: single direction drift, no zoom punch-ins
- Minimal particles: NO heavy dust clouds, NO rain, NO smoke plumes, NO water spray
- Simple compositions: one subject, clean sky, soft bokeh background
- Static lighting throughout clip (no exposure flicker)
- No text, logos, faces, watermarks
- End frame must match next clip's opening tone for crossfade
```

### Negative prompt (performance)

```
Avoid: dust storms, particle effects, rain, fog layers, lens flare bursts, whip pan, zoom, handheld shake, fast motion, strobing light, crowds, text, logos, 1080p, long duration, complex VFX, fire, steam plumes, shaky drone
```

### Clip 1 — `bg-01-tipper-ash.mp4` (4 sec)

```
Slow aerial drift over Indian industrial plant at dawn. Single ash tipper truck parked in yard, minimal movement. Clean grey sky, dark green shadows, soft golden edge light. Camera glides horizontally at constant speed. Simple, calm, premium. 4 seconds, 720p, scroll-scrub optimized, no dust particles.
```

### Clip 2 — `bg-04-ev-mobility.mp4` (4 sec) — Refex Mobility EV taxi

```
Cinematic slow tracking shot of a white and green electric taxi (Indian EV sedan, similar to Tata Tigor EV or Citroen e-C3) gliding silently through an Indian city boulevard at dusk. Clean modern fleet vehicle, no visible branding or logos. Wet asphalt reflections, soft streetlights, premium automotive sustainability ad style. Camera moves parallel at walking pace. Same dark cinematic grade as clip 1 with green (#7cd244) accent highlights. 4 seconds, 720p, minimal background clutter, scroll-scrub optimized, no crowds, no faces.
```

### Clip 3 — `bg-02-wind-trucks.mp4` (4 sec) — Venwind wind energy

```
Wide static-composition shot: three white wind turbines on distant Indian plateau, overcast sky. One slow truck on highway below, barely moving. Camera drifts forward very slowly. Muted steel-blue and green grade matching clip 1. 4 seconds, 720p, no particles, scroll-scrub optimized.
```

### Clip 4 — `bg-07-tipper-ash.mp4` (4 sec)

```
Slow crane shot over green restored land beside Indian industrial site. Organized ash processing yard, clean and calm. Hopeful premium tone, same dark grade as clips 1–2. Camera rises gently. 4 seconds, 720p, minimal motion, scroll-scrub optimized, loops visually back to clip 1.
```

### Poster — `bg-poster.jpg`

```
Single still frame matching clip 2: wind turbines and highway at golden hour, dark moody grade, empty lower third for white headline text, 16:9, sharp, photorealistic. No text, no logos.
```

### After export — re-encode for fast seeking (required)

AI exports are usually slow to seek. Run this on each clip (FFmpeg):

```bash
ffmpeg -i bg-01-tipper-ash.mp4 -an -vf scale=1280:720 -c:v libx264 -preset slow -crf 28 -g 12 -keyint_min 12 -pix_fmt yuv420p -movflags +faststart bg-01-out.mp4
```

`-g 12` = keyframe every 12 frames → browser can seek instantly without lag.

**Target:** under **800 KB per clip** (4 clips ≈ 3.2 MB total).

### Drop files here

```
client/public/home/bg-01-tipper-ash.mp4
client/public/home/bg-04-ev-mobility.mp4
client/public/home/bg-02-wind-trucks.mp4
client/public/home/bg-07-tipper-ash.mp4
client/public/home/bg-poster.jpg
```

Then hard refresh the home page. No code changes needed after drop-in.

# Mobile hero videos (540p — fast load on phones)

Portrait clips loaded on mobile instead of full desktop masters.

## Specs

| Setting | Value |
|--------|--------|
| Resolution | **540 × 960** (9:16 portrait) |
| Bitrate cap | ~520 kbps |
| Target size | **≤ 0.7 MB per clip** |
| Duration | 6–8 seconds, loop-friendly |
| Format | MP4 (H.264 main), no audio |

## File names (must match)

- `bg-01-tipper-ash.mp4`
- `bg-04-ev-mobility.mp4`
- `bg-02-wind-trucks.mp4`
- `bg-07-tipper-ash.mp4`

If a mobile file is missing, the site **falls back** to the matching desktop file in `/home/`.

## Re-encode from sources

```bash
python scripts/optimize-home-hero-videos.py
```

Uses originals in `home/gemini/sources/` when available.

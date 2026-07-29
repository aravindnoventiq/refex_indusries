#!/usr/bin/env python3
"""Remove visible Gemini/Veo bottom-right watermark from project videos and images."""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "client" / "public"
ARCHIVE = PUBLIC / "_gemini-originals"

# Zoom + top-left crop tuned for 1280x720 Flow exports (hides bottom-right star).
ZOOM_W = 1500 / 1280
ZOOM_H = 844 / 720

VIDEO_EXTS = {".mp4", ".webm", ".mov"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

SKIP_DIR_NAMES = {"_gemini-originals"}
SKIP_REL_PARTS = (
    "home/gemini/sources",
    "home/gemini/videos",
)

HERO_CLIPS = [
    "bg-01-tipper-ash.mp4",
    "bg-04-ev-mobility.mp4",
    "bg-02-wind-trucks.mp4",
    "bg-07-tipper-ash.mp4",
]

MOBILE_VF_SUFFIX = ",scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280"

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def rel(path: Path) -> str:
    return str(path.relative_to(PUBLIC)).replace("\\", "/")


def should_skip(path: Path) -> bool:
    if not path.is_file():
        return True
    r = rel(path)
    if any(part in SKIP_DIR_NAMES for part in path.parts):
        return True
    return any(r.startswith(prefix) for prefix in SKIP_REL_PARTS)


def archive_path(path: Path) -> Path:
    return ARCHIVE / path.relative_to(PUBLIC)


def hero_source(name: str) -> Path | None:
    for candidate in (
        PUBLIC / "home" / "gemini" / "sources" / name,
        ARCHIVE / "home" / "gemini" / "sources" / name,
        ARCHIVE / "home" / name,
    ):
        if candidate.exists():
            return candidate
    return None


def ensure_archived(path: Path) -> Path:
    """Return original source (archived copy). Creates archive on first run."""
    r = rel(path)
    if r.startswith("home/mobile/") and path.name in HERO_CLIPS:
        source = hero_source(path.name)
        if source:
            return source

    archived = archive_path(path)
    if archived.exists():
        return archived

    if path.parent.name == "home" and path.name in HERO_CLIPS:
        source = hero_source(path.name)
        if source:
            archived.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, archived)
            return archived

    if path.exists():
        archived.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, archived)
        print(f"  archived -> {archived.relative_to(ROOT)}")
        return archived

    raise FileNotFoundError(path)


def even(n: int) -> int:
    return n + (n % 2)


def video_crop_filter(width: int, height: int) -> str:
    sw = even(int(width * ZOOM_W))
    sh = even(int(height * ZOOM_H))
    return f"scale={sw}:{sh},crop={width}:{height}:0:0"


def probe_video(path: Path) -> tuple[int, int] | None:
    cmd = [FFMPEG, "-hide_banner", "-i", str(path)]
    result = subprocess.run(cmd, capture_output=True, text=True)
    text = result.stderr
    match = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", text)
    if not match:
        return None
    return int(match.group(1)), int(match.group(2))


def run_ffmpeg(args: list[str]) -> None:
    result = subprocess.run([FFMPEG, "-y", *args], capture_output=True, text=True)
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        raise RuntimeError("ffmpeg failed")


def process_video(src: Path, dst: Path, extra_vf: str = "") -> bool:
    size = probe_video(src)
    if not size:
        print(f"  skip (no video stream): {rel(dst)}")
        return False

    w, h = size
    vf = video_crop_filter(w, h) + extra_vf
    dst.parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg(
        [
            "-i",
            str(src),
            "-vf",
            vf,
            "-c:v",
            "libx264",
            "-crf",
            "23",
            "-preset",
            "fast",
            "-an",
            "-movflags",
            "+faststart",
            str(dst),
        ]
    )
    return True


def process_image(src: Path, dst: Path) -> None:
    with Image.open(src) as im:
        im.load()
        w, h = im.size
        sw = even(int(w * ZOOM_W))
        sh = even(int(h * ZOOM_H))
        scaled = im.resize((sw, sh), Image.Resampling.LANCZOS)
        cropped = scaled.crop((0, 0, w, h))

        dst.parent.mkdir(parents=True, exist_ok=True)
        save_kwargs: dict = {}
        ext = dst.suffix.lower()
        if ext in (".jpg", ".jpeg"):
            if cropped.mode in ("RGBA", "P"):
                cropped = cropped.convert("RGB")
            save_kwargs["quality"] = 92
            save_kwargs["optimize"] = True
        elif ext == ".webp":
            save_kwargs["quality"] = 90

        cropped.save(dst, **save_kwargs)


def iter_media() -> tuple[list[Path], list[Path]]:
    videos: list[Path] = []
    images: list[Path] = []
    for path in sorted(PUBLIC.rglob("*")):
        if should_skip(path):
            continue
        ext = path.suffix.lower()
        if ext in VIDEO_EXTS:
            videos.append(path)
        elif ext in IMAGE_EXTS:
            images.append(path)
    return videos, images


def main() -> None:
    ARCHIVE.mkdir(parents=True, exist_ok=True)
    videos, images = iter_media()

    print(f"Processing {len(videos)} videos, {len(images)} images\n")

    video_ok = 0
    for path in videos:
        r = rel(path)
        print(f"video: {r}")
        try:
            src = ensure_archived(path)
            extra = MOBILE_VF_SUFFIX if "/home/mobile/" in r.replace("\\", "/") else ""
            if process_video(src, path, extra):
                video_ok += 1
        except Exception as exc:  # noqa: BLE001
            print(f"  ERROR: {exc}")

    image_ok = 0
    for path in images:
        r = rel(path)
        print(f"image: {r}")
        try:
            src = ensure_archived(path)
            process_image(src, path)
            image_ok += 1
        except Exception as exc:  # noqa: BLE001
            print(f"  ERROR: {exc}")

    print(f"\ndone — {video_ok}/{len(videos)} videos, {image_ok}/{len(images)} images")
    print(f"originals backed up under {ARCHIVE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

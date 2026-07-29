#!/usr/bin/env python3
"""Encode home hero clips for fast mobile/desktop delivery."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "client" / "public"
HOME = PUBLIC / "home"
MOBILE = HOME / "mobile"
ARCHIVE = PUBLIC / "_gemini-originals"

HERO_CLIPS = [
    "bg-01-tipper-ash.mp4",
    "bg-04-ev-mobility.mp4",
    "bg-02-wind-trucks.mp4",
    "bg-07-tipper-ash.mp4",
]

# Top-left crop hides Gemini watermark on 1280x720 exports.
DESKTOP_VF = "scale=1500:844,crop=1280:720:0:0"
MOBILE_VF = (
    f"{DESKTOP_VF},scale=540:960:force_original_aspect_ratio=increase,"
    "crop=540:960:(iw-540)/2:(ih-960)/2"
)

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def run_ffmpeg(args: list[str]) -> None:
    result = subprocess.run([FFMPEG, "-y", *args], capture_output=True, text=True)
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        raise RuntimeError("ffmpeg failed")


def source_for(name: str) -> Path:
    for candidate in (
        HOME / "gemini" / "sources" / name,
        ARCHIVE / "home" / "gemini" / "sources" / name,
        ARCHIVE / "home" / name,
        HOME / name,
    ):
        if candidate.exists():
            return candidate
    raise FileNotFoundError(name)


def archive_original(path: Path) -> None:
    archived = ARCHIVE / path.relative_to(PUBLIC)
    if archived.exists() or not path.exists():
        return
    archived.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, archived)
    print(f"  archived -> {archived.relative_to(ROOT)}")


def encode(src: Path, dst: Path, vf: str, *, crf: int, maxrate: str, fps: int) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    run_ffmpeg(
        [
            "-i",
            str(src),
            "-vf",
            vf,
            "-c:v",
            "libx264",
            "-profile:v",
            "main",
            "-pix_fmt",
            "yuv420p",
            "-crf",
            str(crf),
            "-maxrate",
            maxrate,
            "-bufsize",
            str(int(maxrate.rstrip("k")) * 2) + "k",
            "-r",
            str(fps),
            "-g",
            str(fps * 2),
            "-preset",
            "fast",
            "-an",
            "-movflags",
            "+faststart",
            str(dst),
        ]
    )


def mb(path: Path) -> float:
    return path.stat().st_size / (1024 * 1024)


def main() -> None:
    MOBILE.mkdir(parents=True, exist_ok=True)

    print("Optimizing home hero videos\n")

    for name in HERO_CLIPS:
        src = source_for(name)
        desktop = HOME / name
        mobile = MOBILE / name

        print(f"{name}")
        print(f"  source: {src.relative_to(ROOT)}")

        archive_original(desktop)
        archive_original(mobile)

        print("  desktop 1280x720 …")
        encode(src, desktop, DESKTOP_VF, crf=28, maxrate="900k", fps=24)
        print(f"    -> {desktop.relative_to(ROOT)} ({mb(desktop):.2f} MB)")

        print("  mobile 540x960 …")
        encode(src, mobile, MOBILE_VF, crf=30, maxrate="520k", fps=20)
        print(f"    -> {mobile.relative_to(ROOT)} ({mb(mobile):.2f} MB)")
        print()

    poster = HOME / "bg-poster.jpg"
    if poster.exists():
        print(f"poster kept: {poster.relative_to(ROOT)} ({mb(poster):.2f} MB)")

    print("done")


if __name__ == "__main__":
    main()

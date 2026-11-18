"""Generate a scene's narration (one clip per beat) with Kokoro TTS.

Usage (from the project root):
    python3 scripts/generate_scene_audio.py scene1
    python3 scripts/generate_scene_audio.py scene2

Writes:
    public/<scene>/beat1.wav ...
    src/<scene>/timing.json   (speech length of each beat, read by the composition)
"""

import json
import sys
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"

VOICE = "am_adam"
SPEED = 0.95

# Narration per beat — keep in sync with SCRIPT.md.
SCENES = {
    "scene1": [
        "This is the Fibonacci sequence.",
        "It starts with two numbers: one, and one.",
        "Every new number is the sum of the two before it. "
        "One plus one is two. One plus two is three.",
        "Three plus two is five, five plus three is eight, and on it goes, forever.",
        "Now, let's look closely at any two neighbours in this sequence.",
        "What can we say about two consecutive Fibonacci numbers?",
    ],
    "scene2": [
        "Let's divide each Fibonacci number by the one before it.",
        "The ratios jump up and down at first, but they quickly settle on a single number: "
        "one point six one eight, and so on.",
        "This is the golden ratio, written with the Greek letter phi.",
    ],
}


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] not in SCENES:
        sys.exit(f"usage: generate_scene_audio.py <{'|'.join(SCENES)}>")
    scene = sys.argv[1]
    audio_dir = ROOT / "public" / scene
    timing_file = ROOT / "src" / scene / "timing.json"

    kokoro = Kokoro(str(MODEL), str(VOICES))
    audio_dir.mkdir(parents=True, exist_ok=True)
    timing_file.parent.mkdir(parents=True, exist_ok=True)

    timing = []
    for i, text in enumerate(SCENES[scene], start=1):
        samples, sample_rate = kokoro.create(text, voice=VOICE, speed=SPEED, lang="en-us")
        out = audio_dir / f"beat{i}.wav"
        sf.write(out, samples, sample_rate)
        seconds = len(samples) / sample_rate
        timing.append({"file": f"{scene}/beat{i}.wav", "seconds": round(seconds, 3)})
        print(f"beat{i}: {seconds:.2f}s  {text}")

    timing_file.write_text(json.dumps(timing, indent=2) + "\n")
    print(f"Wrote {timing_file.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

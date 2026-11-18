"""Generate Scene 1 narration (one clip per beat) with Kokoro TTS.

Usage (from the project root):
    python3 scripts/generate_scene1_audio.py

Writes:
    public/scene1/beat1.wav ... beat6.wav
    src/scene1/timing.json   (speech length of each beat, read by the composition)
"""

import json
from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
AUDIO_DIR = ROOT / "public" / "scene1"
TIMING_FILE = ROOT / "src" / "scene1" / "timing.json"

VOICE = "am_adam"
SPEED = 0.95

# Narration per beat — keep in sync with SCRIPT.md (Scene 1).
BEATS = [
    "This is the Fibonacci sequence.",
    "It starts with two numbers: one, and one.",
    "Every new number is the sum of the two before it. "
    "One plus one is two. One plus two is three.",
    "Three plus two is five, five plus three is eight, and on it goes, forever.",
    "Now, let's look closely at any two neighbours in this sequence.",
    "What can we say about two consecutive Fibonacci numbers?",
]


def main() -> None:
    kokoro = Kokoro(str(MODEL), str(VOICES))
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    TIMING_FILE.parent.mkdir(parents=True, exist_ok=True)

    timing = []
    for i, text in enumerate(BEATS, start=1):
        samples, sample_rate = kokoro.create(text, voice=VOICE, speed=SPEED, lang="en-us")
        out = AUDIO_DIR / f"beat{i}.wav"
        sf.write(out, samples, sample_rate)
        seconds = len(samples) / sample_rate
        timing.append({"file": f"scene1/beat{i}.wav", "seconds": round(seconds, 3)})
        print(f"beat{i}: {seconds:.2f}s  {text}")

    TIMING_FILE.write_text(json.dumps(timing, indent=2) + "\n")
    print(f"Wrote {TIMING_FILE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

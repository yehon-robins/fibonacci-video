"""Generate the narration track for the Fibonacci test clip with Kokoro TTS.

Usage (from the project root):
    python3 scripts/generate_audio.py

Requires the model files in ./models (see README / download URLs below):
    https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
    https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
"""

from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
OUTPUT = ROOT / "public" / "narration.wav"

TEXT = "The Fibonacci sequence generates the Golden Spiral"
VOICE = "af_heart"
TARGET_SECONDS = 5.0
LEAD_IN_SECONDS = 0.5  # small pause so the title appears before the voice starts


def main() -> None:
    kokoro = Kokoro(str(MODEL), str(VOICES))

    speed = 1.0
    samples, sample_rate = kokoro.create(TEXT, voice=VOICE, speed=speed, lang="en-us")
    speech_seconds = len(samples) / sample_rate

    # If the speech doesn't fit in the clip (with lead-in), re-synthesise faster.
    budget = TARGET_SECONDS - LEAD_IN_SECONDS - 0.1
    if speech_seconds > budget:
        speed = min(speech_seconds / budget * 1.02, 2.0)
        samples, sample_rate = kokoro.create(TEXT, voice=VOICE, speed=speed, lang="en-us")
        speech_seconds = len(samples) / sample_rate

    # Pad with silence so the file is exactly TARGET_SECONDS long.
    total = int(round(TARGET_SECONDS * sample_rate))
    lead = int(round(LEAD_IN_SECONDS * sample_rate))
    audio = np.zeros(total, dtype=np.float32)
    speech = samples[: total - lead].astype(np.float32)
    audio[lead : lead + len(speech)] = speech

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sf.write(OUTPUT, audio, sample_rate)
    print(
        f"Wrote {OUTPUT.relative_to(ROOT)}: {len(audio) / sample_rate:.3f}s total, "
        f"speech {speech_seconds:.3f}s at speed {speed:.2f}, {sample_rate} Hz"
    )


if __name__ == "__main__":
    main()

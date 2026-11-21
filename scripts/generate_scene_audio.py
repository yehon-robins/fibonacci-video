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
    "scene3a": [
        "So the Fibonacci numbers lead us to the golden ratio. But why? "
        "Let's see how they are related.",
        "To find the hundredth Fibonacci number, we'd have to compute all ninety-nine before it. "
        "Is there a formula that jumps straight to any term?",
        "We start from the rule itself. Moving everything to one side, it says: "
        "a term, minus the two before it, is always zero.",
    ],
    "scene3b": [
        "Here's the key idea. Imagine a sequence where each term is the previous one times the same number, lambda. "
        "In such a sequence, the ratio between neighbours is always exactly lambda.",
        "And we already saw that the Fibonacci ratios are almost constant. "
        "So let's guess that the sequence behaves like powers of some number lambda, "
        "and ask: which lambda obeys the Fibonacci rule?",
    ],
    "scene3c": [
        "Put lambda to the n into the rule. "
        "Lambda to the n must equal lambda to the n minus one, plus lambda to the n minus two.",
        "Every term shares the factor lambda to the n minus two, so divide it out. "
        "Lambda to the n becomes lambda squared, the middle term becomes lambda, and the last becomes one. "
        "So lambda squared equals lambda plus one, a simple quadratic equation.",
        "The quadratic formula gives two solutions: "
        "one plus root five over two, and one minus root five over two.",
        "Look at the first one: it's the golden ratio. "
        "The Fibonacci rule allows only two constant ratios, phi and its partner, psi. "
        "The golden ratio wasn't a coincidence. The rule itself demands it.",
    ],
    "scene3d": [
        "So phi to the n and psi to the n both follow the Fibonacci rule, "
        "but neither one is the Fibonacci sequence. Their values aren't even whole numbers.",
        "But the rule only adds terms together. So if we scale each sequence by any number and add them, "
        "the result still follows the rule. That gives us two knobs, A and B, to tune.",
        "And two knobs are exactly what we need. Once the first two terms are fixed, "
        "the rule decides every term after them. So if we match the first two, we match the whole sequence.",
    ],
    "scene3e": [
        "We can step the sequence one place backwards: since one equals one plus F zero, F zero must be zero. "
        "Starting from zero and one makes the algebra simpler, because anything to the power zero is one.",
        "At n equals zero, A plus B is zero, so B is minus A. At n equals one, A phi plus B psi is one. "
        "Replacing B with minus A, we get A times phi minus psi, equals one.",
        "And phi minus psi is easy: the ones cancel, leaving two root five over two, which is just root five.",
        "So A is one over root five, and B is minus one over root five.",
    ],
    "scene3f": [
        "Putting it together: the n-th Fibonacci number is phi to the n, minus psi to the n, all over root five. "
        "This is Binet's formula.",
        "Let's test it. For n equals ten, phi to the tenth is about one hundred twenty-three, psi to the tenth is tiny, "
        "and the formula gives exactly fifty-five, the tenth Fibonacci number. Irrational numbers in, whole numbers out.",
        "Notice that psi is smaller than one in size, so its powers shrink toward zero. "
        "For large n, the Fibonacci numbers are almost exactly phi to the n over root five.",
        "And that finally proves what we saw before. Divide one term by the one before it: the psi parts vanish, "
        "and what's left is phi to the n plus one over phi to the n, which is phi. "
        "The ratio of consecutive Fibonacci numbers approaches the golden ratio, and now we know why.",
    ],
    "scene4a": [
        "Count the petals on a flower, and you'll often land on a Fibonacci number. "
        "Lilies have three, buttercups five, cosmos eight, many marigolds thirteen, and asters twenty-one.",
        "Not every flower follows the pattern, but it shows up far more often than chance would suggest. "
        "So why?",
    ],
    "scene4b": [
        "A sunflower grows its seeds from the centre outward. "
        "Each new seed appears at a fixed turn from the last one: "
        "about one hundred thirty-seven and a half degrees.",
        "That angle is the golden angle: a full turn divided by phi squared. "
        "Because phi is the most irrational number, the seeds never line up into rows, "
        "so they pack in with no wasted space. Change the angle even slightly, and gaps appear.",
        "And look at the spirals that appear. Thirty-four turning one way, fifty-five the other: "
        "two neighbouring Fibonacci numbers. Pinecones and pineapples show the same thing.",
    ],
    "scene4c": [
        "Now take squares whose sides are Fibonacci numbers and fit them together. "
        "Each new square makes a bigger rectangle, and its shape gets closer and closer to the golden ratio.",
        "Draw a quarter circle in each square, and they join into a spiral. "
        "This is the golden spiral: every quarter turn, it grows by a factor of phi.",
    ],
    "scene4d": [
        "For centuries, artists and architects have treated the golden rectangle as the most pleasing shape, "
        "and some say it hides in famous buildings and paintings. "
        "Scientists still debate how much of that is true. "
        "But it's easy to see why people love the idea of a number that turns up everywhere.",
    ],
    "scene4e": [
        "From a simple rule, adding the last two numbers, comes the golden ratio, "
        "and from the golden ratio, the patterns in a sunflower. "
        "One little sequence, from mathematics all the way to nature.",
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

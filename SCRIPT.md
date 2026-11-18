# Fibonacci Video — Script

**Format:** 1280×720, 30 fps · **Narration:** Kokoro TTS, voice `am_adam`
**Visual style:** dark navy background (`#0f172a`), amber accent (`#fbbf24`), serif numbers (Georgia)

---

## Scene 1 — The Sequence and the Question

**Goal:** Introduce the Fibonacci sequence, show that each term is the sum of the two before it, and end on an open question: *what can we say about two consecutive terms?*

**Estimated length:** ~35 seconds

### Beat 1.1 — Title (0:00 – 0:04)

**Visual:**
- Fade in on the empty dark background.
- The title **"The Fibonacci Sequence"** springs up from slightly below centre, then shrinks and slides to the top of the frame, where it stays as a header.

**Narration:**
> This is the Fibonacci sequence.

---

### Beat 1.2 — The starting seeds (0:04 – 0:09)

**Visual:**
- Two numbers pop in on a horizontal row, left of centre: **1**   **1**
- Each one scales up from 0 with a soft spring, a beat apart.
- Small grey labels appear under them: `F₁`, `F₂`.

**Narration:**
> It starts with two numbers: one, and one.

---

### Beat 1.3 — The rule, shown slowly (0:09 – 0:18)

**Visual:**
- Two amber arcs (curved arrows) rise from the two **1**s and meet above the next empty slot.
- A small `+` appears where the arcs meet.
- The new term **2** drops into the slot. Label `F₃`.
- Repeat once more, slightly faster: arcs from **1** and **2** → **3** (`F₄`).
- While it happens, the rule fades in under the row:

  **Fₙ = Fₙ₋₁ + Fₙ₋₂**

**Narration:**
> Every new number is the sum of the two before it. One plus one is two. One plus two is three.

---

### Beat 1.4 — The sequence grows (0:18 – 0:25)

**Visual:**
- The arc-and-plus animation keeps going, faster each time, producing:
  **5, 8, 13, 21, 34, 55, 89**
- The row scrolls left (or the numbers shrink) so the whole sequence fits on screen.
- After the last term, an ellipsis **…** fades in at the end of the row.
- The arcs disappear; the full row stays:

  `1  1  2  3  5  8  13  21  34  55  89  …`

**Narration:**
> Three plus two is five, five plus three is eight, and on it goes — forever.

---

### Beat 1.5 — Zoom in on a pair (0:25 – 0:30)

**Visual:**
- Everything dims except one pair of neighbours — e.g. **13** and **21** — which gets an amber rounded box around it.
- The box then hops along the row to a few other neighbouring pairs: (**8**, **13**) → (**34**, **55**) → (**55**, **89**), lingering briefly on each.

**Narration:**
> Now, let's look closely at any two neighbours in this sequence.

---

### Beat 1.6 — The question (0:30 – 0:35)

**Visual:**
- The box settles back on one pair; the rest of the row fades out.
- The pair slides to centre and becomes abstract: **Fₙ** and **Fₙ₊₁**.
- The pair stays close together; a large **?** pops in above them.
- Hold on this frame for ~1 second before the cut to Scene 2.

**Narration:**
> What can we say about two consecutive Fibonacci numbers?

---

### Full narration text (Scene 1)

For feeding to `scripts/generate_audio.py`:

> This is the Fibonacci sequence. It starts with two numbers: one, and one. Every new number is the sum of the two before it. One plus one is two. One plus two is three. Three plus two is five, five plus three is eight, and on it goes — forever. Now, let's look closely at any two neighbours in this sequence. What can we say about two consecutive Fibonacci numbers?

### Open notes

- The question is deliberately left open. Scene 2 answers it: the ratio of consecutive terms approaches the golden ratio.
- Timings are estimates; final beat lengths should be set from the generated narration audio (one audio clip per beat makes syncing easier).
- Starting at `1, 1` (not `0, 1`) keeps the opening simpler for viewers.

---

## Scene 2 — The Golden Ratio

**Goal:** Answer Scene 1's question by showing, numerically, that the ratio of consecutive terms approaches the golden ratio φ, and name it. The rigorous proof is left for Scene 3.

**Estimated length:** ~19 seconds (kept short so it's easy to review and edit)

### Beat 2.1 — From pair to ratio (0:00 – 0:05)

**Visual:**
- Opens on Scene 1's last frame: **Fₙ Fₙ₊₁** with the **?** above.
- The **?** fades away. **Fₙ₊₁** slides up and **Fₙ** slides down until they form a fraction **Fₙ₊₁ / Fₙ**, with an amber fraction bar drawing in between them.

**Narration:**
> Let's divide each Fibonacci number by the one before it.

---

### Beat 2.2 — The ratios settle down (0:05 – 0:14)

**Visual:**
- The fraction moves to the left third of the screen. A column of ratios appears beneath it one at a time, each with its decimal value:

  | ratio | value |
  |---|---|
  | 1 / 1 | 1 |
  | 2 / 1 | 2 |
  | 3 / 2 | 1.5 |
  | 5 / 3 | 1.667 |
  | 8 / 5 | 1.6 |
  | 13 / 8 | 1.625 |
  | 21 / 13 | 1.615 |
  | 34 / 21 | 1.619 |
  | 55 / 34 | 1.618 |

- On the right two thirds, a small chart (x = n, y = ratio) plots one dot per ratio as it appears. The dots zig-zag above and below a dashed amber horizontal line at **1.618…**, getting closer each time.

**Narration:**
> The ratios jump up and down at first, but they quickly settle on a single number: one point six one eight, and so on.

---

### Beat 2.3 — Name it: φ (0:14 – 0:19)

**Visual:**
- The table and chart fade back. The dashed line's label grows and moves to centre:

  **φ = (1 + √5) / 2 ≈ 1.6180339…**

- The **φ** symbol is in amber.
- Hold for ~1 second, then cut to Scene 3.

**Narration:**
> This is the golden ratio, written with the Greek letter phi.

---

### Full narration text (Scene 2)

> Let's divide each Fibonacci number by the one before it. The ratios jump up and down at first, but they quickly settle on a single number: one point six one eight, and so on. This is the golden ratio, written with the Greek letter phi.

### Open notes

- Scene 2 only *shows* that the ratios approach φ. The rigorous proof linking the ratio to the sequence comes in Scene 3 (proof to be provided).

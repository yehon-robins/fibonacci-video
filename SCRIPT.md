# Fibonacci Video — Script

**Format:** 1280×720, 30 fps · **Narration:** Kokoro TTS, voice `am_adam`
**Visual style:** dark navy background (`#0f172a`), amber accent (`#fbbf24`), serif numbers (Georgia)

---

## Scene 1 — The Sequence and the Question

**Goal:** Introduce the Fibonacci sequence, show that each term is the sum of the two before it, and end on an open question: *what can we say about two consecutive terms?*

**Estimated length:** ~28 seconds (853 frames; beat lengths follow the narration audio)

### Beat 1.1 — Title (0:00 – 0:04)

**Visual:**
- Seamless hand-off from the header clip: Scene 1 opens on the header's last frame (the bold **"Fibonacci Sequence"**, centred, just faded out). The title fades back up in place, cross-fades to the regular weight, and **"The"** slides in from the left to make **"The Fibonacci Sequence"**.
- The title then shrinks and slides to the top of the frame, where it stays as a header.

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

**Estimated length:** ~17.5 seconds (527 frames; kept short so it's easy to review and edit)

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
- The title fades from "The Fibonacci Sequence" to "The Golden Ratio". The table and chart fade away completely. The dashed line's label **1.618…** grows and glides into place, its digits landing exactly where the final decimal sits; it gains more digits while the rest of the formula fades in around it:

  **φ = (1 + √5) / 2 ≈ 1.6180339…**

- The **φ** symbol is in amber, and glows briefly as the narration says "phi".
- Hold the final layout (title + formula only) for ~1 second, then cut to Scene 3A, which opens on exactly this frame.

**Narration:**
> This is the golden ratio, written with the Greek letter phi.

---

### Full narration text (Scene 2)

> Let's divide each Fibonacci number by the one before it. The ratios jump up and down at first, but they quickly settle on a single number: one point six one eight, and so on. This is the golden ratio, written with the Greek letter phi.

### Open notes

- Scene 2 only *shows* that the ratios approach φ. Scene 3 proves it (see Part 3F).

---

## Scene 3 — Proving the Formula for Fₙ (Binet's Formula)

**Goal:** Derive a direct formula for the n-th Fibonacci number,

  **Fₙ = (φⁿ − ψⁿ) / √5**

and use it to prove what Scene 2 only observed: the ratio Fₙ₊₁ / Fₙ really does approach φ.

Based on `fibonacci_proof.md`, with extra explanation added where the written proof jumps a step.

**Length:** ~3:52 as rendered. The scene is written as six parts (3A–3F) that can each be built and rendered as its own sub-scene.

### Where the ratio and the sequence meet

The proof connects the golden ratio to the sequence three times. Each one gets its own highlight moment, marked 🔗 below:

1. **🔗 The guess (Part 3B):** the starting guess Fₙ = λⁿ is a sequence whose neighbours *always* have the same ratio λ. Scene 2 showed that Fibonacci's ratio is *almost* constant, which is why this guess makes sense.
2. **🔗 The answer (Part 3C):** the Fibonacci rule allows only two constant ratios, φ and ψ. The golden ratio is *forced* by the rule.
3. **🔗 The proof (Part 3F):** the finished formula shows that ψⁿ shrinks to 0, so Fₙ₊₁ / Fₙ → φ. This proves Scene 2's observation.

---

### Part 3A — The question (~15 s)

#### Beat 3A.0 — Bridge from Scene 2

**Visual:**
- Opens on Scene 2's last frame: **φ = (1 + √5) / 2 ≈ 1.6180339…** under the title "The Golden Ratio".
- φ shrinks and glides to the right (the "≈ 1.618…" fades); the row **1, 1, 2, 3, 5, 8, 13, …** slides in on the left.
- A dashed amber line links them, with a large amber **?** in the middle. Caption: *"How are they related?"*
- Everything fades and the title changes to "Why We Want a Formula".

**Narration:**
> So the Fibonacci numbers lead us to the golden ratio. But why? Let's see how they are related.

#### Beat 3A.1 — Why we want a formula

**Visual:**
- The row from Scene 1 returns: `1  1  2  3  5  8  13  …`
- It scrolls quickly to the right. Further terms pile up and blur. A counter shows "F₁₀₀ = ?"
- Everything clears except **Fₙ = ?** in the centre.

**Narration:**
> To find the hundredth Fibonacci number, we'd have to compute all ninety-nine before it. Is there a formula that jumps straight to any term?

#### Beat 3A.2 — The rule as an equation

**Visual:**
- The rule appears: **Fₙ = Fₙ₋₁ + Fₙ₋₂**
- The two right-hand terms turn amber (they are the ones that move) and reappear on the left with minus signs: **Fₙ − Fₙ₋₁ − Fₙ₋₂ = 0**. The **0** gets a glowing box on "is always zero".

**Narration:**
> We start from the rule itself. Moving everything to one side, it says: a term, minus the two before it, is always zero.

---

### Part 3B — The guess 🔗 (~25 s)

#### Beat 3B.1 — A sequence with a constant ratio

**Visual:**
- A new row is built: **1, λ, λ², λ³, λ⁴, …**
- A small amber "× λ" arc hops between each pair of neighbours.
- Above the row, the ratio of neighbours is shown as the same value every time: λⁿ⁺¹ / λⁿ = **λ**

**Narration:**
> Here's the key idea. Imagine a sequence where each term is the previous one times the same number, lambda. In such a sequence, the ratio between neighbours is always exactly lambda.

#### Beat 3B.2 — 🔗 Link to Scene 2

**Visual:**
- A small inset shows the Scene 2 chart, with dots settling onto the 1.618 line.
- Caption: *"Fibonacci: ratio almost constant"* next to *"λⁿ: ratio exactly constant"*.
- The guess is written in amber: **Guess: Fₙ = λⁿ**  (λ ≠ 0)

**Narration:**
> And we already saw that the Fibonacci ratios are almost constant. So let's guess that the sequence behaves like powers of some number lambda, and ask: which lambda obeys the Fibonacci rule?

---

### Part 3C — The golden ratio appears 🔗 (~35 s)

#### Beat 3C.1 — Substitute the guess

**Visual:**
- **Fₙ = Fₙ₋₁ + Fₙ₋₂**. Each F term morphs into its λ version, giving:

  **λⁿ = λⁿ⁻¹ + λⁿ⁻²**

**Narration:**
> Put lambda to the n into the rule. Lambda to the n must equal lambda to the n minus one, plus lambda to the n minus two.

#### Beat 3C.2 — Divide by λⁿ⁻²

**Visual:**
- "÷ λⁿ⁻²" appears under each of the three terms.
- Each exponent counts down as n − 2 is subtracted from it: n → 2, n−1 → 1, n−2 → 0. That gives **λ² = λ¹ + λ⁰**, which simplifies to:

  **λ² = λ + 1**

- The terms are then moved to one side: **λ² − λ − 1 = 0**

**Narration:**
> Every term shares the factor lambda to the n minus two, so divide it out. Lambda to the n becomes lambda squared, the middle term becomes lambda, and the last becomes one. So lambda squared equals lambda plus one, a simple quadratic equation.

#### Beat 3C.3 — Solve it

**Visual:**
- The quadratic formula is shown with a = 1, b = −1, c = −1 colour-coded:

  **λ = ( 1 ± √(1 + 4) ) / 2 = ( 1 ± √5 ) / 2**

- The ± splits into two results side by side:

  **φ = (1 + √5) / 2 ≈ 1.618**     **ψ = (1 − √5) / 2 ≈ −0.618**

**Narration:**
> The quadratic formula gives two solutions: one plus root five over two, and one minus root five over two.

#### Beat 3C.4 — 🔗 The golden ratio is forced

**Visual:**
- **φ** gets a glowing amber box. The Scene 2 label "φ ≈ 1.618…" flies in and lands on it, matching.
- A small note appears under ψ: ψ = −1/φ
- On "The rule itself demands it", the quadratic λ² − λ − 1 = 0 at the top gets a glowing amber box.

**Narration:**
> Look at the first one: it's the golden ratio. The Fibonacci rule allows only two constant ratios, phi and its partner, psi. The golden ratio wasn't a coincidence. The rule itself demands it.

---

### Part 3D — Building Fₙ from two pieces (~30 s)

#### Beat 3D.1 — Two sequences that obey the rule, but aren't Fibonacci

**Visual:**
- Two rows of values:
  - φⁿ:  1,  1.618,  2.618,  4.236,  6.854, …
  - ψⁿ:  1,  −0.618,  0.382,  −0.236,  0.146, …
- Three neighbouring cells in each row are boxed to show that each row obeys the rule (e.g. 1.618 + 2.618 = 4.236).
- A red "≠" appears next to the real sequence 0, 1, 1, 2, 3, …, then the note "not even whole numbers".

**Narration:**
> So phi to the n and psi to the n both follow the Fibonacci rule, but neither one is the Fibonacci sequence. Their values aren't even whole numbers.

#### Beat 3D.2 — Mixing them keeps the rule

**Visual:**
- The general form appears: **Fₙ = A·φⁿ + B·ψⁿ**
- A and B are shown as two amber "knobs" (sliders).
- A short demonstration: adding the rule for φⁿ (scaled by A) to the rule for ψⁿ (scaled by B), stacked with their "=" signs aligned, gives the rule for the mix, so the mix obeys it too.

**Narration:**
> But the rule only adds terms together. So if we scale each sequence by any number and add them, the result still follows the rule. That gives us two knobs, A and B, to tune.

#### Beat 3D.3 — Why two knobs are enough

**Visual:**
- The first two slots of the row light up ("fixed") and the knobs settle. Then a cascade of arrows shows every later term being forced from them.

**Narration:**
> And two knobs are exactly what we need. Once the first two terms are fixed, the rule decides every term after them. So if we match the first two, we match the whole sequence.

---

### Part 3E — Finding A and B (~35 s)

#### Beat 3E.1 — Starting from F₀ = 0

**Visual:**
- The row `1  1  2  3  …` (labelled F₁, F₂, …) gets a new empty slot on the left, F₀.
- **F₂ = F₁ + F₀  →  1 = 1 + F₀  →  F₀ = 0**. A **0** drops into the slot.
- The starting values are highlighted: **F₀ = 0, F₁ = 1**

**Narration:**
> We can step the sequence one place backwards: since one equals one plus F zero, F zero must be zero. Starting from zero and one makes the algebra simpler, because anything to the power zero is one.

#### Beat 3E.2 — Two equations

**Visual:**
- Substitute n = 0: **A·φ⁰ + B·ψ⁰ = 0  →  A + B = 0  →  B = −A**
- Substitute n = 1: **A·φ + B·ψ = 1**
- Replace B with −A: **A·φ − A·ψ = 1  →  A(φ − ψ) = 1**

**Narration:**
> At n equals zero, A plus B is zero, so B is minus A. At n equals one, A phi plus B psi is one. Replacing B with minus A, we get A times phi minus psi, equals one.

#### Beat 3E.3 — φ − ψ = √5

**Visual:**
- **φ − ψ = (1 + √5)/2 − (1 − √5)/2**. The two 1s cancel with a strike-through, leaving **2√5 / 2 = √5**

**Narration:**
> And phi minus psi is easy: the ones cancel, leaving two root five over two, which is just root five.

#### Beat 3E.4 — The coefficients

**Visual:**
- **A·√5 = 1  →  A = 1/√5**,   **B = −1/√5**

**Narration:**
> So A is one over root five, and B is minus one over root five.

---

### Part 3F — The formula, and the ratio proved 🔗 (~35 s)

#### Beat 3F.1 — Binet's formula

**Visual:**
- A and B slide into the general form, and it simplifies to:

  **Fₙ = (φⁿ − ψⁿ) / √5**

- It is boxed in amber, with the caption "Binet's Formula".

**Narration:**
> Putting it together: the n-th Fibonacci number is phi to the n, minus psi to the n, all over root five. This is Binet's formula.

#### Beat 3F.2 — Check it

**Visual:**
- Substitute n = 10:  **φ¹⁰ ≈ 122.992**,  **ψ¹⁰ ≈ 0.008**
- **(122.992 − 0.008) / √5 = 55**. The **55** stays in the equation while a copy flies to its place, F₁₀, in the Scene 1 row.

**Narration:**
> Let's test it. For n equals ten, phi to the tenth is about one hundred twenty-three, psi to the tenth is tiny, and the formula gives exactly fifty-five, the tenth Fibonacci number. Irrational numbers in, whole numbers out.

#### Beat 3F.3 — 🔗 ψⁿ fades away

**Visual:**
- The ψⁿ values from Beat 3D.1 shrink toward 0 on a number line: 1, −0.618, 0.382, −0.236, 0.146, … → 0
- Caption: **|ψ| < 1  ⇒  ψⁿ → 0**, so **Fₙ ≈ φⁿ / √5**

**Narration:**
> Notice that psi is smaller than one in size, so its powers shrink toward zero. For large n, the Fibonacci numbers are almost exactly phi to the n over root five.

#### Beat 3F.4 — 🔗 The ratio, proved

**Visual:**
- The Scene 2 chart draws in (bottom right) on "what we saw before".
- **Fₙ₊₁ / Fₙ = (φⁿ⁺¹ − ψⁿ⁺¹) / (φⁿ − ψⁿ)**
- The ψ terms dim, each with a small blue "→ 0" note, leaving **φⁿ⁺¹ / φⁿ = φ**
- **Fₙ₊₁ / Fₙ → φ** is boxed, and the chart gets a ✓ on "approaches the golden ratio".

**Narration:**
> And that finally proves what we saw before. Divide one term by the one before it: the psi parts vanish, and what's left is phi to the n plus one over phi to the n, which is phi. The ratio of consecutive Fibonacci numbers approaches the golden ratio, and now we know why.

---

### Full narration text (Scene 3)

> So the Fibonacci numbers lead us to the golden ratio. But why? Let's see how they are related. To find the hundredth Fibonacci number, we'd have to compute all ninety-nine before it. Is there a formula that jumps straight to any term? We start from the rule itself. Moving everything to one side, it says: a term, minus the two before it, is always zero.
>
> Here's the key idea. Imagine a sequence where each term is the previous one times the same number, lambda. In such a sequence, the ratio between neighbours is always exactly lambda. And we already saw that the Fibonacci ratios are almost constant. So let's guess that the sequence behaves like powers of some number lambda, and ask: which lambda obeys the Fibonacci rule?
>
> Put lambda to the n into the rule. Lambda to the n must equal lambda to the n minus one, plus lambda to the n minus two. Every term shares the factor lambda to the n minus two, so divide it out. Lambda to the n becomes lambda squared, the middle term becomes lambda, and the last becomes one. So lambda squared equals lambda plus one, a simple quadratic equation. The quadratic formula gives two solutions: one plus root five over two, and one minus root five over two. Look at the first one: it's the golden ratio. The Fibonacci rule allows only two constant ratios, phi and its partner, psi. The golden ratio wasn't a coincidence. The rule itself demands it.
>
> So phi to the n and psi to the n both follow the Fibonacci rule, but neither one is the Fibonacci sequence. Their values aren't even whole numbers. But the rule only adds terms together. So if we scale each sequence by any number and add them, the result still follows the rule. That gives us two knobs, A and B, to tune. And two knobs are exactly what we need. Once the first two terms are fixed, the rule decides every term after them. So if we match the first two, we match the whole sequence.
>
> We can step the sequence one place backwards: since one equals one plus F zero, F zero must be zero. Starting from zero and one makes the algebra simpler, because anything to the power zero is one. At n equals zero, A plus B is zero, so B is minus A. At n equals one, A phi plus B psi is one. Replacing B with minus A, we get A times phi minus psi, equals one. And phi minus psi is easy: the ones cancel, leaving two root five over two, which is just root five. So A is one over root five, and B is minus one over root five.
>
> Putting it together: the n-th Fibonacci number is phi to the n, minus psi to the n, all over root five. This is Binet's formula. Let's test it. For n equals ten, phi to the tenth is about one hundred twenty-three, psi to the tenth is tiny, and the formula gives exactly fifty-five, the tenth Fibonacci number. Irrational numbers in, whole numbers out. Notice that psi is smaller than one in size, so its powers shrink toward zero. For large n, the Fibonacci numbers are almost exactly phi to the n over root five. And that finally proves what we saw before. Divide one term by the one before it: the psi parts vanish, and what's left is phi to the n plus one over phi to the n, which is phi. The ratio of consecutive Fibonacci numbers approaches the golden ratio, and now we know why.

### Open notes

- **Changes from `fibonacci_proof.md`:**
  - **F₀ = 0:** the video starts the sequence at F₁ = F₂ = 1, while the proof uses F₀ = 0, F₁ = 1. Beat 3E.1 bridges the two by stepping back one term.
  - **Why the mix covers everything (3D.2–3D.3):** the written proof just states that the general solution is a combination of the two roots. The video adds the reasons: the rule is preserved when sequences are scaled and added, and two starting values fix the whole sequence.
  - **Solving for A instead of B (3E.2):** the written proof solves for B first. The video substitutes B = −A and solves for A directly, which is one step shorter and gives the same result.
  - **Part 3F (ψⁿ → 0, ratio → φ)** is new. It isn't in the written proof, but it is the rigorous link back to Scene 2.
- **Optional rigour for 3F.4:** to show the limit precisely, divide the top and bottom by φⁿ to get (φ − ψ·(ψ/φ)ⁿ) / (1 − (ψ/φ)ⁿ). Since |ψ/φ| < 1, the powers (ψ/φ)ⁿ go to 0 and the expression goes to φ. This could be shown as an on-screen line without narration.
- **Symbols:** the script uses φ/ψ, matching Scene 2. The narration says "phi", "psi" and "root five" so the TTS pronounces them correctly.
- **Length:** the rendered parts total ~3:52 (3A 26 s, 3B 26 s, 3C 48 s, 3D 34 s, 3E 41 s, 3F 57 s). Each part is its own composition (Scene3A–Scene3F).

---

## Scene 4 — Fibonacci and φ in Nature

**Goal:** Close the video by connecting the three ideas: the **sequence** (counts of petals and seed spirals), the **golden ratio** (the golden angle that produces those counts), and **shape** (the golden spiral). End with the claim that φ is "beautiful", presented honestly.

**Length:** ~2:00 as rendered (4A 21 s, 4B 41 s, 4C 22.5 s, 4D 19 s, 4E 16.5 s), in five parts (4A–4E) that can be built and rendered separately, like Scene 3.

**Visual approach:** everything is drawn in code in the same dark/amber style, with no photos. The sunflower is generated by a formula (the "golden angle" model), so it is mathematically exact.

### The thread through the scene

1. **Sequence → nature (4A):** petal counts are often Fibonacci numbers.
2. **Ratio → nature (4B):** the golden angle, 360° / φ², explains *why*. Plants that place each new seed at that angle end up with Fibonacci numbers of spirals.
3. **Sequence + ratio → shape (4C):** squares with Fibonacci sides build a spiral that grows by φ every quarter turn.

---

### Part 4A — Counting petals (~15 s)

#### Beat 4A.1 — Flowers with Fibonacci petals

**Visual:**
- Lead-in (~1 s, before the narration starts): the title fades in with a small muted subtitle, *"from numbers to nature"*, and five closed buds appear. This marks the change of chapter from maths to nature.
- The Scene 1 row returns small along the bottom on "a Fibonacci number": `1  1  2  3  5  8  13  21  34  …`
- Simple stylised flowers bloom one at a time across the screen, petals opening one by one with a counter on each:
  - **3** petals (lily / iris)
  - **5** petals (buttercup / wild rose)
  - **8** petals (cosmos)
  - **13** petals (ragwort / some marigolds)
  - **21** petals (aster / chicory)
- As each count finishes, the matching number in the bottom row lights up amber.

**Narration:**
> Count the petals on a flower, and you'll often land on a Fibonacci number. Lilies have three, buttercups five, cosmos eight, many marigolds thirteen, and asters twenty-one.

#### Beat 4A.2 — "Often", not always

**Visual:**
- A small caption fades in: *"often, not always"*. One flower with 4 petals briefly appears greyed-out beside them.

**Narration:**
> Not every flower follows the pattern, but it shows up far more often than chance would suggest. So why?

---

### Part 4B — The golden angle 🔗 (~25 s)

#### Beat 4B.1 — Building a sunflower seed by seed

**Visual:**
- An empty centre point. Seeds (small amber dots) appear one at a time. Each new seed is placed at the centre, the pattern turns by a fixed angle, and older seeds drift outward.
- From "a fixed turn" on, a ray sweeps from the previous seed's direction to the new one and an amber arc (drawn outside the seeds) traces the turn. On "137.5 degrees", a fixed label **137.5°** *(turn between seeds)* appears beside the flower and stays there.
- After the narration, the process speeds up (~2.3 s, easing in and out) until ~600 seeds fill a full sunflower head, which holds for a moment.

**Narration:**
> A sunflower grows its seeds from the centre outward. Each new seed appears at a fixed turn from the last one: about one hundred thirty-seven and a half degrees.

#### Beat 4B.2 — 🔗 That angle is the golden ratio

**Visual:**
- **360° / φ² ≈ 137.5°** appears with φ in amber, along with its name: **the golden angle**.
- A quick comparison in three small panels, each built with a different angle:
  - **135°**: seeds form straight arms with wasted gaps
  - **137.5°**: tightly packed, no gaps
  - **140°**: arms again, with gaps
- The 137.5° panel gets a ✓.

**Narration:**
> That angle is the golden angle: a full turn divided by phi squared. Because phi is the "most irrational" number, the seeds never line up into rows, so they pack in with no wasted space. Change the angle even slightly, and gaps appear.

#### Beat 4B.3 — The spirals count Fibonacci numbers

**Visual:**
- Back on the full sunflower: from "look at the spirals", the seeds that form clockwise spirals are highlighted in one colour and counted (**34**), then the counter-clockwise spirals in another colour (**55**). Each count lands as its number is spoken. Then both families show together.
- **34** and **55** fly down into the Fibonacci row, landing next to each other.
- Small side note: the same pattern shows in pinecones (8 and 13) and pineapples (8, 13 and 21).

**Narration:**
> And look at the spirals that appear. Thirty-four turning one way, fifty-five the other: two neighbouring Fibonacci numbers. Pinecones and pineapples show the same thing.

---

### Part 4C — The golden spiral (~20 s)

#### Beat 4C.1 — Squares with Fibonacci sides

**Visual:**
- Squares are tiled one at a time, each placed against the growing rectangle: sides **1, 1, 2, 3, 5, 8, 13, 21**, each labelled with its side length.
- After each new square, the rectangle's side ratio is added to a list: 2/1, 3/2, 5/3, 8/5, … On "closer and closer" the values light up top to bottom, then **→ φ** appears on "golden ratio".
- The camera zooms out a little ahead of each new square, by a steady factor per square, so nothing is clipped.

**Narration:**
> Now take squares whose sides are Fibonacci numbers and fit them together. Each new square makes a bigger rectangle, and its shape gets closer and closer to the golden ratio.

#### Beat 4C.2 — Drawing the spiral

**Visual:**
- An amber quarter-circle arc is drawn inside each square, smallest first, joining into one continuous spiral.
- The tiling fades, leaving just the spiral. A label shows: **grows by φ every quarter turn**
- A faint sunflower from 4B fades in behind the spiral for a moment.

**Narration:**
> Draw a quarter circle in each square, and they join into a spiral. This is the golden spiral: every quarter turn, it grows by a factor of phi.

---

### Part 4D — The golden ratio and beauty (~19 s)

#### Beat 4D.1 — The golden rectangle

**Visual:**
- A golden rectangle (sides 1 : φ) is drawn and labelled.
- Small outline icons fade in around it: a classical temple façade, a painting frame, a modern card shape. These are generic icons, not copies of specific works.
- A caption reads: *"pleasing proportions?"*
- On "Scientists still debate", the icons dim and a note appears: *"still debated: studies give mixed results"*.
- On "a number that turns up everywhere", the rectangle glows and **φ ≈ 1.618…** appears inside it.

**Narration:**
> For centuries, artists and architects have treated the golden rectangle as the most pleasing shape, and some say it hides in famous buildings and paintings. Scientists still debate how much of that is true. But it's easy to see why people love the idea of a number that turns up everywhere.

---

### Part 4E — Closing (~17 s)

#### Beat 4E.1 — The full journey

**Visual:**
- Three items appear left to right, linked by arrows:
  **1, 1, 2, 3, 5, 8, …**  →  **φ = (1 + √5)/2**  →  (the sunflower, with the golden spiral over it)
- Under them, faintly: **Fₙ = (φⁿ − ψⁿ) / √5**
- Everything except the spiral fades. The spiral keeps turning slowly, and **"Thanks for watching!"** fades in below it in amber. Then the screen fades to black.

**Narration:**
> From a simple rule, adding the last two numbers, comes the golden ratio, and from the golden ratio, the patterns in a sunflower. One little sequence, from mathematics all the way to nature.

---

### Full narration text (Scene 4)

> Count the petals on a flower, and you'll often land on a Fibonacci number. Lilies have three, buttercups five, cosmos eight, many marigolds thirteen, and asters twenty-one. Not every flower follows the pattern, but it shows up far more often than chance would suggest. So why?
>
> A sunflower grows its seeds from the centre outward. Each new seed appears at a fixed turn from the last one: about one hundred thirty-seven and a half degrees. That angle is the golden angle: a full turn divided by phi squared. Because phi is the "most irrational" number, the seeds never line up into rows, so they pack in with no wasted space. Change the angle even slightly, and gaps appear. And look at the spirals that appear. Thirty-four turning one way, fifty-five the other: two neighbouring Fibonacci numbers. Pinecones and pineapples show the same thing.
>
> Now take squares whose sides are Fibonacci numbers and fit them together. Each new square makes a bigger rectangle, and its shape gets closer and closer to the golden ratio. Draw a quarter circle in each square, and they join into a spiral. This is the golden spiral: every quarter turn, it grows by a factor of phi.
>
> For centuries, artists and architects have treated the golden rectangle as the most pleasing shape, and some say it hides in famous buildings and paintings. Scientists still debate how much of that is true. But it's easy to see why people love the idea of a number that turns up everywhere.
>
> From a simple rule, adding the last two numbers, comes the golden ratio, and from the golden ratio, the patterns in a sunflower. One little sequence, from mathematics all the way to nature.

### Open notes

- **Accuracy choices:**
  - **Petals:** Fibonacci counts are common but not universal, and counts vary within a species. Beat 4A.2 says so, and 4A.1 says "many marigolds" rather than "all".
  - **Beauty:** studies on whether people prefer golden proportions give mixed results, and many famous claims (the Parthenon, the Mona Lisa) don't hold up when measured. The narration presents beauty as a belief and a debate, not a fact.
  - **Nautilus shell:** it is often called a golden spiral, but it is a different logarithmic spiral. The script leaves it out on purpose; it could be added as a "myth" aside if you want.
  - **Fibonacci vs golden spiral (4C):** the spiral made of quarter circles is technically the *Fibonacci spiral*, a close approximation of the true golden spiral. The narration simplifies this; an on-screen footnote could make it exact.
- **The 4B sunflower** is easy to generate in code: seed k sits at angle k × 137.5° and radius proportional to √k (Vogel's model). The same code with 135° or 140° produces the comparison panels.
- **"Most irrational":** φ is the hardest number to approximate with fractions, because its continued fraction is all 1s. That is why the seeds never settle into rows. It's a nice extra beat if you want more depth (~8 s).

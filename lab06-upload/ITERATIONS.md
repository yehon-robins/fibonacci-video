# Lab 6 iterations

- Agent and model: Claude Code, `claude-opus-5-5` (from this project's sessions in `~/.claude/projects/`)
- Stack: Remotion (React/TypeScript) + Kokoro TTS narration (Python script, `am_adam` voice)
- Video: `out/yehonatan_robinson.mp4`, 57.1 s, 2.37 MB → 1.05 MB
- Commits: 7, from 19:09 (2026-11-15) to 16:21 (2026-11-18); median 29 minutes between commits (work spanned two sessions, with a ~67 h break between them)
- First visual: 19:35, `004cf49` (5-second Fibonacci test clip; `b4b9155` was the blank Remotion template)
- Uncommitted work: none (`git status --short` was clean; rendered videos in `out/` are not committed)

| Time | Commit | What changed | Minutes since the last |
|---|---|---|---|
| 19:09 (11-15) | `b4b9155` | Create new Remotion project from template (config, `Composition.tsx`, `Root.tsx`) | – |
| 19:35 (11-15) | `004cf49` | 5-second Fibonacci test clip with Kokoro TTS narration (`generate_audio.py`, `narration.wav`) | 25 |
| 19:42 (11-15) | `c185fe1` | Ignore locally installed agent skills in `.gitignore` | 7 |
| 20:33 (11-15) | `d939c52` | Switch narration to the `am_adam` male voice | 51 |
| 15:40 (11-18) | `e681a88` | Scene 1: Fibonacci sequence intro, per-beat narration; adds `SCRIPT.md`, `Scene1.tsx`, timing, 6 audio beats | 4027 |
| 15:49 (11-18) | `79a930c` | Scene 2: ratio of consecutive terms approaches the golden ratio; generalised audio script to all scenes | 9 |
| 16:21 (11-18) | `0d18f99` | Scene 3 proof parts 3A–3F (six scene components, shared `kit.tsx`, 20 audio beats), `fibonacci_proof.md`, Scene 4 script in `SCRIPT.md` | 32 |

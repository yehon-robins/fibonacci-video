// Shared drawings for Scene 4: the sunflower (Vogel's golden-angle model)
// and the spiral built from squares with Fibonacci sides.
import React from "react";
import { C, PHI } from "./kit";

// ---------------------------------------------------------------------------
// Sunflower
// ---------------------------------------------------------------------------

/** 360° / φ² ≈ 137.5077° */
export const GOLDEN_ANGLE = 360 / (PHI * PHI);

/** Seed n of a Vogel sunflower: angle n·θ, radius c·√n (n = 0 at the centre). */
export const seedPos = (n: number, angleDeg: number, c: number) => {
  const a = (n * angleDeg * Math.PI) / 180;
  const r = c * Math.sqrt(n + 0.5);
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
};

/** A static sunflower head of `count` seeds, drawn inside an SVG. */
export const Sunflower: React.FC<{
  count: number;
  cx: number;
  cy: number;
  radius: number;
  angle?: number;
  dot?: number;
  color?: string;
  opacity?: number;
  /** How many seeds are visible (they appear from the centre outward). */
  shown?: number;
}> = ({ count, cx, cy, radius, angle = GOLDEN_ANGLE, dot, color = C.amber, opacity = 1, shown = count }) => {
  const c = radius / Math.sqrt(count);
  const r = dot ?? c * 0.52;
  const seeds: React.ReactNode[] = [];
  for (let n = 0; n < Math.min(count, Math.ceil(shown)); n++) {
    const p = seedPos(n, angle, c);
    const grow = Math.min(1, shown - n);
    seeds.push(<circle key={n} cx={cx + p.x} cy={cy + p.y} r={r * grow} fill={color} />);
  }
  return <g opacity={opacity}>{seeds}</g>;
};

// ---------------------------------------------------------------------------
// Fibonacci squares and the spiral through them
// ---------------------------------------------------------------------------

export const SQUARE_SIDES = [1, 1, 2, 3, 5, 8, 13, 21];
type Pt = { x: number; y: number };
export type Square = { x: number; y: number; s: number };

/**
 * Squares in "unit" coordinates. Each new square is attached to the long side
 * of the rectangle built so far: right, down, left, up, right, down, left.
 * The final rectangle is 34 × 21, spanning x ∈ [-24, 10], y ∈ [-5, 16].
 */
const buildSquares = () => {
  const squares: Square[] = [{ x: 0, y: 0, s: 1 }];
  const attached: Pt[][] = [[]];
  const box = { x0: 0, y0: 0, x1: 1, y1: 1 };
  const dirs = ["r", "d", "l", "u", "r", "d", "l"];
  SQUARE_SIDES.slice(1).forEach((s, k) => {
    let x = 0;
    let y = 0;
    let side: Pt[] = [];
    if (dirs[k] === "r") {
      x = box.x1;
      y = box.y0;
      side = [{ x, y }, { x, y: y + s }];
    } else if (dirs[k] === "d") {
      x = box.x0;
      y = box.y1;
      side = [{ x, y }, { x: x + s, y }];
    } else if (dirs[k] === "l") {
      x = box.x0 - s;
      y = box.y0;
      side = [{ x: x + s, y }, { x: x + s, y: y + s }];
    } else {
      x = box.x0;
      y = box.y0 - s;
      side = [{ x, y: y + s }, { x: x + s, y: y + s }];
    }
    squares.push({ x, y, s });
    attached.push(side);
    box.x0 = Math.min(box.x0, x);
    box.y0 = Math.min(box.y0, y);
    box.x1 = Math.max(box.x1, x + s);
    box.y1 = Math.max(box.y1, y + s);
  });
  return { squares, attached };
};

const corners = (q: Square): Pt[] => [
  { x: q.x, y: q.y },
  { x: q.x + q.s, y: q.y },
  { x: q.x, y: q.y + q.s },
  { x: q.x + q.s, y: q.y + q.s },
];
const same = (a: Pt, b: Pt) => Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9;
// The two corners of square q that share an edge with corner p.
const neighbours = (q: Square, p: Pt): Pt[] => [
  { x: p.x === q.x ? q.x + q.s : q.x, y: p.y },
  { x: p.x, y: p.y === q.y ? q.y + q.s : q.y },
];

type Arc = { center: Pt; from: Pt; to: Pt; r: number };

/** Quarter circles, one per square, joined end to end (found by search). */
const buildArcs = (squares: Square[], attached: Pt[][]): Arc[] => {
  for (const p0 of corners(squares[0])) {
    for (const start of neighbours(squares[0], p0)) {
      const end0 = neighbours(squares[0], p0).find((q) => !same(q, start))!;
      const arcs: Arc[] = [{ center: p0, from: start, to: end0, r: 1 }];
      let ok = true;
      for (let k = 1; k < squares.length && ok; k++) {
        const prevEnd = arcs[k - 1].to;
        const found = attached[k]
          .map((p) => ({ p, nb: neighbours(squares[k], p) }))
          .find(({ nb }) => nb.some((q) => same(q, prevEnd)));
        if (!found) ok = false;
        else {
          const to = found.nb.find((q) => !same(q, prevEnd))!;
          arcs.push({ center: found.p, from: prevEnd, to, r: squares[k].s });
        }
      }
      // Every join must be smooth: both centres lie on the same ray from the
      // shared point, so the arcs share a tangent and keep turning the same way.
      const smooth = (k: number) => {
        const e = arcs[k].to;
        const a = { x: arcs[k].center.x - e.x, y: arcs[k].center.y - e.y };
        const b = { x: arcs[k + 1].center.x - e.x, y: arcs[k + 1].center.y - e.y };
        return Math.abs(a.x * b.y - a.y * b.x) < 1e-9 && a.x * b.x + a.y * b.y > 0;
      };
      if (ok && arcs.slice(0, -1).every((_, k) => smooth(k))) return arcs;
    }
  }
  throw new Error("no continuous spiral found");
};

const built = buildSquares();
export const SQUARES = built.squares;
export const ARCS = buildArcs(built.squares, built.attached);

/** Sampled points of arc k (unit coordinates). */
export const arcPoints = (k: number, samples = 24): Pt[] => {
  const { center, from, to, r } = ARCS[k];
  const a0 = Math.atan2(from.y - center.y, from.x - center.x);
  let a1 = Math.atan2(to.y - center.y, to.x - center.x);
  while (a1 - a0 > Math.PI) a1 -= 2 * Math.PI;
  while (a1 - a0 < -Math.PI) a1 += 2 * Math.PI;
  return Array.from({ length: samples + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / samples;
    return { x: center.x + r * Math.cos(a), y: center.y + r * Math.sin(a) };
  });
};

/**
 * The point the spiral winds into (unit coordinates): where the diagonal of the
 * 34 × 21 rectangle crosses the diagonal of the 13 × 21 rectangle left after
 * removing the biggest square.
 */
export const SPIRAL_EYE = { x: 0.596, y: 0.81 };

/** Bounding box (unit coordinates) of the first `k` squares. */
export const squaresBox = (k: number) => {
  const qs = SQUARES.slice(0, Math.max(1, k));
  return {
    x0: Math.min(...qs.map((q) => q.x)),
    y0: Math.min(...qs.map((q) => q.y)),
    x1: Math.max(...qs.map((q) => q.x + q.s)),
    y1: Math.max(...qs.map((q) => q.y + q.s)),
  };
};

/**
 * The spiral as one SVG path, drawn progressively with `progress` (0..1, one
 * eighth per square). `toScreen` maps unit coordinates to pixels.
 */
export const SpiralPath: React.FC<{
  progress: number;
  toScreen: (p: Pt) => Pt;
  width?: number;
  color?: string;
  opacity?: number;
}> = ({ progress, toScreen, width = 4, color = C.amber, opacity = 1 }) => {
  const total = ARCS.length;
  const parts: React.ReactNode[] = [];
  for (let k = 0; k < total; k++) {
    const p = Math.max(0, Math.min(1, progress * total - k));
    if (p <= 0) break;
    const pts = arcPoints(k).map(toScreen);
    const d = pts.map((q, i) => `${i === 0 ? "M" : "L"} ${q.x.toFixed(2)} ${q.y.toFixed(2)}`).join(" ");
    parts.push(
      <path
        key={k}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />,
    );
  }
  return <g opacity={opacity}>{parts}</g>;
};

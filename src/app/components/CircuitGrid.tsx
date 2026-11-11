"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

const GRID = 40;
const TRACE_COUNT = 8;
// Only every Nth trace carries a running light, so fewer lights travel at once.
const PULSE_STEP = 2;

interface Trace {
  d: string;
  duration: number;
  delay: number;
  width: number;
}

// Small deterministic PRNG so the traces stay stable across re-renders.
const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// Builds a Manhattan-style (right-angle) path that snaps to the grid so the
// pulses look like they run along circuit-board traces.
const walk = (
  rand: () => number,
  width: number,
  height: number,
  startX: number,
  startY: number,
  turns: number,
  maxStep: number,
) => {
  const cols = Math.max(2, Math.floor(width / GRID) - 1);
  const rows = Math.max(2, Math.floor(height / GRID) - 1);
  const maxX = cols * GRID;
  const maxY = rows * GRID;

  let x = clamp(startX, GRID, maxX);
  let y = clamp(startY, GRID, maxY);

  const parts = [`M ${x} ${y}`];
  let horizontal = rand() > 0.5;

  for (let i = 0; i < turns; i++) {
    const length = (1 + Math.floor(rand() * maxStep)) * GRID;
    const direction = rand() > 0.5 ? 1 : -1;

    if (horizontal) {
      const next = clamp(x + direction * length, GRID, maxX);
      if (next !== x) parts.push(`H ${next}`);
      x = next;
    } else {
      const next = clamp(y + direction * length, GRID, maxY);
      if (next !== y) parts.push(`V ${next}`);
      y = next;
    }

    horizontal = !horizontal;
  }

  return parts.join(" ");
};

// Static board traces, seeded into horizontal lanes so the board covers the
// full card height.
const buildTrace = (
  rand: () => number,
  width: number,
  height: number,
  lane: number,
  lanes: number,
): Trace => {
  const cols = Math.max(2, Math.floor(width / GRID) - 1);
  const rows = Math.max(2, Math.floor(height / GRID) - 1);

  const startRow = clamp(
    1 + Math.round(((lane + 0.5) / lanes) * (rows - 1)),
    1,
    rows,
  );
  const startCol = 1 + Math.floor(rand() * Math.max(1, cols - 1));

  return {
    d: walk(
      rand,
      width,
      height,
      startCol * GRID,
      startRow * GRID,
      7 + Math.floor(rand() * 8),
      4,
    ),
    // Calm, even pacing — one full lap takes 3–5s so the fade reads clearly.
    duration: 3 + rand() * 2,
    delay: -rand() * 2,
    width: 1.4 + rand() * 1.2,
  };
};

// Each running light gets a brand-new, wider random route every lap instead of
// looping on the same circuit line.
const buildPulseRoute = (rand: () => number, width: number, height: number) => {
  const cols = Math.max(2, Math.floor(width / GRID) - 1);
  const rows = Math.max(2, Math.floor(height / GRID) - 1);

  const startCol = 1 + Math.floor(rand() * Math.max(1, cols - 1));
  const startRow = 1 + Math.floor(rand() * Math.max(1, rows - 1));

  return walk(
    rand,
    width,
    height,
    startCol * GRID,
    startRow * GRID,
    10 + Math.floor(rand() * 10),
    6,
  );
};

interface PulseProps {
  pulse: Trace;
  width: number;
  height: number;
  seed: number;
}

// A single running light. Every time it finishes a lap it picks a new random
// route across the board instead of repeating the same circuit line.
const Pulse = ({ pulse, width, height, seed }: PulseProps) => {
  const [route, setRoute] = useState(pulse.d);
  const randomRef = useRef<(() => number) | null>(null);

  useEffect(() => {
    randomRef.current = mulberry32((Date.now() ^ (seed * 2654435761)) >>> 0);
  }, [seed]);

  const handleIteration = () => {
    if (!randomRef.current) {
      randomRef.current = mulberry32(seed);
    }

    setRoute(buildPulseRoute(randomRef.current, width, height));
  };

  return (
    <g
      className="circuit-fade"
      style={
        {
          "--circuit-duration": `${pulse.duration}s`,
          "--circuit-delay": `${pulse.delay}s`,
        } as CSSProperties
      }
    >
      {/* The active pathway the light is currently running on */}
      <path d={route} fill="none" className="circuit-route" strokeWidth="1.5" />
      <g
        className="circuit-hue"
        style={{ "--circuit-delay": `${pulse.delay}s` } as CSSProperties}
      >
        <path
          d={route}
          fill="none"
          pathLength={1000}
          className="circuit-pulse"
          strokeWidth={pulse.width}
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={
            {
              "--circuit-duration": `${pulse.duration}s`,
              "--circuit-delay": `${pulse.delay}s`,
            } as CSSProperties
          }
          onAnimationIteration={handleIteration}
        />
      </g>
    </g>
  );
};

const CircuitGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const traces = useMemo(() => {
    if (size.width === 0 || size.height === 0) return [];

    const rand = mulberry32(0x5eed);
    return Array.from({ length: TRACE_COUNT }, (_, index) =>
      buildTrace(rand, size.width, size.height, index, TRACE_COUNT),
    );
  }, [size.width, size.height]);

  const pulses = useMemo(
    () => traces.filter((_, index) => index % PULSE_STEP === 0),
    [traces],
  );

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
      aria-hidden="true"
    >
      <div className="circuit-grid absolute inset-0" />
      {size.width > 0 && size.height > 0 && (
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
        >
          {/* Static board grid */}
          {traces.map((trace, index) => (
            <path
              key={`trace-${index}`}
              d={trace.d}
              fill="none"
              className="circuit-trace"
              strokeWidth="1.5"
            />
          ))}

          {/* Running lights */}
          {pulses.map((pulse, index) => (
            <Pulse
              key={`pulse-${index}-${size.width}x${size.height}`}
              pulse={pulse}
              width={size.width}
              height={size.height}
              seed={index + 1}
            />
          ))}
        </svg>
      )}
    </div>
  );
};

export default CircuitGrid;

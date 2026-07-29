import { useRef, useEffect, useState, useId, memo } from 'react';
import { interpolateRgb } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';

const PX = 450;
const PY = 505;
const L = 380;
const EY = -330;

/** Crop with ~5% inner padding so feathers breathe at full spread */
const VBX = 124;
const VBY = 149;
const VBW = 652;
const VBH = 577;
const VIEWBOX = `${VBX} ${VBY} ${VBW} ${VBH}`;
const FAN_ASPECT = `${VBW} / ${VBH}`;

const REST_X = PX;
const REST_Y = 180;

const TEAL = '#0F6E56';
const JADE = '#1D9E75';
const TURQ = '#38D9C0';
const COBALT = '#2C6BD4';
const NAVY = '#061A3A';
const BRONZE = '#B8862B';
const GOLD = '#F0C46A';

type Barb = { k: number; left: string; right: string; c: string; o: number; s: number };
type WebLine = { k: number; d: string };

function buildGeometry() {
  const lower = interpolateRgb(TEAL, JADE);
  const upper = interpolateRgb(JADE, COBALT);
  const barbColor = (t: number) => (t < 0.55 ? lower(t / 0.55) : upper((t - 0.55) / 0.45));

  const width = scaleLinear().domain([0, 1]).range([74, 11]);
  const opacity = scaleLinear().domain([0, 1]).range([0.26, 0.62]);
  const stroke = scaleLinear().domain([0, 1]).range([0.8, 0.42]);

  const barbs: Barb[] = [];
  const N = 92;
  for (let i = 0; i < N; i++) {
    const t = Math.pow(i / (N - 1), 0.88);
    const y = -16 - t * (L * 0.83);
    const w = width(Math.pow(t, 1.5));
    const qx = w * 0.45;
    const qy = y - w * 0.3;
    const ey = y - w * 0.78;
    barbs.push({
      k: i,
      left: `M0 ${y.toFixed(1)} Q ${-qx.toFixed(1)} ${qy.toFixed(1)} ${-w.toFixed(1)} ${ey.toFixed(1)}`,
      right: `M0 ${y.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${w.toFixed(1)} ${ey.toFixed(1)}`,
      c: barbColor(t),
      o: Number(opacity(t).toFixed(3)),
      s: Number(stroke(t).toFixed(3)),
    });
  }

  const web: WebLine[] = [];
  for (let j = 0; j < 76; j++) {
    const a = (j / 76) * Math.PI * 2;
    const cx = Math.cos(a);
    const cy = Math.sin(a);
    web.push({
      k: j,
      d: `M${(cx * 36).toFixed(1)} ${(EY + cy * 44).toFixed(1)} L${(cx * 64).toFixed(1)} ${(EY + cy * 74 - 8).toFixed(1)}`,
    });
  }

  return { barbs, web };
}

const GEOMETRY = buildGeometry();

const FeatherDefs = memo(function FeatherDefs({ uid }: { uid: string }) {
  const { barbs, web } = GEOMETRY;
  return (
    <defs>
      <radialGradient id={`${uid}-core`} cx="42%" cy="34%" r="72%">
        <stop offset="0%" stopColor="#1E4E9C" />
        <stop offset="58%" stopColor={NAVY} />
        <stop offset="100%" stopColor="#020A18" />
      </radialGradient>

      <radialGradient id={`${uid}-glint`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="22%" stopColor="#EAFBFF" stopOpacity="0.46" />
        <stop offset="52%" stopColor="#9FE8FF" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#9FE8FF" stopOpacity="0" />
      </radialGradient>

      <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      <g id={`${uid}-feather`}>
        <path d={`M0 0 C -6 -140 -6 -240 0 ${EY + 42}`} fill="none" stroke={GOLD} strokeWidth="2.4" strokeOpacity="0.4" />
        {barbs.map((b) => (
          <g key={b.k}>
            <path d={b.left} fill="none" stroke={b.c} strokeWidth={b.s} strokeOpacity={b.o} strokeLinecap="round" />
            <path d={b.right} fill="none" stroke={b.c} strokeWidth={b.s} strokeOpacity={b.o} strokeLinecap="round" />
          </g>
        ))}
        {web.map((w) => (
          <path key={w.k} d={w.d} stroke={JADE} strokeWidth="0.9" strokeOpacity="0.4" strokeLinecap="round" />
        ))}
        <ellipse cx="0" cy={EY} rx="42" ry="51" fill={BRONZE} fillOpacity="0.3" />
        <ellipse cx="0" cy={EY} rx="36" ry="44" fill="#7E9B3C" fillOpacity="0.9" />
        <ellipse cx="0" cy={EY + 1} rx="29" ry="35" fill="#6B4A12" fillOpacity="0.92" />
        <ellipse cx="0" cy={EY + 1} rx="23" ry="28" fill={TURQ} fillOpacity="0.95" />
        <ellipse cx="0" cy={EY + 2} rx="18" ry="22" fill={COBALT} />
        <path
          transform={`translate(0 ${EY + 2})`}
          d="M0 -8 C -4 -21 -19 -19 -19 -4 C -19 9 -7 15 0 22 C 7 15 19 9 19 -4 C 19 -19 4 -21 0 -8 Z"
          fill={`url(#${uid}-core)`}
        />
        <path
          transform={`translate(0 ${EY + 2})`}
          d="M0 -8 C -4 -21 -19 -19 -19 -4"
          fill="none"
          stroke={`url(#${uid}-rim)`}
          strokeWidth="1.4"
        />
      </g>
    </defs>
  );
});

type Props = { count?: number; className?: string };

export default function PeacockFan({ count = 11, className = '' }: Props) {
  const uid = useId().replace(/:/g, '');
  const [reduced, setReduced] = useState(false);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const featherRefs = useRef<(SVGUseElement | null)[]>([]);
  const glintRefs = useRef<(SVGGElement | null)[]>([]);
  const sheenRef = useRef<HTMLDivElement | null>(null);

  const pointer = useRef({ cx: 0, cy: 0, active: false });
  const target = useRef({ spread: 0.6, tilt: 0, mx: REST_X, my: REST_Y });
  const current = useRef({ spread: 0.6, tilt: 0, mx: REST_X, my: REST_Y });
  const visible = useRef(true);

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(q.matches);
    on();
    q.addEventListener('change', on);
    return () => q.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const onPointer = (e: PointerEvent) => {
      pointer.current.cx = e.clientX;
      pointer.current.cy = e.clientY;
      pointer.current.active = true;
    };
    const onLeave = () => {
      pointer.current.active = false;
      target.current.spread = 0.6;
      target.current.tilt = 0;
      target.current.mx = REST_X;
      target.current.my = REST_Y;
    };

    shell.addEventListener('pointermove', onPointer, { passive: true });
    shell.addEventListener('pointerleave', onLeave);
    shell.addEventListener('pointercancel', onLeave);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
      },
      { rootMargin: '120px' },
    );
    io.observe(shell);

    return () => {
      shell.removeEventListener('pointermove', onPointer);
      shell.removeEventListener('pointerleave', onLeave);
      shell.removeEventListener('pointercancel', onLeave);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const paint = (spread: number, tilt: number, mx: number, my: number) => {
      const arc = 116 * spread + 18;
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const deg = (t - 0.5) * 2 * arc + tilt * 20;
        const d = Math.abs(t - 0.5) * 2;
        const sc = 0.7 + 0.3 * (1 - d * 0.5) * (0.6 + spread * 0.4);

        const g = featherRefs.current[i];
        if (g) g.setAttribute('transform', `translate(${PX} ${PY}) rotate(${deg.toFixed(2)}) scale(${sc.toFixed(3)})`);

        const rad = (deg * Math.PI) / 180;
        const ex = PX - EY * sc * Math.sin(rad);
        const ey = PY + EY * sc * Math.cos(rad);

        const vx = mx - ex;
        const vy = my - ey;
        const len = Math.hypot(vx, vy) || 1;
        const reach = 9 * sc;

        const glint = glintRefs.current[i];
        if (glint) {
          glint.setAttribute(
            'transform',
            `translate(${(ex + (vx / len) * reach).toFixed(1)} ${(ey + (vy / len) * reach).toFixed(1)}) scale(${sc.toFixed(3)})`,
          );
          glint.setAttribute('opacity', (0.34 + 0.46 * (1 - Math.min(1, len / 460))).toFixed(3));
        }
      }
    };

    if (reduced) {
      paint(0.6, 0, REST_X, 150);
      return;
    }

    let raf = 0;
    const t0 = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible.current) return;

      if (pointer.current.active) {
        const r = shell.getBoundingClientRect();
        const nx = (pointer.current.cx - r.left) / r.width;
        const ny = (pointer.current.cy - r.top) / r.height;
        target.current.tilt = (nx - 0.5) * 2;
        target.current.spread = 1 - Math.min(1, Math.max(0, ny));
        target.current.mx = VBX + nx * VBW;
        target.current.my = VBY + ny * VBH;
      }

      const c = current.current;
      const tg = target.current;
      const idle = Math.sin((now - t0) / 2600) * 0.04;
      c.spread += (tg.spread + idle - c.spread) / 9;
      c.tilt += (tg.tilt - c.tilt) / 9;
      c.mx += (tg.mx - c.mx) / 7;
      c.my += (tg.my - c.my) / 7;

      paint(c.spread, c.tilt, c.mx, c.my);

      if (sheenRef.current) {
        const sx = ((c.mx - VBX) / VBW) * 100;
        const sy = ((c.my - VBY) / VBH) * 100;
        sheenRef.current.style.transform = `translate3d(${sx.toFixed(2)}cqw, ${sy.toFixed(2)}cqh, 0) translate(-50%, -50%)`;
      }
      return;
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [count, reduced]);

  const indices = Array.from({ length: count }, (_, i) => i);

  return (
    <div
      ref={shellRef}
      style={{ containerType: 'size', contain: 'layout paint', aspectRatio: FAN_ASPECT }}
      className={`relative w-full cursor-crosshair touch-pan-y overflow-hidden rounded-2xl border border-white/10 bg-[#071018] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_108%,rgba(15,110,86,0.35),transparent_72%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_center_bottom,rgba(240,196,106,0.14),transparent_68%)]"
      />

      <svg
        viewBox={VIEWBOX}
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Interactive peacock feather fan that spreads and catches light as the cursor moves."
      >
        <FeatherDefs uid={uid} />

        <g>
          {indices.map((i) => (
            <use
              key={i}
              href={`#${uid}-feather`}
              ref={(el) => {
                featherRefs.current[i] = el;
              }}
            />
          ))}
        </g>

        <g style={{ mixBlendMode: 'screen' }}>
          {indices.map((i) => (
            <g
              key={i}
              ref={(el) => {
                glintRefs.current[i] = el;
              }}
            >
              <ellipse cx="0" cy="0" rx="26" ry="20" fill={`url(#${uid}-glint)`} />
            </g>
          ))}
        </g>
      </svg>

      <div
        ref={sheenRef}
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '84cqw',
          height: '84cqh',
          willChange: 'transform',
          background: 'radial-gradient(circle, rgba(255,255,255,0.10), rgba(255,255,255,0) 62%)',
        }}
        className="pointer-events-none mix-blend-screen"
      />
    </div>
  );
}
















// import { useRef, useEffect, useState, useId, memo } from 'react';
// import { interpolateRgb } from 'd3-interpolate';
// import { scaleLinear } from 'd3-scale';

// const PX = 450;
// const PY = 505;
// const L = 380;
// const EY = -330;

// const VBX = 120;
// const VBY = 40;
// const VBW = 660;
// const VBH = 470;
// const VIEWBOX = `${VBX} ${VBY} ${VBW} ${VBH}`;

// const REST_X = PX;
// const REST_Y = 180;

// const EYE_RX = 46;
// const EYE_RY = 57;

// function mulberry32(a: number) {
//   return function () {
//     a |= 0;
//     a = (a + 0x6d2b79f5) | 0;
//     let t = Math.imul(a ^ (a >>> 15), 1 | a);
//     t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }

// type Barb = { k: number; d: string; c: string; o: number; s: number };
// type Strand = { k: number; d: string; o: number };

// function buildGeometry() {
//   const rnd = mulberry32(20260726);

//   const vane = scaleLinear<string>()
//     .domain([0, 0.3, 0.6, 0.85, 1])
//     .range(['#3F4D1E', '#1E6B4A', '#15887A', '#1C7FB8', '#2E6FC4'])
//     .interpolate(interpolateRgb);

//   const opacity = scaleLinear().domain([0, 0.45, 1]).range([0.22, 0.5, 0.66]);
//   const stroke = scaleLinear().domain([0, 1]).range([0.9, 0.4]);

//   const barbs: Barb[] = [];
//   const N = 116;
//   for (let i = 0; i < N; i++) {
//     const t = Math.pow(i / (N - 1), 0.86);
//     const y = -14 - t * (L * 0.845);
//     const env = 78 * Math.pow(1 - Math.pow(t, 1.35), 0.85) + 11;

//     for (const dir of [-1, 1]) {
//       const jitter = 0.86 + rnd() * 0.28;
//       const w = env * jitter * dir;
//       const lift = Math.abs(w);
//       const c1x = w * 0.3;
//       const c1y = y - lift * 0.28;
//       const c2x = w * 0.72;
//       const c2y = y - lift * 0.6;
//       const ex = w;
//       const ey = y - lift * (0.36 + rnd() * 0.1);
//       barbs.push({
//         k: i * 2 + (dir > 0 ? 1 : 0),
//         d: `M0 ${y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
//         c: vane(Math.min(1, t + (rnd() - 0.5) * 0.07)),
//         o: Number((opacity(t) * (0.78 + rnd() * 0.34)).toFixed(3)),
//         s: Number((stroke(t) * (0.8 + rnd() * 0.5)).toFixed(3)),
//       });
//     }
//   }

//   const pts: string[] = [];
//   const SEG = 150;
//   for (let i = 0; i < SEG; i++) {
//     const a = (i / SEG) * Math.PI * 2 - Math.PI / 2;
//     const wob =
//       1 + 0.034 * Math.sin(5 * a + 1.2) + 0.022 * Math.sin(11 * a + 0.4) + 0.016 * Math.sin(19 * a + 2.1) + (rnd() - 0.5) * 0.026;
//     const x = Math.cos(a) * EYE_RX * wob;
//     const y = EY + Math.sin(a) * EYE_RY * wob;
//     pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
//   }
//   const ocellusPath = `M${pts.join(' L')} Z`;

//   const strands: Strand[] = [];
//   const SN = 132;
//   for (let j = 0; j < SN; j++) {
//     const a = (j / SN) * Math.PI * 2 - Math.PI / 2;
//     const ca = Math.cos(a);
//     const sa = Math.sin(a);
//     const r0 = 0.2 + rnd() * 0.06;
//     const r1 = 0.95 + rnd() * 0.09;
//     strands.push({
//       k: j,
//       d: `M${(ca * EYE_RX * r0).toFixed(1)} ${(EY + sa * EYE_RY * r0).toFixed(1)} L${(ca * EYE_RX * r1).toFixed(1)} ${(EY + sa * EYE_RY * r1).toFixed(1)}`,
//       o: Number((0.1 + rnd() * 0.16).toFixed(3)),
//     });
//   }

//   return { barbs, ocellusPath, strands };
// }

// const GEOMETRY = buildGeometry();

// const HEART =
//   'M0 -5 C -2 -15 -9 -19 -14 -15 C -19 -11 -19 -1 -15 5 C -11 11 -5 16 0 21 C 5 16 11 11 15 5 C 19 -1 19 -11 14 -15 C 9 -19 2 -15 0 -5 Z';

// const FeatherDefs = memo(function FeatherDefs({ uid }: { uid: string }) {
//   const { barbs, ocellusPath, strands } = GEOMETRY;
//   return (
//     <defs>
//       <radialGradient id={`${uid}-ocellus`} cx="50%" cy="47%" r="52%">
//         <stop offset="0%" stopColor="#0C2444" />
//         <stop offset="26%" stopColor="#12447E" />
//         <stop offset="34%" stopColor="#1C86C4" />
//         <stop offset="41%" stopColor="#2BB6A8" />
//         <stop offset="49%" stopColor="#7A6320" />
//         <stop offset="60%" stopColor="#A88530" />
//         <stop offset="70%" stopColor="#8FA13C" />
//         <stop offset="82%" stopColor="#5F7A2C" />
//         <stop offset="92%" stopColor="#6E5622" />
//         <stop offset="100%" stopColor="#4A3A18" />
//       </radialGradient>

//       <radialGradient id={`${uid}-heart`} cx="40%" cy="30%" r="78%">
//         <stop offset="0%" stopColor="#22599E" />
//         <stop offset="45%" stopColor="#0B234A" />
//         <stop offset="100%" stopColor="#02091A" />
//       </radialGradient>

//       <linearGradient id={`${uid}-sheen`} x1="0.2" y1="0" x2="0.8" y2="1">
//         <stop offset="0%" stopColor="#BFF6FF" stopOpacity="0.22" />
//         <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.05" />
//         <stop offset="100%" stopColor="#0B2A4A" stopOpacity="0.18" />
//       </linearGradient>

//       <radialGradient id={`${uid}-glint`} cx="50%" cy="50%" r="50%">
//         <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
//         <stop offset="22%" stopColor="#EAFBFF" stopOpacity="0.46" />
//         <stop offset="52%" stopColor="#9FE8FF" stopOpacity="0.15" />
//         <stop offset="100%" stopColor="#9FE8FF" stopOpacity="0" />
//       </radialGradient>

//       <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="0" y2="1">
//         <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
//         <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
//       </linearGradient>

//       <g id={`${uid}-feather`}>
//         <path d={`M0 0 C -6 -140 -6 -240 0 ${EY + 46}`} fill="none" stroke="#C9A24E" strokeWidth="2.6" strokeOpacity="0.32" />
//         <path d={`M0 0 C -6 -140 -6 -240 0 ${EY + 46}`} fill="none" stroke="#F4D68C" strokeWidth="0.9" strokeOpacity="0.34" />

//         {barbs.map((b) => (
//           <path key={b.k} d={b.d} fill="none" stroke={b.c} strokeWidth={b.s} strokeOpacity={b.o} strokeLinecap="round" />
//         ))}

//         <path d={ocellusPath} fill={`url(#${uid}-ocellus)`} />
//         <g clipPath={`url(#${uid}-clip)`}>
//           {strands.map((s) => (
//             <path key={s.k} d={s.d} stroke="#FFF3C4" strokeWidth="0.7" strokeOpacity={s.o} strokeLinecap="round" />
//           ))}
//         </g>
//         <path d={ocellusPath} fill={`url(#${uid}-sheen)`} />

//         <path transform={`translate(0 ${EY - 2})`} d={HEART} fill={`url(#${uid}-heart)`} />
//         <path
//           transform={`translate(0 ${EY - 2})`}
//           d="M0 -5 C -2 -15 -9 -19 -14 -15 C -19 -11 -19 -1 -15 5"
//           fill="none"
//           stroke={`url(#${uid}-rim)`}
//           strokeWidth="1.5"
//         />
//       </g>

//       <clipPath id={`${uid}-clip`}>
//         <path d={ocellusPath} />
//       </clipPath>
//     </defs>
//   );
// });

// type Props = { count?: number };

// export default function PeacockFan({ count = 11 }: Props) {
//   const uid = useId().replace(/:/g, '');
//   const [reduced, setReduced] = useState(false);

//   const shellRef = useRef<HTMLDivElement | null>(null);
//   const featherRefs = useRef<(SVGUseElement | null)[]>([]);
//   const glintRefs = useRef<(SVGGElement | null)[]>([]);
//   const sheenRef = useRef<HTMLDivElement | null>(null);

//   const pointer = useRef({ cx: 0, cy: 0, active: false });
//   const target = useRef({ spread: 0.6, tilt: 0, mx: REST_X, my: REST_Y });
//   const current = useRef({ spread: 0.6, tilt: 0, mx: REST_X, my: REST_Y });
//   const visible = useRef(true);

//   useEffect(() => {
//     const q = window.matchMedia('(prefers-reduced-motion: reduce)');
//     const on = () => setReduced(q.matches);
//     on();
//     q.addEventListener('change', on);
//     return () => q.removeEventListener('change', on);
//   }, []);

//   useEffect(() => {
//     const shell = shellRef.current;
//     if (!shell) return;

//     const onPointer = (e: PointerEvent) => {
//       pointer.current.cx = e.clientX;
//       pointer.current.cy = e.clientY;
//       pointer.current.active = true;
//     };
//     const onLeave = () => {
//       pointer.current.active = false;
//       target.current.spread = 0.6;
//       target.current.tilt = 0;
//       target.current.mx = REST_X;
//       target.current.my = REST_Y;
//     };

//     shell.addEventListener('pointermove', onPointer, { passive: true });
//     shell.addEventListener('pointerleave', onLeave);
//     shell.addEventListener('pointercancel', onLeave);

//     const io = new IntersectionObserver(([entry]) => {
//       visible.current = entry.isIntersecting;
//     }, { rootMargin: '120px' });
//     io.observe(shell);

//     return () => {
//       shell.removeEventListener('pointermove', onPointer);
//       shell.removeEventListener('pointerleave', onLeave);
//       shell.removeEventListener('pointercancel', onLeave);
//       io.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const shell = shellRef.current;
//     if (!shell) return;

//     const paint = (spread: number, tilt: number, mx: number, my: number) => {
//       const arc = 116 * spread + 18;
//       for (let i = 0; i < count; i++) {
//         const t = count === 1 ? 0.5 : i / (count - 1);
//         const deg = (t - 0.5) * 2 * arc + tilt * 20;
//         const d = Math.abs(t - 0.5) * 2;
//         const sc = 0.7 + 0.3 * (1 - d * 0.5) * (0.6 + spread * 0.4);

//         const g = featherRefs.current[i];
//         if (g) g.setAttribute('transform', `translate(${PX} ${PY}) rotate(${deg.toFixed(2)}) scale(${sc.toFixed(3)})`);

//         const rad = (deg * Math.PI) / 180;
//         const ex = PX - EY * sc * Math.sin(rad);
//         const ey = PY + EY * sc * Math.cos(rad);
//         const vx = mx - ex;
//         const vy = my - ey;
//         const len = Math.hypot(vx, vy) || 1;
//         const reach = 10 * sc;

//         const glint = glintRefs.current[i];
//         if (glint) {
//           glint.setAttribute(
//             'transform',
//             `translate(${(ex + (vx / len) * reach).toFixed(1)} ${(ey + (vy / len) * reach).toFixed(1)}) scale(${sc.toFixed(3)})`,
//           );
//           glint.setAttribute('opacity', (0.3 + 0.5 * (1 - Math.min(1, len / 460))).toFixed(3));
//         }
//       }
//     };

//     if (reduced) {
//       paint(0.6, 0, REST_X, 150);
//       return;
//     }

//     let raf = 0;
//     const t0 = performance.now();

//     const loop = (now: number) => {
//       raf = requestAnimationFrame(loop);
//       if (!visible.current) return;

//       if (pointer.current.active) {
//         const r = shell.getBoundingClientRect();
//         const nx = (pointer.current.cx - r.left) / r.width;
//         const ny = (pointer.current.cy - r.top) / r.height;
//         target.current.tilt = (nx - 0.5) * 2;
//         target.current.spread = 1 - Math.min(1, Math.max(0, ny));
//         target.current.mx = VBX + nx * VBW;
//         target.current.my = VBY + ny * VBH;
//       }

//       const c = current.current;
//       const tg = target.current;
//       const idle = Math.sin((now - t0) / 2600) * 0.04;
//       c.spread += (tg.spread + idle - c.spread) / 9;
//       c.tilt += (tg.tilt - c.tilt) / 9;
//       c.mx += (tg.mx - c.mx) / 7;
//       c.my += (tg.my - c.my) / 7;

//       paint(c.spread, c.tilt, c.mx, c.my);

//       if (sheenRef.current) {
//         const sx = ((c.mx - VBX) / VBW) * 100;
//         const sy = ((c.my - VBY) / VBH) * 100;
//         sheenRef.current.style.transform = `translate3d(${sx.toFixed(2)}cqw, ${sy.toFixed(2)}cqh, 0) translate(-50%, -50%)`;
//       }
//     };

//     raf = requestAnimationFrame(loop);
//     return () => cancelAnimationFrame(raf);
//   }, [count, reduced]);

//   const indices = Array.from({ length: count }, (_, i) => i);

//   return (
//     <div
//       ref={shellRef}
//       style={{ containerType: 'size', contain: 'layout paint' }}
//       className="relative w-full min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] max-h-[680px] cursor-crosshair touch-pan-y overflow-hidden rounded-xl border border-white/10 bg-[#071018] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:rounded-2xl"
//     >
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_108%,rgba(15,110,86,0.35),transparent_72%)]"
//       />
//       <div
//         aria-hidden
//         className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_center_bottom,rgba(240,196,106,0.14),transparent_68%)]"
//       />

//       <svg
//         viewBox={VIEWBOX}
//         preserveAspectRatio="xMidYMax meet"
//         className="absolute inset-0 h-full w-full"
//         role="img"
//         aria-label="Interactive peacock feather fan that spreads and catches light as the cursor moves."
//       >
//         <FeatherDefs uid={uid} />

//         <g>
//           {indices.map((i) => (
//             <use
//               key={i}
//               href={`#${uid}-feather`}
//               ref={(el) => {
//                 featherRefs.current[i] = el;
//               }}
//             />
//           ))}
//         </g>

//         <g style={{ mixBlendMode: 'screen' }}>
//           {indices.map((i) => (
//             <g
//               key={i}
//               ref={(el) => {
//                 glintRefs.current[i] = el;
//               }}
//             >
//               <ellipse cx="0" cy="0" rx="26" ry="20" fill={`url(#${uid}-glint)`} />
//             </g>
//           ))}
//         </g>
//       </svg>

//       <div
//         ref={sheenRef}
//         aria-hidden
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '84cqw',
//           height: '84cqh',
//           willChange: 'transform',
//           background: 'radial-gradient(circle, rgba(255,255,255,0.10), rgba(255,255,255,0) 62%)',
//         }}
//         className="pointer-events-none mix-blend-screen"
//       />
//     </div>
//   );
// }
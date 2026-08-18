import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { INDIA_SVG_MAP } from '@vishalvoid/react-india-map';
import {
  REFEX_BUSINESS_VERTICALS,
  REFEX_STATE_PRESENCE,
  type StatePresence,
} from '../data/indiaPresenceData';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';

const VERTICAL_BY_NAME = Object.fromEntries(
  REFEX_BUSINESS_VERTICALS.map((vertical) => [vertical.name, vertical]),
);

function getVerticalChip(name: string) {
  const vertical = VERTICAL_BY_NAME[name];
  return {
    label: vertical?.shortLabel ?? name,
    accent: vertical?.accent ?? '#7cd244',
  };
}

function getVerticalColors(stateId: string, presenceById: Record<string, StatePresence>): string[] {
  const presence = presenceById[stateId];
  if (!presence) return [];
  return presence.verticals.map((name) => getVerticalChip(name).accent);
}

function gradientIdForState(stateId: string) {
  const safeId = stateId.replace(/[^a-zA-Z0-9-]/g, '');
  return `presence-${safeId}-hover`;
}

function createGradient(
  doc: Document,
  id: string,
  colors: string[],
  opacity: number,
) {
  const NS = 'http://www.w3.org/2000/svg';
  const gradient = doc.createElementNS(NS, 'linearGradient');
  gradient.setAttribute('id', id);
  gradient.setAttribute('gradientUnits', 'objectBoundingBox');
  gradient.setAttribute('x1', '0');
  gradient.setAttribute('y1', '0');
  gradient.setAttribute('x2', '1');
  gradient.setAttribute('y2', '1');

  if (colors.length === 1) {
    const stop = doc.createElementNS(NS, 'stop');
    stop.setAttribute('offset', '0%');
    stop.setAttribute('stop-color', colors[0]);
    stop.setAttribute('stop-opacity', String(opacity));
    gradient.appendChild(stop);

    const stopEnd = doc.createElementNS(NS, 'stop');
    stopEnd.setAttribute('offset', '100%');
    stopEnd.setAttribute('stop-color', colors[0]);
    stopEnd.setAttribute('stop-opacity', String(opacity * 0.85));
    gradient.appendChild(stopEnd);
    return gradient;
  }

  colors.forEach((color, index) => {
    const start = (index / colors.length) * 100;
    const end = ((index + 1) / colors.length) * 100;

    const stopStart = doc.createElementNS(NS, 'stop');
    stopStart.setAttribute('offset', `${start}%`);
    stopStart.setAttribute('stop-color', color);
    stopStart.setAttribute('stop-opacity', String(opacity));
    gradient.appendChild(stopStart);

    const stopEnd = doc.createElementNS(NS, 'stop');
    stopEnd.setAttribute('offset', `${end}%`);
    stopEnd.setAttribute('stop-color', color);
    stopEnd.setAttribute('stop-opacity', String(opacity));
    gradient.appendChild(stopEnd);
  });

  return gradient;
}

function ensureStateGradients(
  svg: SVGSVGElement,
  presenceIds: Set<string>,
  presenceById: Record<string, StatePresence>,
) {
  const NS = 'http://www.w3.org/2000/svg';
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(NS, 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }

  presenceIds.forEach((stateId) => {
    const colors = getVerticalColors(stateId, presenceById);
    if (!colors.length) return;

    defs!.appendChild(createGradient(document, gradientIdForState(stateId), colors, 0.72));
  });
}

function getStateHoverFill(stateId: string) {
  return `url(#${gradientIdForState(stateId)})`;
}

const MAP_STROKE_WIDTH = '0.6';
const HOVER_STROKE = '#7cd244';
const HOVER_STROKE_WIDTH = '2';
const SVG_VIEWBOX = '0 0 611.86 695.7';

interface PopupState {
  presence: StatePresence;
  x: number;
  y: number;
}

const MAP_COLORS = {
  dark: {
    fill: '#2f3a45',
    hoverFill: '#3a4654',
    stroke: 'rgba(255,255,255,0.14)',
    hoverStrokeMuted: 'rgba(255,255,255,0.22)',
  },
  light: {
    fill: '#d4e4d0',
    hoverFill: '#b8d4b0',
    stroke: 'rgba(45, 80, 22, 0.18)',
    hoverStrokeMuted: 'rgba(45, 80, 22, 0.28)',
  },
} as const;

function applyBaseStyle(
  path: SVGPathElement,
  _stateId: string,
  colors: (typeof MAP_COLORS)['dark'],
) {
  path.setAttribute('fill', colors.fill);
  path.setAttribute('stroke', colors.stroke);
  path.setAttribute('stroke-width', MAP_STROKE_WIDTH);
  path.style.filter = 'none';
}

function applyHoverStyle(
  path: SVGPathElement,
  stateId: string,
  hasPresence: boolean,
  colors: (typeof MAP_COLORS)['dark'],
) {
  if (!hasPresence) {
    path.setAttribute('fill', colors.hoverFill);
    path.setAttribute('stroke', colors.hoverStrokeMuted);
    path.setAttribute('stroke-width', '0.8');
    path.style.filter = 'none';
    return;
  }

  path.setAttribute('fill', getStateHoverFill(stateId));
  path.setAttribute('stroke', HOVER_STROKE);
  path.setAttribute('stroke-width', HOVER_STROKE_WIDTH);
  path.style.filter =
    'drop-shadow(0 4px 10px rgba(124, 210, 68, 0.45)) drop-shadow(0 0 0 1px rgba(124, 210, 68, 0.35))';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function IndiaPresenceMap({
  fillHeight = false,
  states = REFEX_STATE_PRESENCE,
}: {
  fillHeight?: boolean;
  states?: StatePresence[];
}) {
  const presenceById = useMemo(
    () => Object.fromEntries(states.map((state) => [state.id, state])) as Record<string, StatePresence>,
    [states],
  );
  const presenceIds = useMemo(() => new Set(states.map((state) => state.id)), [states]);
  const { theme, classes } = useDarkPageTheme();
  const { text, panel } = classes;
  const mapColors = MAP_COLORS[theme];
  const mapColorsRef = useRef(mapColors);
  mapColorsRef.current = mapColors;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pinnedIdRef = useRef<string | null>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const showPopupRef = useRef<(stateId: string, x: number, y: number) => void>(() => {});
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  pinnedIdRef.current = pinnedId;

  const showPopup = useCallback((stateId: string, clientX: number, clientY: number) => {
    const presence = presenceById[stateId];
    if (!presence) {
      setPopup(null);
      return;
    }

    const margin = 16;
    const popupWidth = 248;
    const popupHeight = 140;
    const x = clamp(clientX + 18, margin, window.innerWidth - popupWidth - margin);
    const y = clamp(clientY + 18, margin, window.innerHeight - popupHeight - margin);

    setPopup({ presence, x, y });
  }, [presenceById]);

  showPopupRef.current = showPopup;

  const dismissInteraction = useCallback(() => {
    pathsRef.current.forEach((path) => {
      const id = path.getAttribute('id') ?? '';
      applyBaseStyle(path, id, mapColorsRef.current);
    });
    pinnedIdRef.current = null;
    setPinnedId(null);
    setPopup(null);
    setHoveredId(null);
  }, []);

  useLayoutEffect(() => {
    const root = mapRef.current;
    if (!root) return;

    root.innerHTML = INDIA_SVG_MAP;

    const svg = root.querySelector('svg');
    if (!svg) return;

    svg.setAttribute('viewBox', SVG_VIEWBOX);
    svg.setAttribute('preserveAspectRatio', fillHeight ? 'xMidYMid meet' : 'xMidYMin meet');
    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
    svg.style.overflow = 'visible';

    if (fillHeight) {
      svg.style.height = '100%';
      svg.style.width = 'auto';
      svg.style.maxHeight = '100%';
      svg.style.maxWidth = '100%';
    } else {
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.style.maxHeight = 'min(320px, 48vh)';
      svg.style.maxWidth = '100%';
    }

    ensureStateGradients(svg, presenceIds, presenceById);

    const onEnter = (event: Event) => {
      const path = event.currentTarget as SVGPathElement;
      const stateId = path.getAttribute('id') ?? '';
      const hasPresence = presenceIds.has(stateId);

      applyHoverStyle(path, stateId, hasPresence, mapColorsRef.current);

      if (pinnedIdRef.current) return;

      setHoveredId(stateId);
      if (hasPresence) {
        const { x, y } = mouseRef.current;
        showPopupRef.current(stateId, x, y);
      } else {
        setPopup(null);
      }
    };

    const onLeave = (event: Event) => {
      const path = event.currentTarget as SVGPathElement;
      const stateId = path.getAttribute('id') ?? '';

      if (pinnedIdRef.current !== stateId) {
        applyBaseStyle(path, stateId, mapColorsRef.current);
      }

      if (pinnedIdRef.current === stateId) return;

      setHoveredId(null);
      setPopup(null);
    };

    const onClick = (event: Event) => {
      event.preventDefault();
      const path = event.currentTarget as SVGPathElement;
      const stateId = path.getAttribute('id') ?? '';
      const presence = presenceById[stateId];

      if (!presence) return;

      if (pinnedIdRef.current === stateId) {
        pinnedIdRef.current = null;
        setPinnedId(null);
        setPopup(null);
        applyBaseStyle(path, stateId, mapColorsRef.current);
        return;
      }

      pathsRef.current.forEach((p) => {
        const id = p.getAttribute('id') ?? '';
        applyBaseStyle(p, id, mapColorsRef.current);
      });

      pinnedIdRef.current = stateId;
      setPinnedId(stateId);
      setHoveredId(stateId);
      applyHoverStyle(path, stateId, true, mapColorsRef.current);

      const rect = path.getBoundingClientRect();
      showPopupRef.current(stateId, rect.left + rect.width / 2, rect.top + rect.height / 2);
    };

    const paths = root.querySelectorAll<SVGPathElement>('path');
    pathsRef.current = [];

    paths.forEach((path) => {
      const stateId = path.getAttribute('id') ?? '';
      applyBaseStyle(path, stateId, mapColorsRef.current);
      path.style.transition = 'fill 0.22s ease, stroke 0.22s ease, stroke-width 0.22s ease, filter 0.22s ease';
      path.style.cursor = presenceIds.has(stateId) ? 'pointer' : 'default';
      path.style.pointerEvents = 'all';

      path.addEventListener('mouseenter', onEnter);
      path.addEventListener('mouseleave', onLeave);
      path.addEventListener('click', onClick);
      pathsRef.current.push(path);
    });

    return () => {
      pathsRef.current.forEach((path) => {
        path.removeEventListener('mouseenter', onEnter);
        path.removeEventListener('mouseleave', onLeave);
        path.removeEventListener('click', onClick);
      });
      pathsRef.current = [];
      root.innerHTML = '';
    };
  }, [fillHeight, theme, presenceById, presenceIds]);

  useEffect(() => {
    pathsRef.current.forEach((path) => {
      const id = path.getAttribute('id') ?? '';
      const pinned = pinnedIdRef.current === id;
      if (pinned && presenceIds.has(id)) {
        applyHoverStyle(path, id, true, mapColors);
      } else {
        applyBaseStyle(path, id, mapColors);
      }
    });
  }, [mapColors]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouseRef.current = { x: event.clientX, y: event.clientY };
      if (pinnedIdRef.current || !hoveredId) return;
      if (presenceById[hoveredId]) {
        showPopupRef.current(hoveredId, event.clientX, event.clientY);
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [hoveredId]);

  useEffect(() => {
    const onScroll = () => dismissInteraction();

    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true });
  }, [dismissInteraction]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) dismissInteraction();
      },
      { threshold: 0.1 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [dismissInteraction]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      dismissInteraction();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dismissInteraction]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${fillHeight ? 'h-full min-h-0' : ''}`}
    >
      <div
        ref={mapRef}
        className={
          'india-presence-map w-full leading-[0] [&_path]:outline-none [&_svg]:mx-auto [&_svg]:block ' +
          (fillHeight ? 'flex h-full min-h-0 items-center justify-center' : '')
        }
        aria-label="Interactive map of India showing Refex presence by state"
        role="img"
      />

      {popup && (
        <div
          className="pointer-events-none fixed z-[1200] w-[min(248px,calc(100vw-2rem))]"
          style={{ left: popup.x, top: popup.y }}
          role="tooltip"
        >
          <div className={`relative shadow-[0_12px_36px_rgba(0,0,0,0.55)] ${panel}`}>
            <div
              className="absolute left-0 top-0 h-full w-1"
              style={{
                backgroundColor: popup.presence.headquarters ? '#7cd244' : 'rgba(255,255,255,0.22)',
              }}
              aria-hidden
            />
            <div className="px-3.5 py-3 pl-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={text.label}>
                    {popup.presence.headquarters ? 'Headquarters' : 'Operations'}
                  </p>
                  <h4 className={`mt-1 truncate text-[15px] font-semibold leading-tight tracking-tight ${text.cardTitle}`}>
                    {popup.presence.name}
                  </h4>
                </div>
                {popup.presence.headquarters && (
                  <span className="shrink-0 rounded-md bg-[#7cd244]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#7cd144]">
                    HQ
                  </span>
                )}
              </div>

              <ul className="mt-2.5 flex flex-wrap gap-1">
                {popup.presence.verticals.map((vertical) => {
                  const { label, accent } = getVerticalChip(vertical);
                  return (
                    <li
                      key={vertical}
                      className="rounded-md px-2 py-0.5 text-[10px] font-medium leading-snug"
                      style={{ backgroundColor: `${accent}1a`, color: accent }}
                    >
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

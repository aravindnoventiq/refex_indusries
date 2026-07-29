import { useState, useEffect } from 'react';
import { aboutCmsApi } from '../../../services/api';
import { FALLBACK_MISSION, FALLBACK_VISION } from '../aboutFallbacks';
import { useDarkPageTheme } from '../../../components/DarkPageThemeProvider';
import { ABOUT_REVEAL_STAGGER_MS } from '../useAboutReveal';
import AboutReveal from './AboutReveal';
import { AboutSectionShell, AboutSpinner } from './AboutSectionShell';

const MISSION_VISION_IMAGE = '/mission-vision-bg.png';

interface VisionMission {
  id?: number;
  visionTitle: string;
  visionDescription?: string;
  visionImage?: string;
  missionTitle: string;
  missionImage?: string;
  missionPoints?: string[];
  isActive: boolean;
}

const FALLBACK_VM: VisionMission = {
  visionTitle: 'Vision',
  visionDescription: FALLBACK_VISION,
  missionTitle: 'Mission',
  missionPoints: [],
  isActive: true,
};

export default function MissionVisionSection() {
  const [vm, setVm] = useState<VisionMission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisionMission = async () => {
      try {
        setLoading(true);
        const data = await aboutCmsApi.getVisionMission();
        if (data && (data.isActive === true || data.isActive === undefined || data.isActive === null)) {
          setVm(data);
        } else {
          setVm(FALLBACK_VM);
        }
      } catch {
        setVm(FALLBACK_VM);
      } finally {
        setLoading(false);
      }
    };

    fetchVisionMission();
  }, []);

  const { classes } = useDarkPageTheme();
  const { text, card, surfaceStrong } = classes;

  if (loading) {
    return (
      <div id="mission-vision">
        <AboutSpinner />
      </div>
    );
  }

  const display = vm || FALLBACK_VM;
  const missionPoints =
    Array.isArray(display.missionPoints) && display.missionPoints.length > 0
      ? display.missionPoints
      : null;
  const missionBody = missionPoints ? null : FALLBACK_MISSION;
  const visionBody = display.visionDescription?.trim() || FALLBACK_VISION;

  return (
    <AboutSectionShell id="mission-vision" eyebrow="Purpose" title="Mission & Vision">
      <AboutReveal>
        <div className={card}>
          <div className="relative w-full overflow-hidden">
            <img
              src={MISSION_VISION_IMAGE}
              alt="Refex business verticals — renewable energy, infrastructure, and green mobility"
              loading="lazy"
              width={1024}
              height={492}
              className="block h-auto w-full"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070a] via-black/15 to-transparent"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:gap-5 sm:p-6 md:p-8 lg:grid-cols-2 lg:gap-6">
            <AboutReveal delay={ABOUT_REVEAL_STAGGER_MS}>
              <article className={`relative h-full overflow-hidden rounded-xl p-6 sm:p-7 md:p-8 ${surfaceStrong}`}>
            <div aria-hidden className="absolute left-0 top-0 h-full w-[3px] bg-[#7cd244]" />
            <p className={text.label}>Our Purpose</p>
            <h3 className={`mt-2 ${text.cardTitle}`}>
              {display.missionTitle || 'Mission'}
            </h3>
            {missionPoints ? (
              <ul className={`mt-4 space-y-3 ${text.body}`}>
                {missionPoints.map((point, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7cd244]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`mt-4 ${text.body}`}>{missionBody}</p>
            )}
              </article>
            </AboutReveal>

            <AboutReveal delay={ABOUT_REVEAL_STAGGER_MS * 2}>
              <article className={`relative h-full overflow-hidden rounded-xl p-6 sm:p-7 md:p-8 ${surfaceStrong}`}>
            <div aria-hidden className="absolute left-0 top-0 h-full w-[3px] bg-[#6db038]" />
            <p className={text.label}>Our Direction</p>
            <h3 className={`mt-2 ${text.cardTitle}`}>
              {display.visionTitle || 'Vision'}
            </h3>
            <p className={`mt-4 ${text.body}`}>{visionBody}</p>
              </article>
            </AboutReveal>
          </div>
        </div>
      </AboutReveal>
    </AboutSectionShell>
  );
}

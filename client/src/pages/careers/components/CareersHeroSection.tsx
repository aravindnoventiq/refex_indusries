const HERO_BG = '/careers/hero-bg.png';

interface CareersHeroSectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle: React.ReactNode;
  backgroundImage?: string;
  ctaText?: string;
  showCta?: boolean;
  as?: 'h1' | 'h2';
}

export default function CareersHeroSection({
  id,
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  ctaText = 'Join Our Talent Community',
  showCta = false,
  as: HeadingTag = 'h2',
}: CareersHeroSectionProps) {
  const scrollToForm = () => {
    document.getElementById('talent-network')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="relative flex min-h-[min(100dvh,920px)] items-center justify-center overflow-hidden"
      aria-labelledby={id}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage || HERO_BG})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/45"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        {eyebrow ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#7cd244] sm:text-sm">
            {eyebrow}
          </p>
        ) : null}
        <HeadingTag
          id={id}
          className="font-serif text-4xl font-medium leading-tight text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
        >
          {title}
        </HeadingTag>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
          {subtitle}
        </p>
        {showCta ? (
          <button
            type="button"
            onClick={scrollToForm}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2d5016] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(45,80,22,0.35)] transition-all hover:bg-[#234015] hover:gap-3 sm:px-10 sm:text-base"
          >
            {ctaText}
            <i className="ri-arrow-down-line text-lg" aria-hidden />
          </button>
        ) : null}
      </div>
    </section>
  );
}

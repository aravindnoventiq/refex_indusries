import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Handshake,
  Heart,
  Leaf,
  Lightbulb,
  Shield,
  Sprout,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

const SECTION_BG = '/careers/why-choose-refex-bg.png';

type WhyChooseCard = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const WHY_CHOOSE_CARDS: WhyChooseCard[] = [
  {
    title: 'Purpose-Driven Work',
    description:
      'Be part of projects that advance cleaner industries, strengthen communities, and create lasting value for society.',
    icon: Target,
  },
  {
    title: 'Continuous Growth',
    description:
      'Take on meaningful challenges, learn from experienced leaders, and accelerate your career through continuous development.',
    icon: TrendingUp,
  },
  {
    title: 'Inclusive by Culture',
    description:
      'We believe diverse perspectives drive better outcomes. Every voice is valued, respected, and encouraged to contribute.',
    icon: Users,
  },
  {
    title: 'Innovation in Action',
    description:
      'Work on complex industrial challenges across circular economy, sustainability, mobility, renewable energy, and technology-driven operations.',
    icon: Lightbulb,
  },
  {
    title: 'Well-Being Matters',
    description:
      'We support your physical, mental, and professional well-being because thriving people build thriving organizations.',
    icon: Heart,
  },
  {
    title: 'Safety First, Always',
    description:
      'Safety is embedded in everything we do, creating a workplace where people can perform with confidence and care.',
    icon: Shield,
  },
  {
    title: 'Recognized & Rewarded',
    description:
      'We celebrate achievements, acknowledge contributions, and create opportunities for people to grow through trust and recognition.',
    icon: Award,
  },
  {
    title: 'Building Tomorrow Together',
    description:
      "Join an organization that's evolving, expanding, and shaping the future of sustainable industry in India.",
    icon: Sprout,
  },
];

const CORE_VALUES = [
  { label: 'Sustainability', icon: Leaf },
  { label: 'Integrity', icon: Shield },
  { label: 'Innovation', icon: Lightbulb },
  { label: 'Collaboration', icon: Handshake },
  { label: 'Excellence', icon: Star },
] as const;

function WhyChooseCardItem({ title, description, icon: Icon }: WhyChooseCard) {
  return (
    <article
      tabIndex={0}
      className="group/card flex h-full cursor-default gap-4 rounded-2xl border border-[#e8eee3] bg-white/95 p-5 shadow-[0_8px_28px_rgba(45,80,22,0.08)] outline-none backdrop-blur-sm transition-all duration-300 hover:border-[#4C8C2B]/35 hover:shadow-[0_12px_32px_rgba(45,80,22,0.12)] focus-within:border-[#4C8C2B]/35 focus-within:shadow-[0_12px_32px_rgba(45,80,22,0.12)] sm:gap-5 sm:p-6"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#4C8C2B]/25 bg-[#f7faf5] text-[#4C8C2B] transition-colors duration-300 group-hover/card:border-[#4C8C2B]/45 group-hover/card:bg-[#eef5ea] group-focus-within/card:border-[#4C8C2B]/45 group-focus-within/card:bg-[#eef5ea] sm:h-16 sm:w-16">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-[#2d5016] transition-colors duration-300 group-hover/card:text-[#234015] group-focus-within/card:text-[#234015] sm:text-lg">
          {title}
        </h3>
        <div
          className={
            'grid transition-[grid-template-rows,opacity] duration-300 ease-out ' +
            'grid-rows-[0fr] opacity-0 ' +
            'group-hover/card:grid-rows-[1fr] group-hover/card:opacity-100 ' +
            'group-focus-within/card:grid-rows-[1fr] group-focus-within/card:opacity-100 ' +
            '[@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100'
          }
        >
          <p className="mt-2 min-h-0 overflow-hidden text-sm leading-relaxed text-[#5a5a5a] sm:text-[15px]">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function WhyChooseRefexSection() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="why-choose-refex-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] bg-cover bg-bottom bg-no-repeat sm:top-[38%]"
        style={{ backgroundImage: `url(${SECTION_BG})` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[42%] bg-gradient-to-b from-white via-white/35 to-white/10 sm:top-[38%]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8 lg:pb-14 lg:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="why-choose-refex-title"
            className="font-serif text-3xl font-medium text-[#1f1f1f] sm:text-4xl lg:text-[2.75rem]"
          >
            Why Choose <span className="font-semibold text-[#2d5016]">Refex</span>
          </h2>
          <div className="mt-4 flex justify-center" aria-hidden>
            <Leaf className="h-5 w-5 text-[#4C8C2B]" strokeWidth={1.75} />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#666] sm:text-base">
            Discover a workplace where purpose, growth, and innovation come together to build a
            cleaner, stronger, and more sustainable future.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {WHY_CHOOSE_CARDS.map((card) => (
            <WhyChooseCardItem key={card.title} {...card} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 border-t border-[#d9e8d2]/80 pt-8 sm:mt-12 sm:gap-x-6">
          {CORE_VALUES.map((value, index) => {
            const ValueIcon = value.icon;
            return (
              <div key={value.label} className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#2d5016] sm:text-base">
                  <ValueIcon className="h-4 w-4 text-[#4C8C2B]" strokeWidth={1.75} aria-hidden />
                  {value.label}
                </div>
                {index < CORE_VALUES.length - 1 ? (
                  <span className="hidden h-4 w-px bg-[#c8d9bf] sm:block" aria-hidden />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

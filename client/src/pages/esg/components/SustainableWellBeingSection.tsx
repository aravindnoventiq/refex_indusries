import { useLayoutEffect, useRef } from 'react';
import {
  Droplets,
  Heart,
  Recycle,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { gsap, prefersReducedMotion } from '../../about-us/aboutGsap';
import { esgContainer, esgScrollMargin, esgSectionPad } from '../esgLayout';
import { esgScrollStart } from '../esgMotion';

type WellBeingTopic = {
  id: string;
  title: string;
  category: string;
  accent: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  intro: string;
  highlights: string[];
};


const TOPICS: WellBeingTopic[] = [
  {
    id: 'energy-transition',
    title: 'Energy Transition Program',
    category: 'Energy',
    accent: '#F39200',
    icon: Zap,
    image: '/esg/energy-transition.png',
    imageAlt: 'Renewable energy infrastructure with solar panels, wind turbines, and connected fleet vehicles',
    intro:
      'Improved fuel efficiency through GPS-enabled fleet monitoring, optimized route planning, driver awareness programmes, and the deployment of BS-VI-compliant heavy-haulage vehicles, with approximately 90% of the fleet being BS-VI compliant as of March 31, 2026',
    highlights: [
      'In FY 2025–26, a 43 kWp rooftop solar photovoltaic (PV) system was installed at the Chennai Corporate Office, generating approximately 51,600 kWh of clean electricity annually and avoiding an estimated 37.5 MTCO₂e of greenhouse gas emissions each year. Over its expected 25-year operational lifespan, the system is projected to prevent approximately 937.5 MTCO₂e of greenhouse gas emissions.',
      'Refex Mobility accelerated the clean energy transition by adding 182 electric vehicles and 15 CNG-petrol vehicles during FY 2025–26, supporting low-carbon transportation and reducing dependence on fossil fuels.',
    ],
  },
  {
    id: 'water-stewardship',
    title: 'Water Stewardship',
    category: 'Planet',
    accent: '#4C8C2B',
    icon: Droplets,
    image: '/esg/water-stewardship.png',
    imageAlt: 'Community water body restoration with pond rejuvenation and afforestation',
    intro:
      'Conserving water is central to Refex’s mission, and it is committed to restoring water bodies as part of its CSR initiative, “Nirmal Jal”, launched in 2023. Through this program, Refex has pledged to restore at least one water body every year to support sustainable water management.',
    highlights: [
      'Beyond our facilities, we are restoring critical water resources through initiatives such as the rejuvenation of the 22,000 sq. ft. Vannan Pond in Kundrathur, Chennai and the restoration of a 28,000 sq. ft. water body in Neknamalai, Tirupattur.',
      'During FY 2025–26, Refex restored a ~1 km-long water body in Kholan village, Titlagarh district, with a water storage capacity of 173,000 KL, supporting rainwater harvesting, groundwater recharge, agriculture, fish farming, and livestock water needs, thereby enhancing local water security and benefiting approximately 600 households.',
      'Together, these efforts support our ambition of achieving Water Positive Status by 2035 while creating lasting environmental and community impact.',
    ],
  },
  {
    id: 'circular-economy',
    title: 'Circular Economy and Resource Efficiency',
    category: 'Planet',
    accent: '#4C8C2B',
    icon: Recycle,
    image: '/esg/circular-economy.png',
    imageAlt: 'Circular economy model showing ash recycling into road construction, mining reclamation, bricks, and cement',
    intro:
      'Ash produced by thermal power plants represents one of India\'s most voluminous industrial waste streams and one of its most underutilized resources. Refex has built a comprehensive, end-to-end ash management ecosystem that transforms what was once an environmental liability into a productive input for the construction, cement, and mining reclamation industries. This is the circular economy in its most practical, measurable form.',
    highlights: [
      'The foundation of Refex\'s approach is a carefully cultivated network of off-take partners cement manufacturers, ash brick manufacturers, construction contractors, and abandoned mine operators to absorb recycled ash at scale, enabling near-total diversion from landfill. The Company has also embedded waste management awareness deeply into its value chain through regular training programs for all relevant stakeholders, ensuring that the discipline of responsible waste handling is practiced across the network, not just within Refex\'s own facilities.',
      'During FY 2025–26, Refex utilized 100% of ash for repurposing across multiple end-use sectors; approximately 60% was utilized in road construction, 23% in the reclamation and back filling of low-lying areas and abandoned mines, 14% in brick manufacturing, and 3% in cement production.',
    ],
  },
  {
    id: 'health-safety',
    title: 'Health & Safety',
    category: 'Workplace',
    accent: '#0072CE',
    icon: ShieldCheck,
    image: '/esg/health-safety.png',
    imageAlt: 'Industrial health and safety equipment with safety-first signage at a construction site',
    intro:
      'The health and safety of employees, workers, and value chain partners remain a core priority for Refex. Guided by its Sustainability Vision 2035, the Company has set a Zero Harm ambition, targeting a Lost Time Injury Rate (LTIR) of ≤ 0.2 by 2035. Through our Mission Zero Harm initiative, we proactively identify risks, strengthen preventive controls, and foster a culture where safety remains integral to every aspect of operations.',
    highlights: [
      'Refex has implemented a robust Occupational Health and Safety Management System (OHSMS), certified to ISO 45001:2018, which helps in proactively identifying hazards and preventing incidents. Regular risk assessments, comprehensive training programs, and continuous improvement initiatives support the Company’s safety-first culture.',
      'Routine mock drills and safety sessions ensure all stakeholders are prepared for potential emergencies. Refex is proud to maintain a zero-fatality record since its inception, backed by an outstanding health and safety performance track record.',
    ],
  },
  {
    id: 'csr-thrust',
    title: 'CSR Thrust Areas & Projects',
    category: 'People',
    accent: '#F39200',
    icon: Heart,
    image: '/esg/csr-thrust-areas.png',
    imageAlt: 'CSR initiatives spanning education, healthcare, sustainability, and community development',
    intro:
      'At Refex Group, we are committed to creating sustainable and inclusive communities through impactful CSR initiatives. As of FY 2026, we have implemented 24+ projects across Tamil Nadu, Maharashtra, Odisha, Rajasthan, and Chhattisgarh, spanning Education, Healthcare, Sustainability, Climate Resilience, Biodiversity, and Ecosystem Restoration, positively impacting 12,000+ beneficiaries.',
    highlights: [
      'Our education initiatives have transformed learning opportunities by supporting 200+ schools and awarding 700+ scholarships, complemented by investments in school infrastructure, health, holistic development, and future-ready skills. Through our environmental initiatives, including water bodies restoration, mangrove conservation, afforestation, and renewable energy access, we have created 1,90,000+ KL of water replenishment capacity, planted 10,000+ trees, and benefited 5,600+ people, while our disaster relief efforts have supported 4,173 flood-affected families in Chennai.',
    ],
  },
];

function StewardshipCard({ topic }: { topic: WellBeingTopic }) {
  const Icon = topic.icon;

  return (
    <article
      data-wellbeing-card
      className="group overflow-hidden rounded-[1.35rem] border border-[#e3ebe0] bg-white shadow-[0_18px_50px_rgba(76,140,43,0.08)] transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(76,140,43,0.12)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,42%)_1fr]">
        <div
          data-wellbeing-image-wrap
          className="relative min-h-[220px] overflow-hidden sm:min-h-[260px] lg:min-h-[320px]"
        >
          <img
            data-wellbeing-image
            src={topic.image}
            alt={topic.imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent lg:bg-gradient-to-r lg:from-black/35 lg:via-black/10 lg:to-transparent"
          />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span
              data-wellbeing-category
              className="rounded-full border border-white/40 bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm"
              style={{ color: topic.accent }}
            >
              {topic.category}
            </span>
          </div>
          <div
            data-wellbeing-card-icon
            className="absolute bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/15 backdrop-blur-md"
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
        </div>

        <div data-wellbeing-content className="relative p-6 sm:p-8 lg:p-9 xl:p-10">
          <h3
            data-wellbeing-title
            className="mb-4 max-w-xl text-xl font-bold leading-tight tracking-tight text-[#1f1f1f] sm:text-2xl"
          >
            {topic.title}
          </h3>

          <p
            data-wellbeing-intro
            className="mb-5 max-w-2xl text-[15px] leading-[1.75] text-[#4a4a4a]"
          >
            {topic.intro}
          </p>

          <div data-wellbeing-highlights-wrap className="space-y-4">
            {topic.highlights.map((item) => (
              <p
                key={item.slice(0, 48)}
                data-wellbeing-highlight
                className="max-w-2xl text-[14px] leading-[1.7] text-[#3a3a3a]"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function SustainableWellBeingSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(
        section.querySelectorAll(
          '[data-wellbeing-header], [data-wellbeing-card]',
        ),
        { autoAlpha: 1, y: 0, scale: 1 },
      );
      return;
    }

    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: '[data-wellbeing-header]',
          start: esgScrollStart('top 84%'),
          once: true,
        },
      });

      headerTl
        .from('[data-wellbeing-eyebrow]', { autoAlpha: 0, y: 18, duration: 0.5, ease: 'power2.out' })
        .from('[data-wellbeing-title-main]', { autoAlpha: 0, y: 28, duration: 0.65, ease: 'power3.out' }, '-=0.2')
        .from('[data-wellbeing-subtitle]', { autoAlpha: 0, y: 16, duration: 0.55, ease: 'power2.out' }, '-=0.35')
        .from('[data-wellbeing-subtitle-line]', { scaleX: 0, duration: 0.55, ease: 'power3.inOut' }, '-=0.2');

      section.querySelectorAll('[data-wellbeing-card]').forEach((card, index) => {
        const fromX = index % 2 === 0 ? -36 : 36;

        gsap.from(card, {
          autoAlpha: 0,
          y: 40,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: esgScrollStart('top 88%'),
            once: true,
          },
        });

        gsap.from(card.querySelector('[data-wellbeing-image-wrap]'), {
          autoAlpha: 0,
          x: fromX,
          clipPath: 'inset(0% 100% 0% 0%)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: esgScrollStart('top 86%'),
            once: true,
          },
        });

        gsap.from(
          card.querySelectorAll('[data-wellbeing-title], [data-wellbeing-intro], [data-wellbeing-highlight]'),
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.5,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: esgScrollStart('top 84%'),
              once: true,
            },
          },
        );

        const image = card.querySelector('[data-wellbeing-image]');
        if (image) {
          gsap.to(image, {
            y: -16,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sustainable-well-being"
      className={`relative overflow-hidden bg-[#f7faf5] ${esgSectionPad} ${esgScrollMargin}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#4C8C2B]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#F39200]/8 blur-3xl"
      />

      <div className={`relative z-10 ${esgContainer}`}>
        <header data-wellbeing-header className="mx-auto mb-10 max-w-4xl text-center sm:mb-12">
          {/* <p
            data-wellbeing-eyebrow
            className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#4C8C2B]"
          >
            Sustainable Wellbeing
          </p> */}
          <h2 className="text-3xl font-bold uppercase tracking-[0.06em] text-[#2b2b2b] sm:text-4xl lg:text-[2.35rem]">
            <span data-wellbeing-title-main className="inline-block">
              Sustainable <span className="text-[#4C8C2B]">Well-Being</span>
            </span>
          </h2>
          <p
            data-wellbeing-subtitle
            className="mt-4 text-lg font-medium text-[#5a5a5a] sm:text-xl"
          >
            Across Communities and Environment
          </p>
          
        </header>

        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {TOPICS.map((topic) => (
            <StewardshipCard key={topic.id} topic={topic} />
          ))}
        </div>

        {/* <div
          data-wellbeing-footer
          className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-3"
        >
          {[
            { value: '5', label: 'Core Focus Areas' },
            { value: '100%', label: 'ESG Aligned' },
            { value: 'Long-term', label: 'Community Impact' },
          ].map((stat) => (
            <div
              key={stat.label}
              data-wellbeing-footer-stat
              className="rounded-2xl border border-[#e3ebe0] bg-white/90 px-5 py-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-[#4C8C2B]">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#666]">
                {stat.label}
              </p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}

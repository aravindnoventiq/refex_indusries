import { useEffect, useState } from 'react';
import { siteMainClass, sitePageFont, sitePageLightClass } from '../../utils/siteLayout';
import { readyMixCmsApi } from '../../services/api';
import { getFullUrl } from '../esg/esgUtils';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import ScrollToTop from '../home/components/ScrollToTop';
import { DEFAULT_RMC_PAGE, mergeRmcPage, type RmcPageContent } from './rmcContent';

function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#4C8C2B]/45 bg-[#f7faf5] px-6 py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2d5016]">{label}</p>
      <p className="mt-2 text-sm text-[#1f1f1f]">Content to be added.</p>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[#1f1f1f] sm:text-[1.85rem]">
      {children}
    </h2>
  );
}

function CmsBlock({
  label,
  text,
  image,
}: {
  label: string;
  text?: string;
  image?: string;
}) {
  const src = getFullUrl(image) || image;
  if (src) {
    return <img src={src} alt={label} className="w-full rounded-2xl object-cover" />;
  }
  if (text?.trim()) {
    return <p className="max-w-4xl text-[0.98rem] leading-[1.8] text-[#1f1f1f]">{text}</p>;
  }
  return <Placeholder label={label} />;
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function ReadyMixConcretePage() {
  const [content, setContent] = useState<RmcPageContent>(DEFAULT_RMC_PAGE);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    readyMixCmsApi
      .get()
      .then((data) => {
        if (!cancelled) setContent(mergeRmcPage(data));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const banner = getFullUrl(content.bannerImage) || content.bannerImage;
  const leaderPhoto = getFullUrl(content.leaderImage) || content.leaderImage;

  return (
    <div className={sitePageLightClass} style={sitePageFont}>
      <Header />
      <main className={siteMainClass}>
        <section className="bg-[#10210c] text-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7DC244]">
              Ready Mix Concrete
            </p>
            <h1 className="mt-4 max-w-4xl text-3xl font-semibold uppercase leading-[1.15] tracking-[-0.03em] sm:text-4xl lg:text-[2.7rem]">
              <span className="block">{content.headlineLine1}</span>
              <span className="block">{content.headlineLine2}</span>
            </h1>
            {banner ? (
              <img
                src={banner}
                alt=""
                className="mt-8 h-[240px] w-full rounded-2xl object-cover sm:h-[320px]"
              />
            ) : (
              <div className="mt-8 flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-white/35 bg-white/5 px-6 text-center sm:min-h-[320px]">
                <p className="text-sm font-medium text-white">Banner image placeholder</p>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
          <SectionTitle>About Refex Ready Mix Concrete (RMC)</SectionTitle>
          <p className="mt-4 max-w-4xl text-[0.98rem] leading-[1.8] text-[#1f1f1f]">{content.about}</p>
        </section>

        <section className="bg-[#f3f7ef]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
            <SectionTitle>The Refex Advantage</SectionTitle>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.advantages.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[#dfe9d8] bg-white p-5">
                  <h3 className="text-base font-semibold text-[#2d5016]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1f1f1f]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-12 px-5 py-14 sm:px-6 lg:py-16">
          <div>
            <SectionTitle>Vision</SectionTitle>
            <p className="mt-4 max-w-4xl text-[0.98rem] leading-[1.8] text-[#1f1f1f]">{content.vision}</p>
          </div>
          <div>
            <SectionTitle>Our Products</SectionTitle>
            <div className="mt-4">
              <CmsBlock label="Product range from the revised brochure" text={content.products} image={content.productsImage} />
            </div>
          </div>
          <div>
            <SectionTitle>Our Footprint</SectionTitle>
            <div className="mt-4">
              <CmsBlock label="Map similar to the brochure" text={content.footprint} image={content.footprintImage} />
            </div>
          </div>
          <div>
            <SectionTitle>Clients</SectionTitle>
            <div className="mt-4">
              <CmsBlock label="Client logos can be added once confirmed" text={content.clients} image={content.clientsImage} />
            </div>
          </div>
        </section>

        <section className="bg-[#f3f7ef]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
            <SectionTitle>{content.sustainabilityTitle}</SectionTitle>
            <p className="mt-4 max-w-4xl text-[0.98rem] leading-[1.8] text-[#1f1f1f]">{content.sustainabilityIntro}</p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {content.sustainabilityCards.map((card) => (
                <article key={card.title} className="rounded-2xl border border-[#dfe9d8] bg-white p-5">
                  <h3 className="text-base font-semibold text-[#2d5016]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#1f1f1f]">{card.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 max-w-4xl text-[0.98rem] leading-[1.8] text-[#1f1f1f]">{content.sustainabilityClose}</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
          <SectionTitle>In the News</SectionTitle>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {content.news.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#dfe9d8] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4C8C2B]">{item.label}</p>
                <h3 className="mt-2 text-lg font-semibold text-[#1f1f1f]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1f1f1f]">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#f3f7ef]">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
            <SectionTitle>Leadership Team</SectionTitle>
            <article className="mt-6 flex max-w-3xl flex-col gap-5 rounded-2xl border border-[#dfe9d8] bg-white p-5 sm:flex-row sm:items-start">
              {leaderPhoto ? (
                <img src={leaderPhoto} alt={content.leaderName} className="h-28 w-28 shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-[#eef5e8] text-sm font-semibold text-[#2d5016]">
                  Photo
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-[#1f1f1f]">{content.leaderName}</h3>
                <p className="mt-1 text-sm font-medium text-[#2d5016]">{content.leaderRole}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#1f1f1f]">{content.leaderBio}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
          <SectionTitle>Contact Us</SectionTitle>
          <div className="mt-4 space-y-2 text-[0.98rem] text-[#1f1f1f]">
            <p>
              Mail:{' '}
              <a className="font-semibold text-[#2d5016] hover:text-[#4C8C2B]" href={`mailto:${content.email}`}>
                {content.email}
              </a>
            </p>
            <p>
              Phone:{' '}
              <a className="font-semibold text-[#2d5016] hover:text-[#4C8C2B]" href={phoneHref(content.phone)}>
                {content.phone}
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

const GALLERY_IMAGE = '/careers/life-as-refexian-gallery.png';

export default function LifeAsRefexianSection() {
  return (
    <section
      className="relative overflow-hidden border-y border-[#dfe9d8] bg-[#f3f7ef] py-16 md:py-20"
      aria-labelledby="life-as-refexian-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#2d5016]/8 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#4C8C2B] sm:text-sm">
            Our Culture
          </p>
          <h2
            id="life-as-refexian-title"
            className="font-serif text-3xl font-medium text-[#1f1f1f] sm:text-4xl lg:text-[2.75rem]"
          >
            Life as A <span className="font-semibold text-[#2d5016]">#Refexian</span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#484848] sm:text-base lg:text-lg">
            Diverse Perspectives. Shared Purpose. Limitless Possibilities.
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <img
            src={GALLERY_IMAGE}
            alt="Refex team celebrations, community events, and workplace culture"
            className="mx-auto w-full max-w-5xl rounded-xl shadow-[0_16px_48px_rgba(45,80,22,0.14)]"
          />
        </div>
      </div>
    </section>
  );
}

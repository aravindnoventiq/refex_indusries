import { esgContainer, esgSectionPad, esgBgWhite } from '../esgLayout';

export default function EsgSectionLoader({ label = 'Loading section...' }: { label?: string }) {
  return (
    <section className={`${esgSectionPad} ${esgBgWhite}`}>
      <div className={esgContainer}>
        <div className="flex justify-center py-12 sm:py-16">
          <div className="text-center">
            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-2 border-[#7DC244] border-t-transparent" />
            <p className="mt-4 text-sm text-gray-600">{label}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

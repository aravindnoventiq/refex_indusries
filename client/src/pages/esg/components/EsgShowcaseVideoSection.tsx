import PeacockFan from './PeacockFan';
import { esgContainer } from '../esgLayout';

export default function EsgShowcaseVideoSection() {
  return (
    <section
      id="esg-showcase"
      className="relative overflow-hidden bg-[#071018] py-10 sm:py-12 lg:py-14"
      aria-label="Interactive peacock feather sustainability showcase"
    >
      <div className={esgContainer}>
        <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <PeacockFan />
        </div>
      </div>
    </section>
  );
}

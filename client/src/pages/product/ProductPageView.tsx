import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';

export type ProductPageData = {
  slug: string;
  name: string;
  bullets?: string[];
  images?: string[];
  packaging?: { label: string; value: string }[];
  properties?: { label: string; value: string }[];
  propertiesNote?: string;
  msdsUrl?: string;
  description?: string;
  related?: { name: string; image: string; link: string }[];
};

export function isPopulatedProduct(data?: ProductPageData | null) {
  if (!data) return false;
  return Boolean(
    (data.description && data.description.trim()) ||
      (data.images && data.images.length > 0) ||
      (data.bullets && data.bullets.length > 0),
  );
}

export default function ProductPageView({ data }: { data: ProductPageData }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const images = data.images?.filter(Boolean) || [];
  const related = data.related || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mx-auto max-w-7xl px-5 py-12 pt-[var(--header-offset,5.25rem)] sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            {images[0] && (
              <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <img src={images[selectedImage] || images[0]} alt={data.name} className="h-full w-full object-contain" />
              </div>
            )}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 ${
                      selectedImage === index ? 'border-green-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${data.name} ${index + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 font-bold" style={{ fontSize: '25px', color: '#1f1f1f' }}>
                {data.name}
              </p>
              <h1 className="mb-4 text-3xl font-bold text-[#1f1f1f] sm:mb-6 sm:text-4xl lg:text-5xl">{data.name}</h1>
              <ul className="space-y-2">
                {(data.bullets || []).map((bullet) => (
                  <li key={bullet} className="flex items-start">
                    <span className="mr-2" style={{ fontSize: '16px', color: '#656567' }}>
                      –
                    </span>
                    <span style={{ fontSize: '16px', color: '#656567' }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              {(data.packaging || []).length > 0 && (
                <Accordion
                  id="packaging"
                  title="PACKAGING:"
                  open={openAccordion}
                  onToggle={setOpenAccordion}
                >
                  <table className="w-full">
                    <tbody>
                      {data.packaging!.map((row) => (
                        <tr key={row.label} className="border-b border-gray-200 last:border-0">
                          <td className="py-3 font-semibold text-gray-900">{row.label}</td>
                          <td className="py-3 text-gray-700">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>
              )}
              {(data.properties || []).length > 0 && (
                <Accordion
                  id="properties"
                  title="PROPERTIES"
                  open={openAccordion}
                  onToggle={setOpenAccordion}
                >
                  <table className="mb-4 w-full">
                    <tbody>
                      {data.properties!.map((row) => (
                        <tr key={row.label} className="border-b border-gray-200 last:border-0">
                          <td className="py-3 font-semibold text-gray-900">{row.label}</td>
                          <td className="py-3 text-gray-700">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.propertiesNote && <p className="text-xs text-gray-500">{data.propertiesNote}</p>}
                </Accordion>
              )}
            </div>

            {data.msdsUrl && (
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <i className="ri-file-pdf-2-fill text-3xl text-red-600" />
                <a
                  href={data.msdsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gray-700 transition-colors hover:text-[#7cd244]"
                >
                  Product MSDS
                </a>
              </div>
            )}
          </div>
        </div>

        {data.description && (
          <div className="mb-16">
            <div className="mb-4">
              <span
                className="inline-block rounded-lg font-bold"
                style={{ backgroundColor: '#7dc144', color: '#ffffff', padding: '20px', fontSize: '16px' }}
              >
                Description
              </span>
            </div>
            <p className="leading-relaxed" style={{ fontSize: '16px', color: '#484848' }}>
              {data.description}
            </p>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">Related products</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((product) => (
                <Link key={product.link} to={product.link} className="block">
                  <div className="mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img src={product.image} alt={product.name} className="h-96 w-full object-cover" />
                  </div>
                  <h3 className="text-center text-xl font-bold text-gray-900">{product.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Accordion({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: string | null;
  onToggle: (id: string | null) => void;
  children: ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <button
        type="button"
        onClick={() => onToggle(isOpen ? null : id)}
        className="flex w-full cursor-pointer items-center justify-between whitespace-nowrap bg-[#79bb42] px-6 py-4 text-left font-semibold text-white transition-colors hover:bg-[#6aa838]"
      >
        <span>{title}</span>
        <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line text-xl`} />
      </button>
      {isOpen && <div className="bg-white px-6 py-4">{children}</div>}
    </div>
  );
}

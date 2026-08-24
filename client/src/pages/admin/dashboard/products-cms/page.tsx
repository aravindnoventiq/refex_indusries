import { useEffect, useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsAlerts from '../components/AdminCmsAlerts';
import { cmsChipActive, cmsChipIdle, cmsInput, cmsPanel, cmsPrimaryBtn } from '../components/adminCmsStyles';
import { productsCmsApi } from '../../../../services/api';

const PRODUCT_SLUGS = [
  { slug: 'r22', name: 'R22' },
  { slug: 'r32', name: 'R32' },
  { slug: 'r290', name: 'R290' },
  { slug: 'r404a', name: 'R404A' },
  { slug: 'r407c', name: 'R407C' },
  { slug: 'r410a', name: 'R410A' },
  { slug: 'r600a', name: 'R600A' },
  { slug: 'hfc-134a', name: 'HFC 134A' },
  { slug: 'hydrocarbon', name: 'Hydrocarbon' },
  { slug: 'butane', name: 'Butane' },
  { slug: 'copper-tubes', name: 'Copper Tubes' },
];

type ProductPage = {
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

const emptyPage = (slug: string, name: string): ProductPage => ({
  slug,
  name,
  bullets: [],
  images: [],
  packaging: [],
  properties: [],
  propertiesNote: '',
  msdsUrl: '',
  description: '',
  related: [],
});

export default function ProductsCMSPage() {
  const [slug, setSlug] = useState(PRODUCT_SLUGS[0].slug);
  const [page, setPage] = useState<ProductPage>(emptyPage(PRODUCT_SLUGS[0].slug, PRODUCT_SLUGS[0].name));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadPage = async (nextSlug = slug) => {
    try {
      setError('');
      const meta = PRODUCT_SLUGS.find((item) => item.slug === nextSlug)!;
      const data = await productsCmsApi.getPage(nextSlug);
      setPage({ ...emptyPage(nextSlug, meta.name), ...data, slug: nextSlug });
    } catch (err: any) {
      const meta = PRODUCT_SLUGS.find((item) => item.slug === nextSlug)!;
      setPage(emptyPage(nextSlug, meta.name));
      setError(err.message || 'Failed to load product page');
    }
  };

  useEffect(() => {
    loadPage(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const savePage = async () => {
    try {
      setError('');
      await productsCmsApi.savePage(slug, page);
      setSuccess(`${page.name} saved`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save product page');
    }
  };

  return (
    <AdminCmsShell title="Products CMS" subtitle="Manage every product page">
      <AdminCmsAlerts error={error} success={success} />

      <div className={cmsPanel}>
        <div className="mb-6 flex flex-wrap gap-2">
          {PRODUCT_SLUGS.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => setSlug(item.slug)}
              className={slug === item.slug ? cmsChipActive : cmsChipIdle}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <Field label="Name" value={page.name} onChange={(name) => setPage({ ...page, name })} />
          <TextArea
            label="Bullets (one per line)"
            value={(page.bullets || []).join('\n')}
            onChange={(value) =>
              setPage({
                ...page,
                bullets: value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
          />
          <TextArea
            label="Image URLs (one per line)"
            value={(page.images || []).join('\n')}
            onChange={(value) =>
              setPage({
                ...page,
                images: value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
          />
          <TextArea
            label="Packaging (Label | Value, one per line)"
            value={(page.packaging || []).map((row) => `${row.label} | ${row.value}`).join('\n')}
            onChange={(value) =>
              setPage({
                ...page,
                packaging: value
                  .split('\n')
                  .filter(Boolean)
                  .map((line) => {
                    const [label, ...rest] = line.split('|');
                    return { label: (label || '').trim(), value: rest.join('|').trim() };
                  }),
              })
            }
          />
          <TextArea
            label="Properties (Label | Value, one per line)"
            value={(page.properties || []).map((row) => `${row.label} | ${row.value}`).join('\n')}
            onChange={(value) =>
              setPage({
                ...page,
                properties: value
                  .split('\n')
                  .filter(Boolean)
                  .map((line) => {
                    const [label, ...rest] = line.split('|');
                    return { label: (label || '').trim(), value: rest.join('|').trim() };
                  }),
              })
            }
          />
          <Field
            label="Properties note"
            value={page.propertiesNote || ''}
            onChange={(propertiesNote) => setPage({ ...page, propertiesNote })}
          />
          <Field label="MSDS URL" value={page.msdsUrl || ''} onChange={(msdsUrl) => setPage({ ...page, msdsUrl })} />
          <TextArea
            label="Description"
            value={page.description || ''}
            onChange={(description) => setPage({ ...page, description })}
          />
          <TextArea
            label="Related products (Name | Image URL | Link, one per line)"
            value={(page.related || []).map((row) => `${row.name} | ${row.image} | ${row.link}`).join('\n')}
            onChange={(value) =>
              setPage({
                ...page,
                related: value
                  .split('\n')
                  .filter(Boolean)
                  .map((line) => {
                    const [name, image, link] = line.split('|').map((part) => part.trim());
                    return { name: name || '', image: image || '', link: link || '' };
                  }),
              })
            }
          />
        </div>
        <p className="mt-4 text-sm text-[#5c6658]">
          Until you save content here, the live product page keeps its current hardcoded layout.
        </p>
        <button type="button" onClick={savePage} className={`mt-6 ${cmsPrimaryBtn}`}>
          Save {page.name}
        </button>
      </div>
    </AdminCmsShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#4a5544]">{label}</span>
      <input className={cmsInput} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#4a5544]">{label}</span>
      <textarea className={cmsInput} rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

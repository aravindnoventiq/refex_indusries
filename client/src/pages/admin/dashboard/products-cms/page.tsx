import { useEffect, useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
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

type ProductHero = {
  backgroundImage?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  description?: string;
};

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
  const [tab, setTab] = useState<'hero' | 'pages'>('pages');
  const [slug, setSlug] = useState(PRODUCT_SLUGS[0].slug);
  const [hero, setHero] = useState<ProductHero>({ titleLine1: 'Our Products' });
  const [page, setPage] = useState<ProductPage>(emptyPage(PRODUCT_SLUGS[0].slug, PRODUCT_SLUGS[0].name));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadHero = async () => {
    try {
      const data = await productsCmsApi.getHero();
      if (data) setHero(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load product hero');
    }
  };

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
    loadHero();
  }, []);

  useEffect(() => {
    loadPage(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const saveHero = async () => {
    try {
      setError('');
      await productsCmsApi.saveHero(hero);
      setSuccess('Product hero saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save hero');
    }
  };

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
      <div className="mb-6 rounded-lg bg-white shadow">
        <nav className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab('pages')}
            className={`px-6 py-4 text-sm font-medium ${tab === 'pages' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Product pages
          </button>
          <button
            type="button"
            onClick={() => setTab('hero')}
            className={`px-6 py-4 text-sm font-medium ${tab === 'hero' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Landing hero
          </button>
        </nav>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      {success && <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">{success}</div>}

      {tab === 'hero' ? (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-4">
            <Field label="Title line 1" value={hero.titleLine1 || ''} onChange={(titleLine1) => setHero({ ...hero, titleLine1 })} />
            <Field label="Title line 2" value={hero.titleLine2 || ''} onChange={(titleLine2) => setHero({ ...hero, titleLine2 })} />
            <Field label="Subtitle" value={hero.subtitle || ''} onChange={(subtitle) => setHero({ ...hero, subtitle })} />
            <TextArea label="Description" value={hero.description || ''} onChange={(description) => setHero({ ...hero, description })} />
            <Field label="Background image URL" value={hero.backgroundImage || ''} onChange={(backgroundImage) => setHero({ ...hero, backgroundImage })} />
          </div>
          <button type="button" onClick={saveHero} className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Save hero
          </button>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex flex-wrap gap-2">
            {PRODUCT_SLUGS.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSlug(item.slug)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  slug === item.slug ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
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
              onChange={(value) => setPage({ ...page, bullets: value.split('\n').map((item) => item.trim()).filter(Boolean) })}
            />
            <TextArea
              label="Image URLs (one per line)"
              value={(page.images || []).join('\n')}
              onChange={(value) => setPage({ ...page, images: value.split('\n').map((item) => item.trim()).filter(Boolean) })}
            />
            <TextArea
              label="Packaging (Label | Value, one per line)"
              value={(page.packaging || []).map((row) => `${row.label} | ${row.value}`).join('\n')}
              onChange={(value) =>
                setPage({
                  ...page,
                  packaging: value.split('\n').filter(Boolean).map((line) => {
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
                  properties: value.split('\n').filter(Boolean).map((line) => {
                    const [label, ...rest] = line.split('|');
                    return { label: (label || '').trim(), value: rest.join('|').trim() };
                  }),
                })
              }
            />
            <Field label="Properties note" value={page.propertiesNote || ''} onChange={(propertiesNote) => setPage({ ...page, propertiesNote })} />
            <Field label="MSDS URL" value={page.msdsUrl || ''} onChange={(msdsUrl) => setPage({ ...page, msdsUrl })} />
            <TextArea label="Description" value={page.description || ''} onChange={(description) => setPage({ ...page, description })} />
            <TextArea
              label="Related products (Name | Image URL | Link, one per line)"
              value={(page.related || []).map((row) => `${row.name} | ${row.image} | ${row.link}`).join('\n')}
              onChange={(value) =>
                setPage({
                  ...page,
                  related: value.split('\n').filter(Boolean).map((line) => {
                    const [name, image, link] = line.split('|').map((part) => part.trim());
                    return { name: name || '', image: image || '', link: link || '' };
                  }),
                })
              }
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Until you save content here, the live product page keeps its current hardcoded layout.
          </p>
          <button type="button" onClick={savePage} className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Save {page.name}
          </button>
        </div>
      )}
    </AdminCmsShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <input
        className="w-full rounded-lg border border-gray-300 px-4 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        className="w-full rounded-lg border border-gray-300 px-4 py-2"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

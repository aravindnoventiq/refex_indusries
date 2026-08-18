import { useEffect, useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import { legalCmsApi } from '../../../../services/api';

type LegalPage = {
  slug: string;
  title: string;
  heroTitle?: string;
  contentHtml?: string;
  isActive?: boolean;
};

const TABS = [
  { slug: 'privacy-policy', label: 'Privacy Policy' },
  { slug: 'terms-of-use', label: 'Terms of Use' },
] as const;

export default function LegalCMSPage() {
  const [slug, setSlug] = useState<(typeof TABS)[number]['slug']>('privacy-policy');
  const [page, setPage] = useState<LegalPage>({
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    heroTitle: 'Privacy Policy',
    contentHtml: '',
    isActive: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async (nextSlug = slug) => {
    try {
      setError('');
      const data = await legalCmsApi.getBySlug(nextSlug);
      setPage(
        data || {
          slug: nextSlug,
          title: nextSlug === 'privacy-policy' ? 'Privacy Policy' : 'Terms of Use',
          heroTitle: nextSlug === 'privacy-policy' ? 'Privacy Policy' : 'Terms of Use',
          contentHtml: '',
          isActive: true,
        },
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load legal page');
    }
  };

  useEffect(() => {
    load(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const save = async () => {
    try {
      setError('');
      setSuccess('');
      await legalCmsApi.save(slug, page);
      setSuccess('Legal page saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save legal page');
    }
  };

  return (
    <AdminCmsShell title="Legal Pages CMS" subtitle="Manage privacy policy and terms of use">
      <div className="mb-6 rounded-lg bg-white shadow">
        <nav className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setSlug(tab.slug)}
              className={`border-b-2 px-6 py-4 text-sm font-medium ${
                slug === tab.slug
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">{success}</div>
        )}
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Page title</span>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Hero title</span>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              value={page.heroTitle || ''}
              onChange={(e) => setPage({ ...page, heroTitle: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Content HTML</span>
            <textarea
              className="min-h-[320px] w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm"
              value={page.contentHtml || ''}
              onChange={(e) => setPage({ ...page, contentHtml: e.target.value })}
              placeholder="Leave empty to keep the current hardcoded page content."
            />
          </label>
        </div>
        <button
          type="button"
          onClick={save}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Save changes
        </button>
      </div>
    </AdminCmsShell>
  );
}

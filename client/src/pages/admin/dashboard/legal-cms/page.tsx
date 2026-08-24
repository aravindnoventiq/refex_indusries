import { useEffect, useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import AdminCmsAlerts from '../components/AdminCmsAlerts';
import { cmsInput, cmsPanel, cmsPrimaryBtn } from '../components/adminCmsStyles';
import { legalCmsApi } from '../../../../services/api';

type LegalPage = {
  slug: string;
  title: string;
  heroTitle?: string;
  contentHtml?: string;
  isActive?: boolean;
};

const TABS = [
  { id: 'privacy-policy', label: 'Privacy Policy', icon: 'ri-shield-check-line' },
  { id: 'terms-of-use', label: 'Terms of Use', icon: 'ri-file-text-line' },
] as const;

export default function LegalCMSPage() {
  const [slug, setSlug] = useState<(typeof TABS)[number]['id']>('privacy-policy');
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
      <AdminCmsTabs tabs={[...TABS]} activeId={slug} onChange={(id) => setSlug(id as typeof slug)} />
      <AdminCmsAlerts error={error} success={success} />

      <div className={cmsPanel}>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4a5544]">Page title</span>
            <input
              className={cmsInput}
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4a5544]">Hero title</span>
            <input
              className={cmsInput}
              value={page.heroTitle || ''}
              onChange={(e) => setPage({ ...page, heroTitle: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#4a5544]">Content HTML</span>
            <textarea
              className={`${cmsInput} min-h-[320px] font-mono text-sm`}
              value={page.contentHtml || ''}
              onChange={(e) => setPage({ ...page, contentHtml: e.target.value })}
              placeholder="Leave empty to keep the current hardcoded page content."
            />
          </label>
        </div>
        <button type="button" onClick={save} className={`mt-6 ${cmsPrimaryBtn}`}>
          Save changes
        </button>
      </div>
    </AdminCmsShell>
  );
}

import { useEffect, useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsAlerts from '../components/AdminCmsAlerts';
import { cmsInput, cmsPanel, cmsPrimaryBtn, cmsSecondaryBtn } from '../components/adminCmsStyles';
import { readyMixCmsApi } from '../../../../services/api';
import { DEFAULT_RMC_PAGE, mergeRmcPage, type RmcCard, type RmcNews, type RmcPageContent } from '../../../ready-mix-concrete/rmcContent';

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const className = `${cmsInput} ${multiline ? 'min-h-28' : ''}`;
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[#1f1f1f]">{label}</span>
      {multiline ? (
        <textarea className={className} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={className} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export default function ReadyMixCMSPage() {
  const [page, setPage] = useState<RmcPageContent>(DEFAULT_RMC_PAGE);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    readyMixCmsApi
      .get()
      .then((data) => setPage(mergeRmcPage(data)))
      .catch((err: { message?: string }) => setError(err.message || 'Could not load Ready Mix content'));
  }, []);

  const patch = (next: Partial<RmcPageContent>) => setPage((current) => ({ ...current, ...next }));

  const updateCards = (key: 'advantages' | 'sustainabilityCards', index: number, card: Partial<RmcCard>) => {
    setPage((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) => (itemIndex === index ? { ...item, ...card } : item)),
    }));
  };

  const updateNews = (index: number, item: Partial<RmcNews>) => {
    setPage((current) => ({
      ...current,
      news: current.news.map((entry, itemIndex) => (itemIndex === index ? { ...entry, ...item } : entry)),
    }));
  };

  const save = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const saved = await readyMixCmsApi.save(page);
      setPage(mergeRmcPage(saved));
      setSuccess('Ready Mix Concrete page saved. It is live on the public page.');
    } catch (err: any) {
      setError(err.message || 'Could not save Ready Mix content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminCmsShell
      title="Ready Mix Concrete"
      subtitle="Corporate communications can update the RMC page here. Image fields take an uploaded file path or URL."
    >
      <AdminCmsAlerts error={error} success={success} />
      <div className="space-y-6">
        <section className={cmsPanel}>
          <h2 className="text-lg font-semibold">Headline and banner</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Headline line 1" value={page.headlineLine1} onChange={(headlineLine1) => patch({ headlineLine1 })} />
            <Field label="Headline line 2" value={page.headlineLine2} onChange={(headlineLine2) => patch({ headlineLine2 })} />
            <Field label="Banner image" value={page.bannerImage} onChange={(bannerImage) => patch({ bannerImage })} />
          </div>
        </section>

        <section className={cmsPanel}>
          <h2 className="text-lg font-semibold">About and vision</h2>
          <div className="mt-4 grid gap-4">
            <Field label="About" value={page.about} onChange={(about) => patch({ about })} multiline />
            <Field label="Vision" value={page.vision} onChange={(vision) => patch({ vision })} multiline />
          </div>
        </section>

        <section className={cmsPanel}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">The Refex Advantage</h2>
            <button
              type="button"
              className={cmsSecondaryBtn}
              onClick={() => patch({ advantages: [...page.advantages, { title: '', text: '' }] })}
            >
              Add point
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {page.advantages.map((item, index) => (
              <div key={index} className="grid gap-3 border-t border-[#e4eadf] pt-4 md:grid-cols-2">
                <Field label={`Point ${index + 1} title`} value={item.title} onChange={(title) => updateCards('advantages', index, { title })} />
                <Field label="Text" value={item.text} onChange={(text) => updateCards('advantages', index, { text })} multiline />
              </div>
            ))}
          </div>
        </section>

        <section className={cmsPanel}>
          <h2 className="text-lg font-semibold">Products, footprint, and clients</h2>
          <p className="mt-1 text-sm text-[#4a5544]">Leave a block empty to keep the placeholder on the page.</p>
          <div className="mt-4 grid gap-4">
            <Field label="Products copy" value={page.products} onChange={(products) => patch({ products })} multiline />
            <Field label="Products image" value={page.productsImage} onChange={(productsImage) => patch({ productsImage })} />
            <Field label="Footprint copy" value={page.footprint} onChange={(footprint) => patch({ footprint })} multiline />
            <Field label="Footprint image" value={page.footprintImage} onChange={(footprintImage) => patch({ footprintImage })} />
            <Field label="Clients copy" value={page.clients} onChange={(clients) => patch({ clients })} multiline />
            <Field label="Clients image" value={page.clientsImage} onChange={(clientsImage) => patch({ clientsImage })} />
          </div>
        </section>

        <section className={cmsPanel}>
          <h2 className="text-lg font-semibold">Sustainability</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Title" value={page.sustainabilityTitle} onChange={(sustainabilityTitle) => patch({ sustainabilityTitle })} />
            <Field label="Introduction" value={page.sustainabilityIntro} onChange={(sustainabilityIntro) => patch({ sustainabilityIntro })} multiline />
            {page.sustainabilityCards.map((item, index) => (
              <div key={index} className="grid gap-3 border-t border-[#e4eadf] pt-4 md:grid-cols-2">
                <Field label={`Card ${index + 1} title`} value={item.title} onChange={(title) => updateCards('sustainabilityCards', index, { title })} />
                <Field label="Text" value={item.text} onChange={(text) => updateCards('sustainabilityCards', index, { text })} multiline />
              </div>
            ))}
            <Field label="Closing line" value={page.sustainabilityClose} onChange={(sustainabilityClose) => patch({ sustainabilityClose })} multiline />
          </div>
        </section>

        <section className={cmsPanel}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">News</h2>
            <button
              type="button"
              className={cmsSecondaryBtn}
              onClick={() => patch({ news: [...page.news, { label: '', title: '', summary: '' }] })}
            >
              Add story
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {page.news.map((item, index) => (
              <div key={index} className="grid gap-3 border-t border-[#e4eadf] pt-4">
                <Field label="Label" value={item.label} onChange={(label) => updateNews(index, { label })} />
                <Field label="Title" value={item.title} onChange={(title) => updateNews(index, { title })} />
                <Field label="Summary" value={item.summary} onChange={(summary) => updateNews(index, { summary })} multiline />
              </div>
            ))}
          </div>
        </section>

        <section className={cmsPanel}>
          <h2 className="text-lg font-semibold">Leadership and contact</h2>
          <div className="mt-4 grid gap-4">
            <Field label="Name" value={page.leaderName} onChange={(leaderName) => patch({ leaderName })} />
            <Field label="Role" value={page.leaderRole} onChange={(leaderRole) => patch({ leaderRole })} />
            <Field label="Biography" value={page.leaderBio} onChange={(leaderBio) => patch({ leaderBio })} multiline />
            <Field label="Photo" value={page.leaderImage} onChange={(leaderImage) => patch({ leaderImage })} />
            <Field label="Email" value={page.email} onChange={(email) => patch({ email })} />
            <Field label="Phone" value={page.phone} onChange={(phone) => patch({ phone })} />
          </div>
        </section>

        <button type="button" className={cmsPrimaryBtn} onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save page'}
        </button>
      </div>
    </AdminCmsShell>
  );
}

import { useEffect, useState } from 'react';
import { careersCmsApi } from '../../../../services/api';
import {
  FALLBACK_CAREERS_PAGE,
  mergeCareersPage,
  type CareersPageContent,
} from '../../../careers/careersFallbacks';

type Tab = 'hero' | 'life' | 'why' | 'talent';

export default function CareersPageCMS({ activeTab }: { activeTab: Tab }) {
  const [page, setPage] = useState<CareersPageContent>(FALLBACK_CAREERS_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await careersCmsApi.get();
      setPage(mergeCareersPage(data));
    } catch (err: any) {
      setError(err.message || 'Failed to load careers CMS');
      setPage(FALLBACK_CAREERS_PAGE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      setError('');
      setSuccess('');
      await careersCmsApi.save(page);
      setSuccess('Careers page saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save careers page');
    }
  };

  const updateCard = (index: number, patch: Partial<CareersPageContent['whyCards'][number]>) => {
    const whyCards = page.whyCards.map((card, i) => (i === index ? { ...card, ...patch } : card));
    setPage({ ...page, whyCards });
  };

  if (loading) {
    return <p className="text-gray-600">Loading careers CMS…</p>;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">{success}</div>
      )}

      {activeTab === 'hero' && (
        <div className="space-y-4">
          <Field label="Eyebrow" value={page.heroEyebrow} onChange={(heroEyebrow) => setPage({ ...page, heroEyebrow })} />
          <Field label="Title" value={page.heroTitle} onChange={(heroTitle) => setPage({ ...page, heroTitle })} />
          <TextArea
            label="Subtitle"
            value={page.heroSubtitle}
            onChange={(heroSubtitle) => setPage({ ...page, heroSubtitle })}
          />
          <Field
            label="Background image URL"
            value={page.heroBackground}
            onChange={(heroBackground) => setPage({ ...page, heroBackground })}
          />
          <Field label="CTA text" value={page.heroCtaText} onChange={(heroCtaText) => setPage({ ...page, heroCtaText })} />
        </div>
      )}

      {activeTab === 'life' && (
        <div className="space-y-4">
          <Field label="Eyebrow" value={page.lifeEyebrow} onChange={(lifeEyebrow) => setPage({ ...page, lifeEyebrow })} />
          <Field label="Title" value={page.lifeTitle} onChange={(lifeTitle) => setPage({ ...page, lifeTitle })} />
          <TextArea
            label="Subtitle"
            value={page.lifeSubtitle}
            onChange={(lifeSubtitle) => setPage({ ...page, lifeSubtitle })}
          />
          <Field label="Gallery image URL" value={page.lifeImage} onChange={(lifeImage) => setPage({ ...page, lifeImage })} />
        </div>
      )}

      {activeTab === 'why' && (
        <div className="space-y-4">
          <Field label="Title" value={page.whyTitle} onChange={(whyTitle) => setPage({ ...page, whyTitle })} />
          <TextArea
            label="Subtitle"
            value={page.whySubtitle}
            onChange={(whySubtitle) => setPage({ ...page, whySubtitle })}
          />
          <Field
            label="Background image URL"
            value={page.whyBackground}
            onChange={(whyBackground) => setPage({ ...page, whyBackground })}
          />
          <Field
            label="Values (comma separated)"
            value={page.whyValues.join(', ')}
            onChange={(value) =>
              setPage({
                ...page,
                whyValues: value.split(',').map((item) => item.trim()).filter(Boolean),
              })
            }
          />
          <div className="space-y-3">
            {page.whyCards.map((card, index) => (
              <div key={`${card.title}-${index}`} className="rounded-lg border border-gray-200 p-4">
                <Field label="Card title" value={card.title} onChange={(title) => updateCard(index, { title })} />
                <TextArea
                  label="Description"
                  value={card.description}
                  onChange={(description) => updateCard(index, { description })}
                />
                <Field label="Icon name" value={card.icon} onChange={(icon) => updateCard(index, { icon })} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'talent' && (
        <div className="space-y-4">
          <Field
            label="Eyebrow"
            value={page.talentEyebrow}
            onChange={(talentEyebrow) => setPage({ ...page, talentEyebrow })}
          />
          <Field
            label="Title"
            value={page.talentTitle}
            onChange={(talentTitle) => setPage({ ...page, talentTitle })}
          />
          <Field
            label="Background image URL"
            value={page.talentBackground}
            onChange={(talentBackground) => setPage({ ...page, talentBackground })}
          />
          <Field label="Form title" value={page.formTitle} onChange={(formTitle) => setPage({ ...page, formTitle })} />
          <Field
            label="Form subtitle"
            value={page.formSubtitle}
            onChange={(formSubtitle) => setPage({ ...page, formSubtitle })}
          />
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-[#7cd244] px-6 py-2 text-white hover:bg-[#6db038]"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={load}
          className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#7cd244] focus:ring-2 focus:ring-[#7cd244]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#7cd244] focus:ring-2 focus:ring-[#7cd244]"
      />
    </label>
  );
}

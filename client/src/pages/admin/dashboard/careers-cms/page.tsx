import { useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import CareersPageCMS from '../components/CareersPageCMS';

export default function CareersCMSPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'life' | 'why' | 'talent'>('hero');

  return (
    <AdminCmsShell title="Careers Page CMS" subtitle="Manage Careers page sections">
      <div className="mb-6 rounded-lg bg-white shadow">
        <nav className="flex overflow-x-auto border-b border-gray-200">
          {(
            [
              ['hero', 'ri-image-line', 'Hero'],
              ['life', 'ri-group-line', 'Life at Refex'],
              ['why', 'ri-star-line', 'Why Choose Refex'],
              ['talent', 'ri-user-add-line', 'Talent Network'],
            ] as const
          ).map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <i className={`${icon} mr-2`} />
              {label}
            </button>
          ))}
        </nav>
      </div>
      <CareersPageCMS activeTab={activeTab} />
    </AdminCmsShell>
  );
}

import { useState, useEffect } from 'react';
import { newsroomCmsApi } from '../../../services/api';
import PressReleases from './PressReleases';
import Events from './Events';
import {
  newsroomContainer,
  newsroomSectionSageClass,
  newsroomSpinnerClass,
  newsroomToggleActiveClass,
  newsroomToggleInactiveClass,
} from '../newsroomLayout';

interface NewsroomTab {
  id: number;
  key: string;
  label: string;
  order: number;
  isActive: boolean;
  isDefault: boolean;
}

export default function NewsroomTabs() {
  const [tabs, setTabs] = useState<NewsroomTab[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    const fallbackTabs: NewsroomTab[] = [
      {
        id: 1,
        key: 'press',
        label: 'Press Releases',
        order: 1,
        isActive: true,
        isDefault: true,
      },
      {
        id: 2,
        key: 'events',
        label: 'Events',
        order: 2,
        isActive: true,
        isDefault: false,
      },
    ];

    try {
      setLoading(true);
      const data = await newsroomCmsApi.getTabs();
      const activeTabs = (data || [])
        .filter((tab: NewsroomTab) => tab.isActive)
        .sort((a: NewsroomTab, b: NewsroomTab) => a.order - b.order);

      if (activeTabs.length === 0) {
        setTabs(fallbackTabs);
        setActiveTab(fallbackTabs.find((t) => t.isDefault)?.key || fallbackTabs[0].key);
      } else {
        setTabs(activeTabs);
        const defaultTab = activeTabs.find((t) => t.isDefault);
        setActiveTab(defaultTab?.key || activeTabs[0].key);
      }
    } catch (error) {
      console.error('Failed to fetch tabs:', error);
      setTabs(fallbackTabs);
      setActiveTab(fallbackTabs.find((t) => t.isDefault)?.key || fallbackTabs[0].key);
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'press':
        return <PressReleases />;
      case 'events':
        return <Events />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className={newsroomSectionSageClass}>
        <div className={newsroomContainer}>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className={newsroomSpinnerClass} aria-hidden />
              <p className="mt-4 text-[#5a5a5a]">Loading tabs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (tabs.length === 0) {
    return null;
  }

  return (
    <section className={newsroomSectionSageClass}>
      <div className={newsroomContainer}>
        <div className="mb-10 flex items-center justify-start gap-3 overflow-x-auto pb-2 sm:mb-12 sm:justify-center sm:gap-4 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 cursor-pointer rounded-full px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap sm:px-8 sm:py-3.5 sm:text-base ${
                activeTab === tab.key ? newsroomToggleActiveClass : newsroomToggleInactiveClass
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </section>
  );
}

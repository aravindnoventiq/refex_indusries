export type AdminCmsTab = {
  id: string;
  label: string;
  icon?: string;
};

type AdminCmsTabsProps = {
  tabs: readonly AdminCmsTab[] | AdminCmsTab[];
  activeId: string;
  onChange: (id: string) => void;
};

export default function AdminCmsTabs({ tabs, activeId, onChange }: AdminCmsTabsProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-[#d9e2d4] bg-white shadow-sm">
      <nav className="flex overflow-x-auto border-b border-[#d9e2d4]">
        {tabs.map((tab) => {
          const active = activeId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`whitespace-nowrap border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                active
                  ? 'border-[#7cd244] text-[#4f8f2a]'
                  : 'border-transparent text-[#6b7468] hover:border-[#c5d4bc] hover:text-[#1f1f1f]'
              }`}
            >
              {tab.icon ? <i className={`${tab.icon} mr-2`} /> : null}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

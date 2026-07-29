import { useSiteTheme } from './SiteThemeProvider';

interface ThemeToggleProps {
  /** Compact icon-only for header; full labels for standalone use */
  variant?: 'header' | 'standalone';
  className?: string;
}

export default function ThemeToggle({ variant = 'header', className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useSiteTheme();
  const isDark = theme === 'dark';

  if (variant === 'header') {
    return (
      <div
        className={`flex items-center rounded-full border border-white/20 bg-white/[0.06] p-0.5 ${className}`}
        role="group"
        aria-label="Site theme"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-pressed={!isDark}
          aria-label="Light theme"
          title="Light theme"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
            !isDark
              ? 'bg-[#7cd144] text-[#0a0a0a] shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <i className="ri-sun-line text-base" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          aria-pressed={isDark}
          aria-label="Dark theme"
          title="Dark theme"
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
            isDark
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <i className="ri-moon-line text-base" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex rounded-full p-1 shadow-lg backdrop-blur-md ring-1 ${className}`}
      style={{
        background: isDark ? 'rgba(10,10,10,0.88)' : 'rgba(255,255,255,0.92)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.45)'
          : '0 8px 32px rgba(45,80,22,0.12)',
      }}
      role="group"
      aria-label="Site theme"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        className={`rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all sm:px-4 ${
          !isDark ? 'bg-[#2d5016] text-white shadow-sm' : 'text-[#484848] hover:text-[#1f1f1f]'
        }`}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        className={`rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all sm:px-4 ${
          isDark ? 'bg-[#7cd144] text-black shadow-sm' : 'text-[#484848] hover:text-[#1f1f1f]'
        }`}
      >
        Dark
      </button>
    </div>
  );
}

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';

type AdminCmsShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  showBack?: boolean;
};

export default function AdminCmsShell({
  title,
  subtitle,
  children,
  showBack = true,
}: AdminCmsShellProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div
      className="min-h-screen bg-[#f4f6f3] text-[#1f1f1f]"
      style={{ fontFamily: '"Open Sans", sans-serif' }}
    >
      <header className="border-b border-[#d9e2d4] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            {showBack && (
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="rounded-lg p-1.5 text-[#4a5544] transition-colors hover:bg-[#7cd244]/15 hover:text-[#1f1f1f]"
                aria-label="Back to dashboard"
              >
                <i className="ri-arrow-left-line text-xl" />
              </button>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7cd244]">
                Refex CMS
              </p>
              <h1 className="truncate text-xl font-bold text-[#1f1f1f] sm:text-2xl">{title}</h1>
              <p className="truncate text-sm text-[#5c6658]">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-lg border border-[#d9e2d4] bg-white px-4 py-2 text-sm font-medium text-[#4a5544] transition-colors hover:border-[#7cd244] hover:text-[#1f1f1f]"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

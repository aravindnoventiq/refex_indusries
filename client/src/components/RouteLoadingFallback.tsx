import { useLocation } from 'react-router-dom';
import Header from '../pages/home/components/Header';

/** Shown while lazy route chunks load — keeps the site header visible (ESG-style). */
export default function RouteLoadingFallback() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#7fc345]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://refex.co.in/wp-content/uploads/2024/07/logo-refex.svg"
              alt=""
              className="h-16 w-16 object-contain"
              aria-hidden
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main
        className="min-h-[50vh] bg-white pt-[var(--header-offset,5.25rem)]"
        aria-busy="true"
        aria-label="Loading page"
      />
    </>
  );
}

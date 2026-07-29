import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { SiteThemeProvider } from './components/SiteThemeProvider';
import RouteLoadingFallback from './components/RouteLoadingFallback';

function AppContent() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <AppRoutes />
    </Suspense>
  );
}

function App() {
  const basePath = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '/';

  return (
    <AuthProvider>
      <BrowserRouter basename={basePath}>
        <SiteThemeProvider>
          <AppContent />
        </SiteThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { PageLoader } from '@/components/ui/Spinner';
import { publicRoutes } from '@/pages/public/routes';
import { adminRoutes } from '@/pages/admin/routes';
import { useFavicon } from '@/hooks/useFavicon';

const AdminLayout = lazy(() =>
  import('@/components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })),
);
const AdminLoginPage = lazy(() =>
  import('@/pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
);

export default function App() {
  // Dynamically update favicon from site settings
  useFavicon();

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<PageLoader className="min-h-screen" />}>
            <AdminLoginPage />
          </Suspense>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageLoader className="min-h-screen" />}>
              <AdminLayout />
            </Suspense>
          }
        >
          {adminRoutes.map((route, i) =>
            route.index ? (
              <Route key={`admin-index-${i}`} index element={route.element} />
            ) : (
              <Route key={route.path ?? `admin-route-${i}`} path={route.path} element={route.element} />
            ),
          )}
        </Route>
      </Route>
    </Routes>
  );
}

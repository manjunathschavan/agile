import { Outlet, Navigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';

export function RootLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

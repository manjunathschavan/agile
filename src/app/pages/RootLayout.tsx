import { Outlet } from 'react-router';
import { Navigation } from '../components/Navigation';

export function RootLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

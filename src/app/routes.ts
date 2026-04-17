import { createBrowserRouter } from 'react-router';
import { RootLayout } from './pages/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { CalendarPage } from './pages/CalendarPage';
import { AttendeesPage } from './pages/AttendeesPage';
import { ClubsPage } from './pages/ClubsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { PaymentSettingsPage } from './pages/PaymentSettingsPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';

const basename = import.meta.env.DEV ? '/' : '/agile/';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'events', Component: EventsPage },
      { path: 'events/:id', Component: EventDetailPage },
      { path: 'create-event', Component: CreateEventPage },
      { path: 'calendar', Component: CalendarPage },
      { path: 'clubs', Component: ClubsPage },
      { path: 'attendees', Component: AttendeesPage },
      { path: 'payments', Component: PaymentsPage },
      { path: 'payment-settings', Component: PaymentSettingsPage },
      { path: 'profile', Component: ProfilePage },
    ],
  },
], { basename });

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockStats, mockEvents, mockClubs } from '../data/mockData';
import { Calendar, Users, DollarSign, TrendingUp, Building2, UserCheck } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Badge } from '../components/ui/badge';

export function Dashboard() {
  const navigate = useNavigate();
  const upcomingEvents = mockEvents.filter((e) => e.status === 'upcoming').slice(0, 3);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const revenue = transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    setTotalRevenue(revenue);
  }, []);

  const stats = [
    {
      title: 'Total Events',
      value: mockStats.totalEvents,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      subtitle: `${mockStats.upcomingEvents} upcoming`,
    },
    {
      title: 'Active Clubs',
      value: mockStats.totalClubs,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      subtitle: 'Student organizations',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: 'From paid events',
    },
    {
      title: 'Active Members',
      value: mockStats.activeMemberships,
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      subtitle: 'Club memberships',
    },
  ];

  const eventsByCategory = [
    { category: 'Workshop', count: 8, color: '#3b82f6' },
    { category: 'Social', count: 6, color: '#8b5cf6' },
    { category: 'Performance', count: 4, color: '#ef4444' },
    { category: 'Competition', count: 5, color: '#f59e0b' },
    { category: 'Academic', count: 5, color: '#10b981' },
  ];

  const monthlyActivity = [
    { month: 'Sep', events: 5, rsvps: 320 },
    { month: 'Oct', events: 7, rsvps: 450 },
    { month: 'Nov', events: 6, rsvps: 380 },
    { month: 'Dec', events: 4, rsvps: 250 },
    { month: 'Jan', events: 8, rsvps: 520 },
    { month: 'Feb', events: 10, rsvps: 680 },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your college clubs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="events"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Events"
                />
                <Line
                  type="monotone"
                  dataKey="rsvps"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="RSVPs"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventsByCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {eventsByCategory.map((entry) => (
                    <Cell key={`cell-${entry.category}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Clubs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Active Clubs</CardTitle>
            <button
              onClick={() => navigate('/clubs')}
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {mockClubs.map((club) => (
              <div
                key={club.id}
                className="p-3 sm:p-4 border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={() => navigate('/clubs')}
              >
                <div className="text-3xl sm:text-4xl mb-2 text-center">{club.logo}</div>
                <h4 className="font-semibold text-xs sm:text-sm text-center mb-1 line-clamp-2">
                  {club.name}
                </h4>
                <p className="text-xs text-muted-foreground text-center">
                  {club.memberCount} members
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Upcoming Events</h2>
          <button
            onClick={() => navigate('/events')}
            className="text-xs sm:text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={(id) => navigate(`/events/${id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
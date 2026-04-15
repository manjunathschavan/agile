import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockEvents } from '../data/mockData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';

export function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfMonth = monthStart.getDay();
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day: Date) => {
    return mockEvents.filter(event => 
      isSameDay(new Date(event.date), day)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Calendar</h1>
          <p className="text-muted-foreground">
            View all events in calendar format
          </p>
        </div>
        <Button onClick={goToToday}>
          Today
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                Next
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-sm p-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="min-h-24 p-2" />
            ))}

            {/* Calendar days */}
            {daysInMonth.map(day => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toString()}
                  className={`min-h-24 p-2 border rounded-lg ${
                    isCurrentDay ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                  } ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}`}
                >
                  <div className={`text-sm font-semibold mb-1 ${
                    isCurrentDay ? 'text-blue-600' : ''
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 bg-blue-100 hover:bg-blue-200 rounded cursor-pointer truncate"
                        onClick={() => navigate(`/events/${event.id}`)}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events List */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Upcoming Events This Month</h3>
          <div className="space-y-3">
            {mockEvents
              .filter(event => {
                const eventDate = new Date(event.date);
                return isSameMonth(eventDate, currentDate) && event.status === 'upcoming';
              })
              .map(event => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg p-3 min-w-[60px]">
                      <span className="text-sm font-semibold text-blue-600">
                        {format(new Date(event.date), 'MMM')}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {format(new Date(event.date), 'd')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.time} • {event.location}
                      </p>
                    </div>
                  </div>
                  <Badge>{event.category}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Event } from '../types/event';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onViewDetails?: (eventId: string) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'ongoing':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const attendancePercentage = (event.attendeeCount / event.maxAttendees) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <Badge
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 text-xs ${getStatusColor(event.status)}`}
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>
        {!event.isOpenToAllStudents && (
          <Badge className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-purple-500 text-xs">
            Members Only
          </Badge>
        )}
      </div>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{event.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">by {event.clubName}</p>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">{event.category}</Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2">
          {event.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-2 p-4 sm:p-6 pt-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          <span className="truncate">
            {format(new Date(event.date), 'MMM dd, yyyy')} at {event.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          <span>
            {event.attendeeCount} / {event.maxAttendees} {event.requiresRSVP ? 'RSVPs' : 'attendees'}
          </span>
        </div>
        {event.price !== undefined && (
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
            <span className="font-semibold">
              {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
            </span>
          </div>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button
          className="w-full text-sm sm:text-base"
          onClick={() => onViewDetails?.(event.id)}
        >
          {event.requiresRSVP ? 'RSVP Now' : 'View Details'}
        </Button>
      </CardFooter>
    </Card>
  );
}
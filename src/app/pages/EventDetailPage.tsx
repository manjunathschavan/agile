import { useParams, useNavigate } from 'react-router';
import { mockEvents, mockAttendees } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Share2,
  Edit,
  Trash2,
  ArrowLeft,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PaymentDialog } from '../components/PaymentDialog';
import { useState } from 'react';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === id);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  if (!event) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <Button onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    );
  }

  const attendancePercentage = (event.attendeeCount / event.maxAttendees) * 100;

  const handlePaymentSuccess = (transactionId: string) => {
    setIsRegistered(true);
    console.log('Payment successful:', transactionId);
  };

  const handleRegisterClick = () => {
    if (event.price && event.price > 0) {
      setIsPaymentDialogOpen(true);
    } else {
      setIsRegistered(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          variant="ghost"
          className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 p-0"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 -mt-12 sm:-mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
                      {event.title}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="text-xs sm:text-sm">{event.category}</Badge>
                      <Badge
                        variant={event.status === 'upcoming' ? 'default' : 'secondary'}
                        className="text-xs sm:text-sm"
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                      {!event.isOpenToAllStudents && (
                        <Badge variant="outline" className="text-xs sm:text-sm">Members Only</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:text-red-700 h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="prose max-w-none">
                  <p className="text-sm sm:text-base text-muted-foreground">{event.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm sm:text-base font-semibold">
                        {format(new Date(event.date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm sm:text-base font-semibold">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm sm:text-base font-semibold">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Organizer</p>
                      <p className="text-sm sm:text-base font-semibold">{event.organizer}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span>{event.requiresRSVP ? 'RSVPs' : 'Attendees'}</span>
                    <span>
                      {event.attendeeCount} / {event.maxAttendees}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${attendancePercentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendees Tab */}
            <Card>
              <Tabs defaultValue="attendees" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b px-4 sm:px-6">
                  <TabsTrigger value="attendees" className="text-xs sm:text-sm">
                    Attendees ({mockAttendees.length})
                  </TabsTrigger>
                  <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="attendees" className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    {mockAttendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center justify-between p-2 sm:p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                            <AvatarImage src={attendee.avatar} />
                            <AvatarFallback>
                              {attendee.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-semibold truncate">
                              {attendee.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {attendee.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            attendee.checkInStatus === 'checked-in'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-xs shrink-0 ml-2"
                        >
                          {attendee.checkInStatus === 'checked-in'
                            ? 'Checked In'
                            : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="details" className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Club</span>
                      <span className="font-semibold">{event.clubName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requires RSVP</span>
                      <span className="font-semibold">
                        {event.requiresRSVP ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open to All</span>
                      <span className="font-semibold">
                        {event.isOpenToAllStudents ? 'Yes' : 'Members Only'}
                      </span>
                    </div>
                    {event.budget && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Event Budget</span>
                        <span className="font-semibold">₹{event.budget.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Registration</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {event.price !== undefined && (
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg">
                    <span className="text-sm sm:text-base text-muted-foreground">Entry Fee</span>
                    <span className="text-xl sm:text-2xl font-bold">
                      {event.price === 0 ? 'Free' : `₹${event.price.toFixed(2)}`}
                    </span>
                  </div>
                )}
                {isRegistered ? (
                  <Button className="w-full text-sm sm:text-base" disabled>
                    Registered ✓
                  </Button>
                ) : (
                  <Button className="w-full text-sm sm:text-base" onClick={handleRegisterClick}>
                    {event.requiresRSVP ? 'RSVP Now' : 'Register'}
                  </Button>
                )}
                <Button variant="outline" className="w-full text-sm sm:text-base">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Contact Organizer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Total Spots</span>
                  <span className="font-semibold">{event.maxAttendees}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Registered</span>
                  <span className="font-semibold">{event.attendeeCount}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-semibold text-green-600">
                    {event.maxAttendees - event.attendeeCount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      {event.price !== undefined && event.price > 0 && (
        <PaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          eventTitle={event.title}
          amount={event.price}
          eventId={event.id}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
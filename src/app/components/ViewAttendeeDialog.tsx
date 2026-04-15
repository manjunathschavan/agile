import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Attendee } from '../types/event';
import { format } from 'date-fns';
import { Mail, GraduationCap, Calendar, User, CheckCircle, Clock } from 'lucide-react';

interface ViewAttendeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendee: Attendee | null;
}

export function ViewAttendeeDialog({ open, onOpenChange, attendee }: ViewAttendeeDialogProps) {
  if (!attendee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Attendee Details</DialogTitle>
          <DialogDescription>
            Complete information about the registered student
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={attendee.avatar} />
              <AvatarFallback className="text-2xl">
                {attendee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{attendee.name}</h3>
              <p className="text-sm text-muted-foreground">{attendee.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant={
                    attendee.checkInStatus === 'checked-in' ? 'default' : 'secondary'
                  }
                >
                  {attendee.checkInStatus === 'checked-in' ? 'Checked In' : 'Pending'}
                </Badge>
                <Badge variant="outline">{attendee.ticketType}</Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-semibold font-mono">{attendee.studentId}</p>
              </div>
            </div>

            {attendee.major && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Major</p>
                  <p className="font-semibold">{attendee.major}</p>
                </div>
              </div>
            )}

            {attendee.year && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold">{attendee.year}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-semibold">
                  {format(new Date(attendee.registrationDate), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                {attendee.checkInStatus === 'checked-in' ? (
                  <CheckCircle className="w-5 h-5 text-pink-600" />
                ) : (
                  <Clock className="w-5 h-5 text-pink-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-in Status</p>
                <p className="font-semibold">
                  {attendee.checkInStatus === 'checked-in'
                    ? 'Successfully checked in'
                    : 'Awaiting check-in'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Mail className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <a
                  href={`mailto:${attendee.email}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {attendee.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

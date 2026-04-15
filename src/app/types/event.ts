export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendeeCount: number;
  maxAttendees: number;
  image: string;
  price?: number;
  organizer: string;
  clubId: string;
  clubName: string;
  requiresRSVP: boolean;
  isOpenToAllStudents: boolean;
  budget?: number;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ticketType: string;
  checkInStatus: 'checked-in' | 'pending';
  registrationDate: string;
  studentId: string;
  major?: string;
  year?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  president: string;
  email: string;
  logo: string;
  budget: number;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  revenue: number;
  totalClubs: number;
  activeMemberships: number;
}
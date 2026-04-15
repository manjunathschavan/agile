import { useState } from 'react';
import { mockAttendees } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Search, Download, Mail, CheckCircle, Clock, GraduationCap, Trash2, UserPlus, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Attendee } from '../types/event';
import { AddAttendeeDialog } from '../components/AddAttendeeDialog';
import { ViewAttendeeDialog } from '../components/ViewAttendeeDialog';

export function AttendeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewingAttendee, setViewingAttendee] = useState<Attendee | null>(null);

  // Generate more attendees for display
  const [allAttendees, setAllAttendees] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      ...mockAttendees[i % mockAttendees.length],
      id: `${mockAttendees[i % mockAttendees.length].id}-${i}`,
      name: `${mockAttendees[i % mockAttendees.length].name} ${i > 4 ? i - 4 : ''}`.trim(),
    }))
  );

  const filteredAttendees = allAttendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || attendee.checkInStatus === statusFilter;
    const matchesYear =
      yearFilter === 'all' || attendee.year === yearFilter;

    return matchesSearch && matchesStatus && matchesYear;
  });

  const checkedInCount = allAttendees.filter(
    (a) => a.checkInStatus === 'checked-in'
  ).length;

  const handleDelete = (id: string) => {
    setAllAttendees(allAttendees.filter((a) => a.id !== id));
    toast.success('Attendee removed successfully');
  };

  const handleView = (attendee: Attendee) => {
    setViewingAttendee(attendee);
  };

  const handleAddAttendee = (
    newAttendee: Omit<Attendee, 'id' | 'avatar' | 'registrationDate'>
  ) => {
    const attendee: Attendee = {
      ...newAttendee,
      id: `new-${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAttendee.name}`,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    setAllAttendees([attendee, ...allAttendees]);
    toast.success('Attendee added successfully');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Student Attendees</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage event RSVPs and student registrations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Total RSVPs
                </p>
                <p className="text-xl sm:text-2xl font-bold">{allAttendees.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Checked In</p>
                <p className="text-xl sm:text-2xl font-bold">{checkedInCount}</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {allAttendees.length - checkedInCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Check-in Rate</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {((checkedInCount / allAttendees.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <CardTitle className="text-lg sm:text-xl">All Attendees</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="default" 
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Attendee</span>
                <span className="sm:hidden">Add</span>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
                <Mail className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Email All</span>
                <span className="sm:hidden">Email</span>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full sm:w-[150px] text-sm sm:text-base">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="Freshman">Freshman</SelectItem>
                <SelectItem value="Sophomore">Sophomore</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] text-sm sm:text-base">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="checked-in">Checked In</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Major</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback>
                            {attendee.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{attendee.name}</p>
                          <p className="text-xs text-muted-foreground">{attendee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{attendee.studentId}</TableCell>
                    <TableCell className="text-sm">{attendee.major}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{attendee.year}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{attendee.ticketType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(attendee.registrationDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="text-xs"
                        variant={
                          attendee.checkInStatus === 'checked-in'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {attendee.checkInStatus === 'checked-in'
                          ? 'Checked In'
                          : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(attendee)}
                          className="h-8 px-2 sm:px-3"
                        >
                          <Eye className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(attendee.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {filteredAttendees.map((attendee) => (
              <div
                key={attendee.id}
                className="p-3 sm:p-4 border rounded-lg space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage src={attendee.avatar} />
                    <AvatarFallback>
                      {attendee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">{attendee.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{attendee.email}</p>
                    <p className="text-xs text-muted-foreground font-mono">{attendee.studentId}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="text-xs">{attendee.year}</Badge>
                  <Badge variant="secondary" className="text-xs">{attendee.major}</Badge>
                  <Badge variant="secondary" className="text-xs">{attendee.ticketType}</Badge>
                  <Badge
                    className="text-xs"
                    variant={
                      attendee.checkInStatus === 'checked-in'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {attendee.checkInStatus === 'checked-in'
                      ? 'Checked In'
                      : 'Pending'}
                  </Badge>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Registered: {format(new Date(attendee.registrationDate), 'MMM dd, yyyy')}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => handleView(attendee)}
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(attendee.id)}
                    className="px-2 sm:px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-muted-foreground">No attendees found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddAttendeeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddAttendee}
      />

      <ViewAttendeeDialog
        open={!!viewingAttendee}
        onOpenChange={(open) => !open && setViewingAttendee(null)}
        attendee={viewingAttendee}
      />
    </div>
  );
}
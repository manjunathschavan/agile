import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '../components/ui/switch';
import { mockClubs } from '../data/mockData';

export function CreateEventPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    maxAttendees: '',
    price: '',
    clubId: '',
    requiresRSVP: true,
    isOpenToAllStudents: true,
    budget: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend
    toast.success('Event created successfully!');
    setTimeout(() => navigate('/events'), 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/events')}
          className="shrink-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Event</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Fill in the details to create a new club event
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Event Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Club Selection */}
            <div className="space-y-2">
              <Label htmlFor="clubId">Organizing Club *</Label>
              <Select
                value={formData.clubId}
                onValueChange={(value) =>
                  setFormData({ ...formData, clubId: value })
                }
                required
              >
                <SelectTrigger>
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select your club" />
                </SelectTrigger>
                <SelectContent>
                  {mockClubs.map((club) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.logo} {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Spring Semester Hackathon"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event, what students can expect, and any requirements..."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Competition">Competition</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="pl-10"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Student Center Room 301, Online via Zoom"
                  className="pl-10"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Max Attendees and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Max Attendees *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="maxAttendees"
                    name="maxAttendees"
                    type="number"
                    placeholder="100"
                    className="pl-10"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Event Budget (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    name="budget"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Club budget allocation for this event
                </p>
              </div>
            </div>

            {/* Entry Fee */}
            <div className="space-y-2">
              <Label htmlFor="price">Student Entry Fee (₹)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-10"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty or 0 for free events
              </p>
            </div>

            {/* Event Settings */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Event Settings</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="requiresRSVP">Require RSVP</Label>
                  <p className="text-xs text-muted-foreground">
                    Students must RSVP to attend this event
                  </p>
                </div>
                <Switch
                  id="requiresRSVP"
                  checked={formData.requiresRSVP}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requiresRSVP: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isOpenToAllStudents">Open to All Students</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow non-members to attend
                  </p>
                </div>
                <Switch
                  id="isOpenToAllStudents"
                  checked={formData.isOpenToAllStudents}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isOpenToAllStudents: checked })
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-sm sm:text-base"
                onClick={() => navigate('/events')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 text-sm sm:text-base">
                Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
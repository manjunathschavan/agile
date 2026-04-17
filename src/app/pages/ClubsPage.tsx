import { mockClubs } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Users, Mail, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function ClubsPage() {
  const navigate = useNavigate();
  const [contactClub, setContactClub] = useState<{ name: string } | null>(null);
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRegisterClub = () => toast.info('Club registration form coming soon!');
  const handleManageMembers = () => navigate('/attendees');
  const handleBudgetAllocation = () => navigate('/payments');
  const handleSendAnnouncement = () => toast.info('Announcement feature coming soon!');

  const handleContactSubmit = () => {
    if (!senderEmail || !message) { toast.error('Please fill in all fields'); return; }
    const subject = encodeURIComponent(`Inquiry about ${contactClub?.name}`);
    const body = encodeURIComponent(`From: ${senderEmail}\n\n${message}`);
    window.open(`mailto:clubadmin@college.edu?subject=${subject}&body=${body}`, '_blank');
    toast.success('Email client opened!');
    setContactClub(null); setSenderEmail(''); setMessage('');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: 'bg-blue-100 text-blue-700',
      Arts: 'bg-pink-100 text-pink-700',
      'Social Impact': 'bg-green-100 text-green-700',
      Academic: 'bg-purple-100 text-purple-700',
      Sports: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Student Clubs</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover and manage all registered student organizations
          </p>
        </div>
        <Button className="w-full sm:w-auto text-sm sm:text-base" onClick={handleRegisterClub}>Register New Club</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Total Clubs
                </p>
                <p className="text-xl sm:text-2xl font-bold">{mockClubs.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Total Members
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {mockClubs.reduce((sum, club) => sum + club.memberCount, 0)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  Total Budget
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  ₹{mockClubs.reduce((sum, club) => sum + club.budget, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {mockClubs.map((club) => (
          <Card key={club.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="text-4xl sm:text-5xl">{club.logo}</div>
                <Badge className={getCategoryColor(club.category)}>
                  {club.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">{club.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  {club.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">President</span>
                  <span className="font-semibold truncate ml-2">{club.president}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-semibold">{club.memberCount}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Annual Budget</span>
                  <span className="font-semibold">₹{club.budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  variant="default"
                  className="w-full text-sm sm:text-base"
                  onClick={() => navigate('/events')}
                >
                  View Events
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                  onClick={() => setContactClub({ name: club.name })}
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Contact Club
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Club Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col gap-2 text-sm sm:text-base" onClick={handleManageMembers}>
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Manage Members</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col gap-2 text-sm sm:text-base" onClick={handleBudgetAllocation}>
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Budget Allocation</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 sm:py-4 flex-col gap-2 text-sm sm:text-base" onClick={handleSendAnnouncement}>
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Send Announcement</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Club Dialog */}
      <Dialog open={!!contactClub} onOpenChange={(o) => !o && setContactClub(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Contact {contactClub?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Email</Label>
              <Input placeholder="your@email.com" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Write your message to the club admin..." rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setContactClub(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleContactSubmit}>
                <Mail className="w-4 h-4 mr-2" />Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
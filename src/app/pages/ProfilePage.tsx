import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  eventTitle: string;
  amount: number;
  date: string;
  status: string;
}

export function ProfilePage() {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatar: reader.result as string });
      toast.success('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    // Load user's transactions
    const allTransactions = JSON.parse(
      localStorage.getItem('transactions') || '[]'
    );
    setTransactions(allTransactions);
  }, [isAuthenticated, user, navigate]);

  if (!user) {
    return null;
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUser(user);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    if (editedUser) {
      // Regenerate avatar if name changed
      const updatedData = {
        ...editedUser,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(editedUser.name)}`,
      };
      updateProfile(updatedData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const completedTransactions = transactions.filter(
    (t) => t.status === 'completed'
  ).length;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'club-admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account settings and view your activity
          </p>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl sm:text-3xl">
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h2 className="text-2xl sm:text-3xl font-bold">{user.name}</h2>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role === 'club-admin'
                      ? 'Club Admin'
                      : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserIcon className="w-4 h-4" />
                    <span>Student ID: {user.studentId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>
                      {user.department} • {user.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {format(new Date(user.joinDate), 'MMMM yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleEditToggle}
                  title="Edit Profile"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">
              <UserIcon className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="clubs">
              <Building2 className="w-4 h-4 mr-2" />
              My Clubs
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedUser?.name || ''}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser!, name: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={editedUser?.phone || ''}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser!, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{user.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Student ID</Label>
                    <p className="text-sm font-medium">{user.studentId}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Department</Label>
                    {isEditing ? (
                      <Input
                        value={editedUser?.department || ''}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser!,
                            department: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{user.department}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Year</Label>
                    {isEditing ? (
                      <Input
                        value={editedUser?.year || ''}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser!, year: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium">{user.year}</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleEditToggle}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clubs Tab */}
          <TabsContent value="clubs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.clubs.map((club, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      onClick={() => navigate('/clubs')}
                    >
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{club}</p>
                        <p className="text-sm text-muted-foreground">Member</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Transactions
                      </p>
                      <p className="text-2xl font-bold">{transactions.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Completed
                      </p>
                      <p className="text-2xl font-bold">{completedTransactions}</p>
                    </div>
                    <Settings className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment History</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/payments')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No transactions yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your payment history will appear here
                    </p>
                    <Button onClick={() => navigate('/events')}>
                      Browse Events
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{transaction.eventTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(transaction.date), 'dd MMM yyyy, HH:mm')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{transaction.amount.toFixed(2)}</p>
                          <Badge
                            variant={
                              transaction.status === 'completed'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/payment-settings')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Payment Methods
                </Button>

                <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Notification preferences coming soon!')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Notification Preferences
                </Button>

                <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = `mailto:${user?.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Settings
                </Button>

                <div className="border-t pt-4 mt-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

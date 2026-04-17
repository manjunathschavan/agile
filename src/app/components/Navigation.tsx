import { Link, useLocation, useNavigate } from 'react-router';
import { Calendar, LayoutDashboard, Plus, Users, Menu, X, Building2, CreditCard, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/clubs', icon: Building2, label: 'Clubs' },
    { path: '/attendees', icon: Users, label: 'Attendees' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r bg-card min-h-screen">
        {/* Profile Section at Top */}
        <div className="p-6 border-b flex flex-col items-center text-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Avatar className="w-16 h-16 ring-2 ring-primary ring-offset-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate('/profile')}>
                <UserIcon className="w-3 h-3 mr-1" />
                View Profile
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">ClubHub</h1>
              <p className="text-sm text-muted-foreground">College Event Manager</p>
            </>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? 'default' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
          <Link to="/create-event">
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
          {isAuthenticated ? (
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
              <UserIcon className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-xl font-bold">ClubHub</h1>
        <div className="flex items-center gap-2">
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { navigate('/payment-settings'); setIsMobileMenuOpen(false); }}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[57px] left-0 right-0 bg-card border-b z-50 shadow-lg">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link to="/create-event" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
            {!isAuthenticated && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
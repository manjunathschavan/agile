import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  phone: string;
  avatar: string;
  role: 'student' | 'admin' | 'club-admin';
  clubs: string[];
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  'priya.sharma@college.edu': {
    password: 'password123',
    user: {
      id: 'USER001',
      name: 'Priya Sharma',
      email: 'priya.sharma@college.edu',
      studentId: 'S2023045',
      department: 'Computer Science',
      year: 'Third Year',
      phone: '+91 98765 43210',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      role: 'student',
      clubs: ['Computer Science Society', 'Drama Club'],
      joinDate: '2023-08-15',
    },
  },
  'rahul.kumar@college.edu': {
    password: 'password123',
    user: {
      id: 'USER002',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@college.edu',
      studentId: 'S2022123',
      department: 'Electrical Engineering',
      year: 'Fourth Year',
      phone: '+91 87654 32109',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
      role: 'club-admin',
      clubs: ['Photography Club', 'Environmental Action Group'],
      joinDate: '2022-08-10',
    },
  },
  'admin@college.edu': {
    password: 'admin123',
    user: {
      id: 'ADMIN001',
      name: 'Admin User',
      email: 'admin@college.edu',
      studentId: 'ADMIN001',
      department: 'Administration',
      year: 'Staff',
      phone: '+91 76543 21098',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      role: 'admin',
      clubs: ['All Clubs'],
      joinDate: '2020-01-01',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored session on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userRecord = mockUsers[email.toLowerCase()];

    if (userRecord && userRecord.password === password) {
      setUser(userRecord.user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userRecord.user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

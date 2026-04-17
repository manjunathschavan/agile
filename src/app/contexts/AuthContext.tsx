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
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'registeredUsers';
const SESSION_KEY = 'currentUser';

function getRegisteredUsers(): Record<string, { password: string; user: User }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveRegisteredUsers(users: Record<string, { password: string; user: User }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(SESSION_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getRegisteredUsers();
    const record = users[email.toLowerCase()];
    if (record && record.password === password) {
      // Always use latest profile data from store
      const latestUser = record.user;
      setUser(latestUser);
      setIsAuthenticated(true);
      localStorage.setItem(SESSION_KEY, JSON.stringify(latestUser));
      return true;
    }
    return false;
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const users = getRegisteredUsers();
    const key = email.toLowerCase();
    if (users[key]) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: `USER-${Date.now()}`,
      name,
      email: key,
      studentId: `S${Date.now().toString().slice(-6)}`,
      department: '',
      year: '',
      phone: '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: 'student',
      clubs: [],
      joinDate: new Date().toISOString().split('T')[0],
    };
    users[key] = { password, user: newUser };
    saveRegisteredUsers(users);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return { success: true, message: 'Account created successfully!' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      // Also update in the registered users store
      const users = getRegisteredUsers();
      const key = updatedUser.email.toLowerCase();
      if (users[key]) {
        users[key].user = updatedUser;
        saveRegisteredUsers(users);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

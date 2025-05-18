
import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "donor" | "ngo" | "beneficiary" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  authenticated: boolean;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const initialUser: User | null = null;

const UserContext = createContext<UserContextType>({
  user: initialUser,
  login: async () => {},
  logout: () => {},
  isLoading: false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, this would connect to Supabase Auth
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock successful authentication
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: email.split('@')[0],
        email,
        role,
        authenticated: true,
        walletAddress: role !== 'beneficiary' ? `0x${Math.random().toString(36).substr(2, 9)}` : undefined,
      };
      
      setUser(mockUser);
      localStorage.setItem('disasterReliefUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('disasterReliefUser');
  };

  // Check for existing user session on load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('disasterReliefUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
        localStorage.removeItem('disasterReliefUser');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

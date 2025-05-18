
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserRole = "donor" | "ngo" | "beneficiary" | null;

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  wallet_address: string | null;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  session: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isLoading: false,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Defer profile fetch to avoid recursive calls
          setTimeout(async () => {
            const userData = await fetchProfile(currentSession.user.id);
            setProfile(userData);
          }, 0);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Existing session check:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const userData = await fetchProfile(currentSession.user.id);
        setProfile(userData);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signup = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      console.log(`Signing up with email: ${email}, role: ${role}`);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Failed to sign up");
        throw error;
      }

      // Check if user was created successfully
      if (data?.user) {
        console.log("Signup success:", data);
        toast.success("Account created successfully! Please check your email for verification.");
      } else {
        console.error("No user data returned from signup");
        toast.error("An unexpected error occurred during signup");
      }
      
    } catch (error: any) {
      console.error("Signup catch error:", error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      console.log(`Logging in with email: ${email}, role: ${role}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Failed to sign in");
        throw error;
      }
      
      // Check if user has correct role
      const userProfile = await fetchProfile(data.user.id);
      
      if (!userProfile) {
        console.error("No profile found for user");
        toast.error("No profile found for this user");
        await supabase.auth.signOut();
        throw new Error("No profile found for this user");
      }
      
      if (userProfile.role !== role) {
        console.error(`Profile role mismatch: expected ${role}, got ${userProfile.role}`);
        await supabase.auth.signOut();
        toast.error(`This account is not registered as a ${role}`);
        throw new Error(`This account is not registered as a ${role}`);
      }

      setProfile(userProfile);
      toast.success(`Logged in successfully as ${role}`);
      
    } catch (error: any) {
      console.error("Login catch error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    } finally {
      setIsLoading(false);
      setUser(null);
      setProfile(null);
      setSession(null);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      profile, 
      session, 
      login, 
      signup, 
      logout, 
      isLoading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

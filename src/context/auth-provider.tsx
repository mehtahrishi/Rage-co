'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Models } from 'appwrite';
import { AuthService } from '@/services/auth';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; address?: string; apartment?: string; city?: string; postalCode?: string }) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* Removed OTP session enforcement to fix logout loop */
  /*
  useEffect(() => {
    if (!loading && user) {
       ...
    }
  }, [user, loading, pathname, router]);
  */

  // Check for missing address and notify user on every page navigation
  useEffect(() => {
    if (!loading && user) {
      const prefs = user.prefs as any || {};
      const hasAddress = prefs.address && prefs.city;

      if (!hasAddress) {
        const showReminder = () => {
          toast({
            title: "Complete your profile",
            description: "Ease your payment flow by adding your address details.",
            duration: 6000,
            action: (
              <ToastAction altText="Update Profile" onClick={() => router.push('/profile')}>
                Update
              </ToastAction>
            ),
          });
        };

        // Show after 3 seconds on every page load/navigation
        const initialTimer = setTimeout(showReminder, 3000);

        return () => {
          clearTimeout(initialTimer);
        };
      }
    }
  }, [user, loading, pathname]);

  const login = async (email: string, password: string) => {
    try {
      await AuthService.login({ email, password });
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      console.log('Starting registration process...');
      await AuthService.register({ email, password, name, phone });
      console.log('Registration successful - user not logged in');

      // Don't set user or create session - user needs to login manually
      // setUser remains null so user stays logged out
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      // Clear OTP verification status
      sessionStorage.removeItem('otp_verified');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (data: { name?: string; address?: string; apartment?: string; city?: string; postalCode?: string }) => {
    try {
      const updatedUser = await AuthService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  // Determine if we should show the children or a loading state
  const isVerified = typeof window !== 'undefined' ? sessionStorage.getItem('otp_verified') === 'true' : false;
  const isAuthPage = pathname?.startsWith('/auth/');
  const isOtpPage = pathname === '/auth/otp';

  // If loading, show a full screen loader
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  /* Removed OTP verifcation render block
  // If user is logged in but not verified
  if (user && !isVerified) {
    ...
  }
  */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';

interface AdminAuthContextType {
  isLoggedIn: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setLoading(false);
    
    // If not logged in and trying to access protected routes, redirect to login
    const protectedRoutes = ['/admin/dashboard', '/admin/orders', '/admin/products', '/admin/customers'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    
    if (isProtectedRoute && !loggedIn) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // If trying to access login page while logged in, redirect to dashboard
  useEffect(() => {
    if (pathname === '/admin/login' && isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [pathname, isLoggedIn, router]);

  const logout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  // If trying to access protected routes while not logged in, don't render children
  const protectedRoutes = ['/admin/dashboard', '/admin/orders', '/admin/products', '/admin/customers'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }
  
  if (isProtectedRoute && !isLoggedIn) {
    return null; // Will be redirected by useEffect
  }

  return (
    <AdminAuthContext.Provider value={{ isLoggedIn, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
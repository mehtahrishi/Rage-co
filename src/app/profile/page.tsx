'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  // Get the first letter of the user's name for the avatar
  const getUserInitial = () => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Helper function to safely get phone number
  const getPhoneNumber = (): string | null => {
    if (user?.prefs && typeof user.prefs === 'object' && user.prefs !== null && 'phone' in user.prefs) {
      const phone = user.prefs.phone;
      return phone ? String(phone) : null;
    }
    return null;
  };

  // Determine avatar background and text color based on theme
  const getAvatarColors = () => {
    return theme === 'dark'
      ? { background: 'bg-gray-800', text: 'text-white' }
      : { background: 'bg-gray-200', text: 'text-gray-800' };
  };

  const avatarColors = getAvatarColors();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(name.trim());
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold uppercase tracking-wider md:text-5xl">
          My Profile
        </h1>
        <p className="mt-2 text-muted-foreground">Your personal account information</p>
      </header>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className={`${avatarColors.background} ${avatarColors.text} text-2xl font-bold`}>
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>

              <div className="text-center space-y-4 w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="text-center text-2xl font-bold"
                    />
                    <div className="flex justify-center gap-2">
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                    <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    {getPhoneNumber() && (
                      <p className="text-muted-foreground">{getPhoneNumber()}</p>
                    )}
                    <Badge variant="secondary">Verified Account</Badge>
                    <div className="pt-4">
                      <Button onClick={handleEdit} variant="outline">
                        Edit Name
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold mb-2">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  {getPhoneNumber() && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{getPhoneNumber()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Status:</span>
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Phone number cannot be changed after registration for security purposes.
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4 text-center">
                <h3 className="font-semibold mb-2">Privacy Notice</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is kept private and secure. We never share your personal information
                  with third parties without your consent. All data is encrypted and stored
                  securely in compliance with privacy regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { toast } from '@/hooks/use-toast';
import { MapPin, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, updateProfile } = useAuth();
  const { theme } = useTheme();

  // State for profile fields
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // State for address fields
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Initialize state when user is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '');

      const prefs = user.prefs as any || {};
      setAddress(prefs.address || '');
      setApartment(prefs.apartment || '');
      setCity(prefs.city || '');
      setPostalCode(prefs.postalCode || '');
    }
  }, [user, loading]);

  // Get the first letter of the user's name for the avatar
  const getUserInitial = () => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  // Helper function to safely get phone number
  const getPhoneNumber = (): string | null => {
    if (user?.prefs && typeof user.prefs === 'object' && user.prefs !== null && 'phone' in user.prefs) {
      const phone = (user.prefs as any).phone;
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

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use OpenStreetMap Nominatim API for free reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) throw new Error('Failed to fetch address');

          const data = await response.json();
          const addressObj = data.address;

          // Auto-fill available fields
          if (addressObj) {
            if (addressObj.city || addressObj.town || addressObj.village) {
              setCity(addressObj.city || addressObj.town || addressObj.village);
            }
            if (addressObj.postcode) {
              setPostalCode(addressObj.postcode);
            }

            // Construct a basic address line if possible
            // We avoid overwriting specific street view if user typed something, 
            // but for "Detect" usually they want full overwrite or first fill.
            // Let's being helpful but conservative.

            toast({
              title: "Location Detected",
              description: "City and Postal Code updated based on your location.",
            });
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          toast({
            title: "Error",
            description: "Failed to detect specific location details.",
            variant: "destructive",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = "Unable to retrieve your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied";
        }
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        setIsLocating(false);
      }
    );
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
      await updateProfile({
        name: name.trim(),
        address: address.trim(),
        apartment: apartment.trim(),
        city: city.trim(),
        postalCode: postalCode.trim()
      });

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
    // Reset to user values
    if (user) {
      setName(user.name || '');
      const prefs = user.prefs as any || {};
      setAddress(prefs.address || '');
      setApartment(prefs.apartment || '');
      setCity(prefs.city || '');
      setPostalCode(prefs.postalCode || '');
    }
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
              Manage your personal details and shipping address
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
                  <div className="space-y-6 text-left">
                    <div>
                      <Label htmlFor="name" className="mb-2 block">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Shipping Address</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleDetectLocation}
                          disabled={isLocating}
                          className="flex items-center gap-2"
                        >
                          {isLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                          {isLocating ? 'Locating...' : 'Detect Location'}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street Address, P.O. Box, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                        <Input
                          id="apartment"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="Apt, Suite, Unit, etc."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="Postal/Zip Code"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-2 pt-4">
                      <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
                      <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
                      <Badge variant="secondary" className="mt-2">Verified Account</Badge>
                    </div>

                    <div className="rounded-lg bg-muted p-4 text-left space-y-3">
                      <h3 className="font-semibold border-b pb-2">Contact Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{getPhoneNumber() || 'Not set'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4 text-left space-y-3">
                      <h3 className="font-semibold border-b pb-2">Shipping Address</h3>
                      <div className="text-sm space-y-1">
                        {address || city ? (
                          <>
                            <p>{address}</p>
                            {apartment && <p>{apartment}</p>}
                            <p>{city}{postalCode ? `, ${postalCode}` : ''}</p>
                          </>
                        ) : (
                          <p className="text-muted-foreground italic">No address saved yet</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button onClick={handleEdit} variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <h3 className="font-semibold mb-2">Privacy Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is kept private and secure. We never share your personal information
                    with third parties without your consent. All data is encrypted and stored
                    securely in compliance with privacy regulations.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
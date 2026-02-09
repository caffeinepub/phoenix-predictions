import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Sparkles, AlertCircle } from 'lucide-react';
import { useBootstrapAdmin, useIsAdminBootstrapAvailable } from '@/hooks/useQueries';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSaveUserProfile } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { SubscriptionType } from '@/backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

const REQUIRED_ADMIN_EMAIL = 'thephoenixcreativeshub@gmail.com';

export default function AdminBootstrapScreen() {
  const { userProfile, isLoading: profileLoading } = useCurrentUser();
  const { data: isBootstrapAvailable } = useIsAdminBootstrapAvailable();
  const bootstrapAdmin = useBootstrapAdmin();
  const saveProfile = useSaveUserProfile();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Check if profile matches required admin credentials (case-insensitive)
  const hasValidProfile = userProfile && 
    userProfile.email.toLowerCase() === REQUIRED_ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (!profileLoading && userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      
      // If profile doesn't match, show form
      if (!hasValidProfile) {
        setShowProfileForm(true);
      }
    } else if (!profileLoading && !userProfile) {
      // No profile exists, show form with suggested values
      setName('phoenix');
      setEmail(REQUIRED_ADMIN_EMAIL);
      setShowProfileForm(true);
    }
  }, [userProfile, profileLoading, hasValidProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        subscription_type: userProfile?.subscription_type || SubscriptionType.free,
        join_date: userProfile?.join_date || BigInt(Date.now() * 1_000_000),
      });
      
      toast.success('Profile updated successfully!');
      setShowProfileForm(false);
    } catch (error: any) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleBootstrap = async () => {
    // Check if bootstrap is still available before attempting
    if (isBootstrapAvailable === false) {
      toast.error('Admin has already been bootstrapped. Please contact an existing admin.');
      return;
    }

    try {
      await bootstrapAdmin.mutateAsync();
      toast.success('Admin access granted successfully! The Admin Panel is now available.', {
        duration: 5000,
      });
      // The mutation's onSuccess will handle cache updates and refetches
      // UI will automatically update to show admin panel
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      
      if (errorMessage.includes('Admin already bootstrapped')) {
        toast.error('Admin has already been bootstrapped. Please contact an existing admin.');
      } else if (errorMessage.includes('Email does not match')) {
        toast.error(`Your email does not match the required admin pattern. Please ensure your profile email is set to ${REQUIRED_ADMIN_EMAIL}`);
        setShowProfileForm(true);
      } else if (errorMessage.includes('No profile found')) {
        toast.error('Please create your profile first.');
        setShowProfileForm(true);
      } else {
        toast.error(`Failed to bootstrap admin: ${errorMessage}`);
      }
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md phoenix-card-gold">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl text-primary">First Admin Setup</CardTitle>
          <CardDescription className="text-base">
            No administrators exist yet. Complete the setup below to become the initial admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasValidProfile && (
            <Alert className="border-primary/30 bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                Admin access requires your profile email to be set to <strong>{REQUIRED_ADMIN_EMAIL}</strong>
              </AlertDescription>
            </Alert>
          )}

          {showProfileForm ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={saveProfile.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {saveProfile.isPending ? 'Saving Profile...' : userProfile ? 'Update Profile' : 'Create Profile'}
              </Button>
              {hasValidProfile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProfileForm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </form>
          ) : (
            <>
              <div className="rounded-lg bg-primary/10 border-2 border-primary/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Sparkles className="h-4 w-4" />
                  Admin Privileges Include:
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>Add matches and analysis</li>
                  <li>Create VIP tickets</li>
                  <li>Update results and track accuracy</li>
                  <li>Promote other users to admin</li>
                </ul>
              </div>

              {hasValidProfile ? (
                <Button
                  onClick={handleBootstrap}
                  disabled={bootstrapAdmin.isPending || isBootstrapAvailable === false}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {bootstrapAdmin.isPending ? 'Granting Admin Access...' : 'Become Admin'}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowProfileForm(true)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Update Profile to Continue
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

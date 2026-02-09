import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Crown } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import RequireAuth from '@/components/auth/RequireAuth';
import { getSubscriptionLabel } from '@/lib/subscription';

export default function ProfilePage() {
  const { userProfile } = useCurrentUser();

  if (!userProfile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="aviator-card max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const joinDate = new Date(Number(userProfile.join_date) / 1_000_000);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="aviator-card-lime p-8 text-center">
          <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
            <User className="h-10 w-10" />
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">Manage your account settings</p>
        </div>

        <Card className="aviator-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Account Information</CardTitle>
            <CardDescription className="text-base">Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userProfile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{joinDate.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="aviator-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              Subscription
            </CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-primary">
                {getSubscriptionLabel(userProfile.subscription_type)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}

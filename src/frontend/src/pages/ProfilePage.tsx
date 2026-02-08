import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Crown } from 'lucide-react';
import RequireAuth from '@/components/auth/RequireAuth';
import UpgradeDialog from '@/components/payments/UpgradeDialog';
import { getSubscriptionLabel } from '@/lib/subscription';

export default function ProfilePage() {
  const { userProfile } = useCurrentUser();

  if (!userProfile) {
    return (
      <RequireAuth>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </RequireAuth>
    );
  }

  const subscriptionLabel = getSubscriptionLabel(userProfile.subscription_type);
  const joinDate = new Date(Number(userProfile.join_date) / 1_000_000);

  return (
    <RequireAuth>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="phoenix-card-gold p-8 text-center">
          <h1 className="font-heading text-4xl font-bold text-primary gold-text-glow">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account and subscription</p>
        </div>

        {/* Profile Info */}
        <Card className="phoenix-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Account Information</CardTitle>
            <CardDescription className="text-base">Your personal details and membership status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <User className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-lg text-foreground">{userProfile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-lg text-foreground">{userProfile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium text-lg text-foreground">{joinDate.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="phoenix-card-gold">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-heading text-2xl flex items-center gap-2 text-primary">
                  <Crown className="h-6 w-6" />
                  Subscription
                </CardTitle>
                <CardDescription className="text-base mt-1">Your current membership tier</CardDescription>
              </div>
              <Badge
                className={
                  userProfile.subscription_type === 'free'
                    ? 'border-muted-foreground text-muted-foreground text-base px-4 py-1'
                    : 'border-primary text-primary bg-primary/20 text-base px-4 py-1'
                }
              >
                {subscriptionLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {userProfile.subscription_type === 'free'
                  ? 'Upgrade to VIP to unlock exclusive predictions, odds, and tickets.'
                  : userProfile.subscription_type === 'basic'
                  ? 'You have access to Safe Builder and Value Accumulator. Upgrade to Premium for Odds Train.'
                  : 'You have full access to all VIP features including Odds Train.'}
              </p>
            </div>
            {userProfile.subscription_type !== 'premium' && (
              <div className="pt-2">
                <UpgradeDialog />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}

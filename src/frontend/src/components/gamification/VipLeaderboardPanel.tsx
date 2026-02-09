import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal } from 'lucide-react';

export default function VipLeaderboardPanel() {
  // Note: Backend doesn't expose leaderboard data yet, showing placeholder
  return (
    <Card className="phoenix-card-gold">
      <CardHeader>
        <CardTitle className="font-heading text-xl flex items-center gap-2 text-primary">
          <Trophy className="h-5 w-5" />
          VIP Leaderboard
        </CardTitle>
        <CardDescription>Top performing VIP members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Medal className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
          <p className="text-sm text-muted-foreground">
            Leaderboard coming soon! Compete with other VIP members for the top spot.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

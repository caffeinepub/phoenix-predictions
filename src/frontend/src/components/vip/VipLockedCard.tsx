import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function VipLockedCard() {
  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-heading flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          VIP Content
        </CardTitle>
        <CardDescription>
          Upgrade to a VIP subscription to unlock exclusive predictions, odds, and tickets.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Link to="/profile">
          <Button className="gap-2">
            <Crown className="h-4 w-4" />
            Upgrade to VIP
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

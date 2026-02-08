import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface OddsTrainProgressProps {
  totalLegs: number;
  completedLegs: number;
}

export default function OddsTrainProgress({ totalLegs, completedLegs }: OddsTrainProgressProps) {
  const progress = totalLegs > 0 ? (completedLegs / totalLegs) * 100 : 0;
  const remaining = totalLegs - completedLegs;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Odds Train Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-3" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Completed: <span className="font-semibold text-foreground">{completedLegs}</span>
          </span>
          <span className="text-muted-foreground">
            Remaining: <span className="font-semibold text-foreground">{remaining}</span>
          </span>
          <span className="text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{totalLegs}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

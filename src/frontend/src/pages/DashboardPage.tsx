import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetRecentGames } from '@/hooks/useAviatorQueries';
import KpiCard from '@/components/aviator/KpiCard';
import MultiplierSparkline from '@/components/aviator/MultiplierSparkline';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { data: recentGames = [], isLoading } = useGetRecentGames();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const multipliers = recentGames.map(g => g.multiplier);
  const avgMultiplier = multipliers.length > 0 
    ? (multipliers.reduce((a, b) => a + b, 0) / multipliers.length).toFixed(2)
    : '0.00';
  
  const maxMultiplier = multipliers.length > 0 
    ? Math.max(...multipliers).toFixed(2)
    : '0.00';
  
  const minMultiplier = multipliers.length > 0 
    ? Math.min(...multipliers).toFixed(2)
    : '0.00';

  const recent10 = multipliers.slice(-10);
  const previous10 = multipliers.slice(-20, -10);
  const avgRecent = recent10.length > 0 ? recent10.reduce((a, b) => a + b, 0) / recent10.length : 0;
  const avgPrevious = previous10.length > 0 ? previous10.reduce((a, b) => a + b, 0) / previous10.length : 0;
  const trend = avgRecent > avgPrevious ? 'up' : 'down';
  const trendPercent = avgPrevious > 0 ? (((avgRecent - avgPrevious) / avgPrevious) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div className="aviator-card-lime p-8 text-center">
        <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
          <Zap className="h-10 w-10" />
          Aviator Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Real-time game simulation and pattern analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Average Multiplier"
          value={`${avgMultiplier}x`}
          icon={Activity}
          trend={trend}
          trendValue={`${trendPercent}%`}
        />
        <KpiCard
          label="Max Multiplier"
          value={`${maxMultiplier}x`}
          icon={TrendingUp}
        />
        <KpiCard
          label="Min Multiplier"
          value={`${minMultiplier}x`}
          icon={TrendingDown}
        />
        <KpiCard
          label="Total Games"
          value={recentGames.length.toString()}
          icon={Zap}
        />
      </div>

      <Card className="aviator-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Recent Multipliers</CardTitle>
          <CardDescription>Last {Math.min(50, recentGames.length)} games</CardDescription>
        </CardHeader>
        <CardContent>
          {multipliers.length > 0 ? (
            <MultiplierSparkline data={multipliers.slice(-50)} />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No game data available yet. Visit the Simulator to generate games.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

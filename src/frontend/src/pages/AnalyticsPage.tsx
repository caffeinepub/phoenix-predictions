import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetRecentGames, useGetPatterns } from '@/hooks/useAviatorQueries';
import DistributionBuckets from '@/components/aviator/DistributionBuckets';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  const { data: recentGames = [], isLoading: gamesLoading } = useGetRecentGames();
  const { data: patterns = [], isLoading: patternsLoading } = useGetPatterns();

  const isLoading = gamesLoading || patternsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const multipliers = recentGames.map(g => g.multiplier);
  
  if (multipliers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="aviator-card-lime p-8 text-center">
          <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
            <BarChart3 className="h-10 w-10" />
            Pattern Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Statistical analysis and pattern detection</p>
        </div>
        <Card className="aviator-card">
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">
              No data available for analysis. Generate games in the Simulator first.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mean = (multipliers.reduce((a, b) => a + b, 0) / multipliers.length).toFixed(2);
  const sorted = [...multipliers].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2).toFixed(2)
    : sorted[Math.floor(sorted.length / 2)].toFixed(2);
  const min = Math.min(...multipliers).toFixed(2);
  const max = Math.max(...multipliers).toFixed(2);

  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index].toFixed(2);
  const q3 = sorted[q3Index].toFixed(2);

  const distribution = {
    under_1x: multipliers.filter(m => m < 1.0).length,
    x_1_to_2: multipliers.filter(m => m >= 1.0 && m < 2.0).length,
    x_2_to_5: multipliers.filter(m => m >= 2.0 && m < 5.0).length,
    x_5_to_10: multipliers.filter(m => m >= 5.0 && m < 10.0).length,
    x_10_plus: multipliers.filter(m => m >= 10.0).length,
  };

  return (
    <div className="space-y-6">
      <div className="aviator-card-lime p-8 text-center">
        <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
          <BarChart3 className="h-10 w-10" />
          Pattern Analytics
        </h1>
        <p className="text-muted-foreground mt-2">Statistical analysis and pattern detection</p>
      </div>

      <Card className="aviator-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Statistical Summary
          </CardTitle>
          <CardDescription>Analyzing {multipliers.length} games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Mean</p>
              <p className="text-2xl font-bold text-primary">{mean}x</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Median</p>
              <p className="text-2xl font-bold text-primary">{median}x</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Min / Max</p>
              <p className="text-2xl font-bold text-primary">{min}x / {max}x</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Q1 (25th percentile)</p>
              <p className="text-2xl font-bold text-primary">{q1}x</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Q3 (75th percentile)</p>
              <p className="text-2xl font-bold text-primary">{q3}x</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Sample Size</p>
              <p className="text-2xl font-bold text-primary">{multipliers.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="aviator-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Distribution Analysis</CardTitle>
          <CardDescription>Multiplier range distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <DistributionBuckets distribution={distribution} />
        </CardContent>
      </Card>

      <Card className="aviator-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Pattern Detection</CardTitle>
          <CardDescription>Common patterns in game sequences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patterns.map((pattern, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{pattern.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    pattern.detected 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {pattern.detected ? 'Detected' : 'Not Detected'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                <p className="text-xs font-mono text-primary/80">Example: {pattern.pattern}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

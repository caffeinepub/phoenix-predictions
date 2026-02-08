import { useGetAllMatches } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@tanstack/react-router';
import { Calendar, Crown, TrendingUp, Flame } from 'lucide-react';
import ConfidenceBadge from '@/components/matches/ConfidenceBadge';

export default function HomePage() {
  const { data: matches = [], isLoading } = useGetAllMatches();

  // Filter today's matches
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayMatches = matches.filter(([_, match]) => {
    const matchDate = new Date(Number(match.kickoff_date) / 1_000_000);
    return matchDate >= today && matchDate < tomorrow;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Flame className="h-16 w-16 text-primary mx-auto animate-pulse-gold" />
          <h2 className="font-heading text-2xl font-bold text-primary">Loading Phoenix Predictions...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="phoenix-card-gold p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-primary gold-text-glow">
              Phoenix Predictions
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional football predictions powered by expert analysis
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/vip">
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-gold-glow">
                <Crown className="h-5 w-5" />
                VIP
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10">
                <TrendingUp className="h-5 w-5" />
                Results
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Matches Dashboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            Today's Matches
          </h2>
          <Badge variant="outline" className="text-base px-4 py-1 border-primary/50 text-primary">
            {todayMatches.length} {todayMatches.length === 1 ? 'Match' : 'Matches'}
          </Badge>
        </div>

        {todayMatches.length === 0 ? (
          <Card className="phoenix-card">
            <CardContent className="py-16 text-center">
              <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">No matches scheduled for today.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for new predictions!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayMatches.map(([matchId, match, analysis]) => (
              <Card 
                key={String(matchId)} 
                className="phoenix-card hover:border-primary/60 hover:shadow-gold-glow transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="font-heading text-lg leading-tight">{match.teams}</CardTitle>
                      <CardDescription className="mt-2 text-xs">{match.league}</CardDescription>
                    </div>
                    {analysis ? (
                      <ConfidenceBadge level={analysis.confidence_level} />
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-xs">
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="gold-accent-line pt-3">
                    <div className="text-sm text-muted-foreground mt-2">
                      {new Date(Number(match.kickoff_date) / 1_000_000).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <Link to="/match/$matchId" params={{ matchId: String(matchId) }}>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/40 text-primary hover:bg-primary/10"
                    >
                      View Analysis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

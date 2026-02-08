import { useParams, Link } from '@tanstack/react-router';
import { useGetAllMatches, useGetAllTickets } from '@/hooks/useQueries';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';
import ConfidenceBadge from '@/components/matches/ConfidenceBadge';
import VipLockedCard from '@/components/vip/VipLockedCard';
import { hasVipAccess } from '@/lib/subscription';
import { Button } from '@/components/ui/button';

export default function MatchAnalysisPage() {
  const { matchId } = useParams({ from: '/match/$matchId' });
  const { data: matches = [] } = useGetAllMatches();
  const { data: tickets = [] } = useGetAllTickets();
  const { userProfile } = useCurrentUser();

  const matchData = matches.find(([id]) => String(id) === matchId);

  if (!matchData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="phoenix-card max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Match not found</p>
            <Link to="/">
              <Button variant="outline" className="mt-4 border-primary/40 text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [id, match, analysis] = matchData;
  const hasVip = userProfile ? hasVipAccess(userProfile.subscription_type) : false;

  // Find tickets that include this match
  const relatedTickets = tickets.filter(([_, ticket]) =>
    ticket.selections.some((selId) => String(selId) === matchId)
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/">
        <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10">
          <ArrowLeft className="h-4 w-4" />
          Back to Matches
        </Button>
      </Link>

      {/* Match Header */}
      <Card className="phoenix-card-gold">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="font-heading text-3xl">{match.teams}</CardTitle>
              <CardDescription className="text-base mt-2">{match.league}</CardDescription>
            </div>
            {analysis && <ConfidenceBadge level={analysis.confidence_level} />}
          </div>
          <div className="text-sm text-muted-foreground mt-4">
            {new Date(Number(match.kickoff_date) / 1_000_000).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </CardHeader>
      </Card>

      {!analysis ? (
        <Card className="phoenix-card">
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Analysis not available yet for this match.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Form Analysis */}
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Form Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.form.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No form data available.</p>
                ) : (
                  analysis.form.map((item, idx) => (
                    <p key={idx} className="text-sm text-foreground">
                      {item}
                    </p>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Head to Head */}
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Head to Head
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.head_to_head.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No head-to-head data available.</p>
                ) : (
                  analysis.head_to_head.map((item, idx) => (
                    <p key={idx} className="text-sm text-foreground">
                      {item}
                    </p>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tactical Insight */}
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Tactical Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{analysis.tactical_insight}</p>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* VIP Section */}
          {!hasVip ? (
            <VipLockedCard />
          ) : (
            <Card className="phoenix-card-gold">
              <CardHeader>
                <CardTitle className="font-heading text-xl flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  VIP Tickets & Odds
                </CardTitle>
                <CardDescription className="text-base">
                  This match is included in the following VIP tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {relatedTickets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">This match is not part of any current VIP tickets.</p>
                ) : (
                  <div className="space-y-3">
                    {relatedTickets.map(([ticketId, ticket]) => (
                      <div
                        key={String(ticketId)}
                        className="flex items-center justify-between rounded-lg border-2 border-primary/30 p-4"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            Ticket #{String(ticketId)} - {ticket.ticket_type.toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {ticket.selections.length} selections
                          </p>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary text-base px-3 py-1">
                          {ticket.odds.toFixed(2)}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

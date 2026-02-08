import { useGetAllTickets, useGetAllResultsWithTickets } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Award, XCircle, Zap } from 'lucide-react';
import RequireAuth from '@/components/auth/RequireAuth';
import { TicketStatus } from '@/backend';

export default function ResultsPage() {
  const { data: tickets = [] } = useGetAllTickets();
  const { data: resultsWithTickets = [] } = useGetAllResultsWithTickets();

  // Build a map of ticket ID to result status from backend results
  const resultMap = new Map<string, TicketStatus>();
  resultsWithTickets.forEach(([ticketId, status]) => {
    resultMap.set(String(ticketId), status);
  });

  // Merge tickets with their backend results
  const ticketsWithResults = tickets.map(([ticketId, ticket]) => {
    const backendStatus = resultMap.get(String(ticketId));
    return {
      id: ticketId,
      ticket,
      status: backendStatus || ticket.status, // Prefer backend result over ticket status
    };
  });

  // Calculate metrics from backend results (using the tuple structure)
  const completedResults = resultsWithTickets.filter(
    ([_, status]) => status !== TicketStatus.pending
  );
  const wins = resultsWithTickets.filter(([_, status]) => status === TicketStatus.win).length;
  const losses = resultsWithTickets.filter(([_, status]) => status === TicketStatus.loss).length;
  const totalCompleted = completedResults.length;
  const winRate = totalCompleted > 0 ? ((wins / totalCompleted) * 100).toFixed(1) : '0.0';

  // Calculate streak
  let currentStreak = 0;
  let streakType: 'W' | 'L' | null = null;
  for (let i = ticketsWithResults.length - 1; i >= 0; i--) {
    const status = ticketsWithResults[i].status;
    if (status === TicketStatus.pending) continue;
    if (streakType === null) {
      streakType = status === TicketStatus.win ? 'W' : 'L';
      currentStreak = 1;
    } else if (
      (streakType === 'W' && status === TicketStatus.win) ||
      (streakType === 'L' && status === TicketStatus.loss)
    ) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="phoenix-card-gold p-8 text-center">
          <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary gold-text-glow">
            <TrendingUp className="h-10 w-10" />
            Results Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Track your prediction performance and statistics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="phoenix-card-gold">
            <CardHeader className="pb-3">
              <CardDescription className="text-muted-foreground">Win Rate</CardDescription>
              <CardTitle className="font-heading text-5xl text-primary gold-text-glow">{winRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {wins} wins out of {totalCompleted} completed
              </p>
            </CardContent>
          </Card>

          <Card className="phoenix-card">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-confidence-high">
                <Award className="h-5 w-5" />
                Wins
              </CardDescription>
              <CardTitle className="font-heading text-5xl text-confidence-high">{wins}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Successful predictions</p>
            </CardContent>
          </Card>

          <Card className="phoenix-card">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-confidence-low">
                <XCircle className="h-5 w-5" />
                Losses
              </CardDescription>
              <CardTitle className="font-heading text-5xl text-confidence-low">{losses}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Unsuccessful predictions</p>
            </CardContent>
          </Card>

          <Card className="phoenix-card">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                Current Streak
              </CardDescription>
              <CardTitle className="font-heading text-5xl text-primary">
                {currentStreak}
                {streakType && <span className="text-3xl ml-1">{streakType}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {streakType === 'W' ? 'Winning' : streakType === 'L' ? 'Losing' : 'No'} streak
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Last 30 Days */}
        <Card className="phoenix-card-gold">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-primary">Last 30 Days Performance</CardTitle>
            <CardDescription className="text-base">Recent prediction results and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Predictions</p>
                <p className="font-heading text-4xl font-bold text-foreground">{ticketsWithResults.length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Wins</p>
                <p className="font-heading text-4xl font-bold text-confidence-high">{wins}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Losses</p>
                <p className="font-heading text-4xl font-bold text-confidence-low">{losses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="phoenix-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Recent Results</CardTitle>
            <CardDescription className="text-base">Latest completed predictions</CardDescription>
          </CardHeader>
          <CardContent>
            {ticketsWithResults.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground text-lg">No results available yet.</p>
            ) : (
              <div className="space-y-3">
                {ticketsWithResults.slice(0, 10).map(({ id, ticket, status }) => (
                  <div
                    key={String(id)}
                    className="flex items-center justify-between rounded-lg border-2 border-border p-4 hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        Ticket #{String(id)} - {ticket.ticket_type.toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.selections.length} selections • {ticket.odds.toFixed(2)}x odds
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-5 py-2 text-sm font-bold border-2 ${
                        status === TicketStatus.win
                          ? 'bg-confidence-high/20 text-confidence-high border-confidence-high'
                          : status === TicketStatus.loss
                          ? 'bg-confidence-low/20 text-confidence-low border-confidence-low'
                          : 'bg-muted/20 text-muted-foreground border-muted-foreground'
                      }`}
                    >
                      {status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}

import { useGetAllTickets, useGetAllMatches } from '@/hooks/useQueries';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, TrendingUp, Train } from 'lucide-react';
import RequireAuth from '@/components/auth/RequireAuth';
import VipLockedCard from '@/components/vip/VipLockedCard';
import OddsTrainProgress from '@/components/vip/OddsTrainProgress';
import { hasVipAccess } from '@/lib/subscription';
import { TicketType } from '@/backend';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function VipPage() {
  const { data: tickets = [] } = useGetAllTickets();
  const { data: matches = [] } = useGetAllMatches();
  const { userProfile } = useCurrentUser();

  const hasVip = userProfile ? hasVipAccess(userProfile.subscription_type) : false;

  const safeTickets = tickets.filter(([_, t]) => t.ticket_type === TicketType.safe);
  const valueTickets = tickets.filter(([_, t]) => t.ticket_type === TicketType.value);
  const trainTickets = tickets.filter(([_, t]) => t.ticket_type === TicketType.train);

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="phoenix-card-gold p-8 text-center">
          <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary gold-text-glow">
            <Crown className="h-10 w-10" />
            VIP Predictions
          </h1>
          <p className="text-muted-foreground mt-2">
            Exclusive predictions and odds for VIP members
          </p>
        </div>

        {!hasVip ? (
          <VipLockedCard />
        ) : (
          <Tabs defaultValue="safe" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card border-2 border-primary/30 p-1">
              <TabsTrigger 
                value="safe" 
                className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/50"
              >
                <Shield className="h-4 w-4" />
                Safe Builder
              </TabsTrigger>
              <TabsTrigger 
                value="value" 
                className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/50"
              >
                <TrendingUp className="h-4 w-4" />
                Value Accumulator
              </TabsTrigger>
              <TabsTrigger 
                value="train" 
                className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/50"
              >
                <Train className="h-4 w-4" />
                Odds Train
              </TabsTrigger>
            </TabsList>

            <TabsContent value="safe" className="space-y-4">
              <Card className="phoenix-card-gold">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-primary flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Safe Builder
                  </CardTitle>
                  <CardDescription className="text-base">
                    3.00 odds • Conservative selections with higher probability of success
                  </CardDescription>
                </CardHeader>
              </Card>

              {safeTickets.length === 0 ? (
                <Card className="phoenix-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No Safe Builder tickets available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {safeTickets.map(([ticketId, ticket]) => (
                    <Card key={String(ticketId)} className="phoenix-card hover:border-primary/60 transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-heading text-lg">Ticket #{String(ticketId)}</CardTitle>
                          <Badge className="bg-primary/20 text-primary border-primary text-lg px-3 py-1">
                            {ticket.odds.toFixed(2)}x
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Selections:</span>
                          <span className="font-semibold text-foreground">{ticket.selections.length}</span>
                        </div>
                        <Badge
                          variant={
                            ticket.status === 'win'
                              ? 'default'
                              : ticket.status === 'loss'
                              ? 'destructive'
                              : 'outline'
                          }
                          className="w-full justify-center py-2"
                        >
                          {ticket.status.toUpperCase()}
                        </Badge>
                        <Link to="/tickets">
                          <Button variant="outline" size="sm" className="w-full border-primary/40 text-primary hover:bg-primary/10">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="value" className="space-y-4">
              <Card className="phoenix-card-gold">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-primary flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Value Accumulator
                  </CardTitle>
                  <CardDescription className="text-base">
                    5.00 odds • Balanced risk-reward selections for better returns
                  </CardDescription>
                </CardHeader>
              </Card>

              {valueTickets.length === 0 ? (
                <Card className="phoenix-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No Value Accumulator tickets available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {valueTickets.map(([ticketId, ticket]) => (
                    <Card key={String(ticketId)} className="phoenix-card hover:border-primary/60 transition-all">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-heading text-lg">Ticket #{String(ticketId)}</CardTitle>
                          <Badge className="bg-primary/20 text-primary border-primary text-lg px-3 py-1">
                            {ticket.odds.toFixed(2)}x
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Selections:</span>
                          <span className="font-semibold text-foreground">{ticket.selections.length}</span>
                        </div>
                        <Badge
                          variant={
                            ticket.status === 'win'
                              ? 'default'
                              : ticket.status === 'loss'
                              ? 'destructive'
                              : 'outline'
                          }
                          className="w-full justify-center py-2"
                        >
                          {ticket.status.toUpperCase()}
                        </Badge>
                        <Link to="/tickets">
                          <Button variant="outline" size="sm" className="w-full border-primary/40 text-primary hover:bg-primary/10">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="train" className="space-y-4">
              <Card className="phoenix-card-gold">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-primary flex items-center gap-2">
                    <Train className="h-6 w-6" />
                    Odds Train
                  </CardTitle>
                  <CardDescription className="text-base">
                    100+ odds • Multi-day accumulator for maximum returns (20-25 matches)
                  </CardDescription>
                </CardHeader>
              </Card>

              {trainTickets.length === 0 ? (
                <Card className="phoenix-card">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No Odds Train tickets available yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {trainTickets.map(([ticketId, ticket]) => (
                    <div key={String(ticketId)} className="space-y-4">
                      <Card className="phoenix-card hover:border-primary/60 transition-all">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="font-heading text-lg">Train #{String(ticketId)}</CardTitle>
                            <Badge className="bg-primary/20 text-primary border-primary text-lg px-3 py-1">
                              {ticket.odds.toFixed(2)}x
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Legs:</span>
                            <span className="font-semibold text-foreground">{ticket.selections.length}</span>
                          </div>
                          <Badge
                            variant={
                              ticket.status === 'win'
                                ? 'default'
                                : ticket.status === 'loss'
                                ? 'destructive'
                                : 'outline'
                            }
                            className="w-full justify-center py-2"
                          >
                            {ticket.status.toUpperCase()}
                          </Badge>
                        </CardContent>
                      </Card>
                      <OddsTrainProgress
                        totalLegs={ticket.selections.length}
                        completedLegs={ticket.status === 'win' ? ticket.selections.length : 0}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </RequireAuth>
  );
}

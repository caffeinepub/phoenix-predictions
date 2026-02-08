import { useGetAllTickets, useGetAllMatches } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Ticket } from 'lucide-react';
import RequireAuth from '@/components/auth/RequireAuth';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function TicketsPage() {
  const { data: tickets = [] } = useGetAllTickets();
  const { data: matches = [] } = useGetAllMatches();

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="phoenix-card-gold p-8 text-center">
          <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary gold-text-glow">
            <Ticket className="h-10 w-10" />
            VIP Tickets
          </h1>
          <p className="text-muted-foreground mt-2">All your exclusive VIP predictions in one place</p>
        </div>

        <Card className="phoenix-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">All Tickets</CardTitle>
            <CardDescription className="text-base">View and track all your VIP tickets</CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">No tickets available yet.</p>
                <Link to="/vip">
                  <Button variant="outline" className="mt-4 border-primary/40 text-primary">
                    Explore VIP Predictions
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary">
                    <TableRow className="border-b-2 border-border hover:bg-secondary">
                      <TableHead className="font-heading text-foreground">ID</TableHead>
                      <TableHead className="font-heading text-foreground">Type</TableHead>
                      <TableHead className="font-heading text-foreground">Odds</TableHead>
                      <TableHead className="font-heading text-foreground">Selections</TableHead>
                      <TableHead className="font-heading text-foreground">Status</TableHead>
                      <TableHead className="font-heading text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map(([ticketId, ticket]) => (
                      <TableRow key={String(ticketId)} className="border-b border-border hover:bg-secondary/50">
                        <TableCell className="font-medium">#{String(ticketId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary/40 text-primary">
                            {ticket.ticket_type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-primary">{ticket.odds.toFixed(2)}x</TableCell>
                        <TableCell>{ticket.selections.length}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.status === 'win'
                                ? 'default'
                                : ticket.status === 'loss'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {ticket.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {ticket.selections.slice(0, 1).map((selId) => (
                              <Link key={String(selId)} to="/match/$matchId" params={{ matchId: String(selId) }}>
                                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                  View Match
                                </Button>
                              </Link>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}

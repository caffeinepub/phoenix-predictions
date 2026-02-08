import { useState } from 'react';
import {
  useAddMatch,
  useAddAnalysis,
  useCreateTicket,
  useGetAllMatches,
  useGetAllTickets,
  usePromoteToAdmin,
  useUpdateTicketResult,
  useCalculateAccuracy,
  useGetAllResultsWithTickets,
} from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Plus, BarChart3, UserPlus, CheckCircle } from 'lucide-react';
import AdminRoute from '@/components/admin/AdminRoute';
import { ConfidenceLevel, TicketType, TicketStatus } from '@/backend';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function AdminPanelPage() {
  return (
    <AdminRoute>
      <Toaster />
      <AdminPanelContent />
    </AdminRoute>
  );
}

function AdminPanelContent() {
  const { data: matches = [] } = useGetAllMatches();
  const { data: tickets = [] } = useGetAllTickets();
  const { data: resultsWithTickets = [] } = useGetAllResultsWithTickets();
  const { data: accuracy = 0 } = useCalculateAccuracy();
  const addMatch = useAddMatch();
  const addAnalysis = useAddAnalysis();
  const createTicket = useCreateTicket();
  const promoteToAdmin = usePromoteToAdmin();
  const updateTicketResult = useUpdateTicketResult();

  // Match form
  const [league, setLeague] = useState('');
  const [teams, setTeams] = useState('');
  const [kickoffDate, setKickoffDate] = useState('');

  // Analysis form
  const [analysisMatchId, setAnalysisMatchId] = useState('');
  const [form, setForm] = useState('');
  const [headToHead, setHeadToHead] = useState('');
  const [tacticalInsight, setTacticalInsight] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>(ConfidenceLevel.moderate);

  // Ticket form
  const [ticketType, setTicketType] = useState<TicketType>(TicketType.safe);
  const [odds, setOdds] = useState('');
  const [selections, setSelections] = useState('');

  // Promote to admin form
  const [principalToPromote, setPrincipalToPromote] = useState('');

  // Update result form
  const [resultTicketId, setResultTicketId] = useState('');
  const [resultStatus, setResultStatus] = useState<TicketStatus>(TicketStatus.win);

  const handleAddMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const date = new Date(kickoffDate);
      const matchId = await addMatch.mutateAsync({
        league,
        teams,
        kickoff_date: BigInt(date.getTime() * 1_000_000),
      });
      toast.success(`Match added successfully! ID: ${matchId}`);
      setLeague('');
      setTeams('');
      setKickoffDate('');
    } catch (error) {
      toast.error('Failed to add match');
    }
  };

  const handleAddAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAnalysis.mutateAsync({
        match_id: BigInt(analysisMatchId),
        form: form.split('\n').filter((s) => s.trim()),
        head_to_head: headToHead.split('\n').filter((s) => s.trim()),
        tactical_insight: tacticalInsight,
        confidence_level: confidenceLevel,
      });
      toast.success('Analysis added successfully!');
      setAnalysisMatchId('');
      setForm('');
      setHeadToHead('');
      setTacticalInsight('');
    } catch (error) {
      toast.error('Failed to add analysis');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectionIds = selections
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s)
        .map((s) => BigInt(s));
      const ticketId = await createTicket.mutateAsync({
        ticket_type: ticketType,
        odds: parseFloat(odds),
        selections: selectionIds,
      });
      toast.success(`Ticket created successfully! ID: ${ticketId}`);
      setOdds('');
      setSelections('');
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const handlePromoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await promoteToAdmin.mutateAsync(principalToPromote);
      toast.success('User promoted to admin successfully!');
      setPrincipalToPromote('');
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('must have a profile')) {
        toast.error('User must have a profile before being promoted to admin');
      } else if (errorMessage.includes('Unauthorized')) {
        toast.error('Only admins can promote users');
      } else {
        toast.error('Failed to promote user to admin');
      }
    }
  };

  const handleUpdateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTicketResult.mutateAsync({
        ticketId: BigInt(resultTicketId),
        result: resultStatus,
      });
      toast.success('Ticket result updated successfully!');
      setResultTicketId('');
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('Ticket not found')) {
        toast.error('Ticket not found');
      } else if (errorMessage.includes('Unauthorized')) {
        toast.error('Only admins can update results');
      } else {
        toast.error('Failed to update ticket result');
      }
    }
  };

  // Calculate accuracy metrics
  const totalDecided = resultsWithTickets.filter(([_, status]) => status !== TicketStatus.pending).length;
  const totalWins = resultsWithTickets.filter(([_, status]) => status === TicketStatus.win).length;
  const totalLosses = resultsWithTickets.filter(([_, status]) => status === TicketStatus.loss).length;

  return (
    <div className="space-y-6">
      <div className="phoenix-card-gold p-8 text-center">
        <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary gold-text-glow">
          <Shield className="h-10 w-10" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-2">Manage matches, analysis, tickets, and results</p>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card border-2 border-primary/30 p-1">
          <TabsTrigger value="matches" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Matches
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Analysis
          </TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Tickets
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Results
          </TabsTrigger>
          <TabsTrigger value="admin" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Match
              </CardTitle>
              <CardDescription className="text-base">Create a new match for predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMatch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="league">League</Label>
                  <Input
                    id="league"
                    placeholder="e.g., Premier League"
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teams">Teams</Label>
                  <Input
                    id="teams"
                    placeholder="e.g., Arsenal vs Chelsea"
                    value={teams}
                    onChange={(e) => setTeams(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kickoff">Kickoff Date & Time</Label>
                  <Input
                    id="kickoff"
                    type="datetime-local"
                    value={kickoffDate}
                    onChange={(e) => setKickoffDate(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addMatch.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {addMatch.isPending ? 'Adding...' : 'Add Match'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Analysis
              </CardTitle>
              <CardDescription className="text-base">Create analysis for an existing match</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAnalysis} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="matchId">Match ID</Label>
                  <Select value={analysisMatchId} onValueChange={setAnalysisMatchId}>
                    <SelectTrigger id="matchId" className="bg-input border-border">
                      <SelectValue placeholder="Select a match" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {matches.map(([id, match]) => (
                        <SelectItem key={String(id)} value={String(id)}>
                          #{String(id)} - {match.teams}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form">Form (one per line)</Label>
                  <Textarea
                    id="form"
                    placeholder="Team A: WWDWL&#10;Team B: LWWDW"
                    value={form}
                    onChange={(e) => setForm(e.target.value)}
                    rows={3}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="h2h">Head to Head (one per line)</Label>
                  <Textarea
                    id="h2h"
                    placeholder="Last 5 meetings: 3-1-1&#10;Home advantage: Team A"
                    value={headToHead}
                    onChange={(e) => setHeadToHead(e.target.value)}
                    rows={3}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tactical">Tactical Insight</Label>
                  <Textarea
                    id="tactical"
                    placeholder="Detailed tactical analysis..."
                    value={tacticalInsight}
                    onChange={(e) => setTacticalInsight(e.target.value)}
                    rows={4}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confidence">Confidence Level</Label>
                  <Select
                    value={confidenceLevel}
                    onValueChange={(value) => setConfidenceLevel(value as ConfidenceLevel)}
                  >
                    <SelectTrigger id="confidence" className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={ConfidenceLevel.veryHigh}>Very High</SelectItem>
                      <SelectItem value={ConfidenceLevel.high}>High</SelectItem>
                      <SelectItem value={ConfidenceLevel.moderate}>Moderate</SelectItem>
                      <SelectItem value={ConfidenceLevel.low}>Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={addAnalysis.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {addAnalysis.isPending ? 'Adding...' : 'Add Analysis'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Build Ticket
              </CardTitle>
              <CardDescription className="text-base">Create a new VIP ticket</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketType">Ticket Type</Label>
                  <Select value={ticketType} onValueChange={(value) => setTicketType(value as TicketType)}>
                    <SelectTrigger id="ticketType" className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={TicketType.safe}>Safe Builder</SelectItem>
                      <SelectItem value={TicketType.value}>Value Accumulator</SelectItem>
                      <SelectItem value={TicketType.train}>Odds Train</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="odds">Total Odds</Label>
                  <Input
                    id="odds"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 2.50"
                    value={odds}
                    onChange={(e) => setOdds(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selections">Match IDs (comma-separated)</Label>
                  <Input
                    id="selections"
                    placeholder="e.g., 1, 2, 3"
                    value={selections}
                    onChange={(e) => setSelections(e.target.value)}
                    required
                    className="bg-input border-border"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createTicket.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {createTicket.isPending ? 'Creating...' : 'Create Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card className="phoenix-card-gold">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Track Accuracy
              </CardTitle>
              <CardDescription className="text-base">Overall prediction performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="font-heading text-5xl font-bold text-primary gold-text-glow">
                    {accuracy.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Decided</p>
                  <p className="font-heading text-4xl font-bold text-foreground">{totalDecided}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Wins</p>
                  <p className="font-heading text-4xl font-bold text-confidence-high">{totalWins}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Losses</p>
                  <p className="font-heading text-4xl font-bold text-confidence-low">{totalLosses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Update Results
              </CardTitle>
              <CardDescription className="text-base">Set the result for a ticket</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateResult} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resultTicketId">Ticket ID</Label>
                  <Select value={resultTicketId} onValueChange={setResultTicketId}>
                    <SelectTrigger id="resultTicketId" className="bg-input border-border">
                      <SelectValue placeholder="Select a ticket" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {tickets.map(([id, ticket]) => (
                        <SelectItem key={String(id)} value={String(id)}>
                          #{String(id)} - {ticket.ticket_type.toUpperCase()} ({ticket.odds.toFixed(2)}x)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resultStatus">Result</Label>
                  <Select
                    value={resultStatus}
                    onValueChange={(value) => setResultStatus(value as TicketStatus)}
                  >
                    <SelectTrigger id="resultStatus" className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value={TicketStatus.win}>Win</SelectItem>
                      <SelectItem value={TicketStatus.loss}>Loss</SelectItem>
                      <SelectItem value={TicketStatus.pending}>Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  disabled={updateTicketResult.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {updateTicketResult.isPending ? 'Updating...' : 'Update Result'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Promote to Admin
              </CardTitle>
              <CardDescription className="text-base">
                Grant admin privileges to another user (they must have a profile first)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePromoteToAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">User Principal ID</Label>
                  <Input
                    id="principal"
                    placeholder="e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                    value={principalToPromote}
                    onChange={(e) => setPrincipalToPromote(e.target.value)}
                    required
                    className="bg-input border-border font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    The user must be logged in and have created a profile before they can be promoted.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={promoteToAdmin.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {promoteToAdmin.isPending ? 'Promoting...' : 'Promote to Admin'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

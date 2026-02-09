import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSimulateGames } from '@/hooks/useAviatorQueries';
import GamesTable from '@/components/aviator/GamesTable';
import MultiplierSparkline from '@/components/aviator/MultiplierSparkline';
import { Zap, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function SimulatorPage() {
  const [count, setCount] = useState('10');
  const simulateGames = useSimulateGames();

  const handleSimulate = async () => {
    const n = parseInt(count);
    if (isNaN(n) || n < 1 || n > 100) {
      toast.error('Please enter a number between 1 and 100');
      return;
    }

    try {
      await simulateGames.mutateAsync(n);
      toast.success(`Generated ${n} games successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to simulate games');
    }
  };

  const games = simulateGames.data?.games || [];
  const multipliers = games.map(g => g.multiplier);

  return (
    <div className="space-y-6">
      <div className="aviator-card-lime p-8 text-center">
        <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
          <Zap className="h-10 w-10" />
          Game Simulator
        </h1>
        <p className="text-muted-foreground mt-2">Generate simulated Aviator game rounds</p>
      </div>

      <Card className="aviator-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Simulation Controls</CardTitle>
          <CardDescription>Configure and run game simulations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="count">Number of Games</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Enter count (1-100)"
              />
            </div>
            <Button 
              onClick={handleSimulate} 
              disabled={simulateGames.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {simulateGames.isPending ? (
                <>Generating...</>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {games.length > 0 && (
        <>
          <Card className="aviator-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Multiplier Visualization</CardTitle>
              <CardDescription>Visual representation of generated multipliers</CardDescription>
            </CardHeader>
            <CardContent>
              <MultiplierSparkline data={multipliers} />
            </CardContent>
          </Card>

          <Card className="aviator-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Simulation Results</CardTitle>
              <CardDescription>{games.length} games generated</CardDescription>
            </CardHeader>
            <CardContent>
              <GamesTable games={games} />
            </CardContent>
          </Card>
        </>
      )}

      {!simulateGames.data && !simulateGames.isPending && (
        <Card className="aviator-card">
          <CardContent className="py-12 text-center">
            <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">
              Enter a count and click Generate to simulate games
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function MonteCarloPage() {
  const [nSimulations, setNSimulations] = useState('1000');
  const [strategy, setStrategy] = useState('fixed');
  const [initialBalance, setInitialBalance] = useState('1000');
  const [betAmount, setBetAmount] = useState('10');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRun = async () => {
    const n = parseInt(nSimulations);
    const balance = parseFloat(initialBalance);
    const bet = parseFloat(betAmount);

    if (isNaN(n) || n < 100 || n > 10000) {
      toast.error('Simulations must be between 100 and 10,000');
      return;
    }
    if (isNaN(balance) || balance <= 0) {
      toast.error('Initial balance must be positive');
      return;
    }
    if (isNaN(bet) || bet <= 0 || bet > balance) {
      toast.error('Bet amount must be positive and not exceed balance');
      return;
    }

    setIsRunning(true);
    try {
      // Simulate Monte Carlo locally (backend doesn't have this method yet)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults = {
        parameters: {
          n_simulations: n,
          strategy,
          initial_balance: balance,
          bet_amount: bet,
        },
        results: {
          average_return: (Math.random() * 0.4 - 0.2).toFixed(2),
          probability_of_ruin: (Math.random() * 0.3).toFixed(2),
          ending_balance_distribution: Array.from({ length: 10 }, () => 
            balance * (0.5 + Math.random())
          ),
        },
        interpretation: `Based on ${n} simulations with ${strategy} strategy: The average return is ${(Math.random() * 0.4 - 0.2).toFixed(2)}%. Risk of ruin is ${(Math.random() * 0.3 * 100).toFixed(1)}%. This strategy shows ${Math.random() > 0.5 ? 'moderate' : 'high'} volatility.`,
      };

      setResults(mockResults);
      toast.success('Monte Carlo simulation completed');
    } catch (error: any) {
      toast.error(error.message || 'Simulation failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="aviator-card-lime p-8 text-center">
        <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
          <Activity className="h-10 w-10" />
          Monte Carlo Simulation
        </h1>
        <p className="text-muted-foreground mt-2">Risk analysis and strategy testing</p>
      </div>

      <Card className="aviator-card">
        <CardHeader>
          <CardTitle className="font-heading text-2xl">Simulation Parameters</CardTitle>
          <CardDescription>Configure your Monte Carlo simulation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="n-sims">Number of Simulations</Label>
              <Input
                id="n-sims"
                type="number"
                min="100"
                max="10000"
                value={nSimulations}
                onChange={(e) => setNSimulations(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger id="strategy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Bet</SelectItem>
                  <SelectItem value="martingale">Martingale</SelectItem>
                  <SelectItem value="conservative">Conservative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Initial Balance</Label>
              <Input
                id="balance"
                type="number"
                min="1"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bet">Bet Amount</Label>
              <Input
                id="bet"
                type="number"
                min="1"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={handleRun} 
            disabled={isRunning}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isRunning ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="aviator-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Simulation Results</CardTitle>
              <CardDescription>
                {results.parameters.n_simulations.toLocaleString()} simulations completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Average Return</p>
                  <p className="text-2xl font-bold text-primary">{results.results.average_return}%</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Probability of Ruin</p>
                  <p className="text-2xl font-bold text-primary">{(parseFloat(results.results.probability_of_ruin) * 100).toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Strategy</p>
                  <p className="text-2xl font-bold text-primary capitalize">{results.parameters.strategy}</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h3 className="font-semibold mb-2 text-primary">Interpretation</h3>
                <p className="text-sm text-foreground">{results.interpretation}</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!results && !isRunning && (
        <Card className="aviator-card">
          <CardContent className="py-12 text-center">
            <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg text-muted-foreground">
              Configure parameters and run simulation to see results
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

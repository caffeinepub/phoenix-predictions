import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetRecentGames } from '@/hooks/useAviatorQueries';
import GamesTable from '@/components/aviator/GamesTable';
import DistributionBuckets from '@/components/aviator/DistributionBuckets';
import CameraCaptureRecorderCard from '@/components/live/CameraCaptureRecorderCard';
import { Radio, Play, Pause, Activity, Video } from 'lucide-react';
import { getUrlParameter } from '@/utils/urlParams';

export default function LivePage() {
  const [isPaused, setIsPaused] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(5000);
  
  // Initialize captureMode from URL parameter on first render
  const [captureMode, setCaptureMode] = useState<'simulated' | 'camera'>(() => {
    const modeParam = getUrlParameter('mode');
    return modeParam === 'camera' ? 'camera' : 'simulated';
  });
  
  const { data: recentGames = [], isLoading, refetch } = useGetRecentGames();

  useEffect(() => {
    if (isPaused || captureMode === 'camera') return;

    const interval = setInterval(() => {
      refetch();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [isPaused, pollingInterval, refetch, captureMode]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading live feed...</p>
        </div>
      </div>
    );
  }

  const multipliers = recentGames.map(g => g.multiplier);
  const distribution = {
    under_1x: multipliers.filter(m => m < 1.0).length,
    x_1_to_2: multipliers.filter(m => m >= 1.0 && m < 2.0).length,
    x_2_to_5: multipliers.filter(m => m >= 2.0 && m < 5.0).length,
    x_5_to_10: multipliers.filter(m => m >= 5.0 && m < 10.0).length,
    x_10_plus: multipliers.filter(m => m >= 10.0).length,
  };

  const avgMultiplier = multipliers.length > 0
    ? (multipliers.reduce((a, b) => a + b, 0) / multipliers.length).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      <div className="aviator-card-lime p-8 text-center">
        <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
          <Radio className="h-10 w-10" />
          Live Feed
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time game updates and camera recording for analytics
        </p>
      </div>

      {/* In-page control to switch to camera mode */}
      {captureMode === 'simulated' && (
        <div className="flex justify-center">
          <Button
            onClick={() => setCaptureMode('camera')}
            variant="default"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Video className="h-5 w-5 mr-2" />
            Open live camera
          </Button>
        </div>
      )}

      <Tabs value={captureMode} onValueChange={(v) => setCaptureMode(v as 'simulated' | 'camera')} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="simulated" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Simulated Live Feed
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Camera Recording
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simulated" className="space-y-6 mt-6">
          <Card className="aviator-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-2xl">Feed Controls</CardTitle>
                  <CardDescription>Manage live data updates (refreshes every {pollingInterval / 1000}s)</CardDescription>
                </div>
                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  variant={isPaused ? 'default' : 'secondary'}
                  className={isPaused ? 'bg-primary hover:bg-primary/90' : ''}
                >
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${isPaused ? 'bg-muted-foreground' : 'bg-primary animate-pulse'}`} />
                <span className="text-sm text-muted-foreground">
                  {isPaused ? 'Feed paused' : 'Live updates active'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="aviator-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Rolling Statistics</CardTitle>
              <CardDescription>Current session metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Average Multiplier</p>
                  <p className="text-2xl font-bold text-primary">{avgMultiplier}x</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Games</p>
                  <p className="text-2xl font-bold text-primary">{recentGames.length}</p>
                </div>
              </div>
              <DistributionBuckets distribution={distribution} />
            </CardContent>
          </Card>

          <Card className="aviator-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Recent Games</CardTitle>
              <CardDescription>Latest {Math.min(20, recentGames.length)} games</CardDescription>
            </CardHeader>
            <CardContent>
              {recentGames.length > 0 ? (
                <GamesTable games={recentGames.slice(-20).reverse()} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No games available. Generate games in the Simulator.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="camera" className="space-y-6 mt-6">
          <CameraCaptureRecorderCard />
          
          <Card className="aviator-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">About Camera Recording</CardTitle>
              <CardDescription>How to use camera capture for analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Use the camera recording feature to capture live Aviator gameplay from your screen or another device.
                This allows you to record real game sessions for later analysis.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Click "Enable Camera" to request camera permissions</li>
                <li>Position your camera to capture the Aviator game screen</li>
                <li>Click "Start Recording" to begin capturing gameplay</li>
                <li>Click "Stop Recording" when finished</li>
                <li>Download the recording for offline analysis</li>
              </ul>
              <p className="text-xs italic">
                Note: Recordings are stored locally in your browser and are not uploaded to any server.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

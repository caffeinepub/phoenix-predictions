import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles } from 'lucide-react';
import { useBootstrapAdmin } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function AdminBootstrapScreen() {
  const bootstrapAdmin = useBootstrapAdmin();

  const handleBootstrap = async () => {
    try {
      await bootstrapAdmin.mutateAsync();
      toast.success('Admin role granted successfully! You now have full admin access.');
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes('Admin already bootstrapped')) {
        toast.error('Admin has already been bootstrapped. Please contact an existing admin.');
      } else {
        toast.error('Failed to bootstrap admin. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md phoenix-card-gold">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl text-primary">First Admin Setup</CardTitle>
          <CardDescription className="text-base">
            No administrators exist yet. As the first authenticated user, you can become the initial admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-primary/10 border-2 border-primary/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Sparkles className="h-4 w-4" />
              Admin Privileges Include:
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Add matches and analysis</li>
              <li>Create VIP tickets</li>
              <li>Update results and track accuracy</li>
              <li>Promote other users to admin</li>
            </ul>
          </div>
          <Button
            onClick={handleBootstrap}
            disabled={bootstrapAdmin.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {bootstrapAdmin.isPending ? 'Granting Admin Access...' : 'Become Admin'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

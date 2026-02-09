import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdminBootstrapAvailable } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import AccessDeniedScreen from './AccessDeniedScreen';
import AdminBootstrapScreen from './AdminBootstrapScreen';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isLoading: userLoading, roleError, refetchRole } = useCurrentUser();
  const { identity } = useInternetIdentity();
  const { data: isBootstrapAvailable, isLoading: bootstrapLoading, error: bootstrapError } = useIsAdminBootstrapAvailable();

  const isLoading = userLoading || bootstrapLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Handle role detection errors
  if (roleError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to determine your access level. Please try again.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => refetchRole()} 
            className="w-full"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Handle bootstrap availability check errors
  if (bootstrapError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to check admin setup status. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // If user is admin, show admin panel
  if (isAdmin) {
    return <>{children}</>;
  }

  // If authenticated but not admin, check if bootstrap is available
  if (identity && !isAdmin && isBootstrapAvailable === true) {
    // Bootstrap is available (no admins exist yet)
    return <AdminBootstrapScreen />;
  }

  // Not admin and bootstrap not available
  return <AccessDeniedScreen />;
}

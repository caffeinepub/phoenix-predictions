import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useIsAdminPanelVisible } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import AccessDeniedScreen from './AccessDeniedScreen';
import AdminBootstrapScreen from './AdminBootstrapScreen';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isLoading: userLoading } = useCurrentUser();
  const { identity } = useInternetIdentity();
  const { data: isAdminPanelVisible, isLoading: visibilityLoading } = useIsAdminPanelVisible();

  const isLoading = userLoading || visibilityLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If user is admin, show admin panel
  if (isAdmin) {
    return <>{children}</>;
  }

  // If authenticated but not admin, check if bootstrap is available
  if (identity && !isAdmin && isAdminPanelVisible === false) {
    // Bootstrap is available (no admins exist yet)
    return <AdminBootstrapScreen />;
  }

  // Not admin and bootstrap not available
  return <AccessDeniedScreen />;
}

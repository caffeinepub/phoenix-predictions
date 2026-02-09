import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './useInternetIdentity';
import { useCurrentUser } from './useCurrentUser';
import { UserRole } from '@/backend';

/**
 * Hook that automatically redirects users after login based on their role.
 * Admins are redirected to /admin, regular users to / (Dashboard).
 * Handles both initial login and role changes (e.g., bootstrap promotion).
 */
export function usePostLoginRedirect() {
  const { identity, loginStatus } = useInternetIdentity();
  const { isAdmin, role, isLoading } = useCurrentUser();
  const navigate = useNavigate();
  const hasRedirectedThisSession = useRef(false);
  const previousIdentity = useRef<string | null>(null);

  useEffect(() => {
    // Reset redirect flag when user logs out
    if (!identity) {
      hasRedirectedThisSession.current = false;
      previousIdentity.current = null;
      return;
    }

    // Skip if still loading or already redirected this session
    if (isLoading || hasRedirectedThisSession.current) {
      return;
    }

    // Check if this is a new login (identity changed)
    const currentIdentityString = identity.getPrincipal().toString();
    const isNewLogin = previousIdentity.current !== currentIdentityString;
    previousIdentity.current = currentIdentityString;

    // Only redirect on new login or when login just succeeded
    if (!isNewLogin && loginStatus !== 'success') {
      return;
    }

    // Perform redirect based on role
    if (isAdmin) {
      navigate({ to: '/admin' });
      hasRedirectedThisSession.current = true;
    } else if (role === UserRole.user) {
      navigate({ to: '/' });
      hasRedirectedThisSession.current = true;
    }
  }, [identity, isAdmin, role, isLoading, loginStatus, navigate]);
}

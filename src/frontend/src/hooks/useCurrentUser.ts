import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, UserRole } from '@/backend';

export function useCurrentUser() {
  const { actor, isFetching: actorFetching } = useActor();

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const roleQuery = useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
  });

  return {
    userProfile: profileQuery.data ?? null,
    isLoading: actorFetching || profileQuery.isLoading || roleQuery.isLoading,
    isFetched: !!actor && profileQuery.isFetched,
    role: roleQuery.data ?? UserRole.guest,
    isAdmin: roleQuery.data === UserRole.admin,
    roleError: roleQuery.error,
    refetchRole: roleQuery.refetch,
  };
}

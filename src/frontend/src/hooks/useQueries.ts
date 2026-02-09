import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, UserRole } from '@/backend';
import { Principal } from '@icp-sdk/core/principal';

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isAdminBootstrapAvailable'] });
    },
  });
}

export function useIsAdminBootstrapAvailable() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdminBootstrapAvailable'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminBootstrapAvailable();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useBootstrapAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(Principal.anonymous(), UserRole.admin);
    },
    onSuccess: async () => {
      queryClient.setQueryData(['currentUserRole'], UserRole.admin);
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['currentUserRole'] }),
        queryClient.invalidateQueries({ queryKey: ['isAdminBootstrapAvailable'] }),
        queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] }),
      ]);
      
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['currentUserRole'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['isAdminBootstrapAvailable'], type: 'active' }),
      ]);
    },
  });
}

export function usePromoteToAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principalText: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalText);
      return actor.assignCallerUserRole(principal, UserRole.admin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Analysis, ConfidenceLevel, Match, Ticket, TicketType, User, SubscriptionType, TicketStatus } from '@/backend';
import { Principal } from '@icp-sdk/core/principal';

export function useGetAllMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Match, Analysis | null]>>({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTickets() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Ticket]>>({
    queryKey: ['tickets'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllTickets();
      } catch (error) {
        // VIP content - return empty if unauthorized
        console.warn('Tickets access denied:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: User) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

export function useUpgradeSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newType: SubscriptionType) => {
      if (!actor) throw new Error('Actor not available');
      return actor.upgradeSubscription(newType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAddMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { league: string; teams: string; kickoff_date: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMatch(data.league, data.teams, data.kickoff_date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

export function useAddAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      match_id: bigint;
      form: string[];
      head_to_head: string[];
      tactical_insight: string;
      confidence_level: ConfidenceLevel;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAnalysis(
        data.match_id,
        data.form,
        data.head_to_head,
        data.tactical_insight,
        data.confidence_level
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

export function useCreateTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { ticket_type: TicketType; odds: number; selections: bigint[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTicket(data.ticket_type, data.odds, data.selections);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

// Admin bootstrap and promotion hooks
export function useIsAdminPanelVisible() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdminPanelVisible'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminPanelVisible();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBootstrapAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.bootstrapAdmin();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['isAdminPanelVisible'] });
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
      return actor.promoteToAdmin(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

// Results and accuracy hooks
export function useGetAllResultsWithTickets() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, TicketStatus]>>({
    queryKey: ['resultsWithTickets'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllResultsWithTickets();
      } catch (error) {
        console.warn('Results access denied:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCalculateAccuracy() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['accuracy'],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        return await actor.calculateAccuracy();
      } catch (error) {
        console.warn('Accuracy calculation access denied:', error);
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateTicketResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { ticketId: bigint; result: TicketStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTicketResult(data.ticketId, data.result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resultsWithTickets'] });
      queryClient.invalidateQueries({ queryKey: ['accuracy'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

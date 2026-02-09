import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Game, Pattern } from '@/backend';

export function useGetRecentGames() {
  const { actor, isFetching } = useActor();

  return useQuery<Game[]>({
    queryKey: ['recentGames'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSimulateGames() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (count: number) => {
      if (!actor) throw new Error('Actor not available');
      
      const games: Game[] = [];
      const now = Date.now() * 1_000_000;
      
      for (let i = 0; i < count; i++) {
        const multiplier = Math.random() < 0.5 
          ? 1.0 + Math.random() * 1.5
          : Math.random() < 0.8
            ? 2.0 + Math.random() * 3.0
            : 5.0 + Math.random() * 15.0;
        
        const duration = multiplier * (2 + Math.random() * 3);
        
        const game: Game = {
          multiplier,
          duration,
          timestamp: BigInt(now + i * 1000000),
          flight_curve: undefined,
        };
        
        games.push(game);
        await actor.addGame(game);
      }
      
      return { games, count, timestamp: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentGames'] });
    },
  });
}

export function useGetPatterns() {
  const { actor, isFetching } = useActor();

  return useQuery<Pattern[]>({
    queryKey: ['patterns'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPatterns();
    },
    enabled: !!actor && !isFetching,
  });
}

import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { LastBuildStatus } from '@/backend';

/**
 * React Query hook to fetch the last recorded build/deploy status
 * Used by admin UI for troubleshooting deployment failures
 */
export function useLastBuildStatus() {
  const { actor, isFetching: isActorLoading } = useActor();

  return useQuery<LastBuildStatus | null>({
    queryKey: ['admin', 'lastBuildStatus'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLastBuildStatus();
    },
    enabled: !!actor && !isActorLoading,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

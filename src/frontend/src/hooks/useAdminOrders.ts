import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { isAdminAuthorized } from '@/lib/adminAccess';
import type { Order } from '@/backend';

/**
 * Fetch all orders for admin dashboard
 * Only fetches when admin access is valid
 */
export function useAdminOrders() {
  const { actor, isFetching: isActorLoading } = useActor();
  const isAuthorized = isAdminAuthorized();

  return useQuery<Order[]>({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      if (!actor || !isAuthorized) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isActorLoading && isAuthorized,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

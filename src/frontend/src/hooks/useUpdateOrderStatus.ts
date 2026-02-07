import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { OrderStatus } from '@/backend';
import type { Order } from '@/backend';

interface UpdateOrderStatusParams {
  orderId: bigint;
  newStatus: OrderStatus;
  changedBy: string;
}

/**
 * Mutation hook to update order status
 * Refreshes admin orders cache on success
 */
export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Order | null, Error, UpdateOrderStatusParams>({
    mutationFn: async ({ orderId, newStatus, changedBy }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateOrderStatus(orderId, newStatus, changedBy);
    },
    onSuccess: () => {
      // Invalidate and refetch admin orders
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order } from '../backend';

interface CreateOrderParams {
  plateTypeId: bigint;
  plateTypeName: string;
  price: bigint;
  quantity: bigint;
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, CreateOrderParams>({
    mutationFn: async ({ plateTypeId, plateTypeName, price, quantity }) => {
      if (!actor) {
        throw new Error('Backend actor not initialized');
      }
      return await actor.createOrder(plateTypeId, plateTypeName, price, quantity);
    },
    onSuccess: () => {
      // Invalidate orders queries if we add them later
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    createOrder: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}

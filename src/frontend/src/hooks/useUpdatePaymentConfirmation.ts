import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order, PaymentConfirmation } from '../backend';

interface UpdatePaymentConfirmationParams {
  orderId: bigint;
  utr: string;
  paidVia: string;
  paymentMethodId: bigint;
}

export function useUpdatePaymentConfirmation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const mutation = useMutation<Order | null, Error, UpdatePaymentConfirmationParams>({
    mutationFn: async ({ orderId, utr, paidVia, paymentMethodId }) => {
      if (!actor) {
        throw new Error('Backend actor not initialized');
      }

      const paymentConfirmation: PaymentConfirmation = {
        utr,
        paidVia,
        paymentMethodId,
        paidAt: BigInt(Date.now() * 1000000), // Convert to nanoseconds
      };

      return await actor.updatePaymentConfirmation(orderId, paymentConfirmation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    updatePaymentConfirmation: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

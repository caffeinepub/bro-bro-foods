/**
 * Centralized order rules and validation
 */

// Minimum number of plates required for delivery
export const MIN_PLATES_FOR_DELIVERY = 2;

/**
 * Check if an order meets the minimum delivery requirement
 */
export function meetsMinimumOrder(quantity: number): boolean {
  return quantity >= MIN_PLATES_FOR_DELIVERY;
}

/**
 * Get the minimum order message for display
 */
export function getMinimumOrderMessage(): string {
  return `Minimum order for delivery: ${MIN_PLATES_FOR_DELIVERY} plates`;
}

/**
 * Get validation error message when minimum is not met
 */
export function getMinimumOrderError(currentQuantity: number): string {
  const remaining = MIN_PLATES_FOR_DELIVERY - currentQuantity;
  return `Please add ${remaining} more plate${remaining > 1 ? 's' : ''} to meet the minimum order requirement.`;
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface OrdersFiltersProps {
  paymentFilter: string;
  statusFilter: string;
  onPaymentFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

/**
 * Admin order list filters for payment status and order status
 */
export default function OrdersFilters({
  paymentFilter,
  statusFilter,
  onPaymentFilterChange,
  onStatusFilterChange,
}: OrdersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="payment-filter" className="mb-2 block">Payment Status</Label>
        <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
          <SelectTrigger id="payment-filter">
            <SelectValue placeholder="All Payments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="status-filter" className="mb-2 block">Order Status</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="readyToDeliver">Ready to Deliver</SelectItem>
            <SelectItem value="outForDelivery">Out for Delivery</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

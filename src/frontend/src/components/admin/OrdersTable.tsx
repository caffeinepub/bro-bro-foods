import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import type { Order } from '@/backend';

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

/**
 * Format timestamp to readable date/time
 */
function formatDateTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status badge variant
 */
function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'destructive';
    case 'outForDelivery':
      return 'secondary';
    default:
      return 'outline';
  }
}

/**
 * Format status for display
 */
function formatStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'preparing':
      return 'Preparing';
    case 'outForDelivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

/**
 * Admin orders table with payment and status information
 */
export default function OrdersTable({ orders, onViewDetails }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No orders found matching the selected filters.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id.toString()}>
              <TableCell className="font-mono">#{order.id.toString()}</TableCell>
              <TableCell>{order.plateTypeName}</TableCell>
              <TableCell>{order.quantity.toString()}</TableCell>
              <TableCell className="font-semibold">₹{order.totalAmount.toString()}</TableCell>
              <TableCell className="text-sm">{formatDateTime(order.createdAt)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {formatStatus(order.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {order.paymentConfirmation ? (
                  <div className="text-sm">
                    <Badge variant="default" className="mb-1">Paid</Badge>
                    <div className="text-xs text-muted-foreground">
                      {order.paymentConfirmation.paidVia}
                    </div>
                  </div>
                ) : (
                  <Badge variant="outline">Unpaid</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

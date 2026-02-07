import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus';
import { OrderStatus } from '@/backend';
import type { Order } from '@/backend';
import { Loader2 } from 'lucide-react';

interface OrderDetailViewProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Format timestamp to readable date/time
 */
function formatDateTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1000000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
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
 * Order detail view with status update and timeline
 */
export default function OrderDetailView({ order, open, onClose }: OrderDetailViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const updateStatusMutation = useUpdateOrderStatus();

  if (!order) return null;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;

    try {
      await updateStatusMutation.mutateAsync({
        orderId: order.id,
        newStatus: selectedStatus as OrderStatus,
        changedBy: 'Admin',
      });
      setSelectedStatus('');
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
          <SheetDescription>
            Order #{order.id.toString()}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Order Information */}
          <div>
            <h3 className="font-semibold mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item:</span>
                <span className="font-medium">{order.plateTypeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{order.quantity.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Price:</span>
                <span className="font-medium">₹{order.price.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold text-lg">₹{order.totalAmount.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="font-semibold mb-3">Payment Information</h3>
            {order.paymentConfirmation ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="default">Paid</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid Via:</span>
                  <span className="font-medium">{order.paymentConfirmation.paidVia}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">UTR:</span>
                  <span className="font-mono text-xs">{order.paymentConfirmation.utr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid At:</span>
                  <span className="font-medium">{formatDateTime(order.paymentConfirmation.paidAt)}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <Badge variant="outline">Payment Pending</Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Status Update */}
          <div>
            <h3 className="font-semibold mb-3">Update Order Status</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="status-select">Current Status</Label>
                <div className="mt-1">
                  <Badge variant="secondary">{formatStatus(order.status)}</Badge>
                </div>
              </div>
              <div>
                <Label htmlFor="status-select">Change Status To</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="status-select" className="mt-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="outForDelivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || selectedStatus === order.status || updateStatusMutation.isPending}
                className="w-full"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="font-semibold mb-3">Order Timeline</h3>
            <div className="space-y-3">
              {order.statusEvents.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {index < order.statusEvents.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="font-medium">{formatStatus(event.status)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(event.changedAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Changed by: {event.changedBy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

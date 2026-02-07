import { useState, useMemo } from 'react';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import OrdersFilters from './OrdersFilters';
import OrdersTable from './OrdersTable';
import OrderDetailView from './OrderDetailView';
import AdminApkDownloadButton from './AdminApkDownloadButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import type { Order } from '@/backend';

/**
 * Admin dashboard with order tracking and management
 */
export default function AdminDashboard() {
  const { data: orders = [], isLoading, error } = useAdminOrders();
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter and sort orders (newest first)
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter by payment status
    if (paymentFilter === 'paid') {
      filtered = filtered.filter((order) => order.paymentConfirmation !== undefined);
    } else if (paymentFilter === 'unpaid') {
      filtered = filtered.filter((order) => order.paymentConfirmation === undefined);
    }

    // Filter by order status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Sort by created date (newest first)
    filtered.sort((a, b) => Number(b.createdAt - a.createdAt));

    return filtered;
  }, [orders, paymentFilter, statusFilter]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Bro Bro Foods Order Management</p>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/brobro-logo.dim_512x512.png"
                alt="Bro Bro Foods"
                className="h-12 w-12 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-foreground">{orders.length}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
                <Separator />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {orders.filter((o) => o.paymentConfirmation).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Paid Orders</div>
                </div>
                <Separator />
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {orders.filter((o) => o.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending Orders</div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Admin App</CardTitle>
                <CardDescription>Download the admin mobile app</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminApkDownloadButton />
              </CardContent>
            </Card>
          </aside>

          {/* Orders List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and manage all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersFilters
                  paymentFilter={paymentFilter}
                  statusFilter={statusFilter}
                  onPaymentFilterChange={setPaymentFilter}
                  onStatusFilterChange={setStatusFilter}
                />
                <OrdersTable orders={filteredOrders} onViewDetails={handleViewDetails} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Order Detail Sheet */}
      <OrderDetailView order={selectedOrder} open={!!selectedOrder} onClose={handleCloseDetails} />
    </div>
  );
}

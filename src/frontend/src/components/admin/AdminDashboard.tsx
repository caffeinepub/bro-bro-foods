import { useState } from 'react';
import { LogOut, Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import OrdersFilters from './OrdersFilters';
import OrdersTable from './OrdersTable';
import OrderDetailView from './OrderDetailView';
import AdminApkDownloadButton from './AdminApkDownloadButton';
import OwnerSettingsSection from './OwnerSettingsSection';
import BuildDeployStatusPanel from './BuildDeployStatusPanel';
import { clearAdminToken } from '@/lib/adminAccess';
import type { Order } from '@/backend';

type PaymentStatusFilter = 'all' | 'paid' | 'unpaid';
type OrderStatusFilter = 'all' | 'pending' | 'accepted' | 'preparing' | 'readyToDeliver' | 'outForDelivery' | 'delivered' | 'cancelled';

export default function AdminDashboard() {
  const { data: orders = [], isLoading, error } = useAdminOrders();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatusFilter>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogout = () => {
    clearAdminToken();
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Payment status filter
    if (paymentStatusFilter === 'paid' && !order.paymentConfirmation) return false;
    if (paymentStatusFilter === 'unpaid' && order.paymentConfirmation) return false;

    // Order status filter
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) return false;

    return true;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.paymentConfirmation).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalRevenue = orders
    .filter((o) => o.paymentConfirmation)
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/brobro-logo.dim_512x512.png" 
                alt="Bro Bro Foods" 
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary">Bro Bro Foods</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AdminApkDownloadButton />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Owner Settings Section */}
        <OwnerSettingsSection />

        {/* Build & Deploy Status Panel */}
        <div className="mb-8">
          <BuildDeployStatusPanel />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paidOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <OrdersFilters
          paymentFilter={paymentStatusFilter}
          statusFilter={orderStatusFilter}
          onPaymentFilterChange={(value) => setPaymentStatusFilter(value as PaymentStatusFilter)}
          onStatusFilterChange={(value) => setOrderStatusFilter(value as OrderStatusFilter)}
        />

        {/* Orders Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Error loading orders</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <OrdersTable
            orders={filteredOrders}
            onViewDetails={setSelectedOrder}
          />
        )}
      </div>

      {/* Order Detail View */}
      <OrderDetailView
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { StoreOrdersTable } from "@/components/Dashboard/orders/StoreOrdersTable";

export default function StoreOrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Store Orders</h1>
          <p className="text-brown-600">
            Payment-verified orders ready for preparation
          </p>
        </div>
        <StoreOrdersTable />
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { CreditOrdersTable } from "@/components/Dashboard/orders/CreditOrdersTable";

export default function CreditOrdersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Credit Orders</h1>
          <p className="text-brown-600">Manage orders placed on credit</p>
        </div>
        <CreditOrdersTable />
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { ProductsManagement } from "@/components/Dashboard/settings/ProductsManagement";

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Products</h1>
          <p className="text-brown-600">Manage your product catalogue</p>
        </div>
        <ProductsManagement />
      </div>
    </DashboardLayout>
  );
}

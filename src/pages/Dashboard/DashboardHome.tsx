import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { DashboardStats } from "@/components/Dashboard/dashboard-home/DashboardStats";
import { RecentOrders } from "@/components/Dashboard/dashboard-home/RecentOrders";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardHome() {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-brown-900">
          {user?.role === "admin"
            ? "Admin Overview"
            :  "Sales Overview"}
        </h1>
        <DashboardStats />
        <RecentOrders />
      </div>
    </DashboardLayout>
  );
}

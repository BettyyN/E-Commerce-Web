import { Card } from "@/components/shared/ui/card";
import {
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export function DashboardStats() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  const stats = isAdmin
    ? [
        {
          icon: ShoppingBag,
          label: "Total Orders",
          value: "1,234",
          change: "+12%",
          trend: "up",
          bgGradient: "from-blue-500 to-blue-600",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        },
        {
          icon: Users,
          label: "Total Customers",
          value: "856",
          change: "+8%",
          trend: "up",
          bgGradient: "from-green-500 to-green-600",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        },
        {
          icon: CreditCard,
          label: "Total Credit",
          value: "45,678 ETB",
          change: "+15%",
          trend: "up",
          bgGradient: "from-yellow-500 to-yellow-600",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
        },
        {
          icon: TrendingUp,
          label: "Revenue",
          value: "123,456 ETB",
          change: "+20%",
          trend: "up",
          bgGradient: "from-purple-500 to-purple-600",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
        },
      ]
    : [
        {
          icon: Users,
          label: "Total Customers",
          value: "856",
          change: "+8%",
          trend: "up",
          bgGradient: "from-green-500 to-green-600",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        },
        {
          icon: Users,
          label: "Pending Approvals",
          value: "12",
          change: "+3",
          trend: "up",
          bgGradient: "from-orange-500 to-orange-600",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
        },
        {
          icon: Users,
          label: "New This Month",
          value: "45",
          change: "+18%",
          trend: "up",
          bgGradient: "from-blue-500 to-blue-600",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

        return (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />

            <div className="relative p-6">
              {/* Icon and Trend */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-brown-900 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm text-brown-600 font-medium">
                  {stat.label}
                </p>
              </div>

              {/* Bottom Accent Line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.bgGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/shared/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Users,
  UserCog,
  LayoutDashboard,
  Settings,
  Package,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

type DashboardRole = "admin" | "sales";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: DashboardRole[];
}

interface DashboardSidebarProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function DashboardSidebar({
  onNavigate,
  isMobile = false,
}: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const menuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "sales"],
    },
    {
      icon: ShoppingBag,
      label: "Orders",
      path: "/dashboard/orders",
      roles: ["admin", "sales"],
    },
    {
      icon: CreditCard,
      label: "Credit",
      path: "/dashboard/credit",
      roles: ["admin", "sales"],
    },
    {
      icon: Users,
      label: "Customers",
      path: "/dashboard/customers",
      roles: ["admin", "sales"],
    },
    {
      icon: UserCog,
      label: "Employees",
      path: "/dashboard/employees",
      roles: ["admin"],
    },
    {
      icon: Package,
      label: "Products",
      path: "/dashboard/products",
      roles: ["admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role as DashboardRole),
  );

  return (
    <div
      className={`bg-white border-r border-brown-200 transition-all duration-300 flex flex-col h-full ${
        isMobile ? "w-64" : collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-brown-200 flex items-center justify-between">
        {(!collapsed || isMobile) && (
          <h1>
            <img
              src="/horizontalLogo.png"
              alt="STOCK UP"
              className="h-14 w-auto"
            />
          </h1>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-brown-700 hover:bg-yellow-50"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/dashboard" &&
              location.pathname.startsWith(item.path + "/"));
          return (
            <Link key={item.path} to={item.path} onClick={onNavigate}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-brown-900 hover:from-yellow-600 hover:to-yellow-700"
                    : "text-brown-700 hover:bg-yellow-50"
                } ${collapsed && !isMobile ? "px-2" : ""}`}
              >
                <Icon
                  className={`h-5 w-5 ${collapsed && !isMobile ? "" : "mr-3"}`}
                />
                {(!collapsed || isMobile) && <span>{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Products active check covers /dashboard/products routes */}

      {/* Settings - Sticky to Bottom (admin only) */}
      {(!collapsed || isMobile) && user && user.role === "admin" && (
        <div className="mt-auto border-t border-brown-200 p-2">
          <Link to="/dashboard/settings" onClick={onNavigate}>
            <Button
              variant={
                location.pathname.startsWith("/dashboard/settings")
                  ? "default"
                  : "ghost"
              }
              className={`w-full justify-start ${
                location.pathname.startsWith("/dashboard/settings")
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-brown-900 hover:from-yellow-600 hover:to-yellow-700"
                  : "text-brown-700 hover:bg-yellow-50"
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </Button>
          </Link>
        </div>
      )}

      {collapsed && !isMobile && user && user.role === "admin" && (
        <div className="mt-auto border-t border-brown-200 p-2">
          <Link to="/dashboard/settings" onClick={onNavigate}>
            <Button
              variant={
                location.pathname.startsWith("/dashboard/settings")
                  ? "default"
                  : "ghost"
              }
              size="icon"
              className={`w-full ${
                location.pathname.startsWith("/dashboard/settings")
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-brown-900 hover:from-yellow-600 hover:to-yellow-700"
                  : "text-brown-700 hover:bg-yellow-50"
              }`}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

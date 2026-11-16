import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";
import { useCartStore } from "./store/cartStore";
import { useAuthStore } from "./store/auth.store";
import { useTokenRefresh } from "./hooks/useTokenRefresh";
import LandingPage from "./pages/Customer/LandingPage"; // eager: first paint

// Customer
const ProductDetailPage = lazy(
  () => import("./pages/Customer/ProductDetailPage"),
);
const CartPage = lazy(() => import("./pages/Customer/CartPage"));
const CheckoutPage = lazy(() => import("./pages/Customer/CheckoutPage"));
const CustomerDashboard = lazy(
  () => import("./pages/Customer/CustomerDashboard"),
);
const CustomerProfilePage = lazy(() => import("./pages/Customer/ProfilePage"));
const CustomerOrderDetailPage = lazy(
  () => import("./pages/Customer/CustomerOrderDetailPage"),
);
const CustomerCreditDetailPage = lazy(
  () => import("./pages/Customer/CustomerCreditDetailPage"),
);
const CustomerCreditPaymentHistoryPage = lazy(
  () => import("./pages/Customer/CustomerCreditPaymentHistoryPage"),
);
const ContactPage = lazy(() => import("./pages/Customer/ContactPage"));
const PrivacyPolicy = lazy(() => import("./pages/Customer/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/Customer/TermsOfService"));

// Dashboard
const DashboardHome = lazy(() => import("./pages/Dashboard/DashboardHome"));
const CustomersPage = lazy(() => import("./pages/Dashboard/CustomersPage"));
const OrdersPage = lazy(() => import("./pages/Dashboard/OrdersPage"));
const CreditPage = lazy(() => import("./pages/Dashboard/CreditPage"));
const EmployeesPage = lazy(() => import("./pages/Dashboard/EmployeesPage"));
const SettingsPage = lazy(
  () => import("./pages/Dashboard/Setting/SettingsPage"),
);
const VariantDiscountsPage = lazy(
  () => import("./pages/Dashboard/Setting/VariantDiscountsPage"),
);
const AdminProductDetailPage = lazy(
  () => import("./pages/Dashboard/AdminProductDetailPage"),
);
const OrderCreditDetailPage = lazy(
  () => import("./pages/Dashboard/OrderCreditDetailPage"),
);
const DashboardCreditDetailPage = lazy(
  () => import("./pages/Dashboard/DashboardCreditDetailPage"),
);
const CreditPaymentHistoryPage = lazy(
  () => import("./pages/Dashboard/CreditPaymentHistoryPage"),
);
const CreditOrdersPage = lazy(
  () => import("./pages/Dashboard/CreditOrdersPage"),
);
const CreditOrderDetailPage = lazy(
  () => import("./pages/Dashboard/CreditOrderDetailPage"),
);
const ProductsPage = lazy(() => import("./pages/Dashboard/ProductsPage"));
const SalesOrderDetailPage = lazy(
  () => import("./pages/Dashboard/SalesOrderDetailPage"),
);
const ProfilePage = lazy(() => import("./pages/Dashboard/ProfilePage"));

// Shared
const ContactSupportPage = lazy(
  () => import("./pages/Shared/ContactSupportPage"),
);
//page loading
function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      Loading…
    </div>
  );
}
// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ("customer" | "admin" | "sales" | "storekeeper")[];
}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin" || user.role === "sales") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const FREE_DELIVERY_THRESHOLD = 700_000;

function FreeDeliveryWatcher() {
  const items = useCartStore((state) => state.items);
  // Cart prices are VAT-inclusive
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const prevRef = useRef(false);

  useEffect(() => {
    if (isFreeDelivery && !prevRef.current) {
      toast.success("🎉 You unlocked free delivery!", {
        description: `Your order total is above ${FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB — Delivery is on us.`,
        duration: 5000,
      });
    }
    prevRef.current = isFreeDelivery;
  }, [isFreeDelivery]);

  return null;
}

function App() {
  useTokenRefresh();

  return (
    <>
      <FreeDeliveryWatcher />
      <Toaster
        closeButton
        position="top-right"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #E5E7EB",
            color: "#1F2937",
          },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/account-inactive" element={<ContactSupportPage />} />

          {/* Public Customer Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* Protected Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders/:orderId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerOrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/credits/:creditId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerCreditDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/credits/:creditId/payments"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerCreditPaymentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes - Admin & Sales */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <DashboardHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customers"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders/:orderId"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <SalesOrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/credit-orders"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <CreditOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/credit-orders/:orderId"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <CreditOrderDetailPage />
              </ProtectedRoute>
            }
          />
          {/* <Route
          path="/dashboard/store-orders"
          element={
            <ProtectedRoute allowedRoles={["admin", "storekeeper"]}>
              <StoreOrdersPage />
            </ProtectedRoute>
          }
        /> */}
          {/* <Route
          path="/dashboard/store-orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={["admin", "storekeeper"]}>
              <StoreOrderDetailPage />
            </ProtectedRoute>
          }
        /> */}
          <Route
            path="/dashboard/credit"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <CreditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/credit/:creditId"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <DashboardCreditDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/credit/:creditId/payments"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <CreditPaymentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders/:orderId/credit"
            element={
              <ProtectedRoute allowedRoles={["admin", "sales"]}>
                <OrderCreditDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/employees"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/products/:productId/variants/:variantId/discounts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <VariantDiscountsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/products/:productId/detail"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProductDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

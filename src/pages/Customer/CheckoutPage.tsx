import Header from "../../components/shared/Header";
import { CheckoutSummary } from "../../components/Customer/checkout/CheckoutSummary";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/shared/ui/button";
import { MapPin, User, Mail, Truck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { PaymentModal } from "@/components/Customer/checkout/PaymentModal";

function CheckoutPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotalPrice)();
  const user = useAuthStore((state) => state.user);

  const FREE_DELIVERY_THRESHOLD = 700_000;
  // Cart prices are VAT-inclusive
  const total = subtotal;
  const isFreeDelivery = total >= FREE_DELIVERY_THRESHOLD;

  const handlePlaceOrder = () => setPaymentOpen(true);

  const handleOrderPlaced = () => {
    navigate("/customer/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onSearch={(q) => setSearchQuery(q)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-4 py-4 space-y-2">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-brown-700 hover:text-brown-900 hover:bg-brown-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-brown-900">Checkout</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Review your order details before confirming
          </p>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center text-slate-500">
            Your cart is empty — add some products first.
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left — delivery & confirm */}
            <div className="lg:col-span-3 space-y-4">
              {/* Delivery info card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-yellow-600" />
                  <h2 className="text-sm font-semibold text-slate-800">
                    Delivery Information
                  </h2>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Full Name</p>
                      <p className="text-sm font-medium text-slate-800">
                        {user?.userName ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-800">
                        {user?.userName ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Delivery Address</p>
                      <p className="text-sm font-medium text-slate-800">
                        Bole, Addis Ababa
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Fetched from your profile
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery fee note */}
              {isFreeDelivery ? (
                <div className="flex items-start gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
                  <Truck className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
                  <span>
                    <span className="font-semibold">Free delivery!</span> Your
                    order qualifies for free delivery.
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-3 px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-yellow-800">
                  <Truck className="h-4 w-4 mt-0.5 shrink-0 text-yellow-600" />
                  <span>
                    Delivery Not Available Spend{" "}
                    <span className="font-semibold">
                      {FREE_DELIVERY_THRESHOLD.toLocaleString()} ETB
                    </span>{" "}
                    or more to get free delivery.
                  </span>
                </div>
              )}

              {/* Place order button */}
              <Button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold py-6 text-base rounded-xl"
              >
                Place Order
              </Button>
            </div>

            {/* Right — order summary */}
            <div className="lg:col-span-2">
              <CheckoutSummary />
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        total={total}
        onOrderPlaced={handleOrderPlaced}
      />
    </div>
  );
}

export default CheckoutPage;

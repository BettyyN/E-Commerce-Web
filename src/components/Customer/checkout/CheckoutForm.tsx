import { Button } from "@/components/shared/ui/button";
import { useCartStore } from "@/store/cartStore";

interface CheckoutFormProps {
  onSuccess: () => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const clearCart = useCartStore((state) => state.clearCart);

  const handlePlaceOrder = () => {
    clearCart();
    onSuccess();
  };

  return (
    <div className="flex justify-center">
      <Button
        onClick={handlePlaceOrder}
        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 font-semibold px-12 py-3 text-base"
      >
        Place Order
      </Button>
    </div>
  );
}

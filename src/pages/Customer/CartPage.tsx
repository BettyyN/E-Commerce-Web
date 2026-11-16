import Header from "../../components/shared/Header";
import { CartItems } from "../../components/Customer/cart/CartItems";
import { CartSummary } from "../../components/Customer/cart/CartSummary";
import { useState } from "react";

function CartPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <Header
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-brown-900 mb-8">
          Ordering Cart
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

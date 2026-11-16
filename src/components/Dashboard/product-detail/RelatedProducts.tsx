import { Card, CardContent, CardFooter } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Tag } from "lucide-react";

export function RelatedProducts() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const products = [
    {
      id: 2,
      name: "Natural Wellness Item",
      price: 24.99,
      image: "/14-600x600-removebg-preview.png",
      category: "Wellness",
      discount: 15,
    },
    {
      id: 3,
      name: "Eco-Friendly Product",
      price: 19.99,
      image: "/5-1-600x800-removebg-preview.png",
      category: "Eco",
      discount: 20,
    },
    {
      id: 4,
      name: "Premium Quality Item",
      price: 34.99,
      image: "/71slAAUyxDL._SL1500_-removebg-preview.png",
      category: "Premium",
    },
    {
      id: 5,
      name: "Organic Essential",
      price: 29.99,
      image: "/BD4rYo15QcJxpng-optimized-removebg-preview.png",
      category: "Organic",
      discount: 10,
    },
  ];

  const handleAddToCart = (
    product: (typeof products)[0],
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    addItem({
      variantId: `mock-${product.id}`,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: -1,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-brown-900 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <Card
            key={product.id}
            className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Gradient border effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 via-brown-400 to-yellow-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10"></div>

            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-brown-600 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-all duration-500 group-hover:duration-300 -z-20"></div>

            {/* Image Section */}
            <div className="h-36 relative overflow-hidden">
              {/* Shine animation overlay */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>

              {/* Product image */}
              <div className="absolute inset-0 bg-brown-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brown-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="relative">
                      {/* Animated pulse effect */}
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>

                      {/* Main badge */}
                      <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">
                          {product.discount}% OFF
                        </span>
                      </div>

                      {/* Ribbon tail effect */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-red-600"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-white/90 backdrop-blur-sm text-brown-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm group-hover:bg-yellow-100 group-hover:scale-110 transition-all duration-300">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <CardContent className="relative z-10 p-4">
              <h3 className="font-bold text-brown-900 text-sm line-clamp-2 min-h-[2.5rem] transition-all duration-300">
                {product.name}
              </h3>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="p-4 pt-0 relative z-10">
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={(e) => handleAddToCart(product, e)}
                    size="sm"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 rounded-lg text-xs font-semibold py-2 transition-all duration-300 group-hover:shadow-lg hover:scale-[1.02] relative overflow-hidden"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                    <span className="relative z-10 text-xs">Add to cart</span>
                    <ShoppingCart className="ml-1 h-3 w-3 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <div className="text-lg font-bold text-brown-900 transition-all duration-300 group-hover:scale-105 group-hover:text-yellow-700">
                    {product.price.toLocaleString()} ETB
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

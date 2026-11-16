import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";
import { Eye } from "lucide-react";
import { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 5;

export function OrdersTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    {
      id: "#1234",
      customer: "Abebe Kebede",
      items: 3,
      amount: "2,500 ETB",
      status: "completed",
      date: "2024-03-06",
      products: ["Premium Suit", "Dress Shirt", "Tie"],
    },
    {
      id: "#1235",
      customer: "Tigist Alemu",
      items: 2,
      amount: "1,800 ETB",
      status: "pending",
      date: "2024-03-06",
      products: ["Evening Dress", "Handbag"],
    },
    {
      id: "#1236",
      customer: "Dawit Tesfaye",
      items: 5,
      amount: "3,200 ETB",
      status: "processing",
      date: "2024-03-05",
      products: ["Business Suit", "Shoes", "Belt", "Watch", "Cufflinks"],
    },
    {
      id: "#1237",
      customer: "Sara Bekele",
      items: 1,
      amount: "950 ETB",
      status: "completed",
      date: "2024-03-05",
      products: ["Casual Dress"],
    },
    {
      id: "#1238",
      customer: "Yohannes Tadesse",
      items: 4,
      amount: "2,100 ETB",
      status: "pending",
      date: "2024-03-04",
      products: ["Blazer", "Trousers", "Shirt", "Accessories"],
    },
    {
      id: "#1239",
      customer: "Mulugeta Assefa",
      items: 2,
      amount: "1,500 ETB",
      status: "completed",
      date: "2024-03-04",
      products: ["Polo Shirt", "Chinos"],
    },
    {
      id: "#1240",
      customer: "Hanna Girma",
      items: 3,
      amount: "2,200 ETB",
      status: "processing",
      date: "2024-03-03",
      products: ["Formal Dress", "Heels", "Jewelry"],
    },
    {
      id: "#1241",
      customer: "Yared Mekonnen",
      items: 6,
      amount: "4,100 ETB",
      status: "completed",
      date: "2024-03-03",
      products: [
        "Tuxedo",
        "Dress Shirt",
        "Bow Tie",
        "Cummerbund",
        "Shoes",
        "Cufflinks",
      ],
    },
  ];

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return orders.slice(startIndex, endIndex);
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  return (
    <>
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brown-200">
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-brown-100 hover:bg-brown-50"
                >
                  <td className="py-3 px-4 text-brown-900">{order.id}</td>
                  <td className="py-3 px-4 text-brown-700">{order.customer}</td>
                  <td className="py-3 px-4 text-brown-700">{order.items}</td>
                  <td className="py-3 px-4 text-brown-900">{order.amount}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-brown-600">{order.date}</td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(order)}
                      className="border-brown-300 text-brown-700 hover:bg-yellow-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={orders.length}
        />
      </Card>

      {/* Order View Modal */}
      {viewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-brown-900 mb-4">
              Order Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-brown-600">Order ID:</span>
                <span className="font-medium text-brown-900">
                  {selectedOrder.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-600">Customer:</span>
                <span className="font-medium text-brown-900">
                  {selectedOrder.customer}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-600">Total Items:</span>
                <span className="font-medium text-brown-900">
                  {selectedOrder.items}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-600">Amount:</span>
                <span className="font-medium text-brown-900">
                  {selectedOrder.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-600">Status:</span>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-brown-600">Date:</span>
                <span className="font-medium text-brown-900">
                  {selectedOrder.date}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-brown-600 block mb-2">Products:</span>
                <ul className="list-disc list-inside space-y-1">
                  {selectedOrder.products.map(
                    (product: string, index: number) => (
                      <li key={index} className="text-sm text-brown-700">
                        {product}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setViewModalOpen(false)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

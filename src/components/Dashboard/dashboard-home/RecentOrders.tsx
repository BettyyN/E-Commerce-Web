import { useState, useMemo } from "react";
import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { Pagination } from "@/components/shared/ui/pagination";

const ITEMS_PER_PAGE = 5;

export function RecentOrders() {
  const [currentPage, setCurrentPage] = useState(1);

  const orders = [
    {
      id: "#1234",
      customer: "Abebe Kebede",
      amount: "2,500 ETB",
      status: "completed",
      date: "2024-03-06",
    },
    {
      id: "#1235",
      customer: "Tigist Alemu",
      amount: "1,800 ETB",
      status: "pending",
      date: "2024-03-06",
    },
    {
      id: "#1236",
      customer: "Dawit Tesfaye",
      amount: "3,200 ETB",
      status: "processing",
      date: "2024-03-05",
    },
    {
      id: "#1237",
      customer: "Sara Bekele",
      amount: "950 ETB",
      status: "completed",
      date: "2024-03-05",
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

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-brown-900 mb-4">Recent Orders</h2>
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
                Amount
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Status
              </th>
              <th className="text-left py-3 px-4 text-brown-700 font-semibold">
                Date
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
                <td className="py-3 px-4 text-brown-900">{order.amount}</td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-brown-600">{order.date}</td>
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
  );
}

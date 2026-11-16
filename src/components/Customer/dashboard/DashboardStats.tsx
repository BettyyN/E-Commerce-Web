import { Card } from "@/components/shared/ui/card";
import { Package, CreditCard, Wallet } from "lucide-react";
import type { MyOrdListDto } from "@/types/myOrder";
import type { MyCrdtListDto } from "@/types/myCredit";
import { parseMoney } from "@/lib/format";
import { formatETB } from "@/lib/utils";

interface Props {
  orders: MyOrdListDto[];
  credits: MyCrdtListDto[];
}

export function DashboardStats({ orders, credits }: Props) {
  const totalCredit = credits.reduce(
    (sum, c) => sum + parseMoney(c.remain),
    0,
  );
  const totalSpent = orders.reduce((sum, o) => sum + parseMoney(o.amount), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brown-600 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-brown-900 mt-2">
              {orders.length.toLocaleString()}
            </p>
          </div>
          <Package className="h-12 w-12 text-yellow-600" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brown-600 text-sm font-medium">
              Outstanding Credit
            </p>
            <p className="text-3xl font-bold text-brown-900 mt-2">
              {formatETB(totalCredit)} ETB
            </p>
          </div>
          <CreditCard className="h-12 w-12 text-green-600" />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-brown-600 text-sm font-medium">Total Spent</p>
            <p className="text-3xl font-bold text-brown-900 mt-2">
              {formatETB(totalSpent)} ETB
            </p>
          </div>
          <Wallet className="h-12 w-12 text-blue-600" />
        </div>
      </Card>
    </div>
  );
}

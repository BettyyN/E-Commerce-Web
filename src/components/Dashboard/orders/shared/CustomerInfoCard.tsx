import { Card } from "@/components/shared/ui/card";
import { Mail, Phone, User } from "lucide-react";

interface CustomerInfoCardProps {
  fullName: string;
  email: string;
  phoneNum: string;
  tin?: string;
}

export function CustomerInfoCard({
  fullName,
  email,
  phoneNum,
  tin,
}: CustomerInfoCardProps) {
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-brown-400" />
        <p className="text-sm font-semibold text-brown-800">
          Customer Information
        </p>
      </div>
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brown-900 text-sm">{fullName}</p>
          <div className="mt-1.5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1 gap-x-4">
            <div className="flex items-center gap-2 text-xs text-brown-500">
              <Mail className="h-3 w-3 text-brown-300 shrink-0" />
              {email}
            </div>
            <div className="flex items-center gap-2 text-xs text-brown-500">
              <Phone className="h-3 w-3 text-brown-300 shrink-0" />
              {phoneNum}
            </div>
            {tin && <div className="text-xs text-brown-500">TIN: {tin}</div>}
          </div>
        </div>
      </div>
    </Card>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/ui/dialog";
import { Badge } from "@/components/shared/ui/badge";
import { Mail, Phone, Calendar, Briefcase, Activity } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  joinDate: string;
}

interface ViewEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function ViewEmployeeModal({
  open,
  onOpenChange,
  employee,
}: ViewEmployeeModalProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            View complete information about this employee.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-brown-900">
                {employee.name}
              </h3>
              <p className="text-sm text-brown-600">
                Employee ID: #{employee.id}
              </p>
            </div>
            <Badge
              className={
                employee.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {employee.status}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-brown-50 rounded-lg">
              <Mail className="h-5 w-5 text-brown-600" />
              <div>
                <p className="text-xs text-brown-600">Email</p>
                <p className="text-sm font-medium text-brown-900">
                  {employee.email}
                </p>
              </div>
            </div>

            {employee.phone && (
              <div className="flex items-center gap-3 p-3 bg-brown-50 rounded-lg">
                <Phone className="h-5 w-5 text-brown-600" />
                <div>
                  <p className="text-xs text-brown-600">Phone</p>
                  <p className="text-sm font-medium text-brown-900">
                    {employee.phone}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-brown-50 rounded-lg">
              <Briefcase className="h-5 w-5 text-brown-600" />
              <div>
                <p className="text-xs text-brown-600">Role</p>
                <p className="text-sm font-medium text-brown-900">
                  {employee.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-brown-50 rounded-lg">
              <Calendar className="h-5 w-5 text-brown-600" />
              <div>
                <p className="text-xs text-brown-600">Join Date</p>
                <p className="text-sm font-medium text-brown-900">
                  {employee.joinDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-brown-50 rounded-lg">
              <Activity className="h-5 w-5 text-brown-600" />
              <div>
                <p className="text-xs text-brown-600">Status</p>
                <p className="text-sm font-medium text-brown-900 capitalize">
                  {employee.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

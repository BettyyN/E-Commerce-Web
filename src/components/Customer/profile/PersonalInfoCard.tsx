import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Mail, Phone, MapPin, Edit, KeyRound, Loader2 } from "lucide-react";

interface PersonalInfoCardProps {
  email?: string;
  phoneNum?: string;
  fullName?: string;
  isLoading: boolean;
  onEdit: () => void;
  onChangePassword: () => void;
}

export function PersonalInfoCard({
  email,
  phoneNum,
  fullName,
  isLoading,
  onEdit,
  onChangePassword,
}: PersonalInfoCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-brown-900">
          Personal Information
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onChangePassword}
            className="border-brown-300 text-brown-700 hover:bg-yellow-50"
          >
            <KeyRound className="h-4 w-4 mr-2" /> Change Password
          </Button>
          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-brown-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          <div className="flex items-center gap-4 pb-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50">
              <Mail className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-900">
                {email ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50">
              <Phone className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm font-medium text-slate-900">
                {phoneNum ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50">
              <MapPin className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Full Name</p>
              <p className="text-sm font-medium text-slate-900">
                {fullName ?? "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

import { useState, useEffect } from "react";
import { Card } from "@/components/shared/ui/card";
import { Badge } from "@/components/shared/ui/badge";
import { Button } from "@/components/shared/ui/button";
import { Package, CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/shared/Header";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import {
  useModifyCustomer,
  useCustomer,
} from "@/service/customer/customer.queries";
import { useChangePassword } from "@/service/user/user.queries";
import { ProfileHeader } from "@/components/Customer/profile/ProfileHeader";
import { PersonalInfoCard } from "@/components/Customer/profile/PersonalInfoCard";
import { EditProfileModal } from "@/components/Customer/profile/EditProfileModal";
import { ChangePasswordModal } from "@/components/Customer/profile/ChangePasswordModal";
import { ProfilePageSkeleton } from "@/components/shared/PageSkeleton";

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const customerId = user?.profileId ?? "";

  const { data: customer, isLoading } = useCustomer(customerId);
  const modifyCustomer = useModifyCustomer();
  const changePassword = useChangePassword();

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState({
    fullName: "",
    email: "",
    phoneNum: "",
    tin: "",
  });

  useEffect(() => {
    if (customer)
      setDraft({
        fullName: customer.fullName,
        email: customer.email,
        phoneNum: customer.phoneNum,
        tin: customer.tin ?? "",
      });
  }, [customer]);

  const openEdit = () => {
    if (customer)
      setDraft({
        fullName: customer.fullName,
        email: customer.email,
        phoneNum: customer.phoneNum,
        tin: customer.tin ?? "",
      });
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    if (
      !draft.fullName.trim() ||
      !draft.email.trim() ||
      !draft.phoneNum.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    try {
      const message = await modifyCustomer.mutateAsync({
        id: customerId,
        payload: { id: customerId, ...draft },
      });
      toast.success(message ?? "Profile updated successfully");
      setEditOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwd, setPwd] = useState({ oldPwd: "", newPwd: "", confirm: "" });

  const handleChangePassword = async () => {
    if (!pwd.oldPwd || !pwd.newPwd || !pwd.confirm) {
      toast.error("All fields are required");
      return;
    }
    if (pwd.newPwd !== pwd.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (pwd.newPwd.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      const message = await changePassword.mutateAsync({
        oldPwd: pwd.oldPwd,
        newPwd: pwd.newPwd,
      });
      toast.success(message ?? "Password changed successfully");
      setPwdOpen(false);
      setPwd({ oldPwd: "", newPwd: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    }
  };

  const displayName = customer?.fullName ?? user?.userName ?? "—";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brown-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <ProfilePageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-50">
      <Header />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-brown-700 hover:text-brown-900 hover:bg-brown-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <ProfileHeader displayName={displayName} />

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brown-900">
            Shopping Activity
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card className="p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Orders</span>
                <Package className="h-4 w-4 text-brown-600" />
              </div>
              <div className="text-2xl font-bold text-brown-900 mt-1">—</div>
            </Card>
            <Card className="p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Total Spent</span>
                <CreditCard className="h-4 w-4 text-brown-600" />
              </div>
              <div className="text-2xl font-bold text-brown-900 mt-1">—</div>
            </Card>
            <Card className="p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Status</span>
              </div>
              <Badge
                className={`mt-1 ${customer?.status === "Active" ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}
              >
                {customer?.status ?? "—"}
              </Badge>
            </Card>
          </div>
        </div>

        <PersonalInfoCard
          email={customer?.email}
          phoneNum={customer?.phoneNum}
          fullName={customer?.fullName}
          isLoading={isLoading}
          onEdit={openEdit}
          onChangePassword={() => setPwdOpen(true)}
        />
      </div>

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        draft={draft}
        onChange={setDraft}
        onSave={handleSaveProfile}
        isPending={modifyCustomer.isPending}
      />

      <ChangePasswordModal
        open={pwdOpen}
        onOpenChange={(v) => {
          setPwdOpen(v);
          if (!v) setPwd({ oldPwd: "", newPwd: "", confirm: "" });
        }}
        pwd={pwd}
        onChange={setPwd}
        onSave={handleChangePassword}
        isPending={changePassword.isPending}
      />
    </div>
  );
}

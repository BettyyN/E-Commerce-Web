import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/shared/ui/modal";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pwd: { oldPwd: string; newPwd: string; confirm: string };
  onChange: (pwd: { oldPwd: string; newPwd: string; confirm: string }) => void;
  onSave: () => void;
  isPending: boolean;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  pwd,
  onChange,
  onSave,
  isPending,
}: ChangePasswordModalProps) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
      }}
    >
      <ModalHeader>
        <ModalTitle>Change Password</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>
              Current Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showOld ? "text" : "password"}
                value={pwd.oldPwd}
                onChange={(e) => onChange({ ...pwd, oldPwd: e.target.value })}
                placeholder="Enter current password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showOld ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>
              New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={pwd.newPwd}
                onChange={(e) => onChange({ ...pwd, newPwd: e.target.value })}
                placeholder="At least 6 characters"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              value={pwd.confirm}
              onChange={(e) => onChange({ ...pwd, confirm: e.target.value })}
              placeholder="Repeat new password"
            />
            {pwd.confirm && pwd.newPwd !== pwd.confirm && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="border-brown-300 text-brown-700"
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={isPending}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Changing…
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

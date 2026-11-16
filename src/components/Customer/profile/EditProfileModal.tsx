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
import { Loader2 } from "lucide-react";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: { fullName: string; email: string; phoneNum: string; tin: string };
  onChange: (draft: {
    fullName: string;
    email: string;
    phoneNum: string;
    tin: string;
  }) => void;
  onSave: () => void;
  isPending: boolean;
}

export function EditProfileModal({
  open,
  onOpenChange,
  draft,
  onChange,
  onSave,
  isPending,
}: EditProfileModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Edit Profile</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={draft.fullName}
              onChange={(e) => onChange({ ...draft, fullName: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              value={draft.email}
              onChange={(e) => onChange({ ...draft, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              value={draft.phoneNum}
              onChange={(e) => onChange({ ...draft, phoneNum: e.target.value })}
              placeholder="+251 9xx xxx xxx"
            />
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
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

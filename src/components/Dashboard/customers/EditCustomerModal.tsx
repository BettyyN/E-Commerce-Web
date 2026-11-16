import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/shared/ui/modal";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { toast } from "sonner";
import {
  customerModSchema,
  type CustomerModFormValues,
} from "@/schemas/customerSchema";
import { useModifyCustomer } from "@/service/customer/customer.queries";
import type { CustomerListDto } from "@/types/customer";

interface EditCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerListDto | null;
}

export function EditCustomerModal({
  open,
  onOpenChange,
  customer,
}: EditCustomerModalProps) {
  const modifyCustomer = useModifyCustomer();

  const form = useForm<CustomerModFormValues>({
    resolver: zodResolver(customerModSchema),
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        fullName: customer.fullName,
        email: customer.email,
        phoneNum: customer.phoneNum,
        tin: customer.tin ?? "",
      });
    }
  }, [customer, form]);

  const onSubmit = async (data: CustomerModFormValues) => {
    if (!customer) return;
    try {
      const message = await modifyCustomer.mutateAsync({
        id: customer.id,
        payload: { id: customer.id, ...data },
      });
      toast.success(message ?? "Customer updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update customer",
      );
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Edit Customer</ModalTitle>
      </ModalHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input {...form.register("fullName")} />
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input {...form.register("email")} type="email" />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input {...form.register("phoneNum")} type="tel" />
              {form.formState.errors.phoneNum && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.phoneNum.message}
                </p>
              )}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>TIN Number</Label>
              <Input
                {...form.register("tin")}
                placeholder="0123456789"
                inputMode="numeric"
              />
              {form.formState.errors.tin && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.tin.message}
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-brown-300 text-brown-700 hover:bg-yellow-50 px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={modifyCustomer.isPending}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6"
          >
            {modifyCustomer.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui/select";
import { toast } from "sonner";
import {
  employeeAddSchema,
  type EmployeeAddFormValues,
} from "@/schemas/employeeSchema";
import { useAddEmployee } from "@/service/employee/employee.queries";
import { useRoles } from "@/service/role/role.queries";

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeModal({
  open,
  onOpenChange,
}: AddEmployeeModalProps) {
  const addEmployee = useAddEmployee();
  const { data: roles = [] } = useRoles();

  const form = useForm<EmployeeAddFormValues>({
    resolver: zodResolver(employeeAddSchema),
    defaultValues: { fullName: "", email: "", password: "", roleId: "" },
  });

  const onSubmit = async (data: EmployeeAddFormValues) => {
    try {
      const message = await addEmployee.mutateAsync(data);
      toast.success(message ?? "Employee added");
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add employee");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
    >
      <ModalHeader>
        <ModalTitle>Add New Employee</ModalTitle>
      </ModalHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Full Name</Label>
              <Input
                {...form.register("fullName")}
                placeholder="Enter full name"
              />
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="employee@elutrading.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input
                {...form.register("password")}
                type="password"
                placeholder="Min 6 characters"
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Role</Label>
              <Select
                value={form.watch("roleId")}
                onValueChange={(v) => form.setValue("roleId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.roleId && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.roleId.message}
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
            disabled={addEmployee.isPending}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6"
          >
            {addEmployee.isPending ? "Adding…" : "Add Employee"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

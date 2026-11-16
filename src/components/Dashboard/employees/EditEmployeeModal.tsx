import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/shared/ui/modal';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { toast } from 'sonner';
import { employeeModSchema, type EmployeeModFormValues } from '@/schemas/employeeSchema';
import { useUpdateEmployee } from '@/service/employee/employee.queries';
import type { EmployeeListDto } from '@/types/employee';

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeListDto | null;
}

export function EditEmployeeModal({ open, onOpenChange, employee }: EditEmployeeModalProps) {
  const updateEmployee = useUpdateEmployee();

  const form = useForm<EmployeeModFormValues>({
    resolver: zodResolver(employeeModSchema),
  });

  useEffect(() => {
    if (employee) {
      form.reset({ fullName: employee.fullName, email: employee.email });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeModFormValues) => {
    if (!employee) return;
    try {
      const message = await updateEmployee.mutateAsync({
        id: employee.id,
        payload: { id: employee.id, ...data },
      });
      toast.success(message ?? 'Employee updated');
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update employee');
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Edit Employee</ModalTitle>
      </ModalHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input {...form.register('fullName')} />
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input {...form.register('email')} type="email" />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-brown-300 text-brown-700 hover:bg-yellow-50 px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={updateEmployee.isPending} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6">
            {updateEmployee.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

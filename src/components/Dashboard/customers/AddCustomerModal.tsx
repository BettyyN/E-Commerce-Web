import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@/components/shared/ui/modal';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { toast } from 'sonner';
import { customerAddSchema, type CustomerAddFormValues } from '@/schemas/customerSchema';
import { useAddCustomer } from '@/service/customer/customer.queries';

interface AddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCustomerModal({ open, onOpenChange }: AddCustomerModalProps) {
  const addCustomer = useAddCustomer();

  const form = useForm<CustomerAddFormValues>({
    resolver: zodResolver(customerAddSchema),
    defaultValues: { fullName: '', email: '', phoneNum: '', tin: '', password: '' },
  });

  const onSubmit = async (data: CustomerAddFormValues) => {
    try {
      const message = await addCustomer.mutateAsync(data);
      toast.success(message ?? 'Customer added');
      form.reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add customer');
    }
  };

  return (
    <Modal open={open} onOpenChange={open => { if (!open) { form.reset(); } onOpenChange(open); }}>
      <ModalHeader>
        <ModalTitle>Add New Customer</ModalTitle>
      </ModalHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input {...form.register('fullName')} placeholder="Abebe Kebede" />
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input {...form.register('email')} type="email" placeholder="abebe@example.com" />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input {...form.register('phoneNum')} type="tel" placeholder="+251 911 234 567" />
              {form.formState.errors.phoneNum && (
                <p className="text-xs text-red-500">{form.formState.errors.phoneNum.message}</p>
              )}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>TIN Number</Label>
              <Input {...form.register('tin')} placeholder="0123456789" inputMode="numeric" />
              {form.formState.errors.tin && (
                <p className="text-xs text-red-500">{form.formState.errors.tin.message}</p>
              )}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>
                Password <span className="text-red-500">*</span>
              </Label>
              <Input {...form.register('password')} type="password" placeholder="Min 6 characters" />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-brown-300 text-brown-700 hover:bg-yellow-50 px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={addCustomer.isPending} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900 px-6">
            {addCustomer.isPending ? 'Adding…' : 'Add Customer'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
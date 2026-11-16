import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useChangeEmployeeStatus } from '@/service/employee/employee.queries';
import { toast } from 'sonner';
import type { EmployeeListDto } from '@/types/employee';

interface ActivationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeListDto | null;
}

export default function ActivationModal({ open, onOpenChange, employee }: ActivationModalProps) {
  const changeStatus = useChangeEmployeeStatus();
  const activate = employee ? employee.status !== 'Active' : false;

  const handleConfirm = async () => {
    if (!employee) return;
    try {
      const message = await changeStatus.mutateAsync({
        id: employee.id,
        stat: activate,
      });
      toast.success(message ?? `${employee.fullName} ${activate ? 'activated' : 'deactivated'}`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activate ? 'bg-green-100' : 'bg-red-100'}`}>
              {activate
                ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                : <AlertTriangle className="h-5 w-5 text-red-600" />
              }
            </div>
            <DialogTitle>{activate ? 'Activate Account' : 'Deactivate Account'}</DialogTitle>
          </div>
          <DialogDescription className="pt-3">
            {activate
              ? `Are you sure you want to activate ${employee?.fullName}? They will regain access to the system.`
              : `Are you sure you want to deactivate ${employee?.fullName}? They will lose access until reactivated.`
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 ">
          <div className="flex w-full justify-end gap-3">

          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={changeStatus.isPending}
            className={activate ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
          >
            {changeStatus.isPending ? 'Saving…' : activate ? 'Activate' : 'Deactivate'}
          </Button></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

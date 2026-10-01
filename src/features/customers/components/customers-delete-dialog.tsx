import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerName: string
  onConfirm: () => void
}

export function CustomersDeleteDialog({
  open,
  onOpenChange,
  customerName,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف مشتری</DialogTitle>
        </DialogHeader>

        <p className='text-sm text-muted-foreground'>
          آیا از حذف مشتری «{customerName}» مطمئن هستید
        </p>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

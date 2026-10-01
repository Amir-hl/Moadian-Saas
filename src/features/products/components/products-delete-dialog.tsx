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
  productName: string
  onConfirm: () => void
}

export function ProductsDeleteDialog({
  open,
  onOpenChange,
  productName,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف کالا</DialogTitle>
        </DialogHeader>

        <p className='text-sm text-muted-foreground'>
          آیا از حذف کالا «{productName}» مطمئن هستید؟
        </p>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
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
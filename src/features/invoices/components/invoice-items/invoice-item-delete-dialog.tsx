import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type { InvoiceItem } from '../../data/schema'

type InvoiceItemDeleteDialogProps = {
  item: InvoiceItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (item: InvoiceItem) => void
}

export function InvoiceItemDeleteDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
}: InvoiceItemDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!item) return

    setIsDeleting(true)

    try {
      onConfirm(item)
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف قلم فاکتور</DialogTitle>

          <DialogDescription>
            آیا از حذف کالای{' '}
            <span className='font-semibold text-foreground'>
              {item?.productName}
            </span>{' '}
            از این فاکتور اطمینان دارید؟
            <br />
            این عملیات قابل بازگشت نیست.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            انصراف
          </Button>

          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting || !item}
          >
            {isDeleting ? 'در حال حذف...' : 'حذف قلم'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
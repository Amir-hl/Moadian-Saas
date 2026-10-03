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

import type { Invoice } from '../data/schema'

type InvoicesDeleteDialogProps = {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (invoice: Invoice) => void
}

export function InvoicesDeleteDialog({
  invoice,
  open,
  onOpenChange,
  onConfirm,
}: InvoicesDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!invoice) return

    setIsDeleting(true)

    try {
      onConfirm(invoice)
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف فاکتور</DialogTitle>

          <DialogDescription>
            آیا از حذف فاکتور شماره{' '}
            <span className='font-semibold text-foreground'>
              {invoice?.invoiceNumber}
            </span>{' '}
            اطمینان دارید؟
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
            disabled={isDeleting || !invoice}
          >
            {isDeleting ? 'در حال حذف...' : 'حذف فاکتور'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
import {
  History,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Send,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Invoice } from '../data/schema'

type InvoicesRowActionsProps = {
  invoice: Invoice
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  onShowHistory: (invoice: Invoice) => void
  onSendToMoadian?: (invoice: Invoice) => void
  onInquireMoadian?: (invoice: Invoice) => void
}

export function InvoicesRowActions({
  invoice,
  onEdit,
  onDelete,
  onShowHistory,
  onSendToMoadian,
  onInquireMoadian,
}: InvoicesRowActionsProps) {
  const canSend = invoice.status === 'draft' || invoice.status === 'rejected' || invoice.status === 'pending'
  const canInquire = invoice.status === 'submitted' || invoice.status === 'pending'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0'
          aria-label='باز کردن منوی عملیات'
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-48'>
        {onSendToMoadian && (
          <DropdownMenuItem
            onClick={() => onSendToMoadian(invoice)}
            disabled={!canSend}
            className='text-primary focus:text-primary font-medium'
          >
            <Send className='me-2 h-4 w-4 text-primary' />
            ارسال به سامانه مودیان
          </DropdownMenuItem>
        )}

        {onInquireMoadian && (
          <DropdownMenuItem
            onClick={() => onInquireMoadian(invoice)}
            disabled={!canInquire}
          >
            <RefreshCw className='me-2 h-4 w-4 text-blue-500' />
            استعلام وضعیت از مودیان
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => onShowHistory(invoice)}>
          <History className='me-2 h-4 w-4' />
          تاریخچه ارسال
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onEdit(invoice)}>
          <Pencil className='me-2 h-4 w-4' />
          ویرایش
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(invoice)}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='me-2 h-4 w-4' />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

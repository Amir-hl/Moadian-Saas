import {
  History,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Invoice } from '../data/schema'

type InvoicesRowActionsProps = {
  invoice: Invoice
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  onShowHistory: (invoice: Invoice) => void
}

export function InvoicesRowActions({
  invoice,
  onEdit,
  onDelete,
  onShowHistory,
}: InvoicesRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0'
          aria-label={'\u0628\u0627\u0632 \u06a9\u0631\u062f\u0646 \u0645\u0646\u0648\u06cc \u0639\u0645\u0644\u06cc\u0627\u062a'}
        >
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(invoice)}>
          <Pencil className='me-2 h-4 w-4' />
          {'\u0648\u06cc\u0631\u0627\u06cc\u0634'}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onShowHistory(invoice)}>
          <History className='me-2 h-4 w-4' />
          {'\u062a\u0627\u0631\u06cc\u062e\u0686\u0647 \u0627\u0631\u0633\u0627\u0644'}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(invoice)}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='me-2 h-4 w-4' />
          {'\u062d\u0630\u0641'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
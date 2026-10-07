import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

import { InvoicesActionDialog } from './components/invoices-action-dialog'
import { InvoicesDeleteDialog } from './components/invoices-delete-dialog'
import { InvoicesTable } from './components/invoices-table'
import type { Invoice } from './data/schema'
import { invoices as initialInvoices } from './data/invoices'

export default function Invoices() {
  const navigate = useNavigate()

  const [data, setData] = useState<Invoice[]>(initialInvoices)

  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [currentRow, setCurrentRow] = useState<Invoice | null>(null)

  const handleAdd = () => {
    setCurrentRow(null)
    setActionDialogOpen(true)
  }

  const handleEdit = (invoice: Invoice) => {
    setCurrentRow(invoice)
    setActionDialogOpen(true)
  }

  const handleDeleteRequest = (invoice: Invoice) => {
    setCurrentRow(invoice)
    setDeleteDialogOpen(true)
  }

  const handleDelete = (invoice: Invoice) => {
    setData((previous) =>
      previous.filter((item) => item.id !== invoice.id)
    )

    setCurrentRow(null)
  }

  const handleSubmit = (invoice: Invoice) => {
    setData((previous) => {
      const exists = previous.some((item) => item.id === invoice.id)

      if (exists) {
        return previous.map((item) =>
          item.id === invoice.id ? invoice : item
        )
      }

      return [invoice, ...previous]
    })

    setCurrentRow(null)
  }

  const handleSelect = (invoice: Invoice) => {
    navigate({
      to: '/invoices/$invoiceId',
      params: {
        invoiceId: invoice.id,
      },
    })
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 md:p-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            فاکتورها
          </h1>

          <p className='text-muted-foreground'>
            مدیریت فاکتورهای فروش
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus className='me-2 h-4 w-4' />
          افزودن فاکتور
        </Button>
      </div>

      <InvoicesTable
        data={data}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onSelect={handleSelect}
      />

      <InvoicesActionDialog
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        currentRow={currentRow}
        onSubmit={handleSubmit}
      />

      <InvoicesDeleteDialog
        invoice={currentRow}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  )
}
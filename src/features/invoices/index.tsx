import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { InvoicesActionDialog } from './components/invoices-action-dialog'
import { InvoicesDeleteDialog } from './components/invoices-delete-dialog'
import { InvoicesTable } from './components/invoices-table'
import { InvoiceSubmissionHistoryDialog } from './components/invoice-submission-history-dialog'
import type { Invoice } from './data/schema'
import { invoices as initialInvoices } from './data/invoices'
import { moadianApi } from './api/moadian-api'

export default function Invoices() {
  const navigate = useNavigate()

  const [data, setData] = useState<Invoice[]>(initialInvoices)

  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)

  const [currentRow, setCurrentRow] = useState<Invoice | null>(null)
  const [historyInvoice, setHistoryInvoice] = useState<Invoice | null>(null)

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

  const handleShowHistory = (invoice: Invoice) => {
    setHistoryInvoice(invoice)
    setHistoryDialogOpen(true)
  }

  const handleSendToMoadian = async (invoice: Invoice) => {
    const toastId = toast.loading(
      `در حال ارسال فاکتور شماره ${invoice.invoiceNumber} به سامانه مودیان...`
    )
    try {
      const res = await moadianApi.submitInvoice(invoice.id)
      if (res.status === 'success') {
        toast.success(res.message || 'فاکتور با موفقیت به سامانه مودیان ارسال شد.', {
          id: toastId,
        })
        setData((prev) =>
          prev.map((item) =>
            item.id === invoice.id
              ? {
                  ...item,
                  status: 'submitted',
                  moadianTaxId: res.tax_invoice_id,
                  moadianReferenceNumber: res.tracking_id,
                  moadianUid: res.tracking_id,
                  submittedAt: new Date(),
                }
              : item
          )
        )
      } else {
        toast.error(
          res.error_message || 'ارسال فاکتور به سامانه مودیان با خطا مواجه شد.',
          { id: toastId }
        )
        setData((prev) =>
          prev.map((item) =>
            item.id === invoice.id
              ? {
                  ...item,
                  status: 'rejected',
                  moadianErrorMessage: res.error_message,
                  moadianErrorCode: res.error_code,
                }
              : item
          )
        )
      }
    } catch (err: unknown) {
      let message = 'خطا در برقراری ارتباط با سرور'
      if (err && typeof err === 'object' && 'response' in err) {
        const anyErr = err as { response?: { data?: { detail?: string } } }
        message = anyErr.response?.data?.detail || message
      }
      toast.error(message, { id: toastId })
    }
  }

  const handleInquireMoadian = async (invoice: Invoice) => {
    const toastId = toast.loading(
      `در حال استعلام وضعیت فاکتور ${invoice.invoiceNumber} از سامانه مودیان...`
    )
    try {
      const res = await moadianApi.inquireInvoice(invoice.id)
      const firstResult = res.results?.[0]
      const statusText = firstResult?.status || 'در حال بررسی'
      toast.success(`وضعیت فاکتور در سامانه مودیان: ${statusText}`, { id: toastId })

      if (['SUCCESS', 'CONFIRMED', 'APPROVED'].includes(statusText)) {
        setData((prev) =>
          prev.map((item) =>
            item.id === invoice.id ? { ...item, status: 'approved' } : item
          )
        )
      } else if (['FAILED', 'REJECTED'].includes(statusText)) {
        setData((prev) =>
          prev.map((item) =>
            item.id === invoice.id ? { ...item, status: 'rejected' } : item
          )
        )
      }
    } catch (err: unknown) {
      let message = 'خطا در استعلام از سامانه مودیان'
      if (err && typeof err === 'object' && 'response' in err) {
        const anyErr = err as { response?: { data?: { detail?: string } } }
        message = anyErr.response?.data?.detail || message
      }
      toast.error(message, { id: toastId })
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 md:p-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            فاکتورها
          </h1>

          <p className='text-muted-foreground'>
            مدیریت فاکتورهای فروش و ارسال به سامانه مودیان
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
        onShowHistory={handleShowHistory}
        onSendToMoadian={handleSendToMoadian}
        onInquireMoadian={handleInquireMoadian}
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

      <InvoiceSubmissionHistoryDialog
        invoice={historyInvoice}
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
      />
    </div>
  )
}

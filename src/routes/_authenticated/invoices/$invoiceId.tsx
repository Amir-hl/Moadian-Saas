import { useState } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

import { InvoiceItemDeleteDialog } from '@/features/invoices/components/invoice-items/invoice-item-delete-dialog'
import { InvoiceItemDialog } from '@/features/invoices/components/invoice-items/invoice-item-dialog'
import { InvoiceItemsTable } from '@/features/invoices/components/invoice-items/invoice-items-table'
import type {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
} from '@/features/invoices/data/schema'
import { invoices } from '@/features/invoices/data/invoices'
import { calculateInvoiceTotals } from '@/features/invoices/utils/invoice-calculations'

export const Route = createFileRoute(
  '/_authenticated/invoices/$invoiceId'
)({
  component: InvoiceDetails,
})

function InvoiceDetails() {
  const { invoiceId } = Route.useParams()

  const initialInvoice = invoices.find(
    (item) => item.id === invoiceId
  )

  const [invoice, setInvoice] = useState<Invoice | null>(
    initialInvoice ?? null
  )

  const [itemDialogOpen, setItemDialogOpen] = useState(false)

  const [currentItem, setCurrentItem] =
    useState<InvoiceItem | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  if (!invoice) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-4 p-6'>
        <h1 className='text-2xl font-bold'>
          فاکتور پیدا نشد
        </h1>

        <p className='text-muted-foreground'>
          فاکتور موردنظر وجود ندارد یا حذف شده است.
        </p>

        <Button asChild>
          <Link to='/invoices'>
            <ArrowRight className='me-2 h-4 w-4' />
            بازگشت به فاکتورها
          </Link>
        </Button>
      </div>
    )
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('fa-IR').format(value)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('fa-IR').format(date)

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft':
        return 'پیش‌نویس'
      case 'pending':
        return 'در انتظار ارسال'
      case 'submitted':
        return 'ارسال شده'
      case 'approved':
        return 'تأیید شده'
      case 'rejected':
        return 'رد شده'
      case 'cancelled':
        return 'لغو شده'
    }
  }

  const handleAddItem = () => {
    setCurrentItem(null)
    setItemDialogOpen(true)
  }

  const handleEditItem = (item: InvoiceItem) => {
    setCurrentItem(item)
    setItemDialogOpen(true)
  }

  const handleDeleteRequest = (item: InvoiceItem) => {
    setCurrentItem(item)
    setDeleteDialogOpen(true)
  }

  const handleSubmitItem = (item: InvoiceItem) => {
    setInvoice((previous) => {
      if (!previous) return previous

      const exists = previous.items.some(
        (current) => current.id === item.id
      )

      const updatedItems = exists
        ? previous.items.map((current) =>
            current.id === item.id ? item : current
          )
        : [...previous.items, item]

      const totals = calculateInvoiceTotals(updatedItems)

      return {
        ...previous,
        items: updatedItems,
        ...totals,
        updatedAt: new Date(),
      }
    })

    setCurrentItem(null)
  }

  const handleDeleteItem = (item: InvoiceItem) => {
    setInvoice((previous) => {
      if (!previous) return previous

      const updatedItems = previous.items.filter(
        (current) => current.id !== item.id
      )

      const totals = calculateInvoiceTotals(updatedItems)

      return {
        ...previous,
        items: updatedItems,
        ...totals,
        updatedAt: new Date(),
      }
    })

    setCurrentItem(null)
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 md:p-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='mb-2 flex items-center gap-2'>
            <Button asChild variant='ghost' size='sm'>
              <Link to='/invoices'>
                <ArrowRight className='me-2 h-4 w-4' />
                بازگشت
              </Link>
            </Button>
          </div>

          <h1 className='text-2xl font-bold tracking-tight'>
            فاکتور شماره {invoice.invoiceNumber}
          </h1>

          <p className='text-muted-foreground'>
            جزئیات و اقلام فاکتور
          </p>
        </div>

        <Button onClick={handleAddItem}>
          <Plus className='me-2 h-4 w-4' />
          افزودن قلم
        </Button>
      </div>

      <div className='rounded-lg border bg-card p-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <p className='text-sm text-muted-foreground'>
              شماره فاکتور
            </p>

            <p className='mt-1 font-medium'>
              {invoice.invoiceNumber}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>
              تاریخ
            </p>

            <p className='mt-1 font-medium'>
              {formatDate(invoice.date)}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>
              مشتری
            </p>

            <p className='mt-1 font-medium'>
              {invoice.customerName}
            </p>
          </div>

          <div>
            <p className='text-sm text-muted-foreground'>
              وضعیت
            </p>

            <p className='mt-1 font-medium'>
              {getStatusLabel(invoice.status)}
            </p>
          </div>
        </div>

        {invoice.description && (
          <div className='mt-6 border-t pt-6'>
            <p className='text-sm text-muted-foreground'>
              توضیحات
            </p>

            <p className='mt-1'>
              {invoice.description}
            </p>
          </div>
        )}
      </div>

      <div className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold'>
            اقلام فاکتور
          </h2>

          <p className='text-sm text-muted-foreground'>
            کالاها و خدمات ثبت‌شده در این فاکتور
          </p>
        </div>

        <InvoiceItemsTable
          items={invoice.items}
          onEdit={handleEditItem}
          onDelete={handleDeleteRequest}
        />
      </div>

      <div className='flex justify-end'>
        <div className='w-full rounded-lg border bg-card p-6 sm:max-w-md'>
          <div className='space-y-3'>
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>
                جمع جزء
              </span>

              <span>
                {formatNumber(invoice.subtotal)} ریال
              </span>
            </div>

            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>
                تخفیف
              </span>

              <span>
                {formatNumber(invoice.discount)} ریال
              </span>
            </div>

            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>
                مبلغ مشمول مالیات
              </span>

              <span>
                {formatNumber(invoice.taxableAmount)} ریال
              </span>
            </div>

            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>
                مالیات
              </span>

              <span>
                {formatNumber(invoice.tax)} ریال
              </span>
            </div>

            <div className='border-t pt-3'>
              <div className='flex justify-between gap-4 text-lg font-bold'>
                <span>مبلغ نهایی</span>

                <span>
                  {formatNumber(invoice.total)} ریال
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        currentItem={currentItem}
        onSubmit={handleSubmitItem}
      />

      <InvoiceItemDeleteDialog
        item={currentItem}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteItem}
      />
    </div>
  )
}
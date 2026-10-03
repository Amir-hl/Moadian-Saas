import { useEffect, useState } from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import type { Invoice, InvoiceStatus } from '../data/schema'

type InvoicesActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Invoice | null
  onSubmit: (invoice: Invoice) => void
}

type InvoiceForm = {
  invoiceNumber: string
  date: string
  customerId: string
  customerName: string
  description: string
  status: InvoiceStatus
}

const emptyForm: InvoiceForm = {
  invoiceNumber: '',
  date: new Date().toISOString().slice(0, 10),
  customerId: '',
  customerName: '',
  description: '',
  status: 'draft',
}

export function InvoicesActionDialog({
  open,
  onOpenChange,
  currentRow,
  onSubmit,
}: InvoicesActionDialogProps) {
  const [form, setForm] = useState<InvoiceForm>(emptyForm)

  const isEdit = Boolean(currentRow)

  useEffect(() => {
    if (!open) return

    if (currentRow) {
      setForm({
        invoiceNumber: currentRow.invoiceNumber,
        date: currentRow.date.toISOString().slice(0, 10),
        customerId: currentRow.customerId,
        customerName: currentRow.customerName,
        description: currentRow.description ?? '',
        status: currentRow.status,
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, currentRow])

  const updateField = <K extends keyof InvoiceForm>(
    field: K,
    value: InvoiceForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const now = new Date()

    const invoice: Invoice = {
      id: currentRow?.id ?? `inv-${Date.now()}`,
      invoiceNumber: form.invoiceNumber,
      date: new Date(form.date),
      customerId: form.customerId,
      customerName: form.customerName,
      description: form.description || undefined,

      items: currentRow?.items ?? [],

      subtotal: currentRow?.subtotal ?? 0,
      discount: currentRow?.discount ?? 0,
      tax: currentRow?.tax ?? 0,
      total: currentRow?.total ?? 0,

      status: form.status,

      createdAt: currentRow?.createdAt ?? now,
      updatedAt: now,
    }

    onSubmit(invoice)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'ویرایش فاکتور' : 'افزودن فاکتور'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='invoiceNumber'>شماره فاکتور</Label>

              <Input
                id='invoiceNumber'
                value={form.invoiceNumber}
                onChange={(event) =>
                  updateField('invoiceNumber', event.target.value)
                }
                placeholder='مثلاً 1003'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='date'>تاریخ</Label>

              <div className='relative'>
                <CalendarIcon className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />

                <Input
                  id='date'
                  type='date'
                  value={form.date}
                  onChange={(event) =>
                    updateField('date', event.target.value)
                  }
                  className='ps-9'
                  required
                />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='customerId'>شناسه مشتری</Label>

              <Input
                id='customerId'
                value={form.customerId}
                onChange={(event) =>
                  updateField('customerId', event.target.value)
                }
                placeholder='مثلاً customer-001'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='customerName'>نام مشتری</Label>

              <Input
                id='customerName'
                value={form.customerName}
                onChange={(event) =>
                  updateField('customerName', event.target.value)
                }
                placeholder='نام مشتری'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label>وضعیت</Label>

            <Select
              value={form.status}
              onValueChange={(value) =>
                updateField('status', value as InvoiceStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='انتخاب وضعیت' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='draft'>پیش‌نویس</SelectItem>
                <SelectItem value='pending'>در انتظار ارسال</SelectItem>
                <SelectItem value='submitted'>ارسال شده</SelectItem>
                <SelectItem value='approved'>تأیید شده</SelectItem>
                <SelectItem value='rejected'>رد شده</SelectItem>
                <SelectItem value='cancelled'>لغو شده</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>توضیحات</Label>

            <Textarea
              id='description'
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              placeholder='توضیحات فاکتور...'
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>

            <Button type='submit'>
              {isEdit ? 'ذخیره تغییرات' : 'افزودن فاکتور'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
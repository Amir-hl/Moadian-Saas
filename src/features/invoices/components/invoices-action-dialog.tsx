import { useEffect, useState } from 'react'
import { CalendarIcon, AlertTriangle } from 'lucide-react'

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

import type {
  Invoice,
  InvoicePattern,
  InvoiceStatus,
  InvoiceSubject,
  InvoiceType,
  SettlementMethod,
} from '../data/schema'
import { customers } from '@/features/customers/data/customers'
import { toJalali, jalaliToGregorian } from '@/lib/jalali'

type InvoicesActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Invoice | null
  onSubmit: (invoice: Invoice) => void
}

type InvoiceForm = {
  invoiceNumber: string
  jalaliDate: string
  customerId: string
  customerName: string
  invoiceType: InvoiceType
  invoicePattern: InvoicePattern
  invoiceSubject: InvoiceSubject
  relatedTaxId: string
  settlementMethod: SettlementMethod
  description: string
  status: InvoiceStatus
}

const emptyForm: InvoiceForm = {
  invoiceNumber: '',
  jalaliDate: toJalali(new Date()),
  customerId: '',
  customerName: '',
  invoiceType: 'type1',
  invoicePattern: 'normal',
  invoiceSubject: 'sale',
  relatedTaxId: '',
  settlementMethod: 'cash',
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
        jalaliDate: toJalali(currentRow.date),
        customerId: currentRow.customerId,
        customerName: currentRow.customerName,
        invoiceType: currentRow.invoiceType,
        invoicePattern: currentRow.invoicePattern,
        invoiceSubject: currentRow.invoiceSubject,
        relatedTaxId: currentRow.relatedTaxId ?? '',
        settlementMethod: currentRow.settlementMethod,
        description: currentRow.description ?? '',
        status: currentRow.status,
      })
    } else {
      setForm({
        ...emptyForm,
        jalaliDate: toJalali(new Date()),
      })
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

  const handleCustomerChange = (customerId: string) => {
    const selected = customers.find((c) => c.id === customerId)
    if (selected) {
      setForm((prev) => ({
        ...prev,
        customerId: selected.id,
        customerName: selected.name,
      }))
    }
  }

  const isReferencedInvoice =
    form.invoiceSubject === 'currency' ||
    form.invoiceSubject === 'service' ||
    form.invoiceSubject === 'other'

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const now = new Date()
    const gregorianDate = jalaliToGregorian(form.jalaliDate)

    const invoice: Invoice = {
      id: currentRow?.id ?? `inv-${Date.now()}`,
      invoiceNumber: form.invoiceNumber,
      date: gregorianDate,

      customerId: form.customerId,
      customerName: form.customerName,

      invoiceType: form.invoiceType,
      invoicePattern: form.invoicePattern,
      invoiceSubject: form.invoiceSubject,
      settlementMethod: form.settlementMethod,

      relatedTaxId: form.relatedTaxId.trim() || undefined,
      description: form.description || undefined,

      items: currentRow?.items ?? [],

      subtotal: currentRow?.subtotal ?? 0,
      discount: currentRow?.discount ?? 0,
      taxableAmount: currentRow?.taxableAmount ?? 0,
      tax: currentRow?.tax ?? 0,
      total: currentRow?.total ?? 0,

      status: form.status,
      submissionHistory: currentRow?.submissionHistory ?? [],

      moadianTaxId: currentRow?.moadianTaxId,
      moadianUid: currentRow?.moadianUid,
      moadianReferenceNumber: currentRow?.moadianReferenceNumber,
      moadianStatus: currentRow?.moadianStatus,
      moadianErrorCode: currentRow?.moadianErrorCode,
      moadianErrorMessage: currentRow?.moadianErrorMessage,
      submittedAt: currentRow?.submittedAt,

      createdAt: currentRow?.createdAt ?? now,
      updatedAt: now,
    }

    onSubmit(invoice)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[650px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'ویرایش مشخصات فاکتور' : 'افزودن فاکتور فروش جدید'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-5 py-2'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='invoiceNumber'>شماره داخلی فاکتور <span className='text-destructive'>*</span></Label>
              <Input
                id='invoiceNumber'
                value={form.invoiceNumber}
                onChange={(event) =>
                  updateField('invoiceNumber', event.target.value)
                }
                placeholder='مثلاً 1003'
                required
                dir='ltr'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='jalaliDate'>تاریخ صدور (شمسی) <span className='text-destructive'>*</span></Label>
              <div className='relative'>
                <CalendarIcon className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id='jalaliDate'
                  value={form.jalaliDate}
                  onChange={(event) =>
                    updateField('jalaliDate', event.target.value)
                  }
                  placeholder='1405/09/01'
                  className='ps-9 font-mono'
                  dir='ltr'
                  required
                />
              </div>
            </div>
          </div>

          <div className='space-y-2'>
            <Label>انتخاب مشتری از لیست <span className='text-destructive'>*</span></Label>
            <Select
              value={form.customerId}
              onValueChange={handleCustomerChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='انتخاب مشتری...' />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.nationalId ? `(شناسه ملی: ${c.nationalId})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>نوع صورتحساب مودیان <span className='text-destructive'>*</span></Label>
              <Select
                value={form.invoiceType}
                onValueChange={(value) =>
                  updateField('invoiceType', value as InvoiceType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='type1'>نوع اول (با اطلاعات کامل خریدار)</SelectItem>
                  <SelectItem value='type2'>نوع دوم (مصرف‌کننده نهایی / بدون اطلاعات خریدار)</SelectItem>
                  <SelectItem value='type3'>نوع سوم (رسید الکترونیکی پایانه فروش)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>الگوی صورتحساب <span className='text-destructive'>*</span></Label>
              <Select
                value={form.invoicePattern}
                onValueChange={(value) =>
                  updateField('invoicePattern', value as InvoicePattern)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='normal'>الگوی اول: فروش عادی</SelectItem>
                  <SelectItem value='simplified'>الگوی دوم: صادرات کالا</SelectItem>
                  <SelectItem value='special'>الگوی سوم: پیمانکاری / خدماتی</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label>موضوع صورتحساب <span className='text-destructive'>*</span></Label>
              <Select
                value={form.invoiceSubject}
                onValueChange={(value) =>
                  updateField('invoiceSubject', value as InvoiceSubject)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='sale'>اصلی (فروش)</SelectItem>
                  <SelectItem value='currency'>اصلاحی</SelectItem>
                  <SelectItem value='service'>ابطالی</SelectItem>
                  <SelectItem value='other'>برگشت از فروش</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>روش تسویه صورتحساب <span className='text-destructive'>*</span></Label>
              <Select
                value={form.settlementMethod}
                onValueChange={(value) =>
                  updateField('settlementMethod', value as SettlementMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='cash'>نقدی</SelectItem>
                  <SelectItem value='credit'>نسیه</SelectItem>
                  <SelectItem value='cash_and_credit'>نقدی و نسیه</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* فیلد ضروری شماره مالیاتی مرجع در صورت اصلاحی یا ابطالی */}
          {isReferencedInvoice && (
            <div className='rounded-md border border-amber-300 bg-amber-50/60 p-4 dark:bg-amber-950/20 dark:border-amber-800 space-y-2'>
              <div className='flex items-center gap-2 text-amber-900 dark:text-amber-200 text-sm font-semibold'>
                <AlertTriangle className='h-4 w-4 text-amber-600' />
                شناسه مالیاتی صورتحساب مرجع (الزامی در اصلاحی، ابطالی و برگشت)
              </div>
              <Input
                value={form.relatedTaxId}
                onChange={(e) => updateField('relatedTaxId', e.target.value)}
                placeholder='شماره مالیاتی ۲۲ رقمی فاکتور اصلی (irTaxId)'
                className='font-mono text-xs bg-background'
                dir='ltr'
                required
              />
              <p className='text-xs text-muted-foreground'>
                جهت ابطال، اصلاح یا برگشت از فروش، درج شناسه مالیاتی فاکتور اولیه الزامی است.
              </p>
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='description'>توضیحات و یادداشت</Label>
            <Textarea
              id='description'
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              placeholder='توضیحات درج شده روی فاکتور...'
              rows={3}
            />
          </div>

          <DialogFooter className='gap-2 sm:gap-0'>
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

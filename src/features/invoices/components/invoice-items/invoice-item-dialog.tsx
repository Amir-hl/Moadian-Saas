import { useEffect, useMemo, useState } from 'react'

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

import type { InvoiceItem } from '../../data/schema'
import { products } from '../../../products/data/products'
import { calculateInvoiceItem } from '../../utils/invoice-calculations'

type InvoiceItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentItem?: InvoiceItem | null
  onSubmit: (item: InvoiceItem) => void
}

type InvoiceItemForm = {
  productId: string
  productName: string
  quantity: string
  unit: string
  unitPrice: string
  discount: string
  taxRate: string
}

const emptyForm: InvoiceItemForm = {
  productId: '',
  productName: '',
  quantity: '1',
  unit: '',
  unitPrice: '0',
  discount: '0',
  taxRate: '10',
}

export function InvoiceItemDialog({
  open,
  onOpenChange,
  currentItem,
  onSubmit,
}: InvoiceItemDialogProps) {
  const [form, setForm] = useState<InvoiceItemForm>(emptyForm)

  const isEdit = Boolean(currentItem)

  useEffect(() => {
    if (!open) return

    if (currentItem) {
      setForm({
        productId: currentItem.productId,
        productName: currentItem.productName,
        quantity: String(currentItem.quantity),
        unit: currentItem.unit,
        unitPrice: String(currentItem.unitPrice),
        discount: String(currentItem.discount),
        taxRate: String(currentItem.taxRate),
      })
    } else {
      setForm(emptyForm)
    }
  }, [open, currentItem])

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.productId),
    [form.productId]
  )

  const calculation = useMemo(() => {
    const quantity = Number(form.quantity) || 0
    const unitPrice = Number(form.unitPrice) || 0
    const discount = Number(form.discount) || 0
    const taxRate = Number(form.taxRate) || 0

    return calculateInvoiceItem({
      quantity,
      unitPrice,
      discount,
      taxRate,
    })
  }, [
    form.quantity,
    form.unitPrice,
    form.discount,
    form.taxRate,
  ])

  const updateField = <K extends keyof InvoiceItemForm>(
    field: K,
    value: InvoiceItemForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleProductChange = (productId: string) => {
    const product = products.find((item) => item.id === productId)

    if (!product) {
      updateField('productId', productId)
      return
    }

    setForm((previous) => ({
      ...previous,
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      unitPrice: String(product.price),
      taxRate: String(product.taxRate),
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.productId) return

    const quantity = Number(form.quantity) || 0
    const unitPrice = Number(form.unitPrice) || 0
    const discount = Number(form.discount) || 0
    const taxRate = Number(form.taxRate) || 0

    if (quantity <= 0 || unitPrice < 0 || discount < 0 || taxRate < 0) {
      return
    }

    const item: InvoiceItem = {
      id: currentItem?.id ?? `item-${Date.now()}`,

      productId: form.productId,
      productName:
        selectedProduct?.name ?? form.productName,

      quantity,

      unit:
        selectedProduct?.unit || form.unit,

      unitPrice,

      grossAmount: calculation.grossAmount,

      discount,

      taxableAmount: calculation.taxableAmount,

      taxRate,

      taxAmount: calculation.taxAmount,

      total: calculation.total,
    }

    onSubmit(item)
    onOpenChange(false)
  }

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('fa-IR').format(value)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[650px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'ویرایش قلم فاکتور' : 'افزودن قلم فاکتور'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <Label>کالا</Label>

            <Select
              value={form.productId}
              onValueChange={handleProductChange}
            >
              <SelectTrigger>
                <SelectValue placeholder='انتخاب کالا' />
              </SelectTrigger>

              <SelectContent>
                {products.map((product) => (
                  <SelectItem
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='quantity'>تعداد</Label>

              <Input
                id='quantity'
                type='number'
                min='0.01'
                step='any'
                value={form.quantity}
                onChange={(event) =>
                  updateField('quantity', event.target.value)
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='unit'>واحد</Label>

              <Input
                id='unit'
                value={form.unit}
                readOnly
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='unitPrice'>
                قیمت واحد (ریال)
              </Label>

              <Input
                id='unitPrice'
                type='number'
                min='0'
                step='1'
                value={form.unitPrice}
                onChange={(event) =>
                  updateField('unitPrice', event.target.value)
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='discount'>
                تخفیف (ریال)
              </Label>

              <Input
                id='discount'
                type='number'
                min='0'
                step='1'
                value={form.discount}
                onChange={(event) =>
                  updateField('discount', event.target.value)
                }
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='taxRate'>
              نرخ مالیات (%)
            </Label>

            <Input
              id='taxRate'
              type='number'
              min='0'
              step='0.01'
              value={form.taxRate}
              onChange={(event) =>
                updateField('taxRate', event.target.value)
              }
            />
          </div>

          <div className='rounded-lg border bg-muted/30 p-4'>
            <h3 className='mb-4 font-semibold'>
              محاسبات قلم
            </h3>

            <div className='space-y-3 text-sm'>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>
                  مبلغ ناخالص
                </span>

                <span>
                  {formatNumber(calculation.grossAmount)} ریال
                </span>
              </div>

              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>
                  تخفیف
                </span>

                <span>
                  {formatNumber(Number(form.discount) || 0)} ریال
                </span>
              </div>

              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>
                  مبلغ مشمول مالیات
                </span>

                <span>
                  {formatNumber(calculation.taxableAmount)} ریال
                </span>
              </div>

              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>
                  مالیات
                </span>

                <span>
                  {formatNumber(calculation.taxAmount)} ریال
                </span>
              </div>

              <div className='border-t pt-3'>
                <div className='flex justify-between gap-4 text-base font-bold'>
                  <span>مبلغ نهایی</span>

                  <span>
                    {formatNumber(calculation.total)} ریال
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>

            <Button
              type='submit'
              disabled={!form.productId}
            >
              {isEdit ? 'ذخیره تغییرات' : 'افزودن قلم'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
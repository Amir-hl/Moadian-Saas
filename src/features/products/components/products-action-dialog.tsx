import { useEffect, useState } from 'react'
import type { Product } from '../data/schema'
import { initialUnits } from '@/features/units/data/units'

type ProductsActionDialogProps = {
  product?: Product | null
  open: boolean
  onClose: () => void
  onSave: (product: Product) => void
}

export function ProductsActionDialog({
  product,
  open,
  onClose,
  onSave,
}: ProductsActionDialogProps) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [sstid, setSstid] = useState('')
  const [unitCode, setUnitCode] = useState('164')
  const [taxRate, setTaxRate] = useState('10')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [error, setError] = useState('')

  const isEdit = Boolean(product)

  useEffect(() => {
    if (!open) return

    setCode(product?.code ?? '')
    setName(product?.name ?? '')
    setSstid(product?.sstid ?? '')
    setUnitCode(product?.unitCode ?? '164')
    setTaxRate(product ? String(product.taxRate) : '10')
    setDescription(product?.description ?? '')
    setStatus(product?.status ?? 'active')
    setError('')
  }, [product, open])

  if (!open) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!code.trim()) {
      setError('کد داخلی کالا الزامی است.')
      return
    }

    if (!name.trim()) {
      setError('نام کالا یا خدمت الزامی است.')
      return
    }

    if (!sstid.trim()) {
      setError('شناسه ۱۳ یا ۱۶ رقمی کالا/خدمت مودیان (SSTID) الزامی است.')
      return
    }

    const numericTaxRate = Number(taxRate)

    if (
      taxRate.trim() === '' ||
      Number.isNaN(numericTaxRate) ||
      numericTaxRate < 0 ||
      numericTaxRate > 100
    ) {
      setError('نرخ مالیات باید بین ۰ تا ۱۰۰ باشد.')
      return
    }

    const matchedUnit = initialUnits.find((u) => u.code === unitCode)
    const unitName = matchedUnit ? matchedUnit.name : 'عدد'

    const savedProduct: Product = {
      id: product?.id ?? crypto.randomUUID(),
      code: code.trim(),
      name: name.trim(),
      sstid: sstid.trim(),
      unit: unitName,
      unitCode: unitCode,
      price: product?.price ?? 0,
      taxRate: numericTaxRate,
      description: description.trim() || undefined,
      isService: product?.isService ?? false,
      status,
    }

    onSave(savedProduct)
    onClose()
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-background p-6 shadow-lg'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold'>
            {isEdit ? 'ویرایش کالا / خدمت' : 'افزودن کالا / خدمت جدید'}
          </h2>

          <p className='mt-1 text-sm text-muted-foreground'>
            مشخصات کالا و شناسه مالیاتی سامانه مودیان را وارد کنید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {error && (
            <div className='rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive'>
              {error}
            </div>
          )}

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                کد داخلی کالا *
              </label>

              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='مثلاً 1001'
                dir='ltr'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                نام کالا یا خدمت *
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='مثال: لوله پلی‌اتیلن ۶۳ میلیمتر'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='mb-1.5 block text-sm font-medium'>
                شناسه کالا / خدمت سامانه مودیان (SSTID) *
              </label>

              <input
                value={sstid}
                onChange={(event) => setSstid(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 font-mono text-sm'
                placeholder='شناسه ۱۳ یا ۱۶ رقمی دریافتی از stuffid.tax.gov.ir'
                dir='ltr'
              />
              <p className='mt-1 text-xs text-muted-foreground'>
                شناسه عمومی یا اختصاصی ۱۳ یا ۱۶ رقمی کالا و خدمت در سامانه مودیان
              </p>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                واحد سنجش کالا *
              </label>

              <select
                value={unitCode}
                onChange={(event) => setUnitCode(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
              >
                {initialUnits.map((u) => (
                  <option key={u.id} value={u.code}>
                    {u.name} (کد {u.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                نرخ مالیات بر ارزش افزوده (%) *
              </label>

              <input
                type='number'
                min='0'
                max='100'
                step='0.01'
                value={taxRate}
                onChange={(event) => setTaxRate(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='10'
                dir='ltr'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                توضیحات
              </label>

              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='توضیحات اختیاری کالا'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                وضعیت
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as 'active' | 'inactive'
                  )
                }
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
              >
                <option value='active'>فعال</option>
                <option value='inactive'>غیرفعال</option>
              </select>
            </div>
          </div>

          <div className='flex justify-end gap-2 border-t pt-5'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-md border px-4 py-2 text-sm font-medium'
            >
              انصراف
            </button>

            <button
              type='submit'
              className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground'
            >
              {isEdit ? 'ذخیره تغییرات' : 'ثبت کالا'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

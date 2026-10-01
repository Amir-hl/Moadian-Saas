import { useEffect, useState } from 'react'
import type { Product } from '../data/schema'


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
  const [unit, setUnit] = useState('')
  const [price, setPrice] = useState('')
  const [taxRate, setTaxRate] = useState('10')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [error, setError] = useState('')

  const isEdit = Boolean(product)

  useEffect(() => {
    if (!open) return

    setCode(product?.code ?? '')
    setName(product?.name ?? '')
    setUnit(product?.unit ?? '')
    setPrice(product ? String(product.price) : '')
    setTaxRate(product ? String(product.taxRate) : '10')
    setStatus(product?.status ?? 'active')
    setError('')
  }, [product, open])

  if (!open) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!code.trim()) {
      setError('کد کالا الزامی است.')
      return
    }

    if (!name.trim()) {
      setError('نام کالا الزامی است.')
      return
    }

    if (!unit.trim()) {
      setError('واحد کالا الزامی است.')
      return
    }

    if (!price.trim()) {
      setError('قیمت کالا الزامی است.')
      return
    }

    const numericPrice = Number(price)

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError('قیمت کالا باید یک عدد معتبر باشد.')
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

    const savedProduct: Product = {
      id: product?.id ?? crypto.randomUUID(),
      code: code.trim(),
      name: name.trim(),
      unit: unit.trim(),
      price: numericPrice,
      taxRate: numericTaxRate,
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
            {isEdit ? 'ویرایش کالا' : 'افزودن کالا'}
          </h2>

          <p className='mt-1 text-sm text-muted-foreground'>
            اطلاعات کالا را وارد کنید.
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
                کد کالا *
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
                نام کالا *
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='نام کالا'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                واحد *
              </label>

              <input
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='مثلاً کیلوگرم، عدد، متر، شاخه'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                قیمت *
              </label>

              <input
                type='number'
                min='0'
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='قیمت به ریال'
                dir='ltr'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                نرخ مالیات (%)
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
import { useEffect, useState } from 'react'
import type { Customer, CustomerStatus, CustomerType } from '../data/schema'

type CustomersActionDialogProps = {
  customer?: Customer | null
  open: boolean
  onClose: () => void
  onSave: (customer: Customer) => void
}

export function CustomersActionDialog({
  customer,
  open,
  onClose,
  onSave,
}: CustomersActionDialogProps) {
  const [customerType, setCustomerType] =
    useState<CustomerType>('individual')
  const [name, setName] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [economicNumber, setEconomicNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState<CustomerStatus>('active')
  const [error, setError] = useState('')

  const isEdit = Boolean(customer)

  useEffect(() => {
    if (!open) return

    setCustomerType(customer?.customerType ?? 'individual')
    setName(customer?.name ?? '')
    setNationalId(customer?.nationalId ?? '')
    setEconomicNumber(customer?.economicNumber ?? '')
    setPhoneNumber(customer?.phoneNumber ?? '')
    setEmail(customer?.email ?? '')
    setPostalCode(customer?.postalCode ?? '')
    setAddress(customer?.address ?? '')
    setStatus(customer?.status ?? 'active')
    setError('')
  }, [customer, open])

  if (!open) return null

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      setError('نام مشتری الزامی است.')
      return
    }

    if (!nationalId.trim()) {
      setError('کد ملی / شناسه ملی الزامی است.')
      return
    }

    if (!phoneNumber.trim()) {
      setError('شماره تلفن الزامی است.')
      return
    }

    const now = new Date()

    const savedCustomer: Customer = {
      id: customer?.id ?? crypto.randomUUID(),
      customerType,
      name: name.trim(),
      nationalId: nationalId.trim(),
      economicNumber: economicNumber.trim() || undefined,
      phoneNumber: phoneNumber.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      postalCode: postalCode.trim() || undefined,
      status,
      createdAt: customer?.createdAt ?? now,
      updatedAt: now,
    }

    onSave(savedCustomer)
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
            {isEdit ? 'ویرایش مشتری' : 'افزودن مشتری'}
          </h2>

          <p className='mt-1 text-sm text-muted-foreground'>
            اطلاعات مشتری را وارد کنید.
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
                نوع مشتری
              </label>

              <select
                value={customerType}
                onChange={(event) =>
                  setCustomerType(event.target.value as CustomerType)
                }
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
              >
                <option value='individual'>شخص حقیقی</option>
                <option value='company'>شخص حقوقی</option>
              </select>
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                نام مشتری *
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='نام شخص یا شرکت'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                کد ملی / شناسه ملی *
              </label>

              <input
                value={nationalId}
                onChange={(event) => setNationalId(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='کد ملی یا شناسه ملی'
                dir='ltr'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                شماره اقتصادی
              </label>

              <input
                value={economicNumber}
                onChange={(event) => setEconomicNumber(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='شماره اقتصادی'
                dir='ltr'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                شماره تلفن *
              </label>

              <input
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='09121234567'
                dir='ltr'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                ایمیل
              </label>

              <input
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='example@email.com'
                dir='ltr'
              />
            </div>

            <div>
              <label className='mb-1.5 block text-sm font-medium'>
                کد پستی
              </label>

              <input
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
                placeholder='1234567890'
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
                  setStatus(event.target.value as CustomerStatus)
                }
                className='h-10 w-full rounded-md border bg-background px-3 text-sm'
              >
                <option value='active'>فعال</option>
                <option value='inactive'>غیرفعال</option>
              </select>
            </div>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-medium'>
              آدرس
            </label>

            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className='min-h-24 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm'
              placeholder='آدرس کامل مشتری'
            />
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
              {isEdit ? 'ذخیره تغییرات' : 'ثبت مشتری'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
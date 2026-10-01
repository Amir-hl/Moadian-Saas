import { useMemo, useState } from 'react'
import type { Customer } from '../data/schema'

type CustomersTableProps = {
  data: Customer[]
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomersTable({
  data,
  onEdit,
  onDelete,
}: CustomersTableProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return data.filter((customer) => {
      const matchesSearch =
        !keyword ||
        customer.name.toLowerCase().includes(keyword) ||
        customer.nationalId.includes(keyword) ||
        customer.economicNumber?.includes(keyword) ||
        customer.phoneNumber.includes(keyword)

      const matchesStatus =
        status === 'all' || customer.status === status

      return matchesSearch && matchesStatus
    })
  }, [data, search, status])

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='جستجو نام، کد ملی، شماره اقتصادی یا تلفن...'
          className='h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring'
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as typeof status)
          }
          className='h-10 rounded-md border bg-background px-3 text-sm'
        >
          <option value='all'>همه وضعیت‌ها</option>
          <option value='active'>فعال</option>
          <option value='inactive'>غیرفعال</option>
        </select>
      </div>

      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted/50'>
              <tr className='border-b'>
                <th className='px-4 py-3 text-right font-medium'>نام مشتری</th>
                <th className='px-4 py-3 text-right font-medium'>نوع</th>
                <th className='px-4 py-3 text-right font-medium'>کد ملی / شناسه ملی</th>
                <th className='px-4 py-3 text-right font-medium'>شماره اقتصادی</th>
                <th className='px-4 py-3 text-right font-medium'>تلفن</th>
                <th className='px-4 py-3 text-right font-medium'>وضعیت</th>
                <th className='px-4 py-3 text-right font-medium'>عملیات</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-4 py-10 text-center text-muted-foreground'
                  >
                    مشتری‌ای پیدا نشد.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className='border-b last:border-0 hover:bg-muted/30'
                  >
                    <td className='px-4 py-3 font-medium'>
                      {customer.name}
                    </td>

                    <td className='px-4 py-3'>
                      {customer.customerType === 'individual'
                        ? 'حقیقی'
                        : 'حقوقی'}
                    </td>

                    <td className='px-4 py-3'>
                      {customer.nationalId}
                    </td>

                    <td className='px-4 py-3'>
                      {customer.economicNumber || '-'}
                    </td>

                    <td className='px-4 py-3'>
                      {customer.phoneNumber}
                    </td>

                    <td className='px-4 py-3'>
                      <span
                        className={
                          customer.status === 'active'
                            ? 'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium'
                            : 'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                        }
                      >
                        {customer.status === 'active'
                          ? 'فعال'
                          : 'غیرفعال'}
                      </span>
                    </td>

                    <td className='px-4 py-3'>
                      <div className='flex gap-2'>
                        <button
                          type='button'
                          onClick={() => onEdit(customer)}
                          className='rounded-md border px-3 py-1.5 text-xs hover:bg-muted'
                        >
                          ویرایش
                        </button>

                        <button
                          type='button'
                          onClick={() => onDelete(customer)}
                          className='rounded-md border px-3 py-1.5 text-xs hover:bg-muted'
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='text-sm text-muted-foreground'>
        تعداد مشتریان: {filteredCustomers.length}
      </div>
    </div>
  )
}
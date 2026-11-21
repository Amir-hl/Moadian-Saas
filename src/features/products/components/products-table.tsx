import { useMemo, useState } from 'react'
import { ProductsRowActions } from './products-row-actions'
import type { Product } from '../data/schema'

type ProductsTableProps = {
  data: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsTable({
  data,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return data.filter((product) => {
      const matchesSearch =
        !keyword ||
        product.code.toLowerCase().includes(keyword) ||
        product.name.toLowerCase().includes(keyword) ||
        (product.sstid && product.sstid.toLowerCase().includes(keyword)) ||
        product.unit.toLowerCase().includes(keyword)

      const matchesStatus =
        status === 'all' || product.status === status

      return matchesSearch && matchesStatus
    })
  }, [data, search, status])

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='جستجو کد، شناسه مودیان، نام یا واحد کالا...'
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
                <th className='px-4 py-3 text-right font-medium'>
                  کد کالا
                </th>

                <th className='px-4 py-3 text-right font-medium'>
                  نام کالا / خدمت
                </th>

                <th className='px-4 py-3 text-right font-medium'>
                  شناسه مودیان (SSTID)
                </th>

                <th className='px-4 py-3 text-right font-medium'>
                  واحد سنجش
                </th>

                <th className='px-4 py-3 text-right font-medium'>
                  نرخ مالیات
                </th>

                <th className='px-4 py-3 text-right font-medium'>
                  وضعیت
                </th>

                <th className='px-4 py-3 text-right font-medium'>
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-4 py-10 text-center text-muted-foreground'
                  >
                    کالایی پیدا نشد.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className='border-b last:border-0 hover:bg-muted/30'
                  >
                    <td className='px-4 py-3 font-mono text-xs'>
                      {product.code}
                    </td>

                    <td className='px-4 py-3 font-medium'>
                      {product.name}
                    </td>

                    <td className='px-4 py-3'>
                      {product.sstid ? (
                        <span className='font-mono text-xs font-semibold text-primary'>
                          {product.sstid}
                        </span>
                      ) : (
                        <span className='text-xs text-muted-foreground'>—</span>
                      )}
                    </td>

                    <td className='px-4 py-3'>
                      {product.unit}
                    </td>

                    <td className='px-4 py-3 font-mono'>
                      {product.taxRate}٪
                    </td>

                    <td className='px-4 py-3'>
                      <span
                        className={
                          product.status === 'active'
                            ? 'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-400'
                            : 'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground'
                        }
                      >
                        {product.status === 'active'
                          ? 'فعال'
                          : 'غیرفعال'}
                      </span>
                    </td>

                    <td className='px-4 py-3'>
                      <ProductsRowActions
                        product={product}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='text-sm text-muted-foreground'>
        تعداد کالاها: {filteredProducts.length}
      </div>
    </div>
  )
}

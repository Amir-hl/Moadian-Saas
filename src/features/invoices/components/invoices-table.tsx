import { useMemo, useState } from 'react'
import { Pencil, Search, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { Invoice, InvoiceStatus } from '../data/schema'

type InvoicesTableProps = {
  data: Invoice[]
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  onSelect: (invoice: Invoice) => void
}

export function InvoicesTable({
  data,
  onEdit,
  onDelete,
  onSelect,
}: InvoicesTableProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | InvoiceStatus>('all')

  const filteredInvoices = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return data.filter((invoice) => {
      const matchesSearch =
        !keyword ||
        invoice.invoiceNumber.toLowerCase().includes(keyword) ||
        invoice.customerName.toLowerCase().includes(keyword)

      const matchesStatus =
        status === 'all' || invoice.status === status

      return matchesSearch && matchesStatus
    })
  }, [data, search, status])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fa-IR').format(price)

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('fa-IR').format(date)

  const getStatusLabel = (value: InvoiceStatus) => {
    switch (value) {
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

  const getStatusVariant = (
    value: InvoiceStatus
  ): 'default' | 'secondary' | 'destructive' => {
    switch (value) {
      case 'approved':
        return 'default'

      case 'rejected':
      case 'cancelled':
        return 'destructive'

      default:
        return 'secondary'
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <div className='relative flex-1'>
          <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='جستجوی شماره فاکتور یا مشتری...'
            className='ps-9'
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as 'all' | InvoiceStatus)
          }
          className='h-10 rounded-md border bg-background px-3 text-sm'
        >
          <option value='all'>همه وضعیت‌ها</option>
          <option value='draft'>پیش‌نویس</option>
          <option value='pending'>در انتظار ارسال</option>
          <option value='submitted'>ارسال شده</option>
          <option value='approved'>تأیید شده</option>
          <option value='rejected'>رد شده</option>
          <option value='cancelled'>لغو شده</option>
        </select>
      </div>

      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شماره فاکتور</TableHead>
                <TableHead>مشتری</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>مبلغ کل</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className='text-left'>عملیات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='h-24 text-center text-muted-foreground'
                  >
                    فاکتوری پیدا نشد.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className='cursor-pointer'
                    onClick={() => onSelect(invoice)}
                  >
                    <TableCell className='font-medium'>
                      {invoice.invoiceNumber}
                    </TableCell>

                    <TableCell>{invoice.customerName}</TableCell>

                    <TableCell>{formatDate(invoice.date)}</TableCell>

                    <TableCell>
                      {formatPrice(invoice.total)} ریال
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {getStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>

                    <TableCell
                      className='text-left'
                      onClick={(event) => event.stopPropagation()}
                    >
                      <div className='flex justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          title='ویرایش'
                          onClick={() => onEdit(invoice)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>

                        <Button
                          variant='ghost'
                          size='icon'
                          title='حذف'
                          onClick={() => onDelete(invoice)}
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className='text-sm text-muted-foreground'>
        تعداد فاکتورها: {filteredInvoices.length}
      </div>
    </div>
  )
}
import { Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import type { InvoiceItem } from '../../data/schema'

type InvoiceItemsTableProps = {
  items: InvoiceItem[]
  onEdit?: (item: InvoiceItem) => void
  onDelete?: (item: InvoiceItem) => void
}

export function InvoiceItemsTable({
  items,
  onEdit,
  onDelete,
}: InvoiceItemsTableProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('fa-IR').format(value)

  if (items.length === 0) {
    return (
      <div className='rounded-md border p-8 text-center text-sm text-muted-foreground'>
        هنوز قلمی برای این فاکتور ثبت نشده است.
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-md border'>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کالا</TableHead>
              <TableHead>تعداد</TableHead>
              <TableHead>واحد</TableHead>
              <TableHead>قیمت واحد</TableHead>
              <TableHead>تخفیف</TableHead>
              <TableHead>مالیات</TableHead>
              <TableHead>مبلغ کل</TableHead>
              <TableHead className='text-left'>عملیات</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>
                  {item.productName}
                </TableCell>

                <TableCell>
                  {formatNumber(item.quantity)}
                </TableCell>

                <TableCell>{item.unit}</TableCell>

                <TableCell>
                  {formatNumber(item.unitPrice)} ریال
                </TableCell>

                <TableCell>
                  {formatNumber(item.discount)} ریال
                </TableCell>

                <TableCell>
                  {formatNumber(item.taxAmount)} ریال
                </TableCell>

                <TableCell>
                  {formatNumber(item.total)} ریال
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
                      onClick={() => onEdit?.(item)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon'
                      title='حذف'
                      onClick={() => onDelete?.(item)}
                    >
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
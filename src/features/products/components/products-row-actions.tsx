import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { Product } from '../data/schema'

type Props = {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsRowActions({
  product,
  onEdit,
  onDelete,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>عملیات</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(product)}>
          <Pencil className='me-2 h-4 w-4' />
          ویرایش
        </DropdownMenuItem>

        <DropdownMenuItem
          className='text-destructive focus:text-destructive'
          onClick={() => onDelete(product)}
        >
          <Trash2 className='me-2 h-4 w-4' />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
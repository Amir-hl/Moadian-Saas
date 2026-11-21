import { useState, useMemo } from 'react'
import { Plus, Search, Scale, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

import { initialUnits, type UnitItem } from './data/units'

export default function Units() {
  const [units, setUnits] = useState<UnitItem[]>(initialUnits)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const filteredUnits = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return units
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.code.includes(q) ||
        (u.symbol && u.symbol.toLowerCase().includes(q))
    )
  }, [units, search])

  const handleAddUnit = () => {
    if (!name.trim()) {
      setError('نام واحد الزامی است.')
      return
    }
    if (!code.trim()) {
      setError('کد مودیان الزامی است.')
      return
    }

    const newUnit: UnitItem = {
      id: `unit-${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      symbol: symbol.trim() || undefined,
      description: description.trim() || undefined,
      isStandard: false,
    }

    setUnits((prev) => [newUnit, ...prev])
    setName('')
    setCode('')
    setSymbol('')
    setDescription('')
    setError('')
    setDialogOpen(false)
  }

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 md:p-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight flex items-center gap-2'>
            <Scale className='h-6 w-6 text-primary' />
            واحدهای سنجش
          </h1>
          <p className='text-muted-foreground'>
            مدیریت کدهای استاندارد اندازه‌گیری و سنجش کالا در سامانه مودیان
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className='me-2 h-4 w-4' />
          افزودن واحد جدید
        </Button>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='relative max-w-sm'>
          <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='جستجوی نام واحد یا کد مودیان...'
            className='ps-9'
          />
        </div>

        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام واحد</TableHead>
                <TableHead>کد استاندارد مودیان</TableHead>
                <TableHead>نماد اختصاری</TableHead>
                <TableHead>توضیحات</TableHead>
                <TableHead>نوع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                    واحدی یافت نشد.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className='font-medium'>{u.name}</TableCell>
                    <TableCell>
                      <span className='font-mono text-sm font-semibold text-primary'>{u.code}</span>
                    </TableCell>
                    <TableCell>
                      <span className='font-mono text-xs'>{u.symbol || '—'}</span>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {u.description || '—'}
                    </TableCell>
                    <TableCell>
                      {u.isStandard ? (
                        <Badge variant='secondary' className='gap-1 text-xs'>
                          <CheckCircle2 className='h-3 w-3 text-green-500' />
                          استاندارد مودیان
                        </Badge>
                      ) : (
                        <Badge variant='outline' className='text-xs'>
                          شخصی‌سازی‌شده
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className='text-sm text-muted-foreground'>
          تعداد واحدهای سنجش: {filteredUnits.length}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>افزودن واحد اندازه‌گیری جدید</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-2'>
            {error && <div className='text-sm text-destructive font-medium'>{error}</div>}
            <div className='space-y-2'>
              <Label htmlFor='unit-name'>نام واحد <span className='text-destructive'>*</span></Label>
              <Input
                id='unit-name'
                placeholder='مثال: کیلوگرم، عدد، پالت'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='unit-code'>کد استاندارد مودیان <span className='text-destructive'>*</span></Label>
              <Input
                id='unit-code'
                dir='ltr'
                placeholder='مثال: 164'
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='unit-symbol'>نماد انگلیسی (اختیاری)</Label>
              <Input
                id='unit-symbol'
                dir='ltr'
                placeholder='مثال: kg, pcs'
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='unit-desc'>توضیحات</Label>
              <Input
                id='unit-desc'
                placeholder='توضیحات اختیاری'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleAddUnit}>
              ثبت واحد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

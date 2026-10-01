import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { CustomersTable } from './components/customers-table'
import { CustomersActionDialog } from './components/customers-action-dialog'
import { CustomersDeleteDialog } from './components/customers-delete-dialog'
import { customers as initialCustomers } from './data/customers'
import type { Customer } from './data/schema'

export function Customers() {
  const [customers, setCustomers] =
    useState<Customer[]>(initialCustomers)

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false)

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null)

  const handleAdd = () => {
    setSelectedCustomer(null)
    setDialogOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDialogOpen(true)
  }

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!customerToDelete) return

    setCustomers((current) =>
      current.filter(
        (customer) => customer.id !== customerToDelete.id
      )
    )

    setCustomerToDelete(null)
  }

  const handleSave = (customer: Customer) => {
    setCustomers((current) => {
      const exists = current.some(
        (item) => item.id === customer.id
      )

      if (exists) {
        return current.map((item) =>
          item.id === customer.id ? customer : item
        )
      }

      return [customer, ...current]
    })
  }

  return (
    <>
      <Header fixed>
        <Search />

        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              مشتریان
            </h1>

            <p className='text-muted-foreground'>
              مدیریت مشتریان و اطلاعات پایه آن‌ها
            </p>
          </div>

          <Button onClick={handleAdd}>
            <Plus className='me-2 h-4 w-4' />
            افزودن مشتری
          </Button>
        </div>

        <CustomersTable
          data={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Main>

      <CustomersActionDialog
        customer={selectedCustomer}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <CustomersDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        customerName={customerToDelete?.name ?? ''}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
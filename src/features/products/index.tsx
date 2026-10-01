import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ProductsTable } from './components/products-table'
import { ProductsActionDialog } from './components/products-action-dialog'
import { ProductsDeleteDialog } from './components/products-delete-dialog'
import { products as initialProducts } from './data/products'
import type { Product } from './data/schema'

export function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null)

  const handleAdd = () => {
    setSelectedProduct(null)
    setDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!productToDelete) return

    setProducts((current) =>
      current.filter(
        (product) => product.id !== productToDelete.id
      )
    )

    setProductToDelete(null)
  }

  const handleSave = (product: Product) => {
    setProducts((current) => {
      const exists = current.some(
        (item) => item.id === product.id
      )

      if (exists) {
        return current.map((item) =>
          item.id === product.id ? product : item
        )
      }

      return [product, ...current]
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
              کالاها
            </h1>

            <p className='text-muted-foreground'>
              مدیریت کالاها و خدمات قابل استفاده در فاکتورها
            </p>
          </div>

          <Button onClick={handleAdd}>
            <Plus className='me-2 h-4 w-4' />
            افزودن کالا
          </Button>
        </div>

        <ProductsTable
          data={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Main>

      <ProductsActionDialog
        product={selectedProduct}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <ProductsDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        productName={productToDelete?.name ?? ''}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
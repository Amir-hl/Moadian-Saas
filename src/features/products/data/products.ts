import type { Product } from './schema'

export const products: Product[] = [
  {
    id: '1',
    code: '1001',
    name: 'ورق فولادی',
    unit: 'کیلوگرم',
    price: 850000,
    taxRate: 10,
    isService: false,
    status: 'active',
  },
  {
    id: '2',
    code: '1002',
    name: 'میلگرد 16',
    unit: 'کیلوگرم',
    price: 620000,
    taxRate: 10,
    isService: false,
    status: 'active',
  },
  {
    id: '3',
    code: '1003',
    name: 'پروفیل 40×40',
    unit: 'شاخه',
    price: 1250000,
    taxRate: 10,
    isService: false,
    status: 'active',
  },
  {
    id: '4',
    code: '1004',
    name: 'لوله فولادی',
    unit: 'متر',
    price: 980000,
    taxRate: 10,
    isService: false,
    status: 'inactive',
  },
]
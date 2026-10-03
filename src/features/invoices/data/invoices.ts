import type { Invoice } from './schema'

export const invoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: '1001',
    date: new Date('2026-09-28'),

    customerId: 'customer-001',
    customerName: 'شرکت فولاد نمونه',

    description: 'فاکتور فروش محصولات فولادی',

    items: [
      {
        id: 'item-001',
        productId: '1',
        productName: 'ورق فولادی',
        quantity: 100,
        unit: 'کیلوگرم',
        unitPrice: 850000,
        discount: 0,
        taxRate: 10,
        taxAmount: 8500000,
        total: 93500000,
      },
      {
        id: 'item-002',
        productId: '2',
        productName: 'میلگرد 16',
        quantity: 50,
        unit: 'کیلوگرم',
        unitPrice: 620000,
        discount: 1000000,
        taxRate: 10,
        taxAmount: 3000000,
        total: 33000000,
      },
    ],

    subtotal: 116000000,
    discount: 1000000,
    tax: 11500000,
    total: 126500000,

    status: 'draft',

    createdAt: new Date('2026-09-28'),
    updatedAt: new Date('2026-09-28'),
  },

  {
    id: 'inv-002',
    invoiceNumber: '1002',
    date: new Date('2026-09-29'),

    customerId: 'customer-002',
    customerName: 'شرکت بازرگانی نمونه',

    description: 'فروش پروفیل و لوله فولادی',

    items: [
      {
        id: 'item-003',
        productId: '3',
        productName: 'پروفیل 40×40',
        quantity: 20,
        unit: 'شاخه',
        unitPrice: 1250000,
        discount: 0,
        taxRate: 10,
        taxAmount: 2500000,
        total: 27500000,
      },
      {
        id: 'item-004',
        productId: '4',
        productName: 'لوله فولادی',
        quantity: 30,
        unit: 'متر',
        unitPrice: 980000,
        discount: 500000,
        taxRate: 10,
        taxAmount: 2890000,
        total: 31790000,
      },
    ],

    subtotal: 54500000,
    discount: 500000,
    tax: 5390000,
    total: 59390000,

    status: 'submitted',

    createdAt: new Date('2026-09-29'),
    updatedAt: new Date('2026-09-29'),
  },
]
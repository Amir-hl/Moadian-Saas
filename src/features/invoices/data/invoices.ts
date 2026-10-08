import type { Invoice } from './schema'

export const invoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: '1001',
    date: new Date('2026-09-28'),

    customerId: 'customer-001',
    customerName: 'شرکت فولاد نمونه',

    invoiceType: 'type1',
    invoicePattern: 'normal',
    invoiceSubject: 'sale',
    settlementMethod: 'cash',

    description: 'فاکتور فروش محصولات فولادی',

    items: [
      {
        id: 'item-001',
        productId: '1',
        productName: 'ورق فولادی',
        sstid: 'sstid-001',

        quantity: 100,
        unit: 'کیلوگرم',
        unitPrice: 850000,

        grossAmount: 85000000,
        discount: 0,
        taxableAmount: 85000000,

        taxRate: 10,
        taxAmount: 8500000,

        total: 93500000,
      },
      {
        id: 'item-002',
        productId: '2',
        productName: 'میلگرد 16',
        sstid: 'sstid-002',

        quantity: 50,
        unit: 'کیلوگرم',
        unitPrice: 620000,

        grossAmount: 31000000,
        discount: 1000000,
        taxableAmount: 30000000,

        taxRate: 10,
        taxAmount: 3000000,

        total: 33000000,
      },
    ],

    subtotal: 116000000,
    discount: 1000000,
    taxableAmount: 115000000,
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

    invoiceType: 'type1',
    invoicePattern: 'normal',
    invoiceSubject: 'sale',
    settlementMethod: 'credit',

    description: 'فروش پروفیل و لوله فولادی',

    items: [
      {
        id: 'item-003',
        productId: '3',
        productName: 'پروفیل 40×40',
        sstid: 'sstid-003',

        quantity: 20,
        unit: 'شاخه',
        unitPrice: 1250000,

        grossAmount: 25000000,
        discount: 0,
        taxableAmount: 25000000,

        taxRate: 10,
        taxAmount: 2500000,

        total: 27500000,
      },
      {
        id: 'item-004',
        productId: '4',
        productName: 'لوله فولادی',
        sstid: 'sstid-004',

        quantity: 30,
        unit: 'متر',
        unitPrice: 980000,

        grossAmount: 29400000,
        discount: 500000,
        taxableAmount: 28900000,

        taxRate: 10,
        taxAmount: 2890000,

        total: 31790000,
      },
    ],

    subtotal: 54400000,
    discount: 500000,
    taxableAmount: 53900000,
    tax: 5390000,
    total: 59290000,

    status: 'submitted',

    createdAt: new Date('2026-09-29'),
    updatedAt: new Date('2026-09-29'),
  },
]
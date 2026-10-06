import { z } from 'zod'

export const invoiceStatusSchema = z.union([
  z.literal('draft'),
  z.literal('pending'),
  z.literal('submitted'),
  z.literal('approved'),
  z.literal('rejected'),
  z.literal('cancelled'),
])

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>

export const invoiceItemSchema = z.object({
  id: z.string(),

  productId: z.string(),
  productName: z.string(),

  quantity: z.number().positive(),

  unit: z.string(),

  unitPrice: z.number().nonnegative(),

  grossAmount: z.number().nonnegative(),

  discount: z.number().nonnegative(),

  taxableAmount: z.number().nonnegative(),

  taxRate: z.number().nonnegative(),

  taxAmount: z.number().nonnegative(),

  total: z.number().nonnegative(),
})

export type InvoiceItem = z.infer<typeof invoiceItemSchema>

export const invoiceSchema = z.object({
  id: z.string(),

  invoiceNumber: z.string(),

  date: z.coerce.date(),

  customerId: z.string(),

  customerName: z.string(),

  description: z.string().optional(),

  items: z.array(invoiceItemSchema),

  subtotal: z.number().nonnegative(),

  discount: z.number().nonnegative(),

  taxableAmount: z.number().nonnegative(),

  tax: z.number().nonnegative(),

  total: z.number().nonnegative(),

  status: invoiceStatusSchema,

  createdAt: z.coerce.date(),

  updatedAt: z.coerce.date(),
})

export type Invoice = z.infer<typeof invoiceSchema>
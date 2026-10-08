import { z } from 'zod'

export const invoiceStatusSchema = z.union([
  z.literal('draft'),
  z.literal('pending'),
  z.literal('submitted'),
  z.literal('approved'),
  z.literal('rejected'),
  z.literal('cancelled'),
])

export const invoiceTypeSchema = z.union([
  z.literal('type1'),
  z.literal('type2'),
  z.literal('type3'),
])

export const invoicePatternSchema = z.union([
  z.literal('normal'),
  z.literal('simplified'),
  z.literal('special'),
])

export const invoiceSubjectSchema = z.union([
  z.literal('sale'),
  z.literal('currency'),
  z.literal('service'),
  z.literal('other'),
])

export const settlementMethodSchema = z.union([
  z.literal('cash'),
  z.literal('credit'),
  z.literal('cash_and_credit'),
])

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>
export type InvoiceType = z.infer<typeof invoiceTypeSchema>
export type InvoicePattern = z.infer<typeof invoicePatternSchema>
export type InvoiceSubject = z.infer<typeof invoiceSubjectSchema>
export type SettlementMethod = z.infer<typeof settlementMethodSchema>

export const invoiceItemSchema = z.object({
  id: z.string(),

  productId: z.string(),
  productName: z.string(),

  sstid: z.string().optional(),

  quantity: z.number().positive(),

  unit: z.string(),

  unitPrice: z.number().nonnegative(),

  grossAmount: z.number().nonnegative(),

  discount: z.number().nonnegative(),

  taxableAmount: z.number().nonnegative(),

  taxRate: z.number().nonnegative(),

  taxAmount: z.number().nonnegative(),

  total: z.number().nonnegative(),

  netWeight: z.number().nonnegative().optional(),

  currencyAmount: z.number().nonnegative().optional(),

  currencyType: z.string().optional(),

  exchangeRate: z.number().nonnegative().optional(),

  constructionFee: z.number().nonnegative().optional(),

  brokerFee: z.number().nonnegative().optional(),
})

export type InvoiceItem = z.infer<typeof invoiceItemSchema>

export const invoiceSchema = z.object({
  id: z.string(),

  invoiceNumber: z.string(),

  date: z.coerce.date(),

  customerId: z.string(),

  customerName: z.string(),

  invoiceType: invoiceTypeSchema,

  invoicePattern: invoicePatternSchema,

  invoiceSubject: invoiceSubjectSchema,

  settlementMethod: settlementMethodSchema,

  relatedTaxId: z.string().optional(),

  description: z.string().optional(),

  items: z.array(invoiceItemSchema),

  subtotal: z.number().nonnegative(),

  discount: z.number().nonnegative(),

  taxableAmount: z.number().nonnegative(),

  tax: z.number().nonnegative(),

  total: z.number().nonnegative(),

  status: invoiceStatusSchema,

  moadianTaxId: z.string().optional(),

  moadianUid: z.string().optional(),

  moadianReferenceNumber: z.string().optional(),

  moadianStatus: z.string().optional(),

  moadianErrorCode: z.string().optional(),

  moadianErrorMessage: z.string().optional(),

  submittedAt: z.coerce.date().optional(),

  createdAt: z.coerce.date(),

  updatedAt: z.coerce.date(),
})

export type Invoice = z.infer<typeof invoiceSchema>
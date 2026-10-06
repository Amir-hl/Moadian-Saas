import type { InvoiceItem } from '../data/schema'

export type InvoiceItemCalculationInput = {
  quantity: number
  unitPrice: number
  discount: number
  taxRate: number
}

export type InvoiceItemCalculationResult = {
  grossAmount: number
  taxableAmount: number
  taxAmount: number
  total: number
}

export function calculateInvoiceItem(
  input: InvoiceItemCalculationInput
): InvoiceItemCalculationResult {
  const grossAmount = input.quantity * input.unitPrice

  const discount = Math.min(
    Math.max(input.discount, 0),
    grossAmount
  )

  const taxableAmount = grossAmount - discount

  const taxAmount = taxableAmount * (input.taxRate / 100)

  const total = taxableAmount + taxAmount

  return {
    grossAmount,
    taxableAmount,
    taxAmount,
    total,
  }
}

export type InvoiceCalculationResult = {
  subtotal: number
  discount: number
  taxableAmount: number
  tax: number
  total: number
}

export function calculateInvoiceTotals(
  items: InvoiceItem[]
): InvoiceCalculationResult {
  const subtotal = items.reduce(
    (sum, item) => sum + item.grossAmount,
    0
  )

  const discount = items.reduce(
    (sum, item) => sum + item.discount,
    0
  )

  const taxableAmount = items.reduce(
    (sum, item) => sum + item.taxableAmount,
    0
  )

  const tax = items.reduce(
    (sum, item) => sum + item.taxAmount,
    0
  )

  const total = items.reduce(
    (sum, item) => sum + item.total,
    0
  )

  return {
    subtotal,
    discount,
    taxableAmount,
    tax,
    total,
  }
}
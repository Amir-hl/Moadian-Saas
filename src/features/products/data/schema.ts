import { z } from 'zod'

const productStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
])

export const productSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  unit: z.string(),
  price: z.number(),
  taxRate: z.number(),
  status: productStatusSchema,
})

export type Product = z.infer<typeof productSchema>
export type ProductStatus = z.infer<typeof productStatusSchema>
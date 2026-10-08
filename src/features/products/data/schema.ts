import { z } from 'zod'

const productStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
])

export const productSchema = z.object({
  id: z.string(),

  code: z.string(),

  name: z.string(),

  sstid: z.string().optional(),

  unit: z.string(),

  unitCode: z.string().optional(),

  price: z.number(),

  taxRate: z.number(),

  description: z.string().optional(),

  isService: z.boolean().optional().default(false),

  status: productStatusSchema,
})

export type Product = z.infer<typeof productSchema>

export type ProductStatus = z.infer<typeof productStatusSchema>
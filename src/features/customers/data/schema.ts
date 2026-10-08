import { z } from 'zod'

const customerTypeSchema = z.union([
  z.literal('individual'),
  z.literal('company'),
])

const customerStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
])

export const customerSchema = z.object({
  id: z.string(),

  customerType: customerTypeSchema,

  name: z.string(),

  nationalId: z.string(),

  economicNumber: z.string().optional(),

  phoneNumber: z.string(),

  mobileNumber: z.string().optional(),

  email: z.string().optional(),

  address: z.string().optional(),

  postalCode: z.string().optional(),

  branchCode: z.string().optional(),

  taxpayerId: z.string().optional(),

  status: customerStatusSchema,

  createdAt: z.coerce.date(),

  updatedAt: z.coerce.date(),
})

export type Customer = z.infer<typeof customerSchema>

export type CustomerType = z.infer<typeof customerTypeSchema>

export type CustomerStatus = z.infer<typeof customerStatusSchema>
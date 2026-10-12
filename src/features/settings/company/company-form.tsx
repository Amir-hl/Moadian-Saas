
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const companyFormSchema = z.object({
  title: z.string().min(2, 'Company or taxpayer name is required.'),
  taxpayerType: z.enum(['legal', 'individual']),
  nationalId: z.string().optional(),
  registrationNumber: z.string().optional(),
  economicCode: z.string().optional(),
  postalCode: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  taxMemoryId: z.string().optional(),
  clientId: z.string().optional(),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

const defaultValues: CompanyFormValues = {
  title: '',
  taxpayerType: 'legal',
  nationalId: '',
  registrationNumber: '',
  economicCode: '',
  postalCode: '',
  address: '',
  phone: '',
  taxMemoryId: '',
  clientId: '',
}

export function CompanyForm() {
  const [saved, setSaved] = useState(false)

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  function onSubmit(data: CompanyFormValues) {
    // Temporary frontend-only behavior.
    // Connect this handler to the backend API later.
    console.log('Company form data:', data)
    setSaved(true)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onChange={() => setSaved(false)}
        className='space-y-8'
      >
        <section className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>Company identity</h3>
            <p className='text-sm text-muted-foreground'>
              Enter the legal or individual taxpayer information.
            </p>
          </div>

          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company or taxpayer name *</FormLabel>
                <FormControl>
                  <Input placeholder='Enter the registered name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='taxpayerType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taxpayer type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select taxpayer type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='legal'>Legal entity</SelectItem>
                    <SelectItem value='individual'>Individual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='nationalId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National ID</FormLabel>
                  <FormControl>
                    <Input dir='ltr' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='registrationNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration number</FormLabel>
                  <FormControl>
                    <Input dir='ltr' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='economicCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Economic code</FormLabel>
                  <FormControl>
                    <Input dir='ltr' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='taxMemoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax memory ID</FormLabel>
                  <FormControl>
                    <Input dir='ltr' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>Contact information</h3>
            <p className='text-sm text-muted-foreground'>
              Enter the address and contact details used for invoicing.
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='postalCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input dir='ltr' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input dir='ltr' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter the registered address'
                    className='resize-y'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className='space-y-4'>
          <div>
            <h3 className='text-lg font-medium'>Moadian connection</h3>
            <p className='text-sm text-muted-foreground'>
              These fields identify the connection configuration. Credentials
              and private keys must be handled securely by the backend.
            </p>
          </div>

          <FormField
            control={form.control}
            name='clientId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client ID / fiscal identifier</FormLabel>
                <FormControl>
                  <Input dir='ltr' {...field} />
                </FormControl>
                <FormDescription>
                  Do not enter a private key, certificate password, or other
                  secret in this form.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className='flex flex-wrap items-center gap-3'>
          <Button type='submit'>Save company information</Button>
          {saved && (
            <p className='text-sm text-muted-foreground'>
              Form validated. Permanent saving is not connected yet.
            </p>
          )}
        </div>
      </form>
    </Form>
  )
}

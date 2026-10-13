
import {
  CheckCircle2,
  CircleHelp,
  Clock3,
  XCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import type { Invoice } from '../data/schema'

type InvoiceSubmissionHistoryDialogProps = {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type AttemptStatus = 'success' | 'failed' | 'processing' | 'unknown'

type SubmissionAttempt = {
  attemptNumber: number
  status: AttemptStatus
  date: Date
  trackingId?: string
  errorCode?: string
  message: string
}

function getDemoAttempts(invoice: Invoice): SubmissionAttempt[] {
  if (invoice.status === 'draft') {
    return []
  }

  const date = invoice.submittedAt ?? invoice.updatedAt ?? invoice.date

  if (invoice.status === 'approved') {
    return [
      {
        attemptNumber: 1,
        status: 'success',
        date,
        trackingId: invoice.moadianReferenceNumber,
        message: 'ارسال آزمایشی موفق؛ وضعیت فاکتور تأیید شده است.',
      },
    ]
  }

  if (invoice.status === 'rejected') {
    return [
      {
        attemptNumber: 1,
        status: 'failed',
        date,
        errorCode: invoice.moadianErrorCode,
        message:
          invoice.moadianErrorMessage ||
          'فاکتور در داده‌های نمونه رد شده است.',
      },
    ]
  }

  if (invoice.status === 'pending') {
    return [
      {
        attemptNumber: 1,
        status: 'processing',
        date,
        message: 'وضعیت ارسال در انتظار بررسی است.',
      },
    ]
  }

  if (invoice.status === 'submitted') {
    return [
      {
        attemptNumber: 1,
        status: 'unknown',
        date,
        trackingId: invoice.moadianReferenceNumber,
        message: 'فاکتور ارسال‌شده است؛ نتیجه نهایی در داده‌های نمونه مشخص نیست.',
      },
    ]
  }

  return [
    {
      attemptNumber: 1,
      status: 'unknown',
      date,
      message: 'اطلاعات کافی برای تعیین نتیجه ارسال وجود ندارد.',
    },
  ]
}

const statusInfo: Record<
  AttemptStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive'
    Icon: typeof CheckCircle2
  }
> = {
  success: {
    label: 'موفق',
    variant: 'default',
    Icon: CheckCircle2,
  },
  failed: {
    label: 'ناموفق',
    variant: 'destructive',
    Icon: XCircle,
  },
  processing: {
    label: 'در حال پردازش',
    variant: 'secondary',
    Icon: Clock3,
  },
  unknown: {
    label: 'نامشخص',
    variant: 'secondary',
    Icon: CircleHelp,
  },
}

export function InvoiceSubmissionHistoryDialog({
  invoice,
  open,
  onOpenChange,
}: InvoiceSubmissionHistoryDialogProps) {
  const attempts = invoice ? getDemoAttempts(invoice) : []

  const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>تاریخچه ارسال فاکتور</DialogTitle>
          <DialogDescription>
            {invoice
              ? `شماره فاکتور: ${invoice.invoiceNumber} — مشتری: ${invoice.customerName}`
              : 'سوابق ارسال فاکتور'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='rounded-md border p-3 text-sm'>
            <div className='flex items-center justify-between gap-3'>
              <span className='text-muted-foreground'>وضعیت فعلی فاکتور</span>
              <Badge variant='secondary'>
                {invoice?.status ?? 'نامشخص'}
              </Badge>
            </div>
          </div>

          <div className='space-y-3'>
            <h3 className='font-medium'>تلاش‌های ارسال</h3>

            {attempts.length === 0 ? (
              <div className='rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground'>
                هنوز سابقه‌ای برای ارسال این فاکتور ثبت نشده است.
              </div>
            ) : (
              attempts.map((attempt) => {
                const info = statusInfo[attempt.status]
                const Icon = info.Icon

                return (
                  <div
                    key={attempt.attemptNumber}
                    className='space-y-3 rounded-md border p-4'
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <div className='flex items-center gap-2 font-medium'>
                        <Icon className='h-4 w-4' />
                        تلاش شماره {attempt.attemptNumber}
                      </div>

                      <Badge variant={info.variant}>{info.label}</Badge>
                    </div>

                    <div className='text-sm text-muted-foreground'>
                      زمان: {formatDateTime(attempt.date)}
                    </div>

                    <p className='text-sm'>{attempt.message}</p>

                    {attempt.trackingId && (
                      <div className='text-sm'>
                        <span className='text-muted-foreground'>
                          شناسه پیگیری: 
                        </span>
                        <span dir='ltr'>{attempt.trackingId}</span>
                      </div>
                    )}

                    {attempt.errorCode && (
                      <div className='text-sm'>
                        <span className='text-muted-foreground'>
                          کد خطا: 
                        </span>
                        <span dir='ltr'>{attempt.errorCode}</span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <p className='text-xs text-muted-foreground'>
            توجه: این سوابق فعلاً نمایشی هستند و از تاریخچه واقعی سامانه
            مودیان دریافت نشده‌اند.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

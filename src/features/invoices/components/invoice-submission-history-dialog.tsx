
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

import type {
  Invoice,
  InvoiceSubmissionAttempt,
} from '../data/schema'

type InvoiceSubmissionHistoryDialogProps = {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type AttemptStatus = InvoiceSubmissionAttempt['status']

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

const statusMessages: Record<AttemptStatus, string> = {
  success: 'ارسال با موفقیت انجام شده است.',
  failed: 'ارسال با خطا مواجه شده است.',
  processing: 'درخواست ارسال در حال پردازش است.',
  unknown: 'نتیجه نهایی ارسال مشخص نیست.',
}

export function InvoiceSubmissionHistoryDialog({
  invoice,
  open,
  onOpenChange,
}: InvoiceSubmissionHistoryDialogProps) {
  const attempts = [...(invoice?.submissionHistory ?? [])].sort(
    (a, b) => b.attemptNumber - a.attemptNumber
  )

  const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>تاریخچه ارسال فاکتور</DialogTitle>
          <DialogDescription>
            {invoice
              ? `شماره فاکتور: ${invoice.invoiceNumber} — مشتری: ${invoice.customerName}`
              : 'سوابق ارسال فاکتور'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border p-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">
                وضعیت فعلی فاکتور
              </span>
              <Badge variant="secondary">
                {invoice?.status ?? 'نامشخص'}
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">تلاش‌های ارسال</h3>

            {!invoice || attempts.length === 0 ? (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                هنوز سابقه‌ای برای ارسال این فاکتور ثبت نشده است.
              </div>
            ) : (
              attempts.map((attempt) => {
                const info = statusInfo[attempt.status]
                const Icon = info.Icon

                return (
                  <div
                    key={attempt.id}
                    className="space-y-3 rounded-md border p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-medium">
                        <Icon className="h-4 w-4" />
                        تلاش شماره {attempt.attemptNumber}
                      </div>

                      <Badge variant={info.variant}>
                        {info.label}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      زمان ارسال: {formatDateTime(attempt.submittedAt)}
                    </div>

                    {attempt.completedAt && (
                      <div className="text-sm text-muted-foreground">
                        زمان تکمیل: {formatDateTime(attempt.completedAt)}
                      </div>
                    )}

                    <p className="text-sm">
                      {attempt.errorMessage || statusMessages[attempt.status]}
                    </p>

                    {attempt.trackingId && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          شناسه پیگیری:{' '}
                        </span>
                        <span dir="ltr">{attempt.trackingId}</span>
                      </div>
                    )}

                    {attempt.taxInvoiceId && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          شناسه مالیاتی صورتحساب:{' '}
                        </span>
                        <span dir="ltr">{attempt.taxInvoiceId}</span>
                      </div>
                    )}

                    {attempt.errorCode && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          کد خطا:{' '}
                        </span>
                        <span dir="ltr">{attempt.errorCode}</span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            این بخش اطلاعات موجود در تاریخچه فاکتور را نمایش می‌دهد.
            ثبت خودکار نتیجه ارسال به سامانه مودیان و ذخیره‌سازی دائمی
            به اتصال بک‌اند نیاز دارد.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
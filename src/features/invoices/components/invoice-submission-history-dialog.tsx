import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  CircleHelp,
  Clock3,
  RefreshCw,
  XCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { moadianApi } from '../api/moadian-api'

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
  const [remoteAttempts, setRemoteAttempts] = useState<InvoiceSubmissionAttempt[]>([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = async () => {
    if (!invoice?.id) return
    setLoading(true)
    try {
      const records = await moadianApi.getSubmissions(invoice.id)
      setRemoteAttempts(records)
    } catch {
      // Fallback silently to invoice.submissionHistory on network error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && invoice?.id) {
      fetchHistory()
    } else {
      setRemoteAttempts([])
    }
  }, [open, invoice?.id])

  const attempts = (
    remoteAttempts.length > 0 ? remoteAttempts : (invoice?.submissionHistory ?? [])
  ).sort((a, b) => b.attemptNumber - a.attemptNumber)

  const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>تاریخچه ارسال فاکتور</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={fetchHistory}
              className="h-8 px-2"
              title="تازه‌سازی"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <DialogDescription>
            {invoice
              ? `شماره فاکتور: ${invoice.invoiceNumber} — مشتری: ${invoice.customerName}`
              : 'سوابق ارسال فاکتور به سامانه مودیان'}
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
                const info = statusInfo[attempt.status] || statusInfo.unknown
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
                        <span dir="ltr" className="font-mono text-xs">{attempt.trackingId}</span>
                      </div>
                    )}

                    {attempt.taxInvoiceId && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          شناسه مالیاتی صورتحساب:{' '}
                        </span>
                        <span dir="ltr" className="font-mono text-xs">{attempt.taxInvoiceId}</span>
                      </div>
                    )}

                    {attempt.errorCode && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          کد خطا:{' '}
                        </span>
                        <span dir="ltr" className="font-mono text-xs text-destructive">{attempt.errorCode}</span>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

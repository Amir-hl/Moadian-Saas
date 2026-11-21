import { useState, useEffect } from 'react'
import { CheckCircle2, KeyRound, Radio, ShieldCheck, Upload, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  moadianSettingsApi,
  type MoadianSettingsDto,
  type TestConnectionResponse,
} from '../api/moadian-settings-api'

export function MoadianConnectionCard() {
  const [settings, setSettings] = useState<MoadianSettingsDto | null>(null)
  const [clientId, setClientId] = useState('')
  const [privateKeyPem, setPrivateKeyPem] = useState('')
  const [certificatePem, setCertificatePem] = useState('')
  const [password, setPassword] = useState('')

  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestConnectionResponse | null>(null)

  useEffect(() => {
    moadianSettingsApi
      .getSettings(1)
      .then((data) => {
        setSettings(data)
        if (data.client_id) {
          setClientId(data.client_id)
        }
      })
      .catch(() => {
        // No settings saved yet
      })
  }, [])

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (content: string) => void
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setter(text)
    }
    reader.readAsText(file)
  }

  const handleSave = async () => {
    if (!clientId.trim()) {
      toast.error('لطفاً شناسه یکتای حافظه مالیاتی (Client ID) را وارد کنید.')
      return
    }

    if (!privateKeyPem.trim() && !settings?.has_private_key) {
      toast.error('لطفاً محتوای کلید خصوصی را وارد یا آپلود کنید.')
      return
    }

    setSaving(true)
    const toastId = toast.loading('در حال ذخیره و رمزنگاری امن کلیدها...')
    try {
      const res = await moadianSettingsApi.saveSettings({
        client_id: clientId.trim(),
        private_key_pem: privateKeyPem.trim(),
        certificate_pem: certificatePem.trim() || undefined,
        private_key_password: password.trim() || undefined,
        is_active: true,
      })
      setSettings(res)
      setPrivateKeyPem('')
      setCertificatePem('')
      setPassword('')
      toast.success('تنظیمات و کلیدهای سامانه مودیان با موفقیت ذخیره شدند.', { id: toastId })
    } catch (err: unknown) {
      let message = 'خطا در ذخیره تنظیمات'
      if (err && typeof err === 'object' && 'response' in err) {
        const anyErr = err as { response?: { data?: { detail?: string } } }
        message = anyErr.response?.data?.detail || message
      }
      toast.error(message, { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    const toastId = toast.loading('در حال برقراری ارتباط با سرورهای سامانه مودیان...')
    try {
      const res = await moadianSettingsApi.testConnection(1)
      setTestResult(res)
      toast.success(res.message || 'ارتباط با سرور مودیان با موفقیت تأیید شد.', { id: toastId })
    } catch (err: unknown) {
      let message = 'برقراری ارتباط با سامانه مودیان ناموفق بود.'
      if (err && typeof err === 'object' && 'response' in err) {
        const anyErr = err as { response?: { data?: { detail?: string } } }
        message = anyErr.response?.data?.detail || message
      }
      toast.error(message, { id: toastId })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className='rounded-lg border bg-card p-6 shadow-sm space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='h-5 w-5 text-primary' />
            <h3 className='text-lg font-semibold'>تنظیمات اتصال به سامانه مودیان (Tax Sdk)</h3>
          </div>
          <p className='text-sm text-muted-foreground'>
            پیکربندی کلیدهای امضا و شناسه حافظه مالیاتی برای امضا و ارسال الکترونیکی فاکتورها
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {settings?.has_private_key ? (
            <Badge variant='default' className='gap-1 bg-green-600 hover:bg-green-700'>
              <CheckCircle2 className='h-3 w-3' />
              کلید خصوصی فعال
            </Badge>
          ) : (
            <Badge variant='secondary' className='gap-1 text-amber-600'>
              <AlertCircle className='h-3 w-3' />
              کلید خصوصی تنظیم نشده
            </Badge>
          )}
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='client-id'>
            شناسه یکتای حافظه مالیاتی (Client ID) <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='client-id'
            dir='ltr'
            placeholder='مثال: A1122B'
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <p className='text-xs text-muted-foreground'>
            شناسه ۶ کاراکتری اختصاص‌یافته در کارپوشه سامانه مودیان
          </p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='private-key-password'>رمز عبور کلید خصوصی (در صورت وجود)</Label>
          <Input
            id='private-key-password'
            type='password'
            dir='ltr'
            placeholder='اختیاری'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='private-key'>
              کلید خصوصی (Private Key PEM) <span className='text-destructive'>*</span>
            </Label>
            <label className='flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline'>
              <Upload className='h-3 w-3' />
              بارگذاری فایل
              <input
                type='file'
                accept='.pem,.key,.txt'
                className='hidden'
                onChange={(e) => handleFileUpload(e, setPrivateKeyPem)}
              />
            </label>
          </div>
          <Textarea
            id='private-key'
            dir='ltr'
            placeholder='-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----'
            className='font-mono text-xs h-28'
            value={privateKeyPem}
            onChange={(e) => setPrivateKeyPem(e.target.value)}
          />
          <p className='text-xs text-muted-foreground'>
            کلید خصوصی با استاندارد AES-256 رمزنگاری شده و روی دیسک ذخیره نمی‌شود.
          </p>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='certificate'>گواهی دیجیتال مهر سازمانی (Certificate CRT/PEM)</Label>
            <label className='flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline'>
              <Upload className='h-3 w-3' />
              بارگذاری فایل
              <input
                type='file'
                accept='.crt,.pem,.cer,.txt'
                className='hidden'
                onChange={(e) => handleFileUpload(e, setCertificatePem)}
              />
            </label>
          </div>
          <Textarea
            id='certificate'
            dir='ltr'
            placeholder='-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----'
            className='font-mono text-xs h-28'
            value={certificatePem}
            onChange={(e) => setCertificatePem(e.target.value)}
          />
          <p className='text-xs text-muted-foreground'>
            محتوای متنی گواهی صادر شده توسط مرکز میانی (اختیاری در حالت API v1)
          </p>
        </div>
      </div>

      {testResult && (
        <div className='rounded-md border border-green-200 bg-green-50 p-4 text-green-900 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300 space-y-1'>
          <div className='flex items-center gap-2 font-medium text-sm'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            {testResult.message}
          </div>
          <div className='text-xs text-muted-foreground flex gap-4 pt-1'>
            <span>نسخه پروتکل: {testResult.api_version}</span>
            {testResult.server_time && <span>زمان سرور: {testResult.server_time}</span>}
            {testResult.token_expires_in && (
              <span>اعتبار توکن: {testResult.token_expires_in} ثانیه</span>
            )}
          </div>
        </div>
      )}

      <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={handleTestConnection}
            disabled={testing || (!settings?.has_private_key && !privateKeyPem)}
            className='gap-2'
          >
            <Radio className={`h-4 w-4 ${testing ? 'animate-pulse text-amber-500' : 'text-blue-500'}`} />
            {testing ? 'در حال تست ارتباط...' : 'تست اتصال به سامانه مودیان'}
          </Button>
        </div>

        <Button
          type='button'
          onClick={handleSave}
          disabled={saving}
          className='gap-2'
        >
          <KeyRound className='h-4 w-4' />
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات مودیان'}
        </Button>
      </div>
    </div>
  )
}

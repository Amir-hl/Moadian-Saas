import { apiClient } from '@/lib/api-client'
import type { InvoiceSubmissionAttempt } from '../data/schema'

export interface SubmitInvoiceResponse {
  submission_id: number
  status: 'processing' | 'success' | 'failed' | 'unknown'
  tracking_id?: string
  tax_invoice_id?: string
  error_code?: string
  error_message?: string
  message: string
}

export interface InquireInvoiceResponse {
  invoice_id: number
  count: number
  results: Array<{
    status?: string
    referenceNumber?: string
    uid?: string
    packetType?: string
    data?: unknown
  }>
}

export interface BackendSubmissionItem {
  id: number
  attempt_number: number
  status: 'processing' | 'success' | 'failed' | 'unknown'
  tracking_id?: string
  tax_invoice_id?: string
  error_code?: string
  error_message?: string
  submitted_at?: string
  completed_at?: string
  response_payload?: unknown
}

export const moadianApi = {
  submitInvoice: async (invoiceId: string | number): Promise<SubmitInvoiceResponse> => {
    const response = await apiClient.post<SubmitInvoiceResponse>(
      `/moadian/invoices/${invoiceId}/submit`
    )
    return response.data
  },

  inquireInvoice: async (invoiceId: string | number): Promise<InquireInvoiceResponse> => {
    const response = await apiClient.get<InquireInvoiceResponse>(
      `/moadian/invoices/${invoiceId}/inquire`
    )
    return response.data
  },

  getSubmissions: async (invoiceId: string | number): Promise<InvoiceSubmissionAttempt[]> => {
    const response = await apiClient.get<BackendSubmissionItem[]>(
      `/moadian/invoices/${invoiceId}/submissions`
    )
    return response.data.map((item) => ({
      id: String(item.id),
      attemptNumber: item.attempt_number,
      status: item.status,
      submittedAt: item.submitted_at ? new Date(item.submitted_at) : new Date(),
      completedAt: item.completed_at ? new Date(item.completed_at) : undefined,
      trackingId: item.tracking_id,
      taxInvoiceId: item.tax_invoice_id,
      errorCode: item.error_code,
      errorMessage: item.error_message,
    }))
  },
}

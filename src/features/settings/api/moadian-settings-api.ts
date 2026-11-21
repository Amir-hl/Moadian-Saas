import { apiClient } from '@/lib/api-client'

export interface MoadianSettingsDto {
  id: number
  organization_id: number
  client_id: string | null
  has_private_key: boolean
  has_certificate: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SaveMoadianSettingsPayload {
  client_id: string
  private_key_pem: string
  certificate_pem?: string
  private_key_password?: string
  is_active?: boolean
}

export interface TestConnectionResponse {
  status: string
  api_version: string
  client_id: string
  server_time?: number
  token_expires_in?: number
  message: string
}

export const moadianSettingsApi = {
  getSettings: async (organizationId: number = 1): Promise<MoadianSettingsDto> => {
    const response = await apiClient.get<MoadianSettingsDto>(
      `/moadian/organizations/${organizationId}/settings`
    )
    return response.data
  },

  saveSettings: async (
    payload: SaveMoadianSettingsPayload,
    organizationId: number = 1
  ): Promise<MoadianSettingsDto> => {
    const response = await apiClient.post<MoadianSettingsDto>(
      `/moadian/organizations/${organizationId}/settings`,
      payload
    )
    return response.data
  },

  testConnection: async (organizationId: number = 1): Promise<TestConnectionResponse> => {
    const response = await apiClient.post<TestConnectionResponse>(
      `/moadian/organizations/${organizationId}/test-connection`
    )
    return response.data
  },
}

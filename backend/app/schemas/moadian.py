from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field


class MoadianSettingsPayload(BaseModel):
    client_id: str = Field(..., description="شناسه ۶ کاراکتری حافظه مالیاتی")
    private_key_pem: str = Field(..., description="محتوای متنی کلید خصوصی در فرمت PEM")
    certificate_pem: str | None = Field(None, description="محتوای متنی گواهی دیجیتال (اختیاری در v1)")
    private_key_password: str | None = Field(None, description="رمز عبور کلید خصوصی (در صورت وجود)")
    is_active: bool = True


class MoadianSettingsResponse(BaseModel):
    id: int
    organization_id: int
    client_id: str | None
    has_private_key: bool
    has_certificate: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


class InvoiceSubmitResponse(BaseModel):
    submission_id: int
    status: str
    tracking_id: str | None = None
    tax_invoice_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    message: str


class SubmissionHistoryItem(BaseModel):
    id: int
    attempt_number: int
    status: str
    tracking_id: str | None = None
    tax_invoice_id: str | None = None
    error_code: str | None = None
    error_message: str | None = None
    submitted_at: datetime | None = None
    completed_at: datetime | None = None
    response_payload: Any = None


class ConnectionTestResponse(BaseModel):
    status: str
    api_version: str
    client_id: str
    server_time: int | None = None
    token_expires_in: int | None = None
    message: str

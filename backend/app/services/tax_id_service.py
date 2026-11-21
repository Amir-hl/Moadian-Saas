from datetime import datetime, date as Date
from tax_collect_data.providers.tax_id import TaxIdProvider


class TaxIdService:
    def __init__(self) -> None:
        self._provider = TaxIdProvider()

    def generate(self, client_id: str, serial: int, issue_date: datetime | Date) -> str:
        """
        Generate a unique 22-character Tax ID for an invoice.
        
        :param client_id: 6-character Fiscal Memory ID of the organization
        :param serial: Sequential integer invoice serial number
        :param issue_date: Date or datetime of invoice issue
        """
        if isinstance(issue_date, Date) and not isinstance(issue_date, datetime):
            dt = datetime.combine(issue_date, datetime.min.time())
        else:
            dt = issue_date

        return self._provider.generate_tax_id(
            client_id=client_id,
            serial=serial,
            date=dt,
        )


tax_id_service = TaxIdService()

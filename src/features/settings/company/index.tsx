
import { ContentSection } from '../components/content-section'
import { CompanyForm } from './company-form'

export function SettingsCompany() {
  return (
    <ContentSection
      title='Company & Tax Settings'
      desc='Manage the company information used when preparing Moadian invoices.'
    >
      <CompanyForm />
    </ContentSection>
  )
}

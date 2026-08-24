import { useMemo, useState } from 'react';
import AdminCmsShell from '../components/AdminCmsShell';
import AdminCmsTabs from '../components/AdminCmsTabs';
import InvestorHeroCMS from '../components/InvestorHeroCMS';
import InvestorStockQuoteCMS from '../components/InvestorStockQuoteCMS';
import InvestorStockChartCMS from '../components/InvestorStockChartCMS';
import InvestorHistoricalStockQuoteCMS from '../components/InvestorHistoricalStockQuoteCMS';
import InvestorRelatedLinksCMS from '../components/InvestorRelatedLinksCMS';
import InvestorFinancialInformationCMS from '../components/InvestorFinancialInformationCMS';
import InvestorAnnualReportsCMS from '../components/InvestorAnnualReportsCMS';
import InvestorKeyManagerialPersonnelCMS from '../components/InvestorKeyManagerialPersonnelCMS';
import InvestorGeneralMeetingUpdatesCMS from '../components/InvestorGeneralMeetingUpdatesCMS';
import InvestorInvestorPresentationCMS from '../components/InvestorInvestorPresentationCMS';
import InvestorCodeOfFairDisclosureUPSICMS from '../components/InvestorCodeOfFairDisclosureUPSICMS';
import InvestorPoliciesCMS from '../components/InvestorPoliciesCMS';
import InvestorCreditRatingsCMS from '../components/InvestorCreditRatingsCMS';
import InvestorRecordingTranscriptsCMS from '../components/InvestorRecordingTranscriptsCMS';
import InvestorDisclosureCMS from '../components/InvestorDisclosureCMS';
import InvestorStockExchangeQuarterlyComplianceCMS from '../components/InvestorStockExchangeQuarterlyComplianceCMS';
import InvestorFamiliarizationProgrammeCMS from '../components/InvestorFamiliarizationProgrammeCMS';
import InvestorTermsAndConditionsOfAppointmentIDCMS from '../components/InvestorTermsAndConditionsOfAppointmentIDCMS';
import InvestorIPOCMS from '../components/InvestorIPOCMS';
import InvestorRightsIssueCMS from '../components/InvestorRightsIssueCMS';
import InvestorFinancialStatementOfSubsidiaryCMS from '../components/InvestorFinancialStatementOfSubsidiaryCMS';
import InvestorAnnualReturnCMS from '../components/InvestorAnnualReturnCMS';
import InvestorBookClosureCMS from '../components/InvestorBookClosureCMS';
import InvestorSecretarialComplianceReportCMS from '../components/InvestorSecretarialComplianceReportCMS';
import InvestorInvestorInformationCMS from '../components/InvestorInvestorInformationCMS';
import InvestorRegistrarTransferAgentCMS from '../components/InvestorRegistrarTransferAgentCMS';
import InvestorNewspaperPublicationCMS from '../components/InvestorNewspaperPublicationCMS';
import InvestorUnpaidDividendListCMS from '../components/InvestorUnpaidDividendListCMS';
import InvestorDisclosuresUnderSASTRegulations2011CMS from '../components/InvestorDisclosuresUnderSASTRegulations2011CMS';
import InvestorEmployeeStockOptionSchemeCMS from '../components/InvestorEmployeeStockOptionSchemeCMS';
import InvestorMonitoringAgencyReportCMS from '../components/InvestorMonitoringAgencyReportCMS';
import InvestorStatementOfDeviationCMS from '../components/InvestorStatementOfDeviationCMS';
import InvestorCSRActivitiesCMS from '../components/InvestorCSRActivitiesCMS';
import InvestorCharterDocumentsCMS from '../components/InvestorCharterDocumentsCMS';
import InvestorSchemeOfAmalgamationArrangementCMS from '../components/InvestorSchemeOfAmalgamationArrangementCMS';
import InvestorPageContentCMS from '../components/InvestorPageContentCMS';
import InvestorSmartODRCMS from '../components/InvestorSmartODRCMS';

const GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    tabs: [
      { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
      { id: 'stock-quote', label: 'Stock Quote', icon: 'ri-stock-line' },
      { id: 'stock-chart', label: 'Stock Chart', icon: 'ri-line-chart-line' },
      { id: 'historical-stock-quote', label: 'Historical Quote', icon: 'ri-history-line' },
      { id: 'related-links', label: 'Related Links', icon: 'ri-links-line' },
      { id: 'pages', label: 'Investor Pages', icon: 'ri-pages-line' },
      { id: 'investor-information', label: 'Investor Information', icon: 'ri-information-line' },
      { id: 'registrar-transfer-agent', label: 'Registrar', icon: 'ri-building-2-line' },
    ],
  },
  {
    id: 'financials',
    label: 'Financials',
    tabs: [
      { id: 'financial-information', label: 'Financial Information', icon: 'ri-money-rupee-circle-line' },
      { id: 'annual-reports', label: 'Annual Reports', icon: 'ri-file-chart-line' },
      { id: 'financial-statement-of-subsidiary', label: 'Subsidiary Statements', icon: 'ri-file-list-3-line' },
      { id: 'annual-return', label: 'Annual Return', icon: 'ri-file-copy-2-line' },
      { id: 'investor-presentation', label: 'Presentations', icon: 'ri-slideshow-line' },
      { id: 'credit-ratings', label: 'Credit Ratings', icon: 'ri-star-smile-line' },
      { id: 'ipo', label: 'IPO', icon: 'ri-funds-line' },
      { id: 'rights-issue', label: 'Rights Issue', icon: 'ri-file-paper-2-line' },
      { id: 'book-closure', label: 'Book Closure', icon: 'ri-calendar-check-line' },
      { id: 'unpaid-dividend-list', label: 'Unpaid Dividend', icon: 'ri-refund-2-line' },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    tabs: [
      { id: 'key-managerial-personnel', label: 'KMP', icon: 'ri-user-star-line' },
      { id: 'policies', label: 'Policies', icon: 'ri-file-shield-line' },
      { id: 'code-of-fair-disclosure-upsi', label: 'Fair Disclosure / UPSI', icon: 'ri-lock-line' },
      { id: 'familiarization-programme', label: 'Familiarization', icon: 'ri-graduation-cap-line' },
      { id: 'terms-and-conditions-of-appointment-id', label: 'ID Appointment Terms', icon: 'ri-file-user-line' },
      { id: 'general-meeting-updates', label: 'General Meetings', icon: 'ri-group-line' },
      { id: 'smart-odr', label: 'SMART ODR', icon: 'ri-scales-3-line' },
      { id: 'csr-activities', label: 'CSR Activities', icon: 'ri-heart-line' },
      { id: 'charter-documents', label: 'Charter Documents', icon: 'ri-book-open-line' },
      { id: 'scheme-of-amalgamation-arrangement', label: 'Amalgamation', icon: 'ri-git-merge-line' },
    ],
  },
  {
    id: 'disclosures',
    label: 'Disclosures',
    tabs: [
      { id: 'disclosure', label: 'Disclosure', icon: 'ri-file-warning-line' },
      { id: 'recording-transcripts', label: 'Recordings & Transcripts', icon: 'ri-mic-line' },
      { id: 'stock-exchange-quarterly-compliance', label: 'Quarterly Compliance', icon: 'ri-calendar-schedule-line' },
      { id: 'secretarial-compliance-report', label: 'Secretarial Compliance', icon: 'ri-file-lock-line' },
      { id: 'newspaper-publication', label: 'Newspaper Publication', icon: 'ri-newspaper-line' },
      { id: 'disclosures-under-sast-regulations-2011', label: 'SAST Disclosures', icon: 'ri-article-line' },
      { id: 'employee-stock-option-scheme', label: 'ESOP', icon: 'ri-stack-line' },
      { id: 'monitoring-agency-report', label: 'Monitoring Agency', icon: 'ri-radar-line' },
      { id: 'statement-of-deviation', label: 'Statement of Deviation', icon: 'ri-error-warning-line' },
    ],
  },
] as const;

type GroupId = (typeof GROUPS)[number]['id'];
type TabId = (typeof GROUPS)[number]['tabs'][number]['id'];

export default function InvestorsCMSPage() {
  const [groupId, setGroupId] = useState<GroupId>('overview');
  const [activeTab, setActiveTab] = useState<TabId>('hero');

  const currentGroup = useMemo(
    () => GROUPS.find((group) => group.id === groupId) ?? GROUPS[0],
    [groupId],
  );

  const selectGroup = (nextGroupId: GroupId) => {
    const nextGroup = GROUPS.find((group) => group.id === nextGroupId) ?? GROUPS[0];
    setGroupId(nextGroup.id);
    setActiveTab(nextGroup.tabs[0].id);
  };

  return (
    <AdminCmsShell title="Investors CMS" subtitle="Manage investor relations content">
      <div className="mb-4 flex flex-wrap gap-2">
        {GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => selectGroup(group.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              groupId === group.id
                ? 'bg-[#7cd244] text-white'
                : 'border border-[#d9e2d4] bg-white text-[#4a5544] hover:border-[#7cd244]'
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <AdminCmsTabs
        tabs={[...currentGroup.tabs]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      {activeTab === 'hero' && <InvestorHeroCMS />}
      {activeTab === 'stock-quote' && <InvestorStockQuoteCMS />}
      {activeTab === 'stock-chart' && <InvestorStockChartCMS />}
      {activeTab === 'historical-stock-quote' && <InvestorHistoricalStockQuoteCMS />}
      {activeTab === 'related-links' && <InvestorRelatedLinksCMS />}
      {activeTab === 'financial-information' && <InvestorFinancialInformationCMS />}
      {activeTab === 'annual-reports' && <InvestorAnnualReportsCMS />}
      {activeTab === 'key-managerial-personnel' && <InvestorKeyManagerialPersonnelCMS />}
      {activeTab === 'general-meeting-updates' && <InvestorGeneralMeetingUpdatesCMS />}
      {activeTab === 'smart-odr' && <InvestorSmartODRCMS />}
      {activeTab === 'investor-presentation' && <InvestorInvestorPresentationCMS />}
      {activeTab === 'code-of-fair-disclosure-upsi' && <InvestorCodeOfFairDisclosureUPSICMS />}
      {activeTab === 'policies' && <InvestorPoliciesCMS />}
      {activeTab === 'credit-ratings' && <InvestorCreditRatingsCMS />}
      {activeTab === 'recording-transcripts' && <InvestorRecordingTranscriptsCMS />}
      {activeTab === 'disclosure' && <InvestorDisclosureCMS />}
      {activeTab === 'stock-exchange-quarterly-compliance' && <InvestorStockExchangeQuarterlyComplianceCMS />}
      {activeTab === 'familiarization-programme' && <InvestorFamiliarizationProgrammeCMS />}
      {activeTab === 'terms-and-conditions-of-appointment-id' && <InvestorTermsAndConditionsOfAppointmentIDCMS />}
      {activeTab === 'ipo' && <InvestorIPOCMS />}
      {activeTab === 'rights-issue' && <InvestorRightsIssueCMS />}
      {activeTab === 'financial-statement-of-subsidiary' && <InvestorFinancialStatementOfSubsidiaryCMS />}
      {activeTab === 'annual-return' && <InvestorAnnualReturnCMS />}
      {activeTab === 'book-closure' && <InvestorBookClosureCMS />}
      {activeTab === 'secretarial-compliance-report' && <InvestorSecretarialComplianceReportCMS />}
      {activeTab === 'investor-information' && <InvestorInvestorInformationCMS />}
      {activeTab === 'registrar-transfer-agent' && <InvestorRegistrarTransferAgentCMS />}
      {activeTab === 'newspaper-publication' && <InvestorNewspaperPublicationCMS />}
      {activeTab === 'unpaid-dividend-list' && <InvestorUnpaidDividendListCMS />}
      {activeTab === 'disclosures-under-sast-regulations-2011' && <InvestorDisclosuresUnderSASTRegulations2011CMS />}
      {activeTab === 'employee-stock-option-scheme' && <InvestorEmployeeStockOptionSchemeCMS />}
      {activeTab === 'monitoring-agency-report' && <InvestorMonitoringAgencyReportCMS />}
      {activeTab === 'statement-of-deviation' && <InvestorStatementOfDeviationCMS />}
      {activeTab === 'csr-activities' && <InvestorCSRActivitiesCMS />}
      {activeTab === 'charter-documents' && <InvestorCharterDocumentsCMS />}
      {activeTab === 'scheme-of-amalgamation-arrangement' && <InvestorSchemeOfAmalgamationArrangementCMS />}
      {activeTab === 'pages' && <InvestorPageContentCMS />}
    </AdminCmsShell>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
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

export default function InvestorsCMSPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hero' | 'stock-quote' | 'stock-chart' | 'historical-stock-quote' | 'related-links' | 'financial-information' | 'annual-reports' | 'key-managerial-personnel' | 'general-meeting-updates' | 'smart-odr' | 'investor-presentation' | 'code-of-fair-disclosure-upsi' | 'policies' | 'credit-ratings' | 'recording-transcripts' | 'disclosure' | 'stock-exchange-quarterly-compliance' | 'familiarization-programme' | 'terms-and-conditions-of-appointment-id' | 'ipo' | 'rights-issue' | 'financial-statement-of-subsidiary' | 'annual-return' | 'book-closure' | 'secretarial-compliance-report' | 'investor-information' | 'registrar-transfer-agent' | 'newspaper-publication' | 'unpaid-dividend-list' | 'disclosures-under-sast-regulations-2011' | 'employee-stock-option-scheme' | 'monitoring-agency-report' | 'statement-of-deviation' | 'csr-activities' | 'charter-documents' | 'scheme-of-amalgamation-arrangement' | 'pages'>('hero');

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                <i className="ri-arrow-left-line text-xl"></i>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Investors Page CMS</h1>
                <p className="text-sm text-gray-600">Manage Investors page sections</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('hero')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'hero'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-image-line mr-2"></i>
                Hero Section
              </button>
              <button
                onClick={() => setActiveTab('stock-quote')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'stock-quote'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-line-chart-line mr-2"></i>
                Stock Quote
              </button>
              <button
                onClick={() => setActiveTab('stock-chart')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'stock-chart'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-bar-chart-line mr-2"></i>
                Stock Chart
              </button>
              <button
                onClick={() => setActiveTab('historical-stock-quote')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'historical-stock-quote'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-history-line mr-2"></i>
                Historical Stock Quote
              </button>
              <button
                onClick={() => setActiveTab('related-links')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'related-links'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-links-line mr-2"></i>
                Related Links
              </button>
              <button
                onClick={() => setActiveTab('financial-information')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'financial-information'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-list-line mr-2"></i>
                Financial Information
              </button>
              <button
                onClick={() => setActiveTab('annual-reports')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'annual-reports'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-paper-line mr-2"></i>
                Annual Reports
              </button>
              <button
                onClick={() => setActiveTab('key-managerial-personnel')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'key-managerial-personnel'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-user-line mr-2"></i>
                Key Managerial Personnel
              </button>
              <button
                onClick={() => setActiveTab('general-meeting-updates')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'general-meeting-updates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-calendar-line mr-2"></i>
                General Meeting Updates
              </button>
              <button
                onClick={() => setActiveTab('smart-odr')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'smart-odr'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-links-line mr-2"></i>
                Smart ODR
              </button>
              <button
                onClick={() => setActiveTab('investor-presentation')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'investor-presentation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-presentation-line mr-2"></i>
                Investor Presentation
              </button>
              <button
                onClick={() => setActiveTab('code-of-fair-disclosure-upsi')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'code-of-fair-disclosure-upsi'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-shield-line mr-2"></i>
                Code of Fair Disclosure UPSI
              </button>
              <button
                onClick={() => setActiveTab('policies')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'policies'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-paper-2-line mr-2"></i>
                Policies
              </button>
              <button
                onClick={() => setActiveTab('credit-ratings')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'credit-ratings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-star-line mr-2"></i>
                Credit Ratings
              </button>
              <button
                onClick={() => setActiveTab('recording-transcripts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'recording-transcripts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-mic-line mr-2"></i>
                Recording Transcripts
              </button>
              <button
                onClick={() => setActiveTab('disclosure')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'disclosure'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-info-line mr-2"></i>
                Disclosure
              </button>
              <button
                onClick={() => setActiveTab('stock-exchange-quarterly-compliance')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'stock-exchange-quarterly-compliance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-check-line mr-2"></i>
                Stock Exchange Quarterly Compliance
              </button>
              <button
                onClick={() => setActiveTab('familiarization-programme')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'familiarization-programme'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-book-open-line mr-2"></i>
                Familiarization Programme
              </button>
              <button
                onClick={() => setActiveTab('terms-and-conditions-of-appointment-id')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'terms-and-conditions-of-appointment-id'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-text-line mr-2"></i>
                Terms & Conditions of Appointment ID
              </button>
              <button
                onClick={() => setActiveTab('ipo')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'ipo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-stock-line mr-2"></i>
                IPO
              </button>
              <button
                onClick={() => setActiveTab('rights-issue')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'rights-issue'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-list-3-line mr-2"></i>
                Rights Issue
              </button>
              <button
                onClick={() => setActiveTab('financial-statement-of-subsidiary')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'financial-statement-of-subsidiary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-chart-line mr-2"></i>
                Financial Statement of Subsidiary
              </button>
              <button
                onClick={() => setActiveTab('annual-return')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'annual-return'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-paper-line mr-2"></i>
                Annual Return
              </button>
              <button
                onClick={() => setActiveTab('book-closure')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'book-closure'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-book-line mr-2"></i>
                Book Closure
              </button>
              <button
                onClick={() => setActiveTab('secretarial-compliance-report')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'secretarial-compliance-report'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-check-line mr-2"></i>
                Secretarial Compliance Report
              </button>
              <button
                onClick={() => setActiveTab('investor-information')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'investor-information'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-information-line mr-2"></i>
                Investor Information
              </button>
              <button
                onClick={() => setActiveTab('registrar-transfer-agent')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'registrar-transfer-agent'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-building-line mr-2"></i>
                Registrar & Transfer Agent
              </button>
              <button
                onClick={() => setActiveTab('newspaper-publication')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'newspaper-publication'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-newspaper-line mr-2"></i>
                Newspaper Publication
              </button>
              <button
                onClick={() => setActiveTab('unpaid-dividend-list')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'unpaid-dividend-list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-list-line mr-2"></i>
                Unpaid Dividend List
              </button>
              <button
                onClick={() => setActiveTab('disclosures-under-sast-regulations-2011')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'disclosures-under-sast-regulations-2011'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-paper-2-line mr-2"></i>
                SAST Regulations 2011
              </button>
              <button
                onClick={() => setActiveTab('employee-stock-option-scheme')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'employee-stock-option-scheme'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-stock-line mr-2"></i>
                Employee Stock Option Scheme
              </button>
              <button
                onClick={() => setActiveTab('monitoring-agency-report')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'monitoring-agency-report'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-search-line mr-2"></i>
                Monitoring Agency Report
              </button>
              <button
                onClick={() => setActiveTab('statement-of-deviation')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'statement-of-deviation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-warning-line mr-2"></i>
                Statement of Deviation
              </button>
              <button
                onClick={() => setActiveTab('csr-activities')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'csr-activities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-community-line mr-2"></i>
                CSR Activities
              </button>
              <button
                onClick={() => setActiveTab('charter-documents')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'charter-documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-text-line mr-2"></i>
                Charter Documents
              </button>
              <button
                onClick={() => setActiveTab('scheme-of-amalgamation-arrangement')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'scheme-of-amalgamation-arrangement'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-file-list-3-line mr-2"></i>
                Scheme of Amalgamation Arrangement
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'pages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-pages-line mr-2"></i>
                Investor Pages
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
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
        </div>
      </main>
    </div>
  );
}


import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

const HomePage = lazy(() => import('../pages/home/page'));
const AboutUsPage = lazy(() => import('../pages/about-us/page'));
const AshUtilizationPage = lazy(() => import('../pages/ash-utilization/page'));
const GreenMobilityPage = lazy(() => import('../pages/green-mobility/page'));
const VenwindRefexPage = lazy(() => import('../pages/venwind-refex/page'));
// const RefrigerantGasPage = lazy(() => import('../pages/refrigerant-gas/page'));
const ESGPage = lazy(() => import('../pages/esg/page'));
const NewsroomPage = lazy(() => import('../pages/newsroom/page'));
const ContactPage = lazy(() => import('../pages/contact/page'));
const CareersPage = lazy(() => import('../pages/careers/page'));
const InvestorsPage = lazy(() => import('../pages/investors/page'));
const KeyManagerialPersonnelPage = lazy(() => import('../pages/investors/key-managerial-personnel/page'));
const FinancialInformationPage = lazy(() => import('../pages/investors/financial-information/page'));
const AnnualReportsPage = lazy(() => import('../pages/investors/annual-reports/page'));
const PoliciesPage = lazy(() => import('../pages/investors/policies/page'));
const GeneralMeetingUpdatesPage = lazy(() => import('../pages/investors/general-meeting-updates/page'));
const InvestorPresentation = lazy(() => import('../pages/investors/investor-presentation/page'));
const CodeOfFairDisclosureUPSIPage = lazy(() => import('../pages/investors/code-of-fair-disclosure-upsi/page'));
const CreditRatingsPage = lazy(() => import('../pages/investors/credit-ratings/page'));
const RecordingTranscriptsPage = lazy(() => import('../pages/investors/recording-transcripts/page'));
const DisclosurePage = lazy(() => import('../pages/investors/disclosure-of-material-events-or-information/page'));
const StockExchangeQuarterlyCompliancePage = lazy(() => import('../pages/investors/stock-exchange-quarterly-compliance/page'));
const FamiliarizationProgrammePage = lazy(() => import('../pages/investors/familiarization-programme/page'));
const TermsAndConditionsOfAppointmentPage = lazy(() => import('../pages/investors/terms-and-conditions-of-appointment-of-id/page'));
const IPOPage = lazy(() => import('../pages/investors/ipo/page'));
const RightsIssuePage = lazy(() => import('../pages/investors/rights-issue/page'));
const FinancialStatementOfSubsidiaryPage = lazy(() => import('../pages/investors/financial-statement-of-subsidiary/page'));
const AnnualReturnPage = lazy(() => import('../pages/investors/annual-return/page'));
const BookClosurePage = lazy(() => import('../pages/investors/book-closure-of-members-register-record-date/page'));
const SecretarialComplianceReportPage = lazy(() => import('../pages/investors/secretarial-compliance-report/page'));
const InvestorInformationPage = lazy(() => import('../pages/investors/investor-information/page'));
const RegistrarTransferAgentPage = lazy(() => import('../pages/investors/registrar-transfer-agent/page'));
const NewspaperPublicationPage = lazy(() => import('../pages/investors/newspaper-publication/page'));
const UnpaidDividendListPage = lazy(() => import('../pages/investors/unpaid-dividend-list-and-iepf-shares/page'));
const DisclosuresUnderSASTRegulations2011Page = lazy(() => import('../pages/investors/disclosures-under-sast-regulations-2011/page'));
const EmployeeStockOptionSchemePage = lazy(() => import('../pages/investors/employee-stock-option-scheme/page'));
const MonitoringAgencyReportPage = lazy(() => import('../pages/investors/monitoring-agency-report/page'));
const StatementOfDeviationPage = lazy(() => import('../pages/investors/statement-of-deviation/page'));
const CSRActivitiesPage = lazy(() => import('../pages/investors/csr-activities/page'));
const CharterDocumentsPage = lazy(() => import('../pages/investors/charter-documents/page'));
const SchemeOfAmalgamationArrangementPage = lazy(() => import('../pages/investors/scheme-of-amalgamation-arrangement/page'));
const SmartOdrPage = lazy(() => import('../pages/investors/smart-odr/page'));
const InvestorDynamicPage = lazy(() => import('../pages/investors/[slug]/page'));
const R22ProductPage = lazy(() => import('../pages/product/r22/page'));
const R404AProductPage = lazy(() => import('../pages/product/r404a/page'));
const ProductHFC134APage = lazy(() => import('../pages/product/hfc-134a/page'));
const R32ProductPage = lazy(() => import('../pages/product/r32/page'));
const R407CProductPage = lazy(() => import('../pages/product/r407c/page'));
const R410AProductPage = lazy(() => import('../pages/product/r410a/page'));
const R600AProductPage = lazy(() => import('../pages/product/r600a/page'));
const R290ProductPage = lazy(() => import('../pages/product/r290/page'));
const HydrocarbonProductPage = lazy(() => import('../pages/product/hydrocarbon/page'));
const ButaneProductPage = lazy(() => import('../pages/product/butane/page'));
const CopperTubesProductPage = lazy(() => import('../pages/product/copper-tubes/page'));
const AdminLoginPage = lazy(() => import('../pages/admin/login/page'));
const AdminDashboardPage = lazy(() => import('../pages/admin/dashboard/page'));
const HomeCMSPage = lazy(() => import('../pages/admin/dashboard/home-cms/page'));
const AboutCMSPage = lazy(() => import('../pages/admin/dashboard/about-cms/page'));
const AshUtilizationCMSPage = lazy(() => import('../pages/admin/dashboard/ash-utilization-cms/page'));
const GreenMobilityCMSPage = lazy(() => import('../pages/admin/dashboard/green-mobility-cms/page'));
const VenwindRefexCMSPage = lazy(() => import('../pages/admin/dashboard/venwind-refex-cms/page'));
const RefrigerantGasCMSPage = lazy(() => import('../pages/admin/dashboard/refrigerant-gas-cms/page'));
const EsgCMSPage = lazy(() => import('../pages/admin/dashboard/esg-cms/page'));
const NewsroomCMSPage = lazy(() => import('../pages/admin/dashboard/newsroom-cms/page'));
const ContactCMSPage = lazy(() => import('../pages/admin/dashboard/contact-cms/page'));
const InvestorsCMSPage = lazy(() => import('../pages/admin/dashboard/investors-cms/page'));
const HeaderCMSPage = lazy(() => import('../pages/admin/dashboard/header-cms/page'));
const FooterCMSPage = lazy(() => import('../pages/admin/dashboard/footer-cms/page'));
const CareersCMSPage = lazy(() => import('../pages/admin/dashboard/careers-cms/page'));
const ProductsCMSPage = lazy(() => import('../pages/admin/dashboard/products-cms/page'));
const LegalCMSPage = lazy(() => import('../pages/admin/dashboard/legal-cms/page'));
const PrivacyPolicyPage = lazy(() => import('../pages/privacy-policy/page'));
const TermsOfUsePage = lazy(() => import('../pages/terms-of-use/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about-us',
    element: <AboutUsPage />,
  },
  {
    path: '/ash-utilization',
    element: <AshUtilizationPage />,
  },
  {
    path: '/green-mobility',
    element: <GreenMobilityPage />,
  },
  {
    path: '/venwind-refex',
    element: <VenwindRefexPage />,
  },
  // {
  //   path: '/refrigerant-gas',
  //   element: <RefrigerantGasPage />,
  // },
  {
    path: '/esg',
    element: <ESGPage />,
  },
  {
    path: '/newsroom',
    element: <NewsroomPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/careers',
    element: <CareersPage />,
  },
  {
    path: '/investors',
    element: <InvestorsPage />,
  },
  {
    path: '/investors/key-managerial-personnel',
    element: <KeyManagerialPersonnelPage />,
  },
  {
    path: '/investors/financial-information',
    element: <FinancialInformationPage />,
  },
  {
    path: '/investors/annual-reports',
    element: <AnnualReportsPage />,
  },
  {
    path: '/investors/policies',
    element: <PoliciesPage />,
  },
  {
    path: '/investors/general-meeting-updates',
    element: <GeneralMeetingUpdatesPage />,
  },
  {
    path: '/investors/investor-presentation',
    element: <InvestorPresentation />,
  },
  {
    path: '/investors/code-of-fair-disclosure-upsi',
    element: <CodeOfFairDisclosureUPSIPage />,
  },
  {
    path: '/investors/credit-ratings',
    element: <CreditRatingsPage />,
  },
  {
    path: '/investors/recording-transcripts',
    element: <RecordingTranscriptsPage />,
  },
  {
    path: '/investors/recording-transcripts-of-post-earnings-quarterly-calls',
    element: <RecordingTranscriptsPage />,
  },
  {
    path: '/investors/disclosure-of-material-events-or-information',
    element: <DisclosurePage />,
  },
  {
    path: '/investors/stock-exchange-quarterly-compliance',
    element: <StockExchangeQuarterlyCompliancePage />,
  },
  {
    path: '/investors/familiarization-programme',
    element: <FamiliarizationProgrammePage />,
  },
  {
    path: '/investors/familiarization-programme-for-independent-directors',
    element: <FamiliarizationProgrammePage />,
  },
  {
    path: '/investors/terms-and-conditions-of-appointment-of-id',
    element: <TermsAndConditionsOfAppointmentPage />,
  },
  {
    path: '/investors/ipo',
    element: <IPOPage />,
  },
  {
    path: '/investors/rights-issue',
    element: <RightsIssuePage />,
  },
  {
    path: '/investors/financial-statement-of-subsidiary',
    element: <FinancialStatementOfSubsidiaryPage />,
  },
  {
    path: '/investors/annual-return',
    element: <AnnualReturnPage />,
  },
  {
    path: '/investors/book-closure-of-members-register-record-date',
    element: <BookClosurePage />,
  },
  {
    path: '/investors/secretarial-compliance-report',
    element: <SecretarialComplianceReportPage />,
  },
  {
    path: '/investors/investor-information',
    element: <InvestorInformationPage />,
  },
  {
    path: '/investors/registrar-transfer-agent',
    element: <RegistrarTransferAgentPage />,
  },
  {
    path: '/investors/newspaper-publication',
    element: <NewspaperPublicationPage />,
  },
  {
    path: '/investors/unpaid-dividend-list-and-iepf-shares',
    element: <UnpaidDividendListPage />,
  },
  {
    path: '/investors/disclosures-under-sast-regulations-2011',
    element: <DisclosuresUnderSASTRegulations2011Page />,
  },
  {
    path: '/investors/employee-stock-option-scheme',
    element: <EmployeeStockOptionSchemePage />,
  },
  {
    path: '/investors/monitoring-agency-report',
    element: <MonitoringAgencyReportPage />,
  },
  {
    path: '/investors/statement-of-deviation',
    element: <StatementOfDeviationPage />,
  },
  {
    path: '/investors/csr-activities',
    element: <CSRActivitiesPage />,
  },
  {
    path: '/investors/charter-documents',
    element: <CharterDocumentsPage />,
  },
  {
    path: '/investors/scheme-of-amalgamation-arrangement',
    element: <SchemeOfAmalgamationArrangementPage />,
  },
  {
    path: '/investors/smart-odr',
    element: <SmartOdrPage />,
  },
  {
    path: '/investors/:slug',
    element: <InvestorDynamicPage />,
  },
  {
    path: '/product/r22',
    element: <R22ProductPage />,
  },
  {
    path: '/product/r404a',
    element: <R404AProductPage />,
  },
  {
    path: '/product/hfc-134a',
    element: <ProductHFC134APage />,
  },
  {
    path: '/product/r32',
    element: <R32ProductPage />,
  },
  {
    path: '/product/r407c',
    element: <R407CProductPage />,
  },
  {
    path: '/product/r410a',
    element: <R410AProductPage />,
  },
  {
    path: '/product/r600a',
    element: <R600AProductPage />,
  },
  {
    path: '/product/r290',
    element: <R290ProductPage />,
  },
  {
    path: '/product/hydrocarbon',
    element: <HydrocarbonProductPage />,
  },
  {
    path: '/product/butane',
    element: <ButaneProductPage />,
  },
  {
    path: '/product/copper-tubes',
    element: <CopperTubesProductPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/home-cms',
    element: (
      <ProtectedRoute>
        <HomeCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/about-cms',
    element: (
      <ProtectedRoute>
        <AboutCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/ash-utilization-cms',
    element: (
      <ProtectedRoute>
        <AshUtilizationCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/green-mobility-cms',
    element: (
      <ProtectedRoute>
        <GreenMobilityCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/venwind-refex-cms',
    element: (
      <ProtectedRoute>
        <VenwindRefexCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/refrigerant-gas-cms',
    element: (
      <ProtectedRoute>
        <RefrigerantGasCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/esg-cms',
    element: (
      <ProtectedRoute>
        <EsgCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/newsroom-cms',
    element: (
      <ProtectedRoute>
        <NewsroomCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/contact-cms',
    element: (
      <ProtectedRoute>
        <ContactCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/investors-cms',
    element: (
      <ProtectedRoute>
        <InvestorsCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/header-cms',
    element: (
      <ProtectedRoute>
        <HeaderCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/footer-cms',
    element: (
      <ProtectedRoute>
        <FooterCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/careers-cms',
    element: (
      <ProtectedRoute>
        <CareersCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/products-cms',
    element: (
      <ProtectedRoute>
        <ProductsCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard/legal-cms',
    element: (
      <ProtectedRoute>
        <LegalCMSPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/terms-of-use',
    element: <TermsOfUsePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;

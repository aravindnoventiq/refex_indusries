import { dedupeInvestorRelatedLinks } from './investorRelatedLinks';

export type InvestorNavLink = {
  name: string;
  href: string;
  displayOrder: number;
  isActive: boolean;
};

/** Sidebar / related-links fallback — matches refex.co.in/investors structure */
export const FALLBACK_INVESTOR_NAV_LINKS: InvestorNavLink[] = [
  { name: 'Key Managerial Personnel', href: '/investors/key-managerial-personnel', displayOrder: 0, isActive: true },
  { name: 'Financial Information', href: '/investors/financial-information', displayOrder: 1, isActive: true },
  { name: 'Annual Reports', href: '/investors/annual-reports', displayOrder: 2, isActive: true },
  { name: 'General Meeting Updates', href: '/investors/general-meeting-updates', displayOrder: 3, isActive: true },
  { name: 'Investor Presentation', href: '/investors/investor-presentation', displayOrder: 4, isActive: true },
  { name: 'Code of fair Disclosure UPSI', href: '/investors/code-of-fair-disclosure-upsi', displayOrder: 5, isActive: true },
  { name: 'Policies', href: '/investors/policies', displayOrder: 6, isActive: true },
  { name: 'Credit Ratings', href: '/investors/credit-ratings', displayOrder: 7, isActive: true },
  {
    name: 'Recording & Transcripts of Post Earnings / Quarterly Calls',
    href: '/investors/recording-transcripts-of-post-earnings-quarterly-calls',
    displayOrder: 8,
    isActive: true,
  },
  {
    name: 'Disclosure of Material Events or Information',
    href: '/investors/disclosure-of-material-events-or-information',
    displayOrder: 9,
    isActive: true,
  },
  {
    name: 'Stock Exchange Quarterly Compliance',
    href: '/investors/stock-exchange-quarterly-compliance',
    displayOrder: 10,
    isActive: true,
  },
  {
    name: 'Familiarization Programme for Independent Directors',
    href: '/investors/familiarization-programme-for-independent-directors',
    displayOrder: 11,
    isActive: true,
  },
  {
    name: 'Terms and Conditions of Appointment of ID',
    href: '/investors/terms-and-conditions-of-appointment-of-id',
    displayOrder: 12,
    isActive: true,
  },
  { name: 'IPO', href: '/investors/ipo', displayOrder: 13, isActive: true },
  { name: 'Rights Issue', href: '/investors/rights-issue', displayOrder: 14, isActive: true },
  {
    name: 'Financial Statement of Subsidiary',
    href: '/investors/financial-statement-of-subsidiary',
    displayOrder: 15,
    isActive: true,
  },
  { name: 'Annual Return', href: '/investors/annual-return', displayOrder: 16, isActive: true },
  {
    name: 'Book Closure of Members Register / Record Date',
    href: '/investors/book-closure-of-members-register-record-date',
    displayOrder: 17,
    isActive: true,
  },
  {
    name: 'Secretarial Compliance Report',
    href: '/investors/secretarial-compliance-report',
    displayOrder: 18,
    isActive: true,
  },
  { name: 'Investor Information', href: '/investors/investor-information', displayOrder: 19, isActive: true },
  { name: 'Registrar & Transfer Agent', href: '/investors/registrar-transfer-agent', displayOrder: 20, isActive: true },
  { name: 'Newspaper Publication', href: '/investors/newspaper-publication', displayOrder: 21, isActive: true },
  {
    name: 'Unpaid Dividend List and IEPF Shares',
    href: '/investors/unpaid-dividend-list-and-iepf-shares',
    displayOrder: 22,
    isActive: true,
  },
  {
    name: 'Disclosures under SAST Regulations 2011',
    href: '/investors/disclosures-under-sast-regulations-2011',
    displayOrder: 23,
    isActive: true,
  },
  {
    name: 'Employee Stock Option Scheme',
    href: '/investors/employee-stock-option-scheme',
    displayOrder: 24,
    isActive: true,
  },
  { name: 'Monitoring Agency Report', href: '/investors/monitoring-agency-report', displayOrder: 25, isActive: true },
  { name: 'Statement of Deviation', href: '/investors/statement-of-deviation', displayOrder: 26, isActive: true },
  { name: 'CSR Activities', href: '/investors/csr-activities', displayOrder: 27, isActive: true },
  { name: 'Charter Documents', href: '/investors/charter-documents', displayOrder: 28, isActive: true },
  {
    name: 'Scheme of Amalgamation / Arrangement',
    href: '/investors/scheme-of-amalgamation-arrangement',
    displayOrder: 29,
    isActive: true,
  },
];

export function getFallbackInvestorNavLinks(): InvestorNavLink[] {
  return dedupeInvestorRelatedLinks(FALLBACK_INVESTOR_NAV_LINKS);
}

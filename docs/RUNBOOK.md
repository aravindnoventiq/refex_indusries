# Refex site UX revamp — runbook

**Branch:** `raghul`  
**Date:** 14 Oct 2026  
**Status:** Uncommitted local changes (not pushed)  
**Local app:** http://localhost:3000/  
**Live reference:** https://refex.co.in/

This is the single runbook for the current working-tree UX/content pass: homepage, header, About Us, ESG, Contact, Investors Related Links, and matching title/layout tweaks on other public pages.

---

## Alerts — previous flows affected

These are not just visual tweaks. Existing user, CMS, or deep-link behaviour changed.

### High

1. **Header “Power Trading Surrender Petition” is gone**  
   Removed from default nav and Header CMS defaults. The live header also **filters it out even if CMS still has the item** (name contains `power trading surrender`, or href contains `pdf-1783071359067-610585102.pdf`).  
   **Old flow:** header click → production PDF. **New flow:** no nav item. Re-adding it in CMS will not show until the client filter is removed.

2. **Homepage video is clipped to the hero only**  
   `HomeScrollVideo` no longer wraps the whole page. Business / At a Glance / Flip cards / Newsroom / Awards / Footer no longer sit on a fading video canvas.  
   **Old flow:** scroll-scrub video continues under post-hero content. **New flow:** hero pin/scrub only, then a solid themed background.

3. **Homepage follows light/dark theme**  
   Home used to stay a dark canvas regardless of the site toggle. It now uses `html.home-page` + `home-page-root--light|--dark`. Other pages were not switched to this home-only canvas.  
   **Old flow:** home always dark. **New flow:** light home is white/sage; dark home is `#05070a`.

4. **Investors Related Links always shows the live 30-item list**  
   CMS + Investor Pages no longer replace the list when they return a subset. Missing rows are filled from fallbacks. **Smart ODR is excluded** from Related Links / sidebar (matches https://refex.co.in/investors, not the seed that still contains Smart ODR).  
   **Old flow:** incomplete CMS list won; some links 404’d locally because hrefs were full `refex.co.in` URLs or long slugs. **New flow:** always 30 local `/investors/...` routes. CMS **cannot hide** an item from this list. Smart ODR remains at `/investors/smart-odr` but is not listed here.

5. **ESG section IDs and footer aliases changed**  
   - `#sustainability-pillars` → `#refex-esg`  
   - `#sustainable-well-being` → `#programs`  
   Footer maps those old hashes so bookmarks still land.  
   **Removed** the old alias `refex-esg` → `esg-vision` (hero).  
   **Old flow:** `/esg#refex-esg` scrolled to the hero. **New flow:** `/esg#refex-esg` scrolls to “Refex on ESG” (pillars). Footer “Refex on ESG” already points at `#refex-esg`.

6. **People/content removals are enforced in the client, not only in seeds**  
   Seeds were updated, but production/UAT DB is unchanged until re-seed. Public pages still hide:  
   - **Jaya Krishna** (Leadership)  
   - **Mr. Sachin Navtosh Jha / Chief of Staff** (Committees)  
   - **Factory** office (Contact)  
   Re-adding them in CMS will **not** show until those filters are removed.

7. **Historical Stock Quote no longer shows API errors**  
   `HTTP error! status: 500` and other `err.message` banners were removed. Failed fetches now look like an empty period (`No data available for the selected period.`).  
   **Old flow:** red error box. **New flow:** silent empty table. Local API-down is harder to diagnose on the page.

### Medium

8. **Taller header + larger logo**  
   Header min-height is now about `4.5rem` / `5.5rem` (was `3.25rem` / `3.75rem`). `--header-offset` default is `6rem` (mobile `5.5rem`). Sticky sections that still hardcode `top-24` / `top-[72px]` can sit under the bar. `EsgPageNav` (unused on the page today) still uses `top-[72px]` / `sm:top-[80px]`.

9. **ESG hero collage removed; intro section turned back on**  
   `EsgTopSection` is rendered again. Nature collage / extra images in the awards visual are gone. Hero is copy + hummingbird/branch only, theme-aware background. CMS extra hero images are unused.

10. **ESG titles/subtitles aligned to live site**  
    Hardcoded (CMS titles for these blocks may be ignored):  
    - Sustainability Pillars → **Refex on ESG** (intro paragraph removed)  
    - Sustainable Well-Being → **PROGRAMS** (subtitle removed)  
    - SDG intro badges/subtitles removed  
    - Section badge row on `EsgSectionHeader` removed (`badgeIcon` / `badgeLabel` / `accent` props deleted — all callers in this change set were updated)

11. **Governance and HR match REPORTS cards**  
    Previous custom Governance/HR layouts are gone. Same “View Report” card pattern as Reports.

12. **ESG policy numbers, icons, and “Policy Document” chip removed**  
    Policy cards are title + image + “View Policy” text link only.

13. **Mission / Vision labels sanitized**  
    CMS titles containing “Purpose” or “Direction” are forced to Mission / Vision. Eyebrows “Purpose”, “Our Purpose”, “Our Direction” are gone. Committee “N members” and Chairman/Member chips are gone. Leadership modal no longer shows a “Leadership” label.

14. **Contact hero seed copy changed**  
    Seed no longer uses the Ash Utilization partnership headline. **Live DB still has old copy until re-seed or CMS edit.** Client Contact hero may still render CMS text if the API is up.

15. **Date inputs on Historical Stock Quote stay light in dark theme**  
    `theme-keep-light` + `.historical-quote-controls`. Start/end dates auto-correct if inverted. Default range uses local calendar dates (not UTC `toISOString()`), so the first/last day can shift versus the old UTC-based default.

16. **Related Links slug aliases**  
    Recording transcripts → `/investors/recording-transcripts`  
    Familiarization → `/investors/familiarization-programme`  
    Long live-site slugs still have dedicated router aliases. Bookmarks to the long paths still work.

### Low / watch

17. **Larger section titles** on Home, About, ESG, Ash Utilization, Careers, Contact, Green Mobility, Newsroom, Refrigerant Gas, Venwind. Mobile wrapping/overlap is the main risk.

18. **`EsgPageNav` still lists “Nature” → `#esg-nature-showcase`**, but `EsgNatureShowcaseSection` is not on the ESG page. Component is unused; no live break unless it is wired back in.

19. **`server/package-lock.json` is modified** with no matching `package.json` change in this UX pass. Do not ship that lockfile with this runbook unless you intend a dependency change.

20. **Seeds vs running database**  
    Editing `server/seeds/*.json` does **not** update MySQL until the seed scripts are run. Client-side filters are what hide people/offices/nav items on local/UAT/prod today.

---

## How to run locally

```bash
# Client (already used at http://localhost:3000/)
cd client && npm run dev

# API (optional; pages use fallbacks if MySQL/API is down)
cd server && npm run dev
```

If the API is down, Related Links still show the full 30 items, header still hides Power Trading, and About/Contact filters still apply. CMS-driven PDFs/stock quotes will be empty rather than showing HTTP 500.

---

## Change log (every change)

### 1. Homepage hero video — clip to hero only

| Item | Detail |
| --- | --- |
| Why | Video must not continue under later sections |
| What | `HomeScrollVideo` is hero-only (no `children` wrapper). Pin/scrub stays on the hero. Post-hero CSS for faded video overlay removed |
| Files | `client/src/pages/home/page.tsx`, `HomeScrollVideo.tsx`, `TerminalHeroChapters.tsx`, `client/src/index.css` |
| Previous flow | Full-page video background + `home-is-post-hero` opacity |

### 2. Header height and logo

| Item | Detail |
| --- | --- |
| Why | Larger chrome and Refex Industries logo |
| What | Bar `min-h` increased; logo `h-8/lg:h-9` → `h-11/sm:h-12/lg:h-14`; Contact button slightly larger; `--header-offset` raised |
| Files | `Header.tsx`, `index.css` |
| Previous flow | Tighter header; pages using `--header-offset` shift down |

### 3. Homepage light/dark canvas (home only)

| Item | Detail |
| --- | --- |
| Why | Home background must follow theme; other pages unchanged |
| What | `home-page-root--light/--dark`, `useHomeTheme()`, light typography/cards for post-hero sections |
| Files | `home/page.tsx`, `HomeSection.tsx`, `AtGlanceSection.tsx`, `AwardsSection.tsx`, `BusinessSection.tsx`, `FlipCardsSection.tsx`, `NewsroomSection.tsx`, `index.css`, `darkPageTheme.ts`, `siteChromeTheme.ts` |
| Previous flow | Home forced dark (`site-page-dark`) |

### 4. “Driving Impact At Scale” and title sizes

| Item | Detail |
| --- | --- |
| Why | Larger titles site-wide (investors mostly left except this pass’s stock/related-link work) |
| What | Home title tokens ~`2.15rem` → `3.9rem` at lg; ESG `esgSectionHeading` / `esgSectionTitle` increased; similar bumps on Ash, Careers, Contact, Green Mobility, Newsroom, Refrigerant, Venwind, About shells |
| Files | `HomeSection.tsx`, `esgLayout.ts`, `EsgSectionHeader.tsx`, ash/careers/contact/green-mobility/newsroom/refrigerant/venwind section files, `investorLayout.ts` (small) |

### 5. About Us — Who We Are + copy cleanup

| Item | Detail |
| --- | --- |
| Why | Revamp Who We Are; drop Purpose/Direction numbering chrome; drop named people |
| What | About section layout refresh; Mission/Vision sanitization; committee chips and member counts removed; Jaya Krishna / Sachin Navtosh Jha filtered; leadership modal label removed |
| Files | `AboutSection.tsx`, `MissionVisionSection.tsx`, `CommitteesSection.tsx`, `LeadershipTeamSection.tsx`, `CoreValuesSection.tsx`, `JourneySection.tsx`, `OurPresenceSection.tsx`, `aboutFallbacks.ts` |
| Seeds | `server/seeds/leadership_team.json`, `server/seeds/committees.json` |

### 6. ESG page — match live site

| Item | Detail |
| --- | --- |
| Why | Nature/bird hero, no extra titles, no policy numbers/icons, Governance/HR like Reports |
| What | Hero grid: text + bird/branch, light/dark bg; collage gone; `EsgTopSection` on; titles renamed; policies simplified; Governance/HR report cards; nature showcase not mounted |
| Files | `AwardsHighlightsVisual.tsx`, `EsgTopSection.tsx`, `ESGPoliciesSection.tsx`, `GovernanceSection.tsx`, `HRSection.tsx`, `ReportsSection.tsx`, pillars/vision/wellbeing/SDG/UNSDG/Awards/Collaboration/EsgPageNav, `esg/page.tsx` |
| Asset | `client/public/esg/hummingbird-branch.png` (untracked) |

### 7. Header — remove Power Trading Surrender Petition

| Item | Detail |
| --- | --- |
| Why | Do not show that nav item |
| What | Removed from `POST_ESG_NAV_ITEMS`, `defaultNavItems`, Header CMS defaults; runtime filter remains |
| Files | `Header.tsx`, `HeaderCMS.tsx` |

### 8. Contact

| Item | Detail |
| --- | --- |
| Why | Correct contact hero; drop Factory card |
| What | Seed hero copy; Factory filtered in `OfficeAddresses`; seed Factory row removed |
| Files | `contact/components/HeroSection.tsx`, `OfficeAddresses.tsx`, `ContactHeroSectionCMS.tsx`, `server/seeds/contact_hero.json`, `server/seeds/office_addresses.json` |

### 9. Investors — Historical Stock Quote

| Item | Detail |
| --- | --- |
| Why | Date picker unreadable in dark theme; do not show HTTP 500 |
| What | Light controls; local dates; inverted range clamp; no error banner |
| Files | `HistoricalStockQuote.tsx`, `index.css` |

### 10. Investors — Related Links (live list, local routes)

| Item | Detail |
| --- | --- |
| Why | Related Links must match https://refex.co.in/investors and open local pages |
| What | `mergeInvestorRelatedLinks()` always starts from the 30 fallbacks; `canonicalizeInvestorHref()` rewrites CMS/live URLs to `/investors/:slug`; alias map for transcripts + familiarization; Smart ODR dropped from this list |
| Files | `investorRelatedLinks.ts`, `investorNavLinks.ts`, `RelatedLinks.tsx`, `InvestorSidebar.tsx`, `Sidebar.tsx`, `general-meeting-updates/page.tsx` |

**Related Links (30) — local hrefs**

| Label | Local path |
| --- | --- |
| Key Managerial Personnel | `/investors/key-managerial-personnel` |
| Financial Information | `/investors/financial-information` |
| Annual Reports | `/investors/annual-reports` |
| General Meeting Updates | `/investors/general-meeting-updates` |
| Investor Presentation | `/investors/investor-presentation` |
| Code of fair Disclosure UPSI | `/investors/code-of-fair-disclosure-upsi` |
| Policies | `/investors/policies` |
| Credit Ratings | `/investors/credit-ratings` |
| Recording & Transcripts of Post Earnings / Quarterly Calls | `/investors/recording-transcripts` |
| Disclosure of Material Events or Information | `/investors/disclosure-of-material-events-or-information` |
| Stock Exchange Quarterly Compliance | `/investors/stock-exchange-quarterly-compliance` |
| Familiarization Programme for Independent Directors | `/investors/familiarization-programme` |
| Terms and Conditions of Appointment of ID | `/investors/terms-and-conditions-of-appointment-of-id` |
| IPO | `/investors/ipo` |
| Rights Issue | `/investors/rights-issue` |
| Financial Statement of Subsidiary | `/investors/financial-statement-of-subsidiary` |
| Annual Return | `/investors/annual-return` |
| Book Closure of Members Register / Record Date | `/investors/book-closure-of-members-register-record-date` |
| Secretarial Compliance Report | `/investors/secretarial-compliance-report` |
| Investor Information | `/investors/investor-information` |
| Registrar & Transfer Agent | `/investors/registrar-transfer-agent` |
| Newspaper Publication | `/investors/newspaper-publication` |
| Unpaid Dividend List and IEPF Shares | `/investors/unpaid-dividend-list-and-iepf-shares` |
| Disclosures under SAST Regulations 2011 | `/investors/disclosures-under-sast-regulations-2011` |
| Employee Stock Option Scheme | `/investors/employee-stock-option-scheme` |
| Monitoring Agency Report | `/investors/monitoring-agency-report` |
| Statement of Deviation | `/investors/statement-of-deviation` |
| CSR Activities | `/investors/csr-activities` |
| Charter Documents | `/investors/charter-documents` |
| Scheme of Amalgamation / Arrangement | `/investors/scheme-of-amalgamation-arrangement` |

Router still accepts the long live slugs for transcripts and familiarization.

### 11. Footer ESG hashes

| Item | Detail |
| --- | --- |
| Why | Footer “Refex on ESG” must hit the renamed section |
| What | Aliases: `sustainability-pillars` → `refex-esg`, `sustainable-well-being` → `programs` |
| Files | `client/src/utils/footerLinks.ts` |

### 12. Decorative numbering

Removed 01/02/03-style section numbering on public pages. Date `padStart` on Investors stock widgets is **kept** (real dates, not decoration).

---

## Flows that should still work (unchanged intent)

- Site header dropdowns (About, Business, ESG, Careers) except Power Trading  
- Footer investor subset (Financial Results, Annual Reports, Notices, Policies, Ratings, Investor Information, Newspaper)  
- Admin CMS modules still save; some public pages **ignore or overlay** CMS for the filtered items above  
- Investor dedicated routes (including Smart ODR URL)  
- Welcome modal, theme toggle, homepage GSAP hero pin (hero only)  
- Historical quote search/pagination when the stock API succeeds  

---

## Verify before merge

1. **Home** — light and dark: video only in hero; post-hero not on video; titles large; header/logo size.  
2. **Header** — Power Trading absent on every page; dropdowns still open.  
3. **About** — Who We Are; Mission/Vision without Purpose/Direction; no member chips; no Jaya Krishna / Sachin.  
4. **ESG** — hero text + bird, no collage; titles match live; policies without numbers/icons; Governance/HR like Reports; footer `#refex-esg` and `#programs`.  
5. **Contact** — no Factory card.  
6. **Investors** — date pickers readable in dark theme; no HTTP 500 banner; Related Links 30 items; click KMP, transcripts, familiarization, Scheme of Amalgamation.  
7. **Mobile** — header offset, large titles, ESG hero column.  
8. **CMS** — confirm operators know filters override Header / Leadership / Committees / Contact / Related Links.

Verified locally (14 Oct 2026): Related Links count 30, zero missing labels; sample and remaining investor routes returned 200 with the expected heading.

---

## Rollback

All of this is still uncommitted on `raghul`. To drop the working tree:

```bash
git checkout -- client/src server/seeds
```

Do **not** revert `server/package-lock.json` unless you know why it changed. Untracked preview/tmp files (`client/preview-shots/`, `client/tmp-verify/`, `client/public/esg/hummingbird-branch.png`) need a manual delete if you want them gone.

If already committed later: revert the commit, then re-seed only if you had applied seed JSON to a database.

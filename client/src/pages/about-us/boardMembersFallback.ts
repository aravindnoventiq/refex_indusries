/** Board member fallbacks synced from refex.co.in CMS. */
export type BoardMemberFallback = {
  id: number;
  name: string;
  position: string;
  image?: string;
  linkedin?: string;
  biography?: string;
  directorshipDetails?: string;
  order: number;
  isActive: boolean;
};

export const FALLBACK_BOARD_MEMBERS: BoardMemberFallback[] = [
  {
    "id": 1,
    "name": "Anil Jain",
    "position": "Chairman & Managing Director",
    "image": "https://refex.co.in/uploads/images/image-1765796337988-627466240.jpg",
    "linkedin": "https://www.linkedin.com/in/anil-jain-57864343/",
    "biography": "Anil Jain is the Managing Director of Refex Group. Innately enterprising and venturesome since childhood, business came naturally to Anil. At the tender age of 17, Anil started to spend time in his family’s stainless steel trading business. His passion for identifying opportunities led him to the realm of refrigerant gas, during a meeting with a large air conditioning manufacturer. In 2002, he laid the foundation stone to set up his first refrigerant gas refilling plant under the name of Refex Refrigerants Limited (now Refex Industries Limited). Since then, there has been no looking back! Anil slowly and steadily expanded his business horizon, and Refex ventured into various business domains such as Renewable Energy, Ash & Coal, Pharma, Venture Capital, Airport Transportation, Medical Technology, Green Mobility, and Power Trading.\n\nThroughout his journey, Anil has been a mentor to many entrepreneurs. He wanted to be able to mentor more start-ups and give them the resources and platform they needed to succeed. He has successfully created many such entrepreneurs.\n\nAnil is strongly committed to sustainability and ensures Refex’s business model reflects the same ethos. For all this and much more, Anil has won several industry accolades such as ‘Trailblazer of Tamil Nadu’, ‘Young Entrepreneur’ by the Times Group, Stevie Award from the UK, Dun & Bradstreet Top 100 SMEs award etc. Refex Group under his leadership has been certified as a ‘Great Place to Work’ by GPTW for 2 years in a row.",
    "directorshipDetails": "1. Refex Holding Private Limited (Managing Director)\n2. Refex Industries Limited (Managing Director)\n3. Refex Renewables & Infrastructure Limited\n4. 3i Medical Technologies Private Limited\n5. Silres Energy Solutions Private Limited\n6. Refex Green Power Limited\n7. Refex Airports and Transportation Private Limited\n8. Refex Vayu SPV-1 Private Limited\n9. AJ Incubation Forum\n10. Venwind Refex Power Limited\n11. R.L.Fine Chem Private Limited\n12. PHD Chamber of Commerce and Industry\n13. Venwind Refex Limited\n14. Refex Life Sciences Private Limited\n15. EMCO Limited\n16. Lee Pharma Limited",
    "order": 1,
    "isActive": true
  },
  {
    "id": 2,
    "name": "Dinesh Kumar Agarwal",
    "position": "Whole – Time Director & Chief Financial Officer",
    "image": "https://refex.co.in/uploads/images/image-1765796347467-8419279.jpg",
    "linkedin": "https://www.linkedin.com/in/dinesh-agarwal-b561a714/",
    "biography": "Mr. Dinesh Kumar Agarwal possesses refined entrepreneurial skills across diverse business domains, contributing to consistent success in all his business endeavours. Since 2014, his expertise, combined with his passion and zeal to grow the Company’s business, has accelerated our growth trajectory. Mr. Dinesh’s acumen in numbers has facilitated the growth of several businesses while his expertise in Corporate Finance, spanning Audit, Financial Accounting and Planning, Tax and Fundraising has helped raise over ₹ 5,000 Crores for his clients. He has worked with reputed organisations like Aircel and Brisk and holds diverse experience in Solar EPC segments and Utility-scale projects. He has also served as a consultant for start-ups, SMEs, established Corporate Houses, and International NGOs and has won several industry recognitions for his contribution to management stream and related areas.",
    "directorshipDetails": "1. Refex Holding Private Limited (CFO, Whole-Time Director, CEO)\n2. Refex Industries Limited (CFO, Whole-Time Director)\n3. Anam Medical Solutions Private Limited\n4. Refex Life Sciences Private Limited\n5. Prime MRO Engineering Services Private Limited\n6. VS Lignite Power Private Limited\n7. Sourashakthi Energy Private Limited\n8. Refex Renewables & Infrastructure Limited\n9. Venwind Refex Limited\n10. Venwind Refex Power Limited\n11. Refex Solar Power Private Limited\n12. EMCO Limited\n13. Refex Airports Retail Private Limited\n14. Refex Airports Retail Srinagar Private Limited",
    "order": 2,
    "isActive": true
  },
  {
    "id": 3,
    "name": "Susmitha Siripurapu",
    "position": "Non – Executive Director",
    "image": "https://refex.co.in/uploads/images/image-1765796362882-207330655.jpg",
    "linkedin": "https://www.linkedin.com/in/susmitha-siripurapu-0a3bb380/",
    "biography": "Susmitha is an accomplished Strategy and Program Management professional. She holds a Bachelors in Engineering degree from Osmania University with a specialization in Computer science. Post which, she worked in Consulting verticals with the BIG 4’s and helped large, multinational corporates optimize and digitalize the lease administration and accounting processes in their capital projects, optimize their facilities, and re-size their real estate portfolios. \n\nEver since, she has been working in strategy roles and gained hands-on experience in developing data-driven strategic and managerial initiatives and ensuring timely and within-budget implementations. She possesses a demonstrated record in building strong leadership networks, collaborating across countries, and enabling high-performance operating models/teams across diversified industry verticals. She has proven to be adept at leveraging analytics for decision-making, formulating strategies for growth, improving efficiency in operations, and developing advanced reporting structures.\n\nAcademically, she completed an MBA from HEC Paris &  Duke University.",
    "directorshipDetails": "1. Refex Industries Limited\n2. Venwind Refex Projects Limited\n3. Welfund Sustainable Assets SPV-1 Private Limited\n4. Modepro (India) Private Limited\n5. Refex Mobility Limited\n6. Vyzag Bio-Energy Fuel Private Limited\n7. Refex CBG SPV (Salem) Limited\n8. Refex CBG SPV (Madurai) Limited\n9. Refex CBG SPV (Coimbatore) Limited\n10. Venwind Refex Power Services Limited\n11. Refex Solar SPV Five Limited\n12. Refex Engineering Products Private Limited",
    "order": 3,
    "isActive": true
  },
  {
    "id": 4,
    "name": "Dr. Vineet Kothari",
    "position": "Independent Director",
    "image": "https://refex.co.in/uploads/images/image-1765796373690-544256775.jpg",
    "biography": "Dr. Kothari is a Senior Advocate at the Supreme Court of India and a distinguished legal luminary, known for his expertise across Constitutional, Taxation (Domestic & International), Corporate, Insolvency, Arbitration, Property, and Family laws. His advisory work also spans key regulatory domains including FEMA, FERA, and PMLA. With a strong footprint in Alternate Dispute Resolution, he is empaneled with leading High Court–annexed arbitration centers across India, and serves on the panels of the Nani Palkhivala Arbitration Centre, Singapore International Arbitration Centre (SIAC), and Dubai International Arbitration Centre (DIAC). He is also a Senior Advisor to KPMG India and currently serves on the Governing Council of the Indian Council of Arbitration (ICA), FICCI.\n\n\nDr. Kothari’s illustrious judicial career includes serving as a Judge across the High Courts of Rajasthan, Karnataka, Madras, and Gujarat, and he has held the position of Acting Chief Justice at both the Madras and Gujarat High Courts.",
    "directorshipDetails": "1. Refex Industries Limited\n2. ICAI Registered Valuers Organisation",
    "order": 4,
    "isActive": true
  },
  {
    "id": 5,
    "name": "Sivaramakrishnan Vasudevan",
    "position": "Independent Director",
    "image": "https://refex.co.in/uploads/images/image-1765796389322-858740973.jpg",
    "biography": "Mr. Sivaramakrishnan Vasudevan is a highly experienced finance professional. For the past 40 years, he has worked in the field of Corporate Law, Finance and allied subjects. He has wide exposure in diverse industries including plantation, textiles, mining, hospitality and banking and specialises in Appraisal, Valuation, and FEMA related matters. Over the years, he has handled corporate accounts and matters related to Audit and Tax, appeared before Tribunals, and participated in Board/Committee Meetings, with special reference to Nominee Directors from Financial Institutions/BIFR. He is an expert in vetting legal documents. \n\nPresently, he serves as a Consultant/Advisor to a group of companies in Chennai. He is a commerce graduate and holds Fellow Membership of the Institute of Company Secretaries of India.",
    "directorshipDetails": "1. Refex Industries Limited",
    "order": 5,
    "isActive": true
  },
  {
    "id": 6,
    "name": "Latha Venkatesh",
    "position": "Independent Director",
    "image": "https://refex.co.in/uploads/images/image-1765796399603-214118886.jpg",
    "biography": "Ms. Latha Venkatesh is a qualified Cost and Management Accountant (CMA). She is a senior Auditor with eleven years of experience in practice. Having worked with clients in multiple industries, she has good knowledge and vast experience in cost audit, internal audits, processes and standards that significantly improve the opinion on company records, banking practices and management & taxation, technology driven performances. She has engaged with multiple business sectors like Engineering & Manufacturing, Construction & Civil Engineering and Banking.",
    "directorshipDetails": "1. Refex Industries Limited\n2. Refex Renewables & Infrastructure Limited\n3. Kwick Forensic Solutions Limited\n4. K.S. Oils Limited",
    "order": 6,
    "isActive": true
  },
  {
    "id": 7,
    "name": "Ramesh Dugar",
    "position": "Independent Director",
    "image": "https://refex.co.in/uploads/images/image-1765796415353-180492492.jpg",
    "linkedin": "https://www.linkedin.com/in/ramesh-dugar-461a1b132/",
    "biography": "Mr. Ramesh Dugar, Director of Dugar Group of Companies, is a leading industrialist with vast experience in diverse fields such as Finance, Investments, and Real Estate. He plays a pivotal role in streamlining risk management and corporate governance for the Company. An enthusiastic and passionate leader who believes in contributing to society, he is a trustee for several charitable trusts. He also holds the prestigious positions of Chairman – All India Manufacturers Organisation and Vice Chairman – Hindustan Chamber of Commerce. \n\nMr. Ramesh is a graduate in Commerce and holds a diploma in Marketing Management (LIBA) from Loyola.",
    "directorshipDetails": "1. Refex Industries Limited\n2. Hindustan Chamber of Commerce\n3. Dugar Finance and Investments Limited (Managing Director)",
    "order": 7,
    "isActive": true
  }
];

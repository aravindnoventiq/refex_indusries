/**
 * Generic export script for dynamic investor pages.
 *
 * Usage:
 *   node scripts/export-investor-dynamic-page-to-seed.js <slug> <seedFileName>
 *
 * Example:
 *   node scripts/export-investor-dynamic-page-to-seed.js unpaid-dividend-list-and-iepf-shares investors_unpaid_dividend_list.json
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

const slug = process.argv[2];
const seedFileName = process.argv[3];

if (!slug || !seedFileName) {
  console.error(
    '❌ Usage: node scripts/export-investor-dynamic-page-to-seed.js <slug> <seedFileName>'
  );
  process.exit(1);
}

async function exportToSeed() {
  console.log('='.repeat(70));
  console.log(`Exporting dynamic investor page "${slug}" to seed JSON`);
  console.log('='.repeat(70));

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug },
    });

    if (!pageContent) {
      console.log(`❌ No page found in database for slug: ${slug}`);
      return;
    }

    const seedData = {
      slug: pageContent.slug,
      title: pageContent.title,
      hasYearFilter: pageContent.hasYearFilter || false,
      filterItems: pageContent.filterItems || [],
      isActive: pageContent.isActive,
      sections: pageContent.sections || [],
    };

    const seedPath = path.join(__dirname, '..', 'seeds', seedFileName);
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2) + '\n');

    console.log(`✓ Exported to: ${seedPath}`);
    console.log(`  - Title: ${seedData.title}`);
    console.log(`  - Year Filter: ${seedData.hasYearFilter}`);
    console.log(
      `  - Filter Items: ${seedData.filterItems.join(', ')}`
    );
    console.log(`  - Sections: ${seedData.sections.length}`);

    let totalDocs = 0;
    seedData.sections.forEach((section) => {
      totalDocs += (section.documents || []).length;
    });
    console.log(`  - Documents: ${totalDocs}`);
  } catch (error) {
    console.error('❌ Export error:', error);
  } finally {
    await db.sequelize.close();
  }
}

exportToSeed();



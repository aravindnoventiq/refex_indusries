/**
 * Export current unpaid-dividend-list-and-iepf-shares page data from database to seed JSON.
 *
 * Run with: node scripts/export-unpaid-dividend-list-to-seed.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

async function exportToSeed() {
  console.log('='.repeat(70));
  console.log('Exporting Unpaid Dividend List and IEPF Shares to Seed JSON');
  console.log('='.repeat(70));

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'unpaid-dividend-list-and-iepf-shares' },
    });

    if (!pageContent) {
      console.log(
        '❌ No unpaid-dividend-list-and-iepf-shares page found in database'
      );
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

    const seedPath = path.join(
      __dirname,
      '..',
      'seeds',
      'investors_unpaid_dividend_list.json'
    );
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



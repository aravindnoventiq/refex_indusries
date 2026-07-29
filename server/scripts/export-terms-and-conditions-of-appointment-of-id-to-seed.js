/**
 * Export current terms-and-conditions-of-appointment-of-id page data from database to seed JSON.
 *
 * Run with: node scripts/export-terms-and-conditions-of-appointment-of-id-to-seed.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

async function exportToSeed() {
  console.log('='.repeat(70));
  console.log(
    'Exporting Terms and Conditions of Appointment of ID to Seed JSON'
  );
  console.log('='.repeat(70));

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'terms-and-conditions-of-appointment-of-id' },
    });

    if (!pageContent) {
      console.log(
        '❌ No terms-and-conditions-of-appointment-of-id page found in database'
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
      'investors_terms_and_conditions_of_appointment_id.json'
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



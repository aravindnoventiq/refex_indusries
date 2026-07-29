/**
 * Export current scheme-of-amalgamation-arrangement page data from database to seed JSON
 * This updates the seed file with current database state (including local PDF paths)
 * 
 * Run with: node scripts/export-scheme-of-amalgamation-arrangement-to-seed.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

async function exportToSeed() {
  console.log('='.repeat(60));
  console.log('Exporting Scheme of Amalgamation Arrangement to Seed JSON');
  console.log('='.repeat(60));

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'scheme-of-amalgamation-arrangement' }
    });

    if (!pageContent) {
      console.log('❌ No scheme-of-amalgamation-arrangement page found in database');
      return;
    }

    const seedData = {
      slug: pageContent.slug,
      title: pageContent.title,
      hasYearFilter: pageContent.hasYearFilter,
      filterItems: pageContent.filterItems || [],
      isActive: pageContent.isActive,
      sections: pageContent.sections || []
    };

    const seedPath = path.join(__dirname, '..', 'seeds', 'investors_scheme_of_amalgamation_arrangement.json');
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2) + '\n');

    console.log(`✓ Exported to: ${seedPath}`);
    console.log(`  - Title: ${seedData.title}`);
    console.log(`  - Year Filter: ${seedData.hasYearFilter}`);
    console.log(`  - Sections: ${seedData.sections.length}`);
    
    let totalDocs = 0;
    seedData.sections.forEach(section => {
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


/**
 * Export current investor-presentation page data from database to seed JSON
 * This updates the seed file with current database state (including local PDF paths)
 * 
 * Run with: node scripts/export-investor-presentation-to-seed.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

async function exportToSeed() {
  console.log('='.repeat(60));
  console.log('Exporting Investor Presentation to Seed JSON');
  console.log('='.repeat(60));

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'investor-presentation' }
    });

    if (!pageContent) {
      console.log('❌ No investor-presentation page found in database');
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

    const seedPath = path.join(__dirname, '..', 'seeds', 'investors_investor_presentation.json');
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2) + '\n');

    console.log(`✓ Exported to: ${seedPath}`);
    console.log(`  - Title: ${seedData.title}`);
    console.log(`  - Year Filter: ${seedData.hasYearFilter}`);
    console.log(`  - Filter Items: ${seedData.filterItems.join(', ')}`);
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



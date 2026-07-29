/**
 * Export current registrar-transfer-agent page data from database to seed JSON
 * This updates the seed file with current database state (including local PDF paths)
 * 
 * Run with: node scripts/export-registrar-transfer-agent-to-seed.js
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

async function exportToSeed() {
  console.log('='.repeat(60));
  console.log('Exporting Registrar Transfer Agent to Seed JSON');
  console.log('='.repeat(60));

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'registrar-transfer-agent' }
    });

    if (!pageContent) {
      console.log('❌ No registrar-transfer-agent page found in database');
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

    const seedPath = path.join(__dirname, '..', 'seeds', 'investors_registrar_transfer_agent.json');
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2) + '\n');

    console.log(`✓ Exported to: ${seedPath}`);
    console.log(`  - Title: ${seedData.title}`);
    console.log(`  - Year Filter: ${seedData.hasYearFilter}`);
    console.log(`  - Sections: ${seedData.sections.length}`);
    
    let totalContents = 0;
    let totalDocs = 0;
    seedData.sections.forEach(section => {
      totalContents += (section.contents || []).length;
      totalDocs += (section.documents || []).length;
    });
    console.log(`  - Contents: ${totalContents}`);
    console.log(`  - Documents: ${totalDocs}`);

  } catch (error) {
    console.error('❌ Export error:', error);
  } finally {
    await db.sequelize.close();
  }
}

exportToSeed();


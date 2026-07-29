const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_registrar_transfer_agent.json");

async function seedInvestorsRegistrarTransferAgent() {
  try {
    console.log("Starting to seed Investors Registrar Transfer Agent page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Registrar Transfer Agent page updated: ${page.title}`);
    } else {
      console.log(`✓ Registrar Transfer Agent page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const contentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.contents ? section.contents.length : 0), 0)
      : 0;
    
    console.log(`  - Sections: ${sectionsCount}`);
    console.log(`  - Contents: ${contentsCount}`);
    console.log(`✓ Registrar Transfer Agent page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Registrar Transfer Agent page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsRegistrarTransferAgent();
}

module.exports = seedInvestorsRegistrarTransferAgent;


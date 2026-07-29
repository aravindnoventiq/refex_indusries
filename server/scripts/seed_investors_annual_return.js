const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_annual_return.json");

async function seedInvestorsAnnualReturn() {
  try {
    console.log("Starting to seed Investors Annual Return page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Annual Return page updated: ${page.title}`);
    } else {
      console.log(`✓ Annual Return page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const documentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.documents ? section.documents.length : 0), 0)
      : 0;
    const filterItemsCount = pageData.filterItems ? pageData.filterItems.length : 0;
    
    console.log(`  - Sections: ${sectionsCount}`);
    console.log(`  - Documents: ${documentsCount}`);
    console.log(`  - Filter Years: ${filterItemsCount}`);
    console.log(`✓ Annual Return page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Annual Return page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsAnnualReturn();
}

module.exports = seedInvestorsAnnualReturn;


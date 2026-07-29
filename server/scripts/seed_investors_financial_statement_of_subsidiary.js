const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_financial_statement_of_subsidiary.json");

async function seedInvestorsFinancialStatementOfSubsidiary() {
  try {
    console.log("Starting to seed Investors Financial Statement of Subsidiary page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Financial Statement of Subsidiary page updated: ${page.title}`);
    } else {
      console.log(`✓ Financial Statement of Subsidiary page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const documentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.documents ? section.documents.length : 0), 0)
      : 0;
    const filterItemsCount = pageData.filterItems ? pageData.filterItems.length : 0;
    
    console.log(`  - Subsidiaries: ${sectionsCount}`);
    console.log(`  - Documents: ${documentsCount}`);
    console.log(`  - Filter Years: ${filterItemsCount}`);
    console.log(`✓ Financial Statement of Subsidiary page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Financial Statement of Subsidiary page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsFinancialStatementOfSubsidiary();
}

module.exports = seedInvestorsFinancialStatementOfSubsidiary;


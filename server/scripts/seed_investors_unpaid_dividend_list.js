const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_unpaid_dividend_list.json");

async function seedInvestorsUnpaidDividendList() {
  try {
    console.log("Starting to seed Investors Unpaid Dividend List page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Unpaid Dividend List page updated: ${page.title}`);
    } else {
      console.log(`✓ Unpaid Dividend List page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const documentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.documents ? section.documents.length : 0), 0)
      : 0;
    const filterItemsCount = pageData.filterItems ? pageData.filterItems.length : 0;
    const contentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.contents ? section.contents.length : 0), 0)
      : 0;
    
    console.log(`  - Sections: ${sectionsCount}`);
    console.log(`  - Documents: ${documentsCount}`);
    console.log(`  - Filter Years: ${filterItemsCount}`);
    console.log(`  - Nodal Officer Info: ${contentsCount > 0 ? 'Yes' : 'No'}`);
    console.log(`✓ Unpaid Dividend List page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Unpaid Dividend List page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsUnpaidDividendList();
}

module.exports = seedInvestorsUnpaidDividendList;


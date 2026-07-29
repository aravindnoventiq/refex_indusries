const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_newspaper_publication.json");

async function seedInvestorsNewspaperPublication() {
  try {
    console.log("Starting to seed Investors Newspaper Publication page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Newspaper Publication page updated: ${page.title}`);
    } else {
      console.log(`✓ Newspaper Publication page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const documentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.documents ? section.documents.length : 0), 0)
      : 0;
    const filterItemsCount = pageData.filterItems ? pageData.filterItems.length : 0;
    
    console.log(`  - Categories: ${sectionsCount}`);
    console.log(`  - Documents: ${documentsCount}`);
    console.log(`  - Filter Years: ${filterItemsCount}`);
    console.log(`✓ Newspaper Publication page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Newspaper Publication page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsNewspaperPublication();
}

module.exports = seedInvestorsNewspaperPublication;


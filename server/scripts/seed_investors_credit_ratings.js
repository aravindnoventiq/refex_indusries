const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_credit_ratings.json");

async function seedInvestorsCreditRatings() {
  try {
    console.log("Starting to seed Investors Credit Ratings page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Credit Ratings page updated: ${page.title}`);
    } else {
      console.log(`✓ Credit Ratings page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const documentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.documents ? section.documents.length : 0), 0)
      : 0;
    
    console.log(`  - Sections: ${sectionsCount}`);
    console.log(`  - Documents: ${documentsCount}`);
    console.log(`✓ Credit Ratings page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Credit Ratings page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsCreditRatings();
}

module.exports = seedInvestorsCreditRatings;


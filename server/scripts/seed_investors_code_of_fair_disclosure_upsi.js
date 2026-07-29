const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_code_of_fair_disclosure_upsi.json");

async function seedInvestorsCodeOfFairDisclosureUPSI() {
  try {
    console.log("Starting to seed Investors Code of Fair Disclosure UPSI page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Code of Fair Disclosure UPSI page updated: ${page.title}`);
    } else {
      console.log(`✓ Code of Fair Disclosure UPSI page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const documentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.documents ? section.documents.length : 0), 0)
      : 0;
    
    console.log(`  - Sections: ${sectionsCount}`);
    console.log(`  - Documents: ${documentsCount}`);
    console.log(`✓ Code of Fair Disclosure UPSI page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Code of Fair Disclosure UPSI page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsCodeOfFairDisclosureUPSI();
}

module.exports = seedInvestorsCodeOfFairDisclosureUPSI;


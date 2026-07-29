const { InvestorsPageContent, sequelize } = require("../models");
const pageData = require("../seeds/investors_terms_and_conditions_of_appointment_id.json");

async function seedInvestorsTermsAndConditionsOfAppointmentID() {
  try {
    console.log("Starting to seed Investors Terms and Conditions of Appointment of ID page...");
    await sequelize.authenticate();
    console.log("Database connection established");

    const [page, created] = await InvestorsPageContent.findOrCreate({
      where: { slug: pageData.slug },
      defaults: pageData,
    });

    if (!created) {
      await page.update(pageData);
      console.log(`✓ Terms and Conditions of Appointment of ID page updated: ${page.title}`);
    } else {
      console.log(`✓ Terms and Conditions of Appointment of ID page created: ${page.title}`);
    }

    // Log summary
    const sectionsCount = pageData.sections ? pageData.sections.length : 0;
    const documentsCount = pageData.sections 
      ? pageData.sections.reduce((total, section) => total + (section.documents ? section.documents.length : 0), 0)
      : 0;
    
    console.log(`  - Sections: ${sectionsCount}`);
    console.log(`  - Documents: ${documentsCount}`);
    console.log(`✓ Terms and Conditions of Appointment of ID page seeded successfully!`);
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Terms and Conditions of Appointment of ID page:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsTermsAndConditionsOfAppointmentID();
}

module.exports = seedInvestorsTermsAndConditionsOfAppointmentID;


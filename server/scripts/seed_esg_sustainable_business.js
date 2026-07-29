const { EsgSustainableBusiness } = require("../models");
const sectionData = require("../seeds/esg_sustainable_business.json");

async function seedSection() {
  try {
    console.log("Starting to seed ESG Sustainable Business section...");

    const [section, created] = await EsgSustainableBusiness.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!created) {
      await section.update(sectionData);
    }

    console.log(`✓ ESG Sustainable Business section seeded successfully!`);
    console.log(`  Title: ${section.title}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Sustainable Business section:", error);
    process.exit(1);
  }
}

seedSection();


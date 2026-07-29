const { EsgRefexOnEsg } = require("../models");
const sectionData = require("../seeds/esg_refex_on_esg.json");

async function seedSection() {
  try {
    console.log("Starting to seed ESG Refex on ESG section...");

    const [section, created] = await EsgRefexOnEsg.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!created) {
      await section.update(sectionData);
    }

    console.log(`✓ ESG Refex on ESG section seeded successfully!`);
    console.log(`  Title: ${section.title}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Refex on ESG section:", error);
    process.exit(1);
  }
}

seedSection();


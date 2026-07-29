const { EsgSdgSection } = require("../models");
const sectionData = require("../seeds/esg_sdg_section.json");

async function seedSdgSection() {
  try {
    console.log("Starting to seed ESG SDG section...");

    // Seed section
    const [section, sectionCreated] = await EsgSdgSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ SDG section seeded: ${section.title.replace(/\n/g, ' ')}`);
    console.log("✓ ESG SDG section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG SDG section:", error);
    process.exit(1);
  }
}

seedSdgSection();


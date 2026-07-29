const { VenwindRefexVisitWebsite } = require("../models");
const sectionData = require("../seeds/venwind_refex_visit_website.json");

async function seedVisitWebsite() {
  try {
    console.log("Starting to seed venwind refex visit website section...");

    const [section, created] = await VenwindRefexVisitWebsite.findOrCreate({
      where: { id: 1 },
      defaults: sectionData,
    });

    if (!created) {
      await section.update(sectionData);
    }

    console.log(`✓ Visit website section ${created ? 'created' : 'updated'}`);
    console.log("✓ Venwind refex visit website section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding visit website section:", error);
    process.exit(1);
  }
}

seedVisitWebsite();


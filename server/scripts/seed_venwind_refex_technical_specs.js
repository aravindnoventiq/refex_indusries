const { VenwindRefexTechnicalSpec } = require("../models");
const specsData = require("../seeds/venwind_refex_technical_specs.json");

async function seedTechnicalSpecs() {
  try {
    console.log("Starting to seed venwind refex technical specs...");

    for (const specData of specsData) {
      const [spec, created] = await VenwindRefexTechnicalSpec.findOrCreate({
        where: { label: specData.label },
        defaults: specData,
      });

      if (!created) {
        await spec.update(specData);
      }

      console.log(`✓ ${spec.label}`);
    }

    console.log("✓ Venwind refex technical specs seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding technical specs:", error);
    process.exit(1);
  }
}

seedTechnicalSpecs();


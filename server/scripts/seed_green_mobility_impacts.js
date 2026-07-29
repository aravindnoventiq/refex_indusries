const { GreenMobilityImpact } = require("../models");
const impactsData = require("../seeds/green_mobility_impacts.json");

async function seedImpacts() {
  try {
    console.log("Starting to seed green mobility impacts...");

    for (const impactData of impactsData) {
      const [impact, created] = await GreenMobilityImpact.findOrCreate({
        where: { label: impactData.label },
        defaults: impactData,
      });

      if (!created) {
        await impact.update(impactData);
      }

      console.log(`✓ ${impact.label} - ${impact.number}`);
    }

    console.log("✓ Green mobility impacts seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding impacts:", error);
    process.exit(1);
  }
}

seedImpacts();


const { AshUtilizationImpact } = require("../models");
const impactsData = require("../seeds/ash_utilization_impacts.json");

async function seedImpacts() {
  try {
    console.log("Starting to seed ash utilization impacts...");

    for (const impactData of impactsData) {
      const [impact, created] = await AshUtilizationImpact.findOrCreate({
        where: { label: impactData.label },
        defaults: impactData,
      });

      if (!created) {
        await impact.update(impactData);
      }

      console.log(`✓ ${impact.label} - ${impact.number}`);
    }

    console.log("✓ Ash utilization impacts seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding impacts:", error);
    process.exit(1);
  }
}

seedImpacts();


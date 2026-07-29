const { RefrigerantGasImpact } = require("../models");
const impactsData = require("../seeds/refrigerant_gas_impacts.json");

async function seedImpacts() {
  try {
    console.log("Starting to seed refrigerant gas impacts...");

    for (const impactData of impactsData) {
      const [impact, created] = await RefrigerantGasImpact.findOrCreate({
        where: { title: impactData.title },
        defaults: impactData,
      });

      if (!created) {
        await impact.update(impactData);
      }

      console.log(`✓ ${impact.title}`);
    }

    console.log("✓ Refrigerant gas impacts seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding impacts:", error);
    process.exit(1);
  }
}

seedImpacts();


const { RefrigerantGasWhyChooseUs } = require("../models");
const featuresData = require("../seeds/refrigerant_gas_why_choose_us.json");

async function seedWhyChooseUs() {
  try {
    console.log("Starting to seed refrigerant gas why choose us features...");

    for (const featureData of featuresData) {
      const [feature, created] = await RefrigerantGasWhyChooseUs.findOrCreate({
        where: { title: featureData.title },
        defaults: featureData,
      });

      if (!created) {
        await feature.update(featureData);
      }

      console.log(`✓ ${feature.title}`);
    }

    console.log("✓ Refrigerant gas why choose us features seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding why choose us features:", error);
    process.exit(1);
  }
}

seedWhyChooseUs();


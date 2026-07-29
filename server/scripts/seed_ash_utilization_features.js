const { AshUtilizationFeature } = require("../models");
const featuresData = require("../seeds/ash_utilization_features.json");

async function seedFeatures() {
  try {
    console.log("Starting to seed ash utilization features...");

    for (const featureData of featuresData) {
      const [feature, created] = await AshUtilizationFeature.findOrCreate({
        where: { title: featureData.title },
        defaults: featureData,
      });

      if (!created) {
        await feature.update(featureData);
      }

      console.log(`✓ ${feature.title}`);
    }

    console.log("✓ Ash utilization features seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding features:", error);
    process.exit(1);
  }
}

seedFeatures();


const { GreenMobilityWhyChooseUs } = require("../models");
const featuresData = require("../seeds/green_mobility_why_choose_us.json");

async function seedWhyChooseUs() {
  try {
    console.log("Starting to seed green mobility why choose us features...");

    for (const featureData of featuresData) {
      const [feature, created] = await GreenMobilityWhyChooseUs.findOrCreate({
        where: { title: featureData.title },
        defaults: featureData,
      });

      if (!created) {
        await feature.update(featureData);
      }

      console.log(`✓ ${feature.title}`);
    }

    console.log("✓ Green mobility why choose us features seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding why choose us features:", error);
    process.exit(1);
  }
}

seedWhyChooseUs();


const { VenwindRefexWhyChooseUs } = require("../models");
const featuresData = require("../seeds/venwind_refex_why_choose_us.json");

async function seedWhyChooseUs() {
  try {
    console.log("Starting to seed venwind refex why choose us features...");

    for (const featureData of featuresData) {
      const [feature, created] = await VenwindRefexWhyChooseUs.findOrCreate({
        where: { title: featureData.title },
        defaults: featureData,
      });

      if (!created) {
        await feature.update(featureData);
      }

      console.log(`✓ ${feature.title}`);
    }

    console.log("✓ Venwind refex why choose us features seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding why choose us features:", error);
    process.exit(1);
  }
}

seedWhyChooseUs();


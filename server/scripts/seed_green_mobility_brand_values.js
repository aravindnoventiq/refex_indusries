const { GreenMobilityBrandValue } = require("../models");
const valuesData = require("../seeds/green_mobility_brand_values.json");

async function seedBrandValues() {
  try {
    console.log("Starting to seed green mobility brand values...");

    for (const valueData of valuesData) {
      const [value, created] = await GreenMobilityBrandValue.findOrCreate({
        where: { title: valueData.title },
        defaults: valueData,
      });

      if (!created) {
        await value.update(valueData);
      }

      console.log(`✓ ${value.title}`);
    }

    console.log("✓ Green mobility brand values seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding brand values:", error);
    process.exit(1);
  }
}

seedBrandValues();


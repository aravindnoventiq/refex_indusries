const { GreenMobilitySustainability } = require("../models");
const sustainabilityData = require("../seeds/green_mobility_sustainability.json");

async function seedSustainability() {
  try {
    console.log("Starting to seed green mobility sustainability section...");

    const existing = await GreenMobilitySustainability.findOne({ order: [["id", "DESC"]] });
    
    if (existing) {
      await existing.update(sustainabilityData);
      console.log("✓ Sustainability section updated");
    } else {
      await GreenMobilitySustainability.create(sustainabilityData);
      console.log("✓ Sustainability section created");
    }

    console.log("✓ Green mobility sustainability section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding sustainability section:", error);
    process.exit(1);
  }
}

seedSustainability();


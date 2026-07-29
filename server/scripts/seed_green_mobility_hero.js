const { GreenMobilityHero } = require("../models");
const heroData = require("../seeds/green_mobility_hero.json");

async function seedHero() {
  try {
    console.log("Starting to seed green mobility hero section...");

    const existing = await GreenMobilityHero.findOne({ order: [["id", "DESC"]] });
    
    if (existing) {
      await existing.update(heroData);
      console.log("✓ Updated green mobility hero section");
    } else {
      await GreenMobilityHero.create(heroData);
      console.log("✓ Created green mobility hero section");
    }

    console.log("✓ Green mobility hero section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding green mobility hero:", error);
    process.exit(1);
  }
}

seedHero();


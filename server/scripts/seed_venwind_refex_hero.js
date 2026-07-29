const { VenwindRefexHero } = require("../models");
const heroData = require("../seeds/venwind_refex_hero.json");

async function seedHero() {
  try {
    console.log("Starting to seed venwind refex hero section...");

    const existing = await VenwindRefexHero.findOne({ order: [["id", "DESC"]] });
    
    if (existing) {
      await existing.update(heroData);
      console.log("✓ Hero section updated");
    } else {
      await VenwindRefexHero.create(heroData);
      console.log("✓ Hero section created");
    }

    console.log("✓ Venwind Refex hero section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding hero section:", error);
    process.exit(1);
  }
}

seedHero();


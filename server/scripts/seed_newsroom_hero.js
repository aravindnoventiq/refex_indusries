const { NewsroomHero } = require("../models");
const heroData = require("../seeds/newsroom_hero.json");

async function seedNewsroomHero() {
  try {
    console.log("Starting to seed Newsroom Hero section...");

    // Seed hero
    const [hero, created] = await NewsroomHero.findOrCreate({
      where: { title: heroData.title },
      defaults: heroData,
    });

    if (!created) {
      await hero.update(heroData);
    }

    console.log(`✓ Newsroom Hero section seeded: ${hero.title}`);
    console.log("✓ Newsroom Hero section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Newsroom Hero section:", error);
    process.exit(1);
  }
}

seedNewsroomHero();


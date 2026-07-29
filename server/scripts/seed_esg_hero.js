const { EsgHero } = require("../models");
const heroData = require("../seeds/esg_hero.json");

async function seedHero() {
  try {
    console.log("Starting to seed ESG hero section...");

    const [hero, created] = await EsgHero.findOrCreate({
      where: { title: heroData.title },
      defaults: heroData,
    });

    if (!created) {
      await hero.update(heroData);
    }

    console.log(`✓ ESG Hero section seeded successfully!`);
    console.log(`  Title: ${hero.title}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG hero:", error);
    process.exit(1);
  }
}

seedHero();


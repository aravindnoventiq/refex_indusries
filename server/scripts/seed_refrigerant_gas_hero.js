const { RefrigerantGasHero } = require("../models");
const heroData = require("../seeds/refrigerant_gas_hero.json");

async function seedHero() {
  try {
    console.log("Starting to seed refrigerant gas hero section...");

    const [hero, created] = await RefrigerantGasHero.findOrCreate({
      where: { id: 1 },
      defaults: heroData,
    });

    if (!created) {
      await hero.update(heroData);
    }

    console.log(`✓ Hero section ${created ? 'created' : 'updated'}`);
    console.log("✓ Refrigerant gas hero section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding hero section:", error);
    process.exit(1);
  }
}

seedHero();


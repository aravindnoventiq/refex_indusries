const { InvestorsHero, sequelize } = require("../models");
const heroData = require("../seeds/investors_hero.json");

async function seedInvestorsHero() {
  try {
    console.log("Starting to seed Investors Hero section...");

    // Connect to database
    await sequelize.authenticate();
    console.log("Database connection established");

    // Seed hero - try to find existing or create new
    const existing = await InvestorsHero.findOne({ order: [["id", "DESC"]] });
    
    if (existing) {
      await existing.update(heroData);
      console.log(`✓ Investors Hero section updated: ${existing.title}`);
    } else {
      const hero = await InvestorsHero.create(heroData);
      console.log(`✓ Investors Hero section created: ${hero.title}`);
    }

    console.log("✓ Investors Hero section seeded successfully!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Hero section:", error);
    await sequelize.close();
    process.exit(1);
  }
}

seedInvestorsHero();


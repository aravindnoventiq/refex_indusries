const { ContactHero } = require("../models");
const contactHeroData = require("../seeds/contact_hero.json");

async function seedContactHero() {
  try {
    console.log("Starting to seed Contact Hero section...");

    for (const data of contactHeroData) {
      const [hero, created] = await ContactHero.upsert(data, {
        returning: true,
      });
      if (created) {
        console.log(`✓ Contact Hero section seeded: ${hero.title}`);
      } else {
        console.log(`✓ Contact Hero section updated: ${hero.title}`);
      }
    }

    console.log("✓ Contact Hero section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Contact Hero section:", error);
    process.exit(1);
  }
}

seedContactHero();


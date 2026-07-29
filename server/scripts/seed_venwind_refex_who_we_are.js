const { VenwindRefexWhoWeAre } = require("../models");
const whoWeAreData = require("../seeds/venwind_refex_who_we_are.json");

async function seedWhoWeAre() {
  try {
    console.log("Starting to seed venwind refex who we are section...");

    const existing = await VenwindRefexWhoWeAre.findOne({ order: [["id", "DESC"]] });
    
    if (existing) {
      await existing.update(whoWeAreData);
      console.log("✓ Who We Are section updated");
    } else {
      await VenwindRefexWhoWeAre.create(whoWeAreData);
      console.log("✓ Who We Are section created");
    }

    console.log("✓ Venwind Refex who we are section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding who we are section:", error);
    process.exit(1);
  }
}

seedWhoWeAre();


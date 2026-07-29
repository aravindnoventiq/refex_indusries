const { GreenMobilityWhoWeAre } = require("../models");
const sectionData = require("../seeds/green_mobility_who_we_are.json");

async function seedWhoWeAre() {
  try {
    console.log("Starting to seed green mobility who we are section...");

    const existing = await GreenMobilityWhoWeAre.findOne({ order: [["id", "DESC"]] });
    
    if (existing) {
      await existing.update(sectionData);
      console.log("✓ Updated green mobility who we are section");
    } else {
      await GreenMobilityWhoWeAre.create(sectionData);
      console.log("✓ Created green mobility who we are section");
    }

    console.log("✓ Green mobility who we are section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding green mobility who we are:", error);
    process.exit(1);
  }
}

seedWhoWeAre();


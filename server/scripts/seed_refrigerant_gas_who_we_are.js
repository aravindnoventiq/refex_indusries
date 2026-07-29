const { RefrigerantGasWhoWeAre } = require("../models");
const sectionData = require("../seeds/refrigerant_gas_who_we_are.json");

async function seedWhoWeAre() {
  try {
    console.log("Starting to seed refrigerant gas who we are section...");

    const [section, created] = await RefrigerantGasWhoWeAre.findOrCreate({
      where: { id: 1 },
      defaults: sectionData,
    });

    if (!created) {
      await section.update(sectionData);
    }

    console.log(`✓ Who we are section ${created ? 'created' : 'updated'}`);
    console.log("✓ Refrigerant gas who we are section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding who we are section:", error);
    process.exit(1);
  }
}

seedWhoWeAre();


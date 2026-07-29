const { EsgHrSection, EsgHrItem } = require("../models");
const sectionData = require("../seeds/esg_hr_section.json");
const itemsData = require("../seeds/esg_hr_items.json");

async function seedHr() {
  try {
    console.log("Starting to seed ESG HR section...");

    // Seed section header
    const [section, sectionCreated] = await EsgHrSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed HR items
    for (const itemData of itemsData) {
      const [item, created] = await EsgHrItem.findOrCreate({
        where: { title: itemData.title },
        defaults: itemData,
      });

      if (!created) {
        await item.update(itemData);
      }

      console.log(`✓ ${item.title}`);
    }

    console.log("✓ ESG HR section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG HR section:", error);
    process.exit(1);
  }
}

seedHr();


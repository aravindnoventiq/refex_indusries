const { EsgGovernanceSection, EsgGovernanceItem } = require("../models");
const sectionData = require("../seeds/esg_governance_section.json");
const itemsData = require("../seeds/esg_governance_items.json");

async function seedGovernance() {
  try {
    console.log("Starting to seed ESG Governance section...");

    // Seed section header
    const [section, sectionCreated] = await EsgGovernanceSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed governance items
    for (const itemData of itemsData) {
      const [item, created] = await EsgGovernanceItem.findOrCreate({
        where: { title: itemData.title },
        defaults: itemData,
      });

      if (!created) {
        await item.update(itemData);
      }

      console.log(`✓ ${item.title}`);
    }

    console.log("✓ ESG Governance section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Governance section:", error);
    process.exit(1);
  }
}

seedGovernance();


const { EsgUnsdgActionsSection, EsgUnsdgAction } = require("../models");
const sectionData = require("../seeds/esg_unsdg_actions_section.json");
const actionsData = require("../seeds/esg_unsdg_actions.json");

async function seedUnsdgActions() {
  try {
    console.log("Starting to seed ESG UN SDG Actions section...");

    // Seed section header
    const [section, sectionCreated] = await EsgUnsdgActionsSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed actions
    for (const actionData of actionsData) {
      const [action, created] = await EsgUnsdgAction.findOrCreate({
        where: { title: actionData.title },
        defaults: actionData,
      });

      if (!created) {
        await action.update(actionData);
      }

      console.log(`✓ ${action.title}`);
    }

    console.log("✓ ESG UN SDG Actions section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG UN SDG Actions section:", error);
    process.exit(1);
  }
}

seedUnsdgActions();


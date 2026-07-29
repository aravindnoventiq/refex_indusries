const { NewsroomTab } = require("../models");
const tabsData = require("../seeds/newsroom_tabs.json");

async function seedNewsroomTabs() {
  try {
    console.log("Starting to seed Newsroom Tabs...");

    // Seed tabs
    for (const tabData of tabsData) {
      const [tab, created] = await NewsroomTab.findOrCreate({
        where: { key: tabData.key },
        defaults: tabData,
      });

      if (!created) {
        await tab.update(tabData);
      }

      console.log(`✓ ${tab.label} (${tab.key})`);
    }

    console.log("✓ Newsroom Tabs seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Newsroom Tabs:", error);
    process.exit(1);
  }
}

seedNewsroomTabs();


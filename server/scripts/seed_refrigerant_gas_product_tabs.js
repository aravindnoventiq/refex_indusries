const { RefrigerantGasProductTab, RefrigerantGasProductTabPoint } = require("../models");
const tabsData = require("../seeds/refrigerant_gas_product_tabs.json");
const pointsData = require("../seeds/refrigerant_gas_product_tab_points.json");

async function seedProductTabs() {
  try {
    console.log("Starting to seed refrigerant gas product tabs...");

    // Seed tabs
    for (const tabData of tabsData) {
      const [tab, created] = await RefrigerantGasProductTab.findOrCreate({
        where: { tabId: tabData.tabId },
        defaults: tabData,
      });

      if (!created) {
        await tab.update(tabData);
      }

      console.log(`✓ Tab: ${tab.label}`);
    }

    // Seed points
    for (const pointData of pointsData) {
      const [point, created] = await RefrigerantGasProductTabPoint.findOrCreate({
        where: { 
          tabId: pointData.tabId,
          description: pointData.description,
        },
        defaults: pointData,
      });

      if (!created) {
        await point.update(pointData);
      }

      console.log(`✓ Point: ${pointData.description?.substring(0, 50) || pointData.title || 'N/A'}...`);
    }

    console.log("✓ Refrigerant gas product tabs seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding product tabs:", error);
    process.exit(1);
  }
}

seedProductTabs();


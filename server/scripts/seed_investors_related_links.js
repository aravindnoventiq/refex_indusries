const { InvestorsRelatedLink, InvestorsKeyPersonnel, InvestorsRelatedLinksSection, sequelize } = require("../models");
const linksData = require("../seeds/investors_related_links.json");
const personnelData = require("../seeds/investors_key_personnel.json");
const sectionData = require("../seeds/investors_related_links_section.json");

async function seedInvestorsRelatedLinks() {
  try {
    console.log("Starting to seed Investors Related Links section...");
    await sequelize.authenticate();
    console.log("Database connection established");

    // Seed section settings
    const [section, sectionCreated] = await InvestorsRelatedLinksSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });
    if (!sectionCreated) {
      await section.update(sectionData);
      console.log(`✓ Related Links Section updated: ${section.title}`);
    } else {
      console.log(`✓ Related Links Section created: ${section.title}`);
    }

    // Seed links
    console.log(`\nSeeding ${linksData.length} related links...`);
    for (const linkData of linksData) {
      const [link, created] = await InvestorsRelatedLink.findOrCreate({
        where: { name: linkData.name, href: linkData.href },
        defaults: linkData,
      });
      if (!created) {
        await link.update(linkData);
        console.log(`  ✓ Link updated: ${link.name}`);
      } else {
        console.log(`  ✓ Link created: ${link.name}`);
      }
    }

    // Seed key personnel
    console.log(`\nSeeding ${personnelData.length} key personnel...`);
    for (const personnelDataItem of personnelData) {
      const [personnel, created] = await InvestorsKeyPersonnel.findOrCreate({
        where: { name: personnelDataItem.name },
        defaults: personnelDataItem,
      });
      if (!created) {
        await personnel.update(personnelDataItem);
        console.log(`  ✓ Personnel updated: ${personnel.name}`);
      } else {
        console.log(`  ✓ Personnel created: ${personnel.name}`);
      }
    }

    console.log("\n✓ Investors Related Links section seeded successfully!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Investors Related Links section:", error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedInvestorsRelatedLinks();
}

module.exports = seedInvestorsRelatedLinks;


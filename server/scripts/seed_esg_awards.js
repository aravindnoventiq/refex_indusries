const { EsgAwardsSection, EsgAward } = require("../models");
const sectionData = require("../seeds/esg_awards_section.json");
const awardsData = require("../seeds/esg_awards.json");

async function seedAwards() {
  try {
    console.log("Starting to seed ESG Awards section...");

    // Seed section header
    const [section, sectionCreated] = await EsgAwardsSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed awards
    for (const awardData of awardsData) {
      const [award, created] = await EsgAward.findOrCreate({
        where: { title: awardData.title },
        defaults: awardData,
      });

      if (!created) {
        await award.update(awardData);
      }

      console.log(`✓ ${award.title}`);
    }

    console.log("✓ ESG Awards section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Awards section:", error);
    process.exit(1);
  }
}

seedAwards();


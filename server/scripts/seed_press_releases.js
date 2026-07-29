const { PressRelease } = require("../models");
const releasesData = require("../seeds/press_releases.json");

async function seedPressReleases() {
  try {
    console.log("Starting to seed Press Releases...");

    // Seed press releases
    for (const releaseData of releasesData) {
      const [release, created] = await PressRelease.findOrCreate({
        where: { title: releaseData.title },
        defaults: releaseData,
      });

      if (!created) {
        await release.update(releaseData);
      }

      console.log(`✓ ${release.title}`);
    }

    console.log("✓ Press Releases seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Press Releases:", error);
    process.exit(1);
  }
}

seedPressReleases();


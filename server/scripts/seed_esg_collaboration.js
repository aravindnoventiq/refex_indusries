const { EsgCollaborationSection, EsgMainCollaboration, EsgDevelopmentalOrgsSection, EsgDevelopmentalOrg } = require("../models");
const sectionData = require("../seeds/esg_collaboration_section.json");
const mainCollabData = require("../seeds/esg_main_collaboration.json");
const orgsSectionData = require("../seeds/esg_developmental_orgs_section.json");
const orgsData = require("../seeds/esg_developmental_orgs.json");

async function seedCollaboration() {
  try {
    console.log("Starting to seed ESG Collaboration section...");

    // Seed section header
    const [section, sectionCreated] = await EsgCollaborationSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed main collaboration
    const [mainCollab, mainCollabCreated] = await EsgMainCollaboration.findOrCreate({
      where: { title: mainCollabData.title },
      defaults: mainCollabData,
    });

    if (!mainCollabCreated) {
      await mainCollab.update(mainCollabData);
    }

    console.log(`✓ Main collaboration seeded: ${mainCollab.title}`);

    // Seed organizations section header
    const [orgsSection, orgsSectionCreated] = await EsgDevelopmentalOrgsSection.findOrCreate({
      where: { title: orgsSectionData.title },
      defaults: orgsSectionData,
    });

    if (!orgsSectionCreated) {
      await orgsSection.update(orgsSectionData);
    }

    console.log(`✓ Organizations section header seeded: ${orgsSection.title}`);

    // Seed organizations
    for (const orgData of orgsData) {
      const [org, created] = await EsgDevelopmentalOrg.findOrCreate({
        where: { title: orgData.title },
        defaults: orgData,
      });

      if (!created) {
        await org.update(orgData);
      }

      console.log(`✓ ${org.title}`);
    }

    console.log("✓ ESG Collaboration section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Collaboration section:", error);
    process.exit(1);
  }
}

seedCollaboration();


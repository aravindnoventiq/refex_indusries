const { EsgPoliciesSection, EsgPolicy } = require("../models");
const sectionData = require("../seeds/esg_policies_section.json");
const policiesData = require("../seeds/esg_policies.json");

async function seedPolicies() {
  try {
    console.log("Starting to seed ESG Policies section...");

    // Seed section header
    const [section, sectionCreated] = await EsgPoliciesSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed policies
    for (const policyData of policiesData) {
      const [policy, created] = await EsgPolicy.findOrCreate({
        where: { title: policyData.title },
        defaults: policyData,
      });

      if (!created) {
        await policy.update(policyData);
      }

      console.log(`✓ ${policy.title}`);
    }

    console.log("✓ ESG Policies section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Policies section:", error);
    process.exit(1);
  }
}

seedPolicies();


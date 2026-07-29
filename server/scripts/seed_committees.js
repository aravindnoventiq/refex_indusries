const { Committee, CommitteeMember } = require("../models");
const committeesData = require("../seeds/committees.json");

async function seedCommittees() {
  try {
    console.log("Starting to seed committees...");

    for (const committeeData of committeesData) {
      const { members, ...committeeFields } = committeeData;

      // Create or find committee
      const [committee, created] = await Committee.findOrCreate({
        where: { name: committeeFields.name },
        defaults: committeeFields,
      });

      if (!created) {
        // Update existing committee
        await committee.update(committeeFields);
        // Delete existing members
        await CommitteeMember.destroy({ where: { committeeId: committee.id } });
      }

      // Create members
      if (members && Array.isArray(members)) {
        for (const memberData of members) {
          await CommitteeMember.create({
            committeeId: committee.id,
            ...memberData,
          });
        }
      }

      console.log(`✓ ${committee.name} - ${members?.length || 0} members`);
    }

    console.log("✓ Committees seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding committees:", error);
    process.exit(1);
  }
}

seedCommittees();


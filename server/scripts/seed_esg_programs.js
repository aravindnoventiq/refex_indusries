const { EsgProgramsSection, EsgProgram } = require("../models");
const sectionData = require("../seeds/esg_programs_section.json");
const programsData = require("../seeds/esg_programs.json");

async function seedPrograms() {
  try {
    console.log("Starting to seed ESG Programs section...");

    // Seed section header
    const [section, sectionCreated] = await EsgProgramsSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed programs
    for (const programData of programsData) {
      const [program, created] = await EsgProgram.findOrCreate({
        where: { title: programData.title },
        defaults: programData,
      });

      if (!created) {
        await program.update(programData);
      }

      console.log(`✓ ${program.title}`);
    }

    console.log("✓ ESG Programs section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Programs section:", error);
    process.exit(1);
  }
}

seedPrograms();


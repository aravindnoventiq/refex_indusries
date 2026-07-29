const { EsgReportsSection, EsgReport } = require("../models");
const sectionData = require("../seeds/esg_reports_section.json");
const reportsData = require("../seeds/esg_reports.json");

async function seedReports() {
  try {
    console.log("Starting to seed ESG Reports section...");

    // Seed section header
    const [section, sectionCreated] = await EsgReportsSection.findOrCreate({
      where: { title: sectionData.title },
      defaults: sectionData,
    });

    if (!sectionCreated) {
      await section.update(sectionData);
    }

    console.log(`✓ Section header seeded: ${section.title}`);

    // Seed reports
    for (const reportData of reportsData) {
      const [report, created] = await EsgReport.findOrCreate({
        where: { title: reportData.title },
        defaults: reportData,
      });

      if (!created) {
        await report.update(reportData);
      }

      console.log(`✓ ${report.title}`);
    }

    console.log("✓ ESG Reports section seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding ESG Reports section:", error);
    process.exit(1);
  }
}

seedReports();


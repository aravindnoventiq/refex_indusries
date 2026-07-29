const { AshUtilizationService } = require("../models");
const servicesData = require("../seeds/ash_utilization_services.json");

async function seedServices() {
  try {
    console.log("Starting to seed ash utilization services...");

    for (const serviceData of servicesData) {
      const [service, created] = await AshUtilizationService.findOrCreate({
        where: { title: serviceData.title },
        defaults: serviceData,
      });

      if (!created) {
        await service.update(serviceData);
      }

      console.log(`✓ ${service.title}`);
    }

    console.log("✓ Ash utilization services seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding services:", error);
    process.exit(1);
  }
}

seedServices();


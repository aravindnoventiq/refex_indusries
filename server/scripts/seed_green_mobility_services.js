const { GreenMobilityService } = require("../models");
const servicesData = require("../seeds/green_mobility_services.json");

async function seedServices() {
  try {
    console.log("Starting to seed green mobility services...");

    for (const serviceData of servicesData) {
      const [service, created] = await GreenMobilityService.findOrCreate({
        where: { title: serviceData.title },
        defaults: serviceData,
      });

      if (!created) {
        await service.update(serviceData);
      }

      console.log(`✓ ${service.title}`);
    }

    console.log("✓ Green mobility services seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding services:", error);
    process.exit(1);
  }
}

seedServices();


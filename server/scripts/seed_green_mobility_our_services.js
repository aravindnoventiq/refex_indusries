const { GreenMobilityOurService } = require("../models");
const servicesData = require("../seeds/green_mobility_our_services.json");

async function seedOurServices() {
  try {
    console.log("Starting to seed green mobility our services...");

    for (const serviceData of servicesData) {
      const [service, created] = await GreenMobilityOurService.findOrCreate({
        where: { title: serviceData.title },
        defaults: serviceData,
      });

      if (!created) {
        await service.update(serviceData);
      }

      console.log(`✓ ${service.title}`);
    }

    console.log("✓ Green mobility our services seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding our services:", error);
    process.exit(1);
  }
}

seedOurServices();


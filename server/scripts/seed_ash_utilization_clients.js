const { AshUtilizationClient } = require("../models");
const clientsData = require("../seeds/ash_utilization_clients.json");

async function seedClients() {
  try {
    console.log("Starting to seed ash utilization clients...");

    for (const clientData of clientsData) {
      // Use category and image as unique identifier
      const [client, created] = await AshUtilizationClient.findOrCreate({
        where: { 
          category: clientData.category,
          image: clientData.image 
        },
        defaults: clientData,
      });

      if (!created) {
        await client.update(clientData);
      }

      console.log(`✓ ${clientData.category} - ${clientData.image.split('/').pop()}`);
    }

    console.log("✓ Ash utilization clients seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding clients:", error);
    process.exit(1);
  }
}

seedClients();


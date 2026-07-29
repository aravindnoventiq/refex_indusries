const { GreenMobilityClient } = require("../models");
const clientsData = require("../seeds/green_mobility_clients.json");

async function seedClients() {
  try {
    console.log("Starting to seed green mobility clients...");

    for (const clientData of clientsData) {
      const [client, created] = await GreenMobilityClient.findOrCreate({
        where: { image: clientData.image },
        defaults: clientData,
      });

      if (!created) {
        await client.update(clientData);
      }

      console.log(`✓ Client ${client.id} - ${clientData.image.substring(clientData.image.lastIndexOf('/') + 1)}`);
    }

    console.log("✓ Green mobility clients seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding clients:", error);
    process.exit(1);
  }
}

seedClients();


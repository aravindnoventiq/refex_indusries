const { RefrigerantGasClient } = require("../models");
const clientsData = require("../seeds/refrigerant_gas_clients.json");

async function seedClients() {
  try {
    console.log("Starting to seed refrigerant gas clients...");

    for (const clientData of clientsData) {
      // Use image URL as unique identifier since we don't have a name field
      const [client, created] = await RefrigerantGasClient.findOrCreate({
        where: { image: clientData.image },
        defaults: clientData,
      });

      if (!created) {
        await client.update(clientData);
      }

      console.log(`✓ Client ${client.id} (order: ${client.order})`);
    }

    console.log("✓ Refrigerant gas clients seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding clients:", error);
    process.exit(1);
  }
}

seedClients();


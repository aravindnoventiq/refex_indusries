const { OfficeAddress } = require("../models");
const addressesData = require("../seeds/office_addresses.json");

async function seedOfficeAddresses() {
  try {
    console.log("Starting to seed Office Addresses...");

    for (const addressData of addressesData) {
      const [address, created] = await OfficeAddress.findOrCreate({
        where: { title: addressData.title },
        defaults: addressData,
      });

      if (!created) {
        await address.update(addressData);
      }

      console.log(`✓ ${address.title}`);
    }

    console.log("✓ Office Addresses seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding Office Addresses:", error);
    process.exit(1);
  }
}

seedOfficeAddresses();


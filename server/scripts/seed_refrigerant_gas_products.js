const { RefrigerantGasProduct } = require("../models");
const productsData = require("../seeds/refrigerant_gas_products.json");

async function seedProducts() {
  try {
    console.log("Starting to seed refrigerant gas products...");

    for (const productData of productsData) {
      const [product, created] = await RefrigerantGasProduct.findOrCreate({
        where: { name: productData.name },
        defaults: productData,
      });

      if (!created) {
        await product.update(productData);
      }

      console.log(`✓ ${product.name}`);
    }

    console.log("✓ Refrigerant gas products seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();


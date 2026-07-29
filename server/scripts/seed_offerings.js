require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, Offering } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/offerings.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert by order/title combo
  for (const item of data) {
    const [row] = await Offering.findOrCreate({
      where: { order: item.order, title: item.title },
      defaults: {
        title: item.title,
        description: item.description,
        image: item.image,
        link: item.link,
        order: item.order,
        isActive: !!item.isActive,
      },
    });
    if (row) {
      await row.update({ 
        description: item.description,
        image: item.image,
        link: item.link,
        isActive: !!item.isActive 
      });
    }
  }

  console.log("✅ Seeded offerings (businesses)");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});

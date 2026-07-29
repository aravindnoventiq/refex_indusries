require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, FlipCard } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/flip_cards.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert by order/title combo
  for (const item of data) {
    const [row] = await FlipCard.findOrCreate({
      where: { order: item.order, title: item.title },
      defaults: {
        title: item.title,
        description: item.description,
        image: item.image,
        backImage: item.backImage,
        link: item.link,
        order: item.order,
        isActive: !!item.isActive,
      },
    });
    if (row) {
      await row.update({
        description: item.description,
        image: item.image,
        backImage: item.backImage,
        link: item.link,
        isActive: !!item.isActive,
      });
    }
  }

  console.log("✅ Seeded flip cards");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});


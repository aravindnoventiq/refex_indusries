require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, ValueItem } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/value_items.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert by title
  for (const item of data) {
    const [row] = await ValueItem.findOrCreate({
      where: { title: item.title },
      defaults: {
        letter: item.letter || null,
        title: item.title,
        description: item.description,
        image: item.image || null,
        icon: item.icon || null,
        color: item.color || null,
        order: item.order,
        isActive: !!item.isActive,
      },
    });
    if (row) {
      await row.update({
        letter: item.letter || null,
        description: item.description,
        image: item.image || null,
        icon: item.icon || null,
        color: item.color || null,
        order: item.order,
        isActive: !!item.isActive,
      });
    }
  }

  console.log("✅ Seeded value items");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});


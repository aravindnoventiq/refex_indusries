require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, Statistic } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/statistics.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert by order/title combo
  for (const item of data) {
    const [row] = await Statistic.findOrCreate({
      where: { order: item.order, title: item.title },
      defaults: {
        title: item.title,
        value: item.value,
        description: item.description,
        image: item.image,
        color: item.color,
        order: item.order,
        isActive: !!item.isActive,
      },
    });
    if (row) {
      await row.update({
        value: item.value,
        description: item.description,
        image: item.image,
        color: item.color,
        isActive: !!item.isActive,
      });
    }
  }

  console.log("✅ Seeded statistics (at a glance)");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});

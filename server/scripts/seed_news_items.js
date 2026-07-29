require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, NewsItem } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/news_items.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert by order/title combo
  for (const item of data) {
    const [row] = await NewsItem.findOrCreate({
      where: { order: item.order, title: item.title },
      defaults: {
        title: item.title,
        image: item.image,
        link: item.link,
        category: item.category,
        publishedDate: item.publishedDate ? new Date(item.publishedDate) : null,
        order: item.order,
        isActive: !!item.isActive,
      },
    });
    if (row) {
      await row.update({
        image: item.image,
        link: item.link,
        category: item.category,
        publishedDate: item.publishedDate ? new Date(item.publishedDate) : null,
        isActive: !!item.isActive,
      });
    }
  }

  console.log("✅ Seeded news items");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});


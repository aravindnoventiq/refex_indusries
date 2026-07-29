require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, StickyNavItem } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/sticky_nav_items.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert by sectionId
  for (const item of data) {
    const [row] = await StickyNavItem.findOrCreate({
      where: { sectionId: item.sectionId },
      defaults: {
        name: item.name,
        href: item.href,
        sectionId: item.sectionId,
        order: item.order,
        isActive: !!item.isActive,
      },
    });
    if (row) {
      await row.update({
        name: item.name,
        href: item.href,
        order: item.order,
        isActive: !!item.isActive,
      });
    }
  }

  console.log("✅ Seeded sticky nav items");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});


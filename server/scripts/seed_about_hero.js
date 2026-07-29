require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, AboutHero } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/about_hero.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Find or create the hero record
  let hero = await AboutHero.findOne({ order: [["id", "DESC"]] });
  
  if (hero) {
    await hero.update({
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      backgroundImage: data.backgroundImage,
      logoCards: data.logoCards || null,
      isActive: !!data.isActive,
    });
  } else {
    await AboutHero.create({
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      backgroundImage: data.backgroundImage,
      logoCards: data.logoCards || null,
      isActive: !!data.isActive,
    });
  }

  console.log("✅ Seeded about hero section");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});


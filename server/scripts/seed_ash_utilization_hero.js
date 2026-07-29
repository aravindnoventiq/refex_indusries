require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, AshUtilizationHero } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/ash_utilization_hero.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert - find existing or create new
  let hero = await AshUtilizationHero.findOne({ order: [["id", "DESC"]] });
  if (!hero) {
    hero = await AshUtilizationHero.create(data);
  } else {
    await hero.update(data);
  }

  console.log("✅ Seeded ash utilization hero section");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await sequelize.close();
  process.exit(1);
});


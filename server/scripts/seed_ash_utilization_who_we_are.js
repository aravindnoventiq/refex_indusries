require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, AshUtilizationWhoWeAre } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/ash_utilization_who_we_are.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert - find existing or create new
  let section = await AshUtilizationWhoWeAre.findOne({ order: [["id", "DESC"]] });
  if (!section) {
    section = await AshUtilizationWhoWeAre.create(data);
  } else {
    await section.update(data);
  }

  console.log("✅ Seeded ash utilization who we are section");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await sequelize.close();
  process.exit(1);
});


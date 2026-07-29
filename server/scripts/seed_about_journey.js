require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, AboutJourney } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/about_journey.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert - find existing or create new
  let journey = await AboutJourney.findOne({ order: [["id", "DESC"]] });
  if (!journey) {
    journey = await AboutJourney.create(data);
  } else {
    await journey.update(data);
  }

  console.log("✅ Seeded about journey section");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await sequelize.close();
  process.exit(1);
});


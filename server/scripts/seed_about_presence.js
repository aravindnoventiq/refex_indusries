require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, AboutPresence } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/about_presence.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Upsert - find existing or create new
  let presence = await AboutPresence.findOne({ order: [["id", "DESC"]] });
  if (!presence) {
    presence = await AboutPresence.create(data);
  } else {
    await presence.update(data);
  }

  console.log("✅ Seeded about presence section");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await sequelize.close();
  process.exit(1);
});


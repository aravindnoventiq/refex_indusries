require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, AboutPageSection } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/about_page_section.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Find or create the section record
  let section = await AboutPageSection.findOne({ order: [["id", "DESC"]] });
  
  if (section) {
    await section.update({
      title: data.title,
      content: data.content,
      isActive: !!data.isActive,
    });
  } else {
    await AboutPageSection.create({
      title: data.title,
      content: data.content,
      isActive: !!data.isActive,
    });
  }

  console.log("✅ Seeded about page section");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});


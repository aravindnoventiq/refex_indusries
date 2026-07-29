require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, LeadershipMember } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/board_members.json");
  const raw = fs.readFileSync(file, "utf-8").replace(/^\uFEFF/, "");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  for (const item of data) {
    const [row] = await LeadershipMember.findOrCreate({
      where: { name: item.name, category: "Board Member" },
      defaults: {
        name: item.name,
        position: item.position,
        category: "Board Member",
        image: item.image || null,
        linkedin: item.linkedin || null,
        biography: item.biography || null,
        directorshipDetails: item.directorshipDetails || null,
        description: null,
        achievementsJson: null,
        experience: null,
        education: null,
        color: null,
        order: item.order,
        isActive: !!item.isActive,
      },
    });

    await row.update({
      position: item.position,
      image: item.image || null,
      linkedin: item.linkedin || null,
      biography: item.biography || null,
      directorshipDetails: item.directorshipDetails || null,
      order: item.order,
      isActive: !!item.isActive,
    });
  }

  console.log("✅ Seeded board members (with biography & directorship details)");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try {
    await sequelize.close();
  } catch (_) {}
  process.exit(1);
});

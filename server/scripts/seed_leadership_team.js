require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, LeadershipMember } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/leadership_team.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Deactivate removed leadership entries
  await LeadershipMember.update(
    { isActive: false },
    {
      where: {
        name: "Gagan Bihari Pattnaik",
        category: "Leadership Team",
      },
    }
  );

  // Upsert by name and category
  for (const item of data) {
    const [row] = await LeadershipMember.findOrCreate({
      where: { name: item.name, category: 'Leadership Team' },
      defaults: {
        name: item.name,
        position: item.position,
        category: 'Leadership Team',
        image: item.image || null,
        description: null,
        achievementsJson: null,
        experience: null,
        education: null,
        color: null,
        order: item.order,
        isActive: !!item.isActive,
      },
    });
    if (row) {
      await row.update({
        position: item.position,
        image: item.image || null,
        order: item.order,
        isActive: !!item.isActive,
      });
    }
  }

  console.log("✅ Seeded leadership team members");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await sequelize.close();
  process.exit(1);
});


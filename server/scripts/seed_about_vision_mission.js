require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { sequelize, AboutVisionMission } = require("../models");

async function main() {
  const file = path.join(__dirname, "../seeds/about_vision_mission.json");
  const raw = fs.readFileSync(file, "utf-8");
  const data = JSON.parse(raw);

  await sequelize.authenticate();
  await sequelize.sync();

  // Find or create the vision mission record
  let vm = await AboutVisionMission.findOne({ order: [["id", "DESC"]] });
  
  if (vm) {
    await vm.update({
      visionTitle: data.visionTitle,
      visionDescription: data.visionDescription || null,
      visionImage: data.visionImage || null,
      missionTitle: data.missionTitle,
      missionImage: data.missionImage || null,
      missionPointsJson: data.missionPoints ? JSON.stringify(data.missionPoints) : null,
      isActive: data.isActive !== undefined ? !!data.isActive : true,
    });
  } else {
    await AboutVisionMission.create({
      visionTitle: data.visionTitle,
      visionDescription: data.visionDescription || null,
      visionImage: data.visionImage || null,
      missionTitle: data.missionTitle,
      missionImage: data.missionImage || null,
      missionPointsJson: data.missionPoints ? JSON.stringify(data.missionPoints) : null,
      isActive: data.isActive !== undefined ? !!data.isActive : true,
    });
  }

  console.log("✅ Seeded about vision mission section");
  await sequelize.close();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});

/**
 * Ensure CMS Admin users exist (create or reset password).
 *
 * 1) aravind.srinivasan@refex.co.in / Vasan@2026
 * 2) admin@refex.com / admin123
 *
 * If the app uses Docker MySQL (host "mysql"), run INSIDE the app container:
 *   docker exec -it <app-container> sh -c "cd /app/server && node scripts/create_admin_user.js"
 *
 * Or override host when running on the host machine:
 *   DB_HOST=127.0.0.1 DB_USER=root DB_PASSWORD=rootpassword DB_NAME=industries node scripts/create_admin_user.js
 *
 * Local:
 *   node scripts/create_admin_user.js
 */

require("dotenv").config();
const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const saltRounds = 10;

const ADMIN_USERS = [
  {
    firstName: "Aravind",
    lastName: "Srinivasan",
    email: "aravind.srinivasan@refex.co.in",
    password: "Vasan@2026",
    mobileNumber: "9962479687",
    userType: "Admin",
  },
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@refex.com",
    password: "admin123",
    mobileNumber: "9999999999",
    userType: "Admin",
  },
];

async function upsertAdminUser(creds) {
  const existingUser = await User.findOne({
    where: { email: creds.email },
    paranoid: false,
  });

  const hashedPassword = bcrypt.hashSync(creds.password, saltRounds);

  if (existingUser) {
    await User.update(
      {
        first_name: creds.firstName,
        last_name: creds.lastName,
        password: hashedPassword,
        user_type: creds.userType,
        is_active: true,
        deleted_at: null,
        modified_at: new Date(),
      },
      { where: { id: existingUser.id }, paranoid: false },
    );
    console.log("✓ Updated admin:", creds.email);
    return existingUser.id;
  }

  const newUser = await User.create({
    id: uuidv4(),
    first_name: creds.firstName,
    last_name: creds.lastName,
    email: creds.email,
    password: hashedPassword,
    mobile_number: creds.mobileNumber,
    user_type: creds.userType,
    is_active: true,
    created_at: new Date(),
    modified_at: new Date(),
  });

  console.log("✓ Created admin:", creds.email);
  return newUser.id;
}

async function main() {
  try {
    const cfg = sequelize?.config || {};
    console.log(
      `Connecting DB host=${cfg.host || process.env.DB_HOST || "(unknown)"} env=${process.env.NODE_ENV || "development"}`,
    );
    await sequelize.authenticate();
    console.log("Updating CMS admin credentials...");

    for (const creds of ADMIN_USERS) {
      await upsertAdminUser(creds);
    }

    console.log("\nLogin Credentials:");
    for (const creds of ADMIN_USERS) {
      console.log(`- ${creds.email} / ${creds.password}`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Error updating admin user:", error.message);
    if (String(error.message).includes("mysql") || error.code === "EAI_AGAIN") {
      console.error(`
Hostname "mysql" only works inside Docker.

Try one of these:

1) Inside the app container:
   docker ps
   docker exec -it <app-container-name> sh -c "cd /app/server && node scripts/create_admin_user.js"

2) From the host, point at local MySQL:
   DB_HOST=127.0.0.1 DB_USER=root DB_PASSWORD=rootpassword DB_NAME=industries node scripts/create_admin_user.js
`);
    }
    process.exit(1);
  }
}

main();

/**
 * Ensure CMS Admin user exists and remove the legacy admin@refex.com account.
 *
 * Email: aravind.srinivasan@refex.co.in
 * Password: Vasan@2026
 *
 * Run from server folder:
 *   node scripts/create_admin_user.js
 */

require("dotenv").config();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const saltRounds = 10;

const ADMIN_CREDENTIALS = {
  firstName: "Aravind",
  lastName: "Srinivasan",
  email: "aravind.srinivasan@refex.co.in",
  password: "Vasan@2026",
  mobileNumber: "9999999998",
  userType: "Admin",
};

const LEGACY_ADMIN_EMAIL = "admin@refex.com";

async function upsertAdminUser() {
  const existingUser = await User.findOne({
    where: { email: ADMIN_CREDENTIALS.email },
  });

  const hashedPassword = bcrypt.hashSync(ADMIN_CREDENTIALS.password, saltRounds);

  if (existingUser) {
    await User.update(
      {
        first_name: ADMIN_CREDENTIALS.firstName,
        last_name: ADMIN_CREDENTIALS.lastName,
        password: hashedPassword,
        user_type: ADMIN_CREDENTIALS.userType,
        is_active: true,
        deleted_at: null,
      },
      { where: { id: existingUser.id }, paranoid: false },
    );
    console.log("✓ Updated existing admin:", ADMIN_CREDENTIALS.email);
    return existingUser.id;
  }

  const newUser = await User.create({
    id: uuidv4(),
    first_name: ADMIN_CREDENTIALS.firstName,
    last_name: ADMIN_CREDENTIALS.lastName,
    email: ADMIN_CREDENTIALS.email,
    password: hashedPassword,
    mobile_number: ADMIN_CREDENTIALS.mobileNumber,
    user_type: ADMIN_CREDENTIALS.userType,
    is_active: true,
    created_at: new Date(),
    modified_at: new Date(),
  });

  console.log("✓ Created admin:", ADMIN_CREDENTIALS.email);
  return newUser.id;
}

async function removeLegacyAdmin() {
  const legacy = await User.findOne({
    where: { email: LEGACY_ADMIN_EMAIL },
    paranoid: false,
  });

  if (!legacy) {
    console.log("✓ Legacy admin not found:", LEGACY_ADMIN_EMAIL);
    return;
  }

  // Soft-delete + deactivate so login cannot succeed
  await User.update(
    {
      is_active: false,
      deleted_at: new Date(),
      modified_at: new Date(),
    },
    { where: { id: legacy.id }, paranoid: false },
  );

  console.log("✓ Removed legacy admin login:", LEGACY_ADMIN_EMAIL);
}

async function main() {
  try {
    console.log("Updating CMS admin credentials...");
    await upsertAdminUser();
    await removeLegacyAdmin();

    console.log("\nLogin Credentials:");
    console.log("Email:", ADMIN_CREDENTIALS.email);
    console.log("Password:", ADMIN_CREDENTIALS.password);
    process.exit(0);
  } catch (error) {
    console.error("Error updating admin user:", error.message);
    console.error(error);
    process.exit(1);
  }
}

main();

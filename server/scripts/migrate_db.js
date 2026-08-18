/**
 * CMS DB migrate — idempotent, production-safe.
 *
 * Only applies the schema needed for the latest CMS work:
 *   - careers_page, legal_pages, product_pages
 *   - about_presence.states_json
 *   - footer / leadership / investors CMS columns
 *   - users.user_type InvestorsCMS enum
 *
 * Does NOT run sequelize.sync({ alter: true }) on every table
 * (avoids MySQL "Too many keys" on large production dumps).
 *
 * Usage:
 *   cd server
 *   NODE_ENV=production npm run db:migrate
 *   NODE_ENV=development npm run db:migrate
 *   node scripts/migrate_db.js --env=production
 */

require("dotenv").config();

const envArg = process.argv.find((arg) => arg.startsWith("--env="));
if (envArg) {
  process.env.NODE_ENV = envArg.slice("--env=".length);
} else if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const { sequelize } = require("../models");

const NEW_TABLES = [
  {
    name: "careers_page",
    sql: `
      CREATE TABLE IF NOT EXISTS \`careers_page\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`hero_eyebrow\` VARCHAR(255) NULL,
        \`hero_title\` VARCHAR(255) NOT NULL,
        \`hero_subtitle\` TEXT NULL,
        \`hero_background\` TEXT NULL,
        \`hero_cta_text\` VARCHAR(255) NULL,
        \`life_eyebrow\` VARCHAR(255) NULL,
        \`life_title\` VARCHAR(255) NULL,
        \`life_subtitle\` TEXT NULL,
        \`life_image\` TEXT NULL,
        \`why_title\` VARCHAR(255) NULL,
        \`why_subtitle\` TEXT NULL,
        \`why_background\` TEXT NULL,
        \`why_cards_json\` TEXT NULL,
        \`why_values_json\` TEXT NULL,
        \`talent_eyebrow\` VARCHAR(255) NULL,
        \`talent_title\` VARCHAR(255) NULL,
        \`talent_background\` TEXT NULL,
        \`form_title\` VARCHAR(255) NULL,
        \`form_subtitle\` TEXT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `,
  },
  {
    name: "legal_pages",
    sql: `
      CREATE TABLE IF NOT EXISTS \`legal_pages\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`slug\` VARCHAR(255) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL,
        \`hero_title\` VARCHAR(255) NULL,
        \`content_html\` LONGTEXT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`legal_pages_slug_unique\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `,
  },
  {
    name: "product_pages",
    sql: `
      CREATE TABLE IF NOT EXISTS \`product_pages\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`slug\` VARCHAR(255) NOT NULL,
        \`name\` VARCHAR(255) NOT NULL,
        \`bullets_json\` TEXT NULL,
        \`images_json\` TEXT NULL,
        \`packaging_json\` TEXT NULL,
        \`properties_json\` TEXT NULL,
        \`properties_note\` TEXT NULL,
        \`msds_url\` TEXT NULL,
        \`description\` TEXT NULL,
        \`related_json\` TEXT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`product_pages_slug_unique\` (\`slug\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `,
  },
];

const NEW_COLUMNS = [
  { table: "about_presence", column: "states_json", ddl: "TEXT NULL" },
  { table: "footer", column: "background_image", ddl: "TEXT NULL" },
  {
    table: "footer",
    column: "background_image_opacity",
    ddl: "FLOAT NULL DEFAULT 0.1",
  },
  { table: "leadership_members", column: "linkedin", ddl: "TEXT NULL" },
  { table: "leadership_members", column: "biography", ddl: "TEXT NULL" },
  {
    table: "leadership_members",
    column: "directorship_details",
    ddl: "TEXT NULL",
  },
  {
    table: "investors_page_content",
    column: "show_publish_date",
    ddl: "TINYINT(1) NOT NULL DEFAULT 0",
  },
  {
    table: "investors_page_content",
    column: "show_cms_publish_date",
    ddl: "TINYINT(1) NOT NULL DEFAULT 0",
  },
];

async function tableExists(tableName) {
  const [rows] = await sequelize.query(
    `SELECT 1 AS ok
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = :tableName
     LIMIT 1`,
    { replacements: { tableName } },
  );
  return rows.length > 0;
}

async function columnExists(tableName, columnName) {
  const [rows] = await sequelize.query(
    `SELECT 1 AS ok
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = :tableName
       AND COLUMN_NAME = :columnName
     LIMIT 1`,
    { replacements: { tableName, columnName } },
  );
  return rows.length > 0;
}

async function ensureTables() {
  let created = 0;
  let existed = 0;

  for (const table of NEW_TABLES) {
    if (await tableExists(table.name)) {
      console.log(`  ✓ ${table.name} (exists)`);
      existed += 1;
      continue;
    }
    await sequelize.query(table.sql);
    console.log(`  + ${table.name} (created)`);
    created += 1;
  }

  return { created, existed };
}

async function ensureColumns() {
  let added = 0;
  let existed = 0;
  let skipped = 0;

  for (const col of NEW_COLUMNS) {
    if (!(await tableExists(col.table))) {
      console.log(`  - ${col.table}.${col.column} (table missing, skip)`);
      skipped += 1;
      continue;
    }
    if (await columnExists(col.table, col.column)) {
      console.log(`  ✓ ${col.table}.${col.column}`);
      existed += 1;
      continue;
    }
    await sequelize.query(
      `ALTER TABLE \`${col.table}\` ADD COLUMN \`${col.column}\` ${col.ddl}`,
    );
    console.log(`  + ${col.table}.${col.column}`);
    added += 1;
  }

  return { added, existed, skipped };
}

async function ensureUserTypeEnum() {
  const [rows] = await sequelize.query(`
    SELECT TABLE_NAME, COLUMN_TYPE
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND COLUMN_NAME = 'user_type'
      AND TABLE_NAME IN ('users', 'Users')
  `);

  if (!rows.length) {
    console.log("  - users.user_type not found (skip)");
    return;
  }

  const tableName = rows[0].TABLE_NAME;
  const columnType = String(rows[0].COLUMN_TYPE || "");

  if (columnType.includes("InvestorsCMS")) {
    console.log(`  ✓ ${tableName}.user_type includes InvestorsCMS`);
    return;
  }

  await sequelize.query(`
    ALTER TABLE \`${tableName}\`
    MODIFY COLUMN user_type ENUM('Admin', 'CHRO', 'HR', 'InvestorsCMS')
  `);
  console.log(`  + ${tableName}.user_type + InvestorsCMS`);
}

async function main() {
  const env = process.env.NODE_ENV;
  const cfg = sequelize.config || {};

  console.log("Refex CMS migrate");
  console.log(`  env:      ${env}`);
  console.log(`  host:     ${cfg.host}:${cfg.port || 3306}`);
  console.log(`  database: ${cfg.database}`);
  console.log(`  user:     ${cfg.username}`);
  console.log("");

  try {
    await sequelize.authenticate();
    console.log("Connected.\n");
  } catch (err) {
    console.error("Cannot connect to MySQL.");
    console.error(`  ${err.message}`);
    process.exit(1);
  }

  console.log("1/3 CMS tables");
  const tables = await ensureTables();
  console.log(`   created ${tables.created}, already present ${tables.existed}\n`);

  console.log("2/3 CMS columns");
  const columns = await ensureColumns();
  console.log(
    `   added ${columns.added}, present ${columns.existed}, skipped ${columns.skipped}\n`,
  );

  console.log("3/3 User types");
  await ensureUserTypeEnum();
  console.log("");

  console.log("Migration completed.");
  await sequelize.close();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("Migration failed:", err.message);
  try {
    await sequelize.close();
  } catch (_) {
    /* ignore */
  }
  process.exit(1);
});

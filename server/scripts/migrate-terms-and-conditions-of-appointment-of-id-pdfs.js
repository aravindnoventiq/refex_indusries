/**
 * Migration script to download all PDFs from terms-and-conditions-of-appointment-of-id page
 * and save them to the server's uploads/pdfs/terms-and-conditions-of-appointment-of-id subfolder.
 *
 * This script:
 * 1. Fetches the page from the database
 * 2. Downloads all external PDFs to /uploads/pdfs/terms-and-conditions-of-appointment-of-id/
 * 3. Moves any PDFs from /uploads/pdfs/ to the subfolder
 * 4. Updates the database with local file paths
 *
 * Run with: node scripts/migrate-terms-and-conditions-of-appointment-of-id-pdfs.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../models');

const SUBFOLDER = 'terms-and-conditions-of-appointment-of-id';
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'pdfs', SUBFOLDER);
const ROOT_PDFS_DIR = path.join(__dirname, '..', 'uploads', 'pdfs');

// Ensure uploads/pdfs/terms-and-conditions-of-appointment-of-id directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Created directory: ${UPLOADS_DIR}`);
}

async function downloadPdf(url, documentTitle) {
  try {
    console.log(`  Downloading: ${url}`);

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 120000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const sanitizedTitle = (documentTitle || 'document')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${sanitizedTitle}-${uniqueSuffix}.pdf`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, response.data);

    const localPath = `/uploads/pdfs/${SUBFOLDER}/${filename}`;
    console.log(`  ✓ Saved to: ${localPath}`);
    return localPath;
  } catch (error) {
    console.error(`  ✗ Error downloading ${url}:`, error.message);
    return null;
  }
}

function isExternalUrl(url) {
  if (!url) return false;
  const isLocalUpload = url.startsWith('/uploads/');
  const isHttp = url.startsWith('http://') || url.startsWith('https://');
  return isHttp && !isLocalUpload;
}

function isInRootFolder(url) {
  if (!url) return false;
  return (
    url.startsWith('/uploads/pdfs/pdf-') ||
    (url.startsWith('/uploads/pdfs/') &&
      !url.includes(`/${SUBFOLDER}/`) &&
      url.endsWith('.pdf'))
  );
}

async function movePdfFromRoot(pdfUrl) {
  try {
    const filename = path.basename(pdfUrl);
    const sourcePath = path.join(ROOT_PDFS_DIR, filename);
    const targetPath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(sourcePath)) {
      fs.renameSync(sourcePath, targetPath);
      const newUrl = `/uploads/pdfs/${SUBFOLDER}/${filename}`;
      console.log(`  ✓ Moved: ${filename} to subfolder`);
      return newUrl;
    } else {
      console.log(`  ⚠ File not found: ${sourcePath}`);
      return `/uploads/pdfs/${SUBFOLDER}/${filename}`;
    }
  } catch (error) {
    console.error(`  ✗ Error moving file: ${error.message}`);
    return null;
  }
}

async function migrateTermsAndConditionsOfAppointmentOfId() {
  console.log('='.repeat(70));
  console.log('Starting Terms and Conditions of Appointment of ID PDF Migration');
  console.log('='.repeat(70));
  console.log(`Target folder: /uploads/pdfs/${SUBFOLDER}/`);
  console.log('');

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'terms-and-conditions-of-appointment-of-id' },
    });

    if (!pageContent) {
      console.log(
        '❌ No terms-and-conditions-of-appointment-of-id page found in database'
      );
      console.log(
        'Please run the seed script first: node scripts/seed_investors_terms_and_conditions_of_appointment_id.js'
      );
      return;
    }

    console.log(`✓ Found page: ${pageContent.title}`);
    console.log(`  ID: ${pageContent.id}`);
    console.log(`  Active: ${pageContent.isActive}`);
    console.log('');

    const sections = pageContent.sections || [];
    let updatedSections = JSON.parse(JSON.stringify(sections));
    let downloadCount = 0;
    let moveCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    let totalDocuments = 0;

    sections.forEach((section) => {
      totalDocuments += (section.documents || []).length;
    });
    console.log(`Total documents found in database: ${totalDocuments}`);
    console.log('');

    for (let sectionIndex = 0; sectionIndex < updatedSections.length; sectionIndex++) {
      const section = updatedSections[sectionIndex];
      console.log(`\n📁 Section ${sectionIndex + 1}: ${section.title}`);
      console.log('-'.repeat(50));

      const documents = section.documents || [];

      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];

        if (doc.pdfUrl) {
          if (isExternalUrl(doc.pdfUrl)) {
            console.log(`\n📄 Document: ${doc.title || 'Untitled'}`);

            const localPath = await downloadPdf(
              doc.pdfUrl,
              doc.title || 'document'
            );

            if (localPath) {
              updatedSections[sectionIndex].documents[docIndex].pdfUrl = localPath;
              downloadCount++;
            } else {
              errorCount++;
            }
          } else if (isInRootFolder(doc.pdfUrl)) {
            console.log(`\n📄 Document: ${doc.title || 'Untitled'}`);
            console.log(`  Current URL: ${doc.pdfUrl}`);

            const newUrl = await movePdfFromRoot(doc.pdfUrl);

            if (newUrl) {
              updatedSections[sectionIndex].documents[docIndex].pdfUrl = newUrl;
              moveCount++;
            } else {
              errorCount++;
            }
          } else {
            console.log(
              `  ⏭ Skipping (already in subfolder): ${doc.title || 'Untitled'}`
            );
            skipCount++;
          }
        }
      }
    }

    if (downloadCount > 0 || moveCount > 0) {
      await pageContent.update({ sections: updatedSections });
      console.log('\n' + '='.repeat(70));
      console.log('✅ Migration complete!');
      console.log('='.repeat(70));
      console.log(`  📥 Downloaded: ${downloadCount} PDFs`);
      console.log(
        `  📦 Moved:      ${moveCount} PDFs (from root to subfolder)`
      );
      console.log(
        `  ⏭ Skipped:    ${skipCount} (already in subfolder)`
      );
      console.log(`  ❌ Errors:     ${errorCount}`);
      console.log('');
      console.log(`All PDFs saved to: ${UPLOADS_DIR}`);
      console.log('Database updated with new local URLs.');
    } else if (skipCount > 0) {
      console.log('\n' + '='.repeat(70));
      console.log('ℹ️  No migration needed - all PDFs are already in subfolder');
      console.log('='.repeat(70));
    } else {
      console.log('\n' + '='.repeat(70));
      console.log('⚠️  No PDFs found to process');
      console.log('='.repeat(70));
    }
  } catch (error) {
    console.error('\n❌ Migration error:', error);
  } finally {
    await db.sequelize.close();
  }
}

migrateTermsAndConditionsOfAppointmentOfId();



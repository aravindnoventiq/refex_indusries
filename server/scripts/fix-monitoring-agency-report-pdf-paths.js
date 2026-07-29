/**
 * Fix Monitoring Agency Report PDF paths
 * Moves PDFs from /uploads/pdfs/ to /uploads/pdfs/monitoring-agency-report/
 * and updates database URLs
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

const SOURCE_DIR = path.join(__dirname, '..', 'uploads', 'pdfs');
const TARGET_DIR = path.join(__dirname, '..', 'uploads', 'pdfs', 'monitoring-agency-report');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  console.log(`Created directory: ${TARGET_DIR}`);
}

async function fixPdfPaths() {
  console.log('='.repeat(70));
  console.log('Fixing Monitoring Agency Report PDF Paths');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Get the page from database
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'monitoring-agency-report' }
    });

    if (!pageContent) {
      console.log('❌ No monitoring-agency-report page found in database');
      return;
    }

    console.log(`✓ Found page: ${pageContent.title}`);
    console.log('');

    const sections = pageContent.sections || [];
    let updatedSections = JSON.parse(JSON.stringify(sections)); // Deep copy
    let movedCount = 0;
    let errorCount = 0;
    let notFoundCount = 0;

    for (let sectionIndex = 0; sectionIndex < updatedSections.length; sectionIndex++) {
      const section = updatedSections[sectionIndex];
      console.log(`📁 Section: ${section.title}`);
      console.log('-'.repeat(50));

      const documents = section.documents || [];

      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];
        const currentUrl = doc.pdfUrl;

        // Check if URL is in root pdfs folder (not in subfolder)
        if (currentUrl.startsWith('/uploads/pdfs/pdf-') && !currentUrl.includes('/monitoring-agency-report/')) {
          // Extract filename from URL
          const filename = path.basename(currentUrl);
          const sourcePath = path.join(SOURCE_DIR, filename);
          const targetPath = path.join(TARGET_DIR, filename);
          const newUrl = `/uploads/pdfs/monitoring-agency-report/${filename}`;

          console.log(`\n📄 Document: ${doc.title}`);
          console.log(`  Current URL: ${currentUrl}`);

          // Check if source file exists
          if (fs.existsSync(sourcePath)) {
            try {
              // Move file to subfolder
              fs.renameSync(sourcePath, targetPath);
              console.log(`  ✓ Moved: ${filename}`);
              
              // Update URL in database
              updatedSections[sectionIndex].documents[docIndex].pdfUrl = newUrl;
              console.log(`  ✓ Updated URL: ${newUrl}`);
              movedCount++;
            } catch (error) {
              console.error(`  ✗ Error moving file: ${error.message}`);
              errorCount++;
            }
          } else {
            console.log(`  ⚠ File not found: ${sourcePath}`);
            notFoundCount++;
            // Still update the URL to point to subfolder (in case file was already moved manually)
            updatedSections[sectionIndex].documents[docIndex].pdfUrl = newUrl;
            console.log(`  ✓ Updated URL anyway: ${newUrl}`);
          }
        } else {
          console.log(`  ⏭ Already in subfolder or different path: ${doc.title}`);
        }
      }
    }

    // Update the database
    if (movedCount > 0 || notFoundCount > 0) {
      await pageContent.update({ sections: updatedSections });
      console.log('\n' + '='.repeat(70));
      console.log('✅ Fix complete!');
      console.log('='.repeat(70));
      console.log(`  📦 Files moved: ${movedCount}`);
      console.log(`  ⚠ Files not found: ${notFoundCount}`);
      console.log(`  ❌ Errors: ${errorCount}`);
      console.log('');
      console.log('Database updated with new URLs.');
    } else {
      console.log('\n' + '='.repeat(70));
      console.log('ℹ️  No files needed to be moved.');
      console.log('='.repeat(70));
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await db.sequelize.close();
  }
}

// Run the fix
fixPdfPaths();


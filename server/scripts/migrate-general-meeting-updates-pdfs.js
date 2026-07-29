/**
 * Migration script to download PDFs from external URLs
 * and save them locally for General Meeting Updates page
 * Note: This page uses 'link' field instead of 'pdfUrl'
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Import database models
const db = require('../models');

const SUBFOLDER = 'general-meeting-updates';
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'pdfs', SUBFOLDER);

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Created directory: ${UPLOADS_DIR}`);
}

async function downloadPdf(url, filename) {
  try {
    console.log(`Downloading: ${url}`);
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 60000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, response.data);
    console.log(`Saved: ${filename}`);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return false;
  }
}

async function migratePdfs() {
  try {
    console.log('Starting General Meeting Updates PDF migration...\n');

    // Get the page content
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'general-meeting-updates' }
    });

    if (!pageContent) {
      console.log('Page content not found for general-meeting-updates');
      await db.sequelize.close();
      return;
    }

    const sections = pageContent.sections || [];
    let updated = false;
    let downloadCount = 0;
    let failedCount = 0;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      const documents = section.documents || [];

      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];
        
        // This page uses 'link' field instead of 'pdfUrl'
        if (doc.link && (doc.link.startsWith('http://') || doc.link.startsWith('https://'))) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const filename = `pdf-${uniqueSuffix}.pdf`;
          
          const success = await downloadPdf(doc.link, filename);
          if (success) {
            // Update the URL to local path
            const newUrl = `/uploads/pdfs/${SUBFOLDER}/${filename}`;
            sections[sectionIndex].documents[docIndex].link = newUrl;
            updated = true;
            downloadCount++;
          } else {
            failedCount++;
          }
          
          // Add a small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          console.log(`Skipping (already local or invalid): ${doc.link}`);
        }
      }
    }

    if (updated) {
      // Update the database - use changed() flag for JSONB fields
      pageContent.sections = sections;
      pageContent.changed('sections', true);
      await pageContent.save();
      console.log(`\nMigration complete! Downloaded ${downloadCount} PDF(s). Failed: ${failedCount}`);
    } else {
      console.log('\nNo PDFs needed to be downloaded.');
    }

    await db.sequelize.close();
  } catch (error) {
    console.error('Migration failed:', error);
    await db.sequelize.close();
    process.exit(1);
  }
}

migratePdfs();


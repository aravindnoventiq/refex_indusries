/**
 * Migration script to download PDFs from external URLs
 * and save them locally for Code of Fair Disclosure UPSI page
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Import database models
const db = require('../models');

const SUBFOLDER = 'code-of-fair-disclosure-upsi';
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
    console.log(`Saved: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return false;
  }
}

async function migratePdfs() {
  try {
    console.log('Starting Code of Fair Disclosure UPSI PDF migration...\n');

    // Get the page content
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'code-of-fair-disclosure-upsi' }
    });

    if (!pageContent) {
      console.log('Page content not found for code-of-fair-disclosure-upsi');
      await db.sequelize.close();
      return;
    }

    const sections = pageContent.sections || [];
    let updated = false;
    let downloadCount = 0;

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      const documents = section.documents || [];

      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];
        
        // Check if it's an external URL
        if (doc.pdfUrl && (doc.pdfUrl.startsWith('http://') || doc.pdfUrl.startsWith('https://'))) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const filename = `pdf-${uniqueSuffix}.pdf`;
          
          const success = await downloadPdf(doc.pdfUrl, filename);
          if (success) {
            // Update the URL to local path
            const newUrl = `/uploads/pdfs/${SUBFOLDER}/${filename}`;
            console.log(`Updated URL: ${doc.pdfUrl} -> ${newUrl}`);
            sections[sectionIndex].documents[docIndex].pdfUrl = newUrl;
            updated = true;
            downloadCount++;
          }
        } else {
          console.log(`Skipping (already local or invalid): ${doc.pdfUrl}`);
        }
      }
    }

    if (updated) {
      // Update the database - use changed() flag for JSONB fields
      pageContent.sections = sections;
      pageContent.changed('sections', true);
      await pageContent.save();
      console.log(`\nMigration complete! Downloaded ${downloadCount} PDF(s).`);
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


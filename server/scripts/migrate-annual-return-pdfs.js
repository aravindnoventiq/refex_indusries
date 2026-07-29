/**
 * Migration script to download all PDFs from annual return page
 * and save them to the server's uploads/pdfs/annual-return folder
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../models');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'pdfs', 'annual-return');

// Ensure uploads/pdfs/annual-return directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadPdf(url) {
  try {
    console.log(`  Downloading: ${url}`);
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 120000, // 2 minute timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `pdf-${uniqueSuffix}.pdf`;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    // Save the PDF
    fs.writeFileSync(filePath, response.data);
    
    console.log(`  Saved to: /uploads/pdfs/annual-return/${filename}`);
    return `/uploads/pdfs/annual-return/${filename}`;
  } catch (error) {
    console.error(`  Error downloading ${url}:`, error.message);
    return null;
  }
}

function isExternalUrl(url) {
  if (!url) return false;
  // Local uploads start with /uploads/ (relative path)
  // External URLs start with http:// or https://
  const isLocalUpload = url.startsWith('/uploads/');
  const isHttp = url.startsWith('http://') || url.startsWith('https://');
  return isHttp && !isLocalUpload;
}

async function migrateAnnualReturn() {
  console.log('='.repeat(60));
  console.log('Starting Annual Return PDF Migration');
  console.log('='.repeat(60));

  try {
    // Find the annual-return page
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'annual-return' }
    });

    if (!pageContent) {
      console.log('No annual-return page found in database');
      return;
    }

    console.log(`Found annual return page: ${pageContent.title}`);
    
    const sections = pageContent.sections || [];
    let updatedSections = JSON.parse(JSON.stringify(sections)); // Deep copy
    let downloadCount = 0;
    let errorCount = 0;

    for (let sectionIndex = 0; sectionIndex < updatedSections.length; sectionIndex++) {
      const section = updatedSections[sectionIndex];
      console.log(`\nProcessing section: ${section.title}`);
      
      const documents = section.documents || [];
      
      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];
        
        if (isExternalUrl(doc.pdfUrl)) {
          console.log(`\nDocument: ${doc.title}`);
          
          const localPath = await downloadPdf(doc.pdfUrl);
          
          if (localPath) {
            updatedSections[sectionIndex].documents[docIndex].pdfUrl = localPath;
            downloadCount++;
          } else {
            errorCount++;
          }
        } else {
          console.log(`  Skipping (already local): ${doc.title}`);
        }
      }
    }

    // Update the database
    if (downloadCount > 0) {
      await pageContent.update({ sections: updatedSections });
      console.log('\n' + '='.repeat(60));
      console.log(`Migration complete!`);
      console.log(`  Downloaded: ${downloadCount} PDFs`);
      console.log(`  Errors: ${errorCount}`);
      console.log(`  Saved to: uploads/pdfs/annual-return/`);
      console.log('='.repeat(60));
    } else {
      console.log('\nNo PDFs needed to be downloaded.');
    }

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await db.sequelize.close();
  }
}

// Run the migration
migrateAnnualReturn();


/**
 * Migration script to download all PDFs from investor-information page
 * and save them to the server's uploads/pdfs/investor-information subfolder
 * 
 * This script:
 * 1. Fetches the investor-information page from database
 * 2. Downloads all external PDFs to /uploads/pdfs/investor-information/
 * 3. Updates the database with local file paths
 * 
 * Run with: node scripts/migrate-investor-information-pdfs.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../models');

const SUBFOLDER = 'investor-information';
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'pdfs', SUBFOLDER);

// Ensure uploads/pdfs/investor-information directory exists
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
      timeout: 120000, // 2 minute timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Generate filename from document title (sanitized) + unique suffix
    const sanitizedTitle = documentTitle
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${sanitizedTitle}-${uniqueSuffix}.pdf`;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    // Save the PDF
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
  // Local uploads start with /uploads/ (relative path)
  // External URLs start with http:// or https://
  const isLocalUpload = url.startsWith('/uploads/');
  const isHttp = url.startsWith('http://') || url.startsWith('https://');
  return isHttp && !isLocalUpload;
}

async function migrateInvestorInformation() {
  console.log('='.repeat(70));
  console.log('Starting Investor Information PDF Migration');
  console.log('='.repeat(70));
  console.log(`Target folder: /uploads/pdfs/${SUBFOLDER}/`);
  console.log('');

  try {
    // Find the investor-information page
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'investor-information' }
    });

    if (!pageContent) {
      console.log('❌ No investor-information page found in database');
      console.log('Please run the seed script first: node scripts/seed_investors_investor_information.js');
      return;
    }

    console.log(`✓ Found page: ${pageContent.title}`);
    console.log(`  ID: ${pageContent.id}`);
    console.log(`  Active: ${pageContent.isActive}`);
    console.log('');
    
    const sections = pageContent.sections || [];
    let updatedSections = JSON.parse(JSON.stringify(sections)); // Deep copy
    let downloadCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let sectionIndex = 0; sectionIndex < updatedSections.length; sectionIndex++) {
      const section = updatedSections[sectionIndex];
      console.log(`\n📁 Section ${sectionIndex + 1}: ${section.title}`);
      console.log('-'.repeat(50));
      
      const documents = section.documents || [];
      
      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];
        
        if (isExternalUrl(doc.pdfUrl)) {
          console.log(`\n📄 Document: ${doc.title}`);
          
          const localPath = await downloadPdf(doc.pdfUrl, doc.title);
          
          if (localPath) {
            updatedSections[sectionIndex].documents[docIndex].pdfUrl = localPath;
            downloadCount++;
          } else {
            errorCount++;
          }
        } else {
          console.log(`  ⏭ Skipping (already local): ${doc.title}`);
          skipCount++;
        }
      }
    }

    // Update the database
    if (downloadCount > 0) {
      await pageContent.update({ sections: updatedSections });
      console.log('\n' + '='.repeat(70));
      console.log('✅ Migration complete!');
      console.log('='.repeat(70));
      console.log(`  📥 Downloaded: ${downloadCount} PDFs`);
      console.log(`  ⏭ Skipped:    ${skipCount} (already local)`);
      console.log(`  ❌ Errors:     ${errorCount}`);
      console.log('');
      console.log(`All PDFs saved to: ${UPLOADS_DIR}`);
      console.log('Database updated with new local URLs.');
    } else if (skipCount > 0) {
      console.log('\n' + '='.repeat(70));
      console.log('ℹ️  No migration needed - all PDFs are already local');
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

// Run the migration
migrateInvestorInformation();


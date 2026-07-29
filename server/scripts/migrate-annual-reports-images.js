/**
 * Migration script to download all thumbnail images from annual reports page
 * and save them to the server's uploads/images/annual-reports folder
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../models');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'images', 'annual-reports');

// Ensure uploads/images/annual-reports directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function downloadImage(url) {
  try {
    console.log(`  Downloading: ${url}`);
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      timeout: 60000, // 1 minute timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Get file extension from URL or content-type
    let ext = path.extname(url).split('?')[0] || '.png';
    if (!ext || ext.length > 5) ext = '.png';
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `image-${uniqueSuffix}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    
    // Save the image
    fs.writeFileSync(filePath, response.data);
    
    console.log(`  Saved to: /uploads/images/annual-reports/${filename}`);
    return `/uploads/images/annual-reports/${filename}`;
  } catch (error) {
    console.error(`  Error downloading ${url}:`, error.message);
    return null;
  }
}

function isExternalUrl(url) {
  if (!url) return false;
  const isLocalUpload = url.startsWith('/uploads/');
  const isHttp = url.startsWith('http://') || url.startsWith('https://');
  return isHttp && !isLocalUpload;
}

async function migrateAnnualReportsImages() {
  console.log('='.repeat(60));
  console.log('Starting Annual Reports Images Migration');
  console.log('='.repeat(60));

  try {
    // Find the annual-reports page
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug: 'annual-reports' }
    });

    if (!pageContent) {
      console.log('No annual-reports page found in database');
      return;
    }

    console.log(`Found annual reports page: ${pageContent.title}`);
    
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
        
        // Check for thumbnail image
        if (doc.thumbnail && isExternalUrl(doc.thumbnail)) {
          console.log(`\nDocument: ${doc.title}`);
          console.log(`  Thumbnail found`);
          
          const localPath = await downloadImage(doc.thumbnail);
          
          if (localPath) {
            updatedSections[sectionIndex].documents[docIndex].thumbnail = localPath;
            downloadCount++;
          } else {
            errorCount++;
          }
        } else if (doc.thumbnail) {
          console.log(`  Skipping thumbnail (already local): ${doc.title}`);
        }
      }
    }

    // Update the database
    if (downloadCount > 0) {
      await pageContent.update({ sections: updatedSections });
      console.log('\n' + '='.repeat(60));
      console.log(`Migration complete!`);
      console.log(`  Downloaded: ${downloadCount} images`);
      console.log(`  Errors: ${errorCount}`);
      console.log(`  Saved to: uploads/images/annual-reports/`);
      console.log('='.repeat(60));
    } else {
      console.log('\nNo images needed to be downloaded.');
    }

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await db.sequelize.close();
  }
}

// Run the migration
migrateAnnualReportsImages();


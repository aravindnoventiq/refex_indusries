/**
 * Script to move annual reports PDFs to a subfolder
 * and update the database paths
 */

const fs = require('fs');
const path = require('path');
const db = require('../models');

const SOURCE_DIR = path.join(__dirname, '..', 'uploads', 'pdfs');
const DEST_DIR = path.join(__dirname, '..', 'uploads', 'pdfs', 'annual-reports');

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

async function reorganizeAnnualReportsPdfs() {
  console.log('='.repeat(60));
  console.log('Reorganizing Annual Reports PDFs to subfolder');
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
    let updatedSections = JSON.parse(JSON.stringify(sections));
    let moveCount = 0;

    for (let sectionIndex = 0; sectionIndex < updatedSections.length; sectionIndex++) {
      const section = updatedSections[sectionIndex];
      const documents = section.documents || [];
      
      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];
        
        // Check if PDF is in root pdfs folder (not already in subfolder)
        if (doc.pdfUrl && doc.pdfUrl.startsWith('/uploads/pdfs/') && !doc.pdfUrl.includes('/annual-reports/')) {
          const filename = path.basename(doc.pdfUrl);
          const sourcePath = path.join(SOURCE_DIR, filename);
          const destPath = path.join(DEST_DIR, filename);
          
          if (fs.existsSync(sourcePath)) {
            console.log(`Moving: ${filename}`);
            fs.renameSync(sourcePath, destPath);
            updatedSections[sectionIndex].documents[docIndex].pdfUrl = `/uploads/pdfs/annual-reports/${filename}`;
            moveCount++;
          } else {
            console.log(`File not found: ${filename}`);
          }
        }
      }
    }

    // Update the database
    if (moveCount > 0) {
      await pageContent.update({ sections: updatedSections });
      console.log('\n' + '='.repeat(60));
      console.log(`Reorganization complete!`);
      console.log(`  Moved: ${moveCount} PDFs`);
      console.log(`  New location: uploads/pdfs/annual-reports/`);
      console.log('='.repeat(60));
    } else {
      console.log('\nNo PDFs needed to be moved.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.sequelize.close();
  }
}

// Run the reorganization
reorganizeAnnualReportsPdfs();


/**
 * Generic migration script for dynamic investor pages.
 *
 * Usage:
 *   node scripts/migrate-investor-dynamic-page-pdfs.js <slug> [subfolder]
 *
 * Example:
 *   node scripts/migrate-investor-dynamic-page-pdfs.js unpaid-dividend-list-and-iepf-shares
 *
 * This will:
 * 1. Fetch the page by slug from InvestorsPageContent
 * 2. Download all external PDFs in sections[].documents[].pdfUrl and sections[].audios[].pdfUrl
 * 3. Move any PDFs from /uploads/pdfs/ root into /uploads/pdfs/<subfolder>/
 * 4. Update the database with new local URLs
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const db = require('../models');

const slug = process.argv[2];
const subfolderArg = process.argv[3];

if (!slug) {
  console.error('❌ Usage: node scripts/migrate-investor-dynamic-page-pdfs.js <slug> [subfolder]');
  process.exit(1);
}

const SUBFOLDER = subfolderArg || slug;
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'pdfs', SUBFOLDER);
const ROOT_PDFS_DIR = path.join(__dirname, '..', 'uploads', 'pdfs');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Created directory: ${UPLOADS_DIR}`);
}

async function downloadPdf(url, title) {
  try {
    console.log(`  Downloading: ${url}`);

    const response = await axios({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      timeout: 120000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const sanitizedTitle = (title || 'document')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 80);
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

async function migrate() {
  console.log('='.repeat(70));
  console.log(`Starting PDF Migration for dynamic investor page: ${slug}`);
  console.log('='.repeat(70));
  console.log(`Target folder: /uploads/pdfs/${SUBFOLDER}/`);
  console.log('');

  try {
    const pageContent = await db.InvestorsPageContent.findOne({
      where: { slug },
    });

    if (!pageContent) {
      console.log(`❌ No page found in database for slug: ${slug}`);
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
      totalDocuments += (section.audios || []).filter((a) => a.pdfUrl).length;
    });
    console.log(`Total document/transcript PDFs found: ${totalDocuments}`);
    console.log('');

    for (let sectionIndex = 0; sectionIndex < updatedSections.length; sectionIndex++) {
      const section = updatedSections[sectionIndex];
      console.log(`\n📁 Section ${sectionIndex + 1}: ${section.title}`);
      console.log('-'.repeat(50));

      const documents = section.documents || [];
      const audios = section.audios || [];

      // Handle document PDFs
      for (let docIndex = 0; docIndex < documents.length; docIndex++) {
        const doc = documents[docIndex];

        if (doc.pdfUrl) {
          if (isExternalUrl(doc.pdfUrl)) {
            console.log(`\n📄 Document: ${doc.title || 'Untitled'}`);
            if (doc.year) console.log(`  Year: ${doc.year}`);
            if (doc.date) console.log(`  Date: ${doc.date}`);

            const localPath = await downloadPdf(
              doc.pdfUrl,
              doc.title || 'document'
            );

            if (localPath) {
              updatedSections[sectionIndex].documents[docIndex].pdfUrl =
                localPath;
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
              `  ⏭ Skipping (already in subfolder or local): ${doc.title || 'Untitled'}`
            );
            skipCount++;
          }
        }
      }

      // Handle audio transcript PDFs
      for (let audioIndex = 0; audioIndex < audios.length; audioIndex++) {
        const audio = audios[audioIndex];
        if (audio.pdfUrl) {
          if (isExternalUrl(audio.pdfUrl)) {
            console.log(`\n🎧 Audio transcript: ${audio.name || 'Untitled'}`);
            if (audio.year) console.log(`  Year: ${audio.year}`);

            const localPath = await downloadPdf(
              audio.pdfUrl,
              audio.name || 'audio-transcript'
            );

            if (localPath) {
              if (!updatedSections[sectionIndex].audios) {
                updatedSections[sectionIndex].audios = [];
              }
              updatedSections[sectionIndex].audios[audioIndex].pdfUrl = localPath;
              downloadCount++;
            } else {
              errorCount++;
            }
          } else if (isInRootFolder(audio.pdfUrl)) {
            console.log(`\n🎧 Audio transcript: ${audio.name || 'Untitled'}`);
            console.log(`  Current URL: ${audio.pdfUrl}`);

            const newUrl = await movePdfFromRoot(audio.pdfUrl);

            if (newUrl) {
              if (!updatedSections[sectionIndex].audios) {
                updatedSections[sectionIndex].audios = [];
              }
              updatedSections[sectionIndex].audios[audioIndex].pdfUrl = newUrl;
              moveCount++;
            } else {
              errorCount++;
            }
          } else {
            console.log(
              `  ⏭ Skipping transcript (already in subfolder or local): ${audio.name || 'Untitled'}`
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
        `  ⏭ Skipped:    ${skipCount} (already in subfolder/local)`
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

migrate();



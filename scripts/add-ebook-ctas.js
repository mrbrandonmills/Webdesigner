#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function addEbookCTAs() {
  console.log('🚀 Adding ebook CTAs to all blog posts...\n');

  // Find all blog post files
  const blogFiles = await glob('app/blog/*/page.tsx', {
    cwd: '/Volumes/Super Mastery/Webdesigner',
    absolute: true
  });

  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const filePath of blogFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Skip if already has EbookCTA
      if (content.includes('EbookCTA') || content.includes('ebook-cta')) {
        console.log(`⏭️  Skipped (already has CTA): ${path.basename(path.dirname(filePath))}`);
        skippedCount++;
        continue;
      }

      // Extract the slug from the file path
      const slug = path.basename(path.dirname(filePath));

      let newContent = content;

      // Add import at the top (after other imports)
      const importStatement = "import { EbookCTA } from '@/components/ebook-cta'\n";

      // Find where to insert the import
      const lastImportMatch = content.match(/^import .+$/gm);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const lastImportIndex = content.indexOf(lastImport);
        const insertPosition = lastImportIndex + lastImport.length;

        newContent =
          content.slice(0, insertPosition) +
          '\n' +
          importStatement +
          content.slice(insertPosition);
      } else {
        // If no imports found, add at the beginning
        newContent = importStatement + '\n' + content;
      }

      // Add the CTA component before the last closing tags
      // Look for the pattern: closing div tags before export default
      const ctaComponent = `\n      <EbookCTA variant="footer" source="${slug}" />\n`;

      // Find the last </div> or </article> before the export
      const lastClosingTagMatch = newContent.match(/<\/(div|article|section)>\s*$/m);
      if (lastClosingTagMatch) {
        const insertIndex = newContent.lastIndexOf(lastClosingTagMatch[0]);
        newContent =
          newContent.slice(0, insertIndex) +
          ctaComponent +
          newContent.slice(insertIndex);
      } else {
        // Fallback: add before the last closing parenthesis of the return statement
        const returnMatch = newContent.match(/return\s*\(/);
        if (returnMatch) {
          // Find the matching closing parenthesis
          let parenCount = 1;
          let startIndex = newContent.indexOf('(', newContent.indexOf('return'));
          let endIndex = startIndex + 1;

          while (parenCount > 0 && endIndex < newContent.length) {
            if (newContent[endIndex] === '(') parenCount++;
            if (newContent[endIndex] === ')') parenCount--;
            endIndex++;
          }

          // Insert before the closing paren
          newContent =
            newContent.slice(0, endIndex - 1) +
            ctaComponent +
            '    ' +
            newContent.slice(endIndex - 1);
        }
      }

      // Write the updated content
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ Added CTA: ${slug}`);
      addedCount++;

    } catch (error) {
      console.error(`❌ Error processing ${path.basename(path.dirname(filePath))}: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Added: ${addedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`\n🎉 Done! All blog posts now have ebook CTAs.`);
}

addEbookCTAs().catch(console.error);

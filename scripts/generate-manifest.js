const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images', 'flowers');
// ensure directory exists
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
const outFile = path.join(imagesDir, 'manifest.json');
const outJsFile = path.join(imagesDir, 'manifest.js');
// Exclude HEIC files (not widely supported in browsers)
const exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Failed to read images directory:', err.message);
    process.exit(1);
  }

  const imgs = files
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  fs.writeFile(outFile, JSON.stringify(imgs, null, 2), 'utf8', err => {
    if (err) {
      console.error('Failed to write manifest:', err.message);
      process.exit(1);
    }
    // Also write a JS manifest so pages opened via file:// can load it with a <script>
    const jsContent = `window.IMAGES_MANIFEST = ${JSON.stringify(imgs, null, 2)};`;
    fs.writeFile(outJsFile, jsContent, 'utf8', err2 => {
      if (err2) {
        console.error('Failed to write JS manifest:', err2.message);
        process.exit(1);
      }
      console.log('Wrote', outFile, 'and', outJsFile);
    });
  });
});

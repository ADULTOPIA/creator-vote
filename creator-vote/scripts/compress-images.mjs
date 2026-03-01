import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/adultopia');
const outputDir = path.join(__dirname, '../public/adultopia/compressed');

(async () => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const files = fs.readdirSync(inputDir).filter(f => /\.(jpe?g|png)$/i.test(f));
  if (files.length === 0) {
    console.log('No images found to compress.');
    return;
  }
  await imagemin(
    files.map(f => path.join(inputDir, f)),
    {
      destination: outputDir,
      plugins: [
        mozjpeg({ quality: 75 }),
        pngquant({ quality: [0.6, 0.8] })
      ]
    }
  );
  console.log('Image compression complete!');
})();

import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const sourceDir = path.join(rootDir, 'photos-source');
const thumbsDir = path.join(rootDir, 'public', 'photos', 'thumbs');
const displayDir = path.join(rootDir, 'public', 'photos', 'display');

const IMAGE_EXTENSIONS = new Set(['.jpeg', '.jpg', '.png']);

const THUMB_WIDTH = 480;
const THUMB_WEBP_QUALITY = 75;
const THUMB_JPEG_QUALITY = 80;
const DISPLAY_WIDTH = 1400;
const DISPLAY_WEBP_QUALITY = 80;
const DISPLAY_JPEG_QUALITY = 85;

function basenameWithoutExtension(filename) {
  return path.basename(filename, path.extname(filename));
}

async function fileSize(filePath) {
  try {
    const info = await stat(filePath);
    return info.size;
  } catch {
    return 0;
  }
}

async function isUpToDate(sourcePath, outputPaths) {
  const sourceStat = await stat(sourcePath);

  for (const outputPath of outputPaths) {
    try {
      const outputStat = await stat(outputPath);
      if (outputStat.mtimeMs < sourceStat.mtimeMs) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

async function processImage(sourcePath, filename) {
  const id = basenameWithoutExtension(filename);
  const outputs = {
    thumbWebp: path.join(thumbsDir, `${id}.webp`),
    thumbJpeg: path.join(thumbsDir, `${id}.jpg`),
    displayWebp: path.join(displayDir, `${id}.webp`),
    displayJpeg: path.join(displayDir, `${id}.jpg`),
  };

  const outputPaths = Object.values(outputs);
  const sourceBytes = await fileSize(sourcePath);

  if (await isUpToDate(sourcePath, outputPaths)) {
    const outputBytes = (await Promise.all(outputPaths.map(fileSize))).reduce((sum, size) => sum + size, 0);
    return { status: 'skipped', sourceBytes, outputBytes };
  }

  const pipeline = sharp(sourcePath).rotate();

  await Promise.all([
    pipeline
      .clone()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_WEBP_QUALITY })
      .toFile(outputs.thumbWebp),
    pipeline
      .clone()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: THUMB_JPEG_QUALITY, mozjpeg: true })
      .toFile(outputs.thumbJpeg),
    pipeline
      .clone()
      .resize({ width: DISPLAY_WIDTH, withoutEnlargement: true })
      .webp({ quality: DISPLAY_WEBP_QUALITY })
      .toFile(outputs.displayWebp),
    pipeline
      .clone()
      .resize({ width: DISPLAY_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: DISPLAY_JPEG_QUALITY, mozjpeg: true })
      .toFile(outputs.displayJpeg),
  ]);

  const outputBytes = (await Promise.all(outputPaths.map(fileSize))).reduce((sum, size) => sum + size, 0);
  return { status: 'processed', sourceBytes, outputBytes };
}

async function main() {
  await mkdir(thumbsDir, { recursive: true });
  await mkdir(displayDir, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  const imageFiles = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort();

  if (imageFiles.length === 0) {
    console.error('No images found in photos-source/.');
    process.exit(1);
  }

  let processed = 0;
  let skipped = 0;
  let totalSourceBytes = 0;
  let totalOutputBytes = 0;

  for (const filename of imageFiles) {
    const sourcePath = path.join(sourceDir, filename);
    const result = await processImage(sourcePath, filename);
    totalSourceBytes += result.sourceBytes;
    totalOutputBytes += result.outputBytes;

    if (result.status === 'skipped') {
      skipped += 1;
      console.log(`skip  ${filename}`);
    } else {
      processed += 1;
      console.log(`build ${filename}`);
    }
  }

  const sourceMb = (totalSourceBytes / (1024 * 1024)).toFixed(1);
  const outputMb = (totalOutputBytes / (1024 * 1024)).toFixed(1);

  console.log('');
  console.log(`Photos: ${processed} processed, ${skipped} skipped (${imageFiles.length} total)`);
  console.log(`Source size: ${sourceMb} MB → generated output: ${outputMb} MB`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

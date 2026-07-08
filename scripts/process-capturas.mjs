import { existsSync, mkdirSync, readFileSync, readdirSync } from "fs";
import { basename, extname, join, resolve } from "path";
import sharp from "sharp";

// Crop config in pixels. Increase values to remove more area from each side.
// Tuned for mobile screenshots with top status/app bars and bottom nav bar.
const CROP_TOP = 500;
const CROP_BOTTOM = 460;
const CROP_LEFT = 70;
const CROP_RIGHT = 70;

// Auto-trim removes uniform background around the product after fixed crop.
const AUTO_TRIM = true;
const TRIM_THRESHOLD = 28;

// Output optimization config.
const WEBP_QUALITY = 78;
const WEBP_EFFORT = 5;
const OUTPUT_MARGIN = 22;

const INPUT_DIR = resolve("capturas");
const OUTPUT_DIR = resolve("public", "imagen");
const NAME_MAP_FILE = resolve("capturas", "nombres-map.json");
const dryRun = process.argv.includes("--dry-run");

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);

function getImageFiles(dirPath) {
  if (!existsSync(dirPath)) {
    throw new Error(`Input folder not found: ${dirPath}`);
  }

  const entries = readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...getImageFiles(fullPath));
      continue;
    }

    const extension = extname(entry.name).toLowerCase();
    if (SUPPORTED_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function slugifyBaseName(value) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const withoutNoise = normalized
    .replace(/^whatsapp image\s*/i, "")
    .replace(/[()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const slug = withoutNoise
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "imagen";
}

function loadNameMap() {
  if (!existsSync(NAME_MAP_FILE)) {
    return {};
  }

  const raw = readFileSync(NAME_MAP_FILE, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Invalid name map format: ${NAME_MAP_FILE}`);
  }

  return parsed;
}

function buildOutputPlan(inputFiles, nameMap) {
  const usedNames = new Set();

  return inputFiles.map((inputFilePath) => {
    const fileName = basename(inputFilePath);
    const originalBase = basename(inputFilePath, extname(inputFilePath));
    const mapped = nameMap[fileName] ?? nameMap[originalBase] ?? originalBase;
    const baseSlug = slugifyBaseName(String(mapped));

    let finalName = baseSlug;
    let suffix = 2;
    while (usedNames.has(finalName)) {
      finalName = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    usedNames.add(finalName);

    return {
      inputFilePath,
      outputFilePath: join(OUTPUT_DIR, `${finalName}.webp`),
    };
  });
}

async function processImage(inputFilePath, outputFilePath) {

  if (existsSync(outputFilePath)) {
    return {
      status: "skipped",
      reason: `Already exists, skipped: ${outputFilePath}`,
    };
  }

  const image = sharp(inputFilePath, { failOn: "warning" });
  const metadata = await image.metadata();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (width <= 0 || height <= 0) {
    return {
      status: "error",
      reason: `Could not read dimensions: ${inputFilePath}`,
    };
  }

  const extractWidth = width - CROP_LEFT - CROP_RIGHT;
  const extractHeight = height - CROP_TOP - CROP_BOTTOM;

  if (extractWidth <= 0 || extractHeight <= 0) {
    return {
      status: "error",
      reason: `Invalid crop for image size ${width}x${height}: ${inputFilePath}`,
    };
  }

  let pipeline = image.extract({
    left: CROP_LEFT,
    top: CROP_TOP,
    width: extractWidth,
    height: extractHeight,
  });

  if (AUTO_TRIM) {
    pipeline = pipeline.trim({ threshold: TRIM_THRESHOLD });
  }

  if (OUTPUT_MARGIN > 0) {
    pipeline = pipeline.extend({
      top: OUTPUT_MARGIN,
      right: OUTPUT_MARGIN,
      bottom: OUTPUT_MARGIN,
      left: OUTPUT_MARGIN,
        extendWith: "copy",
    });
  }

  const finalImage = pipeline.webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT });

  if (dryRun) {
    return {
      status: "processed",
      reason: `Dry-run: would create ${outputFilePath}`,
    };
  }

  await finalImage.toFile(outputFilePath);

  return {
    status: "processed",
    reason: `Created ${outputFilePath}`,
  };
}

async function main() {
  if (!dryRun) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const inputFiles = getImageFiles(INPUT_DIR);
  const nameMap = loadNameMap();
  const plan = buildOutputPlan(inputFiles, nameMap);

  if (inputFiles.length === 0) {
    console.log(`No images found in ${INPUT_DIR}`);
    return;
  }

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);
  console.log(`Input: ${INPUT_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Crop(px): top=${CROP_TOP}, bottom=${CROP_BOTTOM}, left=${CROP_LEFT}, right=${CROP_RIGHT}`);
  console.log(`Auto-trim: ${AUTO_TRIM ? `on (threshold=${TRIM_THRESHOLD})` : "off"}`);
  console.log(`Output margin: ${OUTPUT_MARGIN}px`);
  console.log(`Name map: ${existsSync(NAME_MAP_FILE) ? NAME_MAP_FILE : "not found (using automatic names)"}`);
  console.log(`Found ${inputFiles.length} image(s)`);

  for (const task of plan) {
    try {
      const result = await processImage(task.inputFilePath, task.outputFilePath);
      if (result.status === "processed") {
        processed += 1;
        console.log(`[OK] ${result.reason}`);
      } else if (result.status === "skipped") {
        skipped += 1;
        console.warn(`[SKIP] ${result.reason}`);
      } else {
        errors += 1;
        console.error(`[ERROR] ${result.reason}`);
      }
    } catch (error) {
      errors += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[ERROR] ${task.inputFilePath} -> ${message}`);
    }
  }

  console.log("\nSummary");
  console.log(`Processed: ${processed}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});

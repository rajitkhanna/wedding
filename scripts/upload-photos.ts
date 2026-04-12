import { init } from "@instantdb/admin";
import fs from "fs";
import path from "path";

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

const photosDir = path.join(process.cwd(), "photos");

function walkDir(dir: string, base: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full);
    if (entry.isDirectory()) {
      results.push(...walkDir(full, base));
    } else if (/\.(jpg|jpeg|webp|png)$/i.test(entry.name)) {
      results.push(rel);
    }
  }
  return results;
}

const files = walkDir(photosDir, photosDir);
console.log(`Found ${files.length} photos to upload\n`);

for (const rel of files) {
  const fullPath = path.join(photosDir, rel);
  const buffer = fs.readFileSync(fullPath);
  const ext = path.extname(rel).slice(1).toLowerCase();
  const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
  // Normalize path separators to forward slashes
  const storagePath = rel.replace(/\\/g, "/");

  try {
    await db.storage.uploadFile(storagePath, buffer, { contentType });
    console.log(`✓ ${storagePath}`);
  } catch (err: any) {
    console.error(`✗ ${storagePath}: ${err.message}`);
  }
}

console.log("\nDone!");

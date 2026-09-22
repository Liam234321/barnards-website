#!/usr/bin/env node
// One-off migration script: pulls Project/SiteContent/Testimonial data out of
// Base44's public entity API, downloads every image it references, and writes
// out local JSON with the image URLs rewritten to point at the downloaded copies.
//
// Run from a machine with normal internet access (NOT a sandboxed CI/agent
// environment that blocks arbitrary outbound domains):
//
//   node scripts/extract-base44-assets.mjs
//
// Output:
//   extracted/images/*              - every unique image, original filename preserved
//   extracted/projects.json         - Project rows, image URLs rewritten to /images/...
//   extracted/site-content.json     - SiteContent rows, same
//   extracted/testimonials.json     - Testimonial rows (no images, included for completeness)

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const APP_ID = process.env.BASE44_APP_ID || '69aabd847b307df385694246';
const API_BASE = `https://base44.app/api/apps/${APP_ID}/entities`;
const OUT_DIR = path.resolve('extracted');
const IMAGES_DIR = path.join(OUT_DIR, 'images');

// Fields on each entity that hold image URLs (see base44/entities/*.jsonc)
const IMAGE_FIELDS = {
  Project: ['cover_image', 'gallery_images'],
  SiteContent: ['image_url', 'image_url_2', 'image_url_3'],
  Testimonial: [],
};

async function fetchEntity(name) {
  const res = await fetch(`${API_BASE}/${name}?limit=500`, {
    headers: { 'X-App-Id': APP_ID, Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${name}: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : (data.items || data.data || []);
}

function filenameFor(url) {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname) || 'image';
    return base.includes('.') ? base : `${base}.jpg`;
  } catch {
    return `image-${Math.random().toString(36).slice(2, 10)}.jpg`;
  }
}

async function downloadImage(url, seen) {
  if (seen.has(url)) return seen.get(url);

  let filename = filenameFor(url);
  // De-duplicate filenames from different URLs
  let candidate = filename;
  let i = 1;
  const used = new Set(seen.values());
  while (used.has(candidate)) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    candidate = `${base}-${i++}${ext}`;
  }
  filename = candidate;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ! failed to download ${url}: ${res.status}`);
    seen.set(url, url); // leave original URL in place on failure
    return url;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(IMAGES_DIR, filename), buf);

  const localPath = `/images/${filename}`;
  seen.set(url, localPath);
  console.log(`  downloaded ${url} -> ${localPath}`);
  return localPath;
}

async function rewriteImages(rows, fields, seen) {
  for (const row of rows) {
    for (const field of fields) {
      const value = row[field];
      if (!value) continue;
      if (Array.isArray(value)) {
        row[field] = await Promise.all(
          value.filter(Boolean).map((url) => downloadImage(url, seen))
        );
      } else if (typeof value === 'string' && /^https?:\/\//.test(value)) {
        row[field] = await downloadImage(value, seen);
      }
    }
  }
  return rows;
}

async function main() {
  await mkdir(IMAGES_DIR, { recursive: true });
  const seen = new Map(); // original URL -> local path

  console.log(`Fetching entities for app ${APP_ID}...`);
  const [projects, siteContent, testimonials] = await Promise.all([
    fetchEntity('Project'),
    fetchEntity('SiteContent'),
    fetchEntity('Testimonial'),
  ]);
  console.log(`  Project: ${projects.length}, SiteContent: ${siteContent.length}, Testimonial: ${testimonials.length}`);

  console.log('Downloading images...');
  await rewriteImages(projects, IMAGE_FIELDS.Project, seen);
  await rewriteImages(siteContent, IMAGE_FIELDS.SiteContent, seen);

  await writeFile(path.join(OUT_DIR, 'projects.json'), JSON.stringify(projects, null, 2));
  await writeFile(path.join(OUT_DIR, 'site-content.json'), JSON.stringify(siteContent, null, 2));
  await writeFile(path.join(OUT_DIR, 'testimonials.json'), JSON.stringify(testimonials, null, 2));

  console.log(`\nDone. ${seen.size} unique images downloaded to ${IMAGES_DIR}`);
  console.log(`Data written to ${OUT_DIR}/*.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

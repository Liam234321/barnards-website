// Zero-install version: paste this into the browser DevTools Console
// while viewing the LIVE site at https://barnard-built-portfolio.base44.app
// (open DevTools with F12, or right-click -> Inspect, then click "Console").
//
// If Chrome shows "Warning: paste blocked" first type: allow pasting
// then press Enter, then paste the script again.
//
// This version resizes/compresses images to sane web dimensions before
// zipping (portfolio photo originals are usually way bigger than a browser
// ever needs) so the result stays small enough to upload to GitHub / a chat.
//
// It downloads one file: base44-export.zip, containing:
//   images/            - every project + site photo, resized for web
//   projects.json
//   site-content.json
//   testimonials.json  (with image URLs rewritten to local /images/... paths)

(async () => {
  const APP_ID = localStorage.getItem('base44_app_id') || '69aabd847b307df385694246';
  const API_BASE = `https://base44.app/api/apps/${APP_ID}/entities`;

  // Images bigger than this get downscaled; images already smaller are left alone.
  const MAX_DIMENSION = 1920; // px, longest side
  const JPEG_QUALITY = 0.82;
  const SKIP_RESIZE_BELOW_BYTES = 300 * 1024; // don't bother resizing small files

  async function loadJSZip() {
    if (window.JSZip) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('Could not load JSZip from CDN'));
      document.head.appendChild(s);
    });
  }

  async function fetchEntity(name) {
    const res = await fetch(`${API_BASE}/${name}?limit=500`, {
      headers: { 'X-App-Id': APP_ID },
    });
    if (!res.ok) throw new Error(`${name} fetch failed: ${res.status}`);
    return res.json();
  }

  async function resizeIfNeeded(blob) {
    if (blob.size < SKIP_RESIZE_BELOW_BYTES || !blob.type.startsWith('image/')) {
      return { blob, ext: null };
    }
    try {
      const bitmap = await createImageBitmap(blob);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
      if (scale >= 1) {
        bitmap.close();
        return { blob, ext: null }; // already small enough
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const resizedBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
      );
      return { blob: resizedBlob || blob, ext: resizedBlob ? 'jpg' : null };
    } catch (e) {
      console.warn('resize failed, keeping original', e);
      return { blob, ext: null };
    }
  }

  await loadJSZip();
  const zip = new JSZip();
  const imagesFolder = zip.folder('images');
  const seen = new Map();
  let totalOriginal = 0;
  let totalFinal = 0;

  async function addImage(url) {
    if (!url) return url;
    if (seen.has(url)) return seen.get(url);

    let filename;
    try {
      filename = new URL(url).pathname.split('/').pop() || 'image.jpg';
    } catch {
      filename = `image-${Math.random().toString(36).slice(2, 8)}.jpg`;
    }
    if (!filename.includes('.')) filename += '.jpg';

    let localBlob;
    try {
      const resp = await fetch(url);
      const originalBlob = await resp.blob();
      totalOriginal += originalBlob.size;
      const { blob: finalBlob, ext } = await resizeIfNeeded(originalBlob);
      totalFinal += finalBlob.size;
      if (ext) filename = filename.replace(/\.[^.]+$/, `.${ext}`);
      localBlob = finalBlob;
    } catch (e) {
      console.warn('Failed to download', url, e);
      seen.set(url, url);
      return url;
    }

    const used = new Set(seen.values());
    let candidate = filename;
    let i = 1;
    while (used.has(`images/${candidate}`)) {
      const dot = filename.lastIndexOf('.');
      candidate = `${filename.slice(0, dot)}-${i++}${filename.slice(dot)}`;
    }

    imagesFolder.file(candidate, localBlob);
    const localPath = `images/${candidate}`;
    seen.set(url, localPath);
    console.log('downloaded', url, '->', localPath, `(${(localBlob.size / 1024).toFixed(0)} KB)`);
    return localPath;
  }

  async function rewrite(rows, fields) {
    for (const row of rows) {
      for (const field of fields) {
        const value = row[field];
        if (!value) continue;
        if (Array.isArray(value)) {
          row[field] = await Promise.all(value.filter(Boolean).map(addImage));
        } else if (typeof value === 'string' && /^https?:\/\//.test(value)) {
          row[field] = await addImage(value);
        }
      }
    }
  }

  console.log('Fetching entities...');
  const [projects, siteContent, testimonials] = await Promise.all([
    fetchEntity('Project'),
    fetchEntity('SiteContent'),
    fetchEntity('Testimonial'),
  ]);
  console.log(`Project: ${projects.length}, SiteContent: ${siteContent.length}, Testimonial: ${testimonials.length}`);

  console.log('Downloading + compressing images (this can take a minute)...');
  await rewrite(projects, ['cover_image', 'gallery_images']);
  await rewrite(siteContent, ['image_url', 'image_url_2', 'image_url_3']);

  zip.file('projects.json', JSON.stringify(projects, null, 2));
  zip.file('site-content.json', JSON.stringify(siteContent, null, 2));
  zip.file('testimonials.json', JSON.stringify(testimonials, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'base44-export.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();

  console.log(
    `Done! base44-export.zip in your Downloads folder. ` +
    `Images: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB -> ${(totalFinal / 1024 / 1024).toFixed(1)} MB.`
  );
})();

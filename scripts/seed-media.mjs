// Uploads MMC's own project photos (design/photos) to the Supabase `media` bucket,
// records them in public.media and links them to services, projects and the homepage.
// Idempotent: files are matched on their sha256, links are only set when empty.
//
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local.
// Run: npm run seed:media

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile(".env.local");
} catch {
  // Fall back to the shell environment.
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const DIR = "design/photos";

// file -> storage name, alt text, focal point (object-position %)
const PHOTOS = {
  "20240920_112524-scaled.jpg": ["groepenkast-aardlekautomaten", "Nieuwe groepenkast met een aardlekautomaat per groep", "New consumer unit with an RCBO on every circuit", 50, 40],
  "20240920_120951-scaled.jpg": ["supermarkt-verlichting-gangpad", "Gangpad in een supermarkt met nieuwe lichtlijnen aan het plafond", "Supermarket aisle with new ceiling light lines", 50, 40],
  "20240920_121002-scaled.jpg": ["supermarkt-kabelgoten-plafond", "Kabelgoten, ventilatiekanaal en verlichting boven de schappen van een supermarkt", "Cable trays, ductwork and lighting above supermarket shelves", 50, 35],
  "20240923_175045-scaled.jpg": ["monteur-gevelreclame-supermarkt", "Monteur van MMC Techniek op een trap bij de gevelreclame van een supermarkt", "MMC Techniek fitter on a ladder at a supermarket façade sign", 45, 35],
  "DSC_0004-scaled.jpg": ["renovatie-woongebouw-steiger", "Woongebouw in de steigers tijdens een renovatie, met bedrijfsbussen van MMC Techniek", "Residential building in scaffolding during renovation, with MMC Techniek vans", 50, 55],
  "PHOTO-2024-12-03-12-54-01.jpg": ["zonnepanelen-plat-dak", "Rijen zonnepanelen op een plat dak", "Rows of solar panels on a flat roof", 50, 55],
  "PHOTO-2024-12-03-12-54-02_1.jpg": ["omvormers-thuisbatterij-wand", "Twee omvormers en een thuisbatterij aan een bakstenen wand", "Two inverters and a home battery on a brick wall", 45, 45],
  "PHOTO-2024-12-03-12-54-03.jpg": ["hoofdverdeler-bedrijfspand", "Grote hoofdverdeler met meters en bekabeling in een bedrijfspand", "Large main distribution board with meters and cabling in a commercial building", 50, 45],
  "PHOTO-2024-12-03-12-54-04_2.jpg": ["onderconstructie-plat-dak", "Onderconstructie voor zonnepanelen op een plat dak", "Mounting frame for solar panels on a flat roof", 50, 60],
  "PHOTO-2024-12-03-12-54-04_3.jpg": ["onderconstructie-plat-dak-rijen", "Rijen onderconstructie op een plat bedrijfsdak, met bomen op de achtergrond", "Rows of mounting frame on a flat commercial roof, trees in the background", 50, 60],
  "PHOTO-2024-12-03-12-54-06_1.jpg": ["bedrijfshal-plafond-hoogwerker", "Plafond van een bedrijfshal met een hoogwerker en nieuwe leidingen", "Commercial hall ceiling with a scissor lift and new cabling", 50, 40],
  "PHOTO-2024-12-03-12-54-06_2.jpg": ["bedrijfshal-in-aanbouw", "Lege bedrijfshal tijdens de bouw, met bekabeling vanaf het plafond", "Empty commercial hall under construction, cables hanging from the ceiling", 50, 45],
  "PHOTO-2024-12-03-12-54-07_2.jpg": ["groepenkast-houtskeletbouw", "Groepenkast op een houten wand in een nieuwbouwproject", "Consumer unit on a timber wall in a new-build project", 45, 40],
  "PHOTO-2024-12-03-12-54-08.jpg": ["omvormer-technische-ruimte", "Omvormer tussen de ventilatiekanalen in een technische ruimte", "Inverter between ventilation ducts in a plant room", 55, 40],
  "PHOTO-2024-12-03-12-54-08_2.jpg": ["ruimte-plafondspots", "Afgewerkte ruimte met inbouwspots in het plafond", "Finished room with recessed ceiling spotlights", 50, 40],
  "PHOTO-2024-12-08-15-05-58.jpg": ["datakast-kantoor", "Datakast met patchpanelen in een kantoor", "Data cabinet with patch panels in an office", 50, 40],
  "PHOTO-2024-12-08-15-05-59-2.jpg": ["zonnepanelen-nieuwbouwwoningen", "Zonnepanelen op de schuine daken van een rij nieuwbouwwoningen, met steigers", "Solar panels on the pitched roofs of a row of new-build homes, with scaffolding", 50, 45],
  "PHOTO-2024-12-08-15-05-59.jpg": ["nieuwbouwwoning-steiger", "Nieuwbouwwoning in de steigers met een bedrijfsbus ervoor", "New-build home in scaffolding with a van in front", 45, 40],
  "PHOTO-2024-12-08-15-06-00.jpg": ["winkel-plafond-hoogwerker", "Monteur op een hoogwerker werkt aan het plafond van een winkel", "Fitter on a scissor lift working on a shop ceiling", 50, 35],
  "PHOTO-2024-12-08-15-06-01.jpg": ["winkel-gangpaden", "Winkel met volle schappen onder de nieuwe verlichting", "Shop with stocked shelves under the new lighting", 50, 45],
  "PHOTO-2024-12-08-15-12-08.jpg": ["nieuwbouwproject-bouwkraan", "Nieuwbouwproject met een bouwkraan en bedrijfsbussen", "New-build project with a tower crane and vans", 50, 55],
  "PHOTO-2024-12-08-15-12-09.jpg": ["houtskeletbouw-bekabeling", "Interieur in houtskeletbouw met bekabeling en gereedschap", "Timber-frame interior with cabling and tools", 50, 45],
};

// project slug -> [cover, ...gallery] (storage names)
const PROJECTS = {
  "supermarkt-verlichting-en-elektra": ["monteur-gevelreclame-supermarkt", "supermarkt-verlichting-gangpad", "supermarkt-kabelgoten-plafond"],
  "zonnepanelen-plat-bedrijfsdak": ["zonnepanelen-plat-dak", "onderconstructie-plat-dak", "onderconstructie-plat-dak-rijen"],
  "omvormers-en-thuisbatterij": ["omvormers-thuisbatterij-wand"],
  "hoofdverdeler-bedrijfspand": ["hoofdverdeler-bedrijfspand"],
  "groepenkast-vernieuwd": ["groepenkast-aardlekautomaten"],
  "nieuwbouw-elektra-houtskeletbouw": ["houtskeletbouw-bekabeling", "groepenkast-houtskeletbouw", "nieuwbouwproject-bouwkraan"],
  "zonnepanelen-nieuwbouwwoningen": ["zonnepanelen-nieuwbouwwoningen", "nieuwbouwwoning-steiger"],
  "bedrijfshal-elektra-en-verlichting": ["bedrijfshal-plafond-hoogwerker", "bedrijfshal-in-aanbouw", "ruimte-plafondspots", "datakast-kantoor"],
  "winkel-plafondverlichting": ["winkel-plafond-hoogwerker", "winkel-gangpaden"],
  "renovatie-woongebouw": ["renovatie-woongebouw-steiger"],
  "technische-ruimte-omvormer": ["omvormer-technische-ruimte"],
};

// Service heroes. Warmtepompen, airconditioning and verduurzaming have no real photo yet.
const SERVICE_HEROES = {
  zonnepanelen: "onderconstructie-plat-dak",
  thuisbatterij: "omvormers-thuisbatterij-wand",
  meterkast: "groepenkast-houtskeletbouw",
  onderhoud: "omvormer-technische-ruimte",
};

// Homepage photo slots.
const HOME = {
  hero: ["zonnepanelen-plat-dak", "monteur-gevelreclame-supermarkt", "groepenkast-aardlekautomaten"],
  audience: { home: "zonnepanelen-nieuwbouwwoningen", business: "hoofdverdeler-bedrijfspand" },
};

const toHex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

async function check(res, what) {
  const { error, data } = await res;
  if (error) throw new Error(`${what}: ${error.message}`);
  return data;
}

const ids = {};

for (const [file, [name, altNl, altEn, fx, fy]] of Object.entries(PHOTOS)) {
  const input = await readFile(path.join(DIR, file));
  const body = await sharp(input).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  const meta = await sharp(body).metadata();
  const { dominant } = await sharp(body).stats();
  const sha256 = createHash("sha256").update(body).digest("hex");
  const storagePath = `photos/${name}.jpg`;

  const existing = await check(db.from("media").select("id").eq("sha256", sha256).maybeSingle(), `lookup ${name}`);
  if (existing) {
    ids[name] = existing.id;
    console.log("skip  ", storagePath);
    continue;
  }

  await check(db.storage.from("media").upload(storagePath, body, { contentType: "image/jpeg", upsert: true, cacheControl: "31536000" }), `upload ${name}`);
  const row = await check(
    db.from("media").insert({
      bucket: "media", path: storagePath, mime: "image/jpeg", bytes: body.length,
      width: meta.width, height: meta.height, sha256, dominant_color: toHex(dominant),
      alt: { nl: altNl, en: altEn }, focal_x: fx, focal_y: fy,
    }).select("id").single(),
    `insert ${name}`,
  );
  ids[name] = row.id;
  console.log("upload", storagePath, `${meta.width}x${meta.height}`, `${Math.round(body.length / 1024)} kB`);
}

for (const [slug, names] of Object.entries(PROJECTS)) {
  const project = await check(db.from("projects").select("id, cover_media_id").eq("slug", slug).maybeSingle(), `project ${slug}`);
  if (!project) continue;
  if (!project.cover_media_id) {
    await check(db.from("projects").update({ cover_media_id: ids[names[0]] }).eq("id", project.id), `cover ${slug}`);
  }
  const rows = names.slice(1).map((n, i) => ({ project_id: project.id, media_id: ids[n], sort_order: i + 1 }));
  if (rows.length) await check(db.from("project_images").upsert(rows, { onConflict: "project_id,media_id" }), `gallery ${slug}`);
}

for (const [slug, name] of Object.entries(SERVICE_HEROES)) {
  await check(db.from("services").update({ hero_media_id: ids[name] }).eq("slug", slug).is("hero_media_id", null), `service ${slug}`);
}

const hero = await check(db.from("home_sections").select("content").eq("key", "hero").single(), "home hero");
if (!hero.content.media) {
  await check(db.from("home_sections").update({ content: { ...hero.content, media: HOME.hero.map((n) => ids[n]) } }).eq("key", "hero"), "home hero media");
}
const audience = await check(db.from("home_sections").select("content").eq("key", "audience").single(), "home audience");
if (!audience.content.home_media) {
  await check(
    db.from("home_sections").update({ content: { ...audience.content, home_media: ids[HOME.audience.home], business_media: ids[HOME.audience.business] } }).eq("key", "audience"),
    "home audience media",
  );
}

// Product photos already live in the legacy product-images bucket. Register them in
// public.media (no re-upload) and link them to the products they were copied from.
const products = await check(
  db.from("products").select("id, name, media_id, source_admin_product_id").not("source_admin_product_id", "is", null),
  "products",
);
let productPhotos = 0;
for (const product of products) {
  const legacy = await check(db.from("admin_products").select("image, images").eq("id", product.source_admin_product_id).single(), `legacy ${product.name}`);
  const urls = [legacy.image, ...(legacy.images ?? [])].filter(Boolean);
  const mediaIds = [];
  for (const [i, publicUrl] of urls.entries()) {
    const objectPath = decodeURIComponent(publicUrl.split("/object/public/product-images/")[1] ?? "");
    if (!objectPath) continue;
    const existing = await check(db.from("media").select("id").eq("bucket", "product-images").eq("path", objectPath).maybeSingle(), `lookup ${objectPath}`);
    if (existing) {
      mediaIds.push(existing.id);
      continue;
    }
    const res = await fetch(publicUrl);
    if (!res.ok) {
      console.warn("missing", publicUrl, res.status);
      continue;
    }
    const body = Buffer.from(await res.arrayBuffer());
    const sha256 = createHash("sha256").update(body).digest("hex");
    // The same file uploaded twice for two products: reuse the one media row.
    const same = await check(db.from("media").select("id").eq("sha256", sha256).maybeSingle(), `lookup sha ${objectPath}`);
    if (same) {
      console.warn("duplicate product photo, reusing", objectPath);
      mediaIds.push(same.id);
      continue;
    }
    const meta = await sharp(body).metadata();
    const { dominant } = await sharp(body).stats();
    const row = await check(
      db.from("media").insert({
        bucket: "product-images", path: objectPath, mime: res.headers.get("content-type") ?? `image/${meta.format}`, bytes: body.length,
        width: meta.width, height: meta.height, sha256, dominant_color: toHex(dominant),
        alt: i === 0 ? { nl: product.name, en: product.name } : { nl: `${product.name}, foto ${i + 1}`, en: `${product.name}, photo ${i + 1}` },
      }).select("id").single(),
      `insert ${objectPath}`,
    );
    mediaIds.push(row.id);
    productPhotos++;
  }
  if (!mediaIds.length) continue;
  if (!product.media_id) await check(db.from("products").update({ media_id: mediaIds[0] }).eq("id", product.id), `cover ${product.name}`);
  const rows = mediaIds.slice(1).map((media_id, i) => ({ product_id: product.id, media_id, sort_order: i + 1 }));
  if (rows.length) await check(db.from("product_images").upsert(rows, { onConflict: "product_id,media_id" }), `gallery ${product.name}`);
}

console.log(`Done: ${Object.keys(ids).length} project photos and ${productPhotos} new product photos linked.`);

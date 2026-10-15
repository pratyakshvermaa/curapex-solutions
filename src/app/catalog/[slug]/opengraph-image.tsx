import fs from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getAllMedicines, getMedicineBySlug, snippet } from "@/lib/medicines";

/**
 * Per-product link preview (WhatsApp, Facebook, …): product photo beside the
 * name and composition. Rendered once per product at build time and encoded
 * as JPEG, because WhatsApp drops large PNG previews.
 */

export const runtime = "nodejs";
export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";
export const alt = "Curapex Solutions product";

export function generateStaticParams() {
  return getAllMedicines().map((m) => ({ slug: m.slug }));
}

const ASSETS = path.join(process.cwd(), "src", "assets");
const PHOTO_BOX = 520;

async function dataUri(buf: Buffer, mime: string) {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/** Product photo fitted onto a white square (also decodes .webp, which the renderer can't). */
async function productPhoto(image?: string): Promise<string | null> {
  if (!image || /^https?:/.test(image)) return null;
  try {
    const file = path.join(process.cwd(), "public", image.replace(/^\//, ""));
    const png = await sharp(file)
      .resize(PHOTO_BOX, PHOTO_BOX, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .flatten({ background: "#ffffff" })
      .png()
      .toBuffer();
    return dataUri(png, "image/png");
  } catch {
    return null;
  }
}

/** Drop listing suffixes like ", Packaging Size: 3*10 Tablets" and cut at a word boundary. */
function headline(name: string, max = 60) {
  const base = name.split(/,\s*(packaging|pack size|packing)/i)[0].trim();
  if (base.length <= max) return base;
  const cut = base.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,(-]+$/, "")}…`;
}

export default async function Image({ params }: { params: { slug: string } }) {
  const medicine = getMedicineBySlug(params.slug);
  const name = headline(medicine?.name || "Curapex Solutions");
  const composition = snippet(medicine?.composition, 90);
  const form = medicine?.category;

  const [photo, mark, lora, sans, sansBold] = await Promise.all([
    productPhoto(medicine?.images?.[0]),
    fs.readFile(path.join(ASSETS, "brand-mark.svg")),
    fs.readFile(path.join(ASSETS, "fonts", "Lora-600.ttf")),
    fs.readFile(path.join(ASSETS, "fonts", "SourceSans3-400.ttf")),
    fs.readFile(path.join(ASSETS, "fonts", "SourceSans3-600.ttf")),
  ]);
  const markUri = await dataUri(mark, "image/svg+xml");

  const png = await new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 64px",
          background: "linear-gradient(120deg, #ffffff 0%, #f3f8fc 45%, #dcefee 100%)",
          fontFamily: "Source Sans 3",
          color: "#0b1f3a",
        }}
      >
        <div
          style={{
            width: PHOTO_BOX,
            height: PHOTO_BOX,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            borderRadius: 28,
            border: "2px solid #d7e7ea",
            boxShadow: "0 18px 40px -24px rgba(12,46,58,0.35)",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo || markUri}
            width={photo ? PHOTO_BOX : 360}
            height={photo ? PHOTO_BOX : 360}
            alt=""
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={markUri} width={52} height={52} alt="" />
            <div
              style={{
                display: "flex",
                fontFamily: "Lora",
                fontSize: 34,
                color: "#2f9496",
              }}
            >
              CURAPEX
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: 6,
                color: "#0b1f3a",
                opacity: 0.7,
                marginTop: 6,
              }}
            >
              SOLUTIONS
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: "Lora",
              fontSize: name.length > 40 ? 46 : 56,
              lineHeight: 1.12,
              marginTop: 34,
            }}
          >
            {name}
          </div>

          {composition && (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                lineHeight: 1.3,
                color: "#2f6f78",
                marginTop: 18,
              }}
            >
              {composition}
            </div>
          )}

          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              color: "#0b1f3a",
              opacity: 0.75,
              marginTop: 18,
            }}
          >
            {form ? `${form} · Wholesale & export supply` : "Wholesale & export supply"}
          </div>

          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 34,
              background: "#25D366",
              color: "#ffffff",
              fontSize: 26,
              fontWeight: 600,
              padding: "14px 30px",
              borderRadius: 999,
            }}
          >
            Enquire on WhatsApp
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Lora", data: lora, weight: 600, style: "normal" },
        { name: "Source Sans 3", data: sans, weight: 400, style: "normal" },
        { name: "Source Sans 3", data: sansBold, weight: 600, style: "normal" },
      ],
    }
  ).arrayBuffer();

  const jpeg = await sharp(Buffer.from(png))
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg" },
  });
}

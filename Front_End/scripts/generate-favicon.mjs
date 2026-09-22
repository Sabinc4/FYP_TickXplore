import sharp from "sharp";

const SRC = "public/logo.jpg";
const RADIUS_MASK = (size) => `
<svg width="${size}" height="${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
</svg>`;

const generate = async (size, out) => {
  const circle = Buffer.from(RADIUS_MASK(size));
  await sharp(SRC)
    .resize(size, size, { fit: "cover", position: "centre" })
    .composite([{ input: circle, blend: "dest-in" }])
    .png()
    .toFile(out);
  console.log("Generated", out);
};

await generate(48, "public/favicon.png");
await generate(192, "public/favicon-192.png");
await generate(180, "public/apple-touch-icon.png");

const BLACK_THRESHOLD = 25;

const generateSlateLogo = async (size, out) => {
  const { data, info } = await sharp(SRC)
    .resize(size, size, { fit: "cover", position: "centre" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i += 1) {
    const j = i * 4;
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    rgba[j] = r;
    rgba[j + 1] = g;
    rgba[j + 2] = b;
    rgba[j + 3] = r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD ? 0 : 255;
  }

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .flatten({ background: "#0f172a" })
    .png()
    .toFile(out);
  console.log("Generated", out);
};

await generateSlateLogo(192, "public/logo-slate.png");
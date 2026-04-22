import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import sharp from "sharp";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxUploadSizeInBytes = 10 * 1024 * 1024;
const maxImageDimension = 1600;
const webpQuality = 72;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required" }, { status: 400 });
  }

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  if (file.size > maxUploadSizeInBytes) {
    return NextResponse.json(
      { error: "Image is too large. Please upload an image under 10MB." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.webp`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  const filePath = join(uploadDir, fileName);
  const optimizedBuffer = await sharp(buffer, { animated: true })
    .rotate()
    .resize(maxImageDimension, maxImageDimension, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      effort: 4,
      quality: webpQuality,
    })
    .toBuffer();

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, optimizedBuffer);

  return NextResponse.json({
    originalSize: file.size,
    optimizedSize: optimizedBuffer.length,
    url: `/uploads/${fileName}`,
  });
}

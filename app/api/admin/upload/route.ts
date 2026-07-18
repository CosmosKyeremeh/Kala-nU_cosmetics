import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/require-admin";

// Local-disk stand-in for Cloudinary — saves straight into /public/uploads
// so no third-party account/API key is needed for this demo. Swap for a
// real object-storage upload (Cloudinary, S3, etc.) before going to
// production, since files here don't survive a serverless redeploy.
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function POST(req: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".bin";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = path.join(process.cwd(), "public", "uploads", safeName);

  await writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${safeName}` }, { status: 201 });
}

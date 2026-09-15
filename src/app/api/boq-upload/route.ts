import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Public endpoint (anonymous visitors submit BOQs, same trust level as the
// contact/quote forms) but deliberately narrow: allowlisted file types only
// (never executables), a size cap, and uploaded to Cloudinary's
// "authenticated" delivery type so files aren't publicly reachable or
// guessable by URL — only a server-generated signed link (see
// src/app/admin/(protected)/boq/[id]/page.tsx) can open them.
const MAX_BYTES = 15 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, { resourceType: "image" | "raw"; format: string }> = {
  "application/pdf": { resourceType: "raw", format: "pdf" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { resourceType: "raw", format: "xlsx" },
  "application/vnd.ms-excel": { resourceType: "raw", format: "xls" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { resourceType: "raw", format: "docx" },
  "application/msword": { resourceType: "raw", format: "doc" },
  "image/jpeg": { resourceType: "image", format: "jpg" },
  "image/png": { resourceType: "image", format: "png" },
};

export async function POST(request: Request) {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: "File upload is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const typeInfo = ALLOWED_TYPES[file.type];
  if (!typeInfo) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: PDF, XLSX, DOCX, JPG, PNG." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large. Maximum size is 15MB." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "maven-enterprise/boq",
      resource_type: typeInfo.resourceType,
      type: "authenticated",
      // Never derive the stored id from the user-supplied filename — avoids
      // any path/virtual-folder trickery. The original name is kept
      // separately (see below) purely for display in the admin view.
    });
    return NextResponse.json({
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format ?? typeInfo.format,
      bytes: result.bytes,
      originalName: file.name.slice(0, 200),
      url: result.secure_url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}

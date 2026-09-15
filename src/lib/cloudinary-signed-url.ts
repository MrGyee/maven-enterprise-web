import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { BoqFile } from "@/lib/validation/forms";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// BOQ files are uploaded with type: "authenticated" (see
// src/app/api/boq-upload/route.ts), so their secure_url alone doesn't work
// — every delivery needs a signature only the server (holding the API
// secret) can produce. Admin-only: never call this from a client component.
export function getSignedBoqFileUrl(file: BoqFile): string {
  return cloudinary.url(file.publicId, {
    resource_type: file.resourceType,
    type: "authenticated",
    format: file.format,
    sign_url: true,
    secure: true,
  });
}

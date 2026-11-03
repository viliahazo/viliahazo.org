import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getDb } from "./db";

export const IMAGES_BUCKET = process.env.S3_BUCKET || "images";

/**
 * Client S3 initialisé si les variables S3_* sont configurées.
 * Compatible avec :
 * - Supabase S3 Protocol (https://<project-ref>.supabase.co/storage/v1/s3)
 * - AWS S3
 * - Cloudflare R2
 * - MinIO
 */
function getS3Client(): S3Client | null {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return null;

  return new S3Client({
    region: process.env.S3_REGION || "eu-central-1",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: Boolean(
      process.env.S3_FORCE_PATH_STYLE === "true" ||
        process.env.S3_ENDPOINT?.includes("supabase.co"),
    ),
  });
}

/**
 * Téléverse une image vers S3 (Supabase S3 / AWS S3 / Cloudflare R2 / MinIO)
 * ou vers Supabase Storage natif si S3_* n'est pas configuré.
 */
export async function uploadImage(
  file: File | Blob,
  folder = "vaovao",
): Promise<{ url: string } | { error: string }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const type = file.type || "image/jpeg";
    const ext =
      type === "image/png"
        ? "png"
        : type === "image/webp"
          ? "webp"
          : type === "image/gif"
            ? "gif"
            : "jpg";

    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // 1. Si S3 direct est configuré, téléversement via @aws-sdk/client-s3
    const s3 = getS3Client();
    if (s3) {
      await s3.send(
        new PutObjectCommand({
          Bucket: IMAGES_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: type,
        }),
      );

      // Génération de l'URL publique
      if (process.env.S3_PUBLIC_URL) {
        const base = process.env.S3_PUBLIC_URL.replace(/\/+$/, "");
        return { url: `${base}/${key}` };
      }

      // Résolution automatique pour Supabase S3
      if (process.env.S3_ENDPOINT?.includes("supabase.co")) {
        const match = process.env.S3_ENDPOINT.match(/https:\/\/([a-z0-9-]+)\.(?:storage\.)?supabase\.co/);
        const ref = match?.[1] || "qitqyaghipsmpgzqocac";
        return {
          url: `https://${ref}.supabase.co/storage/v1/object/public/${IMAGES_BUCKET}/${key}`,
        };
      }

      if (process.env.S3_ENDPOINT) {
        const endpoint = process.env.S3_ENDPOINT.replace(/\/+$/, "");
        return { url: `${endpoint}/${IMAGES_BUCKET}/${key}` };
      }

      const region = process.env.S3_REGION || "eu-central-1";
      return { url: `https://${IMAGES_BUCKET}.s3.${region}.amazonaws.com/${key}` };
    }

    // 2. Repli vers le client Supabase Storage natif
    const db = getDb();
    if (!db) {
      return { error: "Storage non configuré (ni S3 ni Supabase)" };
    }

    const { data, error } = await db.storage
      .from(IMAGES_BUCKET)
      .upload(key, buffer, {
        contentType: type,
        upsert: false,
      });

    if (error) {
      console.error("[storage] Upload error:", error.message);
      return { error: error.message };
    }

    const { data: pub } = db.storage.from(IMAGES_BUCKET).getPublicUrl(data.path);
    return { url: pub.publicUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[storage] Upload exception:", message);
    return { error: message };
  }
}

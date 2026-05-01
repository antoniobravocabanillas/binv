import { getStore } from "@netlify/blobs";

export const PRODUCT_IMAGE_STORE = "icc-product-media";
export const PRODUCT_IMAGE_PREFIX = "product-images";
export const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_PRODUCT_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export function getProductMediaStore() {
  return getStore(PRODUCT_IMAGE_STORE);
}

export function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function createProductImageKey(fileName: string) {
  const safeName = sanitizeFileName(fileName) || "producto";
  const extension = safeName.includes(".") ? safeName.split(".").pop() : "jpg";
  const baseName = safeName.replace(/\.[^.]+$/, "");
  return `${PRODUCT_IMAGE_PREFIX}/${crypto.randomUUID()}-${baseName}.${extension}`;
}

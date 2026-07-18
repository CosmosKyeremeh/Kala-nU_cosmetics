import QRCode from "qrcode";

// Payload format matches the PRD spec: Base64-encoded JSON containing the
// product id, so the POS scanner can decode it client-side without a
// server round-trip just to find out what was scanned.
export async function generateProductQr(productId: string): Promise<string> {
  const payload = Buffer.from(JSON.stringify({ pid: productId, store: "GlowCart", v: 1 })).toString(
    "base64"
  );
  return QRCode.toDataURL(payload, { width: 300, margin: 1 });
}

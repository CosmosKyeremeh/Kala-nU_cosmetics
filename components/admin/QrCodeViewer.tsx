export function QrCodeViewer({ qrCode, productName }: { qrCode: string; productName: string }) {
  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border border-rose-light/40 bg-white p-4">
      {/* eslint-disable-next-line @next/next/no-img-element -- base64 data URL, next/image can't optimize this */}
      <img src={qrCode} alt={`QR code for ${productName}`} className="h-24 w-24 rounded-lg border border-rose-light/40" />
      <div>
        <p className="text-sm font-medium">POS QR Code</p>
        <p className="text-xs text-slate">Scan with the POS scanner, or print for in-store use.</p>
        <a
          href={qrCode}
          download={`${productName}-qr.png`}
          className="mt-2 inline-block text-xs font-medium text-rose-primary hover:underline"
        >
          Download
        </a>
      </div>
    </div>
  );
}

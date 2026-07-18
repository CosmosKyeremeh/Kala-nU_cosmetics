import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { QrCodeViewer } from "@/components/admin/QrCodeViewer";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display mb-6 text-3xl font-semibold">Edit Product</h1>
      {product.qrCode && <QrCodeViewer qrCode={product.qrCode} productName={product.name} />}
      <ProductForm product={product} />
    </div>
  );
}

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatGHS } from "@/lib/utils";

export type ReceiptItem = { name: string; quantity: number; unitPrice: number; lineTotal: number };

export function generateReceiptPdf({
  receiptNumber,
  cashierName,
  items,
  subtotal,
  total,
  paymentMethod,
}: {
  receiptNumber: string;
  cashierName: string;
  items: ReceiptItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: [80, 150 + items.length * 6] });

  doc.setFontSize(16);
  doc.text("GlowCart", 40, 10, { align: "center" });
  doc.setFontSize(9);
  doc.text("Premium Cosmetics, Ghana", 40, 15, { align: "center" });

  doc.setFontSize(8);
  doc.text(`Receipt: ${receiptNumber}`, 5, 23);
  doc.text(`Date: ${new Date().toLocaleString("en-GH")}`, 5, 27);
  doc.text(`Cashier: ${cashierName}`, 5, 31);

  autoTable(doc, {
    startY: 35,
    margin: { left: 5, right: 5 },
    styles: { fontSize: 7, cellPadding: 1 },
    head: [["Item", "Qty", "Price", "Total"]],
    body: items.map((i) => [i.name, String(i.quantity), formatGHS(i.unitPrice), formatGHS(i.lineTotal)]),
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 5;
  doc.setFontSize(9);
  doc.text(`Subtotal: ${formatGHS(subtotal)}`, 5, finalY);
  doc.text(`Total: ${formatGHS(total)}`, 5, finalY + 5);
  doc.text(`Payment: ${paymentMethod.replace("_", " ")}`, 5, finalY + 10);

  doc.setFontSize(7);
  doc.text("Thank you for shopping with GlowCart!", 40, finalY + 18, { align: "center" });
  doc.text("Returns accepted within 7 days with receipt.", 40, finalY + 22, { align: "center" });

  return doc;
}

// Mocked SMS/email notifications — logged to the console instead of sent
// via a real provider (Arkesel, Gmail SMTP), the same "mock what needs a
// paid account" approach used for Paystack. Swap the body of these two
// functions for real API calls when real credentials exist.

const SMS_TEMPLATES: Record<string, (name: string, orderId: string, total: string) => string> = {
  PLACED: (name, orderId, total) =>
    `Hi ${name}, your GlowCart order #${orderId} has been placed! ${total}. Track it on the order confirmation page.`,
  CONFIRMED: (name, orderId) => `Hi ${name}, your order #${orderId} is confirmed and being prepared!`,
  PACKED: (name) => `Hi ${name}, your GlowCart order is packed and ready for shipping!`,
  SHIPPED: (name) => `Hi ${name}, your order is on its way! Expected delivery: 1-3 days.`,
  DELIVERED: (name) => `Hi ${name}, your GlowCart order has been delivered! Enjoy your products.`,
  CANCELLED: (name, orderId) => `Hi ${name}, your order #${orderId} has been cancelled. Contact us for support.`,
};

export function sendOrderStatusSms(params: {
  phone: string;
  name: string;
  orderId: string;
  status: string;
  total: string;
}) {
  const template = SMS_TEMPLATES[params.status];
  const message = template ? template(params.name, params.orderId, params.total) : null;
  if (!message) return;

  console.log(`[mock SMS -> ${params.phone}] ${message}`);
}

export function sendOrderStatusEmail(params: {
  email: string;
  name: string;
  orderId: string;
  status: string;
  trackingCode: string;
}) {
  const subject = `Your GlowCart order is now ${params.status}`;
  const body = `Hi ${params.name}, your order #${params.orderId} status changed to ${params.status}. Track: /track/${params.trackingCode}`;

  console.log(`[mock email -> ${params.email}] Subject: ${subject}\n${body}`);
}

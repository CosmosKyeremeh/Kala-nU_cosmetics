import { NextResponse } from "next/server";

// MOCK Paystack verification — no real Paystack account/keys needed for this demo.
// A real implementation would call https://api.paystack.co/transaction/verify/:reference
// with the secret key and check `data.status === "success"`.
export async function POST(req: Request) {
  const { reference } = await req.json();

  // Simulate network latency like a real payment gateway call.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (process.env.MOCK_PAYSTACK_FAIL === "true") {
    return NextResponse.json(
      { status: false, message: "Payment declined (simulated failure)" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: true,
    reference,
    message: "Payment verified (mock)",
  });
}

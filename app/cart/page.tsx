"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore, useCartHydrated, cartSubtotal } from "@/lib/store/cart";
import { formatGHS, calculateDeliveryFee } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const hydrated = useCartHydrated();

  if (!hydrated) return null;

  const subtotal = cartSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-rose-primary px-8 py-3 font-semibold text-white hover:bg-rose-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display mb-8 text-4xl font-semibold">Your Cart</h1>

      <ul className="divide-y divide-rose-light/40">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-rose-light/10">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-medium hover:text-rose-primary">
                {item.name}
              </Link>
              <p className="text-sm text-slate">{formatGHS(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="h-8 w-8 rounded border border-rose-light"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                className="h-8 w-8 rounded border border-rose-light"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-medium">{formatGHS(item.price * item.quantity)}</p>
            <button
              onClick={() => removeItem(item.productId)}
              className="text-sm text-slate hover:text-rose-primary"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 ml-auto max-w-xs space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatGHS(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? "Free" : formatGHS(deliveryFee)}</span>
        </div>
        <div className="flex justify-between border-t border-rose-light/40 pt-2 font-display text-xl">
          <span>Total</span>
          <span>{formatGHS(subtotal + deliveryFee)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block w-full rounded-full bg-rose-primary py-3 text-center font-semibold text-white hover:bg-rose-primary/90"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

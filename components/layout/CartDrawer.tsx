"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore, useCartHydrated, cartSubtotal } from "@/lib/store/cart";
import { formatGHS } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, updateQuantity, removeItem } = useCartStore();
  const hydrated = useCartHydrated();

  if (!hydrated || !isOpen) return null;

  const subtotal = cartSubtotal(items);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 bg-charcoal/40"
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-rose-light/40 p-4">
          <h2 className="font-display text-xl font-semibold">Your Cart</h2>
          <button onClick={close} className="text-slate hover:text-rose-primary" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-slate">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-rose-light/20">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm text-slate">{formatGHS(item.price)}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        className="h-6 w-6 rounded border border-rose-light text-sm"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        className="h-6 w-6 rounded border border-rose-light text-sm"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                      <button
                        className="ml-auto text-xs text-slate hover:text-rose-primary"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-rose-light/40 p-4">
            <div className="mb-3 flex justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>{formatGHS(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="block w-full rounded-full bg-rose-primary py-3 text-center text-sm font-semibold text-white hover:bg-rose-primary/90"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

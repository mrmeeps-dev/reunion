'use client';

import { useSyncExternalStore } from 'react';
import { isEarlyBirdActive } from '@/lib/early-bird';

function subscribe() {
  return () => {};
}

function getClientEarlyBird() {
  return isEarlyBirdActive();
}

/** Static export HTML assumes early bird until the client date is known. */
function getServerEarlyBird() {
  return true;
}

function useEarlyBird() {
  return useSyncExternalStore(subscribe, getClientEarlyBird, getServerEarlyBird);
}

export function FridayPriceCallout() {
  const earlyBird = useEarlyBird();

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base leading-snug text-stone-800 md:text-lg">
      {earlyBird ? (
        <>
          <p className="font-semibold">
            <span className="text-stone-900">$76 early bird</span> through July 31 · <span className="text-stone-900">$86</span> after
          </p>
          <p className="mt-1 text-sm font-medium text-stone-600 md:text-base">Pay by Sept 22 · No walk-up registration</p>
        </>
      ) : (
        <>
          <p className="font-semibold text-stone-900">$86 per person</p>
          <p className="mt-1 text-sm font-medium text-stone-600 md:text-base">Pay by Sept 22 · No walk-up registration</p>
        </>
      )}
    </div>
  );
}

export function FridayPaymentGuideLine() {
  const earlyBird = useEarlyBird();

  return (
    <p className="mt-2 text-base leading-relaxed text-stone-800 md:text-lg">
      {earlyBird ? (
        <>
          Friday dinner: <span className="font-semibold text-stone-900">$76 early bird</span> through July 31, then{' '}
          <span className="font-semibold text-stone-900">$86</span> (pay by <span className="font-semibold text-stone-900">Sept 22</span>).
        </>
      ) : (
        <>
          Friday dinner: <span className="font-semibold text-stone-900">$86 per person</span> (pay by{' '}
          <span className="font-semibold text-stone-900">Sept 22</span>).
        </>
      )}{' '}
      Saturday gathering is <span className="font-semibold text-emerald-800">free</span>, with drinks and food available for purchase.
    </p>
  );
}

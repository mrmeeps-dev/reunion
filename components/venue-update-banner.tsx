'use client';

import { useEffect, useState } from 'react';

/** New key so anyone who dismissed the incorrect Friday notice still sees this. */
const STORAGE_KEY = 'venue-update-saturday-gardens-2026';

export function VenueUpdateBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'dismissed');
  }, []);

  if (!visible) return null;

  return (
    <div className="border-b border-rose-200 bg-rose-50 text-stone-800" role="status">
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3 md:items-center md:px-6">
        <p className="flex-1 text-sm leading-snug md:text-base">
          <span className="font-semibold text-rose-800">Venue update</span>
          <span className="text-stone-500"> — </span>
          Saturday no-host meetup moved to The Gardens at Bear Canyon.{' '}
          <a href="#schedule" className="font-semibold text-stone-900 underline decoration-rose-300 underline-offset-2 hover:text-brand">
            See schedule
          </a>
        </p>
        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, 'dismissed');
            setVisible(false);
          }}
          className="shrink-0 rounded-md px-2 py-1 text-sm font-semibold text-stone-600 transition-colors hover:bg-rose-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          aria-label="Dismiss venue update"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

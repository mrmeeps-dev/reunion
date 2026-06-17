'use client';

import { useEffect, useState } from 'react';
import { AttendeeBadges } from '@/components/attendee-badges';
import { fetchAttendees } from '@/lib/attendees';

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; names: string[] }
  | { status: 'error' };

export function AttendeesSection() {
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchAttendees()
      .then((names) => {
        if (!cancelled) {
          setState({ status: 'ready', names });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: 'error' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const count = state.status === 'ready' ? state.names.length : 0;

  return (
    <>
      <div className="text-center">
        <p className="section-kicker">Classmate Roll Call</p>
        <h2 id="attending-heading" className="section-heading">
          Who&apos;s Attending
        </h2>
        <p className="section-subheading" aria-live="polite">
          {state.status === 'loading'
            ? 'Loading the latest attendee list…'
            : state.status === 'ready' && count > 0
              ? `${count} classmates are currently listed.`
              : state.status === 'error'
                ? 'Attendee names are temporarily unavailable.'
                : 'Attendee names are loading or temporarily unavailable.'}
        </p>
        {state.status === 'ready' && count > 0 ? (
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
            Every name here is part of the story. We can&apos;t wait to celebrate together at the reunion.
          </p>
        ) : null}
      </div>

      {state.status === 'loading' ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center text-stone-600 shadow-sm md:p-8 md:text-lg">
          Loading classmates…
        </div>
      ) : state.status === 'ready' && count > 0 ? (
        <AttendeeBadges names={state.names} />
      ) : (
        <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center text-stone-600 shadow-sm md:p-8 md:text-lg">
          We&apos;ll publish the attendee list here as soon as it&apos;s available.
        </div>
      )}
    </>
  );
}

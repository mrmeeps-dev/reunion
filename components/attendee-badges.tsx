'use client';

import { useEffect, useState } from 'react';

type AttendeeBadgesProps = {
  names: string[];
};

function shuffleNames(input: string[]): string[] {
  const list = [...input];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function AttendeeBadges({ names }: AttendeeBadgesProps) {
  const [shuffledNames, setShuffledNames] = useState(names);
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const [isExpandedDesktop, setIsExpandedDesktop] = useState(false);
  const mobileVisibleCount = 5;
  const desktopVisibleCount = 30;
  const hiddenMobileCount = Math.max(0, shuffledNames.length - mobileVisibleCount);
  const hiddenDesktopCount = Math.max(0, shuffledNames.length - desktopVisibleCount);

  useEffect(() => {
    setShuffledNames(shuffleNames(names));
    setIsExpandedMobile(false);
    setIsExpandedDesktop(false);
  }, [names]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shuffledNames.map((name, index) => {
          const visibleOnMobile = isExpandedMobile || index < mobileVisibleCount;
          const visibleOnDesktop = isExpandedDesktop || index < desktopVisibleCount;

          return (
            <div
              key={name}
              className={`${visibleOnMobile ? 'block' : 'hidden'} ${visibleOnDesktop ? 'md:block' : 'md:hidden'} rounded-xl border border-rose-200/60 px-4 py-3 text-base font-medium text-stone-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:rotate-[0.2deg] hover:shadow-md md:text-lg`}
              style={{
                backgroundImage:
                  index % 3 === 0
                    ? 'linear-gradient(135deg, rgba(255,241,242,1) 0%, rgba(255,255,255,1) 55%, rgba(250,250,249,1) 100%)'
                    : index % 3 === 1
                      ? 'linear-gradient(155deg, rgba(255,255,255,1) 0%, rgba(255,241,242,1) 45%, rgba(250,250,249,1) 100%)'
                      : 'linear-gradient(120deg, rgba(250,250,249,1) 0%, rgba(255,241,242,1) 50%, rgba(255,255,255,1) 100%)',
              }}
            >
              {name}
            </div>
          );
        })}
      </div>

      {hiddenMobileCount > 0 ? (
        <button
          type="button"
          onClick={() => setIsExpandedMobile((prev) => !prev)}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-colors duration-200 hover:bg-stone-100 md:hidden"
          aria-expanded={isExpandedMobile}
        >
          {isExpandedMobile ? 'Show fewer names' : `See ${hiddenMobileCount} others joining`}
          <span className={`text-xs transition-transform duration-200 ${isExpandedMobile ? 'rotate-180' : ''}`} aria-hidden="true">
            ▾
          </span>
        </button>
      ) : null}

      {hiddenDesktopCount > 0 ? (
        <button
          type="button"
          onClick={() => setIsExpandedDesktop((prev) => !prev)}
          className="mt-5 hidden items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-colors duration-200 hover:bg-stone-100 md:inline-flex"
          aria-expanded={isExpandedDesktop}
        >
          {isExpandedDesktop ? 'Show fewer names' : `See ${hiddenDesktopCount} others joining`}
          <span className={`text-xs transition-transform duration-200 ${isExpandedDesktop ? 'rotate-180' : ''}`} aria-hidden="true">
            ▾
          </span>
        </button>
      ) : null}
    </div>
  );
}

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

  useEffect(() => {
    setShuffledNames(shuffleNames(names));
  }, [names]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shuffledNames.map((name, index) => (
        <div
          key={name}
          className="rounded-xl border border-rose-200/60 px-4 py-3 text-base font-medium text-stone-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:rotate-[0.2deg] hover:shadow-md md:text-lg"
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
      ))}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';

type MemorySlide = {
  src: string;
  alt: string;
  caption: string;
};

const AUTOPLAY_MS = 5000;

export function MemoriesGallery() {
  const slides = useMemo<MemorySlide[]>(
    () => [
      {
        src: '/photos/IMG_7633.jpeg',
        alt: 'Heidi Scanlon and Jeff Sherrer',
        caption: 'Heidi Scanlon & Jeff Sherrer',
      },
      {
        src: '/photos/IMG_4984.jpeg',
        alt: 'Spencer Lower',
        caption: 'Spencer Lower',
      },
      {
        src: '/photos/IMG_7636.jpeg',
        alt: "Girls' party reunion photo",
        caption: "Girls' Party",
      },
      {
        src: '/photos/IMG_7635.jpeg',
        alt: 'Graduation rehearsal',
        caption: 'Graduation Rehearsal',
      },
      {
        src: '/photos/IMG_7637.jpeg',
        alt: 'Sahuaro Singers',
        caption: 'Sahuaro Singers',
      },
      {
        src: '/photos/image.png',
        alt: 'Carolyn Lochert and Elaine Myles',
        caption: 'Carolyn Lochert & Elaine Myles',
      },
      {
        src: '/photos/IMG_7632.jpeg',
        alt: 'Scott Sanders, Lee Ann Markle, Linda Schloss with Student Council Advisor',
        caption: 'Scott Sanders, Lee Ann Markle, Linda Schloss (Student Council Advisor)',
      },
      {
        src: '/photos/IMG_3953.jpeg',
        alt: 'Rodeo Queen and King',
        caption: 'Rodeo Queen and King',
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const goTo = (nextIndex: number) => {
    setHasUserInteracted(true);
    const safe = (nextIndex + slides.length) % slides.length;
    setIndex(safe);
  };

  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  useEffect(() => {
    if (isPaused || hasUserInteracted) return;

    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [hasUserInteracted, isPaused, slides.length]);

  const activeSlide = slides[index];
  const desktopVisibleSlides = useMemo(() => {
    const count = Math.min(3, slides.length);
    return Array.from({ length: count }, (_, offset) => {
      const slideIndex = (index + offset) % slides.length;
      return {
        slideIndex,
        slide: slides[slideIndex],
      };
    });
  }, [index, slides]);

  return (
    <div
      className="mx-auto mt-6 w-full max-w-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-ambient md:hidden">
        {/* object-contain = full photo visible; neutral bars if aspect differs (cover was cropping on mobile) */}
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-stone-100 sm:aspect-[16/10]">
          <img src={activeSlide.src} alt={activeSlide.alt} className="h-full w-full object-contain object-center" />
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 py-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-200">
            Photo {index + 1} of {slides.length}
          </p>
          <p className="mt-1 text-base font-semibold text-white">{activeSlide.caption}</p>
        </div>

        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/30 text-lg text-white backdrop-blur transition-colors duration-200 hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Previous memory photo"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/30 text-lg text-white backdrop-blur transition-colors duration-200 hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Next memory photo"
        >
          ›
        </button>
      </div>

      <div className="hidden md:block">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Showing {Math.min(3, slides.length)} of {slides.length} photos
          </p>
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-base text-stone-700 transition-colors duration-200 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
              aria-label="Previous memory photos"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white text-base text-stone-700 transition-colors duration-200 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
              aria-label="Next memory photos"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {desktopVisibleSlides.map(({ slideIndex, slide }) => (
            <button
              key={`${slide.src}-${slideIndex}`}
              type="button"
              onClick={() => goTo(slideIndex)}
              className="group overflow-hidden rounded-xl border border-stone-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
              aria-label={`View memory photo ${slideIndex + 1}`}
            >
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-stone-100">
                <img src={slide.src} alt={slide.alt} className="h-full w-full object-contain object-center" />
              </div>
              <p className="px-3 py-2 text-sm font-semibold text-stone-800">{slide.caption}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(dotIndex)}
            className={`h-2.5 rounded-full transition-all duration-200 ${
              dotIndex === index ? 'w-7 bg-brand' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label={`Go to memory photo ${dotIndex + 1}`}
            aria-current={dotIndex === index ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
}

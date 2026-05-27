'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type MemorySlide = {
  src: string;
  alt: string;
  caption: string;
};

const AUTOPLAY_MS = 5000;

/** Block background scroll without changing scroll position (no position:fixed). */
function lockBodyScroll() {
  const html = document.documentElement;
  const { style: htmlStyle } = html;
  const { style: bodyStyle } = document.body;
  const scrollbarWidth = window.innerWidth - html.clientWidth;
  const previous = {
    htmlOverflow: htmlStyle.overflow,
    bodyOverflow: bodyStyle.overflow,
    bodyPaddingRight: bodyStyle.paddingRight,
  };

  htmlStyle.overflow = 'hidden';
  bodyStyle.overflow = 'hidden';
  if (scrollbarWidth > 0) {
    bodyStyle.paddingRight = `${scrollbarWidth}px`;
  }

  return () => {
    htmlStyle.overflow = previous.htmlOverflow;
    bodyStyle.overflow = previous.bodyOverflow;
    bodyStyle.paddingRight = previous.bodyPaddingRight;
  };
}

function MemoryPhotoCard({
  slide,
  slideIndex,
  onSelect,
  lazy = false,
  isCenter = false,
}: {
  slide: MemorySlide;
  slideIndex: number;
  onSelect: (slideIndex: number) => void;
  lazy?: boolean;
  isCenter?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(slideIndex)}
      className={`group overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-colors duration-200 hover:border-stone-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500 ${
        isCenter ? 'border-brand ring-2 ring-brand/20' : 'border-stone-200'
      }`}
      aria-label={`View memory photo: ${slide.caption}`}
      aria-current={isCenter ? 'true' : undefined}
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-stone-100">
        <img
          src={slide.src}
          alt={slide.alt}
          className="h-full w-full object-contain object-center"
          loading={lazy ? 'lazy' : undefined}
        />
      </div>
      <p className="px-3 py-2 text-sm font-semibold leading-snug text-stone-800">{slide.caption}</p>
    </button>
  );
}

function MemoryLightbox({
  slides,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  slides: MemorySlide[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const slide = slides[index];
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);

  onCloseRef.current = onClose;
  onPrevRef.current = onPrev;
  onNextRef.current = onNext;

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (!portalRoot) return;

    const unlockScroll = lockBodyScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key === 'ArrowLeft') onPrevRef.current();
      if (event.key === 'ArrowRight') onNextRef.current();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      unlockScroll();
    };
  }, [portalRoot]);

  if (!portalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${slides.length}: ${slide.caption}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/85"
        onClick={() => onCloseRef.current()}
        aria-label="Close photo viewer"
      />

      <div className="relative z-10 flex w-full max-w-5xl flex-col">
        <button
          type="button"
          onClick={() => onCloseRef.current()}
          className="absolute -top-1 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/40 text-2xl leading-none text-white backdrop-blur transition-colors duration-200 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-top-2"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex max-h-[min(72vh,40rem)] w-full items-center justify-center rounded-xl bg-stone-950/50">
          <img
            src={slide.src}
            alt={slide.alt}
            className="max-h-[min(72vh,40rem)] w-full object-contain"
          />
        </div>

        <div className="mt-4 px-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
            Photo {index + 1} of {slides.length}
          </p>
          <p className="mt-1 text-base font-semibold text-white sm:text-lg">{slide.caption}</p>
        </div>

        <button
          type="button"
          onClick={onPrev}
          className="absolute left-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/40 text-xl text-white backdrop-blur transition-colors duration-200 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-left-14"
          aria-label="Previous photo"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={onNext}
          className="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/40 text-xl text-white backdrop-blur transition-colors duration-200 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:-right-14"
          aria-label="Next photo"
        >
          ›
        </button>
      </div>
    </div>,
    portalRoot,
  );
}

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
      {
        src: '/photos/IMG_0193.jpeg',
        alt: 'Newspaper Staff',
        caption: 'Newspaper Staff',
      },
      {
        src: '/photos/IMG_0194.jpeg',
        alt: 'Billy Lopez',
        caption: 'Billy Lopez',
      },
      {
        src: '/photos/IMG_0195.jpeg',
        alt: 'Eleanor "Casey" Extract',
        caption: 'Eleanor "Casey" Extract',
      },
      {
        src: '/photos/IMG_0196.jpeg',
        alt: 'Dick McConnell',
        caption: 'Dick McConnell',
      },
      {
        src: '/photos/IMG_0197.jpeg',
        alt: 'Henry "Hank" Egbert',
        caption: 'Henry "Hank" Egbert',
      },
      {
        src: '/photos/IMG_0199.jpeg',
        alt: 'Jane Joens and Alan Simon',
        caption: 'Jane Joens & Alan Simon',
      },
      {
        src: '/photos/IMG_0201.jpeg',
        alt: 'Mark Gonzales (right)',
        caption: 'Mark Gonzales (right)',
      },
      {
        src: '/photos/IMG_0202.jpeg',
        alt: 'Mary Beth Neeley',
        caption: 'Mary Beth Neeley',
      },
      {
        src: '/photos/IMG_0183.jpeg',
        alt: 'Sahuaro Singers',
        caption: 'Sahuaro Singers',
      },
      {
        src: '/photos/IMG_0184.jpeg',
        alt: 'Richard Byrd',
        caption: 'Richard Byrd',
      },
      {
        src: '/photos/IMG_0186.jpeg',
        alt: 'Michael Bersin and Craig Ledbetter',
        caption: 'Michael Bersin & Craig Ledbetter',
      },
      {
        src: '/photos/IMG_0188.jpeg',
        alt: 'Sahuaro Singers',
        caption: 'Sahuaro Singers',
      },
      {
        src: '/photos/IMG_0189.jpeg',
        alt: 'Tony Poe',
        caption: 'Tony Poe',
      },
      {
        src: '/photos/IMG_0190.jpeg',
        alt: 'Tom W, Tony P, Dave J, Kenny O, Mike D, Scott S',
        caption: 'Tom W, Tony P, Dave J, Kenny O, Mike D, Scott S',
      },
      {
        src: '/photos/IMG_0191.jpeg',
        alt: 'Band Officers',
        caption: 'Band Officers',
      },
      {
        src: '/photos/IMG_0192.jpeg',
        alt: "Lisa D'Antimo and Sonya Evans",
        caption: "Lisa D'Antimo & Sonya Evans",
      },
      {
        src: '/photos/7464.jpeg',
        alt: 'Bob Springs, Senior Show',
        caption: 'Bob Springs, Senior Show',
      },
      {
        src: '/photos/7250174783735735219.jpeg',
        alt: 'Lunchroom: Ed Gwozdz, Lee Ann Markle, Tom Larson, Mary Bet Jacobs, Marci Morrison',
        caption: 'Lunchroom: Ed Gwozdz, Lee Ann Markle, Tom Larson, Mary Bet Jacobs, Marci Morrison',
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const autoplayBlockedRef = useRef(false);
  const lightboxIndexRef = useRef(0);
  lightboxIndexRef.current = lightboxIndex;

  const stopAutoplay = useCallback(() => {
    autoplayBlockedRef.current = true;
    setHasUserInteracted(true);
  }, []);

  const goTo = (nextIndex: number) => {
    stopAutoplay();
    const safe = (nextIndex + slides.length) % slides.length;
    setIndex(safe);
  };

  const goNext = useCallback(() => {
    stopAutoplay();
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length, stopAutoplay]);

  const goPrev = useCallback(() => {
    stopAutoplay();
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length, stopAutoplay]);

  const lightboxGoNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const lightboxGoPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const openLightbox = (slideIndex: number) => {
    stopAutoplay();
    const safe = (slideIndex + slides.length) % slides.length;
    setLightboxIndex(safe);
    setIsLightboxOpen(true);
  };

  const pauseAutoplay = stopAutoplay;

  const closeLightbox = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIndex(lightboxIndexRef.current);
    setIsLightboxOpen(false);
  }, []);

  useEffect(() => {
    if (hasUserInteracted || isExpanded || isLightboxOpen) return;

    const id = window.setInterval(() => {
      if (autoplayBlockedRef.current) return;
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [hasUserInteracted, isExpanded, isLightboxOpen, slides.length]);

  const activeSlide = slides[index];
  const desktopVisibleSlides = useMemo(() => {
    if (slides.length <= 2) {
      return slides.map((slide, slideIndex) => ({ slide, slideIndex }));
    }

    return [-1, 0, 1].map((offset) => {
      const slideIndex = (index + offset + slides.length) % slides.length;
      return { slide: slides[slideIndex], slideIndex };
    });
  }, [index, slides]);

  const showMobileDots = slides.length <= 10;

  const gridSlides = useMemo(() => {
    if (isExpanded) {
      return slides.map((slide, slideIndex) => ({ slide, slideIndex }));
    }

    return desktopVisibleSlides;
  }, [desktopVisibleSlides, isExpanded, slides]);

  return (
    <div className="mx-auto mt-6 w-full max-w-3xl">
      {isLightboxOpen ? (
        <MemoryLightbox slides={slides} index={lightboxIndex} onClose={closeLightbox} onPrev={lightboxGoPrev} onNext={lightboxGoNext} />
      ) : null}

      <div onMouseEnter={pauseAutoplay} onFocusCapture={pauseAutoplay}>
      {!isExpanded ? (
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={goPrev}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-lg text-stone-700 shadow-sm transition-colors duration-200 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
          aria-label="Previous memory photo"
        >
          ‹
        </button>

        <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-ambient">
          <button
            type="button"
            onClick={() => openLightbox(index)}
            className="flex aspect-[4/3] w-full cursor-zoom-in items-center justify-center bg-stone-100 sm:aspect-[16/10]"
            aria-label={`Enlarge photo: ${activeSlide.caption}`}
          >
            <img src={activeSlide.src} alt={activeSlide.alt} className="h-full w-full object-contain object-center" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-200">
              Photo {index + 1} of {slides.length}
            </p>
            <p className="mt-1 text-base font-semibold text-white">{activeSlide.caption}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-lg text-stone-700 shadow-sm transition-colors duration-200 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
          aria-label="Next memory photo"
        >
          ›
        </button>
      </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {gridSlides.map(({ slide, slideIndex }, position) => (
            <MemoryPhotoCard
              key={`${slide.src}-${slideIndex}`}
              slide={slide}
              slideIndex={slideIndex}
              onSelect={openLightbox}
              lazy={position > 3}
            />
          ))}
        </div>
      )}

      <div className="hidden md:block">
        {!isExpanded ? (
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Photo {index + 1} of {slides.length}
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
        ) : (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            All {slides.length} photos
          </p>
        )}

        <div className="grid grid-cols-3 gap-3">
          {gridSlides.map(({ slideIndex, slide }) => (
            <MemoryPhotoCard
              key={`${slide.src}-${slideIndex}`}
              slide={slide}
              slideIndex={slideIndex}
              onSelect={openLightbox}
              lazy={isExpanded && slideIndex > 2}
              isCenter={!isExpanded && slideIndex === index}
            />
          ))}
        </div>
      </div>

      {showMobileDots && !isExpanded ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:hidden">
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
      ) : null}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-base font-semibold text-stone-900 shadow-sm transition-colors duration-200 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Back to slideshow' : `View all ${slides.length} photos`}
          <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
            ▾
          </span>
        </button>
      </div>
    </div>
  );
}

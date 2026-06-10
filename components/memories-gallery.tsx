'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  memoryPhotos,
  photoDisplayJpegSrc,
  photoDisplayWebpSrc,
  photoThumbJpegSrc,
  photoThumbWebpSrc,
  type MemoryPhoto,
} from '@/data/memory-photos';

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

function MemoryImage({
  photo,
  variant,
  className,
  lazy = false,
}: {
  photo: MemoryPhoto;
  variant: 'thumb' | 'display';
  className?: string;
  lazy?: boolean;
}) {
  const webpSrc = variant === 'thumb' ? photoThumbWebpSrc(photo.id) : photoDisplayWebpSrc(photo.id);
  const jpegSrc = variant === 'thumb' ? photoThumbJpegSrc(photo.id) : photoDisplayJpegSrc(photo.id);

  const imgClassName =
    variant === 'display'
      ? 'max-h-[min(72vh,40rem)] w-full object-contain'
      : 'h-full w-full object-contain object-center';

  return (
    <picture className={className ? `block ${className}` : 'block h-full w-full'}>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={jpegSrc}
        alt={photo.alt}
        className={imgClassName}
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
      />
    </picture>
  );
}

function MemoryPhotoCard({
  photo,
  slideIndex,
  onSelect,
  lazy = false,
  isCenter = false,
}: {
  photo: MemoryPhoto;
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
      aria-label={`View memory photo: ${photo.caption}`}
      aria-current={isCenter ? 'true' : undefined}
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-stone-100">
        <MemoryImage
          photo={photo}
          variant="thumb"
          className="h-full w-full object-contain object-center"
          lazy={lazy}
        />
      </div>
      <p className="px-3 py-2 text-sm font-semibold leading-snug text-stone-800">{photo.caption}</p>
    </button>
  );
}

function MemoryLightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: MemoryPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];
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

  useEffect(() => {
    const preload = (targetIndex: number) => {
      const target = photos[targetIndex];
      if (!target) return;

      for (const src of [photoDisplayWebpSrc(target.id), photoDisplayJpegSrc(target.id)]) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      }
    };

    preload((index + 1) % photos.length);
    preload((index - 1 + photos.length) % photos.length);
  }, [index, photos]);

  if (!portalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}: ${photo.caption}`}
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
          <MemoryImage photo={photo} variant="display" />
        </div>

        <div className="mt-4 px-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
            Photo {index + 1} of {photos.length}
          </p>
          <p className="mt-1 text-base font-semibold text-white sm:text-lg">{photo.caption}</p>
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
  const photos = memoryPhotos;

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
    const safe = (nextIndex + photos.length) % photos.length;
    setIndex(safe);
  };

  const goNext = useCallback(() => {
    stopAutoplay();
    setIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length, stopAutoplay]);

  const goPrev = useCallback(() => {
    stopAutoplay();
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length, stopAutoplay]);

  const lightboxGoNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const lightboxGoPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const openLightbox = (slideIndex: number) => {
    stopAutoplay();
    const safe = (slideIndex + photos.length) % photos.length;
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
      setIndex((prev) => (prev + 1) % photos.length);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [hasUserInteracted, isExpanded, isLightboxOpen, photos.length]);

  const activePhoto = photos[index];
  const desktopVisiblePhotos = useMemo(() => {
    if (photos.length <= 2) {
      return photos.map((photo, slideIndex) => ({ photo, slideIndex }));
    }

    return [-1, 0, 1].map((offset) => {
      const slideIndex = (index + offset + photos.length) % photos.length;
      return { photo: photos[slideIndex], slideIndex };
    });
  }, [index, photos]);

  const showMobileDots = photos.length <= 10;

  const gridPhotos = useMemo(() => {
    if (isExpanded) {
      return photos.map((photo, slideIndex) => ({ photo, slideIndex }));
    }

    return desktopVisiblePhotos;
  }, [desktopVisiblePhotos, isExpanded, photos]);

  return (
    <div className="mx-auto mt-6 w-full max-w-3xl">
      {isLightboxOpen ? (
        <MemoryLightbox
          photos={photos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={lightboxGoPrev}
          onNext={lightboxGoNext}
        />
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
            aria-label={`Enlarge photo: ${activePhoto.caption}`}
          >
            <MemoryImage
              photo={activePhoto}
              variant="thumb"
              className="h-full w-full object-contain object-center"
            />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-200">
              Photo {index + 1} of {photos.length}
            </p>
            <p className="mt-1 text-base font-semibold text-white">{activePhoto.caption}</p>
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
          {gridPhotos.map(({ photo, slideIndex }, position) => (
            <MemoryPhotoCard
              key={`${photo.id}-${slideIndex}`}
              photo={photo}
              slideIndex={slideIndex}
              onSelect={openLightbox}
              lazy={position > 1}
            />
          ))}
        </div>
      )}

      <div className="hidden md:block">
        {!isExpanded ? (
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Photo {index + 1} of {photos.length}
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
            All {photos.length} photos
          </p>
        )}

        <div className="grid grid-cols-3 gap-3">
          {gridPhotos.map(({ slideIndex, photo }) => (
            <MemoryPhotoCard
              key={`${photo.id}-${slideIndex}`}
              photo={photo}
              slideIndex={slideIndex}
              onSelect={openLightbox}
              lazy={isExpanded ? slideIndex > 2 : slideIndex !== index}
              isCenter={!isExpanded && slideIndex === index}
            />
          ))}
        </div>
      </div>

      {showMobileDots && !isExpanded ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:hidden">
          {photos.map((photo, dotIndex) => (
            <button
              key={photo.id}
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
          {isExpanded ? 'Back to slideshow' : `View all ${photos.length} photos`}
          <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
            ▾
          </span>
        </button>
      </div>
    </div>
  );
}

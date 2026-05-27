'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildTravelLocations,
  formatDistance,
  getHotelsFromLocations,
  getVenuesFromLocations,
  type LocationFilter,
  type TravelLocation,
} from '@/lib/travel-locations';

const HotelsMap = dynamic(() => import('@/components/hotels-map').then((module) => ({ default: module.HotelsMap })), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[16rem] items-center justify-center rounded-2xl border border-stone-200 bg-stone-100 text-base font-medium text-stone-600">
      Loading map…
    </div>
  ),
});

const LOCATION_FILTERS: LocationFilter[] = ['All', 'Near Friday Event', 'Near Saturday Event'];

const actionLinkClassName =
  'inline-flex min-h-11 items-center justify-center rounded-full border-2 border-stone-800 bg-white px-5 text-base font-semibold text-stone-900 transition-colors duration-200 hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900';

function MapLegend() {
  return (
    <ul
      className="pointer-events-none absolute bottom-3 left-3 z-[1000] flex flex-col items-start gap-2 rounded-lg border-2 border-stone-300 bg-white px-3 py-2.5 text-base text-stone-800 shadow-sm"
      aria-label="Map legend"
    >
      <li className="flex items-center gap-2.5">
        <span className="inline-block h-3.5 w-3.5 shrink-0 rounded-full bg-stone-700 ring-2 ring-white" aria-hidden="true" />
        Hotel options
      </li>
      <li className="flex items-center gap-2.5">
        <span className="inline-block h-3.5 w-3.5 shrink-0 rounded-full bg-amber-600 ring-2 ring-white" aria-hidden="true" />
        Reunion event
      </li>
    </ul>
  );
}

function LocationDetailCard({
  location,
  className = '',
}: {
  location: TravelLocation;
  className?: string;
}) {
  return (
    <article className={`flex h-full flex-col ${className}`}>
      {location.badge ? (
        <p className="text-base font-semibold uppercase tracking-wide text-amber-800">{location.badge}</p>
      ) : (
        <p className="text-base font-semibold uppercase tracking-wide text-stone-600">Hotel option</p>
      )}
      <h3 className="mt-1 text-xl font-extrabold leading-snug text-stone-900">{location.name}</h3>
      {location.kind === 'venue' ? (
        <p className="mt-1 text-base font-semibold text-stone-800">{location.subtitle}</p>
      ) : null}
      {location.distanceMiles !== null ? (
        <p className="mt-1 text-base font-medium text-stone-700">
          {formatDistance(location.distanceMiles)} from event
        </p>
      ) : null}
      <p className="mt-2 text-base leading-relaxed text-stone-800">{location.address}</p>
      {location.phone ? (
        <p className="mt-2 text-base text-stone-800">
          Phone:{' '}
          <a href={`tel:${location.phone.replace(/[^\d+]/g, '')}`} className="font-semibold underline decoration-stone-400 underline-offset-2">
            {location.phone}
          </a>
        </p>
      ) : null}
      {location.notes ? <p className="mt-2 text-base leading-relaxed text-stone-800">{location.notes}</p> : null}
      <div className="mt-auto flex flex-wrap gap-3 pt-4">
        {location.kind === 'hotel' ? (
          <a href={location.websiteUrl} className={actionLinkClassName} target="_blank" rel="noopener noreferrer">
            View hotel website
          </a>
        ) : null}
        <a href={location.directionsUrl} className={actionLinkClassName} target="_blank" rel="noopener noreferrer">
          Open directions
        </a>
      </div>
    </article>
  );
}

function FilterToggleGroup({
  filter,
  onFilterChange,
  idPrefix,
}: {
  filter: LocationFilter;
  onFilterChange: (next: LocationFilter) => void;
  idPrefix: string;
}) {
  return (
    <div role="tablist" aria-label="Filter locations" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {LOCATION_FILTERS.map((option) => {
        const isActive = filter === option;
        const inputId = `${idPrefix}-${option.replace(/\s+/g, '-').toLowerCase()}`;

        return (
          <button
            key={option}
            id={inputId}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(option)}
            className={`min-h-11 flex-1 rounded-xl border-2 px-4 py-2.5 text-base font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 sm:flex-none ${
              isActive
                ? 'border-brand bg-rose-50 text-stone-900'
                : 'border-stone-400 bg-white text-stone-900 hover:border-stone-600 hover:bg-stone-50'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function HotelsSection() {
  const [filter, setFilter] = useState<LocationFilter>('All');
  const [activeLocationId, setActiveLocationId] = useState('');
  const [enableMapPan, setEnableMapPan] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const skipScrollSyncRef = useRef(false);
  const scrollSyncTimerRef = useRef<number | null>(null);
  const panDebounceRef = useRef<number | null>(null);

  const locations = useMemo(() => buildTravelLocations(filter), [filter]);
  const mapHotels = useMemo(() => getHotelsFromLocations(locations), [locations]);
  const mapVenues = useMemo(() => getVenuesFromLocations(locations), [locations]);
  const fitBoundsKey = useMemo(
    () => `${filter}-${locations.map((location) => location.id).join(',')}`,
    [filter, locations],
  );

  const activeLocation = locations.find((location) => location.id === activeLocationId) ?? locations[0];
  const inactiveLocations = locations.filter((location) => location.id !== activeLocation?.id);

  const panToLat = activeLocation ? Number(activeLocation.lat) : null;
  const panToLng = activeLocation ? Number(activeLocation.lng) : null;

  const mapPanProps = {
    panToLat: Number.isFinite(panToLat) ? panToLat : null,
    panToLng: Number.isFinite(panToLng) ? panToLng : null,
    enablePan: enableMapPan,
  };

  useEffect(() => {
    if (locations.length === 0) {
      setActiveLocationId('');
      return;
    }
    if (!locations.some((location) => location.id === activeLocationId)) {
      setActiveLocationId(locations[0].id);
    }
  }, [activeLocationId, locations]);

  const scrollCarouselToLocation = useCallback((locationId: string) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector<HTMLElement>(`[data-location-id="${locationId}"]`);
    if (!card) return;

    skipScrollSyncRef.current = true;
    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    if (scrollSyncTimerRef.current !== null) {
      window.clearTimeout(scrollSyncTimerRef.current);
    }
    scrollSyncTimerRef.current = window.setTimeout(() => {
      skipScrollSyncRef.current = false;
    }, 450);
  }, []);

  const requestMapPan = useCallback(() => {
    if (panDebounceRef.current !== null) {
      window.clearTimeout(panDebounceRef.current);
    }
    panDebounceRef.current = window.setTimeout(() => {
      setEnableMapPan(true);
    }, 150);
  }, []);

  const selectLocation = useCallback(
    (locationId: string, options?: { scrollCarousel?: boolean }) => {
      setActiveLocationId(locationId);
      requestMapPan();
      if (options?.scrollCarousel) {
        scrollCarouselToLocation(locationId);
      }
    },
    [requestMapPan, scrollCarouselToLocation],
  );

  const handleFilterChange = (next: LocationFilter) => {
    setEnableMapPan(false);
    setFilter(next);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || locations.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (skipScrollSyncRef.current) return;

        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!mostVisible?.target) return;
        const locationId = mostVisible.target.getAttribute('data-location-id');
        if (locationId) {
          setActiveLocationId(locationId);
          requestMapPan();
        }
      },
      {
        root: carousel,
        threshold: [0.55, 0.7, 0.85],
      },
    );

    const cards = carousel.querySelectorAll<HTMLElement>('[data-location-id]');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [locations, requestMapPan]);

  useEffect(() => {
    return () => {
      if (scrollSyncTimerRef.current !== null) {
        window.clearTimeout(scrollSyncTimerRef.current);
      }
      if (panDebounceRef.current !== null) {
        window.clearTimeout(panDebounceRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <p className="text-center text-lg leading-relaxed text-stone-800 md:text-xl">
        Hotels and reunion meeting spots on the east side of Tucson. Use the filters to narrow options, then select a
        location to see full details.
      </p>

      {/* Mobile: map + horizontal carousel (no stacked list) */}
      <div className="flex flex-col lg:hidden">
        <div className="shrink-0 space-y-3">
          <FilterToggleGroup filter={filter} onFilterChange={handleFilterChange} idPrefix="mobile-filter" />
          <p className="text-base text-stone-700" aria-live="polite">
            {locations.length} location{locations.length === 1 ? '' : 's'} shown. Swipe the cards below to browse.
          </p>
        </div>

        <div className="relative mt-3 h-[60vh] min-h-[16rem] overflow-hidden rounded-2xl border-2 border-stone-300 bg-stone-100 shadow-ambient">
          <HotelsMap
            hotels={mapHotels}
            venues={mapVenues}
            activeLocationId={activeLocation?.id ?? ''}
            {...mapPanProps}
            onLocationSelect={(id) => selectLocation(id, { scrollCarousel: true })}
            fitBoundsKey={fitBoundsKey}
          />
          <MapLegend />
        </div>

        <div className="mt-0 flex h-[40vh] min-h-[14rem] flex-col border-2 border-t-0 border-stone-300 bg-stone-50">
          <p className="shrink-0 px-4 py-3 text-base font-semibold text-stone-900">Swipe for full details</p>
          <div
            ref={carouselRef}
            className="flex min-h-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-4 pb-4"
            aria-label="Location details carousel"
          >
            {locations.length === 0 ? (
              <p className="px-2 py-6 text-base text-stone-700">No locations match this filter.</p>
            ) : (
              locations.map((location) => (
                <article
                  key={location.id}
                  data-location-id={location.id}
                  className={`panel w-[88vw] max-w-md shrink-0 snap-center snap-always scroll-ml-4 p-5 first:scroll-ml-0 ${
                    location.id === activeLocation?.id ? 'border-brand ring-2 ring-brand/20' : ''
                  }`}
                  aria-current={location.id === activeLocation?.id ? 'true' : undefined}
                >
                  <LocationDetailCard location={location} />
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Desktop: master/detail */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,24rem)_1fr]">
        <aside className="flex flex-col gap-4">
          <FilterToggleGroup filter={filter} onFilterChange={handleFilterChange} idPrefix="desktop-filter" />

          {activeLocation ? (
            <div className="panel sticky top-28 z-10 border-2 border-brand/30 p-5 shadow-md">
              <p className="text-base font-semibold uppercase tracking-wide text-stone-700">Selected location</p>
              <div className="mt-3">
                <LocationDetailCard location={activeLocation} />
              </div>
            </div>
          ) : null}

          <div className="flex min-h-0 flex-col">
            <h3 className="text-base font-semibold uppercase tracking-wide text-stone-700">
              Other locations ({inactiveLocations.length})
            </h3>
            <ul className="mt-2 max-h-[22rem] space-y-3 overflow-y-auto pr-1" aria-label="Other hotels and venues">
              {inactiveLocations.length === 0 ? (
                <li className="rounded-xl border-2 border-dashed border-stone-300 px-4 py-6 text-base text-stone-700">
                  No other locations in this filter.
                </li>
              ) : (
                inactiveLocations.map((location) => (
                  <li key={location.id}>
                    <div className="rounded-xl border-2 border-stone-300 bg-white p-4">
                      <p className="text-base font-extrabold leading-snug text-stone-900">{location.name}</p>
                      {location.kind === 'venue' ? (
                        <p className="mt-0.5 text-base font-medium text-amber-900">{location.subtitle}</p>
                      ) : null}
                      {location.distanceMiles !== null ? (
                        <p className="mt-1 text-base text-stone-800">
                          {formatDistance(location.distanceMiles)} from event
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => selectLocation(location.id)}
                        className="mt-3 min-h-11 w-full rounded-xl border-2 border-stone-800 bg-stone-900 px-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                      >
                        Select
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>

        <div className="relative lg:sticky lg:top-28 lg:h-[calc(100vh-7rem)] lg:min-h-[34rem] lg:self-start">
          <div className="h-full overflow-hidden rounded-2xl border-2 border-stone-300 bg-stone-100 shadow-ambient [&_.leaflet-control-zoom]:m-3">
            <HotelsMap
              hotels={mapHotels}
              venues={mapVenues}
              activeLocationId={activeLocation?.id ?? ''}
              {...mapPanProps}
              onLocationSelect={(id) => selectLocation(id)}
              fitBoundsKey={fitBoundsKey}
            />
            <MapLegend />
          </div>
          <p className="mt-2 text-base text-stone-700" aria-live="polite">
            Map highlights the selected pin. Tap any marker to change your selection.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { EventVenue } from '@/data/event-venues';
import type { Hotel } from '@/data/hotels';
import 'leaflet/dist/leaflet.css';

type MapCoordinates = {
  lat: number;
  lng: number;
};

type HotelsMapProps = {
  hotels: Hotel[];
  venues: EventVenue[];
  activeLocationId: string;
  panToLat: number | null;
  panToLng: number | null;
  enablePan: boolean;
  onLocationSelect: (id: string) => void;
  fitBoundsKey: string;
};

function isValidCoordinate(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng);
}

function validPositions(positions: [number, number][]): [number, number][] {
  return positions.filter(([lat, lng]) => isValidCoordinate(lat, lng));
}

function FitAllBounds({
  positions,
  fitBoundsKey,
}: {
  positions: [number, number][];
  fitBoundsKey: string;
}) {
  const map = useMap();
  const lastFitKey = useRef('');

  useEffect(() => {
    const safePositions = validPositions(positions);
    if (safePositions.length === 0) return;
    if (lastFitKey.current === fitBoundsKey) return;
    lastFitKey.current = fitBoundsKey;

    const bounds =
      safePositions.length === 1
        ? L.latLngBounds([safePositions[0], safePositions[0]])
        : L.latLngBounds(safePositions);

    const fitAllMarkers = () => {
      map.invalidateSize();
      map.fitBounds(bounds, {
        padding: [48, 48],
        maxZoom: 14,
      });
    };

    fitAllMarkers();
    const refitTimer = window.setTimeout(fitAllMarkers, 150);
    map.on('resize', fitAllMarkers);

    return () => {
      window.clearTimeout(refitTimer);
      map.off('resize', fitAllMarkers);
    };
  }, [fitBoundsKey, map, positions]);

  return null;
}

function PanToActiveLocation({
  panToLat,
  panToLng,
  enablePan,
  fitBoundsKey,
}: {
  panToLat: number | null;
  panToLng: number | null;
  enablePan: boolean;
  fitBoundsKey: string;
}) {
  const map = useMap();
  const lastPannedKey = useRef('');
  const lastFitBoundsKey = useRef(fitBoundsKey);

  useEffect(() => {
    if (!enablePan) return;
    if (panToLat === null || panToLng === null) return;
    if (!isValidCoordinate(panToLat, panToLng)) return;

    const coordinateKey = `${panToLat},${panToLng}`;

    if (lastFitBoundsKey.current !== fitBoundsKey) {
      lastFitBoundsKey.current = fitBoundsKey;
      lastPannedKey.current = coordinateKey;
      return;
    }

    if (lastPannedKey.current === coordinateKey) return;

    let cancelled = false;

    const runPan = () => {
      if (cancelled) return;

      const latLng = L.latLng(panToLat, panToLng);
      if (!isValidCoordinate(latLng.lat, latLng.lng)) return;

      const container = map.getContainer();
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;

      lastPannedKey.current = coordinateKey;
      map.panTo(latLng, { animate: true, duration: 0.45 });
    };

    const timer = window.setTimeout(() => {
      map.whenReady(runPan);
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [enablePan, fitBoundsKey, map, panToLat, panToLng]);

  return null;
}

function hotelMarkerIcon(selected: boolean) {
  const scale = selected ? 1.12 : 1;
  const fill = '#44403c';
  const shadow = selected
    ? 'drop-shadow(0 3px 8px rgba(28,25,23,.4))'
    : 'drop-shadow(0 2px 5px rgba(28,25,23,.28))';

  return L.divIcon({
    className: 'hotel-marker-icon',
    html: `
      <span class="hotel-marker-pin" style="transform:scale(${scale});filter:${shadow}">
        <svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true">
          <path fill="${fill}" d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.82 20.18 0 13 0z"/>
          <circle cx="13" cy="13" r="4.5" fill="#fafaf9"/>
        </svg>
      </span>
    `,
    iconSize: [26, 34],
    iconAnchor: [13, 34],
    popupAnchor: [0, -30],
  });
}

function venueMarkerIcon(selected: boolean) {
  const scale = selected ? 1.1 : 1;

  return L.divIcon({
    className: 'hotel-marker-icon',
    html: `
      <span class="venue-marker-pin" style="transform:scale(${scale});filter:drop-shadow(0 2px 6px rgba(180,83,9,.4))">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <circle cx="14" cy="14" r="12" fill="#d97706" stroke="#fff" stroke-width="2.5"/>
          <path fill="#fff" d="M14 7.5l1.76 3.57 3.94.57-2.85 2.78.67 3.92L14 16.4l-3.52 1.94.67-3.92-2.85-2.78 3.94-.57L14 7.5z"/>
        </svg>
      </span>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12],
  });
}

export function HotelsMap({
  hotels,
  venues,
  activeLocationId,
  panToLat,
  panToLng,
  enablePan,
  onLocationSelect,
  fitBoundsKey,
}: HotelsMapProps) {
  const allPositions = useMemo(
    () =>
      validPositions([
        ...hotels.map((hotel) => [hotel.lat, hotel.lng] as [number, number]),
        ...venues.map((venue) => [venue.lat, venue.lng] as [number, number]),
      ]),
    [hotels, venues],
  );

  return (
    <MapContainer center={[32.26, -110.84]} zoom={11} className="hotels-map h-full w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />
      <FitAllBounds positions={allPositions} fitBoundsKey={fitBoundsKey} />
      <PanToActiveLocation
        panToLat={panToLat}
        panToLng={panToLng}
        enablePan={enablePan}
        fitBoundsKey={fitBoundsKey}
      />
      {venues
        .filter((venue) => isValidCoordinate(venue.lat, venue.lng))
        .map((venue) => (
        <Marker
          key={venue.id}
          position={[venue.lat, venue.lng]}
          icon={venueMarkerIcon(venue.id === activeLocationId)}
          eventHandlers={{
            click: () => onLocationSelect(venue.id),
          }}
        >
          <Popup className="hotel-map-popup">
            <p className="text-base font-semibold uppercase tracking-wide text-amber-800">Reunion event</p>
            <p className="mt-1 text-base font-semibold leading-snug text-stone-900">{venue.eventLabel}</p>
            <p className="text-base text-stone-800">{venue.name}</p>
          </Popup>
        </Marker>
      ))}
      {hotels
        .filter((hotel) => isValidCoordinate(hotel.lat, hotel.lng))
        .map((hotel) => (
        <Marker
          key={hotel.id}
          position={[hotel.lat, hotel.lng]}
          icon={hotelMarkerIcon(hotel.id === activeLocationId)}
          eventHandlers={{
            click: () => onLocationSelect(hotel.id),
          }}
        >
          <Popup className="hotel-map-popup">
            <p className="text-base font-semibold leading-snug text-stone-900">{hotel.name}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

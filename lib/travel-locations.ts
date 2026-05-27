import { EVENT_VENUES, formatVenueAddress, venueDirectionsUrl, type EventVenue } from '@/data/event-venues';
import { HOTELS, formatHotelAddress, hotelDirectionsUrl, type Hotel } from '@/data/hotels';

export type LocationFilter = 'All' | 'Near Friday Event' | 'Near Saturday Event';

export type TravelLocation =
  | {
      id: string;
      kind: 'hotel';
      name: string;
      subtitle: string;
      address: string;
      phone: string;
      notes: string;
      websiteUrl: string;
      directionsUrl: string;
      lat: number;
      lng: number;
      distanceMiles: number | null;
      badge?: string;
    }
  | {
      id: string;
      kind: 'venue';
      name: string;
      subtitle: string;
      address: string;
      phone: string;
      notes: string;
      websiteUrl: string;
      directionsUrl: string;
      lat: number;
      lng: number;
      distanceMiles: null;
      badge: string;
    };

const FRIDAY_VENUE_ID = 'savoy-opera-house';
const SATURDAY_VENUE_ID = 'three-canyon-beer-wine-garden';
const NEAR_EVENT_RADIUS_MILES = 10;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getVenueById(id: string): EventVenue {
  const venue = EVENT_VENUES.find((item) => item.id === id);
  if (!venue) throw new Error(`Unknown venue: ${id}`);
  return venue;
}

function hotelToLocation(hotel: Hotel, referenceVenue: EventVenue | null): TravelLocation {
  const miles =
    referenceVenue === null
      ? null
      : distanceMiles(hotel.lat, hotel.lng, referenceVenue.lat, referenceVenue.lng);

  return {
    id: hotel.id,
    kind: 'hotel',
    name: hotel.name,
    subtitle: formatHotelAddress(hotel),
    address: formatHotelAddress(hotel),
    phone: hotel.phone,
    notes: hotel.notes,
    websiteUrl: hotel.websiteUrl,
    directionsUrl: hotelDirectionsUrl(hotel),
    lat: hotel.lat,
    lng: hotel.lng,
    distanceMiles: miles === null ? null : Math.round(miles * 10) / 10,
  };
}

function venueToLocation(venue: EventVenue): TravelLocation {
  return {
    id: venue.id,
    kind: 'venue',
    name: venue.name,
    subtitle: venue.eventLabel,
    address: formatVenueAddress(venue),
    phone: '',
    notes: venue.schedule,
    websiteUrl: '',
    directionsUrl: venueDirectionsUrl(venue),
    lat: venue.lat,
    lng: venue.lng,
    distanceMiles: null,
    badge: 'Reunion event',
  };
}

export function buildTravelLocations(filter: LocationFilter): TravelLocation[] {
  const fridayVenue = getVenueById(FRIDAY_VENUE_ID);
  const saturdayVenue = getVenueById(SATURDAY_VENUE_ID);

  if (filter === 'All') {
    const venues = EVENT_VENUES.map(venueToLocation);
    const hotels = [...HOTELS]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((hotel) => hotelToLocation(hotel, null));
    return [...venues, ...hotels];
  }

  const referenceVenue = filter === 'Near Friday Event' ? fridayVenue : saturdayVenue;
  const hotels = [...HOTELS]
    .map((hotel) => hotelToLocation(hotel, referenceVenue))
    .filter((hotel) => (hotel.distanceMiles ?? 0) <= NEAR_EVENT_RADIUS_MILES)
    .sort((a, b) => (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0));

  return [venueToLocation(referenceVenue), ...hotels];
}

export function formatDistance(miles: number | null): string {
  if (miles === null) return '';
  if (miles < 0.2) return 'Less than 0.2 mi';
  return `${miles.toFixed(1)} mi`;
}

export function getHotelsFromLocations(locations: TravelLocation[]): Hotel[] {
  const ids = new Set(
    locations.filter((location) => location.kind === 'hotel').map((location) => location.id),
  );
  return HOTELS.filter((hotel) => ids.has(hotel.id));
}

export function getVenuesFromLocations(locations: TravelLocation[]): EventVenue[] {
  const ids = new Set(
    locations.filter((location) => location.kind === 'venue').map((location) => location.id),
  );
  return EVENT_VENUES.filter((venue) => ids.has(venue.id));
}

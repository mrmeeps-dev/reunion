export type EventVenue = {
  id: string;
  name: string;
  eventLabel: string;
  schedule: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
};

export const EVENT_VENUES: EventVenue[] = [
  {
    id: 'savoy-opera-house',
    name: 'Savoy Opera House',
    eventLabel: 'The Big Event',
    schedule: 'Friday, Oct 9 · 7:00 PM',
    addressLine1: '6541 E Tanque Verde Rd #13',
    city: 'Tucson',
    state: 'AZ',
    zip: '85715',
    lat: 32.2437,
    lng: -110.8226,
  },
  {
    id: 'three-canyon-beer-wine-garden',
    name: 'Three Canyon Beer and Wine Garden',
    eventLabel: 'Casual Meetup',
    schedule: 'Saturday, Oct 10 · 4:00–9:00 PM',
    addressLine1: '4999 N Sabino Canyon Rd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85750',
    lat: 32.3192,
    lng: -110.8078,
  },
];

export function formatVenueAddress(venue: EventVenue): string {
  return `${venue.addressLine1}, ${venue.city}, ${venue.state} ${venue.zip}`;
}

export function venueDirectionsUrl(venue: EventVenue): string {
  const query = encodeURIComponent(`${venue.name}, ${formatVenueAddress(venue)}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

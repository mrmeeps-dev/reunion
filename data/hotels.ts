export type Hotel = {
  id: string;
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  websiteUrl: string;
  phone: string;
  notes: string;
  imageUrl?: string;
};

export const HOTELS: Hotel[] = [
  {
    id: 'ventana-canyon-resort',
    name: 'Loews Ventana Canyon Resort',
    addressLine1: '7000 N Resort Dr',
    city: 'Tucson',
    state: 'AZ',
    zip: '85750',
    lat: 32.3275,
    lng: -110.8465,
    websiteUrl: 'https://www.loewshotels.com/ventana-canyon',
    phone: '520-299-2020',
    notes: 'Ventana Canyon Resort.',
  },
  {
    id: 'comfort-inn-suites-sabino-canyon',
    name: 'Comfort Suites at Sabino Canyon',
    addressLine1: '7007 E Tanque Verde Rd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85715',
    lat: 32.2427,
    lng: -110.8443,
    websiteUrl: 'https://www.choicehotels.com/',
    phone: '520-298-6756',
    notes: 'At Sabino Canyon Rd.',
  },
  {
    id: 'sheraton-tucson-hotel-suites',
    name: 'Sheraton Tucson Hotel & Suites',
    addressLine1: '5151 E Grant Rd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85712',
    lat: 32.2505,
    lng: -110.8804,
    websiteUrl: 'https://www.marriott.com/en-us/hotels/tussi-sheraton-tucson-hotel-and-suites',
    phone: '520-323-6262',
    notes: 'Location of our 10 year reunion.',
  },
  {
    id: 'sonesta-es-suites-tucson',
    name: 'Sonesta ES Suites Tucson',
    addressLine1: '6477 E Speedway Blvd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85710',
    lat: 32.2358,
    lng: -110.836,
    websiteUrl: 'https://www.sonesta.com/',
    phone: '520-721-0991',
    notes: 'East of Wilmot, next door to Embassy Suites.',
  },
  {
    id: 'embassy-suites-tucson-east',
    name: 'Embassy Suites by Hilton Tucson East',
    addressLine1: '6555 E Speedway Blvd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85710',
    lat: 32.2358,
    lng: -110.8342,
    websiteUrl: 'https://www.hilton.com/en/hotels/tuseees-embassy-suites-tucson-east/',
    phone: '520-721-7100',
    notes: 'East of Wilmot, next door to Sonesta Suites.',
    imageUrl: '/pool.avif',
  },
  {
    id: 'ramada-viscount-suites-tucson',
    name: 'Ramada by Wyndham Viscount Suites Tucson East',
    addressLine1: '4855 E Broadway Blvd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85711',
    lat: 32.2215,
    lng: -110.8878,
    websiteUrl: 'https://www.wyndhamhotels.com/ramada',
    phone: '877-504-9876',
    notes: 'Across from Williams Center.',
  },
  {
    id: 'hampton-inn-suites-tucson-east',
    name: 'Hampton Inn & Suites Tucson East/Williams Center',
    addressLine1: '251 S Wilmot Rd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85711',
    lat: 32.2185,
    lng: -110.857,
    websiteUrl: 'https://www.hilton.com/en/hotels/tusexhx-hampton-suites-tucson-east-williams-center/',
    phone: '518-637-7427',
    notes: 'This location is where the Buena Vista Theater was.',
  },
  {
    id: 'la-quinta-inn-tucson-east',
    name: 'La Quinta Inn by Wyndham Tucson East',
    addressLine1: '6404 E Broadway Blvd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85710',
    lat: 32.2215,
    lng: -110.8385,
    websiteUrl: 'https://www.wyndhamhotels.com/laquinta',
    phone: '844-535-3843',
    notes: 'Across the street from Wilmot Plaza.',
  },
  {
    id: 'hilton-tucson-east',
    name: 'Hilton Tucson East',
    addressLine1: '7600 E Broadway Blvd',
    city: 'Tucson',
    state: 'AZ',
    zip: '85710',
    lat: 32.2215,
    lng: -110.817,
    websiteUrl: 'https://www.hilton.com/en/hotels/tushehf-hilton-tucson-east/',
    phone: '520-721-5658',
    notes: 'Overlooking the beautiful Pantano Wash.',
  },
];

export function formatHotelAddress(hotel: Hotel): string {
  return `${hotel.addressLine1}, ${hotel.city}, ${hotel.state} ${hotel.zip}`;
}

export function hotelDirectionsUrl(hotel: Hotel): string {
  const query = encodeURIComponent(`${hotel.name}, ${formatHotelAddress(hotel)}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

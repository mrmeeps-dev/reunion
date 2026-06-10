export type MemoryPhoto = {
  id: string;
  alt: string;
  caption: string;
};

export const memoryPhotos: MemoryPhoto[] = [
  {
    id: 'IMG_7633',
    alt: 'Heidi Scanlon and Jeff Sherrer',
    caption: 'Heidi Scanlon & Jeff Sherrer',
  },
  {
    id: 'IMG_4984',
    alt: 'Spencer Lower',
    caption: 'Spencer Lower',
  },
  {
    id: 'IMG_7636',
    alt: "Girls' party reunion photo",
    caption: "Girls' Party",
  },
  {
    id: 'IMG_7635',
    alt: 'Graduation rehearsal',
    caption: 'Graduation Rehearsal',
  },
  {
    id: 'IMG_7637',
    alt: 'Sahuaro Singers',
    caption: 'Sahuaro Singers',
  },
  {
    id: 'image',
    alt: 'Carolyn Lochert and Elaine Myles',
    caption: 'Carolyn Lochert & Elaine Myles',
  },
  {
    id: 'IMG_7632',
    alt: 'Scott Sanders, Lee Ann Markle, Linda Schloss with Student Council Advisor',
    caption: 'Scott Sanders, Lee Ann Markle, Linda Schloss (Student Council Advisor)',
  },
  {
    id: 'IMG_3953',
    alt: 'Rodeo Queen and King',
    caption: 'Rodeo Queen and King',
  },
  {
    id: 'IMG_0193',
    alt: 'Newspaper Staff',
    caption: 'Newspaper Staff',
  },
  {
    id: 'IMG_0194',
    alt: 'Billy Lopez',
    caption: 'Billy Lopez',
  },
  {
    id: 'IMG_0195',
    alt: 'Eleanor "Casey" Extract',
    caption: 'Eleanor "Casey" Extract',
  },
  {
    id: 'IMG_0196',
    alt: 'Dick McConnell',
    caption: 'Dick McConnell',
  },
  {
    id: 'IMG_0197',
    alt: 'Henry "Hank" Egbert',
    caption: 'Henry "Hank" Egbert',
  },
  {
    id: 'IMG_0199',
    alt: 'Jane Joens and Alan Simon',
    caption: 'Jane Joens & Alan Simon',
  },
  {
    id: 'IMG_0201',
    alt: 'Mark Gonzales (right)',
    caption: 'Mark Gonzales (right)',
  },
  {
    id: 'IMG_0202',
    alt: 'Mary Beth Neeley',
    caption: 'Mary Beth Neeley',
  },
  {
    id: 'IMG_0183',
    alt: 'Sahuaro Singers',
    caption: 'Sahuaro Singers',
  },
  {
    id: 'IMG_0184',
    alt: 'Richard Byrd',
    caption: 'Richard Byrd',
  },
  {
    id: 'IMG_0186',
    alt: 'Michael Bersin and Craig Ledbetter',
    caption: 'Michael Bersin & Craig Ledbetter',
  },
  {
    id: 'IMG_0188',
    alt: 'Sahuaro Singers',
    caption: 'Sahuaro Singers',
  },
  {
    id: 'IMG_0189',
    alt: 'Tony Poe',
    caption: 'Tony Poe',
  },
  {
    id: 'IMG_0190',
    alt: 'Tom W, Tony P, Dave J, Kenny O, Mike D, Scott S',
    caption: 'Tom W, Tony P, Dave J, Kenny O, Mike D, Scott S',
  },
  {
    id: 'IMG_0191',
    alt: 'Band Officers',
    caption: 'Band Officers',
  },
  {
    id: 'IMG_0192',
    alt: "Lisa D'Antimo and Sonya Evans",
    caption: "Lisa D'Antimo & Sonya Evans",
  },
  {
    id: '7464',
    alt: 'Bob Springs, Senior Show',
    caption: 'Bob Springs, Senior Show',
  },
  {
    id: '7250174783735735219',
    alt: 'Lunchroom: Ed Gwozdz, Lee Ann Markle, Tom Larson, Mary Bet Jacobs, Marci Morrison',
    caption: 'Lunchroom: Ed Gwozdz, Lee Ann Markle, Tom Larson, Mary Bet Jacobs, Marci Morrison',
  },
];

export type PhotoVariant = 'thumb' | 'display';
export type PhotoFormat = 'webp' | 'jpeg';

export function photoSrc(id: string, variant: PhotoVariant, format: PhotoFormat): string {
  const folder = variant === 'thumb' ? 'thumbs' : 'display';
  const extension = format === 'webp' ? 'webp' : 'jpg';
  return `/photos/${folder}/${id}.${extension}`;
}

export function photoThumbWebpSrc(id: string): string {
  return photoSrc(id, 'thumb', 'webp');
}

export function photoThumbJpegSrc(id: string): string {
  return photoSrc(id, 'thumb', 'jpeg');
}

export function photoDisplayWebpSrc(id: string): string {
  return photoSrc(id, 'display', 'webp');
}

export function photoDisplayJpegSrc(id: string): string {
  return photoSrc(id, 'display', 'jpeg');
}

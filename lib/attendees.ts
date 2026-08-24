export const ATTENDEES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRqieH3cEMyZEf4jFNCsOOzdApH2-rtt35rziQt3IDMjf1OxZLex0fU2mGd_XrC-TWTHhAMtWvwD8r3/pub?gid=1850703428&single=true&output=csv';

const csvSplitRegex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;

function parseCsvLine(line: string): string[] {
  return line.split(csvSplitRegex).map((cell) => cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
}

function normalizeName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

export function parseAttendeesFromCsv(csvText: string): string[] {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseCsvLine);

  const names = rows
    .map((row) => normalizeName(row[0] ?? ''))
    .filter(Boolean)
    .filter((name) => !/^name$/i.test(name))
    .filter((name) => name !== '#N/A');

  const seen = new Set<string>();
  const uniqueNames: string[] = [];
  for (const name of names) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueNames.push(name);
    }
  }

  return uniqueNames.sort((a, b) => a.localeCompare(b));
}

export async function fetchAttendees(): Promise<string[]> {
  const response = await fetch(ATTENDEES_CSV_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load attendee list (${response.status})`);
  }

  const csvText = await response.text();
  return parseAttendeesFromCsv(csvText);
}

/** Early bird through end of July 31 (America/Phoenix). Rate rises Aug 1. */
export function isEarlyBirdActive(now = new Date()): boolean {
  const arizonaDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Phoenix',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return arizonaDate <= '2026-07-31';
}

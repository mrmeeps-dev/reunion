import { ScrollEffects } from '@/components/scroll-effects';
import { ProtectedEmailLink } from '@/components/protected-email-link';
import { ProtectedPhoneLink } from '@/components/protected-phone-link';
import { AttendeeBadges } from '@/components/attendee-badges';
import { MemoriesGallery } from '@/components/memories-gallery';
import { HotelsSection } from '@/components/hotels-section';
import Image from 'next/image';

const ATTENDEES_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRqieH3cEMyZEf4jFNCsOOzdApH2-rtt35rziQt3IDMjf1OxZLex0fU2mGd_XrC-TWTHhAMtWvwD8r3/pub?gid=1436665659&single=true&output=csv';

const csvSplitRegex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;

function parseCsvLine(line: string): string[] {
  return line.split(csvSplitRegex).map((cell) => cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
}

function normalizeName(name: string): string {
  return name.replace(/\s+/g, ' ').trim();
}

async function getAttendees(): Promise<string[]> {
  try {
    const response = await fetch(ATTENDEES_CSV_URL, {
      next: { revalidate: 900 },
    });
    if (!response.ok) return [];

    const csvText = await response.text();
    const rows = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseCsvLine);

    const names = rows
      .map((row) => normalizeName(row[0] ?? ''))
      .filter(Boolean)
      .filter((name) => !/^name$/i.test(name));

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
  } catch {
    return [];
  }
}

export default async function Home() {
  const attendees = await getAttendees();

  return (
    <>
      <ScrollEffects />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-lg focus:font-medium focus:text-brand focus:shadow-lg"
      >
        Skip to main content
      </a>

      <nav id="site-nav" className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 shadow-sm backdrop-blur transition-shadow duration-200" aria-label="Primary">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-3 px-4 py-3 md:flex-nowrap md:justify-between md:gap-x-8 md:px-6 md:py-4">
          <a
            href="#top"
            className="flex shrink-0 items-center py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            aria-label="Sahuaro High School Class of 1976 — home"
          >
            <span className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tighter text-slate-900 md:text-3xl">
              <Image src="/head-mascot.png" alt="" width={39} height={39} className="h-[2.3rem] w-[2.3rem] rounded-sm object-contain md:h-[2.6rem] md:w-[2.6rem]" aria-hidden="true" />
              <span className="whitespace-nowrap text-slate-900">Class of &rsquo;76</span>
            </span>
          </a>

          <ul
            className="order-last m-0 flex w-full list-none flex-wrap items-center justify-center gap-x-8 gap-y-2 px-0 text-sm font-medium text-gray-500 md:order-none md:flex-1 md:text-base"
            aria-label="Page sections"
          >
            <li>
              <a
                href="#schedule"
                className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Schedule
              </a>
            </li>
            <li>
              <a
                href="#hotels"
                className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Hotels
              </a>
            </li>
            <li>
              <a
                href="#memories"
                className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Memories
              </a>
            </li>
            <li><a href="#attending" className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2">Attending</a></li>
            <li><a href="#faq" className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2">FAQ</a></li>
          </ul>

          <a href="#register" className="btn-primary shrink-0 px-5 py-2.5 text-sm md:px-6 md:text-base">Register Now</a>
        </div>
      </nav>

      <header className="relative flex min-h-[min(90vh,56rem)] items-center justify-center overflow-hidden px-4 py-16 sm:min-h-[84vh]">
        <div className="absolute inset-0 bg-hero-aerial bg-cover bg-center" role="img" aria-label="Desert landscape hero photograph" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/55 to-slate-900/20" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(153,0,0,.25),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(217,119,6,.22),transparent_40%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
          <p className="mt-1 text-base font-semibold tracking-[0.08em] text-white sm:text-lg md:text-xl">
            October 9-10, 2026 • Tucson, Arizona
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl">
            Sahuaro High School Class of <span className="inline-flex items-baseline gap-[0.075em] whitespace-nowrap tabular-nums tracking-normal">&rsquo;76</span>
          </h1>
          <h2 className="mt-5 text-2xl font-extrabold leading-snug text-gray-100 md:mt-6 md:text-3xl">The 50th Reunion</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-200 md:text-xl">A weekend of reconnecting, celebrating, and sharing memories with classmates from the Class of &rsquo;76.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="#register" className="btn-primary px-10 py-4 text-lg md:text-xl">Register Now</a>
            <a href="#schedule" className="btn-secondary px-8 py-4 text-lg md:text-xl">View Schedule</a>
          </div>
          <div className="mt-10 grid w-full max-w-3xl overflow-hidden rounded-2xl border border-white/25 bg-white/10 text-left backdrop-blur md:grid-cols-2">
            <div className="flex min-h-[5.5rem] flex-col justify-center px-5 py-4 md:px-6">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-200">Main Event</p>
              <p className="mt-1 text-sm font-semibold text-white md:text-base">Friday ticketed dinner</p>
            </div>
            <div className="flex min-h-[5.5rem] flex-col justify-center border-t border-white/20 px-5 py-4 md:border-l md:border-t-0 md:px-6">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-200">Casual Meetup</p>
              <p className="mt-1 text-sm font-semibold text-white md:text-base">Saturday no-host gathering</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section id="schedule" className="reveal section-shell scroll-mt-24 bg-white md:scroll-mt-28" aria-labelledby="itinerary-heading" data-reveal>
          <div className="section-frame">
            <div className="text-center">
              <p className="section-kicker">Weekend Plan</p>
              <h2 id="itinerary-heading" className="section-heading">The Itinerary</h2>
              <p className="section-subheading">Two relaxed events, one memorable weekend.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
              <article className="panel flex flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-10">
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-wide text-stone-500">Friday, Oct 9</p>
                  <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-stone-900 md:text-[1.65rem] lg:text-3xl">The Big Event</h3>
                  <p className="text-lg leading-relaxed text-stone-700 md:text-xl">Ticketed dinner at the Savoy Opera House in Trail Dust Town.</p>
                </div>

                <div className="mt-5 space-y-3 md:mt-6">
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold leading-relaxed text-stone-800 md:text-lg">
                    Price is $76 and must be paid by September 22nd.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=6541+E+Tanque+Verde+Rd+%2313%2C+Tucson%2C+AZ+85715"
                    className="modern-link block w-fit text-base leading-snug md:text-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    6541 E Tanque Verde Rd #13, Tucson, AZ 85715
                  </a>
                </div>

                <div className="mt-auto pt-5 md:pt-6">
                  <div className="space-y-3 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100 p-5">
                    <p className="min-h-12 text-sm leading-relaxed text-stone-600">7:00 PM • Dinner, stories, and slideshow highlights</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=6541+E+Tanque+Verde+Rd+%2313%2C+Tucson%2C+AZ+85715" className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition-colors duration-200 hover:bg-white" target="_blank" rel="noopener noreferrer">Open directions</a>
                  </div>
                </div>
              </article>

              <article className="panel flex flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-10">
                <div className="space-y-3">
                  <p className="text-sm font-medium uppercase tracking-wide text-stone-500">Saturday, Oct 10</p>
                  <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-stone-900 md:text-[1.65rem] lg:text-3xl">Casual Meetup</h3>
                  <p className="text-lg leading-relaxed text-stone-700 md:text-xl">&ldquo;No-host&rdquo; event at Three Canyon Beer and Wine Garden.</p>
                </div>

                <div className="mt-5 space-y-3 md:mt-6">
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-semibold leading-relaxed text-emerald-900 md:text-lg">
                    Free! Drinks and food available for purchase.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=4999+N+Sabino+Canyon+Rd%2C+Tucson%2C+AZ+85750"
                    className="modern-link block w-fit text-base leading-snug md:text-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    4999 N Sabino Canyon Rd, Tucson, AZ 85750
                  </a>
                </div>

                <div className="mt-auto pt-5 md:pt-6">
                  <div className="space-y-3 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-stone-100 p-5">
                    <p className="min-h-12 text-sm leading-relaxed text-stone-600">4pm-9pm • Drop in, mingle, and catch up at your own pace</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=4999+N+Sabino+Canyon+Rd%2C+Tucson%2C+AZ+85750" className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800 transition-colors duration-200 hover:bg-white" target="_blank" rel="noopener noreferrer">Open directions</a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="hotels" className="reveal section-shell scroll-mt-24 overflow-visible bg-white md:scroll-mt-28" aria-labelledby="travel-heading" data-reveal>
          <div className="section-frame">
            <div className="text-center">
              <p className="section-kicker">Plan Your Trip</p>
              <h2 id="travel-heading" className="section-heading">Travel &amp; Accommodations</h2>
            </div>

            <HotelsSection />
          </div>
        </section>

        <section
          id="memories"
          className="reveal section-shell scroll-mt-24 bg-gradient-to-b from-rose-50/35 via-stone-50 to-stone-100 md:scroll-mt-28"
          aria-labelledby="memories-heading"
          data-reveal
        >
          <div className="section-frame">
            <div className="mx-auto max-w-3xl space-y-6 text-center md:space-y-8">
              <p className="section-kicker">Help Build the Slideshow</p>
              <h2 id="memories-heading" className="section-heading">Memories &amp; Media</h2>
              <p className="text-2xl font-extrabold leading-snug tracking-tight text-slate-900 md:text-3xl">Share your favorite photos from the &rsquo;70s to today</p>
              <p className="text-lg leading-relaxed text-stone-700 md:text-xl">
                Send vintage photos and reunion memories to Ceddena Griggs at{' '}
                <ProtectedEmailLink
                  user="ceddenagriggs"
                  domain="gmail.com"
                  subject="Sahuaro Class of 1976 Photos for Slideshow"
                  className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors duration-200 hover:text-brand"
                >
                  ceddenagriggs@gmail.com
                </ProtectedEmailLink>{' '}
                so we can include them in the event presentation.
              </p>
              <ProtectedEmailLink
                user="ceddenagriggs"
                domain="gmail.com"
                subject="Sahuaro Class of 1976 Photos for Slideshow"
                className="inline-flex rounded-full border border-stone-300 bg-white px-6 py-3 text-base font-semibold text-stone-900 transition-colors duration-200 hover:bg-stone-100"
              >
                Submit photos
              </ProtectedEmailLink>
            </div>
            <MemoriesGallery />
          </div>
        </section>

        <section id="attending" className="reveal section-shell scroll-mt-24 bg-white md:scroll-mt-28" aria-labelledby="attending-heading" data-reveal>
          <div className="section-frame">
            <div className="text-center">
              <p className="section-kicker">Classmate Roll Call</p>
              <h2 id="attending-heading" className="section-heading">Who&apos;s Attending</h2>
              <p className="section-subheading">
                {attendees.length > 0 ? `${attendees.length} classmates are currently listed.` : 'Attendee names are loading or temporarily unavailable.'}
              </p>
              {attendees.length > 0 ? (
                <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
                  Every name here is part of the story. We can&apos;t wait to celebrate together at the reunion.
                </p>
              ) : null}
            </div>

            {attendees.length > 0 ? (
              <AttendeeBadges names={attendees} />
            ) : (
              <div className="mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center text-stone-600 shadow-sm md:p-8 md:text-lg">
                We&apos;ll publish the attendee list here as soon as it&apos;s available.
              </div>
            )}
          </div>
        </section>

        <section id="faq" className="reveal section-shell scroll-mt-24 bg-white md:scroll-mt-28" aria-labelledby="faq-heading" data-reveal>
          <div className="section-frame">
            <div className="text-center">
              <p className="section-kicker">Know Before You Go</p>
              <h2 id="faq-heading" className="section-heading">Frequently Asked Questions</h2>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-4 md:grid-cols-2">
              <details className="faq-item h-fit"><summary className="cursor-pointer text-lg font-semibold text-stone-900">Can I bring a guest?</summary><p className="mt-3 text-stone-700">Yes. Include guest details in the registration form so we can plan seating and meal counts.</p></details>
              <details className="faq-item h-fit"><summary className="cursor-pointer text-lg font-semibold text-stone-900">What happens after I register?</summary><p className="mt-3 text-stone-700">You complete payment, then the reunion committee confirms your registration if any additional details are needed.</p></details>
              <details className="faq-item h-fit"><summary className="cursor-pointer text-lg font-semibold text-stone-900">Do I need tickets for both events?</summary><p className="mt-3 text-stone-700">Friday dinner is ticketed. Saturday meetup is no-host and casual drop-in.</p></details>
              <details className="faq-item h-fit">
                <summary className="cursor-pointer text-lg font-semibold text-stone-900">Which Sahuaro classes are invited?</summary>
                <p className="mt-3 text-stone-700">
                  While the 50 Year Reunion event primarily celebrates the Class of 1976, anyone is invited to attend, particularly those from the classes of 1975 &amp; 1977.
                </p>
              </details>
              <details className="faq-item h-fit">
                <summary className="cursor-pointer text-lg font-semibold text-stone-900">Who should I contact with questions?</summary>
                <p className="mt-3 text-stone-700">
                  Email{' '}
                  <ProtectedEmailLink
                    user="sahuaroclassof1976"
                    domain="gmail.com"
                    subject="Sahuaro High School Class of 1976 Reunion"
                    className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors duration-200 hover:text-brand"
                  >
                    sahuaroclassof1976@gmail.com
                  </ProtectedEmailLink>{' '}
                  or call Lee Ann at{' '}
                  <ProtectedPhoneLink className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors duration-200 hover:text-brand" />
                  .
                </p>
              </details>
            </div>
          </div>
        </section>

        <section
          id="register"
          className="reveal relative section-shell scroll-mt-24 bg-gradient-to-b from-rose-50/45 via-stone-50 to-stone-100 md:scroll-mt-28"
          aria-labelledby="registration-heading"
          data-reveal
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-200/55 to-transparent" aria-hidden="true" />
          <div className="section-frame relative">
            <div className="text-center">
              <p className="section-kicker">Simple Signup</p>
              <h2 id="registration-heading" className="section-heading">Registration &amp; Payment</h2>
              <p className="section-subheading">Complete the form below, then choose the payment option that works best for you.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <article className="panel p-6 text-left md:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">How It Works</p>
                <ol className="mt-4 space-y-4 text-stone-700">
                  <li><p className="font-semibold text-stone-900">1. Fill out registration form</p><p className="mt-1 text-sm">Share attendee names and key details.</p></li>
                  <li><p className="font-semibold text-stone-900">2. Send payment</p><p className="mt-1 text-sm">Use Zelle, Venmo, or mail a check.</p></li>
                  <li><p className="font-semibold text-stone-900">3. Get confirmation</p><p className="mt-1 text-sm">Committee follows up if anything is needed.</p></li>
                </ol>
              </article>
              <div className="panel md:col-span-2">
                <div className="relative h-[42rem] w-full overflow-y-auto rounded-2xl">
                  <iframe title="Sahuaro High School Class of 1976 reunion registration form" src="https://docs.google.com/forms/d/e/1FAIpQLSddoWM9pf6YTtNv0rhwUqBMQKLck0ZzTj9rVCmnfXyTWcNnVQ/viewform?embedded=true" className="absolute left-0 top-0 h-full min-h-[640px] w-full border-0" loading="lazy" />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-amber-50 to-stone-50 p-5 shadow-sm md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Payment Quick Guide</p>
              <p className="mt-2 text-base leading-relaxed text-stone-800 md:text-lg">
                Friday dinner is <span className="font-semibold text-stone-900">$76 per person</span> (due by{' '}
                <span className="font-semibold text-stone-900">September 22nd</span>). Saturday gathering is{' '}
                <span className="font-semibold text-emerald-800">free</span>, with drinks and food available for purchase.
              </p>
              <p className="mt-2 text-sm text-stone-700 md:text-base">
                Include your name and <span className="font-semibold text-stone-900">"Class of '76 reunion"</span> in the memo so we can match your payment quickly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 lg:gap-8">
              <article className="h-full rounded-2xl border border-stone-200 bg-slate-50 p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8">
                <h4 className="text-xl font-bold text-stone-900 md:text-2xl">Zelle</h4>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">Digital payment</p>
                <p className="mt-5 text-lg leading-relaxed text-stone-700 md:text-xl">
                  Send payment to Lee Ann at{' '}
                  <ProtectedPhoneLink className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors duration-200 hover:text-brand" />
                  .
                </p>
                <div className="mt-5">
                  <img src="/zelle.png" alt="Zelle payment QR code" className="mx-auto w-full max-w-[13.5rem] rounded-xl border border-stone-200 object-cover shadow-sm" />
                </div>
              </article>

              <article className="h-full rounded-2xl border border-gray-200 bg-slate-50 p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8">
                <h4 className="text-xl font-bold text-stone-900 md:text-2xl">Venmo</h4>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">Digital payment</p>
                <div className="mt-5">
                  <img src="/venmo.png" alt="Venmo payment QR code" className="mx-auto w-full max-w-[13.5rem] rounded-xl border border-stone-200 object-cover shadow-sm" />
                  <p className="mt-3 text-center text-sm text-stone-600">Open Venmo and scan this code.</p>
                </div>
              </article>

              <article className="h-full rounded-2xl border border-stone-200 bg-stone-50/70 p-7 shadow-sm transition-all duration-300 hover:shadow-md md:p-8">
                <h4 className="text-xl font-bold text-stone-900 md:text-2xl">Mail a check</h4>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">Backup option</p>
                <p className="mt-5 text-lg leading-relaxed text-stone-700 md:text-xl">
                  Send checks to Scott Sanders,
                  <br />
                  <span className="font-medium text-stone-500">23173 Pineywood Circle, California, MD 20619</span>.
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=23173+Pineywood+Circle,+California,+MD+20619"
                  className="mt-6 inline-flex rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors duration-200 hover:bg-stone-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View mailing address
                </a>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#3a1515] bg-[#221010] py-14 text-stone-200 md:py-16" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-white md:text-xl">Reunion Committee</p>
            <nav className="mt-5 flex flex-col gap-4 text-lg md:text-xl" aria-label="Committee contact">
              <ProtectedEmailLink
                user="sahuaroclassof1976"
                domain="gmail.com"
                subject="Sahuaro High School Class of 1976 Reunion"
                className="font-medium text-stone-300 underline decoration-brand/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-white"
              >
                Email the committee
              </ProtectedEmailLink>
              <a
                href="#register"
                className="font-medium text-stone-300 underline decoration-brand/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-white"
              >
                Registration form
              </a>
            </nav>
          </div>

          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-full border border-stone-500/70 bg-[#2d1717] px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors duration-200 hover:bg-[#3a1d1d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-xl"
            aria-label="Back to top"
          >
            <span aria-hidden="true" className="text-xl">
              ↑
            </span>
            Back to top
          </a>
        </div>
        <p className="mt-12 px-4 text-center text-sm leading-relaxed text-stone-400 sm:text-base md:text-lg">
          © 2026 Sahuaro High School Class of 1976. All rights reserved.
        </p>
      </footer>

    </>
  );
}

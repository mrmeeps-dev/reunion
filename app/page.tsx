import { ScrollEffects } from '@/components/scroll-effects';
import { ProtectedEmailLink } from '@/components/protected-email-link';
import { AttendeesSection } from '@/components/attendees-section';
import Image from 'next/image';

export default function Home() {
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
                href="#memories"
                className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Memories
              </a>
            </li>
            <li>
              <a
                href="#attending"
                className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Who Attended
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="rounded-sm transition-colors duration-200 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                Contact
              </a>
            </li>
          </ul>

          <a
            href="https://boothpics.com/MA7P/m247xh"
            className="btn-primary shrink-0 px-5 py-2.5 text-sm md:px-6 md:text-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            Event photos
          </a>
        </div>
      </nav>

      <header
        id="top"
        className="relative flex min-h-[min(90vh,56rem)] items-center justify-center overflow-hidden px-4 py-16 sm:min-h-[84vh]"
      >
        <div className="absolute inset-0 bg-hero-aerial bg-cover bg-center" role="img" aria-label="Desert landscape hero photograph" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/55 to-slate-900/20" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(153,0,0,.25),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(217,119,6,.22),transparent_40%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
          <p className="mt-1 text-base font-semibold tracking-[0.08em] text-white sm:text-lg md:text-xl">
            October 9-10, 2026 • Tucson, Arizona
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.08] tracking-tight text-white md:text-6xl">
            Sahuaro High School Class of{' '}
            <span className="inline-flex items-baseline gap-[0.075em] whitespace-nowrap tabular-nums tracking-normal">&rsquo;76</span>
          </h1>
          <h2 className="mt-5 text-2xl font-extrabold leading-snug text-gray-100 md:mt-6 md:text-3xl">Thank you for a wonderful reunion</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-200 md:text-xl">
            What a joy to reconnect after 50 years. Browse the photobooth album, or watch the reunion slideshow below.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://boothpics.com/MA7P/m247xh"
              className="btn-primary px-10 py-4 text-lg md:text-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Event photos
            </a>
            <a href="#memories" className="btn-secondary px-8 py-4 text-lg md:text-xl">
              Reunion slideshow
            </a>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section
          id="memories"
          className="reveal section-shell scroll-mt-24 bg-gradient-to-b from-rose-50/35 via-stone-50 to-stone-100 md:scroll-mt-28"
          aria-labelledby="memories-heading"
          data-reveal
        >
          <div className="section-frame">
            <div className="mx-auto max-w-3xl text-center">
              <p className="section-kicker">Then &amp; Now</p>
              <h2 id="memories-heading" className="section-heading">
                Memories &amp; Media
              </h2>
              <p className="section-subheading">A look back at the Class of &rsquo;76, from Sahuaro to today.</p>
            </div>
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-stone-200 bg-black shadow-lg md:mt-12">
              <div className="relative aspect-video w-full">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/UqP9lfF4aLE"
                  title="Sahuaro High School Class of 1976 memories video"
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="attending" className="reveal section-shell scroll-mt-24 bg-white md:scroll-mt-28" aria-labelledby="attending-heading" data-reveal>
          <div className="section-frame">
            <AttendeesSection />
          </div>
        </section>

        <section
          id="contact"
          className="reveal section-shell scroll-mt-24 bg-gradient-to-b from-rose-50/35 via-stone-50 to-stone-100 md:scroll-mt-28"
          aria-labelledby="contact-heading"
          data-reveal
        >
          <div className="section-frame">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-kicker">Stay in Touch</p>
              <h2 id="contact-heading" className="section-heading">
                Contact
              </h2>
              <p className="section-subheading">Questions about the reunion or the photos? Email the committee anytime.</p>
              <p className="mt-8 text-lg text-stone-700 md:text-xl">
                <ProtectedEmailLink
                  user="sahuaroclassof1976"
                  domain="gmail.com"
                  subject="Sahuaro High School Class of 1976 Reunion"
                  className="font-semibold text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors duration-200 hover:text-brand"
                >
                  sahuaroclassof1976@gmail.com
                </ProtectedEmailLink>
              </p>
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
      </footer>
    </>
  );
}

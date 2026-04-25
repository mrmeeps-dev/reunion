'use client';

import { useEffect } from 'react';

export function ScrollEffects() {
  useEffect(() => {
    const nav = document.getElementById('site-nav');
    const registerSection = document.getElementById('register');
    const mobileRegisterCta = document.getElementById('mobile-register-cta');
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 12) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return () => window.removeEventListener('scroll', onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );

    elements.forEach((element) => observer.observe(element));

    let ctaObserver: IntersectionObserver | null = null;
    if (registerSection && mobileRegisterCta) {
      ctaObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          if (entry.isIntersecting) {
            mobileRegisterCta.classList.add('pointer-events-none', 'translate-y-3', 'opacity-0');
          } else {
            mobileRegisterCta.classList.remove('pointer-events-none', 'translate-y-3', 'opacity-0');
          }
        },
        { rootMargin: '-72px 0px 0px 0px', threshold: 0.05 },
      );
      ctaObserver.observe(registerSection);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      ctaObserver?.disconnect();
    };
  }, []);

  return null;
}

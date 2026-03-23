/* ============================================================
   NATO'S CAFÉ — main.js
   Skiper UI techniques: Custom Cursor · Card Stack · Horizontal Menu
   Scroll · Magnetic Buttons · Clip-path Reveals · Word Scrub
   Libraries: GSAP 3.12 + ScrollTrigger · Lenis 1.0
============================================================ */

(function () {
  'use strict';

  /* ============================================================
     UTILITY
  ============================================================ */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isMobile = () => window.innerWidth <= 768;
  const isTouch  = () => window.matchMedia('(hover: none)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. GSAP + LENIS INITIALIZATION
  ============================================================ */
  gsap.registerPlugin(ScrollTrigger);

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration:       1.4,
    easing:         t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel:    true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.5,
    infinite:        false,
  });

  // Connect Lenis → GSAP ticker
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ScrollTrigger updates on Lenis scroll
  lenis.on('scroll', ScrollTrigger.update);

  /* ============================================================
     2. CUSTOM CURSOR
  ============================================================ */
  function initCursor() {
    if (isTouch()) return;

    const dot  = qs('.cursor-dot');
    const ring = qs('.cursor-ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot,  { x: mouseX, y: mouseY });
      gsap.to(ring,  { x: mouseX, y: mouseY, duration: 0.18, ease: 'power2.out' });
    });

    // Scale dot on click
    document.addEventListener('mousedown', () => {
      gsap.to(dot, { scale: 2.5, duration: 0.15, ease: 'power2.out' });
    });
    document.addEventListener('mouseup', () => {
      gsap.to(dot, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' });
    });

    // Hover effect on interactive elements
    const hoverEls = qsa('a, button, [data-tilt], .menu-card, .stack-card, .gallery__img-wrap');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hovered'));
    });
  }

  /* ============================================================
     3. PRELOADER
  ============================================================ */
  function initPreloader(onComplete) {
    if (prefersReducedMotion) {
      qs('#preloader').style.display = 'none';
      document.body.classList.remove('no-scroll', 'is-loading');
      onComplete();
      return;
    }

    const preloader = qs('#preloader');
    const letterN   = qs('.preloader__logo-n');
    const letterC   = qs('.preloader__logo-c');
    const dot       = qs('.preloader__logo-dot');
    const tagline   = qs('.preloader__tagline');
    const bar       = qs('#preloader-bar');
    const counter   = qs('#preloader-counter');
    const mask      = qs('#preloader-mask');

    const tl = gsap.timeline();

    // Letters in
    tl
      .to(letterN, {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.8, ease: 'expo.out',
      }, 0)
      .to(letterC, {
        opacity: 1, y: 0, skewY: 0,
        duration: 0.8, ease: 'expo.out',
      }, 0.15)
      .to(dot, {
        opacity: 1, scale: 1,
        duration: 0.5, ease: 'back.out(2)',
      }, 0.3)
      .to(tagline, {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'expo.out',
      }, 0.4)

      // Progress bar fills
      .to(bar, {
        width: '100%',
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: function () {
          const pct = Math.round(this.progress() * 100);
          counter.textContent = pct + '%';
        },
      }, 0.5)

      // Hold briefly
      .to({}, { duration: 0.3 })

      // Mask slides up — revealing the page
      .to(mask, {
        yPercent: -100,
        duration: 1.0,
        ease: 'expo.inOut',
      })

      // Fade out entire preloader
      .to(preloader, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.classList.remove('no-scroll', 'is-loading');
          onComplete();
        },
      }, '-=0.2');
  }

  /* ============================================================
     4. NAVIGATION
  ============================================================ */
  function initNav() {
    const nav       = qs('#nav');
    const logo      = qs('.nav__logo');
    const links     = qs('.nav__links');
    const hamburger = qs('#hamburger');
    const mobileMenu = qs('#mobile-menu');
    const mobileLinks = qsa('.mobile-menu__link');
    let menuOpen = false;

    // Entrance animation (called after preloader)
    gsap.to([logo, links, hamburger], {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'expo.out',
    });

    // Background on scroll
    ScrollTrigger.create({
      start: `${window.innerHeight * 0.1} top`,
      onToggle: ({ isActive }) => nav.classList.toggle('is-scrolled', isActive),
    });

    // Smooth scroll on nav links
    qsa('[data-scroll-to]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = qs(`#${link.dataset.scrollTo}`);
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
          if (menuOpen) closeMenu();
        }
      });
    });

    // Hamburger
    function openMenu() {
      menuOpen = true;
      hamburger.classList.add('is-open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.removeAttribute('aria-hidden');
      mobileMenu.classList.add('is-open');
      lenis.stop();
      gsap.fromTo(mobileLinks,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: 'expo.out', delay: 0.1 }
      );
    }

    function closeMenu() {
      menuOpen = false;
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.classList.remove('is-open');
      lenis.start();
      gsap.to(mobileLinks, { y: 20, opacity: 0, stagger: 0.04, duration: 0.3, ease: 'expo.in' });
    }

    hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

    // Close menu on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    });
  }

  /* ============================================================
     5. HERO ANIMATIONS
  ============================================================ */
  function initHero() {
    const lines   = qsa('.hero__line');
    const eyebrow = qs('.hero__eyebrow');
    const cta     = qs('.hero__cta');
    const indicator = qs('.hero__scroll-indicator');
    const heroBg  = qs('.hero__bg');

    const tl = gsap.timeline({ delay: 0.1 });

    tl
      .to(eyebrow, {
        opacity: 1, y: 0,
        duration: 0.8, ease: 'expo.out',
      })
      .to(lines, {
        y: '0%',
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
      }, '-=0.5')
      .to(cta, {
        opacity: 1, y: 0,
        duration: 0.8, ease: 'expo.out',
      }, '-=0.6')
      .to(indicator, {
        opacity: 1,
        duration: 0.6, ease: 'expo.out',
      }, '-=0.4');

    // Parallax on hero background
    gsap.to(heroBg, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section--hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ============================================================
     6. CARD STACK — Skiper UI signature
  ============================================================ */
  function initCardStack() {
    const cards = qsa('.stack-card');
    if (!cards.length) return;

    // On mobile: simple fade-in, no sticky scroll behavior
    if (isMobile()) {
      cards.forEach(card => {
        const lines = qsa('.stack-card__line', card);
        const body  = qs('.stack-card__body', card);
        gsap.fromTo([lines, body],
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'expo.out',
            scrollTrigger: { trigger: card, start: 'top 80%', once: true },
          }
        );
      });
      return;
    }

    // Desktop: sticky card stack
    // Each card is already position:sticky via CSS.
    // When the *next* card enters view, the *current* card scales down.
    cards.forEach((card, i) => {
      const lines = qsa('.stack-card__line', card);
      const body  = qs('.stack-card__body', card);

      // Animate content IN as card enters viewport
      gsap.fromTo(lines,
        { y: '110%' },
        {
          y: '0%',
          duration: 1.0, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            once: true,
          },
        }
      );
      gsap.fromTo(body,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.8, ease: 'expo.out', delay: 0.3,
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Scale back as next card enters — Skiper UI technique
      if (i < cards.length - 1) {
        gsap.to(card, {
          scale: 0.9,
          filter: 'brightness(0.55) blur(2px)',
          ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        });
      }

      // Subtle parallax on each card's background image
      const bg = qs('.stack-card__bg', card);
      gsap.to(bg, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /* ============================================================
     7. MENU — Horizontal Scroll (Skiper UI)
  ============================================================ */
  function initMenuHorizontal() {
    const section = qs('#menu');
    const track   = qs('#menu-track');
    if (!track || isMobile()) return;

    // Wait for fonts/images so scrollWidth is correct
    const scrollAmount = () => -(track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(track).paddingRight) * 2);

    gsap.to(track, {
      x: scrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Animate menu header in
    const label   = qs('.menu__header .section-label');
    const heading = qs('.menu__header .section-heading');
    if (label) animateClipFade(label);
    if (heading) animateHeadingWipe(heading);

    // 3D card tilt on menu cards
    qsa('[data-tilt]').forEach(initTilt);
  }

  /* ============================================================
     8. GALLERY — Parallax + Clip Reveals
  ============================================================ */
  function initGallery() {
    // Heading reveal
    const heading = qs('.gallery__heading');
    if (heading) animateHeadingWipe(heading);

    // Parallax columns
    qsa('.gallery__col[data-parallax]').forEach(col => {
      const speed = parseFloat(col.dataset.parallax);
      gsap.to(col, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery__grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Clip-path reveal per image
    qsa('.gallery__img-wrap').forEach((wrap, i) => {
      gsap.to(wrap, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 88%',
          once: true,
        },
      });
    });
  }

  /* ============================================================
     9. ABOUT — Word Scrub + Counters
  ============================================================ */
  function initAbout() {
    // --- Word opacity scrub ---
    const paragraph = qs('#about-scrub-text');
    if (paragraph) {
      const words = paragraph.textContent.trim().split(/\s+/);
      paragraph.innerHTML = words
        .map(w => `<span class="word">${w}</span>`)
        .join(' ');

      gsap.to(paragraph.querySelectorAll('.word'), {
        opacity: 1,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger: paragraph,
          start: 'top 75%',
          end: 'bottom 35%',
          scrub: 0.6,
        },
      });
    }

    // --- Image slide-in ---
    const imgCol = qs('.about__img-col');
    if (imgCol) {
      gsap.fromTo(imgCol,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: imgCol, start: 'top 80%', once: true },
        }
      );
    }

    // --- Text col fade-up ---
    const textCol = qs('.about__text-col');
    if (textCol) {
      gsap.fromTo(textCol,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: textCol, start: 'top 80%', once: true },
        }
      );
    }

    // --- Animated counters ---
    qsa('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo({ val: 0 }, { val: target },
            {
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].val);
              },
            }
          );
        },
      });
    });

    qsa('[data-count-decimal]').forEach(el => {
      const target = parseFloat(el.dataset.countDecimal);
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo({ val: 0 }, { val: target },
            {
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = this.targets()[0].val.toFixed(1);
              },
            }
          );
        },
      });
    });
  }

  /* ============================================================
     10. CONTACT — Stagger Entry
  ============================================================ */
  function initContact() {
    const heading  = qs('.contact__heading');
    const details  = qsa('.contact__detail');
    const mapCol   = qs('.contact__map-col');

    if (heading) animateHeadingWipe(heading);

    if (details.length) {
      gsap.to(details, {
        y: 0, opacity: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.contact__details',
          start: 'top 80%',
          once: true,
        },
      });
    }

    if (mapCol) {
      gsap.to(mapCol, {
        opacity: 1, y: 0,
        duration: 1.0, ease: 'expo.out',
        scrollTrigger: {
          trigger: mapCol,
          start: 'top 80%',
          once: true,
        },
      });
    }
  }

  /* ============================================================
     11. MAGNETIC BUTTONS — Skiper UI
  ============================================================ */
  function initMagneticButtons() {
    if (isTouch()) return;

    qsa('.btn-magnetic').forEach(el => {
      const inner = el.querySelector('span');

      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.38;
        const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.38;

        gsap.to(el, {
          x: dx, y: dy,
          duration: 0.4, ease: 'power2.out',
        });
        if (inner) {
          gsap.to(inner, {
            x: dx * 0.55, y: dy * 0.55,
            duration: 0.4, ease: 'power2.out',
          });
        }
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0, y: 0,
          duration: 0.7, ease: 'elastic.out(1, 0.5)',
        });
        if (inner) {
          gsap.to(inner, {
            x: 0, y: 0,
            duration: 0.7, ease: 'elastic.out(1, 0.5)',
          });
        }
      });
    });
  }

  /* ============================================================
     SHARED ANIMATION HELPERS
  ============================================================ */

  // Clip-path wipe left → right
  function animateHeadingWipe(el) {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  // Fade + clip upward
  function animateClipFade(el) {
    gsap.fromTo(el,
      { opacity: 0, y: 15 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }
    );
  }

  // 3D card tilt
  function initTilt(card) {
    if (isTouch()) return;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      gsap.to(card, {
        rotateY:  x * 12,
        rotateX: -y * 12,
        transformPerspective: 900,
        duration: 0.4, ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        duration: 0.8, ease: 'expo.out',
      });
    });
  }

  /* ============================================================
     BOOT — run preloader, then everything else
  ============================================================ */
  function boot() {
    // Cursor starts immediately
    initCursor();

    // Preloader → then all section init
    initPreloader(() => {
      // Nav entrance
      initNav();

      // Hero reveal
      initHero();

      // Section animations
      initCardStack();
      initMenuHorizontal();
      initGallery();
      initAbout();
      initContact();
      initMagneticButtons();

      // Refresh ScrollTrigger after everything is initialized
      ScrollTrigger.refresh();

      // Handle window resize
      window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
      });
    });
  }

  /* ============================================================
     START
  ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();

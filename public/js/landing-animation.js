/* LANDING PAGE ANIMATIONS*/

document.addEventListener("DOMContentLoaded", () => {
  function observeGroup(elements, animationClass, delay = 180) {
    if (!elements.length) return;

    elements.forEach((element, index) => {
      element.classList.add(animationClass);

      element.style.transitionDelay = `${index * delay}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  /*   HERO */

  const heroLabel = document.querySelector(".hero-label");

  const heroTitle = document.querySelector(".hero-content h1");

  const heroDescription = document.querySelector(".hero-description");

  observeGroup(
    [heroLabel, heroTitle, heroDescription].filter(Boolean),
    "reveal-up",
    180,
  );

  /*   EXPLORE */

  observeGroup(
    [
      document.querySelector(".explore-heading .section-label"),

      document.querySelector(".explore-heading h2"),

      document.querySelector(".explore-heading > p"),
    ].filter(Boolean),
    "reveal-up",
    160,
  );

  observeGroup(
    [...document.querySelectorAll(".explore-memory-card")],
    "reveal-up",
    180,
  );

  /*   ABOUT TEXT */

  observeGroup(
    [
      document.querySelector(".about-content .section-label"),

      document.querySelector(".about-content h2"),

      document.querySelector(".about-description"),
    ].filter(Boolean),
    "reveal-right",
    180,
  );

  /*   HOW IT WORKS */

  observeGroup(
    [
      document.querySelector(".about-how-heading .section-label"),

      document.querySelector(".about-how-heading h2"),
    ].filter(Boolean),
    "reveal-up",
    180,
  );

  observeGroup([...document.querySelectorAll(".about-step")], "reveal-up", 220);

  /*   CTA CONTENT */

  observeGroup(
    [
      document.querySelector(".cta-content .section-label"),

      document.querySelector(".cta-content h2"),

      document.querySelector(".cta-description"),

      document.querySelector(".cta-content .hero-btn"),
    ].filter(Boolean),
    "reveal-up",
    180,
  );

  /* CTA PHOTO ANIMATION*/

  const ctaSection = document.querySelector(".landing-cta");

  const ctaPhotos = [
    document.querySelector(".cta-memory-2"),
    document.querySelector(".cta-memory-3"),
    document.querySelector(".cta-memory-1"),
  ].filter(Boolean);

  ctaPhotos.forEach((photo) => {
    photo.classList.add("reveal-cta");
  });

  if (ctaSection && ctaPhotos.length) {
    const ctaPhotoObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        ctaPhotos.forEach((photo, index) => {
          setTimeout(() => {
            photo.classList.add("is-visible");
          }, index * 300);
        });

        ctaPhotoObserver.disconnect();
      },
      {
        threshold: 0.2,
      },
    );

    ctaPhotoObserver.observe(ctaSection);
  }

  /*   CTA TRAVEL PATH */

  const ctaPaths = [
    ...document.querySelectorAll(".cta-path path, .cta-path-mobile path"),
  ];

  ctaPaths.forEach((path) => {
    const length = path.getTotalLength();

    path.style.strokeDasharray = `${length}`;

    path.style.strokeDashoffset = `${length}`;

    path.style.transition = "stroke-dashoffset 1.8s ease";
  });

  if (ctaPaths.length) {
    const ctaSection = document.querySelector(".landing-cta");

    const ctaPathObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          return;
        }

        ctaPaths.forEach((path) => {
          path.style.strokeDashoffset = "0";
        });

        ctaPathObserver.disconnect();
      },
      {
        threshold: 0.2,
      },
    );

    if (ctaSection) {
      ctaPathObserver.observe(ctaSection);
    }
  }

  /*   FOOTER */

  observeGroup(
    [
      document.querySelector(".footer-brand"),

      ...document.querySelectorAll(".footer-link-group"),
    ].filter(Boolean),
    "reveal-up",
    140,
  );
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/auth/status")
    .then((response) => response.json())
    .then((data) => {
      const guestActions = document.querySelector(".landing-guest-actions");
      const userActions = document.querySelector(".landing-user-actions");

      if (data.authenticated) {
        guestActions.style.display = "none";
        userActions.style.display = "flex";

        let name = data.name.toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);

        document.querySelector(".landing-profile-name").textContent = name;
        document.querySelector(".landing-profile-avatar").textContent = name[0];
      } else {
        guestActions.style.display = "flex";
        userActions.style.display = "none";
      }
    });

  const logout = document.getElementById("landing-logout");

  logout.addEventListener("click", async (event) => {
    event.preventDefault();

    const response = await fetch("/logout", {
      method: "POST",
    });

    const a = await response.json();

    if (a.success) {
      alert("Logout Successful");
      window.location.href = "/";
    }
  });

  /* MOBILE NAVBAR */

  const menuToggle = document.querySelector(".landing-menu-toggle");

  const navLinks = document.querySelector(".landing-nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("menu-open");

      menuToggle.setAttribute("aria-expanded", isOpen);

      menuToggle.innerHTML = isOpen
        ? '<i class="bi bi-x-lg"></i>'
        : '<i class="bi bi-list"></i>';
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = '<i class="bi bi-list"></i>';
      });
    });
  }
  /* LOGGED-IN PROFILE MENU */

  const profileButton = document.querySelector(".landing-profile-btn");

  const profileContainer = document.querySelector(".landing-profile");

  if (profileButton && profileContainer) {
    profileButton.addEventListener("click", (event) => {
      event.stopPropagation();

      profileContainer.classList.toggle("is-open");
    });

    document.addEventListener("click", (event) => {
      if (!profileContainer.contains(event.target)) {
        profileContainer.classList.remove("is-open");
      }
    });

    /* Close with Escape */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        profileContainer.classList.remove("is-open");
      }
    });
  }
  /* ABOUT MAP */

  const aboutMap = document.getElementById("aboutMap");

  const aboutMapLines = document.getElementById("aboutMapLines");

  const aboutCards = [
    document.querySelector(".about-map-card-1"),
    document.querySelector(".about-map-card-2"),
    document.querySelector(".about-map-card-3"),
    document.querySelector(".about-map-card-4"),
  ].filter(Boolean);

  const SVG_NS = "http://www.w3.org/2000/svg";

  function getBox(element) {
    return {
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.offsetWidth,
      height: element.offsetHeight,

      right: element.offsetLeft + element.offsetWidth,

      bottom: element.offsetTop + element.offsetHeight,

      centerX: element.offsetLeft + element.offsetWidth / 2,

      centerY: element.offsetTop + element.offsetHeight / 2,
    };
  }

  function addPath(className, d) {
    const path = document.createElementNS(SVG_NS, "path");

    path.setAttribute("class", className);

    path.setAttribute("d", d);

    aboutMapLines.appendChild(path);
  }

  function connect(start, startDirection, end, endDirection) {
    const distance = Math.hypot(end.x - start.x, end.y - start.y);

    const curve = Math.min(110, distance * 0.45);

    const control1 = {
      x: start.x + startDirection.x * curve,

      y: start.y + startDirection.y * curve,
    };

    const control2 = {
      x: end.x - endDirection.x * curve,

      y: end.y - endDirection.y * curve,
    };

    addPath(
      "map-link",
      `
        M ${start.x} ${start.y}
        C
        ${control1.x} ${control1.y},
        ${control2.x} ${control2.y},
        ${end.x} ${end.y}
      `,
    );
  }

  function drawAboutMap() {
    if (!aboutMap || !aboutMapLines) {
      return;
    }

    if (!aboutCards.length) {
      return;
    }

    aboutMapLines.innerHTML = "";

    /* Arrow marker */

    const defs = document.createElementNS(SVG_NS, "defs");

    const marker = document.createElementNS(SVG_NS, "marker");

    marker.setAttribute("id", "aboutArrow");

    marker.setAttribute("viewBox", "0 0 10 10");

    marker.setAttribute("refX", "8");

    marker.setAttribute("refY", "5");

    marker.setAttribute("markerWidth", "6");

    marker.setAttribute("markerHeight", "6");

    marker.setAttribute("orient", "auto");

    marker.setAttribute("markerUnits", "strokeWidth");

    const arrow = document.createElementNS(SVG_NS, "path");

    arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10");

    arrow.setAttribute("fill", "none");

    arrow.setAttribute("stroke", "#5f8972");

    arrow.setAttribute("stroke-width", "1.8");

    arrow.setAttribute("stroke-linecap", "round");

    arrow.setAttribute("stroke-linejoin", "round");

    marker.appendChild(arrow);
    defs.appendChild(marker);
    aboutMapLines.appendChild(defs);

    const cards = aboutCards.map(getBox);

    /* Card 1 → Card 2 */

    if (cards[0] && cards[1]) {
      connect(
        {
          x: cards[0].centerX,
          y: cards[0].bottom + 6,
        },

        {
          x: 0,
          y: 1,
        },

        {
          x: cards[1].centerX,
          y: cards[1].top - 10,
        },

        {
          x: 0,
          y: 1,
        },
      );
    }

    /* Card 2 → Card 3 */

    if (cards[1] && cards[2]) {
      connect(
        {
          x: cards[1].centerX,
          y: cards[1].bottom + 6,
        },

        {
          x: 0,
          y: 1,
        },

        {
          x: cards[2].left - 10,
          y: cards[2].centerY,
        },

        {
          x: 1,
          y: 0,
        },
      );
    }

    /* Card 3 → Card 4 */

    if (cards[2] && cards[3]) {
      connect(
        {
          x: cards[2].right + 8,
          y: cards[2].centerY,
        },

        {
          x: 1,
          y: 0,
        },

        {
          x: cards[3].left - 10,
          y: cards[3].centerY,
        },

        {
          x: 1,
          y: 0,
        },
      );
    }

    /* Add arrowheads */

    const links = aboutMapLines.querySelectorAll(".map-link");

    links.forEach((link) => {
      link.setAttribute("marker-end", "url(#aboutArrow)");
    });

    aboutMapLines.setAttribute(
      "viewBox",
      `0 0 ${aboutMap.offsetWidth} ${aboutMap.offsetHeight}`,
    );
  }

  /* About map animation */

  if (aboutCards.length) {
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          return;
        }

        aboutCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("is-visible");

            drawAboutMap();
          }, index * 250);
        });

        aboutObserver.disconnect();
      },
      {
        threshold: 0.25,
      },
    );

    const aboutSection = document.querySelector(".landing-about");

    if (aboutSection) {
      aboutObserver.observe(aboutSection);
    }
  }

  window.addEventListener("resize", drawAboutMap);

  window.addEventListener("load", drawAboutMap);

  drawAboutMap();

  /*HERO MEMORY CAROUSEL*/

  const carousel = document.querySelector(".hero-memories");
  const track = document.querySelector(".hero-memories-track");

  if (carousel && track) {
    /* Only the five actual memories */
    const cards = [
      ...track.querySelectorAll(".memory-card:not(.memory-add-card)"),
    ];

    /* Final Add Your Memory card */
    const addMemoryCard = track.querySelector(".memory-add-card");

    let activeIndex = cards.findIndex((card) =>
      card.classList.contains("active"),
    );

    if (activeIndex === -1) {
      activeIndex = 0;
    }

    /*   CREATE ARROW */

    function createArrow(type) {
      const button = document.createElement("button");

      button.type = "button";

      button.className = type === "previous" ? "memory-prev" : "memory-next";

      button.setAttribute(
        "aria-label",
        type === "previous" ? "Show previous memory" : "Show next memory",
      );

      const icon = document.createElement("i");

      icon.className =
        type === "previous" ? "bi bi-chevron-left" : "bi bi-chevron-right";

      button.appendChild(icon);

      return button;
    }

    /*   REMOVE OLD ARROWS  */

    function clearArrows() {
      track.querySelectorAll(".memory-prev, .memory-next").forEach((button) => {
        button.remove();
      });
    }

    /*   UPDATE ARROWS  */

    function updateArrows() {
      clearArrows();

      /* Previous memory */

      if (activeIndex > 0) {
        cards[activeIndex - 1].appendChild(createArrow("previous"));
      }

      /*
      Next memory exists only while
      we are before Memory 5.
    */

      if (activeIndex < cards.length - 1) {
        cards[activeIndex + 1].appendChild(createArrow("next"));
      }

      attachArrowEvents();
    }

    /*   CENTER ACTIVE MEMORY  */

    function centerActiveCard(animate = true) {
      const activeCard = cards[activeIndex];

      if (!activeCard) return;

      let offset;

      if (activeIndex > 0) {
        const previousCard = cards[activeIndex - 1];

        offset = -previousCard.offsetLeft;
      } else {
        const viewportCenter = carousel.clientWidth / 2;

        const activeCenter = activeCard.offsetLeft + activeCard.offsetWidth / 2;

        offset = viewportCenter - activeCenter;
      }

      if (!animate) {
        track.style.transition = "none";
      }

      track.style.transform = `translate3d(${offset}px, 0, 0)`;

      if (!animate) {
        requestAnimationFrame(() => {
          track.style.transition =
            "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
        });
      }
    }

    /*   GO TO MEMORY  */

    function goToMemory(newIndex) {
      if (
        newIndex < 0 ||
        newIndex >= cards.length ||
        newIndex === activeIndex
      ) {
        return;
      }

      cards[activeIndex].classList.remove("active");

      activeIndex = newIndex;

      cards[activeIndex].classList.add("active");

      /*
      When Memory 5 becomes active,
      the Add Your Memory card
      naturally occupies the right slot.
    */

      updateArrows();

      requestAnimationFrame(() => {
        centerActiveCard(true);
      });
    }

    /*   ARROW EVENTS  */

    function attachArrowEvents() {
      const previousButton = track.querySelector(".memory-prev");

      const nextButton = track.querySelector(".memory-next");

      if (previousButton) {
        previousButton.addEventListener("click", () => {
          goToMemory(activeIndex - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", () => {
          goToMemory(activeIndex + 1);
        });
      }
    }

    /*   ADD MEMORY CARD  */

    if (addMemoryCard) {
      addMemoryCard.addEventListener("click", () => {
        window.location.href = "/journal";
      });
    }

    /*   INITIALIZE  */

    updateArrows();

    requestAnimationFrame(() => {
      centerActiveCard(false);
    });

    /*   RESIZE  */

    window.addEventListener("resize", () => {
      centerActiveCard(false);
    });
  }

  /*EXPLORE MEMORY LIKES */

  const likeButtons = document.querySelectorAll(".memory-like-btn");

  likeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const countElement = button.querySelector(".memory-like-count");

      const icon = button.querySelector("i");

      let count = Number(countElement.textContent);

      const isLiked = button.classList.contains("liked");

      if (isLiked) {
        count -= 1;

        button.classList.remove("liked");

        icon.className = "bi bi-heart";

        button.setAttribute("aria-label", "Like this memory");
      } else {
        count += 1;

        button.classList.add("liked");

        icon.className = "bi bi-heart-fill";

        button.setAttribute("aria-label", "Unlike this memory");
      }

      countElement.textContent = count;
    });
  });
});

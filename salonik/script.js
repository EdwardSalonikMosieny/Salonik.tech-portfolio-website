const menuToggle = document.querySelector(".menu-toggle");
const navActions = document.querySelector(".nav-actions");
const typeTargets = Array.from(document.querySelectorAll(".type-target"));
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
const footerYear = document.querySelector("#footer-year");
const backToTopButton = document.querySelector("#back-to-top");
const projectCards = Array.from(document.querySelectorAll(".projects-grid .project-card"));
const revealCards = Array.from(
  document.querySelectorAll(".service-card, .education-card, .skills-card, .contact-card")
);

if (menuToggle && navActions) {
  const closeMenu = () => {
    navActions.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = navActions.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const clickedInside = navActions.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside && navActions.classList.contains("open")) {
      closeMenu();
    }
  });

  navActions.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && navActions.classList.contains("open")) {
      closeMenu();
    }
  });
}

const typeWriter = (el, text, finalHtml, speed = 80) =>
  new Promise((resolve) => {
    el.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i += 1;
      if (i >= text.length) {
        clearInterval(timer);
        // Swap to final HTML to restore styling/spans once typing is done.
        el.innerHTML = finalHtml || text;
        el.classList.remove("typing");
        resolve();
      }
    }, speed);
  });

const runTyping = async () => {
  for (const target of typeTargets) {
    const plain = target.dataset.plain || "";
    const finalHtml = target.dataset.finalHtml || plain;
    await typeWriter(target, plain, finalHtml);
  }
};

if (typeTargets.length) {
  runTyping();
}

if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}

if (backToTopButton) {
  const toggleTopButton = () => {
    backToTopButton.classList.toggle("visible", window.scrollY > 420);
  };

  toggleTopButton();
  window.addEventListener("scroll", toggleTopButton, { passive: true });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = contactForm.querySelector("#full-name")?.value.trim() || "";
    const emailAddress = contactForm.querySelector("#email-address")?.value.trim() || "";
    const phoneNumber = contactForm.querySelector("#phone-number")?.value.trim() || "";
    const message = contactForm.querySelector("#message")?.value.trim() || "";

    if (!fullName || !emailAddress || !message) {
      if (contactStatus) {
        contactStatus.textContent = "Please fill in all required fields.";
        contactStatus.classList.remove("success");
        contactStatus.classList.add("error");
      }
      return;
    }

    const recipient = "edwardsalonik9@gmail.com";
    const mailSubject = encodeURIComponent(`Portfolio enquiry from ${fullName}`);
    const phoneLine = phoneNumber || "Not provided";
    const mailBody = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${emailAddress}\nPhone: ${phoneLine}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

    if (contactStatus) {
      contactStatus.textContent = "Your email app is opening with this message.";
      contactStatus.classList.remove("error");
      contactStatus.classList.add("success");
    }
  });
}

if (projectCards.length) {
  if ("IntersectionObserver" in window) {
    const projectObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            projectCards.forEach((card) => card.classList.add("active"));
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0,
      }
    );

    projectCards.forEach((card) => {
      projectObserver.observe(card);
    });
  } else {
    projectCards.forEach((card) => card.classList.add("active"));
  }
}

if ("IntersectionObserver" in window && revealCards.length) {
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          reveal.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.2,
    }
  );

  revealCards.forEach((card, idx) => {
    card.style.transitionDelay = `${idx * 60}ms`;
    reveal.observe(card);
  });
} else {
  revealCards.forEach((card) => {
    card.classList.add("in-view");
  });
}

// Navigation scroll animation
let isFixed = false;
let ticking = false;

function updateNavbar() {
  const navbar = document.getElementById("navbar");
  const scrollY = window.scrollY;
  const initialTop = 24; // 1.5rem in pixels

  // Check if screen is less than md breakpoint (768px)
  const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;
  const islandWidth = isSmallScreen ? "90%" : "70%";

  // Calculate when navbar should become fixed (when it would touch the top)
  const shouldBeFixed = scrollY >= initialTop;

  if (shouldBeFixed && !isFixed) {
    // Transform to full width fixed navigation
    navbar.style.position = "fixed";
    navbar.style.top = "0";
    navbar.style.left = "0";
    navbar.style.transform = "translateX(0)";
    navbar.style.width = "100%";
    navbar.style.maxWidth = "100%";
    navbar.style.borderRadius = "0";
    navbar.style.padding = "0.5rem 2rem";
    isFixed = true;
  } else if (!shouldBeFixed && isFixed) {
    // Return to island shape - animate from full width to center
    navbar.style.position = "absolute";
    navbar.style.top = initialTop + "px";
    navbar.style.left = "50%";
    navbar.style.transform = "translateX(-50%)";
    navbar.style.width = islandWidth;
    navbar.style.maxWidth = "64rem"; // max-w-4xl
    navbar.style.borderRadius = "30px";
    navbar.style.padding = "0.5rem 4rem";
    isFixed = false;
  } else if (!isFixed) {
    // Update position while not fixed
    navbar.style.top = Math.max(0, initialTop - scrollY) + "px";
  }

  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateNavbar);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll to top on logo or Home click
document.addEventListener("DOMContentLoaded", function () {
  // Logo image
  const logoImg = document.querySelector(
    'img[alt="Binomial Time Unip. Lda Logo"]'
  );
  if (logoImg) {
    logoImg.style.cursor = "pointer";
    logoImg.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  // Home nav item
  const homeLink = document.querySelector('a[href="#home"]');
  if (homeLink) {
    homeLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// Count up animation for statistics
function animateCountUp(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  function update() {
    start += increment;
    if (start < target) {
      el.textContent = Math.floor(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  update();
}

document.addEventListener("DOMContentLoaded", function () {
  let hasAnimated = false;
  const statsSection = document
    .querySelector(".countup")
    ?.closest("section");
  if (!statsSection) return;

  function isSectionPartiallyInView() {
    const rect = statsSection.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function onScrollOrResize() {
    if (!hasAnimated && isSectionPartiallyInView()) {
      hasAnimated = true;
      document.querySelectorAll(".countup").forEach((el) => {
        const target = parseInt(el.getAttribute("data-target"), 10);
        animateCountUp(el, target);
      });
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    }
  }

  window.addEventListener("scroll", onScrollOrResize);
  window.addEventListener("resize", onScrollOrResize);
  // In case it's already in view on load
  onScrollOrResize();
});

// Fade-in-up animation on visibility for all sub-sections with staggered delay
document.addEventListener("DOMContentLoaded", function () {
  const animatedEls = Array.from(
    document.querySelectorAll(".fade-in-up-animate")
  );
  const observer = new window.IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("visible")
        ) {
          setTimeout(() => {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }, 150); // 150ms delay for all
        }
      });
    },
    { threshold: 0.2 }
  );
  animatedEls.forEach((el) => observer.observe(el));
});

// Hero Image Carousel
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".carousel-slide");
  let currentSlide = 0;
  const slideInterval = 5000; // Change slide every 5 seconds

  function nextSlide() {
    slides[currentSlide].style.opacity = "0";
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.opacity = "1";
  }

  // Start the carousel
  setInterval(nextSlide, slideInterval);
});

// Language Switcher Functionality
document.addEventListener("DOMContentLoaded", function () {
  const enLang = document.getElementById("enLang");
  const ptLang = document.getElementById("ptLang");

  // Get saved language from localStorage or default to English
  let currentLanguage = localStorage.getItem("selectedLanguage") || "en";

  // Initialize language
  changeLanguage(currentLanguage);

  // Language option clicks
  document.querySelectorAll(".language-option").forEach((option) => {
    option.addEventListener("click", function (e) {
      e.stopPropagation();
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);
    });
  });

  function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("selectedLanguage", lang);

    // Update bold styling
    enLang.classList.toggle("font-bold", lang === "en");
    enLang.classList.toggle("text-darker-yellow", lang === "en");
    ptLang.classList.toggle("font-bold", lang === "pt");
    ptLang.classList.toggle("text-darker-yellow", lang === "pt");

    // Update all elements with data attributes
    document
      .querySelectorAll("[data-" + lang + "]")
      .forEach((element) => {
        const text = element.getAttribute("data-" + lang);
        if (text) {
          element.textContent = text;
        }
      });

    // Update placeholders
    document
      .querySelectorAll("[data-" + lang + "-placeholder]")
      .forEach((element) => {
        const placeholder = element.getAttribute(
          "data-" + lang + "-placeholder"
        );
        if (placeholder) {
          element.placeholder = placeholder;
        }
      });
  }
});

// Mobile nav toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.getElementById("mobile-nav-toggle");
  const mobileNavList = document.getElementById("mobileNavList");
  const navbar = document.getElementById("navbar");
  let isOpen = false;
  if (mobileToggle && mobileNavList) {
    mobileToggle.addEventListener("click", function () {
      isOpen = !isOpen;
      mobileToggle.classList.toggle("open", isOpen);
      if (isOpen) {
        mobileNavList.style.height = mobileNavList.scrollHeight + "px";
        mobileNavList.classList.add("open");
        mobileNavList.style.opacity = "1";
        mobileNavList.style.pointerEvents = "auto";
        navbar.style.borderRadius = isFixed ? "0px" : "10px";
      } else {
        mobileNavList.style.height = "0";
        mobileNavList.classList.remove("open");
        mobileNavList.style.opacity = "0";
        mobileNavList.style.pointerEvents = "none";
        navbar.style.borderRadius = isFixed ? "0px" : "32px";
      }
    });
    // Collapse menu when a link is clicked
    mobileNavList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        isOpen = false;
        mobileNavList.style.height = "0";
        mobileNavList.classList.remove("open");
        mobileNavList.style.opacity = "0";
        mobileNavList.style.pointerEvents = "none";
        mobileToggle.classList.remove("open");
      });
    });
  }
});

// Load Google reCAPTCHA v3 script dynamically
(function() {
  var recaptchaScript = document.createElement('script');
  recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=6Le0logrAAAAALKopSi68mB1IcKD3MEgJFZxM9Li';
  recaptchaScript.async = true;
  document.head.appendChild(recaptchaScript);
})();

// Contact form validation, Google reCAPTCHA v3 (site-side only), loading spinner, and closeable result message
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  const result = document.getElementById("result");
  const submitBtn = document.getElementById("submitBtn");
  const submitBtnText = document.getElementById("submitBtnText");
  const submitSpinner = document.getElementById("submitSpinner");
  // Language messages
  const messages = {
    en: {
      nameRequired: "Name is required.",
      emailRequired: "Email is required.",
      emailInvalid: "Please enter a valid email address.",
      subjectRequired: "Subject is required.",
      success: "Your message has been sent successfully!",
      error: "Something went wrong! Try again.",
      recaptcha: "reCAPTCHA error. Please try again.",
    },
    pt: {
      nameRequired: "Nome é obrigatório.",
      emailRequired: "Email é obrigatório.",
      emailInvalid: "Por favor, insira um endereço de email válido.",
      subjectRequired: "Assunto é obrigatório.",
      success: "Sua mensagem foi enviada com sucesso!",
      error: "Algo deu errado! Tente novamente.",
      recaptcha: "Erro no reCAPTCHA. Por favor, tente novamente.",
    },
  };
  function getCurrentLang() {
    return localStorage.getItem("selectedLanguage") || "en";
  }
  function showResult(message, isSuccess) {
    result.innerHTML = `<span>${message}</span> <button id='closeResult' class='ml-2 text-sm text-blue-700 underline bg-transparent border-0 cursor-pointer' style='background:none;border:none;' aria-label='Close'>&times;</button>`;
    result.classList.remove(
      "text-gray-500",
      "text-green-500",
      "text-red-500"
    );
    result.classList.add(
      isSuccess ? "text-green-500" : "text-red-500",
      isSuccess ? "bg-green-50" : "bg-red-50",
      "py-1.5",
      "px-3"
    );
    document.getElementById("closeResult").onclick = function () {
      result.innerHTML = "";
      result.classList.remove(
        "py-1.5",
        "px-3",
        "bg-red-50",
        "bg-green-50",
        "rounded"
      );
    };
  }
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let hasError = false;
    ["errorName", "errorEmail", "errorSubject"].forEach((id) => {
      document.getElementById(id).style.display = "none";
      document.getElementById(id).textContent = "";
    });
    const lang = getCurrentLang();
    const name = form.name.value.trim();
    if (!name) {
      document.getElementById("errorName").textContent =
        messages[lang].nameRequired;
      document.getElementById("errorName").style.display = "block";
      hasError = true;
    }
    const email = form.email.value.trim();
    if (!email) {
      document.getElementById("errorEmail").textContent =
        messages[lang].emailRequired;
      document.getElementById("errorEmail").style.display = "block";
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("errorEmail").textContent =
        messages[lang].emailInvalid;
      document.getElementById("errorEmail").style.display = "block";
      hasError = true;
    }
    const subject = form.subject.value.trim();
    if (!subject) {
      document.getElementById("errorSubject").textContent =
        messages[lang].subjectRequired;
      document.getElementById("errorSubject").style.display = "block";
      hasError = true;
    }
    if (hasError) {
      return;
    }
    // Show spinner and disable button
    submitBtn.disabled = true;
    submitSpinner.classList.remove("hidden");
    submitBtnText.classList.add("opacity-50");
    // Google reCAPTCHA v3: get token and send to backend
    grecaptcha.ready(function () {
      grecaptcha
        .execute("6Le0logrAAAAALKopSi68mB1IcKD3MEgJFZxM9Li", {
          action: "submit",
        })
        .then(function (token) {
          // Prepare payload for backend
          const payload = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim(),
            token: token,
          };
          fetch("https://contact.binomialtime.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
            .then(async (response) => {
              let data = await response.json();
              if (response.ok && data.status === "success") {
                showResult(messages[lang].success, true);
              } else if (data && data.error) {
                showResult(data.error, false);
              } else {
                showResult(messages[lang].error, false);
              }
            })
            .catch(() => {
              showResult(messages[lang].error, false);
            })
            .finally(() => {
              submitBtn.disabled = false;
              submitSpinner.classList.add("hidden");
              submitBtnText.classList.remove("opacity-50");
              form.reset();
            });
        })
        .catch(() => {
          showResult(messages[lang].recaptcha, false);
          submitBtn.disabled = false;
          submitSpinner.classList.add("hidden");
          submitBtnText.classList.remove("opacity-50");
        });
    });
  });
}); 
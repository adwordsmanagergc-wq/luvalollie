/* =====================================================================
   Luv A Lollie — script.js
   Vanilla JS: floating lollipops, mobile nav, swipeable TikTok slider.
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Floating lollipop sprites
  ------------------------------------------------------------------ */
  function spawnLollipops() {
    var field = document.getElementById("lollyField");
    if (!field) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var sprites = ["🍭", "🍬", "🍫", "🍬"];
    for (var i = 0; i < 9; i++) {
      var s = document.createElement("span");
      s.className = "lolly";
      s.textContent = sprites[i % sprites.length];
      s.style.left = (5 + Math.random() * 90) + "%";
      s.style.animationDuration = (16 + Math.random() * 16) + "s";
      s.style.animationDelay = (-Math.random() * 20) + "s";
      s.style.fontSize = (1.6 + Math.random() * 2) + "rem";
      field.appendChild(s);
    }
  }

  /* ------------------------------------------------------------------
     Mobile nav toggle + close-on-click
  ------------------------------------------------------------------ */
  function setupNav() {
    var toggle = document.getElementById("navToggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------
     Swipeable TikTok video slider
  ------------------------------------------------------------------ */
  function setupSlider() {
    var track = document.getElementById("sliderTrack");
    var prev = document.getElementById("sliderPrev");
    var next = document.getElementById("sliderNext");
    if (!track || !prev || !next) return;

    var slides = track.querySelectorAll(".slide");
    /* with a single video there's nothing to swipe — hide the arrows */
    if (slides.length < 2) {
      prev.hidden = true;
      next.hidden = true;
      return;
    }

    function step() {
      var slide = track.querySelector(".slide");
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slide ? slide.getBoundingClientRect().width + gap : track.clientWidth;
    }

    prev.addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });

    function updateButtons() {
      var maxScroll = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll;
    }
    track.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  }

  /* ------------------------------------------------------------------
     Footer year
  ------------------------------------------------------------------ */
  function setYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    spawnLollipops();
    setupNav();
    setupSlider();
    setYear();
  });
})();

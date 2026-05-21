/* =====================================================================
   Luv A Lollie — script.js
   Vanilla JS: floating lollipops, mobile nav.
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
    setYear();
  });
})();

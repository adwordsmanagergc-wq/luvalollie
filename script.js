/* =====================================================================
   Luv A Lollie — script.js
   Vanilla JS: products + cart, floating lollipops, mobile nav.
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Product catalogue — placeholders until real photos drop into
     images/product-<id>.png. A pink-gradient SVG with the product's
     emoji shows in the meantime.
  ------------------------------------------------------------------ */
  var PRODUCTS = [
    { id: "strawberry-hearts",       name: "Strawberry Hearts",      price: 3.50, emoji: "🍓" },
    { id: "rainbow-sour-straps",     name: "Rainbow Sour Straps",    price: 3.50, emoji: "🌈" },
    { id: "sour-watermelon-slices",  name: "Sour Watermelon Slices", price: 3.50, emoji: "🍉" },
    { id: "jelly-beans",             name: "Jelly Beans",            price: 3.50, emoji: "🍬" },
    { id: "choc-freckles",           name: "Choc Freckles",          price: 3.80, emoji: "🍫" },
    { id: "musk-sticks",             name: "Musk Sticks",            price: 3.20, emoji: "🍭" }
  ];

  var PINKS = ["#ffe2ec", "#fbcfe0", "#f48fb1", "#ff8aaa", "#ec4899"];

  /* a soft pink gradient + the product emoji, served as a data URI */
  function swirlDataURI(seed, emoji) {
    var a = PINKS[seed % PINKS.length];
    var b = PINKS[(seed + 2) % PINKS.length];
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
        '<defs><linearGradient id="g' + seed + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + a + '"/>' +
          '<stop offset="1" stop-color="' + b + '"/>' +
        '</linearGradient></defs>' +
        '<rect width="200" height="200" fill="url(#g' + seed + ')"/>' +
        '<text x="100" y="128" font-size="96" text-anchor="middle">' + (emoji || "🍬") + '</text>' +
      '</svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function attachFallback(img, seed, emoji) {
    img.addEventListener("error", function handle() {
      img.removeEventListener("error", handle);
      img.src = swirlDataURI(seed, emoji);
    });
  }

  /* ------------------------------------------------------------------
     Cart
  ------------------------------------------------------------------ */
  var cartCount = 0;
  var cartCountEl = document.getElementById("cartCount");
  var toastEl = document.getElementById("toast");
  var toastTimer;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2200);
  }

  function addToCart(product) {
    cartCount += 1;
    cartCountEl.textContent = String(cartCount);
    cartCountEl.classList.remove("bump");
    /* force reflow so the bump animation can replay */
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add("bump");
    showToast(product.name + " added to cart 💕");
  }

  /* ------------------------------------------------------------------
     Render product cards
  ------------------------------------------------------------------ */
  function renderProducts() {
    var grid = document.getElementById("productGrid");
    if (!grid) return;
    var frag = document.createDocumentFragment();

    PRODUCTS.forEach(function (product, i) {
      var card = document.createElement("article");
      card.className = "product-card";

      var img = document.createElement("img");
      img.className = "product-thumb";
      img.src = "images/product-" + product.id + ".png";
      img.alt = product.name;
      img.loading = "lazy";
      attachFallback(img, i, product.emoji);

      var name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = product.name;

      var price = document.createElement("p");
      price.className = "product-price";
      price.textContent = "$" + product.price.toFixed(2) + " / 100g";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--cart";
      btn.textContent = "Add to Cart";
      btn.addEventListener("click", function () { addToCart(product); });

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(price);
      card.appendChild(btn);
      frag.appendChild(card);
    });

    grid.appendChild(frag);
  }

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
     Cart button click + footer year
  ------------------------------------------------------------------ */
  function setupMisc() {
    var cartBtn = document.getElementById("cartBtn");
    if (cartBtn) {
      cartBtn.addEventListener("click", function () {
        showToast(
          cartCount === 0
            ? "Your cart is empty — grab some sweets! 🍬"
            : "You’ve got " + cartCount + " sweet treat" +
              (cartCount === 1 ? "" : "s") + " in your cart!"
        );
      });
    }
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------
     Init
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    renderProducts();
    spawnLollipops();
    setupNav();
    setupMisc();
  });
})();

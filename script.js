/* =====================================================================
   Luv A Lollie — script.js
   Vanilla JS: product rendering, cart counter, floating lollipops,
   image fallbacks, mobile nav, smooth-scroll niceties.
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Product catalogue — prices in AUD.
     Each image points at images/<file>.png so photos can be dropped in
     via GitHub later; a colourful SVG swirl is shown until they exist.
  ------------------------------------------------------------------ */
  var PRODUCTS = [
    { id: "swirl-pops",  name: "Rainbow Swirl Lollipops", price: 3.50,
      desc: "Hand-twisted spiral pops in every colour of the groove.",
      img: "images/product-swirl-pops.png" },
    { id: "gobstoppers", name: "Giant Gobstoppers", price: 4.00,
      desc: "Jaw-stretching jawbreakers that change colour as you go.",
      img: "images/product-gobstoppers.png" },
    { id: "sherbet",     name: "Fizzy Sherbet Cups", price: 2.80,
      desc: "Tangy sherbet with a liquorice dipper — pure fizz.",
      img: "images/product-sherbet.png" },
    { id: "jellies",     name: "Wobbly Jelly Beans", price: 5.20,
      desc: "A jar of squishy, fruity, far-out jelly beans.",
      img: "images/product-jellies.png" },
    { id: "fudge",       name: "Groovy Fudge Squares", price: 6.50,
      desc: "Soft, buttery fudge swirled with rainbow ribbons.",
      img: "images/product-fudge.png" },
    { id: "mix-bag",     name: "Retro Mix Bag", price: 8.90,
      desc: "A nostalgic pick-and-mix of all our 70s classics.",
      img: "images/product-mix-bag.png" },
    { id: "rock-candy",  name: "Tie-Dye Rock Candy", price: 4.75,
      desc: "Crunchy crystal candy with a psychedelic swirl.",
      img: "images/product-rock-candy.png" },
    { id: "peace-pops",  name: "Peace & Love Pops", price: 3.20,
      desc: "Heart-shaped lollies spreading sugary good vibes.",
      img: "images/product-peace-pops.png" }
  ];

  var PALETTE = ["#ff3ea5", "#ff7a18", "#ffd23f", "#8ed81c", "#1ec8c8", "#8a3ffb"];

  /* ------------------------------------------------------------------
     Build an inline SVG swirl placeholder (data URI) so a missing
     image file still looks like a candy treat.
  ------------------------------------------------------------------ */
  function swirlDataURI(seed) {
    var a = PALETTE[seed % PALETTE.length];
    var b = PALETTE[(seed + 2) % PALETTE.length];
    var c = PALETTE[(seed + 4) % PALETTE.length];
    var rings = "";
    for (var r = 78; r > 0; r -= 13) {
      var fill = [a, b, c][(r / 13) % 3 | 0];
      rings += '<circle cx="100" cy="100" r="' + r + '" fill="none" ' +
               'stroke="' + fill + '" stroke-width="8"/>';
    }
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
      '<rect width="200" height="200" fill="' + c + '"/>' +
      '<g transform="rotate(20 100 100)">' + rings + '</g>' +
      '<text x="100" y="112" font-size="46" text-anchor="middle">&#127853;</text>' +
      '</svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  /* attach a fallback so broken <img> tags swap to a swirl */
  function attachFallback(img, seed) {
    img.addEventListener("error", function handle() {
      img.removeEventListener("error", handle);
      img.src = swirlDataURI(seed);
    });
  }

  /* ------------------------------------------------------------------
     Cart counter
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
    /* force reflow so the animation can replay */
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add("bump");
    showToast(product.name + " added to cart — groovy! 🍭");
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
      img.src = product.img;
      img.alt = product.name;
      img.loading = "lazy";
      attachFallback(img, i);

      var name = document.createElement("h3");
      name.className = "product-name";
      name.textContent = product.name;

      var desc = document.createElement("p");
      desc.className = "product-desc";
      desc.textContent = product.desc;

      var price = document.createElement("p");
      price.className = "product-price";
      price.textContent = "$" + product.price.toFixed(2) + " AUD";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--cart";
      btn.textContent = "Add to Cart";
      btn.addEventListener("click", function () {
        addToCart(product);
      });

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(desc);
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
     Hero sweets image fallback + footer year + cart scroll
  ------------------------------------------------------------------ */
  function setupMisc() {
    var hero = document.querySelector(".hero-image");
    if (hero) attachFallback(hero, 1);

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    var cartBtn = document.getElementById("cartBtn");
    if (cartBtn) {
      cartBtn.addEventListener("click", function () {
        showToast(
          cartCount === 0
            ? "Your cart is empty — grab some sweets! 🍬"
            : "You’ve got " + cartCount + " groovy treat" +
              (cartCount === 1 ? "" : "s") + " in your cart!"
        );
      });
    }
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

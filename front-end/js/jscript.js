document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. MENU HAMBURGER
  // ==========================================

  const menuToggle = document.getElementById("menuToggle");
  const menuPanel = document.getElementById("menuPanel");

  if (menuToggle && menuPanel) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = menuPanel.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Fermer après un clic sur un lien
    menuPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuPanel.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Fermer en cliquant à l'extérieur
    document.addEventListener("click", (event) => {
      if (
        !menuToggle.contains(event.target) &&
        !menuPanel.contains(event.target)
      ) {
        menuPanel.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Fermer avec Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuPanel.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ==========================================
  // 2. BARRE DE RECHERCHE
  // ==========================================

  const searchInput = document.querySelector(".search-btn");
  const searchButton = document.querySelector(".btn-search");
  const menuItems = document.querySelectorAll(".menu-item");

  function searchProducts() {
    if (!searchInput) return;

    const searchValue = searchInput.value.toLowerCase().trim();

    menuItems.forEach((item) => {
      const productName =
        item.querySelector(".item-title")?.textContent.toLowerCase() || "";

      const category =
        item
          .closest(".menu-category")
          ?.querySelector(".category-title")
          ?.textContent.toLowerCase() || "";

      const matches =
        productName.includes(searchValue) || category.includes(searchValue);

      item.style.display = matches ? "" : "none";
    });

    // Masquer les catégories sans résultats
    document.querySelectorAll(".menu-category").forEach((category) => {
      const visibleItems = category.querySelectorAll(
        ".menu-item:not([style*='display: none'])",
      );

      category.style.display = visibleItems.length > 0 ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", searchProducts);

    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        searchProducts();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", searchProducts);
  }

  // ==========================================
  // 3. SYSTÈME DE FAVORIS
  // ==========================================

  const FAVORITES_KEY = "emaFavorites";

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  function getProductName(item) {
    return (
      item.querySelector(".item-title")?.textContent.trim() || "Plat sans nom"
    );
  }

  document.querySelectorAll(".favorite-btn").forEach((button) => {
    const item = button.closest(".menu-item");

    if (!item) return;

    const productName = getProductName(item);

    const favorites = getFavorites();

    if (favorites.includes(productName)) {
      button.classList.add("active");
      button.querySelector("i")?.classList.replace("far", "fas");
    }

    button.addEventListener("click", () => {
      let favorites = getFavorites();

      const icon = button.querySelector("i");

      if (favorites.includes(productName)) {
        favorites = favorites.filter((name) => name !== productName);

        button.classList.remove("active");

        icon?.classList.replace("fas", "far");

        showNotification("Retiré des favoris");
      } else {
        favorites.push(productName);

        button.classList.add("active");

        icon?.classList.replace("far", "fas");

        showNotification("Ajouté aux favoris");
      }

      saveFavorites(favorites);
    });
  });

  // ==========================================
  // 4. GESTION DU PANIER
  // ==========================================

  const CART_KEY = "emaCart";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    updateCartCounter();
  }

  function getProductPrice(item) {
    const priceElement = item.querySelector(".montant");

    if (!priceElement) return 0;

    // Extraire uniquement les chiffres
    const price = priceElement.textContent.replace(/\s/g, "").match(/\d+/);

    return price ? Number(price[0]) : 0;
  }

  function getProductImage(item) {
    return item.querySelector("img")?.getAttribute("src") || "";
  }

  function addToCart(item) {
    const name = getProductName(item);
    const price = getProductPrice(item);
    const image = getProductImage(item);

    if (!price || name === "Plat sans nom") {
      showNotification("Veuillez renseigner le nom et le prix du produit.");

      return;
    }

    let cart = getCart();

    const existingProduct = cart.find((product) => product.name === name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: Date.now() + Math.random(),
        name: name,
        price: price,
        image: image,
        quantity: 1,
      });
    }

    saveCart(cart);

    showNotification(name + " ajouté au panier !");
  }

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".menu-item");

      if (item) {
        addToCart(item);
      }
    });
  });

  // ==========================================
  // 5. COMPTEUR DU PANIER
  // ==========================================

  function updateCartCounter() {
    const cart = getCart();

    const totalQuantity = cart.reduce(
      (total, product) => total + product.quantity,
      0,
    );

    const cartLink = document.querySelector(
      'a[href*="pannier.html"], a[href*="panier.html"]',
    );

    if (!cartLink) return;

    let badge = cartLink.querySelector(".cart-counter");

    if (!badge) {
      badge = document.createElement("span");

      badge.className = "cart-counter";

      cartLink.appendChild(badge);
    }

    badge.textContent = totalQuantity;

    badge.hidden = totalQuantity === 0;
  }

  updateCartCounter();

  // ==========================================
  // 6. NOTIFICATIONS
  // ==========================================

  function showNotification(message) {
    let notification = document.querySelector(".ema-notification");

    if (!notification) {
      notification = document.createElement("div");

      notification.className = "ema-notification";

      notification.setAttribute("role", "status");

      document.body.appendChild(notification);
    }

    notification.textContent = message;

    notification.classList.add("show");

    clearTimeout(notification.timeout);

    notification.timeout = setTimeout(() => {
      notification.classList.remove("show");
    }, 2500);
  }

  // ==========================================
  // 7. ANNÉE AUTOMATIQUE DU FOOTER
  // ==========================================

  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ==========================================
  // 8. AFFICHAGE DES IMAGES
  // ==========================================

  document.querySelectorAll(".menu-item img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");

      console.warn("Image introuvable :", image.getAttribute("src"));
    });
  });

  console.log("E.M.A Restaurant : JavaScript initialisé.");
});

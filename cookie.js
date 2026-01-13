(function () {
  console.log("Cookie script loaded");

  const overlay = document.getElementById("cookieOverlay");

  function showOverlay() {
    overlay.style.display = "flex";
    document.body.classList.add("cookie-blocked");
  }

  function hideOverlay() {
    overlay.style.display = "none";
    document.body.classList.remove("cookie-blocked");
  }

  function updateAffiliateLinks() {
    const consent = localStorage.getItem("affiliateConsent");
    document.querySelectorAll("a[data-affiliate]").forEach(link => {
      if (consent === "accepted") {
        link.href = link.dataset.href;
        link.textContent = link.dataset.label || "Buy Now";
        link.classList.remove("cookie-button");
        link.onclick = null;
      } else {
        link.href = "#";
        link.textContent = "Enable Cookies to View";
        link.classList.add("cookie-button");
        link.onclick = e => {
          e.preventDefault();
          showOverlay();
        };
      }
    });
  }

  document.getElementById("acceptCookies")?.addEventListener("click", () => {
    localStorage.setItem("affiliateConsent", "accepted");
    hideOverlay();
    updateAffiliateLinks();
  });

  document.getElementById("declineCookies")?.addEventListener("click", () => {
    localStorage.setItem("affiliateConsent", "declined");
    hideOverlay();
    updateAffiliateLinks();
  });

  window.manageCookies = function () {
    showOverlay();
  };

  const consent = localStorage.getItem("affiliateConsent");
  if (!consent) showOverlay();
  updateAffiliateLinks();
})();

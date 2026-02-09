/* ========= COOKIE WALL – WORKSETUP ========= */
(function () {
  const CONSENT_KEY = "cookieConsent_v1";

  function qs(id) { return document.getElementById(id); }
  function blockPage(block) { document.body.style.overflow = block ? "hidden" : ""; }

  const html = `
<div id="cw-overlay" style="display:none">
  <div id="cw-box">
    <p id="cw-affiliate-blocked" style="
      display:none;
      font-size:13px;
      color:#b00020;
      margin-bottom:10px;
    ">
      Redirection was blocked because affiliate cookies are not enabled.
    </p>

    <h2>Privacy & Cookies</h2>

    <button id="cw-accept">Accept all</button>
    <button id="cw-settings">Settings</button>
  </div>
</div>
`;

  const css = `
#cw-overlay {
  position:fixed; inset:0;
  background:rgba(0,0,0,.75);
  display:flex; justify-content:center; align-items:center;
  z-index:999999;
}
#cw-box {
  background:#fff;
  padding:24px;
  border-radius:12px;
  max-width:420px;
  width:100%;
}
`;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", html);
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const overlay = qs("cw-overlay");

    /* ===== Cookie State ===== */
    window.getCookieState = () => {
      try {
        return JSON.parse(localStorage.getItem("cookieState")) || { affiliate:false };
      } catch {
        return { affiliate:false };
      }
    };

    window.setCookieState = (state) => {
      localStorage.setItem("cookieState", JSON.stringify(state));
      localStorage.setItem(CONSENT_KEY, "true");
    };

    function showOverlay() {
      overlay.style.display = "flex";
      blockPage(true);
    }

    function hideOverlay() {
      overlay.style.display = "none";
      blockPage(false);
    }

    window.manageCookies = showOverlay;

    /* ===== Buttons ===== */
    qs("cw-accept").onclick = () => {
      window.setCookieState({ affiliate:true });
      hideOverlay();
    };

    qs("cw-settings").onclick = () => {
      qs("cw-affiliate-blocked").style.display = "none";
      showOverlay();
    };

    /* ===== Affiliate-Link-Blocker ===== */
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.href || "";
      const isAffiliate =
        href.includes("tag=") ||
        href.includes("amzn.to") ||
        href.includes("amazon.");

      if (!isAffiliate) return;

      const state = window.getCookieState();
      if (state.affiliate === true) return;

      e.preventDefault();
      e.stopPropagation();

      qs("cw-affiliate-blocked").style.display = "block";
      showOverlay();
    });

    if (!localStorage.getItem(CONSENT_KEY)) showOverlay();
  });
})();

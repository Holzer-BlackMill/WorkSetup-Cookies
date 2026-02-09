/* ========= COOKIE WALL – WORKSETUP ========= */
(function () {
  const CONSENT_KEY = "cookieConsent_v1";
  const STATE_KEY = "cookieState";

  function qs(id) { return document.getElementById(id); }
  function blockPage(block) { document.body.style.overflow = block ? "hidden" : ""; }

  /* ---------- HTML ---------- */
  const html = `
<div id="cw-overlay" style="display:none">
  <div id="cw-box">

    <p id="cw-affiliate-blocked" style="
      display:none;
      font-size:13px;
      color:#b00020;
      margin-bottom:12px;
    ">
      Redirection was blocked because affiliate cookies are not enabled.
    </p>

    <h2>Privacy & Cookies</h2>
    <p style="font-size:14px;color:#444">
      Affiliate cookies are required to open external product links.
    </p>

    <div style="margin-top:16px;display:flex;gap:10px">
      <button id="cw-accept">Accept affiliate cookies</button>
      <button id="cw-settings">Settings</button>
    </div>
  </div>
</div>
`;

  const css = `
#cw-overlay {
  position:fixed; inset:0;
  background:rgba(0,0,0,.75);
  display:flex; justify-content:center; align-items:center;
  z-index:999999;
  font-family:Arial,sans-serif;
}
#cw-box {
  background:#fff;
  padding:24px;
  border-radius:12px;
  max-width:420px;
  width:100%;
}
#cw-box button {
  padding:10px 14px;
  border-radius:6px;
  border:none;
  cursor:pointer;
}
`;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", html);
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const overlay = qs("cw-overlay");
    const message = qs("cw-affiliate-blocked");

    /* ===== STATE ===== */
    window.getCookieState = () => {
      try {
        const s = JSON.parse(localStorage.getItem(STATE_KEY));
        return s && typeof s.affiliate === "boolean"
          ? s
          : { affiliate:false };
      } catch {
        return { affiliate:false };
      }
    };

    window.setCookieState = (state) => {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      localStorage.setItem(CONSENT_KEY, "true");
    };

    function showOverlay(showMessage = false) {
      overlay.style.display = "flex";
      message.style.display = showMessage ? "block" : "none";
      blockPage(true);
    }

    function hideOverlay() {
      overlay.style.display = "none";
      blockPage(false);
    }

    window.manageCookies = () => showOverlay(false);

    /* ===== BUTTONS ===== */
    qs("cw-accept").onclick = () => {
      window.setCookieState({ affiliate:true });
      hideOverlay();
    };

    qs("cw-settings").onclick = () => {
      showOverlay(false);
    };

    /* ===== AFFILIATE LINK BLOCKER ===== */
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

      showOverlay(true);
    });

    /* ===== INITIAL ===== */
    if (!localStorage.getItem(CONSENT_KEY)) {
      window.setCookieState({ affiliate:false });
      showOverlay(false);
    }
  });
})();

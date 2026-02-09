/* ========= COOKIE WALL – WORKSETUP (CLEAN) ========= */
(function () {
  const CONSENT_KEY = "cookieConsent_v1";
  const STATE_KEY = "cookieState";

  function qs(id) {
    return document.getElementById(id);
  }

  function blockPage(block) {
    document.body.style.overflow = block ? "hidden" : "";
  }

  /* ---------- HTML ---------- */
  const html = `
<div id="cw-overlay" style="display:none;">
  <div id="cw-box">

    <p id="cw-affiliate-blocked" style="
      display:none;
      font-size:13px;
      color:#b00020;
      margin-bottom:10px;
    ">
      Redirection was blocked because affiliate cookies are not enabled.
    </p>

    <div id="cw-main">
      <h2>Privacy & Cookies</h2>
      <p>
        We use cookies to enable affiliate tracking and basic analytics.
        No personal data is sold.
        <br><br>
        <a href="/privacy-policy" target="_blank">Privacy Policy</a>
      </p>

      <div class="cw-actions">
        <button id="cw-settings" class="cw-btn gray">Settings</button>
        <button id="cw-accept" class="cw-btn blue">Accept</button>
      </div>
    </div>

    <div id="cw-settings-layer" style="display:none;">
      <div class="cw-header">
        <h2>Cookie Settings</h2>
        <span id="cw-reject-all">Reject all</span>
      </div>

      <div class="cw-list">
        <label>
          <input type="checkbox" checked disabled>
          Essential cookies (required)
        </label>

        <label>
          <input type="checkbox" data-cookie="affiliate">
          Affiliate tracking cookies
        </label>

        <label>
          <input type="checkbox" data-cookie="analytics">
          Analytics cookies
        </label>
      </div>

      <div class="cw-actions">
        <button id="cw-save" class="cw-btn gray">Save</button>
        <button id="cw-accept-all" class="cw-btn blue">Accept all</button>
      </div>
    </div>

  </div>
</div>
`;

  /* ---------- CSS ---------- */
  const css = `
#cw-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  font-family: Arial, sans-serif;
}
#cw-box {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  padding: 24px;
}
.cw-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.cw-btn {
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.cw-btn.blue {
  background: #0070f3;
  color: white;
}
.cw-btn.gray {
  background: #e5e5e5;
}
.cw-header {
  display: flex;
  justify-content: space-between;
}
#cw-reject-all {
  cursor: pointer;
  text-decoration: underline;
  font-size: 13px;
}
`;

  document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", html);
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const overlay = qs("cw-overlay");
    const main = qs("cw-main");
    const settings = qs("cw-settings-layer");
    const affiliateMsg = qs("cw-affiliate-blocked");

    /* ---------- STATE ---------- */
    function getState() {
      return JSON.parse(localStorage.getItem(STATE_KEY)) || {
        affiliate: false,
        analytics: false,
      };
    }

    function setState(state) {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      applyStateToUI();
    }

    function applyStateToUI() {
      const state = getState();
      document.querySelectorAll("[data-cookie]").forEach(cb => {
        cb.checked = state[cb.dataset.cookie] === true;
      });
    }

    /* ---------- OVERLAY ---------- */
    function showOverlay(mode = "normal") {
      overlay.style.display = "flex";
      blockPage(mode === "block");
      affiliateMsg.style.display = mode === "block" ? "block" : "none";
      main.style.display = "block";
      settings.style.display = "none";
      applyStateToUI();
    }

    function hideOverlay() {
      overlay.style.display = "none";
      blockPage(false);
    }

    window.manageCookies = () => showOverlay("normal");

    /* ---------- ACTIONS ---------- */
    qs("cw-settings").onclick = () => {
      main.style.display = "none";
      settings.style.display = "block";
    };

    qs("cw-accept").onclick = () => {
      setState({ affiliate: true, analytics: true });
      localStorage.setItem(CONSENT_KEY, "true");
      hideOverlay();
    };

    qs("cw-accept-all").onclick = qs("cw-accept").onclick;

    qs("cw-save").onclick = () => {
      const state = {};
      document.querySelectorAll("[data-cookie]").forEach(cb => {
        state[cb.dataset.cookie] = cb.checked;
      });
      setState(state);
      localStorage.setItem(CONSENT_KEY, "true");
      hideOverlay();
    };

    qs("cw-reject-all").onclick = () => {
      setState({ affiliate: false, analytics: false });
      localStorage.setItem(CONSENT_KEY, "true");
      hideOverlay();
    };

    /* ---------- AFFILIATE LINK BLOCK ---------- */
    document.addEventListener("click", function (e) {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.href || "";
      const isAffiliate =
        href.includes("amazon.") ||
        href.includes("amzn.to") ||
        href.includes("tag=");

      if (!isAffiliate) return;

      const state = getState();
      if (state.affiliate === true) return;

      e.preventDefault();
      e.stopPropagation();
      showOverlay("block");
    });

    /* ---------- INITIAL ---------- */
    if (!localStorage.getItem(STATE_KEY)) {
      setState({ affiliate: false, analytics: false });
    }

    if (!localStorage.getItem(CONSENT_KEY)) {
      showOverlay("normal");
    }
  });
})();

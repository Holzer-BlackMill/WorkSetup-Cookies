/* ========= COOKIE WALL – WORKSETUP ========= */
(function () {
  const CONSENT_KEY = "cookieConsent_v1";

  function qs(id) { return document.getElementById(id); }
  function blockPage(block) { document.body.style.overflow = block ? "hidden" : ""; }


  /* ---------- HTML ---------- */

<p id="cw-block-msg" style="display:none; font-size:13px; color:#b00020; margin-bottom:10px;">
  Redirection was blocked because affiliate cookies are not enabled.
</p>

  
  const html = `
<div id="cw-overlay">
  <div id="cw-box">

    <!-- LAYER 1 -->
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

    <!-- LAYER 2 -->
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
          <input type="checkbox" id="c-affiliate" checked data-cookie="affiliate">
          Affiliate tracking cookies
        </label>

        <label>
          <input type="checkbox" id="c-analytics" checked data-cookie="analytics">
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
#cw-overlay { position: fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.75); z-index:999999; font-family:Arial,sans-serif; overflow:hidden;}
#cw-box { background:#fff; width:100%; max-width:420px; border-radius:12px; padding:24px;}
#cw-box h2 { margin:0 0 10px; font-size:20px;}
#cw-box p { font-size:14px; color:#444;}
#cw-box a { color:#0070f3; text-decoration:underline;}
.cw-actions { display:flex; justify-content:space-between; margin-top:20px;}
.cw-btn { padding:10px 18px; border-radius:6px; border:none; cursor:pointer; font-size:14px;}
.cw-btn.blue { background:#0070f3; color:#fff;}
.cw-btn.gray { background:#e5e5e5; color:#111;}
.cw-header { display:flex; justify-content:space-between; align-items:center;}
#cw-reject-all { font-size:13px; color:#777; text-decoration:underline; cursor:pointer;}
.cw-list { margin-top:15px;}
.cw-list label { display:block; margin-bottom:10px; font-size:14px;}
`;

 document.addEventListener("DOMContentLoaded", () => {
    document.body.insertAdjacentHTML("beforeend", html);
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const overlay = qs("cw-overlay");
    const main = qs("cw-main");
    const settings = qs("cw-settings-layer");

    // Globale Cookie-Funktionen
    window.getCookieState = function() {
      try { return JSON.parse(localStorage.getItem("cookieState")) || { affiliate:false, analytics:false }; }
      catch { return { affiliate:false, analytics:false }; }
    }

    window.setCookieState = function(state) {
      localStorage.setItem("cookieState", JSON.stringify(state));
      window.applyStateToUI && window.applyStateToUI();
    }

    // UI aktualisieren
    window.applyStateToUI = function() {
      const state = window.getCookieState();
      document.querySelectorAll("[data-cookie]").forEach(cb => cb.checked = state[cb.dataset.cookie] !== false);
    }

    // Initialisieren
    if (!localStorage.getItem("cookieState")) {
      window.setCookieState({ affiliate:false, analytics:false });
    } else {
      window.applyStateToUI();
    }

    // Aktionen
function saveSettings() {
  const state = {};
  document.querySelectorAll("[data-cookie]").forEach(cb => {
    state[cb.dataset.cookie] = cb.checked;
  });

  window.setCookieState(state);
  localStorage.setItem(CONSENT_KEY, "true"); // 🔴 WICHTIG
  hideOverlay();
}

function acceptAll() {
  const state = {};
  document.querySelectorAll("[data-cookie]").forEach(cb => {
    cb.checked = true;
    state[cb.dataset.cookie] = true;
  });

  window.setCookieState(state);
  localStorage.setItem(CONSENT_KEY, "true"); // 🔴 WICHTIG
  hideOverlay();
}


    function rejectAll() {
      const state = {};
      document.querySelectorAll("[data-cookie]").forEach(cb => { cb.checked = false; state[cb.dataset.cookie] = false; });
      window.setCookieState(state);
      window.applyStateToUI();
    }

    function showOverlay() { overlay.style.display="flex"; blockPage(true); window.applyStateToUI(); }
    function hideOverlay() { overlay.style.display="none"; blockPage(false); }

    // Events
    qs("cw-accept").onclick = acceptAll;
    qs("cw-settings").onclick = () => { main.style.display="none"; settings.style.display="block"; window.applyStateToUI(); };
    qs("cw-save").onclick = saveSettings;
    qs("cw-accept-all").onclick = acceptAll;
    qs("cw-reject-all").onclick = rejectAll;

    window.manageCookies = showOverlay;

    if (!localStorage.getItem(CONSENT_KEY)) showOverlay();

   window.showAffiliateBlockedMessage = function () {
  const msg = document.getElementById("cw-block-msg");
  if (msg) msg.style.display = "block";
};

  });
})();

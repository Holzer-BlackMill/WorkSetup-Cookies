(function () {

  const COOKIE_KEY = "worksetup_cookie_consent";

  const defaultConsent = {
    necessary: true,
    affiliate: true,
    analytics: true
  };

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(COOKIE_KEY));
    } catch {
      return null;
    }
  }

  function setConsent(c) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(c));
  }

  function getOverlay() {
    return document.getElementById("cookieOverlay");
  }

  function showOverlay() {
    const o = getOverlay();
    if (!o) return;
    o.style.display = "flex";
    document.body.classList.add("cookie-blocked");
    showLayer("main");
  }

  function hideOverlay() {
    const o = getOverlay();
    if (!o) return;
    o.style.display = "none";
    document.body.classList.remove("cookie-blocked");
  }

  function showLayer(layer) {
    document.querySelectorAll(".cookie-layer").forEach(l => l.style.display = "none");
    const target = document.getElementById("cookie-" + layer);
    if (target) target.style.display = "block";
  }

  function updateAffiliateLinks() {
    const consent = getConsent();
    document.querySelectorAll("a[data-affiliate]").forEach(link => {
      if (consent && consent.affiliate) {
        link.href = link.dataset.href;
        link.textContent = link.dataset.label || "Buy now";
        link.classList.remove("cookie-button");
        link.onclick = null;
      } else {
        link.href = "#";
        link.textContent = "Enable cookies to view";
        link.classList.add("cookie-button");
        link.onclick = e => {
          e.preventDefault();
          showOverlay();
        };
      }
    });
  }

  function buildHTML() {
    if (document.getElementById("cookieOverlay")) return;

    const html = `
    <div id="cookieOverlay">
      <div id="cookieBanner">

        <!-- MAIN LAYER -->
        <div id="cookie-main" class="cookie-layer">
          <h2>Privacy & Cookies</h2>
          <p>We use cookies to track affiliate referrals and improve this website. You can accept all cookies or adjust your preferences.</p>
          <a href="/privacy-policy">Privacy Policy</a><br><br>
          <button id="openSettings">Settings</button>
          <button id="acceptMain" class="primary">Accept</button>
        </div>

        <!-- SETTINGS LAYER -->
        <div id="cookie-settings" class="cookie-layer">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h2>Cookie Settings</h2>
            <span id="declineAll" class="link">Decline all</span>
          </div>

          <div class="cookie-option">
            <label><input type="checkbox" disabled checked> Necessary cookies</label>
          </div>

          <div class="cookie-option">
            <label><input type="checkbox" id="affiliateBox" checked> Affiliate cookies</label>
          </div>

          <div class="cookie-option">
            <label><input type="checkbox" id="analyticsBox" checked> Analytics</label>
          </div>

          <div class="cookie-footer">
            <button id="saveSettings">Save</button>
            <button id="acceptAll" class="primary">Accept all</button>
          </div>

        </div>

      </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);
  }

  function buildCSS() {
    const css = `
    #cookieOverlay {
      position:fixed; inset:0;
      background:rgba(0,0,0,0.7);
      display:none;
      justify-content:center;
      align-items:center;
      z-index:999999;
    }
    #cookieBanner {
      background:white;
      padding:28px;
      max-width:450px;
      width:90%;
      border-radius:14px;
      font-family:Arial,sans-serif;
      box-shadow:0 6px 30px rgba(0,0,0,0.3);
    }
    .cookie-layer { display:none; }
    #cookieBanner h2 { margin-bottom:8px; }
    #cookieBanner p { font-size:14px; margin-bottom:16px; }
    #cookieBanner a { font-size:13px; }
    button {
      padding:10px 18px;
      border-radius:6px;
      border:none;
      margin:5px;
      cursor:pointer;
    }
    .primary { background:#0070f3; color:white; }
    .link { text-decoration:underline; cursor:pointer; font-size:13px; color:#666; }
    .cookie-option { margin:10px 0; font-size:14px; }
    .cookie-footer { margin-top:20px; display:flex; justify-content:flex-end; gap:10px; }
    .cookie-button { background:#0070f3; color:white; padding:6px 12px; border-radius:4px; text-decoration:none; }
    body.cookie-blocked > *:not(#cookieOverlay) { pointer-events:none; user-select:none; }
    `;
    const s = document.createElement("style");
    s.innerHTML = css;
    document.head.appendChild(s);
  }

  function bindEvents() {
    // Navigation
    document.getElementById("openSettings").onclick = () => showLayer("settings");

    // Main Accept
    document.getElementById("acceptMain").onclick = () => {
      setConsent({ ...defaultConsent });
      hideOverlay();
      updateAffiliateLinks();
    };

    // Settings Buttons
    document.getElementById("acceptAll").onclick = () => {
      setConsent({ necessary:true, affiliate:true, analytics:true });
      hideOverlay();
      updateAffiliateLinks();
    };

    document.getElementById("saveSettings").onclick = () => {
      setConsent({
        necessary:true,
        affiliate: document.getElementById("affiliateBox").checked,
        analytics: document.getElementById("analyticsBox").checked
      });
      hideOverlay();
      updateAffiliateLinks();
    };

    // Decline all oben rechts
    document.getElementById("declineAll").onclick = () => {
      setConsent({ necessary:true, affiliate:false, analytics:false });
      hideOverlay();
      updateAffiliateLinks();
    };
  }

  window.manageCookies = showOverlay;

  document.addEventListener("DOMContentLoaded", () => {
    buildCSS();
    buildHTML();
    bindEvents();

    const consent = getConsent();
    if (!consent) showOverlay();
    updateAffiliateLinks();
  });

})();

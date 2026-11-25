
(() => {
  "use strict";

  const STORAGE_KEY = "fkgStudentsTheme";

  const defaults = {
    colorMode: "dark",
    accent: "#79a7ff",
    background: "default",
    style: "modern",
    fontSize: "normal",
    animations: true
  };

  const presets = [
    "#79a7ff",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#64748b"
  ];

  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...defaults, ...(saved || {}) };
    } catch {
      return { ...defaults };
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettings(settings);
  }

  function applySettings(settings = loadSettings()) {
    const root = document.documentElement;

    const dark =
      settings.colorMode === "dark" ||
      (
        settings.colorMode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );

    const accent = /^#[0-9a-f]{6}$/i.test(settings.accent)
      ? settings.accent
      : defaults.accent;

    const backgrounds = {
      default: dark ? "#0b1020" : "#f4f6fb",
      midnight: dark ? "#080d19" : "#e9edf5",
      soft: dark ? "#171923" : "#f7f3ef",
      ocean: dark ? "#071b2b" : "#eaf5fa"
    };

    const background =
      backgrounds[settings.background] || backgrounds.default;

    const palette = dark
      ? {
          bg: background,
          panel: "#151f33",
          panel2: "#202c42",
          text: "#f5f7ff",
          muted: "#a4b0c7",
          border: "rgba(180,200,235,.16)"
        }
      : {
          bg: background,
          panel: "#ffffff",
          panel2: "#edf1f7",
          text: "#172033",
          muted: "#586579",
          border: "rgba(30,50,80,.15)"
        };

    const fontSizes = {
      small: "14px",
      normal: "16px",
      large: "18px",
      extra: "20px"
    };

    root.dataset.theme = dark ? "dark" : "light";
    root.dataset.style = settings.style;
    root.dataset.background = settings.background;
    root.dataset.fontSize = settings.fontSize;
    root.dataset.animations = settings.animations ? "on" : "off";

    root.style.colorScheme = dark ? "dark" : "light";

    // Zentrale Variablen für ALLE Seiten
    root.style.setProperty("--user-accent", accent);
    root.style.setProperty("--user-background", background);
    root.style.setProperty(
      "--user-font-size",
      fontSizes[settings.fontSize] || fontSizes.normal
    );

    root.style.setProperty("--bg", palette.bg);
    root.style.setProperty("--panel", palette.panel);
    root.style.setProperty("--panel2", palette.panel2);
    root.style.setProperty("--panel-2", palette.panel2);
    root.style.setProperty("--text", palette.text);
    root.style.setProperty("--muted", palette.muted);
    root.style.setProperty("--border", palette.border);

    // Unterschiedliche Namen für Akzentfarben vereinheitlichen
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--blue", accent);
    root.style.setProperty("--blue-strong", accent);
    root.style.setProperty("--green", "#22c55e");
    root.style.setProperty("--red", "#ef4444");
    root.style.setProperty("--danger", "#ef4444");

    let styleElement = document.getElementById("fkg-theme-overrides");

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "fkg-theme-overrides";
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      /* GRUNDLAGEN */

      html {
        background: var(--bg) !important;
        color-scheme: ${dark ? "dark" : "light"};
      }

      body {
        background-color: var(--bg) !important;
        color: var(--text) !important;
        font-size: var(--user-font-size) !important;
      }

      a, button {
        -webkit-tap-highlight-color: transparent;
      }

      /* SEITENBEREICHE */

      header,
      nav,
      footer {
        color: var(--text);
      }

      [data-theme="light"] header,
      [data-theme="light"] .site-header,
      [data-theme="light"] footer,
      [data-theme="light"] .footer {
        background: var(--panel) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }

      /* TYPISCHE KARTEN UND INHALTSFLÄCHEN */

      .panel,
      .item,
      .admin-item,
      .card,
      .login-panel,
      .login-box,
      .message-card,
      .project-card,
      .hero-aside {
        border-color: var(--border);
      }

      [data-theme="light"] .panel,
      [data-theme="light"] .item,
      [data-theme="light"] .admin-item,
      [data-theme="light"] .card,
      [data-theme="light"] .login-panel,
      [data-theme="light"] .login-box,
      [data-theme="light"] .message-card,
      [data-theme="light"] .project-card,
      [data-theme="light"] .hero-aside {
        background: var(--panel) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }

      /* TEXTFARBEN */

      [data-theme="light"] h1,
      [data-theme="light"] h2,
      [data-theme="light"] h3,
      [data-theme="light"] h4,
      [data-theme="light"] p,
      [data-theme="light"] label,
      [data-theme="light"] strong,
      [data-theme="light"] .logo,
      [data-theme="light"] .brand {
        color: var(--text);
      }

      [data-theme="light"] .small,
      [data-theme="light"] .muted,
      [data-theme="light"] .item-date,
      [data-theme="light"] .header-small {
        color: var(--muted);
      }

      /* FORMULARE */

      input,
      textarea,
      select {
        accent-color: var(--user-accent);
      }

      [data-theme="light"] input,
      [data-theme="light"] textarea,
      [data-theme="light"] select {
        background: var(--panel2) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }

      /* AKZENTFARBEN */

      .logo span,
      .brand span,
      .section-kicker,
      .fkg-sidebar-logo span {
        color: var(--user-accent) !important;
      }

      button,
      .button-primary,
      .preview-button {
        accent-color: var(--user-accent);
      }

      /* STARTSEITE */

      [data-theme="light"] .hero-panel {
        background: linear-gradient(120deg,#e4edff,#f7f9ff) !important;
        color: #172033 !important;
      }

      [data-theme="light"] .hero-copy p,
      [data-theme="light"] .hero-aside h2,
      [data-theme="light"] .quick-link {
        color: #263650 !important;
      }

      [data-theme="light"] .project-card p,
      [data-theme="light"] .section-head p,
      [data-theme="light"] .footer-note {
        color: var(--muted) !important;
      }

      /* STIL: MINIMAL */

      [data-style="minimal"] .panel,
      [data-style="minimal"] .item,
      [data-style="minimal"] .admin-item,
      [data-style="minimal"] .card,
      [data-style="minimal"] .project-card,
      [data-style="minimal"] .hero-panel,
      [data-style="minimal"] .hero-aside {
        box-shadow: none !important;
        border-radius: 8px !important;
      }

      /* STIL: GLASS */

      [data-style="glass"] .panel,
      [data-style="glass"] .item,
      [data-style="glass"] .admin-item,
      [data-style="glass"] .card,
      [data-style="glass"] .project-card,
      [data-style="glass"] .hero-aside {
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }

      /* STIL: MODERN */

      [data-style="modern"] .panel,
      [data-style="modern"] .item,
      [data-style="modern"] .admin-item,
      [data-style="modern"] .card,
      [data-style="modern"] .project-card {
        border-radius: 18px;
      }

      /* SCHRIFTGRÖSSE */

      [data-font-size="small"] body {
        font-size: 14px !important;
      }

      [data-font-size="normal"] body {
        font-size: 16px !important;
      }

      [data-font-size="large"] body {
        font-size: 18px !important;
      }

      [data-font-size="extra"] body {
        font-size: 20px !important;
      }

      /* ANIMATIONEN */

      [data-animations="off"] *,
      [data-animations="off"] *::before,
      [data-animations="off"] *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }

      /* FOKUS */

      a:focus-visible,
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: 2px solid var(--user-accent) !important;
        outline-offset: 4px;
      }
    `;

    const themeColor = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (themeColor) {
      themeColor.content = background;
    }
  }

  function resetSettings() {
    saveSettings({ ...defaults });
  }

  window.FKGTheme = {
    defaults,
    presets,
    loadSettings,
    saveSettings,
    applySettings,
    resetSettings
  };

  applySettings();

  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (loadSettings().colorMode === "system") {
        applySettings();
      }
    });
})();

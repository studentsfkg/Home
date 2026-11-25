
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
    const dark = settings.colorMode === "dark" ||
      (settings.colorMode === "system" &&
       window.matchMedia("(prefers-color-scheme: dark)").matches);

    const accent = /^#[0-9a-f]{6}$/i.test(settings.accent)
      ? settings.accent
      : defaults.accent;

    root.dataset.theme = dark ? "dark" : "light";
    root.dataset.style = settings.style;
    root.dataset.background = settings.background;
    root.dataset.fontSize = settings.fontSize;
    root.style.setProperty("--user-accent", accent);

    root.style.colorScheme = dark ? "dark" : "light";

    const backgrounds = {
      default: dark ? "#0b1020" : "#f4f6fb",
      midnight: dark ? "#080d19" : "#e9edf5",
      soft: dark ? "#171923" : "#f7f3ef",
      ocean: dark ? "#071b2b" : "#eaf5fa"
    };

    root.style.setProperty(
      "--user-background",
      backgrounds[settings.background] || backgrounds.default
    );

    const fontSizes = {
      small: "14px",
      normal: "16px",
      large: "18px",
      extra: "20px"
    };

    root.style.setProperty(
      "--user-font-size",
      fontSizes[settings.fontSize] || fontSizes.normal
    );

    let styleElement = document.getElementById("fkg-theme-overrides");

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "fkg-theme-overrides";
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      body {
        background-color: var(--user-background) !important;
        font-size: var(--user-font-size);
      }

      a, button {
        -webkit-tap-highlight-color: transparent;
      }

      :root {
        --blue: var(--user-accent);
        --blue-strong: var(--user-accent);
      }

      [data-theme="light"] body {
        color: #172033 !important;
        background-image: none !important;
      }

      [data-theme="light"] .site-header,
      [data-theme="light"] .footer {
        background: rgba(255,255,255,.9) !important;
      }

      [data-theme="light"] .project-card,
      [data-theme="light"] .hero-aside {
        background: #ffffff !important;
        color: #172033 !important;
        border-color: rgba(30,50,80,.14) !important;
      }

      [data-theme="light"] .project-card p,
      [data-theme="light"] .section-head p,
      [data-theme="light"] .footer-note {
        color: #586579 !important;
      }

      [data-theme="light"] .hero-panel {
        background: linear-gradient(120deg,#e4edff,#f7f9ff) !important;
        color: #172033 !important;
      }

      [data-theme="light"] .hero-copy p,
      [data-theme="light"] .hero-aside h2,
      [data-theme="light"] .quick-link {
        color: #263650 !important;
      }

      [data-theme="light"] .brand,
      [data-theme="light"] .header-tag {
        color: #172033 !important;
      }

      [data-style="minimal"] .project-card,
      [data-style="minimal"] .hero-panel,
      [data-style="minimal"] .hero-aside {
        box-shadow: none !important;
        border-radius: 8px !important;
      }

      [data-style="glass"] .project-card,
      [data-style="glass"] .hero-aside {
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        background: rgba(255,255,255,.07) !important;
      }

      [data-style="modern"] .project-card,
      [data-style="modern"] .hero-panel {
        border-radius: 20px;
      }

      [data-font-size="large"] {
        font-size: 18px !important;
      }

      [data-font-size="extra"] {
        font-size: 20px !important;
      }

      [data-animations="off"] *,
      [data-animations="off"] *::before,
      [data-animations="off"] *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }

      a:focus-visible, button:focus-visible {
        outline: 2px solid var(--user-accent);
        outline-offset: 4px;
      }
    `;

    root.dataset.animations = settings.animations ? "on" : "off";

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = dark ? "#0b1020" : "#f4f6fb";
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


(() => {
  "use strict";

  // ==========================================
  // FKG STUDENTS – PWA-EINRICHTUNG
  // ==========================================

  // Web-App-Manifest einbinden
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "/manifest.webmanifest";
    document.head.appendChild(manifest);
  }

  // iOS- und iPadOS-Unterstützung
  const appleMetaTags = [
    {
      name: "apple-mobile-web-app-capable",
      content: "yes"
    },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent"
    },
    {
      name: "apple-mobile-web-app-title",
      content: "FKG Students"
    }
  ];

  appleMetaTags.forEach(item => {
    let meta = document.querySelector(
      `meta[name="${item.name}"]`
    );

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = item.name;
      document.head.appendChild(meta);
    }

    meta.content = item.content;
  });

  // iOS-App-Icon einbinden
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = "/assets/apple-touch-icon.png";
    document.head.appendChild(appleIcon);
  }

  // Theme-Farbe für Browser und App
  if (!document.querySelector('meta[name="theme-color"]')) {
    const themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.content = "#0b1020";
    document.head.appendChild(themeColor);
  }

  // Service Worker registrieren
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js")
        .catch(error => {
          console.error(
            "FKG Students: Service Worker konnte nicht registriert werden.",
            error
          );
        });
    });
  }

  // ==========================================
  // THEME-SYSTEM LADEN
  // ==========================================

  if (!document.querySelector('script[data-fkg-theme]')) {
    const themeScript = document.createElement("script");
    themeScript.src = "/assets/theme.js";
    themeScript.dataset.fkgTheme = "true";
    document.head.appendChild(themeScript);
  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigation = [
    {
      label: "⚖ Streitschlichter",
      children: [
        { label: "Startseite", url: "/Streitschlichter/" },
        { label: "Kontakt", url: "/Streitschlichter/Kontakt/" },
        { label: "Aufgaben", url: "/Streitschlichter/Aufgaben/" }
      ]
    },
    {
      label: "🏫 Schulleben",
      children: [
        { label: "Stundenpläne", url: "/Schulleben/Stundenpl%C3%A4ne/" },
        { label: "Mensaplan", url: "/Schulleben/Mensa/" },
        { label: "Fundsachen", url: "/Schulleben/Fundsachen/" }
      ]
    }
  ];

  function normalizePath(path) {
    try {
      return decodeURIComponent(path)
        .replace(/\/+$/, "").toLowerCase() || "/";
    } catch {
      return path.replace(/\/+$/, "").toLowerCase() || "/";
    }
  }

  function createNavigation() {
    document.getElementById("fkg-sidebar")?.remove();
    document.getElementById("fkg-menu-overlay")?.remove();
    document.getElementById("fkg-navigation-styles")?.remove();

    const style = document.createElement("style");
    style.id = "fkg-navigation-styles";
    style.textContent = `
      #fkg-sidebar {
        position:fixed;top:0;left:0;width:290px;max-width:85vw;
        height:100vh;height:100dvh;padding:25px 20px;
        background:var(--user-background,#151a27);
        color:var(--text,#f4f6fc);
        border-right:1px solid rgba(255,255,255,.09);
        z-index:10001;transform:translateX(-105%);
        transition:transform .3s ease;overflow-y:auto;
        visibility:hidden;display:flex;flex-direction:column;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        box-sizing:border-box;
      }
      #fkg-sidebar.open {transform:translateX(0);visibility:visible}
      #fkg-sidebar * {box-sizing:border-box}
      .fkg-sidebar-header {
        display:flex;justify-content:space-between;align-items:center;
        padding-bottom:25px;border-bottom:1px solid rgba(255,255,255,.09);
      }
      .fkg-sidebar-logo {color:inherit;font-size:19px;font-weight:800;text-decoration:none}
      .fkg-sidebar-logo span {color:var(--user-accent,#6598ff)}
      .fkg-close-menu {
        width:38px;height:38px;border:1px solid rgba(255,255,255,.09);
        border-radius:9px;background:#191e2b;color:white;font-size:23px;
      }
      .fkg-sidebar-section {margin-top:30px}
      .fkg-project-toggle {
        width:100%;display:flex;justify-content:space-between;
        padding:12px 13px;border:0;border-radius:9px;
        background:transparent;color:inherit;font:inherit;
        font-size:14px;text-align:left;cursor:pointer;
      }
      .fkg-project-toggle:hover,.fkg-submenu a:hover,
      .fkg-sidebar-extra a:hover {background:rgba(255,255,255,.08)}
      .fkg-project-toggle .arrow {transition:transform .25s}
      .fkg-project-toggle.expanded .arrow {transform:rotate(90deg)}
      .fkg-submenu {display:none;padding:5px 0 5px 17px}
      .fkg-submenu.open {display:block}
      .fkg-submenu a,.fkg-sidebar-extra a {
        display:block;padding:10px 12px;margin:3px 0;
        color:#a0a9bd;text-decoration:none;font-size:13px;border-radius:8px;
      }
      .fkg-submenu a.active {color:var(--user-accent,#8eb3ff)}
      .fkg-submenu a::before {content:"↳";margin-right:9px;color:var(--user-accent,#6598ff)}
      .fkg-sidebar-extra {margin-top:25px;padding-top:18px;border-top:1px solid rgba(255,255,255,.09)}
      .fkg-sidebar-extra a {color:var(--user-accent,#8eb3ff);font-weight:650}
      .fkg-sidebar-contact {
        margin-top:auto;padding-top:22px;border-top:1px solid rgba(255,255,255,.09);
        color:#a0a9bd;font-size:12px;line-height:1.7;
      }
      .fkg-sidebar-contact a {color:var(--user-accent,#8eb3ff);overflow-wrap:anywhere}
      #fkg-menu-overlay {
        position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:10000;
        opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s;
      }
      #fkg-menu-overlay.open {opacity:1;visibility:visible}
      body.fkg-menu-open {overflow:hidden}
    `;
    document.head.appendChild(style);

    const sidebar = document.createElement("aside");
    sidebar.id = "fkg-sidebar";
    sidebar.setAttribute("aria-label", "Hauptmenü");

    const overlay = document.createElement("div");
    overlay.id = "fkg-menu-overlay";

    const currentPath = normalizePath(location.pathname);

    let html = `
      <div class="fkg-sidebar-header">
        <a href="/" class="fkg-sidebar-logo">FKG<span>.</span>STUDENTS</a>
        <button class="fkg-close-menu" type="button" aria-label="Menü schließen">×</button>
      </div>
    `;

    navigation.forEach((item, index) => {
      const submenuId = "fkg-submenu-" + index;
      const active = item.children.some(
        child => normalizePath(child.url) === currentPath
      );

      html += `
        <div class="fkg-sidebar-section">
          <button class="fkg-project-toggle ${active ? "expanded" : ""}"
                  type="button" aria-expanded="${active}"
                  aria-controls="${submenuId}" data-submenu="${submenuId}">
            <span>${item.label}</span><span class="arrow">›</span>
          </button>
          <div class="fkg-submenu ${active ? "open" : ""}" id="${submenuId}">
      `;

      item.children.forEach(child => {
        const isActive = normalizePath(child.url) === currentPath;
        html += `
          <a href="${child.url}" class="${isActive ? "active" : ""}"
             ${isActive ? 'aria-current="page"' : ""}>${child.label}</a>
        `;
      });

      html += "</div></div>";
    });

    html += `
      <div class="fkg-sidebar-extra">
        <a href="/Einstellungen/">⚙ Persönliche Einstellungen</a>
      </div>
      <div class="fkg-sidebar-contact">
        Bei Kontaktanfragen wende dich an:<br>
        <a href="mailto:kontakt@fkgstudents.dpdns.org">
          kontakt@fkgstudents.dpdns.org
        </a>
      </div>
    `;

    sidebar.innerHTML = html;
    document.body.append(overlay, sidebar);

    const menuButton = document.getElementById("menuButton");

    function openMenu() {
      sidebar.classList.add("open");
      overlay.classList.add("open");
      document.body.classList.add("fkg-menu-open");
      menuButton?.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      document.body.classList.remove("fkg-menu-open");
      menuButton?.setAttribute("aria-expanded", "false");
    }

    menuButton?.addEventListener("click", () => {
      sidebar.classList.contains("open") ? closeMenu() : openMenu();
    });

    menuButton?.setAttribute("aria-controls", "fkg-sidebar");
    menuButton?.setAttribute("aria-expanded", "false");

    sidebar.querySelector(".fkg-close-menu").addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    sidebar.querySelectorAll(".fkg-project-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const submenu = document.getElementById(button.dataset.submenu);
        const open = submenu.classList.toggle("open");
        button.classList.toggle("expanded", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });

    sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createNavigation);
  } else {
    createNavigation();
  }
})();

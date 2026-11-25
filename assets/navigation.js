(() => {
  "use strict";

  const navigation = [
    {
      title: "",
      items: [
        {
          label: "⚖ Streitschlichter",
          children: [
            { label: "Startseite", url: "/Streitschlichter/" },
            { label: "Kontakt", url: "/Streitschlichter/Kontakt/" },
            { label: "Aufgaben", url: "/Streitschlichter/Aufgaben/" }
          ]
        }
      ]
    },
    {
      title: "",
      items: [
        {
          label: "🏫 Schulleben",
          children: [
            { label: "Stundenpläne", url: "/Schulleben/Stundenpl%C3%A4ne/" },
            { label: "Mensaplan", url: "/Schulleben/Mensa/" },
            { label: "Fundsachen", url: "/Schulleben/Fundsachen/" }
          ]
        }
      ]
    }
  ];

  function normalizePath(path) {
    try {
      return decodeURIComponent(path).replace(/\/+$/, "").toLowerCase() || "/";
    } catch {
      return path.replace(/\/+$/, "").toLowerCase() || "/";
    }
  }

  function createNavigation() {
    const oldSidebar = document.getElementById("fkg-sidebar");
    const oldOverlay = document.getElementById("fkg-menu-overlay");
    const oldStyles = document.getElementById("fkg-navigation-styles");

    oldSidebar?.remove();
    oldOverlay?.remove();
    oldStyles?.remove();

    const style = document.createElement("style");
    style.id = "fkg-navigation-styles";

    style.textContent = `
      #fkg-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 290px;
        max-width: 85vw;
        height: 100vh;
        height: 100dvh;
        padding: 25px 20px;
        background: #151a27;
        border-right: 1px solid rgba(255,255,255,.09);
        z-index: 10001;
        transform: translateX(-105%);
        transition: transform .3s ease;
        overflow-y: auto;
        color: #f4f6fc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-sizing: border-box;
        visibility: hidden;
      }

      #fkg-sidebar.open {
        transform: translateX(0);
        visibility: visible;
      }

      #fkg-sidebar * {
        box-sizing: border-box;
      }

      .fkg-sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 25px;
        border-bottom: 1px solid rgba(255,255,255,.09);
      }

      .fkg-sidebar-logo {
        color: white;
        font-size: 19px;
        font-weight: 800;
      }

      .fkg-sidebar-logo span {
        color: #6598ff;
      }

      .fkg-close-menu {
        width: 38px;
        height: 38px;
        border: 1px solid rgba(255,255,255,.09);
        border-radius: 9px;
        background: #191e2b;
        color: white;
        font-size: 23px;
        cursor: pointer;
      }

      .fkg-sidebar-section {
        margin-top: 30px;
      }

      .fkg-sidebar-heading {
        color: #6598ff;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        margin-bottom: 14px;
        padding-left: 10px;
      }

      .fkg-project-toggle {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 13px;
        border: 1px solid transparent;
        border-radius: 9px;
        background: transparent;
        color: #f4f6fc;
        font: inherit;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
      }

      .fkg-project-toggle:hover {
        background: #222a3b;
      }

      .fkg-project-toggle .arrow {
        color: #a0a9bd;
        transition: transform .25s;
      }

      .fkg-project-toggle.expanded .arrow {
        transform: rotate(90deg);
      }

      .fkg-submenu {
        display: none;
        padding: 5px 0 5px 17px;
      }

      .fkg-submenu.open {
        display: block;
      }

      .fkg-submenu a {
        display: block;
        padding: 10px 12px;
        margin: 3px 0;
        color: #a0a9bd;
        text-decoration: none;
        font-size: 13px;
        border-radius: 8px;
        transition: color .2s, background .2s;
      }

      .fkg-submenu a:hover,
      .fkg-submenu a.active {
        color: white;
        background: #222a3b;
      }

      .fkg-submenu a.active {
        color: #8eb3ff;
        background: rgba(101,152,255,.12);
      }

      .fkg-submenu a::before {
        content: "↳";
        margin-right: 9px;
        color: #6598ff;
      }

      #fkg-menu-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.55);
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: opacity .3s, visibility .3s;
      }

      #fkg-menu-overlay.open {
        opacity: 1;
        visibility: visible;
      }

      body.fkg-menu-open {
        overflow: hidden;
      }
    `;

    document.head.appendChild(style);

    const sidebar = document.createElement("aside");
    sidebar.id = "fkg-sidebar";
    sidebar.setAttribute("aria-label", "Hauptmenü");

    const overlay = document.createElement("div");
    overlay.id = "fkg-menu-overlay";

    const currentPath = normalizePath(location.pathname);

    let menuHTML = `
      <div class="fkg-sidebar-header">
        <a href="/" class="fkg-sidebar-logo" style="text-decoration:none">
          FKG<span>.</span>STUDENTS
        </a>
        <button class="fkg-close-menu" type="button"
                aria-label="Menü schließen">×</button>
      </div>
    `;

    navigation.forEach((section, sectionIndex) => {
      menuHTML += `
        <div class="fkg-sidebar-section">
          <div class="fkg-sidebar-heading">${section.title}</div>
      `;

      section.items.forEach((item, itemIndex) => {
        const submenuId = `fkg-submenu-${sectionIndex}-${itemIndex}`;

        const hasActiveChild = item.children.some(
          child => normalizePath(child.url) === currentPath
        );

        menuHTML += `
          <button class="fkg-project-toggle ${hasActiveChild ? "expanded" : ""}"
                  type="button"
                  aria-expanded="${hasActiveChild}"
                  aria-controls="${submenuId}"
                  data-submenu="${submenuId}">
            <span>${item.label}</span>
            <span class="arrow">›</span>
          </button>

          <div class="fkg-submenu ${hasActiveChild ? "open" : ""}"
               id="${submenuId}">
        `;

        item.children.forEach(child => {
          const isActive = normalizePath(child.url) === currentPath;

          menuHTML += `
            <a href="${child.url}"
               class="${isActive ? "active" : ""}"
               ${isActive ? 'aria-current="page"' : ""}>
              ${child.label}
            </a>
          `;
        });

        menuHTML += `</div>`;
      });

      menuHTML += `</div>`;
    });

    sidebar.innerHTML = menuHTML;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

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

    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-controls", "fkg-sidebar");
      menuButton.type = "button";

      menuButton.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    sidebar.querySelector(".fkg-close-menu")
      .addEventListener("click", closeMenu);

    overlay.addEventListener("click", closeMenu);

    sidebar.querySelectorAll(".fkg-project-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const submenu = document.getElementById(button.dataset.submenu);
        const isOpen = submenu.classList.toggle("open");

        button.classList.toggle("expanded", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
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

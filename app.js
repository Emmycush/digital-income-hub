/* Digital Income Hub: category data is deliberately separate so new categories can be added later. */
const categories = [
  { id: "ai-tools", icon: "✦", title: "AI tools & software", description: "Explore image, writing, design, productivity, and business tools.", countLabel: "Guides coming soon", href: "#updates" },
  { id: "affiliate", icon: "↗", title: "Affiliate programs", description: "Learn how commissions, tracking, approval, and referrals work.", countLabel: "Guides coming soon", href: "affiliate-disclosure.html" },
  { id: "tasks", icon: "▤", title: "Task & reward platforms", description: "Research microtasks, reward activities, and platform requirements.", countLabel: "3 introductory guides", href: "#featured" },
  { id: "telegram-bots", icon: "➤", title: "Telegram bots", description: "Review useful bots carefully, including task bots and reward bots.", countLabel: "Verification required", href: "#how-it-works" },
  { id: "surveys", icon: "☷", title: "Survey sites", description: "Compare survey availability, screening, eligibility, and withdrawals.", countLabel: "Guides coming soon", href: "#updates" },
  { id: "freelancing", icon: "⌘", title: "Freelancing & Client Work", description: "Explore freelance marketplaces, service listings, client work, fees, and payment requirements.", countLabel: "2 introductory guides", href: "#featured" },
  { id: "tutorials", icon: "▣", title: "Tutorials & comparisons", description: "Step-by-step walkthroughs, platform comparisons, and beginner guides.", countLabel: "Browse current guides", href: "#featured" }
];

const categoryGrid = document.querySelector("#category-grid");
if (categoryGrid) {
  categoryGrid.innerHTML = categories.map(category => `
    <a class="category-card" id="category-${escapeHTML(category.id)}"
       href="${escapeHTML(category.href)}"
       aria-label="${escapeHTML(category.title)}: ${escapeHTML(category.countLabel)}">
      <span class="category-icon" aria-hidden="true">${escapeHTML(category.icon)}</span>
      <div>
        <h3>${escapeHTML(category.title)}</h3>
        <p>${escapeHTML(category.description)}</p>
        <span class="category-meta">${escapeHTML(category.countLabel)} →</span>
      </div>
    </a>
  `).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  primaryNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());


/* Digital Income Hub: local Opportunity Finder */
(() => {
  const search = document.querySelector("#opportunity-search");
  const filter = document.querySelector("#opportunity-filter");
  const reset = document.querySelector("#opportunity-reset");
  const results = document.querySelector("#opportunity-results");
  const count = document.querySelector("#opportunity-count");
  const empty = document.querySelector("#opportunity-empty");

  if (!search || !filter || !reset || !results || !count || !empty) return;

  const cards = Array.from(
    results.querySelectorAll("[data-opportunity-type]")
  );

  function updateResults() {
    const term = search.value.trim().toLowerCase();
    const selectedType = filter.value;
    let visible = 0;

    cards.forEach(card => {
      const matchesText = card.textContent.toLowerCase().includes(term);
      const matchesType =
        selectedType === "all" ||
        card.dataset.opportunityType === selectedType;
      const show = matchesText && matchesType;

      card.hidden = !show;
      if (show) visible++;
    });

    count.textContent = String(visible);
    empty.hidden = visible !== 0;
    results.hidden = visible === 0;
  }

  search.addEventListener("input", updateResults);
  filter.addEventListener("change", updateResults);

  reset.addEventListener("click", () => {
    search.value = "";
    filter.value = "all";
    updateResults();
    search.focus();
  });

  updateResults();
})();


/* Digital Income Hub: comparison centre */
(() => {
  const filter = document.querySelector("#comparison-filter");
  const rowsContainer = document.querySelector("#comparison-rows");
  const count = document.querySelector("#comparison-count");

  if (!filter || !rowsContainer || !count) return;

  const rows = Array.from(rowsContainer.querySelectorAll("[data-compare-type]"));

  function updateComparison() {
    const selected = filter.value;
    let visible = 0;

    rows.forEach(row => {
      const show = selected === "all" || row.dataset.compareType === selected;
      row.hidden = !show;
      if (show) visible++;
    });

    count.textContent = `Showing ${visible} platform${visible === 1 ? "" : "s"}`;
  }

  filter.addEventListener("change", updateComparison);
  updateComparison();
})();



/* Responsive dashboard menu */
(() => {
  const toggle = document.getElementById("dashboard-toggle");
  const sidebar = document.getElementById("dashboard-sidebar");
  if (!toggle || !sidebar) return;

  function closeMenu() {
    sidebar.classList.remove("dashboard-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const open = !sidebar.classList.contains("dashboard-open");
    sidebar.classList.toggle("dashboard-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) closeMenu();
  });
})();



/* DIH_SAVED_OPPORTUNITIES_V1: browser-local bookmarks */
(() => {
  const storageKey = "digitalIncomeHub.savedOpportunities.v1";
  const cardsContainer = document.getElementById("opportunity-results");
  const savedContainer = document.getElementById("saved-opportunities-list");
  const savedCount = document.getElementById("saved-nav-count");

  if (!cardsContainer || !savedContainer) return;

  function readSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(value)
        ? value.filter(item =>
            item &&
            typeof item.title === "string" &&
            typeof item.href === "string"
          )
        : [];
    } catch {
      return [];
    }
  }

  function writeSaved(items) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      return true;
    } catch {
      savedContainer.textContent =
        "Your browser could not save this list. Check browser storage settings.";
      return false;
    }
  }

  function renderSaved() {
    const items = readSaved();
    if (savedCount) savedCount.textContent = String(items.length);

    savedContainer.replaceChildren();

    if (!items.length) {
      const message = document.createElement("p");
      message.className = "saved-empty";
      message.textContent =
        "No saved opportunities yet. Use the Save opportunity buttons on guides you want to revisit.";
      savedContainer.appendChild(message);
      return;
    }

    items.forEach(item => {
      const row = document.createElement("article");
      row.className = "saved-opportunity-item";

      const details = document.createElement("div");
      details.className = "saved-opportunity-details";

      const title = document.createElement("h3");
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.title;
      title.appendChild(link);

      const type = document.createElement("p");
      type.textContent = item.type || "Opportunity guide";

      details.append(title, type);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "saved-remove";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", "Remove " + item.title + " from saved opportunities");
      remove.addEventListener("click", () => {
        const remaining = readSaved().filter(saved => saved.id !== item.id);
        if (writeSaved(remaining)) {
          updateSaveButtons();
          renderSaved();
        }
      });

      row.append(details, remove);
      savedContainer.appendChild(row);
    });
  }

  function updateSaveButtons() {
    const savedIds = new Set(readSaved().map(item => item.id));

    cardsContainer.querySelectorAll("[data-opportunity-type]").forEach(card => {
      const heading = card.querySelector("h3");
      const guideLink = card.querySelector(".provider-link");
      if (!heading || !guideLink) return;

      const id = guideLink.getAttribute("href");
      if (!id) return;

      let button = card.querySelector(".save-opportunity-button");
      if (!button) {
        button = document.createElement("button");
        button.type = "button";
        button.className = "save-opportunity-button";
        guideLink.insertAdjacentElement("beforebegin", button);
      }

      const isSaved = savedIds.has(id);
      button.textContent = isSaved ? "✓ Saved — remove" : "+ Save opportunity";
      button.setAttribute("aria-pressed", String(isSaved));
      button.setAttribute(
        "aria-label",
        (isSaved ? "Remove " : "Save ") + heading.textContent.trim()
      );

      button.onclick = () => {
        const current = readSaved();
        const existing = current.some(item => item.id === id);

        const next = existing
          ? current.filter(item => item.id !== id)
          : [...current, {
              id,
              title: heading.textContent.trim(),
              href: id,
              type: card.querySelector(".provider-type")?.textContent.trim() || "Opportunity guide"
            }];

        if (writeSaved(next)) {
          updateSaveButtons();
          renderSaved();
        }
      };
    });
  }

  updateSaveButtons();
  renderSaved();
})();



/* DIH_EARNINGS_TRACKER_V1: manually entered, browser-local records */
(() => {
  const storageKey = "digitalIncomeHub.earnings.v1";
  const form = document.getElementById("earnings-form");
  const platformInput = document.getElementById("earnings-platform");
  const amountInput = document.getElementById("earnings-amount");
  const currencyInput = document.getElementById("earnings-currency");
  const dateInput = document.getElementById("earnings-date");
  const noteInput = document.getElementById("earnings-note");
  const message = document.getElementById("earnings-form-message");
  const totals = document.getElementById("earnings-totals");
  const recordsContainer = document.getElementById("earnings-records");
  const recordCount = document.getElementById("earnings-record-count");

  if (!form || !totals || !recordsContainer) return;

  const today = new Date();
  dateInput.value = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  function readRecords() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(data) ? data.filter(item =>
        item &&
        typeof item.id === "string" &&
        typeof item.platform === "string" &&
        typeof item.currency === "string" &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        typeof item.date === "string"
      ) : [];
    } catch {
      return [];
    }
  }

  function writeRecords(records) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(records));
      return true;
    } catch {
      message.textContent =
        "Could not save records in this browser. Check your browser storage settings.";
      return false;
    }
  }

  function makeText(tag, className, value) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  }

  function formatAmount(amount, currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency
      }).format(amount);
    } catch {
      return currency + " " + amount.toFixed(2);
    }
  }

  function render() {
    const records = readRecords();
    const totalsByCurrency = new Map();

    records.forEach(record => {
      totalsByCurrency.set(
        record.currency,
        (totalsByCurrency.get(record.currency) || 0) + record.amount
      );
    });

    totals.replaceChildren();
    if (totalsByCurrency.size === 0) {
      totals.appendChild(makeText("p", "earnings-empty", "No totals to show yet."));
    } else {
      [...totalsByCurrency.entries()].sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([currency, amount]) => {
          const tile = document.createElement("div");
          tile.className = "earnings-total-tile";
          tile.append(
            makeText("span", "earnings-total-currency", currency),
            makeText("strong", "earnings-total-amount", formatAmount(amount, currency))
          );
          totals.appendChild(tile);
        });
    }

    recordCount.textContent =
      records.length + (records.length === 1 ? " record" : " records");
    recordsContainer.replaceChildren();

    if (!records.length) {
      recordsContainer.appendChild(
        makeText("p", "earnings-empty", "No records yet. Add your first entry above.")
      );
      return;
    }

    records.slice().sort((a, b) =>
      b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
    ).forEach(record => {
      const row = document.createElement("article");
      row.className = "earnings-record";

      const details = document.createElement("div");
      details.className = "earnings-record-details";
      details.append(
        makeText("h4", "", record.platform),
        makeText(
          "p",
          "earnings-record-meta",
          record.date + " · " + record.currency
        )
      );

      if (record.note) {
        details.appendChild(makeText("p", "earnings-record-note", record.note));
      }

      const actions = document.createElement("div");
      actions.className = "earnings-record-actions";
      actions.appendChild(
        makeText("strong", "earnings-record-amount",
          formatAmount(record.amount, record.currency))
      );

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "earnings-remove";
      remove.textContent = "Delete";
      remove.setAttribute("aria-label", "Delete record for " + record.platform);
      remove.addEventListener("click", () => {
        if (writeRecords(readRecords().filter(item => item.id !== record.id))) {
          message.textContent = "Record deleted.";
          render();
        }
      });

      actions.appendChild(remove);
      row.append(details, actions);
      recordsContainer.appendChild(row);
    });
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const amount = Number(amountInput.value);
    const platform = platformInput.value;
    const currency = currencyInput.value;
    const date = dateInput.value;

    if (!platform || !currency || !date || !Number.isFinite(amount) || amount <= 0) {
      message.textContent = "Enter a platform, valid positive amount, currency and date.";
      return;
    }

    const record = {
      id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8),
      platform,
      amount: Math.round((amount + Number.EPSILON) * 100) / 100,
      currency,
      date,
      note: noteInput.value.trim()
    };

    const records = readRecords();
    records.push(record);

    if (writeRecords(records)) {
      form.reset();
      currencyInput.value = "NGN";
      const now = new Date();
      dateInput.value = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
      ].join("-");
      message.textContent = "Record added. This entry has not been independently verified.";
      render();
    }
  });

  render();
})();


/* DIH_SCAM_SAFETY_V1: local-only URL structure assessment */
(() => {
  const form = document.getElementById("dih-url-form");
  const field = document.getElementById("dih-url-input");
  const result = document.getElementById("dih-url-result");
  if (!form || !field || !result) return;

  const knownBrands = [
    "paypal.com", "google.com", "microsoft.com", "apple.com",
    "amazon.com", "facebook.com", "instagram.com", "whatsapp.com",
    "binance.com", "coinbase.com", "upwork.com", "fiverr.com"
  ];

  function normalizeLabel(label) {
    return label.normalize("NFKC").toLowerCase()
      .replace(/0/g, "o")
      .replace(/1/g, "l");
  }

  function inspect(raw) {
    const warnings = [];
    const value = raw.trim();

    if (!value) throw new Error("Enter a URL to inspect.");
    if (/[\u0000-\u0020\u007f]/.test(value)) {
      throw new Error("The URL contains spaces or control characters. Check the link and try again.");
    }
    if (!/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value) &&
        !value.startsWith("//")) {
      throw new Error("Include the URL scheme, such as https://, so the address can be assessed consistently.");
    }

    let url;
    try {
      url = new URL(value.startsWith("//") ? "https:" + value : value);
    } catch {
      throw new Error("This does not look like a valid URL. Check the spelling and try again.");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Only HTTP and HTTPS web links can be assessed.");
    }
    if (!url.hostname || url.username || url.password) {
      throw new Error("The URL has no usable hostname or contains embedded credentials. Do not open it.");
    }

    const host = url.hostname.toLowerCase();
    const displayHost = host;
    const asciiHost = host;
    const labels = host.split(".");
    const brandMatches = [];

    if (url.protocol !== "https:") {
      warnings.push("This URL uses HTTP rather than HTTPS. Its connection is not protected by HTTPS.");
    }

    if (asciiHost.includes("xn--")) {
      warnings.push("The hostname contains punycode. Check carefully for international-character lookalikes.");
    }

    if (/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/.test(value)) {
      warnings.push("The URL contains invisible or direction-control characters.");
    }

    if (host.includes("%") || host.includes("\\")) {
      warnings.push("The hostname contains unusual encoded or escaped characters.");
    }

    if (url.port && !["80", "443"].includes(url.port)) {
      warnings.push("The URL uses a non-standard web port. Confirm why it is needed.");
    }

    if (labels.length > 5) {
      warnings.push("The hostname has many subdomain levels. Make sure you identify the actual registered domain.");
    }

    if (host.length > 60) {
      warnings.push("The hostname is unusually long. Inspect it carefully for misleading wording.");
    }

    if (host.split("").some(ch => ch.charCodeAt(0) > 127)) {
      warnings.push("The hostname contains non-ASCII characters, which can be used in lookalike domains.");
    }

    const allLabels = labels.slice(0, -1);
    const normalizedHost = allLabels.map(normalizeLabel).join(".") +
      (labels.length > 1 ? "." + labels[labels.length - 1] : "");

    for (const brand of knownBrands) {
      const brandName = brand.split(".")[0];
      const brandDomain = brand;
      const hasBrandText = labels.some(label =>
        normalizeLabel(label).includes(brandName)
      );
      const isExactOrSubdomain = host === brandDomain ||
        host.endsWith("." + brandDomain);

      if (hasBrandText && !isExactOrSubdomain) {
        brandMatches.push(brand);
      }
    }

    if (brandMatches.length) {
      warnings.push("Possible brand impersonation: the hostname resembles " +
        [...new Set(brandMatches)].join(", ") +
        " but is not that brand's exact domain or a subdomain of it.");
    }

    if (/@/.test(value)) {
      warnings.push("The URL contains an @ symbol. Confirm the actual hostname shown by the browser.");
    }

    if (/(login|verify|wallet|airdrop|claim|bonus|prize|free-money|urgent|secure-account)/i.test(url.pathname + url.search)) {
      warnings.push("The path or query contains terms sometimes used in credential theft or misleading reward links. This alone does not prove fraud.");
    }

    if (url.search.length > 180) {
      warnings.push("The URL has a long query string. Avoid sharing it if it contains private tokens or account information.");
    }

    return { host: displayHost, warnings };
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    result.replaceChildren();
    result.hidden = false;

    let assessment;
    try {
      assessment = inspect(field.value);
    } catch (error) {
      const heading = document.createElement("h3");
      heading.textContent = "Unable to assess this URL";
      const message = document.createElement("p");
      message.textContent = error.message;
      result.append(heading, message);
      result.className = "scam-result scam-result-warning";
      return;
    }

    const heading = document.createElement("h3");
    heading.textContent = assessment.warnings.length
      ? "Caution: suspicious patterns found"
      : "No listed structural warning detected";

    const host = document.createElement("p");
    host.textContent = "Hostname assessed: " + assessment.host;

    const summary = document.createElement("p");
    summary.textContent = assessment.warnings.length
      ? "Review the warnings below before deciding what to do."
      : "This limited check did not detect the patterns it looks for. The website may still be malicious or fraudulent.";

    const list = document.createElement("ul");
    if (assessment.warnings.length) {
      for (const warning of assessment.warnings) {
        const item = document.createElement("li");
        item.textContent = warning;
        list.appendChild(item);
      }
    } else {
      const item = document.createElement("li");
      item.textContent = "No configured structural warning was detected in this check.";
      list.appendChild(item);
    }

    const limitation = document.createElement("p");
    limitation.textContent = "This result is not a verdict. No live reputation, ownership, content or redirect checks were performed. Do not enter credentials or payment details on a site you do not trust.";

    result.append(heading, host, summary, list, limitation);
    result.className = assessment.warnings.length
      ? "scam-result scam-result-warning"
      : "scam-result scam-result-neutral";
  });
})();


/* DIH_GOAL_FINDER_V1 */
(() => {
  const choice = document.getElementById("goal-choice");
  const button = document.getElementById("goal-find-button");
  const results = document.getElementById("goal-results");
  if (!choice || !button || !results) return;

  const guides = {
    freecash: {
      name: "Freecash",
      url: "./guides/freecash.html",
      type: "Tasks and rewards",
      description: "Explore surveys, game offers and promotions. Check each offer's rules and regional availability."
    },
    paidwork: {
      name: "Paidwork",
      url: "./guides/paidwork.html",
      type: "Online tasks",
      description: "Review available tasks, eligibility, verification requirements and withdrawal conditions."
    },
    /* DIH_ANOWORKS_TELEGRAM_V1 */
    anoworks: {
      name: "Anoworks",
      url: "./guides/anoworks.html",
      type: "Online tasks",
      description: "Check task rules, country eligibility, verification and withdrawal conditions."
    },
    telegram: {
      name: "Telegram Mini-Apps",
      url: "./guides/telegram-mini-apps.html",
      type: "Telegram mini-apps",
      description: "Review invitation-based mini-apps cautiously; rewards and payouts are unverified."
    },
    /* DIH_FIREFAUCET_GOAL_V1 */
    firefaucet: {
      name: "Fire Faucet",
      url: "./guides/firefaucet.html",
      type: "Faucet and crypto rewards",
      description: "Check current availability, reward conditions, withdrawal options, fees and wallet safety."
    },
    viefaucet: {
      name: "VieFaucet",
      url: "./guides/viefaucet.html",
      type: "Crypto rewards",
      description: "Review current availability, withdrawal rules, network fees and wallet safety before participating."
    },
    upwork: {
      name: "Upwork",
      url: "./guides/upwork.html",
      type: "Freelancing",
      description: "Explore client projects and learn about proposals, contract terms, fees and payment options."
    },
    fiverr: {
      name: "Fiverr",
      url: "./guides/fiverr.html",
      type: "Freelancing",
      description: "Learn about service listings, seller fees, delivery requirements and withdrawal options."
    }
  };

  const recommendations = {
    beginner: ["freecash", "paidwork", "anoworks", "telegram", "firefaucet", "upwork", "fiverr"],
    tasks: ["freecash", "paidwork", "anoworks", "telegram"],
    freelance: ["upwork", "fiverr"],
    crypto: ["viefaucet", "firefaucet"]
  };

  button.addEventListener("click", () => {
    const selected = recommendations[choice.value];
    results.replaceChildren();

    if (!selected) {
      const message = document.createElement("p");
      message.textContent = "Choose a goal to see relevant guides.";
      results.append(message);
      return;
    }

    const heading = document.createElement("p");
    heading.textContent = "Suggested starting guides — compare the requirements before choosing.";
    results.append(heading);

    selected.forEach(key => {
      const guide = guides[key];
      const card = document.createElement("article");
      card.className = "goal-result-card";

      const title = document.createElement("h4");
      title.textContent = guide.name;

      const type = document.createElement("p");
      type.textContent = guide.type;

      const description = document.createElement("p");
      description.textContent = guide.description;

      const link = document.createElement("a");
      link.href = guide.url;
      link.textContent = "Read the " + guide.name + " guide";

      card.append(title, type, description, link);
      results.append(card);
    });
  });
})();


/* DIH_COUNTRY_ELIGIBILITY_V1 */
(() => {
  const countryInput = document.querySelector("#eligibility-country");
  const countryList = document.querySelector("#eligibility-country-list");
  const platformSelect = document.querySelector("#eligibility-platform");
  const checkButton = document.querySelector("#eligibility-check");
  const output = document.querySelector("#eligibility-results");

  if (!countryInput || !countryList || !platformSelect || !checkButton || !output) return;

  // ISO 3166-1 alpha-2 country/territory codes, displayed in the browser's locale.
  const codes = (
    "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW"
  ).split(" ");

  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
  const countries = [...new Set(codes)]
    .map(code => ({ code, name: displayNames.of(code) }))
    .filter(item => item.name && item.name !== item.code)
    .sort((a, b) => a.name.localeCompare(b.name));

  countryList.innerHTML = countries.map(item =>
    `<option value="${escapeHTML(item.name)}"></option>`
  ).join("");

  const platforms = Array.from(platformSelect.options)
    .filter(option => option.value && option.value !== "all")
    .map(option => option.value);

  // Add evidence-backed records here only after checking current official sources.
  // Unknown combinations intentionally remain unverified.
  const evidence = {};

  function render() {
    const typedCountry = countryInput.value.trim();
    const country = countries.find(item =>
      item.name.toLowerCase() === typedCountry.toLowerCase()
    );

    if (!country) {
      output.innerHTML = '<p class="eligibility-message">Please choose a country from the suggestions so the result matches a recognised country or territory.</p>';
      return;
    }

    const selectedPlatforms = platformSelect.value === "all"
      ? platforms
      : [platformSelect.value];

    output.innerHTML = `
      <p class="eligibility-country-heading">Results for <strong>${escapeHTML(country.name)}</strong></p>
      <div class="eligibility-result-list">
        ${selectedPlatforms.map(platform => {
          const record = evidence[`${country.code}:${platform}`];
          const status = record ? record.status : "Needs verification";
          const allowedStatuses = ["Supported", "Not supported", "Needs verification"];
          const safeStatus = allowedStatuses.includes(status) ? status : "Needs verification";
          const note = record && record.note
            ? record.note
            : "We have not yet confirmed this platform's current country rules from an official source.";
          const source = record && record.source
            ? `<a href="${escapeHTML(record.source)}" target="_blank" rel="noopener noreferrer">View official source</a>`
            : "";
          return `
            <article class="eligibility-result">
              <div>
                <h3>${escapeHTML(platform)}</h3>
                <span class="eligibility-status">${escapeHTML(safeStatus)}</span>
              </div>
              <p>${escapeHTML(note)}</p>
              ${source}
            </article>`;
        }).join("")}
      </div>
      <p class="eligibility-message">Registration eligibility does not guarantee tasks, surveys, rewards or withdrawals. Check payment methods, minimums, fees and account-specific conditions separately.</p>
    `;
  }

  checkButton.addEventListener("click", render);
  countryInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      render();
    }
  });
})();

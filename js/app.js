const sections = [
  {
    id: "hk-card",
    title: "港卡",
    icon: "💳",
    gradient: "linear-gradient(135deg, #246bfe, #0fc6a6)",
    glow: "rgba(36, 107, 254, 0.18)",
    summary: "从赴港前准备、银行选择到开卡后的日常维护，按流程梳理港卡教程。",
    groups: [
      {
        title: "前期准备&赴港流程",
        articles: [
          { slug: "materials", title: "资料准备", desc: "整理赴港开户前常见资料、备份方式与临行前核对清单。" },
          { slug: "travel-prep", title: "出行准备", desc: "把交通、通信、住宿和预约事项合并成一份出行前检查表。" },
          { slug: "hk-process", title: "赴港流程", desc: "按抵港、办理、补充资料和返程后的跟进顺序梳理完整流程。" }
        ]
      },
      {
        title: "推荐银行",
        articles: [
          { slug: "hsbc", title: "汇丰", desc: "记录汇丰开户前需要确认的账户类型、材料和后续使用要点。" },
          { slug: "za-bank", title: "众安", desc: "梳理众安银行开户路径、身份验证和日常使用注意事项。" },
          { slug: "hang-seng", title: "恒生", desc: "汇总恒生银行开户前后的确认项，便于和其他银行横向比较。" },
          { slug: "cncbi", title: "中信国际", desc: "整理中信国际账户办理、跨境使用和维护时建议关注的事项。" }
        ]
      },
      {
        title: "开卡后的注意事项",
        articles: [
          { slug: "after-card", title: "注意事项", desc: "开卡后围绕安全、账户活跃、限额和资料更新建立长期维护清单。" }
        ]
      }
    ]
  },
  {
    id: "broker",
    title: "券商",
    icon: "📈",
    gradient: "linear-gradient(135deg, #7c3aed, #246bfe)",
    glow: "rgba(124, 58, 237, 0.16)",
    flat: true,
    summary: "券商板块只保留一级菜单，逐篇记录开户、入金、换汇和交易前检查事项。",
    groups: [
      { slug: "fosun", title: "复星", desc: "以新手视角整理复星开户、账户安全和入金前确认事项。" },
      { slug: "yl-hk", title: "盈立香港", desc: "汇总盈立香港开户资料、资金路径与使用前检查清单。" },
      { slug: "yl-sg", title: "盈立新加坡", desc: "整理盈立新加坡账户准备、币种处理和后续维护思路。" },
      { slug: "chief", title: "致富", desc: "记录致富证券开户和交易前需要重点核对的信息。" }
    ]
  },
  {
    id: "remit",
    title: "跨境汇款",
    icon: "🌏",
    gradient: "linear-gradient(135deg, #0fc6a6, #14b8a6)",
    glow: "rgba(15, 198, 166, 0.18)",
    summary: "围绕跨境支付通与电汇，按银行拆分汇款前准备、费用时效和到账跟进。",
    groups: [
      {
        title: "跨境支付通",
        articles: [
          { slug: "cross-border-payment-connect", title: "跨境支付通", desc: "说明跨境支付通适用场景、操作前检查和到账后的核对步骤。" }
        ]
      },
      {
        title: "电汇",
        articles: [
          { slug: "cib", title: "兴业银行", desc: "整理通过兴业银行办理跨境电汇时可记录的字段和检查项。" },
          { slug: "ccb", title: "建设银行", desc: "整理建设银行电汇前的资料准备、费用核对和回单留存。" },
          { slug: "boc", title: "中国银行", desc: "整理中国银行跨境电汇流程中的常见字段与核对清单。" },
          { slug: "cmb", title: "招商银行", desc: "整理招商银行电汇操作前后建议关注的限额、费用和时效。" },
          { slug: "icbc", title: "工商银行", desc: "整理工商银行跨境电汇的准备清单、提交后跟进和问题排查。" }
        ]
      }
    ]
  }
];

sections.forEach((section) => {
  const articles = section.flat
    ? section.groups
    : section.groups.flatMap((group) => group.articles);
  articles.forEach((article) => {
    article.file = article.file || `articles/${section.id}/${article.slug}.html`;
  });
});

const app = document.querySelector("#app");
const navMenu = document.querySelector("#nav-menu");
const navToggle = document.querySelector(".nav__toggle");
const searchInput = document.querySelector("#site-search");
const searchResults = document.querySelector("#search-results");
const mobileNavQuery = window.matchMedia("(max-width: 860px)");

let currentRoute = null;
let cleanupActiveToc = null;
const sidebarScrollTopBySection = new Map();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function articleHref(sectionId, slug) {
  return `#${sectionId}/${slug}`;
}

function flattenSection(section) {
  if (section.flat) {
    return section.groups.map((article, index) => ({
      ...article,
      parentTitle: article.title,
      sectionId: section.id,
      sectionTitle: section.title,
      index
    }));
  }

  return section.groups.flatMap((group) =>
    group.articles.map((article) => ({
      ...article,
      parentTitle: group.title,
      sectionId: section.id,
      sectionTitle: section.title
    }))
  ).map((article, index) => ({ ...article, index }));
}

function allArticles() {
  return sections.flatMap((section) => flattenSection(section));
}

function firstArticle(section) {
  return flattenSection(section)[0];
}

function firstHref(section) {
  const article = firstArticle(section);
  return article ? articleHref(section.id, article.slug) : "#home";
}

function findSection(id) {
  return sections.find((section) => section.id === id);
}

function findArticle(section, slug) {
  return flattenSection(section).find((article) => article.slug === slug);
}

function parseRoute() {
  const rawHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));

  if (!rawHash || rawHash === "home") {
    return { page: "home" };
  }

  const [sectionId, articleSlug] = rawHash.split("/");
  const section = findSection(sectionId);

  if (!section) {
    return { page: "missing" };
  }

  const article = articleSlug ? findArticle(section, articleSlug) : firstArticle(section);

  if (!article) {
    return { page: "missing" };
  }

  if (!articleSlug) {
    window.history.replaceState(null, "", firstHref(section));
  }

  return { page: "article", section, article };
}

function renderDropdowns() {
  sections.forEach((section) => {
    const panel = document.querySelector(`.nav__dropdown[data-section="${section.id}"] .dropdown-panel`);
    if (!panel) return;

    const items = section.flat
      ? section.groups.map((article) => ({ title: article.title, href: articleHref(section.id, article.slug) }))
      : section.groups.map((group) => ({ title: group.title, href: articleHref(section.id, group.articles[0].slug) }));

    const mobileItems = flattenSection(section).map((article) => ({
      title: article.title,
      path: section.flat ? section.title : article.parentTitle,
      href: articleHref(section.id, article.slug)
    }));

    panel.innerHTML = `
      <div class="dropdown-list dropdown-list--desktop">
        ${items.map((item) => `<a href="${item.href}">${escapeHtml(item.title)}</a>`).join("")}
      </div>
      <div class="dropdown-list dropdown-list--mobile">
        ${mobileItems.map((item) => `
          <a href="${item.href}">
            <span>${escapeHtml(item.title)}</span>
            <small>${escapeHtml(item.path)}</small>
          </a>
        `).join("")}
      </div>
    `;
  });
}

function renderHome() {
  document.title = "小白说卡｜大陆人的美股导航";

  const cards = sections.map((section) => {
    const tags = section.flat ? section.groups : section.groups;
    return `
      <a class="home-card" href="${firstHref(section)}" style="--card-gradient: ${section.gradient}; --card-glow: ${section.glow};">
        <span class="home-card__icon" aria-hidden="true">${section.icon}</span>
        <h3>${escapeHtml(section.title)}</h3>
        <p>${escapeHtml(section.summary)}</p>
        <ul class="home-card__list">
          ${tags.map((item) => `<li>${escapeHtml(item.title)}</li>`).join("")}
        </ul>
        <span class="home-card__cta">点击进入 <span aria-hidden="true">→</span></span>
      </a>
    `;
  }).join("");

  app.innerHTML = `
    <section class="home" aria-labelledby="home-title">
      <div class="home-heading">
        <h1 id="home-title">小白<span>说卡</span></h1>
        <p class="home-heading__subtitle">大陆人的美股导航</p>
        <p class="home-heading__desc">港卡、券商、跨境汇款，一站式整理给新手看的美股入门教程。</p>
      </div>

      <div class="cards" aria-label="网站板块">
        ${cards}
      </div>
    </section>
  `;
}

function renderMenu(section, currentSlug) {
  if (section.flat) {
    return `
      <div class="menu">
        ${section.groups.map((article) => `
          <a class="menu__leaf ${article.slug === currentSlug ? "is-active" : ""}" href="${articleHref(section.id, article.slug)}">
            ${escapeHtml(article.title)}
          </a>
        `).join("")}
      </div>
    `;
  }

  return `
    <div class="menu">
      ${section.groups.map((group) => {
        const activeGroup = group.articles.some((article) => article.slug === currentSlug);
        return `
          <div class="menu__group">
            <a class="menu__parent ${activeGroup ? "is-current" : ""}" href="${articleHref(section.id, group.articles[0].slug)}">
              ${escapeHtml(group.title)}
            </a>
            <div class="menu__children">
              ${group.articles.map((article) => `
                <a class="menu__child ${article.slug === currentSlug ? "is-active" : ""}" href="${articleHref(section.id, article.slug)}">
                  ${escapeHtml(article.title)}
                </a>
              `).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderMobileJump(section, currentSlug) {
  const options = flattenSection(section).map((article) => `
    <option value="${articleHref(section.id, article.slug)}" ${article.slug === currentSlug ? "selected" : ""}>
      ${escapeHtml(section.flat ? article.title : `${article.parentTitle} / ${article.title}`)}
    </option>
  `).join("");

  return `
    <div class="mobile-section-jump">
      <label for="mobile-jump">选择文章</label>
      <select id="mobile-jump">${options}</select>
    </div>
  `;
}

function renderArticleSkeleton(route) {
  const { section, article } = route;
  const articles = flattenSection(section);
  const index = articles.findIndex((item) => item.slug === article.slug);
  const nextArticle = articles[index + 1];
  const prevArticle = articles[index - 1];
  const bottomLinks = nextArticle
    ? [{ label: "下一篇", article: nextArticle }]
    : prevArticle
      ? [{ label: "上一篇", article: prevArticle }]
      : [];

  document.title = `${article.title}｜${section.title}｜小白说卡`;

  app.innerHTML = `
    <div class="article-shell">
      <aside class="sidebar" aria-label="${escapeHtml(section.title)}目录">
        <div class="sidebar__inner">
          ${renderMenu(section, article.slug)}
        </div>
      </aside>

      <article class="article-card">
        ${renderMobileJump(section, article.slug)}
        <header class="article-hero">
          <nav class="breadcrumb" aria-label="面包屑">
            <a href="#home">主页</a>
            <span>/</span>
            <a href="${firstHref(section)}">${escapeHtml(section.title)}</a>
            ${section.flat ? "" : `<span>/</span><span>${escapeHtml(article.parentTitle)}</span>`}
          </nav>
          <h1>${escapeHtml(article.title)}</h1>
          <p class="article-hero__desc">${escapeHtml(article.desc)}</p>
        </header>

        <div class="article-body">
          <div class="article-loading">正在加载文章内容……</div>
          <nav class="article-nav ${bottomLinks.length === 1 ? "article-nav--single" : ""}" aria-label="文章翻页">
            ${bottomLinks.map((item) => `
              <a class="article-nav__link" href="${articleHref(section.id, item.article.slug)}">
                <span class="article-nav__label">${escapeHtml(item.label)}</span>
                <span class="article-nav__title">${escapeHtml(item.article.title)} →</span>
              </a>
            `).join("")}
          </nav>
        </div>
      </article>

      <aside class="toc" aria-label="当前文章目录">
        <div class="toc__inner">
          <ul class="toc__list"></ul>
        </div>
      </aside>
    </div>
  `;

  const savedTop = sidebarScrollTopBySection.get(section.id);
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && typeof savedTop === "number") {
    sidebar.scrollTop = savedTop;
  }

  const mobileJump = document.querySelector("#mobile-jump");
  if (mobileJump) {
    mobileJump.addEventListener("change", (event) => {
      saveSidebarScroll();
      window.location.hash = event.target.value;
    });
  }
}

async function loadArticleContent(route) {
  const { article } = route;
  const container = document.querySelector(".article-loading");
  if (!container) return;

  try {
    const response = await fetch(article.file, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();
    container.outerHTML = html;
    renderTocFromArticle();
  } catch (error) {
    container.outerHTML = `
      <div class="warn">
        <p><strong>文章文件加载失败：</strong>${escapeHtml(article.file)}</p>
        <p>请确认本地通过静态服务器预览，或检查该文件是否存在。错误信息：${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

function renderTocFromArticle() {
  cleanupActiveToc?.();
  cleanupActiveToc = null;

  const headings = [...document.querySelectorAll(".article-body h2, .article-body h3")];
  const tocList = document.querySelector(".toc__list");
  if (!tocList) return;

  if (!headings.length) {
    tocList.innerHTML = `<li class="toc__empty">暂无目录</li>`;
    return;
  }

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `article-heading-${index + 1}`;
    }
  });

  tocList.innerHTML = headings.map((heading) => `
    <li>
      <a href="${window.location.hash || "#home"}" data-scroll-target="${heading.id}" class="${heading.tagName === "H3" ? "toc__sub" : ""}">
        ${escapeHtml(heading.textContent.trim())}
      </a>
    </li>
  `).join("");

  let rafId = 0;
  let activeId = "";

  const setActiveToc = () => {
    const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 64;
    const threshold = headerHeight + 18;
    let activeHeading = headings[0];

    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= threshold) {
        activeHeading = heading;
      } else {
        break;
      }
    }

    if (!activeHeading) return;

    const nextActiveId = activeHeading.id;
    if (nextActiveId === activeId) return;
    activeId = nextActiveId;

    tocList.querySelectorAll("a").forEach((link) => {
      link.classList.toggle("is-current", link.dataset.scrollTarget === activeId);
    });

    const activeLink = tocList.querySelector(`[data-scroll-target="${activeId}"]`);
    activeLink?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const requestUpdate = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(setActiveToc);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  requestUpdate();

  cleanupActiveToc = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", requestUpdate);
  };
}

async function renderArticle(route) {
  renderArticleSkeleton(route);
  await loadArticleContent(route);
}

function renderMissing() {
  document.title = "页面未找到｜小白说卡";
  app.innerHTML = `
    <section class="empty-state">
      <div class="empty-state__box">
        <h1>页面未找到</h1>
        <p>当前链接没有对应的教程。你可以回到主页，或从导航栏重新选择港卡、券商、跨境汇款。</p>
        <a class="btn btn--primary" href="#home">回到主页</a>
      </div>
    </section>
  `;
}

function updateActiveNav(route) {
  document.querySelectorAll("[data-nav]").forEach((item) => {
    item.classList.remove("is-active");
  });

  const active = route.page === "article" ? route.section.id : "home";
  document.querySelector(`[data-nav="${active}"]`)?.classList.add("is-active");
}

function saveSidebarScroll() {
  if (currentRoute?.page !== "article") return;
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebarScrollTopBySection.set(currentRoute.section.id, sidebar.scrollTop);
  }
}

async function render() {
  saveSidebarScroll();
  cleanupActiveToc?.();
  cleanupActiveToc = null;
  const route = parseRoute();
  currentRoute = route;

  if (route.page === "home") {
    renderHome();
  } else if (route.page === "article") {
    await renderArticle(route);
  } else {
    renderMissing();
  }

  updateActiveNav(route);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function renderSearchResults(query) {
  if (!searchResults) return;

  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    searchResults.innerHTML = "";
    searchResults.classList.remove("is-open");
    return;
  }

  const matches = allArticles().filter((article) => {
    const haystack = [
      article.title,
      article.desc,
      article.parentTitle,
      article.sectionTitle,
      article.slug
    ].join(" ").toLowerCase();
    return haystack.includes(normalized);
  }).slice(0, 8);

  if (!matches.length) {
    searchResults.innerHTML = `<div class="search-result search-result--empty">没有找到相关文章</div>`;
    searchResults.classList.add("is-open");
    return;
  }

  searchResults.innerHTML = matches.map((article) => `
    <a class="search-result" href="${articleHref(article.sectionId, article.slug)}">
      <span class="search-result__title">${escapeHtml(article.title)}</span>
      <span class="search-result__path">${escapeHtml(article.sectionTitle)} / ${escapeHtml(article.parentTitle)}</span>
    </a>
  `).join("");
  searchResults.classList.add("is-open");
}

function closeMobileDropdowns(except = null) {
  document.querySelectorAll(".nav__dropdown.is-open").forEach((dropdown) => {
    if (dropdown !== except) {
      dropdown.classList.remove("is-open");
    }
  });
}

function closeSearch() {
  document.querySelector(".search")?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function closeNavMenu() {
  closeMobileDropdowns();
  closeSearch();
}

function bindGlobalEvents() {
  navToggle?.addEventListener("click", (event) => {
    event.preventDefault();
    const search = document.querySelector(".search");
    const isOpen = search?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    closeMobileDropdowns();
    if (isOpen) {
      requestAnimationFrame(() => searchInput?.focus());
    }
  });

  searchInput?.addEventListener("input", (event) => {
    renderSearchResults(event.target.value);
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const firstResult = searchResults?.querySelector("a.search-result");
      if (firstResult) {
        window.location.hash = firstResult.getAttribute("href");
        searchInput.value = "";
        renderSearchResults("");
        closeNavMenu();
      }
    }

    if (event.key === "Escape") {
      searchInput.value = "";
      renderSearchResults("");
    }
  });

  document.addEventListener("click", (event) => {
    const mobileSectionTrigger = event.target.closest(".nav__dropdown > .nav__item");
    if (mobileSectionTrigger && mobileNavQuery.matches) {
      event.preventDefault();
      const dropdown = mobileSectionTrigger.closest(".nav__dropdown");
      const shouldOpen = !dropdown.classList.contains("is-open");
      closeMobileDropdowns(dropdown);
      closeSearch();
      dropdown.classList.toggle("is-open", shouldOpen);
      return;
    }

    const scrollTarget = event.target.closest("[data-scroll-target]");
    if (scrollTarget) {
      event.preventDefault();
      const heading = document.getElementById(scrollTarget.dataset.scrollTarget);
      heading?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const menuLink = event.target.closest(".menu a");
    if (menuLink) {
      saveSidebarScroll();
      return;
    }

    const link = event.target.closest("a");
    if (link) {
      if (link.closest("#search-results")) {
        searchInput.value = "";
        renderSearchResults("");
      }
      closeNavMenu();
    }

    if (!event.target.closest(".search")) {
      renderSearchResults("");
    }

    if (!event.target.closest(".nav")) {
      closeNavMenu();
    }
  });

  window.addEventListener("hashchange", render);
}

document.querySelector("#year").textContent = String(new Date().getFullYear());
renderDropdowns();
bindGlobalEvents();
render();

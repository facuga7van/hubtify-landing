const { useState, useEffect, useRef, useCallback } = React;

const useReveal = () => {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            const bars = e.target.querySelectorAll("[data-bar-target]");
            bars.forEach((b) => {
              b.style.width = b.getAttribute("data-bar-target") + "%";
            });
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

let _toastId = 0;
const ToastCtx = React.createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const fire = useCallback((t) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((x) => (x.id === id ? { ...x, exit: true } : x)));
    }, 2500);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 2750);
  }, []);
  return (
    <ToastCtx.Provider value={fire}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.kind}${t.exit ? " exit" : ""}`}>
            <div className="icon">{t.icon}</div>
            <div className="body">
              <div className="title">{t.title}</div>
              <div className="msg">{t.msg}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

const cornerTransforms = { tl: undefined, tr: "scaleX(-1)", bl: "scaleY(-1)", br: "scale(-1,-1)" };
const Corner = ({ pos }) => (
  <svg className={`corner ${pos}`} viewBox="0 0 64 64" fill="none" style={{ transform: cornerTransforms[pos] }}>
    <path d="M2 2 L32 2 L32 6 L6 6 L6 32 L2 32 Z" fill="#2a1d0e" opacity=".78" />
    <path d="M8 8 L24 8 L24 10 L10 10 L10 24 L8 24 Z" fill="#a88a3c" opacity=".55" />
    <path d="M2 2 L10 2 L2 10 Z" fill="#5a3a20" />
    <circle cx="16" cy="16" r="1.3" fill="#a88a3c" />
    <circle cx="28" cy="4" r="1.2" fill="#a88a3c" />
    <circle cx="4" cy="28" r="1.2" fill="#a88a3c" />
    <path d="M10 10 Q 20 12 26 6 M10 10 Q 12 20 6 26" stroke="#a88a3c" strokeWidth="0.6" fill="none" opacity=".7" />
  </svg>
);

const iconDefaults = { viewBox: "0 0 24 24", width: 32, height: 32, fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" };

const Glyph = ({ name }) => {
  const glyphs = {
    sword: <>
      <path d="M20.5 3 L14 9.5 L13 10.5 L14.5 12 L21 5.5 L22 3 Z" fill="currentColor" fillOpacity=".06" />
      <path d="M21 3.5 L13.5 11" />
      <path d="M10.5 13.5 L16 8" strokeWidth="1.5" />
      <circle cx="10" cy="14" r=".7" fill="currentColor" fillOpacity=".2" />
      <circle cx="16.5" cy="7.5" r=".7" fill="currentColor" fillOpacity=".2" />
      <path d="M10.5 13.5 L5.5 18.5" />
      <path d="M9 15 L7.5 16.5 M8.5 15.5 L7 17" strokeWidth=".7" />
      <circle cx="5" cy="19" r="1.5" />
    </>,
    coin: <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5.5" />
      <path d="M9.5 13 L10.5 10 L12 12 L13.5 10 L14.5 13 Z" fill="currentColor" fillOpacity=".1" />
      <circle cx="12" cy="4.5" r=".6" fill="currentColor" fillOpacity=".2" />
      <circle cx="12" cy="19.5" r=".6" fill="currentColor" fillOpacity=".2" />
      <circle cx="4.5" cy="12" r=".6" fill="currentColor" fillOpacity=".2" />
      <circle cx="19.5" cy="12" r=".6" fill="currentColor" fillOpacity=".2" />
    </>,
    chalice: <>
      <path d="M6 4 H18 L16 11 C16 14 14 15 12 15 C10 15 8 14 8 11 Z" />
      <path d="M12 15 V20 M8 20 H16" />
    </>,
    cauldron: <>
      <path d="M5 10 H19 L18 18 C 18 20 16 21 12 21 C 8 21 6 20 6 18 Z" />
      <path d="M4 10 H20" strokeWidth="1.5" />
      <path d="M5 11 C 2 11 2 14 5 14" strokeWidth="1" />
      <path d="M19 11 C 22 11 22 14 19 14" strokeWidth="1" />
      <path d="M9 7 Q 10 5 11 7 M13 6 Q 14 4 15 6 M11 5 Q 12 3 13 5" strokeWidth=".8" />
      <circle cx="10" cy="15" r=".8" fill="currentColor" fillOpacity=".1" />
      <circle cx="14" cy="16" r=".6" fill="currentColor" fillOpacity=".1" />
    </>,
    crown: <>
      <path d="M3 18 L4 8 L9 13 L12 6 L15 13 L20 8 L21 18 Z" fill="currentColor" fillOpacity=".06" />
      <path d="M3 18 H21" strokeWidth="1.4" />
      <path d="M4 16 H20" strokeWidth=".6" />
      <circle cx="4" cy="8" r="1" fill="currentColor" fillOpacity=".15" />
      <circle cx="20" cy="8" r="1" fill="currentColor" fillOpacity=".15" />
      <circle cx="12" cy="6" r="1" fill="currentColor" fillOpacity=".15" />
      <circle cx="8" cy="17" r=".7" fill="currentColor" fillOpacity=".2" />
      <circle cx="12" cy="17" r=".7" fill="currentColor" fillOpacity=".2" />
      <circle cx="16" cy="17" r=".7" fill="currentColor" fillOpacity=".2" />
    </>
  };
  return <svg {...iconDefaults}>{glyphs[name]}</svg>;
};

function TopBar({ lang, setLang, t }) {
  return (
    <header className="topbar" data-screen-label="topbar">
      <a href="#top" className="brand">
        <img src="assets/icon.png" alt="Hubtify" className="brand-mark" />
        <span className="brand-name">Hubtify</span>
      </a>
      <nav className="nav">
        <a href="#modules" className="nav-link">{t.nav.features}</a>
        <a href="#demo" className="nav-link">{t.nav.demo}</a>
        <a href="#stats" className="nav-link">{t.nav.stats}</a>
        <a href="#faq" className="nav-link">{t.nav.faq}</a>
        <a href="https://github.com/facuga7van/hubtify" target="_blank" rel="noopener noreferrer" className="nav-link" title="GitHub">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
        <div className="lang-toggle">
          <button className={lang === "es" ? "active" : ""} onClick={() => setLang("es")}>ES</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
      </nav>
    </header>
  );
}

function Hero({ t, onDownload }) {
  const sealRef = useRef(null);
  const [hp] = useState(82);
  const [xp, setXp] = useState(64);
  const [streak] = useState(71);

  useEffect(() => {
    const id = setInterval(() => {
      setXp((v) => (v >= 92 ? 64 : v + 4));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero" id="top" data-screen-label="hero">
      <div className="hero-corners">
        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
      </div>

      <div className="hero-text">
        <div className="eyebrow-row">
          <span className="dot"></span>
          <span className="qb-small-caps">{t.hero.eyebrow}</span>
        </div>
        <h1>
          {t.hero.title_a} <span className="accent">{t.hero.title_b}</span> {t.hero.title_c}
        </h1>
        <p className="hero-lead">{t.hero.lead}</p>

        <div className="cta-row">
          <button className="rpg-button rpg-button-primary" onClick={onDownload}>
            <DownloadGlyph /> {t.hero.cta_primary}
          </button>
          <a href="#demo" className="rpg-button rpg-button-ghost">
            ▷ {t.hero.cta_secondary}
          </a>
        </div>

        <div className="qb-small-caps" style={{ color: "var(--ink-faded)", marginBottom: 18 }}>
          {t.hero.sub_cta}
        </div>

        <div className="platforms-row">
          <span className="platform-tag">⊞ {t.platforms.win}</span>
          <span className="platform-tag">⌘ {t.platforms.mac} <span className="soon">{t.platforms.soon}</span></span>
          <span className="platform-tag">◆ {t.platforms.linux} <span className="soon">{t.platforms.soon}</span></span>
          <span className="platform-tag">▲ {t.platforms.android} <span className="soon">{t.platforms.soon}</span></span>
          <span className="platform-tag">◎ {t.platforms.ios} <span className="soon">{t.platforms.soon}</span></span>
        </div>
      </div>

      <div className="hero-art">
        <CharacterCard t={t} hp={hp} xp={xp} streak={streak} sealRef={sealRef} />
        <div className="float-toast float-1">
          <span className="glyph">✚</span>
          <span>{t.hero.toast_xp}</span>
        </div>
        <div className="float-toast float-2">
          <span className="glyph">✪</span>
          <span>{t.hero.toast_streak}</span>
        </div>
      </div>
    </section>
  );
}

const DownloadGlyph = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 V15" /><path d="M7 11 L12 16 L17 11" /><path d="M4 19 H20" />
  </svg>
);

function CharacterCard({ t, hp, xp, streak, sealRef }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      el.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="char-card" ref={cardRef}>
      <div style={{ position: "absolute", top: 14, right: 14 }}>
        <div ref={sealRef} className="wax-seal">H</div>
      </div>
      <div className="char-header">
        <div className="char-portrait"><span className="glyph">⚔</span></div>
        <div className="char-meta">
          <div className="char-name">{t.hero.char_name}</div>
          <div className="char-class">{t.hero.char_class} 14</div>
        </div>
      </div>

      <div className="bar-row">
        <span className="bar-icon">{t.hero.hp}</span>
        <div className="rpg-bar"><div className="rpg-bar-fill rpg-bar-fill--hp" style={{ width: hp + "%" }}></div></div>
        <span className="bar-value">{hp}/100</span>
      </div>
      <div className="bar-row">
        <span className="bar-icon">{t.hero.xp}</span>
        <div className="rpg-bar"><div className="rpg-bar-fill rpg-bar-fill--xp" style={{ width: xp + "%" }}></div></div>
        <span className="bar-value">{xp}/100</span>
      </div>
      <div className="bar-row">
        <span className="bar-icon">{t.hero.streak}</span>
        <div className="rpg-bar"><div className="rpg-bar-fill rpg-bar-fill--gold" style={{ width: streak + "%" }}></div></div>
        <span className="bar-value">{t === window.HUBTIFY_I18N.es ? "7 días" : "7 days"}</span>
      </div>

      <div className="char-stats">
        <div className="qb-stat-box"><span className="stat-value">17</span><span className="stat-label">{t.hero.stat_str}</span></div>
        <div className="qb-stat-box"><span className="stat-value">22</span><span className="stat-label">{t.hero.stat_int}</span></div>
        <div className="qb-stat-box"><span className="stat-value">15</span><span className="stat-label">{t.hero.stat_dex}</span></div>
      </div>
    </div>
  );
}

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="section-header">
    {eyebrow && <div className="qb-eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</div>}
    <h2>{title}</h2>
    <div className="qb-rule"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
    {subtitle && <p className="qb-subtitle">{subtitle}</p>}
  </div>
);

function Modules({ t, fire }) {
  const m = t.modules;
  const cards = [
    { key: "questify", glyph: "sword", tier: "rubric" },
    { key: "coinify", glyph: "coin", tier: "gold" },
    { key: "nutrify", glyph: "chalice", tier: "moss" },
    { key: "cauldron", glyph: "cauldron", tier: "rubric" },
    { key: "character", glyph: "crown", tier: "gold" },
  ];
  return (
    <section className="section reveal" id="modules" data-screen-label="modules">
      <SectionHeader eyebrow="✦ Códex ✦" title={m.title} subtitle={m.subtitle} />
      <div className="modules-grid">
        {cards.map((c) => (
          <div
            key={c.key}
            className={`module-card tier-${c.tier}`}
            onClick={() => fire({ kind: "xp", icon: "✚", title: t.toasts.quest.title, msg: t.toasts.quest.msg })}
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const r = el.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width - 0.5;
              const y = (e.clientY - r.top) / r.height - 0.5;
              el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
            }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
          >
            <div className="module-icon"><Glyph name={c.glyph} /></div>
            <div className="qb-eyebrow">{m[c.key].eyebrow}</div>
            <h3>{m[c.key].name}</h3>
            <p>{m[c.key].desc}</p>
            <div className="module-meta">
              <span>{m[c.key].meta}</span>
              <span className="reward">✦ {m[c.key].reward}</span>
            </div>
          </div>
        ))}
        <div className="module-card" style={{ display: "grid", placeItems: "center", textAlign: "center", borderStyle: "dashed", background: "rgba(245,231,192,0.4)" }}>
          <div>
            <div className="module-icon" style={{ margin: "0 auto 14px", borderStyle: "dashed" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>+</span>
            </div>
            <h3>?</h3>
            <p style={{ fontStyle: "italic" }}>{t === window.HUBTIFY_I18N.es ? "Más tomos en el horizonte…" : "More tomes on the horizon…"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModuleShowcase({ t }) {
  const d = t.detail;
  const modules = [
    { key: "questify", glyph: "sword", img: "assets/screenshot-questify.png" },
    { key: "coinify", glyph: "coin", img: "assets/screenshot-coinify.png" },
    { key: "nutrify", glyph: "chalice", img: "assets/screenshot-nutrify.png" },
    { key: "cauldron", glyph: "cauldron", img: "assets/screenshot-cauldron.png" },
    { key: "character", glyph: "crown", img: "assets/screenshot-dashboard.png" },
  ];
  return (
    <div className="module-showcase">
      {modules.map((m, i) => (
        <section key={m.key} className={`showcase-row reveal ${i % 2 !== 0 ? "showcase-row--flip" : ""}`} id={`detail-${m.key}`}>
          <div className="showcase-img">
            <div className="app-screenshot">
              <img src={m.img} alt={t.modules[m.key].name} loading="lazy" />
            </div>
          </div>
          <div className="showcase-content">
            <div className="showcase-header">
              <div className="module-icon"><Glyph name={m.glyph} /></div>
              <div>
                <div className="qb-eyebrow">{t.modules[m.key].eyebrow}</div>
                <h3>{t.modules[m.key].name}</h3>
              </div>
            </div>
            <p className="showcase-tagline">{d[m.key].tagline}</p>
            <ul className="showcase-features">
              <li><span className="showcase-bullet">✦</span><span>{d[m.key].f1}</span></li>
              <li><span className="showcase-bullet">✦</span><span>{d[m.key].f2}</span></li>
              <li><span className="showcase-bullet">✦</span><span>{d[m.key].f3}</span></li>
              <li><span className="showcase-bullet">✦</span><span>{d[m.key].f4}</span></li>
              <li><span className="showcase-bullet">✦</span><span>{d[m.key].f5}</span></li>
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}

function RPGSystem({ t }) {
  const rpg = t.rpg;
  const cards = [
    { key: "xp", glyph: "sword" },
    { key: "combo", glyph: "crown" },
    { key: "loot", glyph: "coin" },
    { key: "hp", glyph: "chalice" },
  ];
  return (
    <section className="section reveal" id="rpg" data-screen-label="rpg">
      <SectionHeader eyebrow="✦ RPG ✦" title={rpg.title} subtitle={rpg.subtitle} />
      <div className="rpg-grid">
        {cards.map((c) => (
          <div key={c.key} className="rpg-feature-card">
            <div className="rpg-feature-icon"><Glyph name={c.glyph} /></div>
            <h3>{rpg[c.key].title}</h3>
            <p>{rpg[c.key].desc}</p>
          </div>
        ))}
      </div>
      <div className="rpg-titles-strip">
        <div className="qb-small-caps">{rpg.titles}</div>
      </div>
    </section>
  );
}

function Stats({ t }) {
  return (
    <section className="section reveal" id="stats" data-screen-label="stats">
      <div className="stats-banner">
        <div className="stat-cell"><div className="num"><CountUp end={5} /></div><div className="lbl">{t.stats.a_lbl}</div></div>
        <div className="stat-cell"><div className="num"><CountUp end={42} suffix="+" /></div><div className="lbl">{t.stats.b_lbl}</div></div>
        <div className="stat-cell"><div className="num">{t.stats.c_num}</div><div className="lbl">{t.stats.c_lbl}</div></div>
        <div className="stat-cell"><div className="num">{t.stats.d_num}</div><div className="lbl">{t.stats.d_lbl}</div></div>
      </div>
    </section>
  );
}

function Demo({ t, fire }) {
  const [quests, setQuests] = useState([
    { id: 1, title: t.demo.q1, meta: t.demo.q1_meta, xp: 5, tier: "", done: true },
    { id: 2, title: t.demo.q2, meta: t.demo.q2_meta, xp: 40, tier: "tier-epica", done: true },
    { id: 3, title: t.demo.q3, meta: t.demo.q3_meta, xp: 15, tier: "tier-rara", done: true },
    { id: 4, title: t.demo.q4, meta: t.demo.q4_meta, xp: 15, tier: "tier-rara", done: false },
    { id: 5, title: t.demo.q5, meta: t.demo.q5_meta, xp: 5, tier: "", done: false },
  ]);

  useEffect(() => {
    setQuests((qs) => qs.map((q, i) => ({
      ...q,
      title: t.demo[`q${i+1}`],
      meta: t.demo[`q${i+1}_meta`],
    })));
  }, [t]);

  const toggle = (id) => {
    let opened = false;
    setQuests((qs) => qs.map((q) => {
      if (q.id === id) {
        opened = !q.done;
        return { ...q, done: !q.done };
      }
      return q;
    }));
    if (opened) {
      fire({ kind: "xp", icon: "✚", title: t.toasts.quest.title, msg: t.toasts.quest.msg });
    }
  };

  const doneCount = quests.filter((q) => q.done).length;

  return (
    <section className="section reveal" id="demo" data-screen-label="demo">
      <div className="demo-section">
        <div className="demo-text">
          <div className="qb-eyebrow" style={{ marginBottom: 10 }}>✦ Demo ✦</div>
          <h2>{t.demo.title}</h2>
          <p>{t.demo.lead}</p>
          <ul className="demo-features">
            <li><span className="check">✓</span><span>{t.demo.f1}</span></li>
            <li><span className="check">✓</span><span>{t.demo.f2}</span></li>
            <li><span className="check">✓</span><span>{t.demo.f3}</span></li>
            <li><span className="check">✓</span><span>{t.demo.f4}</span></li>
          </ul>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="app-screenshot">
            <img src="assets/screenshot-dashboard.png" alt="Hubtify App" loading="lazy" />
          </div>
          <div className="quest-log">
            <div className="quest-log-header">
              <span className="title">⚔ {t.demo.log_title}</span>
              <span className="count">{doneCount} / 5 {t === window.HUBTIFY_I18N.es ? "completadas" : "done"}</span>
            </div>
            <div className="quest-list">
              {quests.map((q) => (
                <div key={q.id} className={`quest-item ${q.tier} ${q.done ? "done" : ""}`} onClick={() => toggle(q.id)}>
                  <div className="quest-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12 L10 17 L19 7" />
                    </svg>
                  </div>
                  <div className="quest-body">
                    <div className="quest-title">{q.title}</div>
                    <div className="quest-meta">
                      <span className="xp">+{q.xp} XP</span>
                      <span>{q.meta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ({ t, fire }) {
  const [open, setOpen] = useState(0);
  const tog = (i) => {
    if (i !== open) fire({ kind: "info", icon: "✦", title: t.toasts.faq.title, msg: t.toasts.faq.msg });
    setOpen((p) => (p === i ? -1 : i));
  };
  return (
    <section className="section reveal" id="faq" data-screen-label="faq">
      <SectionHeader eyebrow="✦ Preguntas ✦" title={t.faq.title} subtitle={t.faq.subtitle} />
      <div className="faq-list">
        {t.faq.items.map((it, i) => (
          <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
            <div className="faq-q" onClick={() => tog(i)}>
              <span>{it.q}</span>
              <span className="faq-toggle">+</span>
            </div>
            <div className="faq-a">{it.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="footer-rule"></div>
      <p className="qb-hand" style={{ fontSize: 18, color: "var(--ink-soft)", marginBottom: 10 }}>{t.footer.tagline}</p>
      <div style={{ display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap", marginBottom: 14, fontFamily: "var(--font-caps)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {t.footer.links.map((l, i) => {
          if (l === "GitHub") {
            return <a key={i} href="https://github.com/facuga7van/hubtify" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink-faded)" }}>{l}</a>;
          }
          return <a key={i} href="#" style={{ color: "var(--ink-faded)" }}>{l}</a>;
        })}
      </div>
      <div className="qb-small-caps" style={{ color: "var(--ink-faded)" }}>{t.footer.copy}</div>
    </footer>
  );
}

function spawnParticles(x, y) {
  const colors = ["var(--gold-light)", "var(--gold)", "var(--rubric-light)"];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.background = colors[i % colors.length];
    document.body.appendChild(p);
    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.5;
    const dist = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    p.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 },
      ],
      { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.2,.6,.4,1)" }
    ).onfinish = () => p.remove();
  }
}

function InteractiveLayer() {
  const canvasRef = useRef(null);
  const torchRef = useRef(null);
  const sparkRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const torch = torchRef.current;
    const sparks = sparkRef.current;
    let frame;
    let lastSpark = 0;
    const hasHover = window.matchMedia("(hover: hover)").matches;

    const colors = [[210, 160, 60], [196, 168, 78], [180, 120, 50], [220, 180, 90]];
    const embers = [];
    for (let i = 0; i < 40; i++) {
      embers.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        s: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.5 - 0.1,
        a: Math.random() * 0.4 + 0.1,
        p: Math.random() * Math.PI * 2,
        c: colors[i % colors.length],
      });
    }

    const motes = [];
    for (let i = 0; i < 12; i++) {
      motes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        s: Math.random() * 5 + 3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.035 + 0.015,
        p: Math.random() * Math.PI * 2,
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      if (!hasHover) return;
      torch.style.left = e.clientX + "px";
      torch.style.top = e.clientY + "px";
      const now = Date.now();
      if (now - lastSpark > 80) {
        lastSpark = now;
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 14,
          y: e.clientY + (Math.random() - 0.5) * 14,
          s: Math.random() * 2 + 0.8,
          life: 1,
          d: 0.025 + Math.random() * 0.02,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -Math.random() * 1.2 - 0.3,
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;

      embers.forEach((p) => {
        p.x += p.vx + Math.sin(t + p.p) * 0.12;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const f = Math.sin(t * 3 + p.p) * 0.3 + 0.7;
        const al = p.a * f;
        const [r, g, b] = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${al})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${al * 0.1})`;
        ctx.fill();
      });

      motes.forEach((m) => {
        m.x += m.vx + Math.sin(t * 0.5 + m.p) * 0.08;
        m.y += m.vy + Math.cos(t * 0.3 + m.p) * 0.06;
        if (m.y < -30) m.y = canvas.height + 30;
        if (m.y > canvas.height + 30) m.y = -30;
        if (m.x < -30) m.x = canvas.width + 30;
        if (m.x > canvas.width + 30) m.x = -30;
        const f = Math.sin(t * 0.8 + m.p) * 0.3 + 0.7;
        const al = m.a * f;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,138,60,${al})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.s * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,138,60,${al * 0.3})`;
        ctx.fill();
      });

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.d;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,168,78,${s.life * 0.5})`;
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div ref={torchRef} className="torch-glow" />
      <canvas ref={canvasRef} className="interactive-canvas" />
    </>
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="scroll-progress"><div className="scroll-progress-fill" style={{ width: pct + "%" }} /></div>;
}

function CountUp({ end, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / 1500, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{val}{suffix || ""}</span>;
}

function App() {
  const [lang, setLang] = useState("es");
  const t = window.HUBTIFY_I18N[lang];
  const fire = useToast();
  useReveal();

  const handleDownload = async () => {
    const seal = document.querySelector(".wax-seal");
    if (seal) {
      seal.classList.remove("stamping");
      void seal.offsetWidth;
      seal.classList.add("stamping");
      const r = seal.getBoundingClientRect();
      spawnParticles(r.left + r.width / 2, r.top + r.height / 2);
    }
    fire({ kind: "xp", icon: "⚔", title: t.toasts.download.title, msg: t.toasts.download.msg });

    try {
      const res = await fetch("https://api.github.com/repos/facuga7van/hubtify-releases/releases/latest");
      const release = await res.json();
      const exe = release.assets.find((a) => a.name.endsWith(".exe"));
      if (exe) window.location.href = exe.browser_download_url;
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <>
      <InteractiveLayer />
      <ScrollProgress />
      <div className="app">
        <TopBar lang={lang} setLang={setLang} t={t} />
        <Hero t={t} onDownload={handleDownload} />
        <Modules t={t} fire={fire} />
        <ModuleShowcase t={t} />
        <RPGSystem t={t} />
        <Stats t={t} />
        <Demo t={t} fire={fire} />
        <FAQ t={t} fire={fire} />
        <Footer t={t} />
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ToastProvider><App /></ToastProvider>
);

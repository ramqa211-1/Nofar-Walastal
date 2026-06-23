import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import portraitUrl from "../../images/nofar suite 2.png";

export const Route = createFileRoute("/")({
  component: Index,
});

// ── Count-up number ──────────────────────────────────────────
function CountUp({ to, duration = 1380 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setVal(Math.round(to * eased));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) run();
        else { cancelAnimationFrame(raf); setVal(0); }
      },
      { threshold: 0.55 }
    );
    obs.observe(el);
    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, [to, duration]);

  return <span ref={ref}>{val}</span>;
}

// ── Canvas film grain ────────────────────────────────────────
function useFilmGrain(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = 0, H = 0, last = 0, rafId = 0;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (now - last < 48) return;
      last = now;
      const d = ctx.createImageData(W, H);
      const px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        px[i] = px[i + 1] = px[i + 2] = v;
        px[i + 3] = 18;
      }
      ctx.putImageData(d, 0, 0);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);
}

// ── Hero parallax / dolly-zoom ───────────────────────────────
function useHeroParallax(
  spaceRef: React.RefObject<HTMLDivElement | null>,
  bgRef: React.RefObject<HTMLDivElement | null>,
  symbolsRef: React.RefObject<HTMLDivElement | null>,
  textRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let ticking = false;
    const update = () => {
      const space = spaceRef.current;
      const bg = bgRef.current;
      const symbols = symbolsRef.current;
      const text = textRef.current;
      if (!space || !bg || !symbols || !text) { ticking = false; return; }
      const maxScroll = space.offsetHeight - window.innerHeight;
      // No scroll travel (e.g. mobile single-viewport hero) or reduced motion:
      // keep everything at rest so the text never fades on scroll.
      if (maxScroll <= 0 || reduceMotion) {
        bg.style.transform = "scale(1)";
        bg.style.filter = "blur(0px)";
        symbols.style.transform = "translateY(0px)";
        text.style.opacity = "1";
        text.style.transform = "translateY(0px)";
        ticking = false;
        return;
      }
      const p = Math.max(0, Math.min(window.scrollY / maxScroll, 1));
      bg.style.transform = `scale(${1 + p * 0.3})`;
      bg.style.filter = `blur(${p * 1.8}px)`;
      symbols.style.transform = `translateY(${-p * 44}px)`;
      // Fade only across the last 40% of the pinned travel, so the hero text
      // stays fully readable until you are clearly leaving the section.
      const fade = Math.max(0, (p - 0.6) / 0.4);
      text.style.opacity = `${1 - fade}`;
      text.style.transform = `translateY(${p * 18}px)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

// ── Blast-reveal on scroll into view ────────────────────────
function useBlastReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".blast-target");
    if (!targets.length) return;
    const arr = Array.from(targets);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = arr.indexOf(e.target as HTMLElement);
            setTimeout(
              () => (e.target as HTMLElement).classList.add("fired"),
              idx * 80
            );
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Data ─────────────────────────────────────────────────────
const traits = [
  { n: "01", label: "חרוצה" },
  { n: "02", label: "שקדנית" },
  { n: "03", label: "פרפקציוניסטית" },
  { n: "04", label: "מ-א׳ עד ת׳" },
];

const hudSymbols: Array<{
  glyph: string;
  cap: [string, string];
  size: number;
  pos: React.CSSProperties;
}> = [
  { glyph: "₪",   cap: ["מטבע ישראלי", "יחס שקל"],      size: 100, pos: { top: "14%", right: "7%" } },
  { glyph: "%",   cap: ["לשכת רואי", "חשבון"],           size: 112, pos: { bottom: "20%", left: "8%" } },
  { glyph: "96",  cap: ["קול המס", "בחינה לאומית"],      size: 72,  pos: { top: "18%", left: "9%" } },
  { glyph: "15+", cap: ["שנות ניסיון", "ניהולי"],        size: 64,  pos: { bottom: "17%", right: "8%" } },
];

// ── Shared style objects ─────────────────────────────────────
const SECTION: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "clamp(60px, 8vw, 112px) clamp(24px, 4vw, 60px)",
  borderBottom: "1px solid hsl(34 12% 11%)",
};

const SEC_TITLE: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "clamp(26px, 3.8vw, 40px)",
  lineHeight: 1.1,
  color: "hsl(38 22% 87%)",
  marginBottom: 36,
  paddingBottom: 18,
};

const BODY: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.68,
  color: "hsl(35 12% 52%)",
  maxWidth: "64ch",
};

// ── Sub-components ───────────────────────────────────────────
function SectionEyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "hsl(28 45% 36%)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 22,
      }}
    >
      {n} / {label}
      <span style={{ flex: 1, height: 1, background: "hsl(36 14% 18%)" }} />
    </div>
  );
}

function EduEntry({
  year,
  h,
  p,
  children,
  last,
}: {
  year: string;
  h: string;
  p: string;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 40,
        alignItems: "flex-start",
        ...(last
          ? {}
          : { paddingBottom: 40, marginBottom: 40, borderBottom: "1px solid hsl(34 12% 11%)" }),
      }}
    >
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            color: "hsl(38 22% 87%)",
            marginBottom: 8,
          }}
        >
          {h}
        </h3>
        <p style={{ color: "hsl(35 12% 52%)", marginBottom: children ? 20 : 0, lineHeight: 1.6 }}>
          {p}
        </p>
        {children}
      </div>
      <div
        style={{
          flexShrink: 0,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontStyle: "italic",
          color: "hsl(35 12% 52%)",
          paddingTop: 4,
        }}
      >
        {year}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
function Index() {
  const [lang, setLang] = useState<"he" | "en">("he");
  const [menuOpen, setMenuOpen] = useState(false);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const spaceRef   = useRef<HTMLDivElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const symbolsRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useFilmGrain(canvasRef);
  useHeroParallax(spaceRef, bgRef, symbolsRef, textRef);
  useBlastReveal();

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === "he" ? "rtl" : "ltr";
  }, [lang]);

  const toggleLang = useCallback(() => setLang((l) => (l === "he" ? "en" : "he")), []);
  const isHe = lang === "he";

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ── Atmosphere overlays ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          pointerEvents: "none", opacity: 0.065,
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 990, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 42%, hsl(20 25% 4% / 0.90) 100%)",
        }}
      />
      <div
        className="chromatic-fringe"
        style={{ position: "fixed", inset: 0, zIndex: 991, pointerEvents: "none" }}
      />

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed", top: 0, insetInline: 0, zIndex: 100, height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 56px)",
          background: "hsl(24 18% 5% / 0.78)",
          backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid hsl(34 12% 11%)",
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 25,
            letterSpacing: "-0.015em", color: "hsl(38 22% 87%)", textDecoration: "none",
          }}
        >
          נופר לוי ולסטל
        </a>

        <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
          {[
            ["01 / אודות",  "#about"],
            ["02 / השכלה",  "#education"],
            ["03 / ניסיון", "#experience"],
            ["04 / קשר",    "#contact"],
          ].map(([label, href]) => (
            <li key={href}>
              <a
                href={href}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  textTransform: "uppercase", letterSpacing: "0.18em",
                  color: "hsl(35 12% 52%)", textDecoration: "none",
                  transition: "color 0.28s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(28 60% 50%)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(35 12% 52%)")}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={toggleLang}
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10,
              textTransform: "uppercase", letterSpacing: "0.15em",
              color: "hsl(35 12% 52%)", border: "1px solid hsl(36 14% 18%)",
              padding: "5px 11px", background: "transparent", cursor: "pointer",
              transition: "all 0.28s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "hsl(28 60% 50%)";
              (e.currentTarget as HTMLElement).style.color = "hsl(28 60% 50%)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "hsl(36 14% 18%)";
              (e.currentTarget as HTMLElement).style.color = "hsl(35 12% 52%)";
            }}
          >
            {isHe ? "EN" : "HE"}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              display: "flex", flexDirection: "column", justifyContent: "center",
              gap: 5, width: 32, height: 32, background: "transparent",
              border: "none", cursor: "pointer", padding: 4,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block", height: 1, background: "hsl(35 12% 52%)",
                  transition: "all 0.25s ease",
                  ...(menuOpen && i === 0 ? { transform: "translateY(6px) rotate(45deg)", background: "hsl(28 60% 50%)" } : {}),
                  ...(menuOpen && i === 1 ? { opacity: 0 } : {}),
                  ...(menuOpen && i === 2 ? { transform: "translateY(-6px) rotate(-45deg)", background: "hsl(28 60% 50%)" } : {}),
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            position: "fixed", top: 62, insetInline: 0, zIndex: 99,
            background: "hsl(24 18% 5% / 0.97)",
            backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
            borderBottom: "1px solid hsl(34 12% 11%)",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "16px 0" }}>
            {[
              ["01 / אודות",  "#about"],
              ["02 / השכלה",  "#education"],
              ["03 / ניסיון", "#experience"],
              ["04 / קשר",    "#contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px clamp(20px, 4vw, 56px)",
                    fontFamily: "var(--font-mono)", fontSize: 13,
                    textTransform: "uppercase", letterSpacing: "0.18em",
                    color: "hsl(35 12% 52%)", textDecoration: "none",
                    borderBottom: "1px solid hsl(34 12% 11%)",
                    transition: "color 0.25s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(28 60% 50%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(35 12% 52%)")}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <div ref={spaceRef} style={{ height: "var(--hero-space-h)", position: "relative" }}>
        <div
          style={{
            position: "sticky", top: 0, height: "100vh",
            overflow: "hidden", background: "hsl(24 18% 6%)",
          }}
        >

          {/* Layer 1: atmospheric background */}
          <div
            ref={bgRef}
            className="hero-bg-layer"
            style={{
              position: "absolute", inset: "-14%",
              transformOrigin: "center 58%", willChange: "transform, filter",
            }}
          />

          {/* Layer 2: portrait + text side by side */}
          <div
            style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "80px clamp(24px, 5vw, 64px) 40px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "clamp(28px, 5vw, 72px)",
                maxWidth: 1100,
                width: "100%",
              }}
            >
              {/* Portrait */}
              <div style={{ flexShrink: 0 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute", inset: -13,
                      border: "1px solid hsl(28 44% 35% / 0.38)",
                      pointerEvents: "none", zIndex: -1,
                      boxShadow: "0 0 60px hsl(28 50% 30% / 0.12), 0 0 120px hsl(28 40% 22% / 0.08)",
                    }}
                  />
                  <div
                    style={{
                      width: "var(--hero-portrait-w)",
                      aspectRatio: "3/4",
                      maxHeight: "calc(100vh - 160px)",
                      outline: "1px solid hsl(36 18% 22%)", outlineOffset: -1,
                      overflow: "hidden", background: "hsl(24 15% 11%)",
                    }}
                  >
                    <img
                      src={portraitUrl}
                      alt="נופר לוי ולסטל"
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover", objectPosition: "center top",
                      }}
                      loading="eager"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex", justifyContent: "space-between",
                    marginTop: 13, fontFamily: "var(--font-mono)",
                    fontSize: 10, textTransform: "uppercase",
                    letterSpacing: "0.17em", color: "hsl(35 12% 52%)",
                    width: "var(--hero-portrait-w)",
                  }}
                >
                  <span>Nofar Levi Walastal</span>
                  <span style={{ color: "hsl(28 45% 36%)" }}>CPA · ISR</span>
                </div>
              </div>

              {/* Text */}
              <div
                ref={textRef}
                style={{
                  flex: 1,
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  willChange: "transform, opacity",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 11,
                    textTransform: "uppercase", letterSpacing: "0.24em",
                    color: "hsl(28 45% 36%)", marginBottom: 18,
                    display: "flex", alignItems: "center", gap: 14,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block", width: 36, height: 1,
                      background: "hsl(28 45% 36%)", flexShrink: 0,
                    }}
                  />
                  Nofar Levi Walastal
                </div>

                <h1
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: "clamp(44px, 6.5vw, 84px)", lineHeight: 0.93,
                    letterSpacing: "-0.025em", color: "hsl(38 22% 87%)",
                    marginBottom: 14,
                    textShadow: "0 2px 48px hsl(24 22% 5% / 0.85)",
                  }}
                >
                  {isHe ? (
                    <>חשבת<br />שכר.</>
                  ) : (
                    <>Payroll<br />Accountant.</>
                  )}
                </h1>

                <p
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: 500,
                    fontSize: "clamp(18px, 2.2vw, 26px)",
                    color: "hsl(28 28% 48%)", marginBottom: 28,
                  }}
                >
                  {isHe ? "עם חזון ניהולי." : "With managerial vision."}
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: 36 }}>
                  {[
                    { to: 96,  suffix: "",  cap: isHe ? 'ציון מועצת רוה"ח' : "CPA Council Score" },
                    { to: 15,  suffix: "+", cap: isHe ? "שנות ניסיון"      : "Years Experience" },
                  ].map(({ to, suffix, cap }) => (
                    <div key={to}>
                      <span
                        style={{
                          fontFamily: "var(--font-display)", fontWeight: 800,
                          fontSize: "clamp(32px, 3.5vw, 44px)", lineHeight: 1,
                          color: "hsl(28 60% 50%)",
                          textShadow: "0 0 28px hsl(28 60% 44% / 0.42)",
                          display: "block",
                        }}
                      >
                        <CountUp to={to} />{suffix}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: 9,
                          textTransform: "uppercase", letterSpacing: "0.14em",
                          color: "hsl(35 12% 52%)", display: "block", marginTop: 4,
                        }}
                      >
                        {cap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: floating HUD symbols */}
          <div ref={symbolsRef} className="hud-symbols-layer" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {hudSymbols.map(({ glyph, cap, size, pos }) => (
              <div
                key={glyph}
                style={{
                  position: "absolute",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", textAlign: "center",
                  pointerEvents: "all", ...pos,
                }}
              >
                <span
                  className="hud-fsym"
                  style={{
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: size, lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: "1.5px hsl(28 45% 36%)",
                    cursor: "default", userSelect: "none",
                    display: "block", willChange: "transform",
                  }}
                >
                  {glyph}
                </span>
                <div
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    textTransform: "uppercase", letterSpacing: "0.13em",
                    color: "hsl(35 12% 52%)", marginTop: 9, lineHeight: 1.55,
                  }}
                >
                  {cap[0]}<br />{cap[1]}
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
      {/* /hero */}

      {/* ══ CONTENT SECTIONS ═════════════════════════════════ */}
      <div style={{ background: "hsl(24 18% 6%)" }}>

        {/* ABOUT */}
        <section id="about" style={SECTION}>
          <SectionEyebrow n="01" label={isHe ? "אודות" : "About"} />
          <h2 className="blast-target" style={SEC_TITLE}>
            {isHe ? "אודות" : "About"}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 11, marginBottom: 48,
            }}
          >
            {traits.map(({ n, label }) => (
              <div
                key={n}
                className="trait-card"
                style={{ border: "1px solid hsl(34 12% 11%)", padding: 16 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 10,
                    color: "hsl(28 45% 36%)", marginBottom: 7,
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)", fontWeight: 600,
                    fontSize: 16, color: "hsl(38 22% 87%)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p style={BODY}>
            חרוצה, שקדנית ופרפקציוניסטית. לוקחת כל משימה מ-א׳ עד ת׳ — מהבדיקה הראשונית ועד
            לחתימה הסופית על הדוח. שילוב יוצא דופן של{" "}
            <strong style={{ color: "hsl(38 22% 87%)", fontWeight: 600 }}>מצוינות אקדמית</strong>
            {" "}לצד{" "}
            <strong style={{ color: "hsl(38 22% 87%)", fontWeight: 600 }}>15 שנות ניסיון</strong>
            {" "}בניהול מערכות תפעוליות מורכבות. מומחיות בדיוק פיננסי לצד הבנה עסקית מהשטח.
          </p>
        </section>

        {/* EDUCATION */}
        <section id="education" style={SECTION}>
          <SectionEyebrow n="02" label={isHe ? "השכלה" : "Education"} />
          <h2 className="blast-target" style={SEC_TITLE}>
            {isHe ? "השכלה והסמכה" : "Education & Certification"}
          </h2>

          <EduEntry
            year="2025"
            h={isHe ? 'מכללת ״קול המס״' : "Kol Hamas College"}
            p={isHe ? "הסמכת חשבת שכר. סיום בהצטיינות יתרה." : "Payroll Accountant certification. Graduated with highest honors."}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
              <span
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: 54, color: "hsl(28 60% 50%)", lineHeight: 1,
                }}
              >
                <CountUp to={96} />
              </span>
              <div
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 13,
                  textTransform: "uppercase", letterSpacing: "0.13em",
                  color: "hsl(35 12% 52%)", lineHeight: 1.6,
                }}
              >
                {isHe ? (
                  <>ציון בבחינת<br />לשכת רואי חשבון</>
                ) : (
                  <>CPA Council<br />Exam Score</>
                )}
              </div>
            </div>
          </EduEntry>

          <EduEntry
            year="2009–2012"
            h={isHe ? "מדרשת רופין — המרכז האקדמי" : "Ruppin Academic Center"}
            p={isHe ? "תואר ראשון בכלכלה ומנהל עסקים." : "B.A. Economics & Business Administration."}
            last
          />
        </section>

        {/* EXPERIENCE */}
        <section id="experience" style={SECTION}>
          <SectionEyebrow n="03" label={isHe ? "ניסיון" : "Experience"} />
          <h2 className="blast-target" style={SEC_TITLE}>
            {isHe ? "ניסיון תעסוקתי" : "Work Experience"}
          </h2>

          <div
            style={{
              borderInlineStart: "2px solid hsl(28 44% 30% / 0.45)",
              paddingInlineStart: 32, position: "relative",
            }}
          >
            {/* Timeline dot */}
            <div
              style={{
                position: "absolute", insetBlockStart: 5, insetInlineStart: -7,
                width: 12, height: 12, borderRadius: "50%",
                background: "hsl(28 60% 50%)",
                boxShadow: "0 0 14px hsl(28 60% 44% / 0.65)",
              }}
            />

            <div
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "hsl(35 12% 52%)", marginBottom: 7,
              }}
            >
              2009 — 2025 &nbsp;·&nbsp; <CountUp to={15} />+{" "}
              {isHe ? "שנים" : "years"}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22,
                color: "hsl(38 22% 87%)", marginBottom: 5,
              }}
            >
              {isHe ? "מנהלת תחנות דלק — סונול" : "Fuel Station Manager — Sonol"}
            </h3>

            <p style={{ fontSize: 15, color: "hsl(28 45% 36%)", marginBottom: 18 }}>
              {isHe ? 'ספרינט מוטורוס בע״מ' : "Sprint Motoros Ltd."}
            </p>

            <p style={{ ...BODY, marginBottom: 22 }}>
              {isHe
                ? "בעלת ניסיון ניהולי ותפעולי עשיר בשטח. רקע מוכח בניהול מערכים מורכבים, הנעת עובדים, עבודה שוטפת מול ספקים וניהול מערכי נוכחות. בעלת ידע מעמיק ויסודי בדיני עבודה, המשלבת יכולת ארגונית גבוהה, יחסי אנוש מעולים וירידה לפרטים."
                : "Full operational management including HR, inventory, budgets, financial reports, and controls. Led the station to record results while maintaining high service and accuracy standards."}
            </p>

            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1px solid hsl(28 45% 36% / 0.35)",
                background: "hsl(28 45% 36% / 0.10)",
                padding: "5px 12px",
                fontFamily: "var(--font-mono)", fontSize: 13,
                textTransform: "uppercase", letterSpacing: "0.12em",
                color: "hsl(38 22% 87%)",
              }}
            >
              <span style={{ color: "hsl(28 45% 36%)" }}>
                {isHe ? "הוקרה" : "Award"}
              </span>
              {isHe
                ? 'זוכת תעודות ״מנהלת מצטיינת״ — מספר שנים ברציפות'
                : '"Outstanding Manager" — multiple consecutive years'}
            </div>
          </div>
        </section>

      </div>
      {/* /sections */}

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer
        id="contact"
        style={{
          background: "hsl(22 20% 4%)",
          borderTop: "1px solid hsl(34 12% 11%)",
          padding: "clamp(64px, 8vw, 100px) clamp(24px, 4vw, 60px)",
        }}
      >
        <div
          style={{
            maxWidth: 1240, margin: "0 auto",
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", gap: 40, flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)", fontSize: 13,
                textTransform: "uppercase", letterSpacing: "0.2em",
                color: "hsl(35 12% 52%)", opacity: 0.55, marginBottom: 16,
              }}
            >
              / 04 — {isHe ? "יצירת קשר" : "Contact"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(38px, 5.5vw, 68px)", lineHeight: 1,
                color: "hsl(38 22% 87%)", marginBottom: 32,
              }}
            >
              {isHe ? "בואו נדבר" : "Let's Talk"}
            </h2>
            <a
              className="footer-link"
              href="tel:0546733781"
              style={{
                display: "block", fontFamily: "var(--font-mono)", fontSize: 17,
                color: "hsl(38 22% 87%)", textDecoration: "none", marginBottom: 10,
              }}
            >
              <span dir="ltr">054-6733781</span>
            </a>
            <a
              className="footer-link"
              href="mailto:nofarlevi1988@gmail.com"
              style={{
                display: "block", fontFamily: "var(--font-mono)", fontSize: 17,
                color: "hsl(38 22% 87%)", textDecoration: "none",
              }}
            >
              nofarlevi1988@gmail.com
            </a>
          </div>

          <div
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "flex-start", gap: 22,
            }}
          >
            <a
              className="cta-btn"
              href="https://wa.me/9720546733781"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16,
                letterSpacing: "0.04em", padding: "16px 38px",
                background: "transparent", color: "hsl(38 22% 87%)",
                border: "1px solid hsl(36 14% 18%)", cursor: "pointer",
                textDecoration: "none", display: "inline-block",
              }}
            >
              {isHe ? "צרו קשר" : "Get in Touch"}
            </a>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase", letterSpacing: "0.15em",
                display: "flex", flexDirection: "column", gap: 7,
              }}
            >
              <span style={{ fontSize: 16, color: "hsl(38 22% 87%)" }}>
                {isHe ? "זמינה למשרות חדשות" : "Open to new positions"}
              </span>
              <span style={{ fontSize: 14, color: "hsl(35 12% 52%)" }}>
                © 2025 Nofar Levi Walastal
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

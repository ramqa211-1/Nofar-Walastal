import { createFileRoute } from "@tanstack/react-router";
import portraitAsset from "@/assets/nofar-portrait.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "נופר לוי ולסטל — רואת חשבון" },
      {
        name: "description",
        content:
          "כרטיס ביקור של נופר לוי ולסטל, רואת חשבון מוסמכת. ציון 95 בבחינת מועצת רואי החשבון, בוגרת מכללת \"כל המס\" בהצטיינות יתרה, ו-15 שנות ניסיון ניהולי בסונול.",
      },
      { property: "og:title", content: "נופר לוי ולסטל — רואת חשבון" },
      {
        property: "og:description",
        content: "מצוינות אקדמית לצד 15 שנות ניהול תפעולי בשטח.",
      },
      { property: "og:image", content: portraitAsset.url },
    ],
  }),
  component: Index,
});

const traits = [
  { n: "01", label: "חרוצה" },
  { n: "02", label: "שקדנית" },
  { n: "03", label: "פרפקציוניסטית" },
  { n: "04", label: "מ-א׳ עד ת׳" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans" dir="rtl">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 h-16 border-b border-border bg-background/85 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          <div className="font-display text-lg md:text-xl font-bold tracking-tight">
            נופר לוי ולסטל
          </div>
          <div className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest text-muted">
            <a href="#about" className="hover:text-accent transition-colors">01 / אודות</a>
            <a href="#education" className="hover:text-accent transition-colors">02 / השכלה</a>
            <a href="#experience" className="hover:text-accent transition-colors">03 / ניסיון</a>
            <a href="#contact" className="hover:text-accent transition-colors">04 / קשר</a>
          </div>
        </div>
      </nav>

      <main className="pt-28 md:pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Right (visual: first in DOM for RTL flow with sticky on side) */}
        <aside className="lg:col-span-5 order-first lg:order-last">
          <div className="lg:sticky lg:top-32">
            <figure className="w-full aspect-[3/4] overflow-hidden bg-stone-200 outline outline-1 -outline-offset-1 outline-black/5 animate-reveal">
              <img
                src={portraitAsset.url}
                alt="נופר לוי ולסטל — רואת חשבון"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                loading="eager"
              />
            </figure>
            <dl className="mt-8 space-y-3 font-mono text-[11px] uppercase tracking-tighter text-muted">
              <div className="flex justify-between border-b border-border pb-2">
                <dt>Role</dt>
                <dd className="text-foreground">CPA / רואת חשבון</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <dt>Education</dt>
                <dd className="text-foreground">Kol Hamas — 95</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <dt>Experience</dt>
                <dd className="text-foreground">15+ Years Mgmt</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <dt>Location</dt>
                <dd className="text-foreground">Hadera, IL</dd>
              </div>
            </dl>
          </div>
        </aside>

        {/* Left content */}
        <div className="lg:col-span-7 space-y-28 md:space-y-32">
          {/* Hero */}
          <section className="animate-reveal">
            <div className="mb-6 flex items-center gap-4 text-accent">
              <span className="font-mono text-sm tracking-tighter">Nofar Levi Walastal</span>
              <div className="h-px flex-1 bg-accent/30 animate-line" />
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 text-balance font-extrabold">
              רואת חשבון
              <br />
              <span className="text-muted/70">עם חזון ניהולי.</span>
            </h1>
            <p className="max-w-prose text-lg text-muted leading-relaxed text-pretty">
              שילוב יוצא דופן של מצוינות אקדמית — ציון <span className="text-foreground font-semibold">95</span> בבחינת מועצת רואי החשבון של מכללת "כל המס" — לצד 15 שנות ניסיון בניהול מערכות תפעוליות מורכבות. מומחיות בדיוק פיננסי לצד הבנה עסקית מהשטח.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-3 border border-foreground hover:bg-foreground hover:text-background transition-all duration-300 font-medium"
              >
                צרו קשר לתיאום פגישה
              </a>
              <a
                href="#experience"
                className="inline-flex items-center px-8 py-3 text-muted hover:text-foreground transition-colors font-medium"
              >
                קראו את הסיפור המלא ↓
              </a>
            </div>
          </section>

          {/* Traits */}
          <section id="about" className="animate-reveal">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {traits.map((t) => (
                <div key={t.n} className="p-4 border border-border flex flex-col gap-2 hover:border-accent transition-colors">
                  <span className="font-mono text-[10px] text-accent">{t.n}</span>
                  <span className="font-semibold text-base">{t.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* About paragraph */}
          <section className="animate-reveal">
            <h2 className="font-display text-3xl md:text-4xl mb-8 border-b border-border pb-4 font-bold">
              אודות
            </h2>
            <div className="space-y-5 text-lg text-muted leading-relaxed text-pretty max-w-prose">
              <p>
                חרוצה, שקדנית ופרפקציוניסטית. לוקחת כל משימה מ-א׳ עד ת׳ — מהבדיקה הראשונית של המסמך ועד לחתימה הסופית על הדוח.
              </p>
              <p>
                כמי שצמחה שנים רבות בעולם הניהול התפעולי והפיננסי בסונול, אני מבינה את המספרים שמאחורי הפעילות העסקית — לא רק כשורות במאזן, אלא כסיפור של עסק חי. השילוב הזה, בין מצוינות אקדמית טריה לבין ניסיון שטח רב-שנים, הוא הערך המוסף שאני מביאה לכל משרד ולכל לקוח.
              </p>
              <p className="text-foreground font-medium">
                יכולות ניהוליות מוכחות. יחסי אנוש גבוהים. עבודה לפי לוחות זמנים — תמיד.
              </p>
            </div>
          </section>

          {/* Education */}
          <section id="education" className="animate-reveal">
            <h2 className="font-display text-3xl md:text-4xl mb-8 border-b border-border pb-4 font-bold">
              השכלה והסמכה
            </h2>
            <div className="space-y-10">
              <article className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-mono text-sm text-muted italic">2024</div>
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold mb-2">מכללת "כל המס"</h3>
                  <p className="text-muted mb-4">הסמכת רואת חשבון. סיום בהצטיינות יתרה.</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl md:text-6xl font-display text-accent font-bold leading-none">95</span>
                    <span className="text-xs font-mono uppercase tracking-widest text-muted">
                      ציון בבחינת
                      <br />מועצת רואי החשבון
                    </span>
                  </div>
                </div>
              </article>

              <div className="h-px bg-border" />

              <article className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-mono text-sm text-muted italic">2009 — 2012</div>
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold mb-2">מדרשת רופין — המרכז האקדמי</h3>
                  <p className="text-muted">תואר ראשון בכלכלה ומנהל עסקים.</p>
                </div>
              </article>
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="animate-reveal">
            <h2 className="font-display text-3xl md:text-4xl mb-8 border-b border-border pb-4 font-bold">
              ניסיון תעסוקתי
            </h2>
            <div className="space-y-10">
              <article className="relative pr-8 border-r-2 border-accent/30">
                <div className="absolute top-1 -right-[7px] size-3 bg-accent rounded-full" />
                <div className="mb-1 font-mono text-xs text-muted">2009 — 2025 · 15+ שנים</div>
                <h3 className="text-xl font-bold">מנהלת תחנות דלק — סונול</h3>
                <p className="text-sm text-accent mt-1 mb-4">ספרינט מוטורוס בע"מ</p>
                <p className="text-muted leading-relaxed text-pretty mb-4">
                  ניהול שוטף של מערך תפעולי הכולל ניהול כוח אדם, מלאי, תקציבים, דוחות כספיים ובקרות. הובלת התחנה לתוצאות שיא תוך שמירה על סטנדרטים גבוהים של שירות ודיוק.
                </p>
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent/8 border border-accent/20">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">הוקרה</span>
                  <span className="text-sm font-medium">
                    זוכת תעודות "מנהלת מצטיינת" — מספר שנים ברציפות
                  </span>
                </div>
              </article>
            </div>
          </section>

          {/* Skills */}
          <section className="animate-reveal">
            <h2 className="font-display text-3xl md:text-4xl mb-8 border-b border-border pb-4 font-bold">
              כישורים ויכולות
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">פיננסי</h4>
                <p className="text-muted">בקרת תקציב, ניתוח דוחות כספיים, הכנת דוחות, היכרות עם מיסוי חברות ויחידים.</p>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">ניהול</h4>
                <p className="text-muted">ניהול מוכח של מערכות גדולות, הובלת צוותים, ויכולות בין-אישיות גבוהות.</p>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">כלים</h4>
                <p className="text-muted">Microsoft Office · Excel · Word · Outlook.</p>
              </div>
              <div>
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">שפות</h4>
                <p className="text-muted">עברית — שפת אם.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Contact */}
      <footer id="contact" className="mt-16 border-t border-foreground bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">/ 04 — יצירת קשר</span>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-none">
              בואו נדבר.
            </h2>
            <div className="flex flex-col gap-3 font-mono text-base md:text-lg pt-4">
              <a href="tel:0546733781" className="hover:text-accent transition-colors w-fit" dir="ltr">
                054-6733781
              </a>
              <a
                href="mailto:nofarlevi1988@gmail.com"
                className="hover:text-accent transition-colors w-fit"
              >
                nofarlevi1988@gmail.com
              </a>
              <span className="opacity-50 text-sm pt-2">שניר 10, חדרה</span>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6 text-xs font-mono uppercase tracking-[0.2em] opacity-50">
            <span>זמינה למשרות חדשות</span>
            <span>© {new Date().getFullYear()} Nofar Levi Walastal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

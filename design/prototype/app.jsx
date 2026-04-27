// App.jsx — Aurora body dashboard

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "regular",
  "accent": "#4a8a3a",
  "period": "90d"
}/*EDITMODE-END*/;

function pct(a, b) { return Math.min(100, Math.max(0, (a / b) * 100)); }
function signed(n, digits = 1) {
  const s = n.toFixed(digits);
  return n > 0 ? `+${s}` : s;
}
function todayLong() {
  const d = new Date('2026-04-27');
  const wd = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
  const m = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  return `${wd[d.getDay()]}, ${d.getDate()} ${m[d.getMonth()]}`;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-density', t.density);
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.theme, t.density, t.accent]);

  const weightDelta30 = TODAY.weight - MONTH_AGO.weight;
  const fatDelta30 = TODAY.fatKg - MONTH_AGO.fatKg;
  const muscleDelta30 = TODAY.muscleKg - MONTH_AGO.muscleKg;

  return (
    <div className="shell">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="head" data-screen-label="Header">
        <div className="head-l">
          <div className="head-mark">Aurora · 001</div>
          <h1 className="head-title">Lichaams<em>journaal</em></h1>
        </div>
        <div className="head-c">
          <div className="head-date">27 · 04 · 2026</div>
          <div className="head-day">{todayLong()}</div>
        </div>
        <div className="head-r">
          <div className="period" role="tablist">
            {['7d','30d','90d'].map(p => (
              <button key={p} role="tab"
                      className={t.period === p ? 'active' : ''}
                      onClick={() => setTweak('period', p)}>
                {p}
              </button>
            ))}
          </div>
          <button className="theme-btn" aria-label="Thema wisselen"
                  onClick={() => setTweak('theme', t.theme === 'light' ? 'dark' : 'light')}>
            {t.theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      <div className="grid">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="card col-7" data-screen-label="01 Hero · Gewicht & samenstelling">
          <div className="card-hd">
            <h3>Vandaag</h3>
            <span className="meta">Index · Spier · Vet</span>
          </div>
          <div className="hero">
            <div>
              <div className="hero-lbl">Lichaamsgewicht</div>
              <div className="hero-num">
                <span className="n">{TODAY.weight.toFixed(1)}</span>
                <span className="u">kg</span>
              </div>
              <div className="hero-deltas">
                <div className="hero-delta">
                  <span className="k">7 dagen</span>
                  <span className={`v ${TODAY.weight - WEEK_AGO.weight < 0 ? 'pos' : 'neg'}`}>
                    {signed(TODAY.weight - WEEK_AGO.weight)}
                  </span>
                </div>
                <div className="hero-delta">
                  <span className="k">30 dagen</span>
                  <span className={`v ${weightDelta30 < 0 ? 'pos' : 'neg'}`}>
                    {signed(weightDelta30)}
                  </span>
                </div>
                <div className="hero-delta">
                  <span className="k">BMI</span>
                  <span className="v">{BMI}</span>
                </div>
              </div>
            </div>
            <div className="hero-side">
              <div className="hero-lbl">Samenstelling</div>
              <div className="bcomp">
                <div className="bcomp-row">
                  <span className="bcomp-lbl">Spier</span>
                  <div className="bcomp-bar">
                    <i className="bcomp-fill muscle" style={{ '--w': `${TODAY.musclePct * 1.6}%` }} />
                  </div>
                  <span className="bcomp-val">{TODAY.musclePct}<sub>%</sub></span>
                </div>
                <div className="bcomp-row">
                  <span className="bcomp-lbl">Vet</span>
                  <div className="bcomp-bar">
                    <i className="bcomp-fill fat" style={{ '--w': `${TODAY.fatPct * 2.5}%` }} />
                  </div>
                  <span className="bcomp-val">{TODAY.fatPct}<sub>%</sub></span>
                </div>
                <div className="bcomp-row">
                  <span className="bcomp-lbl">Water</span>
                  <div className="bcomp-bar">
                    <i className="bcomp-fill water" style={{ '--w': `${TODAY.waterPct}%` }} />
                  </div>
                  <span className="bcomp-val">{TODAY.waterPct}<sub>%</sub></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Today rail ────────────────────────────────────────── */}
        <aside className="card col-5" data-screen-label="02 Vandaag · Herstel">
          <div className="card-hd">
            <h3>Herstel</h3>
            <span className="meta">Laatste 24u</span>
          </div>
          <div className="rail">
            <div className="rail-row">
              <span className="k">Slaap</span>
              <span className="v">{READINESS.sleep.hours}<small>u</small></span>
              <div className="pbar"><i style={{ width: `${pct(READINESS.sleep.hours, READINESS.sleep.target)}%` }} /></div>
              <div className="sub">Doel {READINESS.sleep.target}u · <span className="neg">−0.6u</span></div>
            </div>
            <div className="rail-row">
              <span className="k">Rusthartslag</span>
              <span className="v">{READINESS.rhr.value}<small>bpm</small></span>
              <div className="sub">7d gemiddelde · <span className="pos">{signed(READINESS.rhr.delta, 0)} bpm</span></div>
            </div>
            <div className="rail-row">
              <span className="k">HRV</span>
              <span className="v">{READINESS.hrv.value}<small>ms</small></span>
              <div className="sub">7d gemiddelde · <span className="pos">{signed(READINESS.hrv.delta, 0)} ms</span></div>
            </div>
            <div className="rail-row">
              <span className="k">Stappen</span>
              <span className="v">{READINESS.steps.value.toLocaleString('nl-NL')}</span>
              <div className="pbar"><i style={{ width: `${pct(READINESS.steps.value, READINESS.steps.target)}%` }} /></div>
              <div className="sub">Doel {READINESS.steps.target.toLocaleString('nl-NL')}</div>
            </div>
          </div>
        </aside>

        {/* ── Trend ─────────────────────────────────────────────── */}
        <section className="card col-12" data-screen-label="03 Trend · 90 dagen">
          <div className="card-hd">
            <h3>Trend</h3>
            <span className="meta">
              {t.period === '7d' ? '7 dagen' : t.period === '30d' ? '30 dagen' : '90 dagen'} ·
              {' '}{signed(weightDelta30)}kg gewicht ·
              {' '}<span style={{ color: 'var(--accent)' }}>{signed(muscleDelta30)}kg spier</span> ·
              {' '}<span style={{ color: 'var(--warn)' }}>{signed(fatDelta30)}kg vet</span>
            </span>
          </div>
          <TrendChart data={TREND} focus={t.period} />
        </section>

        {/* ── Nutrition ring + macros ──────────────────────────── */}
        <section className="card col-7" data-screen-label="04 Voeding · Vandaag">
          <div className="card-hd">
            <h3>Voeding vandaag</h3>
            <span className="meta">{NUTRITION_TODAY.kcal.eaten} / {NUTRITION_TODAY.kcal.target} kcal</span>
          </div>
          <div className="macro-ring-wrap">
            <MacroRing eaten={NUTRITION_TODAY.kcal.eaten} target={NUTRITION_TODAY.kcal.target} />
            <div className="macros">
              <MacroBar name="Eiwit"   k="protein" eaten={NUTRITION_TODAY.protein.eaten} target={NUTRITION_TODAY.protein.target} unit="g" />
              <MacroBar name="Koolhydr." k="carbs" eaten={NUTRITION_TODAY.carbs.eaten} target={NUTRITION_TODAY.carbs.target} unit="g" />
              <MacroBar name="Vet"     k="fat"    eaten={NUTRITION_TODAY.fat.eaten}    target={NUTRITION_TODAY.fat.target}    unit="g" />
              <MacroBar name="Water"   k="protein" eaten={NUTRITION_TODAY.water.eaten} target={NUTRITION_TODAY.water.target} unit="L" decimals={1} />
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--rule)' }}>
            <div className="card-hd" style={{ marginBottom: 8 }}>
              <h3 style={{ fontSize: 18 }}>Maaltijden</h3>
              <span className="meta">{NUTRITION_TODAY.meals.length} ingelogd</span>
            </div>
            <div className="meals">
              {NUTRITION_TODAY.meals.map((m, i) => (
                <div key={i} className="meal">
                  <span className="meal-time">{m.time}</span>
                  <div className="meal-name">
                    {m.name}
                    <small>P {m.p}g · K {m.c}g · V {m.f}g</small>
                  </div>
                  <span className="meal-kcal">{m.kcal}<sub>kcal</sub></span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Kcal week + measurements ─────────────────────────── */}
        <section className="card col-5" data-screen-label="05 Energie · Week">
          <div className="card-hd">
            <h3>Energie</h3>
            <span className="meta">Laatste 7 dagen</span>
          </div>
          <KcalSpark values={KCAL_WEEK} labels={KCAL_LABELS} target={NUTRITION_TODAY.kcal.target} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--rule)' }}>
            <Stat label="Gem. dag" value={Math.round(KCAL_WEEK.reduce((a,b) => a+b, 0) / 7)} unit="kcal" />
            <Stat label="Doel" value={NUTRITION_TODAY.kcal.target} unit="kcal" />
            <Stat label="Saldo" value={signed(Math.round(KCAL_WEEK.reduce((a,b) => a+b, 0) / 7) - NUTRITION_TODAY.kcal.target, 0)} unit="kcal" tone={Math.round(KCAL_WEEK.reduce((a,b) => a+b, 0) / 7) - NUTRITION_TODAY.kcal.target < 0 ? 'pos' : 'neg'} />
          </div>
        </section>

        <section className="card col-12" data-screen-label="06 Lichaamsmaten">
          <div className="card-hd">
            <h3>Lichaamsmaten</h3>
            <span className="meta">Laatste meting · {fmtFull(TODAY.date)}</span>
          </div>
          <div className="meas-grid">
            {MEASUREMENTS.map((m, i) => (
              <div key={i} className="meas-cell">
                <span className="lbl">{m.label}</span>
                <div className="row">
                  <span className="v">{m.value}<span className="u" style={{ marginLeft: 4 }}>{m.unit}</span></span>
                  <span className={`d ${m.delta < 0 ? 'pos' : m.delta > 0 ? 'pos' : 'neg'}`} style={{ color: (m.label === 'Taille' || m.label === 'Heup') ? (m.delta < 0 ? 'var(--accent)' : 'var(--warn)') : (m.delta > 0 ? 'var(--accent)' : 'var(--warn)') }}>
                    {signed(m.delta)} {m.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Strength placeholder ─────────────────────────────── */}
        <section className="card col-12" data-screen-label="07 Krachttraining">
          <div className="card-hd">
            <h3>Krachttraining</h3>
            <span className="meta">Recente sessies</span>
          </div>
          <div className="lifts">
            {STRENGTH_RECENT.map((s, i) => (
              <div key={i} className="lift-row">
                <span className="lift-date">
                  <b>{liftDay(s.date)}</b>
                  {liftMonth(s.date)}
                </span>
                <div className="lift-name">
                  {s.name}
                  <small>{s.lifts.join(' · ')}</small>
                </div>
                <div className="lift-stat">
                  <span className="k">Volume</span>
                  <span className="v">{(s.volume/1000).toFixed(1)}<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', marginLeft: 3 }}>t</span></span>
                </div>
                <span className={`lift-pr ${s.prs === 0 ? 'zero' : ''}`}>
                  {s.prs > 0 ? `${s.prs} PR` : '—'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="foot">
        <span>Aurora · Persoonlijk · {PROFILE.height} cm · sinds {fmtMonthYear(PROFILE.startDate)}</span>
        <span>Volgende meting · Wo 29 apr</span>
      </footer>

      {/* ── Tweaks ─────────────────────────────────────────────── */}
      <TweaksPanel title="Aurora">
        <TweakSection label="Weergave" />
        <TweakRadio label="Thema" value={t.theme}
                    options={['light','dark']}
                    onChange={(v) => setTweak('theme', v)} />
        <TweakRadio label="Dichtheid" value={t.density}
                    options={['compact','regular','comfy']}
                    onChange={(v) => setTweak('density', v)} />
        <TweakSection label="Accent" />
        <TweakColor label="Kleur" value={t.accent}
                    onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Periode" />
        <TweakRadio label="Trendvenster" value={t.period}
                    options={['7d','30d','90d']}
                    onChange={(v) => setTweak('period', v)} />
      </TweaksPanel>
    </div>
  );
}

// ── Sub components ───────────────────────────────────────────────

function MacroRing({ eaten, target }) {
  const r = 72, c = 2 * Math.PI * r;
  const p = pct(eaten, target);
  const offset = c - (p / 100) * c;
  return (
    <div className="ring">
      <svg viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} className="ring-track" strokeWidth="10" />
        <circle cx="90" cy="90" r={r} className="ring-fill"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="ring-center">
        <span className="n">{eaten}</span>
        <span className="l">kcal</span>
        <span className="s">van {target}</span>
      </div>
    </div>
  );
}

function MacroBar({ name, k, eaten, target, unit, decimals = 0 }) {
  const p = pct(eaten, target);
  return (
    <div className="macro-row">
      <div className="top">
        <span className="name">{name}</span>
        <span className="v">
          {decimals ? eaten.toFixed(decimals) : eaten}{unit}
          <small>/ {decimals ? target.toFixed(decimals) : target}{unit}</small>
        </span>
      </div>
      <div className={`macro-bar ${k}`}><i style={{ width: `${p}%` }} /></div>
    </div>
  );
}

function KcalSpark({ values, labels, target }) {
  const max = Math.max(...values, target) * 1.05;
  return (
    <>
      <div className="spark" style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 0, right: 0,
          top: `${100 - (target / max) * 100}%`,
          borderTop: '1px dashed var(--rule-2)',
          fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-3)',
          paddingLeft: 4, transform: 'translateY(-100%)',
        }}>doel {target}</span>
        {values.map((v, i) => (
          <div key={i} className={`bar${i === values.length - 1 ? ' today' : ''}`}
               data-v={`${v} kcal`}
               style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
      <div className="spark-labels">
        {labels.map((l, i) => (
          <span key={i} className={i === labels.length - 1 ? 'today' : ''}>{l}</span>
        ))}
      </div>
    </>
  );
}

function Stat({ label, value, unit, tone }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: tone === 'pos' ? 'var(--accent)' : tone === 'neg' ? 'var(--warn)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
        {typeof value === 'number' ? value.toLocaleString('nl-NL') : value}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', marginLeft: 4 }}>{unit}</span>
      </span>
    </div>
  );
}

// Date helpers
function liftDay(iso) { return new Date(iso).getDate(); }
function liftMonth(iso) {
  const m = ['JAN','FEB','MRT','APR','MEI','JUN','JUL','AUG','SEP','OKT','NOV','DEC'];
  return m[new Date(iso).getMonth()];
}
function fmtMonthYear(iso) {
  const m = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const d = new Date(iso);
  return `${m[d.getMonth()]} ${d.getFullYear()}`;
}

function MoonIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
}
function SunIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
}

window.App = App;

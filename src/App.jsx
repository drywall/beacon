import React, { useState, useMemo, useEffect, useRef } from "react";

import { DATA, META } from "./data";
const C = {
  coralLt: "#f58758", coral: "#f56c31", slate: "#3A4F66", navy: "#192a3d",
  grey: "#e6e7e8", teal: "#0a78a7", paper: "#FAFBFC", white: "#ffffff",
  wash: "rgba(245,135,88,0.12)", washStrong: "rgba(245,135,88,0.22)",
  coralText: "#bd571b", coralDot: "#e85f30",
};
const SERIF = '"Requiem Text","Requiem","Hoefler Text","Iowan Old Style",Georgia,serif';
const SANS  = 'avenir-next-lt-pro,"Avenir Next","Segoe UI",system-ui,sans-serif';
const MONO  = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

const PILLARS = [
  { key: "health",      label: "Health & Longevity",          short: "Health",      hue: "#42A1B8" },
  { key: "development", label: "Material & Human Development", short: "Development", hue: "#77C7A1" },
  { key: "safety",      label: "Safety",                      short: "Safety",      hue: "#D1BCA3" },
  { key: "power",       label: "Power & Influence",           short: "Power",       hue: "#f58758" },
  { key: "freedom",     label: "Freedom & Rights",            short: "Freedom",     hue: "#CD90D6" },
  { key: "governance",  label: "Governance & Integrity",      short: "Governance",  hue: "#1d77a1" },
];
const TIERS = [
  { name: "Very high",    color: "#0a78a7" },
  { name: "High",         color: "#3A4F66" },
  { name: "Upper-middle", color: "#6e8fb0" },
  { name: "Lower-middle", color: "#f58758" },
  { name: "Lower",        color: "#f56c31" },
];
const PK = PILLARS.map((p) => p.key);
const EQUAL = PILLARS.reduce((o, p) => ((o[p.key] = 50), o), {});
const VALID_REGIONS = new Set(["All", ...new Set(DATA.map((d) => d.region))]);

// Read a shared config from the URL query string. Every field is validated and
// missing/invalid fields are simply omitted, so callers fall back per-field.
function parseConfig() {
  if (typeof window === "undefined") return {};
  const sp = new URLSearchParams(window.location.search);
  const cfg = {};
  const w = sp.get("w");
  if (w) {
    const parts = w.split(",");
    if (parts.length === PK.length) {
      const wObj = {};
      const ok = parts.every((s, i) => {
        const n = Number(s);
        if (s.trim() === "" || !Number.isFinite(n) || n < 0 || n > 100) return false;
        wObj[PK[i]] = Math.round(n);
        return true;
      });
      if (ok) cfg.weights = wObj;
    }
  }
  const mode = sp.get("mode");
  if (mode === "geometric" || mode === "arithmetic") cfg.mode = mode;
  const region = sp.get("region");
  if (region && VALID_REGIONS.has(region)) cfg.region = region;
  const bands = sp.get("bands");
  if (bands === "1" || bands === "0") cfg.showBands = bands === "1";
  return cfg;
}

// Serialize the current config to a query string. Region is omitted when "All"
// to keep the common case tidy; weights are in PILLAR order.
function buildQuery(weights, mode, region, showBands) {
  const sp = new URLSearchParams();
  sp.set("w", PK.map((k) => weights[k]).join(","));
  sp.set("mode", mode);
  if (region !== "All") sp.set("region", region);
  sp.set("bands", showBands ? "1" : "0");
  return sp.toString();
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to legacy path */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

function composite(p, w, mode) {
  const S = PK.reduce((a, k) => a + w[k], 0);
  if (S <= 0) return 0;
  if (mode === "arithmetic") return PK.reduce((a, k) => a + w[k] * p[k], 0) / S;
  return Math.exp(PK.reduce((a, k) => a + w[k] * Math.log(p[k]), 0) / S);
}

function Radar({ p, w = 320, h = 252 }) {
  const cx = w / 2, cy = h / 2, R = 68;
  const ang = (i) => -Math.PI / 2 + i * (Math.PI / 3);
  const ringPts = (f) => PILLARS.map((_, i) => `${cx + R * f * Math.cos(ang(i))},${cy + R * f * Math.sin(ang(i))}`).join(" ");
  const dataPts = PILLARS.map((pl, i) => {
    const r = R * (p[pl.key] / 100);
    return [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
  });
  return (
    <svg width={w} height={h} style={{ display: "block" }} role="img" aria-label={"Radar chart of six pillar scores. " + PILLARS.map((pl) => `${pl.label} ${Math.round(p[pl.key])}`).join(", ") + ", each out of 100."}>
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={ringPts(f)} fill="none" stroke={C.grey} strokeWidth="1" />)}
      {PILLARS.map((pl, i) => <line key={pl.key} x1={cx} y1={cy} x2={cx + R * Math.cos(ang(i))} y2={cy + R * Math.sin(ang(i))} stroke={C.grey} strokeWidth="1" />)}
      <polygon points={dataPts.map((d) => d.join(",")).join(" ")} fill="rgba(245,135,88,0.22)" stroke={C.coral} strokeWidth="2" />
      {dataPts.map((d, i) => <circle key={i} cx={d[0]} cy={d[1]} r="3.2" fill={PILLARS[i].hue} />)}
      {PILLARS.map((pl, i) => {
        const lx = cx + (R + 16) * Math.cos(ang(i)), ly = cy + (R + 16) * Math.sin(ang(i));
        return <text key={pl.key} x={lx} y={ly} fontSize="8.5" fill={C.slate} fontFamily={MONO} letterSpacing="0.3"
          style={{ textTransform: "uppercase" }}
          textAnchor={Math.abs(Math.cos(ang(i))) < 0.3 ? "middle" : (Math.cos(ang(i)) > 0 ? "start" : "end")}
          dominantBaseline="middle">{pl.short} {Math.round(p[pl.key])}</text>;
      })}
    </svg>
  );
}

// worse placement (lower score) on the LEFT, better (higher score) on the RIGHT
function Band({ p5, p95, median, current, n }) {
  const x = (r) => ((n - r) / (n - 1)) * 100;
  const left = x(p95), right = x(p5);
  return (
    <span style={{ position: "relative", display: "block", height: 16 }}>
      <span style={{ position: "absolute", top: 7, left: 0, right: 0, height: 2, background: C.grey }} />
      <span style={{ position: "absolute", top: 5, left: `${left}%`, width: `${Math.max(1.5, right - left)}%`, height: 6, background: "rgba(245,135,88,0.5)", borderRadius: 3 }} />
      <span style={{ position: "absolute", top: 3, left: `${x(median)}%`, width: 2, height: 10, background: C.slate, transform: "translateX(-1px)" }} />
      <span style={{ position: "absolute", top: 2, left: `${x(current)}%`, width: 10, height: 10, borderRadius: "50%", background: C.coralDot, border: "2px solid #fff", transform: "translate(-5px,0)", boxShadow: "0 1px 2px rgba(0,0,0,.3)" }} />
    </span>
  );
}

const fmt = (n, d = 0) => n == null ? "—" : Number(n).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: d });

const eyebrow = { fontFamily: MONO, fontSize: 10.5, letterSpacing: 2, textTransform: "uppercase", color: C.coralText, fontWeight: 700 };

export default function App() {
  const initial = useMemo(() => parseConfig(), []);
  const [tab, setTab] = useState("rankings");
  const [weights, setWeights] = useState(initial.weights ?? { ...EQUAL });
  const [mode, setMode] = useState(initial.mode ?? "geometric");
  const [region, setRegion] = useState(initial.region ?? "All");
  const [expanded, setExpanded] = useState(null);
  const [showBands, setShowBands] = useState(initial.showBands ?? true);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false); // controls collapse, mobile only
  const headRef = useRef(null);
  const [headH, setHeadH] = useState(92); // measured site-header height; sticky offset for the controls

  useEffect(() => {
    const measure = () => headRef.current && setHeadH(headRef.current.offsetHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "BEACON — Byrne Evaluation And Comparison Of Nations";
    const add = (id, attrs) => {
      if (document.getElementById(id)) return;
      const l = document.createElement("link");
      l.id = id;
      Object.assign(l, attrs);
      document.head.appendChild(l);
    };
    // Warm up the Typekit connection before the kit CSS / font files are requested.
    add("tk-preconnect", { rel: "preconnect", href: "https://use.typekit.net", crossOrigin: "anonymous" });
    add("tk-preconnect-css", { rel: "preconnect", href: "https://use.typekit.net" });
    add("tk-hypatia", { rel: "stylesheet", href: "https://use.typekit.net/zjz8ltj.css" });
  }, []);

  // Keep the address bar in sync with the current config so it can be bookmarked,
  // refreshed, and shared via the back/forward stack.
  useEffect(() => {
    const qs = buildQuery(weights, mode, region, showBands);
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [weights, mode, region, showBands]);

  const shareConfig = async () => {
    const qs = buildQuery(weights, mode, region, showBands);
    const url = `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
    if (await copyText(url)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const N = DATA.length;
  const regions = ["All", ...Array.from(new Set(DATA.map((d) => d.region))).sort()];

  const scored = useMemo(() => {
    const s = DATA.map((d) => ({ ...d, score: composite(d.p, weights, mode) }));
    s.sort((a, b) => b.score - a.score);
    s.forEach((d, i) => { d.rank = i + 1; d.tier = Math.min(4, Math.floor((i / N) * 5)); });
    return s;
  }, [weights, mode, N]);

  const bands = useMemo(() => {
    const draws = 500, ranks = DATA.map(() => []);
    for (let d = 0; d < draws; d++) {
      const w = {}; PK.forEach((k) => (w[k] = Math.random()));
      const arr = DATA.map((row, i) => ({ i, sc: composite(row.p, w, mode) }));
      arr.sort((a, b) => b.sc - a.sc);
      arr.forEach((x, idx) => ranks[x.i].push(idx + 1));
    }
    const o = {};
    DATA.forEach((row, i) => {
      const r = ranks[i].sort((a, b) => a - b);
      o[row.iso] = { p5: r[Math.floor(0.05 * draws)], p95: r[Math.floor(0.95 * draws)], median: r[Math.floor(0.5 * draws)] };
    });
    return o;
  }, [mode]);

  const us = scored.find((d) => d.iso === "USA");
  const shown = region === "All" ? scored : scored.filter((d) => d.region === region);
  const setW = (k, v) => setWeights((w) => ({ ...w, [k]: v }));

  const tabBtn = (id, label) => (
    <button onClick={() => { setTab(id); }} aria-current={tab === id ? "page" : undefined} style={{
      fontFamily: SANS, fontSize: 12.5, letterSpacing: 1.5, textTransform: "uppercase", padding: "7px 2px", marginRight: 26, cursor: "pointer",
      background: "transparent", border: "none", borderBottom: `3px solid ${tab === id ? "#fff" : "transparent"}`,
      color: "#fff", opacity: tab === id ? 1 : 0.7, fontWeight: 700,
    }}>{label}</button>
  );
  const sectionTitle = (txt) => (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ fontFamily: SERIF, fontSize: 22, color: C.navy, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>{txt}</h2>
      <div style={{ height: 3, width: 46, background: C.coralLt, marginTop: 6, borderRadius: 2 }} />
    </div>
  );

  return (
    <div style={{ background: C.paper, color: C.slate, fontFamily: SANS, minHeight: "100%" }}>
      <style>{`
        @font-face{font-family:"Requiem Text";src:url("/fonts/RequiemText-HTF-Roman.woff2") format("woff2"),url("https://byrnecreative.com/wp-content/uploads/2022/02/RequiemText-HTF-Roman.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap;}
        @font-face{font-family:"Requiem Text";src:url("/fonts/RequiemText-HTF-Italic.woff2") format("woff2"),url("https://byrnecreative.com/wp-content/uploads/2022/02/RequiemText-HTF-Italic.woff2") format("woff2");font-weight:400;font-style:italic;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/f8d87f/00000000000000003b9adaa2/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3") format("woff2");font-weight:400;font-style:normal;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/14e069/00000000000000003b9ada9b/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2");font-weight:700;font-style:normal;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/a40319/00000000000000003b9ada9f/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3") format("woff2");font-weight:400;font-style:italic;font-display:swap;}
        @font-face{font-family:"hypatia-sans-pro";src:url("https://use.typekit.net/af/197554/00000000000000003b9ada9c/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3") format("woff2");font-weight:700;font-style:italic;font-display:swap;}
        input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:24px;background:transparent;cursor:pointer;margin:0;}
        input[type=range]::-webkit-slider-runnable-track{height:4px;border-radius:4px;background:${C.grey};}
        input[type=range]::-moz-range-track{height:4px;border-radius:4px;background:${C.grey};}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;margin-top:-6px;border-radius:50%;background:${C.coral};cursor:pointer;border:2px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,.25);}
        input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:${C.coral};cursor:pointer;border:2px solid #fff;}
        input[type=range]:focus-visible{outline:2px solid ${C.navy};outline-offset:3px;border-radius:4px;}
        a:focus-visible,button:focus-visible,select:focus-visible,input[type=checkbox]:focus-visible{outline:2px solid ${C.navy};outline-offset:2px;border-radius:3px;}
        .rowbtn{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:0;font-family:${SANS};color:${C.navy};scroll-margin-top:104px;}
        .rowbtn:hover{background:${C.wash};}
        .rowbtn:focus-visible{outline:2px solid ${C.navy};outline-offset:-2px;}
        .sharebtn{margin-top:12px;width:100%;font-family:${SANS};font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700;padding:9px 4px;cursor:pointer;border-radius:6px;border:1px solid #0a78a7;background:transparent;color:#0a78a7;display:flex;align-items:center;justify-content:center;gap:7px;transition:background 120ms,color 120ms;}
        .sharebtn:hover,.sharebtn.copied{background:#0a78a7;color:#fff;}
        .bcn-toggle{display:none;background:none;border:none;cursor:pointer;padding:6px;margin:-6px;color:${C.navy};}
        a{color:${C.teal};}
        .sr-only{position:absolute !important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
        @media (max-width:520px){
          .bcn-head-band{display:none;}
          .bcn-detail{padding-left:18px !important;}
          .bcn-row{flex-wrap:wrap;row-gap:8px;}
          .bcn-pill{order:2;}
          .bcn-score{order:3;}
          .bcn-band{width:100% !important;padding-left:0 !important;order:4;}
          .bcn-toggle{display:inline-flex !important;align-items:center;}
          .bcn-collapsible.collapsed{display:none;}
          .bcn-collapsible{max-height:calc(100vh - var(--bcn-head-h, 92px) - 84px);max-height:calc(100dvh - var(--bcn-head-h, 92px) - 84px);overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
        }
      `}</style>

      {/* header */}
      <div ref={headRef} style={{ background: "linear-gradient(180deg, #ec6e40 0%, #e85f30 100%)", position: "sticky", top: 0, zIndex: 20, borderBottom: `1px solid rgba(25,42,61,0.12)` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 20px 0" }}>
          <div style={{ fontFamily: SERIF, color: "#fff", fontSize: 26, fontWeight: 600, letterSpacing: 0.3 }}>
            BEACON: Byrne Evaluation And Comparison Of Nations
          </div>
          <div style={{ marginTop: 12 }}>{tabBtn("rankings", "Rankings")}{tabBtn("methodology", "Methodology")}{tabBtn("about", "About")}</div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 20px 70px" }}>

        {tab === "rankings" && <>
          <div className="sr-only" aria-live="polite">{`Rankings updated. ${shown.length} countries shown${shown[0] ? `, led by ${shown[0].c}` : ""}.${us ? ` United States ranks ${us.rank} of ${N} overall.` : ""}`}</div>
          {/* intro */}
          <div style={{ maxWidth: 1180, marginBottom: 40 }}>
            <h1 style={{ fontFamily: SERIF, fontSize: 36, lineHeight: 1.1, margin: "6px 0 16px", fontWeight: 400, color: C.navy, fontStyle: "italic" }}>
              Greatest country on earth? You decide.
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.62, margin: "0 0 12px" }}>
              Even now, Americans hear it regularly: the United States is the greatest country on earth. But is it? And what does that even mean?
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.62, margin: "0 0 12px" }}>
              The answer depends on what you value — and how you balance those values against each other. Global might? Material wealth? Personal freedom? It’s up for debate.&nbsp;
              <strong style={{ color: C.navy }}>BEACON</strong> allows you to weight six pillars of national performance and well-being as you see fit: health and longevity, material and human development, freedom and rights, safety, governance and integrity, and a country’s global power and influence.
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.62, margin: "0 0 18px" }}>
              Below are {N} countries scored on those six pillars from reputable sources. You decide how much each pillar counts. The rankings then update as you go.
            </p>
          </div>

          <div style={{ display: "flex", gap: 26, flexWrap: "wrap", alignItems: "flex-start" }}>
            {/* controls — raised above the scrolling list so nothing bleeds through */}
            <div className="bcn-controls" style={{ flex: "1 1 290px", minWidth: 270, position: "sticky", top: headH, zIndex: 10, background: C.paper, "--bcn-head-h": `${headH}px` }}>
              <div style={{ background: "#fff", border: `1px solid ${C.grey}`, borderRadius: 10, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <h2 style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.navy, margin: 0 }}>Weigh the Pillars</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <button onClick={() => setWeights({ ...EQUAL })} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: C.coralText, background: "none", border: "none", cursor: "pointer", padding: "7px 8px", margin: "-7px -8px", fontWeight: 700 }}>Reset</button>
                    <button className="bcn-toggle" aria-expanded={panelOpen} aria-controls="bcn-controls-body" aria-label={panelOpen ? "Collapse pillar controls" : "Expand pillar controls"} onClick={() => setPanelOpen((o) => !o)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: panelOpen ? "rotate(180deg)" : "none", transition: "transform 150ms" }}><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                  </div>
                </div>
                <div id="bcn-controls-body" className={`bcn-collapsible${panelOpen ? "" : " collapsed"}`}>
                <div style={{ height: 3, width: 40, background: C.coralLt, borderRadius: 2, marginBottom: 12 }} />
                <p style={{ fontSize: 12, color: C.slate, margin: "0 0 14px" }}>Equal weights aren’t neutral — they assert each pillar matters the same. Your call.</p>
                {PILLARS.map((p) => (
                  <div key={p.key} style={{ marginBottom: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: p.hue }} />{p.label}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 12, color: C.slate }}>{weights[p.key]}</span>
                    </div>
                    <input type="range" min="0" max="100" value={weights[p.key]} aria-label={`Weight for ${p.label}`} style={{ width: "100%" }} onChange={(e) => setW(p.key, +e.target.value)} />
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.grey}`, marginTop: 10, paddingTop: 13 }}>
                  <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.navy, marginBottom: 10, marginTop: 0 }}>How pillars combine</h3>
                  <div style={{ display: "flex", gap: 6, marginBottom: 11 }}>
                    {[["geometric", "Geometric"], ["arithmetic", "Arithmetic"]].map(([v, l]) => (
                      <button key={v} onClick={() => setMode(v)} aria-pressed={mode === v} style={{ flex: 1, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, fontFamily: SANS, padding: "7px 4px", cursor: "pointer", borderRadius: 6, border: `1px solid ${mode === v ? C.coralText : C.grey}`, background: mode === v ? C.coralText : "#fff", color: mode === v ? "#fff" : C.slate }}>{l}</button>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.45, marginBottom: 13 }}>
                    {mode === "geometric" ? "Geometric mean penalizes imbalance — no riding one stellar pillar while flunking another." : "Arithmetic mean lets a strong pillar fully offset a weak one."}
                  </div>
                  <label htmlFor="bcn-region" style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: C.navy, marginBottom: 6 }}>Region</label>
                  <select id="bcn-region" value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: "100%", fontSize: 13, padding: "6px 8px", borderRadius: 6, border: `1px solid ${C.grey}`, background: "#fff", marginBottom: 12, fontFamily: SANS, color: C.navy }}>
                    {regions.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: C.slate, minHeight: 24, padding: "4px 0" }}>
                    <input type="checkbox" checked={showBands} onChange={(e) => setShowBands(e.target.checked)} />Show rank-uncertainty bands
                  </label>
                  <button onClick={shareConfig} aria-live="polite" className={`sharebtn${copied ? " copied" : ""}`}>
                    {copied ? "Link copied" : "Share settings"}
                    {copied ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                    )}
                  </button>
                </div>
                </div>
              </div>
            </div>

            {/* rankings */}
            <div style={{ flex: "2 1 560px", minWidth: 340, position: "relative", zIndex: 1 }}>
              {showBands && (
                <div style={{ background: C.wash, border: `1px solid ${C.grey}`, borderLeft: `3px solid ${C.coralLt}`, borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12.5, color: C.slate, lineHeight: 1.5 }}>
                  The bar spans where each country lands across 500 random weightings. Short bar = robust rank; long bar = mostly an artifact of weighting. The <span style={{ color: C.coralDot, fontWeight: 700 }}>●</span> marks its rank under your current weights. Click any country for details.
                </div>
              )}
              <div style={{ background: "#fff", border: `1px solid ${C.grey}`, borderRadius: 10, overflow: "hidden" }}>
                <div className="bcn-head" style={{ display: "flex", alignItems: "center", padding: "9px 14px", borderBottom: `1px solid ${C.grey}`, fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: C.slate, textTransform: "uppercase" }}>
                  <span style={{ width: 28 }}>#</span><span style={{ flex: 1 }}>Country</span>
                  <span style={{ width: 96 }}>Pillars</span>
                  <span style={{ width: 46, textAlign: "right" }}>Score</span>
                  {showBands && <span className="bcn-head-band" style={{ width: 140, textAlign: "right" }}>Rank range</span>}
                </div>
                {shown.map((d) => {
                  const b = bands[d.iso], open = expanded === d.iso, isUS = d.iso === "USA";
                  return (
                    <div key={d.iso} style={{ borderBottom: `1px solid ${C.grey}`, background: isUS ? C.wash : "#fff", borderLeft: isUS ? `3px solid ${C.coral}` : "3px solid transparent" }}>
                      <button className="rowbtn" aria-expanded={open} aria-controls={`detail-${d.iso}`} aria-label={`${d.c}, rank ${d.rank} of ${N}, composite score ${d.score.toFixed(1)} of 100`} onClick={() => setExpanded(open ? null : d.iso)}>
                        <div className="bcn-row" style={{ display: "flex", alignItems: "center", padding: "10px 14px", fontSize: 14 }}>
                          <span style={{ width: 28, fontFamily: MONO, color: C.slate, fontSize: 13 }}>{d.rank}</span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ fontWeight: isUS ? 700 : 600, color: C.navy }}>{d.c}</span>
                          </span>
                          <span className="bcn-pill" style={{ width: 96, display: "flex", gap: 2, alignItems: "flex-end", height: 24 }}>
                            {PILLARS.map((p) => <span key={p.key} role="img" aria-label={`${p.short}: ${Math.round(d.p[p.key])}`} title={`${p.short}: ${Math.round(d.p[p.key])}`} style={{ flex: 1, height: `${Math.max(8, d.p[p.key])}%`, background: p.hue, borderRadius: 1 }} />)}
                          </span>
                          <span className="bcn-score" style={{ width: 46, textAlign: "right", fontFamily: MONO, fontWeight: 700, fontSize: 13.5, color: C.navy }}>{d.score.toFixed(1)}</span>
                          {showBands && <span className="bcn-band" style={{ width: 140, paddingLeft: 12 }}><Band p5={b.p5} p95={b.p95} median={b.median} current={d.rank} n={N} /></span>}
                        </div>
                      </button>
                      {open && (
                        <div id={`detail-${d.iso}`} className="bcn-detail" role="region" aria-label={`${d.c} — detail`} style={{ display: "flex", gap: 26, flexWrap: "wrap", padding: "8px 18px 22px 45px", background: "#fbfcfd" }}>
                          <div style={{ flex: "0 0 auto" }}><Radar p={d.p} /></div>
                          <div style={{ flex: "1 1 300px", minWidth: 260 }}>
                            <div style={{ fontFamily: SERIF, fontSize: 18, marginBottom: 8, color: C.navy, fontVariant: "small-caps", letterSpacing: 0.5 }}>{d.c} <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", color: C.slate, fontVariant: "normal" }}>· {d.region}</span></div>
                            <table style={{ width: "100%", fontSize: 12.5, borderCollapse: "collapse" }}>
                              <tbody>
                                {[
                                  ["Life expectancy", `${fmt(d.raw.le, 1)} yrs`],
                                  ["GNI per capita (PPP)", `$${fmt(d.raw.gni)}`],
                                  ["Schooling (exp / mean)", `${fmt(d.raw.eys, 1)} / ${fmt(d.raw.mys, 1)} yrs`],
                                  ["Global presence (Elcano)", fmt(d.raw.elcano, 0)],
                                  ["Homicide / 100k", fmt(d.raw.hom, 1)],
                                  ["Corruption (CPI 0–100)", fmt(d.raw.cpi)],
                                  ["Freedom House (0–100)", fmt(d.raw.fh)],
                                  ["Press freedom RSF (0–100)", fmt(d.raw.rsf, 1)],
                                ].map(([k, v]) => (
                                  <tr key={k} style={{ borderBottom: `1px solid ${C.grey}` }}>
                                    <td style={{ padding: "4px 8px 4px 0", color: C.slate }}>{k}</td>
                                    <td style={{ padding: "4px 0", textAlign: "right", fontFamily: MONO, fontWeight: 600, color: C.navy }}>{v}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div style={{ fontSize: 11.5, color: C.slate, marginTop: 10, lineHeight: 1.5 }}>
                              Across 500 random weightings this country ranges between #{b.p5} and #{b.p95} (median #{b.median}). The radar shows its six pillar scores, each 0–100 relative to the {N}-country sample.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11.5, color: C.slate, marginTop: 14, lineHeight: 1.55 }}>
                Scores are relative to these {N} countries, not absolute. Five pillars gauge quality of national life; the sixth, power and influence, gauges global clout. See Methodology for sources, transforms, and caveats.
              </div>
            </div>
          </div>
        </>}

        {tab === "methodology" && (
          <div style={{ maxWidth: 760, fontSize: 14.5, lineHeight: 1.62, color: C.slate }}>
            <div style={eyebrow}>How it’s built</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 32, color: C.navy, margin: "6px 0 10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Methodology</h1>
            <p>BEACON blends two senses of national “greatness”: how well a country serves the people living in it, and how much it projects power and influence in the world. Five pillars measure quality of national life; the sixth measures global presence. It is built entirely from published, reputable indicators.</p>

            {sectionTitle("The six pillars")}
            <p>Each pillar is one facet of national quality. Within a pillar, sub-indicators are averaged; pillars are then combined into the composite.</p>
            <ol style={s.ol}>
              <li><b>Health &amp; Longevity</b> — life expectancy at birth.</li>
              <li><b>Material &amp; Human Development</b> — GNI per capita (PPP, log-transformed) and education (the average of expected and mean years of schooling).</li>
              <li><b>Freedom &amp; Rights</b> — the average of the Freedom House aggregate score (political rights + civil liberties) and the RSF press-freedom score. Where RSF is unavailable, Freedom House alone is used.</li>
              <li><b>Power &amp; Influence</b> — the Elcano Global Presence Index, capturing a country’s economic, military and soft/cultural projection beyond its borders, log-transformed.</li>
              <li><b>Safety</b> — the intentional-homicide rate, inverted (fewer homicides → higher safety).</li>
              <li><b>Governance &amp; Integrity</b> — the Corruption Perceptions Index (higher = cleaner).</li>
            </ol>

            {sectionTitle("Sources & vintages")}
            <ul style={s.ul}>
              <li>Life expectancy, GNI per capita, schooling — <b>UNDP Human Development Report 2025</b> (2023 reference data).</li>
              <li>Power &amp; influence — <b>Elcano Global Presence Index</b>, 2025 edition (2024 data), Real Instituto Elcano.</li>
              <li>Homicide — <b>UNODC</b> intentional-homicide rate, via Our World in Data, latest available year per country (mostly 2021–2023).</li>
              <li>Corruption — <b>Transparency International CPI</b> (2024 edition), via Our World in Data.</li>
              <li>Freedom House — <b>Freedom in the World</b> aggregate score, 2025 reference year, via Our World in Data.</li>
              <li>Press freedom — <b>Reporters Without Borders</b> World Press Freedom Index 2025.</li>
            </ul>

            {sectionTitle("How the scores are built")}
            <p>Every indicator is rescaled to a 1–100 range across the {META.n}-country sample (min–max), so each pillar is on a common footing. GNI is logged first, reflecting the diminishing returns of income. Homicide is inverted so that higher always means better. The Elcano global-presence score is also log-transformed, so the US/China superpower gap doesn’t swamp the pillar at equal weights — raise the Power slider and that gap reasserts itself. Education combines expected and mean years of schooling; development then combines that with income.</p>
            <p>Pillars are aggregated with a <b>weighted geometric mean</b> by default. The geometric mean penalizes imbalance: a country can’t buy its way to the top on one pillar while flunking another. An arithmetic option is offered for comparison — it lets a strong pillar fully compensate for a weak one.</p>

            {sectionTitle("Weighting is a value judgment")}
            <p>The sliders start at equal weights, but “equal” is itself a choice — it asserts that, say, press freedom matters exactly as much as longevity. There is no objectively correct weighting, which is the point of making it adjustable.</p>

            {sectionTitle("Rank-uncertainty bands")}
            <p>For each country we draw 500 random weightings across all six pillars and record where it lands each time. The bar shows the 5th–95th percentile of those ranks, with lower placements to the left and higher to the right. A short bar means the position is robust to how you weigh things; a long bar means the rank is largely an artifact of weighting and shouldn’t be over-read.</p>

            {sectionTitle("Coverage")}
            <p>BEACON includes <b>{META.n} countries</b> — every country with complete data across all six pillars. Coverage is gated mainly by the homicide series. {META.dropped} countries present in the development data were dropped for missing at least one other pillar; they are excluded rather than imputed.</p>

            {sectionTitle("Reading it honestly")}
            <ul style={s.ul}>
              <li>Scores are <b>relative</b> to this sample, not absolute statements about a country.</li>
              <li>Gaps of a few ranks are noise — trust the uncertainty bands over the exact ordinal.</li>
              <li>Each pillar leans on one or two indicators; it is a deliberately legible index, not an exhaustive one.</li>
              <li>The quality-of-life pillars tend to favour small, rich, peaceful democracies; the Power &amp; Influence pillar deliberately cuts the other way, rewarding large globally-projecting states — so where a country lands depends heavily on how you trade those off.</li>
            </ul>
          </div>
        )}

        {tab === "about" && (
          <div style={{ maxWidth: 680, fontSize: 15.5, lineHeight: 1.66, color: C.slate }}>
            <div style={eyebrow}>The person behind it</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 32, color: C.navy, margin: "6px 0 18px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>About</h1>
            <p style={{ margin: "0 0 14px" }}>
              I’m Ben Byrne — a web developer and UX designer based in Santa Rosa, California, with a cross-disciplinary background that
              runs from design to front-end engineering. I spent close to a decade running a creative agency before moving into in-house
              product and web roles.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              Away from the screen I’m a fine-art photographer — <a href="https://gallery.byrnecreative.com" target="_blank" rel="noreferrer">Byrne Creative Photography</a> —
              shooting landscapes, sunsets, forests, and wildlife across Northern California.
            </p>
            <p style={{ margin: "0 0 22px" }}>
              BEACON started as a personal itch: I kept hearing that the United States is “the greatest country on earth,” and I wanted to see
              what happens when you actually try to <em>measure</em> that claim instead of asserting it.
            </p>
            <div style={eyebrow}>Find me</div>
            <p style={{ margin: "6px 0 0", fontSize: 14.5 }}>
              <a href="https://instagram.com/drywallbmb" target="_blank" rel="noreferrer">Instagram @drywallbmb</a>
              <span style={{ color: C.grey, margin: "0 8px" }}>·</span>
              <a href="https://www.threads.net/@drywallbmb" target="_blank" rel="noreferrer">Threads @drywallbmb</a>
              <span style={{ color: C.grey, margin: "0 8px" }}>·</span>
              <a href="mailto:ben@byrnecreative.com">ben@byrnecreative.com</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  ol: { paddingLeft: 20, margin: "6px 0" },
  ul: { paddingLeft: 20, margin: "6px 0" },
};

import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// ── GLOBAL STYLES ──────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --red:     #FF2D2D;
      --orange:  #FF6B00;
      --yellow:  #FFD600;
      --green:   #00FF88;
      --blue:    #00C2FF;
      --dark:    #080B0F;
      --dark2:   #0D1117;
      --dark3:   #141920;
      --dark4:   #1C2330;
      --border:  rgba(255,255,255,0.07);
      --text:    #E8EDF3;
      --muted:   #6B7A90;
    }

    html, body, #root { height: 100%; background: var(--dark); color: var(--text); }
    body { font-family: 'Inter', sans-serif; overflow-x: hidden; }

    .mono { font-family: 'Space Mono', monospace; }
    .display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--dark2); }
    ::-webkit-scrollbar-thumb { background: var(--red); border-radius: 2px; }

    /* Animations */
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; } 50% { opacity: 0; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes glitch {
      0%, 100% { clip-path: inset(0 0 100% 0); }
      20% { clip-path: inset(20% 0 60% 0); transform: translate(-4px); }
      40% { clip-path: inset(50% 0 30% 0); transform: translate(4px); }
      60% { clip-path: inset(70% 0 10% 0); transform: translate(-2px); }
      80% { clip-path: inset(10% 0 80% 0); transform: translate(2px); }
    }
    @keyframes rotate {
      from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    .fade-up { animation: fadeUp 0.6s ease forwards; }
    .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
    .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
    .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
    .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }
    .fade-up-5 { animation: fadeUp 0.6s 0.5s ease both; }

    /* Noise overlay */
    .noise::after {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 9999; opacity: 0.4;
    }

    /* Grid background */
    .grid-bg {
      background-image:
        linear-gradient(rgba(255,45,45,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,45,45,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    /* Btn base */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 28px; border: none; cursor: pointer;
      font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700;
      text-decoration: none; transition: all 0.2s; position: relative; overflow: hidden;
      text-transform: uppercase; letter-spacing: 0.08em;
    }
    .btn::before {
      content: ''; position: absolute; inset: 0;
      background: rgba(255,255,255,0.1);
      transform: translateX(-100%); transition: transform 0.3s;
    }
    .btn:hover::before { transform: translateX(0); }

    .btn-red    { background: var(--red);    color: #fff; }
    .btn-blue   { background: var(--blue);   color: #000; }
    .btn-ghost  { background: transparent; color: var(--text); border: 1px solid var(--border); }
    .btn-ghost:hover { border-color: var(--red); color: var(--red); }

    /* Card */
    .card {
      background: var(--dark3);
      border: 1px solid var(--border);
      transition: border-color 0.2s, transform 0.2s;
    }
    .card:hover { border-color: rgba(255,45,45,0.3); }

    /* Input */
    .inp {
      width: 100%; background: var(--dark4); border: 1px solid var(--border);
      color: var(--text); padding: 12px 16px;
      font-family: 'Space Mono', monospace; font-size: 13px;
      outline: none; transition: border-color 0.2s;
    }
    .inp:focus { border-color: var(--red); }
    .inp::placeholder { color: var(--muted); }

    /* Tag */
    .tag {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 10px; font-size: 11px; font-weight: 700;
      font-family: 'Space Mono', monospace; text-transform: uppercase; letter-spacing: 0.1em;
    }

    /* Severity colors */
    .sev-critical { color: var(--red);    border-color: var(--red);    background: rgba(255,45,45,0.1); }
    .sev-high     { color: var(--orange); border-color: var(--orange); background: rgba(255,107,0,0.1); }
    .sev-moderate { color: var(--yellow); border-color: var(--yellow); background: rgba(255,214,0,0.1); }
    .sev-low      { color: var(--green);  border-color: var(--green);  background: rgba(0,255,136,0.1); }

    /* Nav */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 32px; height: 60px;
      background: rgba(8,11,15,0.9); backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--red); letter-spacing: 0.1em; text-decoration: none; }
    .nav-links { display: flex; gap: 4px; }
    .nav-link {
      padding: 6px 16px; color: var(--muted); text-decoration: none;
      font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.1em; transition: color 0.2s;
      border: 1px solid transparent;
    }
    .nav-link:hover { color: var(--text); border-color: var(--border); }
    .nav-link.active { color: var(--red); border-color: rgba(255,45,45,0.3); }

    /* Live dot */
    .live-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--green); position: relative; display: inline-block;
    }
    .live-dot::before {
      content: ''; position: absolute; inset: -4px;
      border-radius: 50%; border: 1px solid var(--green);
      animation: pulse-ring 1.5s infinite;
    }

    /* Stat box */
    .stat-box {
      padding: 20px 24px; border: 1px solid var(--border);
      background: var(--dark3);
    }
    .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 48px; line-height: 1; }
    .stat-label { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }

    /* Map placeholder */
    .map-box {
      background: var(--dark3); border: 1px solid var(--border);
      position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
    }
    .map-box::before {
      content: ''; position: absolute; inset: 0;
      background: repeating-linear-gradient(
        0deg, transparent, transparent 39px,
        rgba(255,45,45,0.04) 39px, rgba(255,45,45,0.04) 40px
      ),
      repeating-linear-gradient(
        90deg, transparent, transparent 39px,
        rgba(255,45,45,0.04) 39px, rgba(255,45,45,0.04) 40px
      );
    }

    /* Scan line effect */
    .scanline::after {
      content: ''; position: absolute; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255,45,45,0.3), transparent);
      animation: scan 3s linear infinite; pointer-events: none;
    }

    /* Alert banner */
    .alert-banner {
      background: linear-gradient(135deg, rgba(255,45,45,0.15), rgba(255,107,0,0.1));
      border: 1px solid var(--red); padding: 16px 24px;
      display: flex; align-items: center; gap: 16px;
      animation: fadeUp 0.3s ease;
    }

    /* Incident card */
    .incident-row {
      padding: 16px 20px; border: 1px solid var(--border);
      background: var(--dark3); cursor: pointer;
      transition: all 0.2s; border-left: 3px solid transparent;
    }
    .incident-row:hover { background: var(--dark4); transform: translateX(4px); }
    .incident-row.critical { border-left-color: var(--red); }
    .incident-row.high     { border-left-color: var(--orange); }
    .incident-row.moderate { border-left-color: var(--yellow); }
    .incident-row.low      { border-left-color: var(--green); }

    /* Form section */
    .form-section { padding: 32px; background: var(--dark2); }

    /* Select */
    select.inp { cursor: pointer; }
    select.inp option { background: var(--dark3); }

    /* Checkbox / radio styles */
    input[type=radio], input[type=checkbox] { accent-color: var(--red); }

    /* Page wrapper */
    .page { min-height: 100vh; padding-top: 60px; }

    /* Divider */
    .divider { height: 1px; background: var(--border); margin: 0; }

    /* Status badge */
    .status-open       { color: var(--blue);   background: rgba(0,194,255,0.1); border: 1px solid rgba(0,194,255,0.3); }
    .status-in-progress{ color: var(--yellow); background: rgba(255,214,0,0.1); border: 1px solid rgba(255,214,0,0.3); }
    .status-resolved   { color: var(--green);  background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); }

    /* Tooltip */
    .tooltip { position: relative; }
    .tooltip:hover .tooltip-text { opacity: 1; pointer-events: auto; }
    .tooltip-text {
      position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
      background: var(--dark4); border: 1px solid var(--border);
      padding: 6px 12px; font-size: 11px; font-family: 'Space Mono', monospace;
      white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; z-index: 10;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .nav { padding: 0 16px; }
      .nav-links { gap: 0; }
      .nav-link { padding: 6px 10px; font-size: 10px; }
      .form-section { padding: 20px 16px; }
    }
  `}</style>
);

// ── NAVBAR ─────────────────────────────────────────────────────────────────────
function Navbar({ activeTab }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">ResQLink</Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}>Home</Link>
        <Link to="/report" className={`nav-link ${activeTab === 'report' ? 'active' : ''}`}>Report</Link>
        <Link to="/dashboard" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}>Live Map</Link>
        <Link to="/login" className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}>Login</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="live-dot" />
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          {time.toLocaleTimeString('en-IN', { hour12: false })}
        </span>
      </div>
    </nav>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────────────
function Home() {
  const [incidents] = useState(3);
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);

  const recent = [
    { type: 'FLOOD', loc: 'Lower Parel, Mumbai', sev: 'critical', time: '2m ago' },
    { type: 'FIRE', loc: 'Andheri East, Mumbai', sev: 'high', time: '7m ago' },
    { type: 'CYCLONE', loc: 'Juhu Beach, Mumbai', sev: 'moderate', time: '14m ago' },
  ];

  return (
    <div className="page noise grid-bg" style={{ background: 'var(--dark)' }}>
      <Navbar activeTab="home" />

      {/* Hero */}
      <div style={{ padding: '80px 40px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="fade-up-1" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span className="live-dot" />
          <span className="mono" style={{ fontSize: 11, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            System Active — {incidents} Active Incidents
          </span>
        </div>

        <h1 className="display fade-up-2" style={{ fontSize: 'clamp(64px, 12vw, 140px)', lineHeight: 0.9, marginBottom: 24 }}>
          <span style={{ color: 'var(--red)' }}>RESQ</span>
          <span style={{ color: 'var(--text)' }}>LINK</span>
        </h1>

        <p className="fade-up-3" style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>
          AI-powered real-time disaster response platform. Report incidents, track severity, coordinate emergency resources — all in one place.
        </p>

        <div className="fade-up-4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 80 }}>
          <Link to="/report" className="btn btn-red" style={{ fontSize: 14, padding: '16px 36px' }}>
            🚨 Report Incident
          </Link>
          <Link to="/dashboard" className="btn btn-ghost" style={{ fontSize: 14, padding: '16px 36px' }}>
            🗺 View Live Map
          </Link>
        </div>

        {/* Stats row */}
        <div className="fade-up-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, background: 'var(--border)', marginBottom: 60 }}>
          {[
            { n: '3', label: 'Active Incidents', color: 'var(--red)' },
            { n: '12', label: 'Resources Deployed', color: 'var(--blue)' },
            { n: '847', label: 'Citizens Alerted', color: 'var(--yellow)' },
            { n: '2', label: 'Resolved Today', color: 'var(--green)' },
          ].map(s => (
            <div key={s.label} className="stat-box">
              <div className="stat-num" style={{ color: s.color }}>{s.n}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent incidents */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              — Recent Incidents
            </span>
            <Link to="/dashboard" className="mono" style={{ fontSize: 11, color: 'var(--red)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {recent.map((r, i) => (
              <div key={i} className={`incident-row ${r.sev}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span className={`tag sev-${r.sev}`} style={{ border: '1px solid' }}>{r.type}</span>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{r.loc}</span>
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, background: 'var(--border)' }}>
          {[
            { icon: '🤖', title: 'AI Triage', desc: 'Claude AI instantly analyzes every report — assigns severity, detects misinformation, recommends action.' },
            { icon: '⚡', title: 'Real-Time Updates', desc: 'WebSocket-powered live map. See new incidents appear the moment they\'re reported — zero refresh needed.' },
            { icon: '📡', title: 'Authority Broadcast', desc: 'Admins push emergency alerts instantly to every connected citizen on the platform.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ padding: '32px 28px' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <div className="display" style={{ fontSize: 24, marginBottom: 12 }}>{f.title}</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── REPORT PAGE ────────────────────────────────────────────────────────────────
function ReportIncident() {
  const [type, setType] = useState('flood');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const navigate = useNavigate();

  const TYPES = [
    { value: 'flood', label: 'Flood', icon: '🌊', color: '#00C2FF' },
    { value: 'earthquake', label: 'Earthquake', icon: '🌍', color: '#FF6B00' },
    { value: 'fire', label: 'Fire', icon: '🔥', color: '#FF2D2D' },
    { value: 'cyclone', label: 'Cyclone', icon: '🌀', color: '#9B59B6' },
    { value: 'landslide', label: 'Landslide', icon: '⛰️', color: '#8B4513' },
  ];

  const selectedType = TYPES.find(t => t.value === type);

  const handleSubmit = async () => {
    if (!position) { alert('Click on the map coordinates below to set your location'); return; }
    if (!description.trim()) { alert('Please describe what you see'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description, latitude: position[0], longitude: position[1], reportedBy: 'anonymous' })
      });
      const data = await res.json();
      setAiResult(data);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 4000);
    } catch { alert('Could not connect to server. Is the backend running?'); }
    setLoading(false);
  };

  // Simulated location picker (lat/lng inputs since no map lib loaded here)
  const [lat, setLat] = useState('19.0760');
  const [lng, setLng] = useState('72.8777');

  const setCoords = () => {
    const la = parseFloat(lat), lo = parseFloat(lng);
    if (isNaN(la) || isNaN(lo)) { alert('Enter valid coordinates'); return; }
    setPosition([la, lo]);
  };

  return (
    <div className="page" style={{ background: 'var(--dark)', minHeight: '100vh' }}>
      <Navbar activeTab="report" />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
            // Emergency Report
          </div>
          <h1 className="display" style={{ fontSize: 56, color: 'var(--text)' }}>
            REPORT <span style={{ color: 'var(--red)' }}>INCIDENT</span>
          </h1>
        </div>

        {success && aiResult ? (
          <div className="fade-up card" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div className="display" style={{ fontSize: 36, color: 'var(--green)', marginBottom: 8 }}>INCIDENT REPORTED</div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>Claude AI has analyzed your report</div>
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12, textAlign: 'left', minWidth: 300 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>SEVERITY</span>
                <span className={`tag sev-${aiResult.severity}`} style={{ border: '1px solid' }}>{aiResult.severity?.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>AI ACTION</span>
                <span style={{ fontSize: 12, color: 'var(--text)', maxWidth: 240 }}>{aiResult.aiAction}</span>
              </div>
              {aiResult.isFake && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>FAKE SCORE</span>
                  <span style={{ fontSize: 12, color: 'var(--red)' }}>⚠ {Math.round((aiResult.fakeScore || 0) * 100)}% suspicious</span>
                </div>
              )}
            </div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 24 }}>Redirecting to live map…</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)' }}>
            {/* Left: Form */}
            <div style={{ background: 'var(--dark2)', padding: '32px' }}>
              {/* Type selector */}
              <div style={{ marginBottom: 28 }}>
                <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>
                  Incident Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                  {TYPES.map(t => (
                    <button key={t.value} onClick={() => setType(t.value)}
                      style={{
                        padding: '12px 6px', border: `1px solid ${type === t.value ? t.color : 'var(--border)'}`,
                        background: type === t.value ? `${t.color}15` : 'var(--dark3)',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 4
                      }}>
                      <span style={{ fontSize: 20 }}>{t.icon}</span>
                      <span className="mono" style={{ fontSize: 9, color: type === t.value ? t.color : 'var(--muted)', textTransform: 'uppercase' }}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 28 }}>
                <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>
                  Description
                </label>
                <textarea className="inp" value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what you see — water level, fire spread, number of people affected…"
                  style={{ height: 120, resize: 'none', lineHeight: 1.6 }} />
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={loading}
                className="btn btn-red" style={{ width: '100%', padding: '16px', fontSize: 13, opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <>
                    <span style={{ animation: 'rotate 1s linear infinite', display: 'inline-block' }}>⟳</span>
                    AI Triaging Report…
                  </>
                ) : '🚨 Submit & AI Triage'}
              </button>
            </div>

            {/* Right: Location */}
            <div style={{ background: 'var(--dark3)', padding: '32px' }}>
              <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>
                Incident Location
              </label>

              {/* Map placeholder with grid */}
              <div className="map-box scanline" style={{ height: 180, marginBottom: 16, position: 'relative' }}>
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🗺</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                    {position ? `📍 ${position[0].toFixed(4)}, ${position[1].toFixed(4)}` : 'Enter coordinates below'}
                  </div>
                </div>
                {/* Fake map dots */}
                {[[30, 40], [60, 60], [45, 75], [70, 30]].map(([x, y], i) => (
                  <div key={i} style={{
                    position: 'absolute', left: `${x}%`, top: `${y}%`,
                    width: 6, height: 6, borderRadius: '50%',
                    background: i === 0 ? 'var(--red)' : 'var(--muted)',
                    transform: 'translate(-50%,-50%)'
                  }} />
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div>
                  <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Latitude</label>
                  <input className="inp" value={lat} onChange={e => setLat(e.target.value)} placeholder="19.0760" />
                </div>
                <div>
                  <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Longitude</label>
                  <input className="inp" value={lng} onChange={e => setLng(e.target.value)} placeholder="72.8777" />
                </div>
              </div>
              <button onClick={setCoords} className="btn btn-ghost" style={{ width: '100%', padding: '12px' }}>
                📍 Set Location
              </button>

              {position && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>
                    ✓ Location confirmed: {position[0].toFixed(4)}, {position[1].toFixed(4)}
                  </span>
                </div>
              )}

              {/* Selected type summary */}
              <div style={{ marginTop: 24, padding: '16px', background: 'var(--dark4)', border: '1px solid var(--border)' }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 8 }}>SELECTED TYPE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{selectedType?.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedType?.label}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>AI will assess severity automatically</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARD PAGE ─────────────────────────────────────────────────────────────
function Dashboard() {
  const [incidents, setIncidents] = useState([
    { id: '1', type: 'flood', description: 'Heavy flooding in lower districts, water level rising', latitude: 19.076, longitude: 72.877, severity: 'critical', aiAction: 'Deploy rescue boats immediately', isFake: false, fakeScore: 0.05, status: 'open', createdAt: new Date(Date.now() - 120000).toISOString() },
    { id: '2', type: 'earthquake', description: 'Magnitude 5.2 tremors felt across the city', latitude: 18.520, longitude: 73.856, severity: 'high', aiAction: 'Evacuate unstable buildings', isFake: false, fakeScore: 0.1, status: 'in-progress', createdAt: new Date(Date.now() - 420000).toISOString() },
    { id: '3', type: 'fire', description: 'Industrial fire spreading fast near warehouse district', latitude: 19.200, longitude: 72.970, severity: 'critical', aiAction: 'Deploy 3 fire engines, evacuate 500m radius', isFake: false, fakeScore: 0.02, status: 'open', createdAt: new Date(Date.now() - 840000).toISOString() },
    { id: '4', type: 'cyclone', description: 'Strong winds reported near coastal area', latitude: 18.900, longitude: 72.800, severity: 'moderate', aiAction: 'Issue advisory, monitor wind speeds', isFake: false, fakeScore: 0.15, status: 'open', createdAt: new Date(Date.now() - 1200000).toISOString() },
    { id: '5', type: 'landslide', description: 'Minor slope movement detected on highway', latitude: 19.300, longitude: 73.100, severity: 'low', aiAction: 'Monitor and restrict heavy vehicles', isFake: true, fakeScore: 0.82, status: 'open', createdAt: new Date(Date.now() - 1800000).toISOString() },
  ]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const SEV_COLOR = { critical: 'var(--red)', high: 'var(--orange)', moderate: 'var(--yellow)', low: 'var(--green)' };
  const TYPE_ICON = { flood: '🌊', earthquake: '🌍', fire: '🔥', cyclone: '🌀', landslide: '⛰️' };

  const filtered = filter === 'all' ? incidents : incidents.filter(i => i.severity === filter);
  const counts = { critical: incidents.filter(i => i.severity === 'critical').length, high: incidents.filter(i => i.severity === 'high').length, total: incidents.length };

  const timeAgo = (iso) => {
    const s = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  return (
    <div className="page" style={{ background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab="dashboard" />

      {activeAlert && (
        <div className="alert-banner">
          <span style={{ fontSize: 20 }}>📡</span>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Emergency Alert</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{activeAlert}</div>
          </div>
          <button onClick={() => setActiveAlert(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ background: 'var(--dark2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Sidebar header */}
          <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div className="display" style={{ fontSize: 28 }}>LIVE <span style={{ color: 'var(--red)' }}>FEED</span></div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{counts.total} incidents · {counts.critical} critical</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="live-dot" />
                <span className="mono" style={{ fontSize: 10, color: 'var(--green)' }}>LIVE</span>
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'critical', 'high', 'moderate', 'low'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="mono"
                  style={{
                    padding: '4px 10px', fontSize: 9, border: '1px solid',
                    borderColor: filter === f ? (SEV_COLOR[f] || 'var(--text)') : 'var(--border)',
                    background: filter === f ? `${SEV_COLOR[f] || 'rgba(255,255,255,0.1)'}15` : 'transparent',
                    color: filter === f ? (SEV_COLOR[f] || 'var(--text)') : 'var(--muted)',
                    cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.2s'
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Incident list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(inc => (
              <div key={inc.id}
                onClick={() => setSelected(selected?.id === inc.id ? null : inc)}
                className={`incident-row ${inc.severity}`}
                style={{ borderBottom: '1px solid var(--border)', background: selected?.id === inc.id ? 'var(--dark4)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 16 }}>{TYPE_ICON[inc.type] || '⚠️'}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>{inc.type}</span>
                      {inc.isFake && <span className="tag" style={{ fontSize: 9, background: 'rgba(255,45,45,0.1)', color: 'var(--red)', border: '1px solid rgba(255,45,45,0.3)' }}>SUSPECT</span>}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>{inc.description}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className={`tag sev-${inc.severity}`} style={{ border: '1px solid', fontSize: 9 }}>{inc.severity}</span>
                      <span className={`tag status-${inc.status.replace(' ', '-')}`} style={{ fontSize: 9 }}>{inc.status}</span>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--muted)' }}>{timeAgo(inc.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {selected?.id === inc.id && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--blue)', marginBottom: 4 }}>🤖 AI RECOMMENDATION</div>
                    <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{inc.aiAction}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8 }}>
                      📍 {inc.latitude.toFixed(4)}, {inc.longitude.toFixed(4)}
                    </div>
                    {inc.fakeScore > 0.5 && (
                      <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(255,45,45,0.05)', border: '1px solid rgba(255,45,45,0.2)' }}>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--red)' }}>
                          ⚠ Misinformation risk: {Math.round(inc.fakeScore * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map area */}
        <div style={{ position: 'relative', background: 'var(--dark3)' }}>
          <div className="map-box scanline" style={{ height: '100%', minHeight: 500 }}>
            {/* Simulated map with incident dots */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {incidents.map((inc, i) => {
                const x = ((inc.longitude - 72.5) / 1.2) * 80 + 10;
                const y = ((19.5 - inc.latitude) / 1.5) * 80 + 10;
                const size = inc.severity === 'critical' ? 20 : inc.severity === 'high' ? 14 : 10;
                return (
                  <div key={inc.id} onClick={() => setSelected(selected?.id === inc.id ? null : inc)}
                    style={{
                      position: 'absolute', left: `${Math.min(Math.max(x, 5), 90)}%`, top: `${Math.min(Math.max(y, 5), 90)}%`,
                      transform: 'translate(-50%,-50%)', cursor: 'pointer', zIndex: 2
                    }}>
                    <div style={{
                      width: size, height: size, borderRadius: '50%',
                      background: SEV_COLOR[inc.severity], opacity: 0.85,
                      border: `2px solid ${SEV_COLOR[inc.severity]}`,
                      boxShadow: `0 0 ${size}px ${SEV_COLOR[inc.severity]}80`,
                      transition: 'transform 0.2s'
                    }} />
                    {selected?.id === inc.id && (
                      <div style={{
                        position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--dark4)', border: '1px solid var(--border)',
                        padding: '8px 12px', whiteSpace: 'nowrap', zIndex: 10
                      }}>
                        <div className="mono" style={{ fontSize: 10, color: SEV_COLOR[inc.severity], textTransform: 'uppercase' }}>{inc.type}</div>
                        <div style={{ fontSize: 11, color: 'var(--text)', marginTop: 2 }}>{inc.severity} severity</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map overlay text */}
            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 5 }}>
              <div style={{ background: 'rgba(8,11,15,0.85)', border: '1px solid var(--border)', padding: '12px 16px' }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 8 }}>LEGEND</div>
                {Object.entries(SEV_COLOR).map(([s, c]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                    <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'capitalize' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 5 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', background: 'rgba(8,11,15,0.85)', padding: '8px 12px', border: '1px solid var(--border)' }}>
                Maharashtra Region · Click incident to inspect
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN PAGE ─────────────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError('All fields required'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e) { setError(e.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div className="page noise grid-bg" style={{ background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar activeTab="login" />

      <div style={{ width: '100%', maxWidth: 440, padding: '0 24px' }}>
        <div className="fade-up-1" style={{ marginBottom: 40, textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 56, marginBottom: 8 }}>
            AUTH<span style={{ color: 'var(--red)' }}>.</span>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Authority Access Only
          </div>
        </div>

        <div className="fade-up-2 card" style={{ padding: 32 }}>
          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,45,45,0.1)', border: '1px solid rgba(255,45,45,0.3)', marginBottom: 20 }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--red)' }}>⚠ {error}</span>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 8 }}>
              Email Address
            </label>
            <input className="inp" type="email" placeholder="admin@resqlink.com"
              value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 8 }}>
              Password
            </label>
            <input className="inp" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          <button onClick={handleLogin} disabled={loading} className="btn btn-red" style={{ width: '100%', padding: '16px', fontSize: 13 }}>
            {loading ? (
              <><span style={{ animation: 'rotate 1s linear infinite', display: 'inline-block' }}>⟳</span> Authenticating…</>
            ) : '→ Access System'}
          </button>

          <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--dark4)', border: '1px solid var(--border)' }}>
            <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>DEMO CREDENTIALS</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text)' }}>admin@resqlink.com / admin123</div>
          </div>
        </div>

        <div className="fade-up-3" style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/" className="mono" style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ────────────────────────────────────────────────────────────────
function AdminPanel() {
  const [incidents, setIncidents] = useState([
    { id: '1', type: 'flood', description: 'Heavy flooding in lower districts', severity: 'critical', aiAction: 'Deploy rescue boats immediately', status: 'open', isFake: false, fakeScore: 0.05 },
    { id: '2', type: 'earthquake', description: 'Magnitude 5.2 tremors felt', severity: 'high', aiAction: 'Evacuate unstable buildings', status: 'in-progress', isFake: false, fakeScore: 0.1 },
    { id: '3', type: 'fire', description: 'Industrial fire spreading fast', severity: 'critical', aiAction: 'Deploy 3 fire engines', status: 'open', isFake: false, fakeScore: 0.02 },
    { id: '4', type: 'landslide', description: 'Minor slope movement on highway', severity: 'low', aiAction: 'Monitor situation', status: 'open', isFake: true, fakeScore: 0.82 },
  ]);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('warning');
  const [sentAlerts, setSentAlerts] = useState([]);
  const [tab, setTab] = useState('incidents');

  const SEV_COLOR = { critical: 'var(--red)', high: 'var(--orange)', moderate: 'var(--yellow)', low: 'var(--green)' };
  const TYPE_ICON = { flood: '🌊', earthquake: '🌍', fire: '🔥', cyclone: '🌀', landslide: '⛰️' };

  const broadcast = async () => {
    if (!alertMsg.trim()) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/alerts/broadcast`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alertMsg, type: alertType })
      });
    } catch {}
    setSentAlerts(prev => [{ msg: alertMsg, type: alertType, time: new Date() }, ...prev]);
    setAlertMsg('');
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/incidents/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch {}
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  return (
    <div className="page" style={{ background: 'var(--dark)' }}>
      <Navbar activeTab="admin" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
              // Admin Control Panel
            </div>
            <h1 className="display" style={{ fontSize: 48 }}>
              COMMAND <span style={{ color: 'var(--yellow)' }}>CENTER</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['incidents', 'broadcast'].map(t => (
              <button key={t} onClick={() => setTab(t)} className="mono"
                style={{
                  padding: '8px 20px', border: '1px solid', cursor: 'pointer',
                  borderColor: tab === t ? 'var(--yellow)' : 'var(--border)',
                  background: tab === t ? 'rgba(255,214,0,0.1)' : 'transparent',
                  color: tab === t ? 'var(--yellow)' : 'var(--muted)',
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.2s'
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === 'broadcast' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)' }}>
            {/* Compose */}
            <div style={{ background: 'var(--dark2)', padding: 32 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
                Compose Alert
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Alert Type</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { v: 'warning', label: '⚠ Warning', c: 'var(--yellow)' },
                    { v: 'evacuation', label: '🚨 Evacuate', c: 'var(--red)' },
                    { v: 'all-clear', label: '✅ All Clear', c: 'var(--green)' },
                  ].map(a => (
                    <button key={a.v} onClick={() => setAlertType(a.v)}
                      style={{
                        flex: 1, padding: '10px 8px', border: `1px solid ${alertType === a.v ? a.c : 'var(--border)'}`,
                        background: alertType === a.v ? `${a.c}15` : 'var(--dark3)',
                        color: alertType === a.v ? a.c : 'var(--muted)',
                        cursor: 'pointer', fontFamily: 'Space Mono', fontSize: 10,
                        textTransform: 'uppercase', transition: 'all 0.2s'
                      }}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="mono" style={{ fontSize: 10, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Message</label>
                <textarea className="inp" value={alertMsg} onChange={e => setAlertMsg(e.target.value)}
                  placeholder="Type your emergency alert message…"
                  style={{ height: 100, resize: 'none', lineHeight: 1.6 }} />
              </div>

              <button onClick={broadcast} className="btn btn-red" style={{ width: '100%', padding: 16, fontSize: 13 }}>
                📡 Broadcast to All Users
              </button>
            </div>

            {/* Sent alerts */}
            <div style={{ background: 'var(--dark3)', padding: 32 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
                Sent Alerts ({sentAlerts.length})
              </div>
              {sentAlerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📡</div>
                  <div className="mono" style={{ fontSize: 11 }}>No alerts sent yet</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sentAlerts.map((a, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--dark4)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--yellow)', textTransform: 'uppercase' }}>{a.type}</span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{a.time.toLocaleTimeString()}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{a.msg}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px 180px', gap: 16, padding: '10px 20px', background: 'var(--dark4)' }}>
              {['Type', 'Description / AI Action', 'Severity', 'Status', 'Actions'].map(h => (
                <div key={h} className="mono" style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{h}</div>
              ))}
            </div>

            {incidents.map(inc => (
              <div key={inc.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 120px 180px', gap: 16, padding: '16px 20px', background: 'var(--dark2)', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{TYPE_ICON[inc.type] || '⚠️'}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted)' }}>{inc.type}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>{inc.description}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--blue)' }}>🤖 {inc.aiAction}</div>
                  {inc.isFake && <div className="mono" style={{ fontSize: 10, color: 'var(--red)', marginTop: 2 }}>⚠ {Math.round(inc.fakeScore * 100)}% fake score</div>}
                </div>
                <div>
                  <span className={`tag sev-${inc.severity}`} style={{ border: '1px solid' }}>{inc.severity}</span>
                </div>
                <div>
                  <span className={`tag status-${inc.status.replace(' ', '-')}`}>{inc.status}</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => updateStatus(inc.id, 'in-progress')}
                    style={{ padding: '6px 10px', background: 'rgba(255,214,0,0.1)', border: '1px solid rgba(255,214,0,0.3)', color: 'var(--yellow)', cursor: 'pointer', fontFamily: 'Space Mono', fontSize: 9, textTransform: 'uppercase' }}>
                    Progress
                  </button>
                  <button onClick={() => updateStatus(inc.id, 'resolved')}
                    style={{ padding: '6px 10px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: 'var(--green)', cursor: 'pointer', fontFamily: 'Space Mono', fontSize: 9, textTransform: 'uppercase' }}>
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
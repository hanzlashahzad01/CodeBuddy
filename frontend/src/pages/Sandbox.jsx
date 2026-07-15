import React, { useState, useEffect, useRef } from 'react';
import { Code, Play, Trash2, Monitor, FileCode } from 'lucide-react';

const initialHtml = `<div class="welcome-box">
  <h1>Welcome to CodeBuddy Sandbox! 🚀</h1>
  <p>Edit HTML, CSS, and JS to see it live.</p>
  <button id="clickBtn">Click Me!</button>
</div>`;

const initialCss = `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.welcome-box {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  max-width: 90%;
}
h1 {
  background: linear-gradient(to right, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
}
p { color: #94a3b8; margin-bottom: 1.25rem; }
button {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
button:hover { background: #4f46e5; }`;

const initialJs = `document.getElementById('clickBtn').addEventListener('click', () => {
  alert('CodeBuddy Sandbox is working! 🎉');
});`;

const buildSrcDoc = (html, css, js) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    try { ${js} }
    catch(err) {
      document.body.insertAdjacentHTML('beforeend',
        '<div style="position:fixed;bottom:0;left:0;right:0;background:#fef2f2;color:#dc2626;border-top:2px solid #fca5a5;padding:10px 14px;font-family:monospace;font-size:13px;z-index:9999"><strong>JS Error:</strong> '+err.message+'</div>'
      );
    }
  <\/script>
</body>
</html>`;

const TABS = [
  { id: 'html', label: 'HTML', color: 'text-orange-400', icon: '🟠' },
  { id: 'css',  label: 'CSS',  color: 'text-blue-400',   icon: '🔵' },
  { id: 'js',   label: 'JS',   color: 'text-yellow-400', icon: '🟡' },
  { id: 'output', label: 'Output', color: 'text-emerald-400', icon: '▶' },
];

const Sandbox = () => {
  const [html, setHtml] = useState(initialHtml);
  const [css,  setCss]  = useState(initialCss);
  const [js,   setJs]   = useState(initialJs);
  const [activeTab, setActiveTab] = useState('html');
  const [srcDoc, setSrcDoc] = useState('');
  const iframeRef = useRef(null);

  // Run code and update iframe
  const runCode = () => {
    setSrcDoc(buildSrcDoc(html, css, js));
  };

  // Auto-run with debounce on any change
  useEffect(() => {
    const t = setTimeout(runCode, 700);
    return () => clearTimeout(t);
  }, [html, css, js]);

  // Initial run on mount
  useEffect(() => { runCode(); }, []);

  const clearAll = () => {
    if (window.confirm('Clear all editors?')) {
      setHtml(''); setCss(''); setJs('');
    }
  };

  const editorClass = "w-full h-full bg-[#0d1117] text-[#e6edf3] font-mono text-[13px] sm:text-sm leading-relaxed p-4 resize-none border-none outline-none focus:outline-none overflow-y-auto";

  return (
    <div
      className="flex flex-col bg-[var(--color-bg)]"
      style={{ height: 'calc(100dvh - 68px)' }}
    >
      {/* ── TOP BAR ── */}
      <div className="flex-shrink-0 bg-[var(--color-card)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
            <Code className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-sm sm:text-base text-[var(--color-text-main)] leading-none truncate">
              CodeBuddy Playground
            </h1>
            <p className="text-[10px] text-[var(--color-text-muted)] hidden sm:block mt-0.5">
              HTML · CSS · JS live editor
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-black transition-all shadow-lg cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* ── MOBILE TAB BAR ── */}
      <div className="lg:hidden flex-shrink-0 flex border-b border-[var(--color-border)] bg-[var(--color-card)]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? `border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/5`
                : 'border-transparent text-[var(--color-text-muted)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MAIN EDITOR AREA ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── DESKTOP: 3-panel editors LEFT ── */}
        <div className="hidden lg:flex flex-col w-1/2 border-r border-[var(--color-border)] overflow-hidden">
          {/* HTML */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-[var(--color-border)]">
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
              <FileCode className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HTML</span>
            </div>
            <textarea
              value={html}
              onChange={e => setHtml(e.target.value)}
              className={editorClass}
              spellCheck={false}
            />
          </div>
          {/* CSS */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-[var(--color-border)]">
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CSS</span>
            </div>
            <textarea
              value={css}
              onChange={e => setCss(e.target.value)}
              className={editorClass}
              spellCheck={false}
            />
          </div>
          {/* JS */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
              <FileCode className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JavaScript</span>
            </div>
            <textarea
              value={js}
              onChange={e => setJs(e.target.value)}
              className={editorClass}
              spellCheck={false}
            />
          </div>
        </div>

        {/* ── DESKTOP: iframe preview RIGHT ── */}
        <div className="hidden lg:flex flex-col w-1/2 overflow-hidden">
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Output</span>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={srcDoc}
            title="sandbox-output"
            sandbox="allow-scripts allow-modals"
            className="flex-1 w-full bg-white border-none"
          />
        </div>

        {/* ── MOBILE: one panel at a time ── */}

        {/* HTML panel mobile */}
        <div className={`lg:hidden flex-col w-full overflow-hidden ${activeTab === 'html' ? 'flex' : 'hidden'}`}>
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
            <FileCode className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HTML Structure</span>
          </div>
          <textarea
            value={html}
            onChange={e => setHtml(e.target.value)}
            className={editorClass}
            spellCheck={false}
          />
        </div>

        {/* CSS panel mobile */}
        <div className={`lg:hidden flex-col w-full overflow-hidden ${activeTab === 'css' ? 'flex' : 'hidden'}`}>
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CSS Styling</span>
          </div>
          <textarea
            value={css}
            onChange={e => setCss(e.target.value)}
            className={editorClass}
            spellCheck={false}
          />
        </div>

        {/* JS panel mobile */}
        <div className={`lg:hidden flex-col w-full overflow-hidden ${activeTab === 'js' ? 'flex' : 'hidden'}`}>
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
            <FileCode className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JavaScript</span>
          </div>
          <textarea
            value={js}
            onChange={e => setJs(e.target.value)}
            className={editorClass}
            spellCheck={false}
          />
        </div>

        {/* Output panel mobile */}
        <div className={`lg:hidden flex-col w-full overflow-hidden ${activeTab === 'output' ? 'flex' : 'hidden'}`}>
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border-b border-[#30363d]">
            <Monitor className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Output</span>
          </div>
          <iframe
            srcDoc={srcDoc}
            title="sandbox-output-mobile"
            sandbox="allow-scripts allow-modals"
            className="flex-1 w-full bg-white border-none"
          />
        </div>

      </div>
    </div>
  );
};

export default Sandbox;

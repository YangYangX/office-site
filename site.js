let language = 'en';
try { language = localStorage.getItem('office-manual-language') === 'zh' ? 'zh' : 'en'; } catch {}
const translatedNodes = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (node.parentElement.closest('script,style,#theme-toggle,#language-toggle,#demo-status')) continue;
  if (node.textContent.trim()) translatedNodes.push([node, node.textContent]);
}
const text = value => language === 'zh' ? officeChinese[value] ?? value : value;
function setLanguage(next) {
  language = next; document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
  try { localStorage.setItem('office-manual-language', next); } catch {}
  for (const [node, original] of translatedNodes) {
    const trimmed = original.trim();
    node.textContent = language === 'zh' ? original.replace(trimmed, officeChinese[trimmed] ?? trimmed.replace(/^Version (.+) · Preview$/, '版本 $1 · 预览版')) : original;
  }
  const button = document.getElementById('language-toggle');
  button.textContent = next === 'zh' ? 'EN' : '中文';
  button.setAttribute('aria-label', next === 'zh' ? 'Switch to English' : 'Switch to Chinese');
  setTheme(document.documentElement.dataset.theme);
  updateStatus(); updateRecordingLabel();
  document.querySelector('#demo-stage iframe')?.contentWindow?.postMessage({ type: 'office-language', language: next }, location.origin);
}
document.getElementById('language-toggle').addEventListener('click', () => setLanguage(language === 'zh' ? 'en' : 'zh'));
const themeButton = document.getElementById('theme-toggle');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = language === 'zh' ? (theme === 'dark' ? '浅色' : '深色') : (theme === 'dark' ? 'Light' : 'Dark');
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  try { localStorage.setItem('office-manual-theme', theme); } catch {}
}
try { setTheme((localStorage.getItem('office-manual-theme') ?? localStorage.getItem('office-site-theme')) === 'dark' ? 'dark' : 'light'); } catch {}
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
const start = document.getElementById('start-demo');
const stop = document.getElementById('stop-demo');
const stage = document.getElementById('demo-stage');
const poster = document.getElementById('demo-poster');
const status = document.getElementById('demo-status');
let demoSizeObserver;
let statusText = 'Waiting for you';
function updateStatus() { status.textContent = text(statusText); }
start.addEventListener('click', () => {
  if (stage.querySelector('iframe')) return;
  const frame = document.createElement('iframe');
  frame.title = 'Fictional office playground';
  frame.src = `demo/index.html?lang=${language}`;
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  frame.addEventListener('load', () => {
    if (!frame.isConnected) return;
    statusText = 'Fictional sample office'; updateStatus();
    const content = frame.contentDocument?.getElementById('root');
    if (content) {
      const fit = () => { frame.style.height = `${Math.ceil(content.getBoundingClientRect().height) + 4}px`; };
      demoSizeObserver = new ResizeObserver(fit); demoSizeObserver.observe(content); fit();
    }
    frame.focus();
  }, { once: true });
  poster.hidden = true; stage.append(frame); stop.hidden = false;
  statusText = 'Opening the playground…'; updateStatus();
});
stop.addEventListener('click', () => {
  demoSizeObserver?.disconnect(); demoSizeObserver = undefined;
  stage.querySelector('iframe')?.remove(); poster.hidden = false; stop.hidden = true;
  statusText = 'Demo stopped'; updateStatus(); start.focus();
});

let recording = false;
function updateRecordingLabel() { document.getElementById('recording-toggle').textContent = text(recording ? 'Stop recording preview' : 'Play the recorded GIF'); }
document.getElementById('recording-toggle').addEventListener('click', () => {
  recording = !recording;
  document.getElementById('recorded-scene').src = recording ? 'manual/resources/team-progress-scene.gif' : 'media/office-map.png';
  updateRecordingLabel();
});
setLanguage(language);

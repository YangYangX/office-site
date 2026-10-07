const themeButton = document.getElementById('theme-toggle');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? 'Light' : 'Dark';
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  try { localStorage.setItem('office-site-theme', theme); } catch {}
}
try { setTheme(localStorage.getItem('office-site-theme') === 'dark' ? 'dark' : 'light'); } catch {}
themeButton.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
const start = document.getElementById('start-demo');
const stop = document.getElementById('stop-demo');
const stage = document.getElementById('demo-stage');
const poster = document.getElementById('demo-poster');
const status = document.getElementById('demo-status');
let demoSizeObserver;
start.addEventListener('click', () => {
  if (stage.querySelector('iframe')) return;
  const frame = document.createElement('iframe');
  frame.title = 'Fictional office playground';
  frame.src = 'demo/index.html';
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  frame.addEventListener('load', () => {
    if (!frame.isConnected) return;
    status.textContent = 'Fictional sample office';
    const content = frame.contentDocument?.getElementById('root');
    if (content) {
      const fit = () => { frame.style.height = `${Math.ceil(content.getBoundingClientRect().height) + 4}px`; };
      demoSizeObserver = new ResizeObserver(fit); demoSizeObserver.observe(content); fit();
    }
    frame.focus();
  }, { once: true });
  poster.hidden = true; stage.append(frame); stop.hidden = false;
  status.textContent = 'Opening the playground…';
});
stop.addEventListener('click', () => {
  demoSizeObserver?.disconnect(); demoSizeObserver = undefined;
  stage.querySelector('iframe')?.remove(); poster.hidden = false; stop.hidden = true;
  status.textContent = 'Demo stopped'; start.focus();
});

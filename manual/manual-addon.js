(() => {
  if (location.pathname.endsWith('/usage.html')) {
    const english = {"命令": "Commands", "场景库": "Scene library", "从项目理解，过渡到可执行命令": "From understanding the office to executable commands", "这页只说明怎么阅读和使用完整 manual。完整 payload、step、NPC command 和地图对象维护在": "This page explains how to use the complete manual. Payloads, steps, NPC commands and map objects are documented in", "；场景配方库和 JSON 浏览器维护在": "; scene recipes and the JSON browser are in", "。": ".", "先理解办公室表面": "First, understand the office", "先看首页的项目介绍和截图，理解你将控制什么：NPC、对话、气泡、地图对象、交互配置和运行状态。": "Start with the introduction and screenshots to understand NPCs, dialogue, bubbles, map objects, interactions and runtime state.", "查看项目介绍": "View the introduction", "再选择命令入口": "Then choose a command entry point", "固定流程用": "For fixed sequences use", "；使用者或工具的实时意图用": "; for real-time user or tool actions use", "。 只读排查时使用": ". For read-only inspection use", "查看命令入口": "View command entry points", "最后查字典和配方": "Finally, explore references and recipes", "payload、step、command、地图对象和场景配方，是把想法变成可执行指令的查询区。": "Look up payloads, steps, commands, map objects and scene recipes to turn an idea into executable instructions.", "查看场景库": "Browse scene recipes", "事件和 command plane": "Events and command plane", "查看 runtime event、payload 类型和推荐调用入口。": "Look up runtime events, payload types and recommended entry points.", "Script Step 字典": "Script Step reference", "查每一种 step 的字段、约束和使用方式。": "Find each step's fields, constraints and usage.", "NPC Command 字典": "NPC Command reference", "查底层 NPC command 的队列语义和参数。": "Check queue behavior and parameters for NPC commands.", "地图对象": "Map objects", "查可交互点、座位和门的对象名。": "Find names of interactive points, seats and doors."};
    const nodes = []; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) { const node = walker.currentNode; if (!node.parentElement.closest('script,style,#theme-toggle') && node.textContent.trim()) nodes.push([node, node.textContent]); }
    const toggle = document.createElement('button'); toggle.id = 'language-toggle'; toggle.type = 'button'; document.querySelector('nav > div').prepend(toggle);
    const apply = () => {
      const zh = localStorage.getItem('office-manual-language') !== 'en'; document.documentElement.lang = zh ? 'zh-CN' : 'en';
      for (const [node, original] of nodes) { const key = original.trim().replace(/\s+/g, ' '); node.textContent = zh ? original : (english[key] ?? original); }
      toggle.textContent = zh ? 'EN' : '中文'; toggle.setAttribute('aria-label', zh ? 'Switch to English' : 'Switch to Chinese');
    };
    toggle.addEventListener('click', () => { localStorage.setItem('office-manual-language', document.documentElement.lang === 'en' ? 'zh' : 'en'); apply(); }); apply();
  }
  const note = document.createElement('aside'); note.className = 'manual-site-note';
  const home = document.createElement('a'); home.href = '../index.html';
  const description = document.createElement('p'); note.append(home, description); document.body.prepend(note);
  const update = () => {
    const zh = document.documentElement.lang.startsWith('zh');
    home.textContent = zh ? '← 返回产品首页 / 下载与试玩' : '← Product home / downloads and demo';
    description.textContent = zh ? '开发者与高级玩家参考：这里保留旧版 Skill、调试命令和剧本配方。控制台命令需要兼容的开发运行环境，不能直接在正式桌面应用或网页演示中执行。普通用户请使用首页的通用 MCP 设置流程。' : 'Developer and power-player reference: legacy Skill, debug commands and scripted recipes. Console commands require a compatible development runtime; they do not run in the production desktop app or this website demo. For normal use, follow the generic MCP setup on the product homepage.';
  };
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] }); update();
  // Animated recordings are intentional even when the original manual embeds a GIF.
  for (const image of document.querySelectorAll('img[data-gif-src]')) {
    const source = image.dataset.gifSrc;
    const button = document.createElement('button'); button.type = 'button'; let playing = false;
    const caption = () => button.textContent = document.documentElement.lang.startsWith('zh') ? (playing ? '停止录制预览' : '播放录制的 GIF') : (playing ? 'Stop recording preview' : 'Play recorded GIF');
    button.addEventListener('click', () => { playing = !playing; image.src = playing ? source : 'resources/office-map.png'; caption(); });
    new MutationObserver(caption).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] }); image.after(button); caption();
  }
})();

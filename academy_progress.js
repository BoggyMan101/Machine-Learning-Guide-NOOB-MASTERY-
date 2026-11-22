// ============================================================================
// ACADEMY PROGRESS PERSISTENCE ENGINE (v8.2 + Android APK WebView Bridge)
// Persists active academy, tab, module, Part Pager position, scroll depth,
// completed modules/labs, XP, quiz answers, and calculator state across page
// closes and Android app restarts.
// ============================================================================
(function (global) {
  'use strict';

  var PREFIX = 'v82_prog_';
  var GLOBAL_META_KEY = PREFIX + 'global_meta';
  var STATE_KEYS = {
    ml: PREFIX + 'ml_state',
    ll: PREFIX + 'll_state',
    rosetta: PREFIX + 'rosetta_state'
  };

  function getNativeBridge() {
    try {
      if (global.AndroidProgressBridge && typeof global.AndroidProgressBridge.loadState === 'function') {
        return global.AndroidProgressBridge;
      }
      var syncHost = global.chrome && global.chrome.webview && global.chrome.webview.hostObjects && global.chrome.webview.hostObjects.sync;
      if (syncHost && syncHost.desktopBridge) {
        return syncHost.desktopBridge;
      }
    } catch (_) {}
    return null;
  }

  function hasNativeBridge() {
    return !!getNativeBridge();
  }

  function postDesktopBackup(msg) {
    try {
      if (global.chrome && global.chrome.webview && typeof global.chrome.webview.postMessage === 'function') {
        global.chrome.webview.postMessage(JSON.stringify(msg));
      }
    } catch (_) {}
  }

  function notifyLastPage(pageFile) {
    var bridge = getNativeBridge();
    if (bridge) {
      try { bridge.setLastPage(pageFile); } catch (_) {}
    }
    postDesktopBackup({ type: 'setLastPage', page: pageFile });
  }

  function storageGet(key) {
    var bridge = getNativeBridge();
    if (bridge) {
      try {
        var nativeVal = bridge.loadState(key);
        if (nativeVal && typeof nativeVal === 'string' && nativeVal.length > 0) {
          try {
            if (global.localStorage) global.localStorage.setItem(key, nativeVal);
          } catch (_) {}
          return nativeVal;
        }
      } catch (_) {}
    }
    try {
      return global.localStorage ? global.localStorage.getItem(key) : null;
    } catch (_) {
      return null;
    }
  }

  function storageSet(key, val) {
    try {
      if (global.localStorage) global.localStorage.setItem(key, val);
    } catch (_) {}
    var bridge = getNativeBridge();
    if (bridge) {
      try { bridge.saveState(key, val); } catch (_) {}
    }
    postDesktopBackup({ type: 'saveState', key: key, val: val });
  }

  function storageRemove(key) {
    try {
      if (global.localStorage) global.localStorage.removeItem(key);
    } catch (_) {}
    var bridge = getNativeBridge();
    if (bridge) {
      try { bridge.removeState(key); } catch (_) {}
    }
    postDesktopBackup({ type: 'removeState', key: key });
  }

  function readJson(key) {
    var raw = storageGet(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function writeJson(key, obj) {
    try {
      storageSet(key, JSON.stringify(obj));
    } catch (_) {}
  }

  function computeScrollPct() {
    try {
      var doc = global.document.documentElement;
      var body = global.document.body;
      var scrollTop = global.scrollY || global.pageYOffset || (doc && doc.scrollTop) || (body && body.scrollTop) || 0;
      var maxScroll = Math.max(
        1,
        ((doc && doc.scrollHeight) || (body && body.scrollHeight) || 1) - (global.innerHeight || 700)
      );
      return {
        scrollY: Math.max(0, Math.round(scrollTop)),
        scrollPct: Math.max(0, Math.min(100, Math.round((scrollTop / maxScroll) * 100)))
      };
    } catch (_) {
      return { scrollY: 0, scrollPct: 0 };
    }
  }

  function showToast(msg) {
    try {
      if (!global.document || !global.document.body) return;
      var prev = global.document.getElementById('v82-resume-toast');
      if (prev) prev.remove();
      var el = global.document.createElement('div');
      el.id = 'v82-resume-toast';
      el.style.cssText =
        'position:fixed;bottom:16px;right:16px;z-index:120;max-width:340px;' +
        'padding:10px 14px;border-radius:12px;font-size:12px;font-weight:700;' +
        'background:rgba(15,23,42,0.96);color:#e2e8f0;border:1px solid rgba(56,189,248,0.5);' +
        'box-shadow:0 12px 28px rgba(2,6,23,0.65);display:flex;align-items:center;gap:8px;' +
        'transition:opacity 0.35s ease,transform 0.35s ease;';
      el.textContent = msg;
      global.document.body.appendChild(el);
      setTimeout(function () {
        el.style.opacity = '0';
        el.style.transform = 'translateY(8px)';
        setTimeout(function () { if (el.parentNode) el.remove(); }, 380);
      }, 3200);
    } catch (_) {}
  }

  var _activeCtx = null;
  var _saveTimer = null;

  function detectActiveTab(acad) {
    try {
      var btns = global.document.querySelectorAll('.main-tab-btn');
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        if (b.id && b.id.indexOf('tab-btn-') === 0 && b.className.indexOf('bg-[var(--primary)]') !== -1) {
          return b.id.replace('tab-btn-', '');
        }
      }
    } catch (_) {}
    return 'curriculum';
  }

  function formatPartLabel(partVal) {
    if (partVal === 'all') return 'All Parts';
    if (typeof partVal === 'number' && partVal >= 0) return 'Part ' + (partVal + 1);
    return 'Part 1';
  }

  function saveNow() {
    if (!_activeCtx) return false;
    var acad = _activeCtx.acad;
    var key = STATE_KEYS[acad];
    if (!key) return false;

    var sc = computeScrollPct();
    if (acad === 'rosetta') {
      var rosState = {
        acad: 'rosetta',
        pageFile: 'machine_learning_formula_rosetta_stone.html',
        activeTokenIdx: typeof global.activeTokenIdx === 'number' ? global.activeTokenIdx : 0,
        scrollY: sc.scrollY,
        scrollPct: sc.scrollPct,
        updatedAt: Date.now()
      };
      writeJson(key, rosState);
      writeJson(GLOBAL_META_KEY, {
        lastPage: 'machine_learning_formula_rosetta_stone.html',
        lastAcademy: 'rosetta',
        updatedAt: rosState.updatedAt
      });
      return true;
    }

    var st = global.appState;
    if (!st) return false;

    var partMap = acad === 'ml' ? (global._v8PartByMod || {}) : (global._v8LLPartByMod || {});
    var modId = st.activeModuleId || 'mod0';
    var curPart = partMap.hasOwnProperty(modId) ? partMap[modId] : 0;
    var modTitle = '';
    try {
      var domTitleEl = global.document.getElementById('curriculum-module-title') ||
        global.document.querySelector('#curriculum-module-content h2');
      if (domTitleEl && domTitleEl.textContent) {
        modTitle = domTitleEl.textContent.trim();
      }
      if (!modTitle && typeof global.CURRICULUM_MODULES !== 'undefined' && Array.isArray(global.CURRICULUM_MODULES)) {
        var mObj = global.CURRICULUM_MODULES.find(function (item) { return item.id === modId; });
        if (mObj) modTitle = (mObj.chapter ? mObj.chapter + ': ' : '') + (mObj.title || modId);
      }
    } catch (_) {}

    var activeTab = detectActiveTab(acad);
    var totalMods = acad === 'ml' ? 31 : 19;
    try {
      var doneTxt = global.document.getElementById('modules-done-count')?.textContent || '';
      var parts = doneTxt.split('/');
      if (parts.length === 2 && parseInt(parts[1], 10) > 0) {
        totalMods = parseInt(parts[1], 10);
      }
    } catch (_) {}

    var payload = {
      acad: acad,
      pageFile: acad === 'ml' ? 'ml_interactive_academy.html' : 'lurelock_interactive_academy.html',
      xp: Number(st.xp || 0),
      userXP: Number(st.userXP || st.xp || 0),
      completedModules: st.completedModules ? Array.from(st.completedModules) : [],
      completedLabs: st.completedLabs ? Array.from(st.completedLabs) : [],
      quizAnswers: st.quizAnswers || {},
      activeTab: activeTab,
      activeModuleId: modId,
      activeModuleTitle: modTitle || modId,
      totalModules: totalMods,
      partByMod: Object.assign({}, partMap),
      currentPart: curPart,
      currentPartLabel: formatPartLabel(curPart),
      activeFormulaIdx: Number(st.activeFormulaIdx || 0),
      activeTokenIdx: Number(st.activeTokenIdx || 0),
      activeLibId: st.activeLibId || (acad === 'ml' ? 'numpy' : 'pandas'),
      activeLabId: Number(st.activeLabId || 0),
      activeDebuggerIdx: Number(st.activeDebuggerIdx || 0),
      cleaningStage: Number(st.cleaningStage || 0),
      depthMode: global.AcademyCore && typeof global.AcademyCore.getDepthMode === 'function'
        ? global.AcademyCore.getDepthMode() : (storageGet('v82_depth_mode') || 'all'),
      scrollY: sc.scrollY,
      scrollPct: sc.scrollPct,
      updatedAt: Date.now()
    };

    writeJson(key, payload);
    writeJson(GLOBAL_META_KEY, {
      lastPage: payload.pageFile,
      lastAcademy: acad,
      updatedAt: payload.updatedAt
    });
    notifyLastPage(payload.pageFile);
    return true;
  }

  function scheduleSave(delayMs) {
    if (_saveTimer) clearTimeout(_saveTimer);
    _saveTimer = setTimeout(function () {
      _saveTimer = null;
      saveNow();
    }, typeof delayMs === 'number' ? delayMs : 220);
  }

  function applySavedBeforeRender(acad) {
    var saved = readJson(STATE_KEYS[acad]);
    if (!saved || !global.appState) return saved;
    var st = global.appState;

    if (typeof saved.xp === 'number') st.xp = saved.xp;
    if (typeof saved.userXP === 'number') st.userXP = saved.userXP;
    if (Array.isArray(saved.completedModules)) st.completedModules = new Set(saved.completedModules);
    if (Array.isArray(saved.completedLabs)) st.completedLabs = new Set(saved.completedLabs);
    if (saved.quizAnswers && typeof saved.quizAnswers === 'object') {
      st.quizAnswers = Object.assign({}, saved.quizAnswers);
    }

    var urlMod = null;
    try {
      urlMod = new URLSearchParams(global.location.search || '').get('mod');
    } catch (_) {}
    if (!urlMod && saved.activeModuleId) {
      st.activeModuleId = saved.activeModuleId;
    }

    if (typeof saved.activeFormulaIdx === 'number') st.activeFormulaIdx = saved.activeFormulaIdx;
    if (typeof saved.activeTokenIdx === 'number') st.activeTokenIdx = saved.activeTokenIdx;
    if (saved.activeLibId) { st.activeLibId = saved.activeLibId; st.selectedLib = saved.activeLibId; }
    if (typeof saved.activeLabId === 'number') { st.activeLabId = saved.activeLabId; st.selectedLabIdx = saved.activeLabId; }
    if (typeof saved.activeDebuggerIdx === 'number') { st.activeDebuggerIdx = saved.activeDebuggerIdx; st.selectedDebuggerIdx = saved.activeDebuggerIdx; }
    if (typeof saved.cleaningStage === 'number') st.cleaningStage = saved.cleaningStage;

    if (saved.partByMod && typeof saved.partByMod === 'object') {
      if (acad === 'ml') {
        global._v8PartByMod = Object.assign({}, global._v8PartByMod || {}, saved.partByMod);
      } else if (acad === 'll') {
        global._v8LLPartByMod = Object.assign({}, global._v8LLPartByMod || {}, saved.partByMod);
      }
    }

    if (saved.depthMode && global.AcademyCore && typeof global.AcademyCore.setDepthMode === 'function') {
      global.AcademyCore.setDepthMode(saved.depthMode);
    }

    return saved;
  }

  function finishAcademyInit(acad, saved) {
    _activeCtx = { acad: acad };

    try {
      if (typeof global.updateHeaderStats === 'function') global.updateHeaderStats();
      if (typeof global.updateHeaderProgress === 'function') global.updateHeaderProgress();
    } catch (_) {}

    var urlMod = null;
    try { urlMod = new URLSearchParams(global.location.search || '').get('mod'); } catch (_) {}
    var pendingScrollY = (!urlMod && saved && typeof saved.scrollY === 'number' && saved.scrollY > 40) ? saved.scrollY : 0;

    if (pendingScrollY > 0) {
      try {
        if (global.history && 'scrollRestoration' in global.history) {
          global.history.scrollRestoration = 'manual';
        }
      } catch (_) {}
    }

    if (saved) {
      try {
        if (!urlMod && saved.activeTab && saved.activeTab !== 'curriculum' && typeof global.switchMainTab === 'function') {
          global.switchMainTab(saved.activeTab);
        }
        if (typeof global.renderCurriculumSidebar === 'function') {
          global.renderCurriculumSidebar();
        }
        if (pendingScrollY > 0) {
          var applySavedScroll = function () {
            try { global.scrollTo(0, pendingScrollY); } catch (_) {}
          };
          requestAnimationFrame(function () {
            setTimeout(applySavedScroll, 140);
          });
          setTimeout(applySavedScroll, 420);
          global.addEventListener('load', function () {
            setTimeout(applySavedScroll, 60);
            setTimeout(applySavedScroll, 280);
          });
        }
        if (!urlMod && (saved.activeModuleId !== 'mod0' || saved.currentPart > 0 || saved.completedModules.length > 0 || saved.scrollY > 120)) {
          showToast('📖 Resumed: ' + (saved.activeModuleTitle || saved.activeModuleId) + ' (' + (saved.currentPartLabel || 'Part 1') + ')');
        }
      } catch (_) {}
    }

    // Wrap functions to save on every learning interaction
    if (typeof global.switchMainTab === 'function' && !global.switchMainTab.__v82Wrapped) {
      var origSwitchTab = global.switchMainTab;
      global.switchMainTab = function () {
        var r = origSwitchTab.apply(this, arguments);
        scheduleSave(80);
        return r;
      };
      global.switchMainTab.__v82Wrapped = true;
    }

    if (typeof global.selectCurriculumModule === 'function' && !global.selectCurriculumModule.__v82Wrapped) {
      var origSelMod = global.selectCurriculumModule;
      global.selectCurriculumModule = function () {
        var r = origSelMod.apply(this, arguments);
        scheduleSave(100);
        return r;
      };
      global.selectCurriculumModule.__v82Wrapped = true;
    }

    if (typeof global.updateHeaderStats === 'function' && !global.updateHeaderStats.__v82Wrapped) {
      var origHdr = global.updateHeaderStats;
      global.updateHeaderStats = function () {
        var r = origHdr.apply(this, arguments);
        scheduleSave(60);
        return r;
      };
      global.updateHeaderStats.__v82Wrapped = true;
    }

    if (global.AcademyCore && typeof global.AcademyCore.setDepthMode === 'function' && !global.AcademyCore.setDepthMode.__v82Wrapped) {
      var origDepth = global.AcademyCore.setDepthMode;
      global.AcademyCore.setDepthMode = function (m) {
        var r = origDepth.apply(this, arguments);
        storageSet('v82_depth_mode', m);
        scheduleSave(80);
        return r;
      };
      global.AcademyCore.setDepthMode.__v82Wrapped = true;
    }

    attachLifecycleListeners();
    if (pendingScrollY > 0) {
      setTimeout(saveNow, 650);
    } else {
      saveNow();
    }
  }

  function initRosetta() {
    _activeCtx = { acad: 'rosetta' };
    var saved = readJson(STATE_KEYS.rosetta);
    if (saved) {
      try {
        if (typeof saved.activeTokenIdx === 'number' && typeof global.selectToken === 'function') {
          global.selectToken(saved.activeTokenIdx);
        }
        if (typeof saved.scrollY === 'number' && saved.scrollY > 40) {
          var targetY = saved.scrollY;
          setTimeout(function () { global.scrollTo(0, targetY); }, 120);
        }
      } catch (_) {}
    }
    if (typeof global.selectToken === 'function' && !global.selectToken.__v82Wrapped) {
      var origTok = global.selectToken;
      global.selectToken = function () {
        var r = origTok.apply(this, arguments);
        scheduleSave(80);
        return r;
      };
      global.selectToken.__v82Wrapped = true;
    }
    attachLifecycleListeners();
    saveNow();
    notifyLastPage('machine_learning_formula_rosetta_stone.html');
  }

  function attachLifecycleListeners() {
    if (global.__v82ProgressListenersBound) return;
    global.__v82ProgressListenersBound = true;

    global.addEventListener('scroll', function () {
      scheduleSave(300);
    }, { passive: true });

    global.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('[data-v8-go], [data-v8-action], [data-v82-depth-set]')) {
        scheduleSave(100);
      }
    }, true);

    global.document.addEventListener('visibilitychange', function () {
      if (global.document.visibilityState === 'hidden') {
        saveNow();
      }
    });
    global.addEventListener('pagehide', saveNow);
    global.addEventListener('beforeunload', saveNow);
  }

  function esc(str) {
    return String(str === null || str === undefined ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatAgo(ts) {
    if (!ts) return '';
    var diffMin = Math.floor((Date.now() - ts) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return diffMin + 'm ago';
    var diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return diffHr + 'h ago';
    return Math.floor(diffHr / 24) + 'd ago';
  }

  function renderHubResumeBanner(slotId) {
    var slot = global.document.getElementById(slotId || 'v82-hub-resume-slot');
    if (!slot) return;

    writeJson(GLOBAL_META_KEY, {
      lastPage: 'index.html',
      lastAcademy: 'hub',
      updatedAt: Date.now()
    });
    notifyLastPage('index.html');

    var ml = readJson(STATE_KEYS.ml);
    var ll = readJson(STATE_KEYS.ll);
    var candidates = [];
    if (ml && ml.activeModuleId) candidates.push(ml);
    if (ll && ll.activeModuleId) candidates.push(ll);
    if (!candidates.length) {
      slot.innerHTML = '';
      return;
    }
    candidates.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
    var latest = candidates[0];

    var cardsHtml = candidates.map(function (st) {
      var isMl = st.acad === 'ml';
      var accent = isMl ? 'border-amber-500/30 text-amber-300' : 'border-cyan-500/30 text-cyan-300';
      var btnBg = isMl ? 'from-amber-500 to-orange-500' : 'from-cyan-500 to-blue-500';
      var label = isMl ? '🧠 ML Academy' : '🛡️ LureLock Academy';
      var doneCount = Array.isArray(st.completedModules) ? st.completedModules.length : 0;
      var totalCount = st.totalModules || (isMl ? 31 : 19);
      return '<div class="p-4 rounded-2xl bg-slate-950 border ' + accent + ' flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
        '<div class="space-y-1">' +
          '<div class="flex flex-wrap items-center gap-2 text-xs font-bold">' +
            '<span>' + label + '</span>' +
            '<span class="text-slate-400">•</span>' +
            '<span class="text-emerald-400">' + doneCount + '/' + totalCount + ' Completed • ' + (st.xp || 0) + ' XP</span>' +
            '<span class="text-slate-400 font-mono">(' + esc(formatAgo(st.updatedAt)) + ')</span>' +
          '</div>' +
          '<div class="text-sm font-bold text-white">' + esc(st.activeModuleTitle || st.activeModuleId) + '</div>' +
          '<div class="text-xs text-slate-400 font-mono">Saved Spot: ' + esc(st.currentPartLabel || 'Part 1') + ' • Tab: ' + esc(st.activeTab || 'curriculum') + ' • Scroll ' + (st.scrollPct || 0) + '%</div>' +
        '</div>' +
        '<a href="' + esc(st.pageFile) + '" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r ' + btnBg + ' text-slate-950 whitespace-nowrap shadow-lg">▶ Continue Reading →</a>' +
      '</div>';
    }).join('');

    slot.innerHTML =
      '<div class="rounded-3xl p-6 bg-slate-900/60 border border-indigo-500/40 shadow-2xl space-y-4">' +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<div class="flex items-center gap-2">' +
            '<span class="text-lg">📖</span>' +
            '<h2 class="text-lg font-bold text-white">Continue Where You Left Off</h2>' +
            '<span class="text-xs font-mono text-emerald-400">(Saved automatically across app closes)</span>' +
          '</div>' +
          '<div class="flex items-center gap-2">' +
            '<button type="button" id="v82-reset-prog-btn" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">Reset Saved Progress</button>' +
            '<a href="' + esc(latest.pageFile) + '" class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 whitespace-nowrap">Resume Latest →</a>' +
          '</div>' +
        '</div>' +
        '<div class="grid grid-cols-1 gap-3">' + cardsHtml + '</div>' +
      '</div>';

    var resetBtn = global.document.getElementById('v82-reset-prog-btn');
    if (resetBtn) {
      var confirmArmed = false;
      resetBtn.addEventListener('click', function () {
        if (!confirmArmed) {
          confirmArmed = true;
          resetBtn.textContent = 'Tap Again to Confirm Reset';
          resetBtn.style.borderColor = '#f43f5e';
          setTimeout(function () {
            confirmArmed = false;
            if (resetBtn) {
              resetBtn.textContent = 'Reset Saved Progress';
              resetBtn.style.borderColor = '';
            }
          }, 3500);
          return;
        }
        storageRemove(STATE_KEYS.ml);
        storageRemove(STATE_KEYS.ll);
        storageRemove(STATE_KEYS.rosetta);
        storageRemove(GLOBAL_META_KEY);
        slot.innerHTML = '';
        showToast('Saved reading progress cleared.');
      });
    }
  }

  global.AcademyProgress = {
    version: '8.2',
    isEmbeddedApp: hasNativeBridge,
    applySavedBeforeRender: applySavedBeforeRender,
    finishAcademyInit: finishAcademyInit,
    initRosetta: initRosetta,
    renderHubResumeBanner: renderHubResumeBanner,
    saveNow: saveNow,
    scheduleSave: scheduleSave,
    readSaved: function (acad) { return readJson(STATE_KEYS[acad]); },
    storageGet: storageGet,
    storageSet: storageSet
  };
})(window);

// ============================================================================
// ACADEMY CORE SHARED ENGINE (v8)
// Centralizes HTML escaping, theme-safe helpers, drawer & module navigation,
// shared Socratic/Role/Problem formatters, and the interactive Part-by-Part Pager.
// ============================================================================
(function (global) {
  'use strict';

  function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getQueryParam(name) {
    try {
      const params = new URLSearchParams(global.location.search || '');
      return params.get(name);
    } catch (_) {
      return null;
    }
  }

  // Depth Dial state ('all' | 'intuition' | 'math') persisted safely
  let _depthMode = 'all';
  try {
    const savedDepth = (global.AcademyProgress && typeof global.AcademyProgress.storageGet === 'function'
      ? global.AcademyProgress.storageGet('v82_depth_mode')
      : null) || (global.localStorage && global.localStorage.getItem('v82_depth_mode'));
    if (savedDepth === 'all' || savedDepth === 'intuition' || savedDepth === 'math') {
      _depthMode = savedDepth;
    }
  } catch (_) {}

  function applyDepthAttribute() {
    if (global.document && global.document.body) {
      global.document.body.setAttribute('data-v82-depth', _depthMode);
    }
    if (global.document) {
      const btns = global.document.querySelectorAll('[data-v82-depth-set]');
      btns.forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-v82-depth-set') === _depthMode);
      });
    }
  }

  function setDepthMode(mode) {
    if (mode !== 'all' && mode !== 'intuition' && mode !== 'math') return;
    _depthMode = mode;
    try {
      if (global.AcademyProgress && typeof global.AcademyProgress.storageSet === 'function') {
        global.AcademyProgress.storageSet('v82_depth_mode', mode);
      } else if (global.localStorage) {
        global.localStorage.setItem('v82_depth_mode', mode);
      }
    } catch (_) {}
    applyDepthAttribute();
  }

  function getDepthMode() {
    return _depthMode;
  }

  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', applyDepthAttribute);
    } else {
      applyDepthAttribute();
    }
  }

  // Capture ?part= once in <head> before any legacy body script mutates URL state
  const _initialPartParam = getQueryParam('part');
  let _initialPartConsumed = false;

  function consumeInitialPartParam() {
    if (_initialPartConsumed) return null;
    _initialPartConsumed = true;
    return _initialPartParam;
  }

  function setQueryParam(name, value) {
    try {
      if (!global.history || !global.history.replaceState) return;
      const url = new URL(global.location.href);
      if (value === null || value === undefined || value === '') {
        url.searchParams.delete(name);
      } else {
        url.searchParams.set(name, String(value));
      }
      global.history.replaceState(null, '', url.toString());
    } catch (_) {
      // Ignore file:// restrictions if any browser blocks replaceState
    }
  }

  // Shared collapsible roadmap drawer controller
  function toggleDrawer(drawerEl, buttonEl, forceOpen) {
    if (!drawerEl) return false;
    const isHidden = drawerEl.classList.contains('hidden');
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : isHidden;
    drawerEl.classList.toggle('hidden', !shouldOpen);
    if (buttonEl) {
      buttonEl.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
    return shouldOpen;
  }

  // Shared Role Relationship Banner renderer (Helper vs Core Model vs Workflow)
  function renderRoleBanner(roleSpec) {
    if (!roleSpec || (!roleSpec.badge && !roleSpec.text && !roleSpec.banner)) return '';
    const raw = String(roleSpec.banner || roleSpec.badge || '').toUpperCase();
    const badgeText = roleSpec.badge || 'CONCEPT ROLE';
    const descText = roleSpec.text || roleSpec.desc || '';
    const isModel = raw.includes('CORE MODEL') || raw.includes('ACTUAL MODEL') || raw.includes('ARCHITECTURE');
    const isHelper = raw.includes('HELPER') || raw.includes('DIAGNOSTIC') || raw.includes('DATA') || raw.includes('OPTIMIZATION');
    const boxCls = isModel
      ? 'bg-emerald-950/35 border-emerald-500/35'
      : isHelper
        ? 'bg-sky-950/35 border-sky-500/35'
        : 'bg-amber-950/35 border-amber-500/35';
    const pillCls = isModel
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
      : isHelper
        ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
        : 'bg-amber-500/20 text-amber-300 border-amber-400/30';

    return (
      '<div class="rounded-xl p-4 border ' + boxCls + ' flex flex-wrap items-center gap-3">' +
        '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ' + pillCls + '">' +
          escapeHtml(badgeText) +
        '</span>' +
        '<span class="text-xs sm:text-sm text-slate-200 leading-relaxed">' +
          escapeHtml(descText) +
        '</span>' +
      '</div>'
    );
  }

  // Shared 1D (Non-Multiparameter) vs 2D+ (Multiparameter) worked problem card
  function renderDualParamCard(problemSpec, variant, formatStepsFn) {
    if (!problemSpec) return '';
    const isSingle = variant === 'single';
    const badgeCls = isSingle
      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    const wrapCls = isSingle
      ? 'bg-amber-950/20 border-amber-500/30'
      : 'bg-emerald-950/20 border-emerald-500/30';
    const badgeText = isSingle
      ? 'Part 3 • Non-Multiparameter (1 Feature)'
      : 'Part 4 • Multiparameter (2+ Features)';

    const stepsRaw = Array.isArray(problemSpec.steps) ? problemSpec.steps.join('\n') : String(problemSpec.steps || '');
    const stepsHtml = typeof formatStepsFn === 'function' ? formatStepsFn(stepsRaw) : '<pre class="text-xs font-mono whitespace-pre-wrap text-slate-200">' + escapeHtml(stepsRaw) + '</pre>';
    const tableHtml = problemSpec.table
      ? '<div class="overflow-x-auto my-3 rounded-lg border border-slate-700/60 bg-slate-950/60 p-2">' + problemSpec.table + '</div>'
      : '';
    const verdictHtml = problemSpec.verdict
      ? '<div class="mt-3 p-3 rounded-lg bg-slate-900/80 border border-slate-700/70 text-xs sm:text-sm text-slate-200 leading-relaxed"><strong class="text-white">Interpretation:</strong> ' + escapeHtml(problemSpec.verdict) + '</div>'
      : '';

    return (
      '<div class="rounded-xl p-5 border ' + wrapCls + ' shadow-sm">' +
        '<div class="flex flex-wrap items-center gap-2 mb-3">' +
          '<span class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ' + badgeCls + '">' +
            badgeText +
          '</span>' +
          '<span class="text-sm sm:text-base font-bold text-white">' + escapeHtml(problemSpec.title || '') + '</span>' +
        '</div>' +
        (problemSpec.dataSummary
          ? '<div class="text-xs sm:text-sm text-slate-300 mb-3 leading-relaxed bg-slate-950/45 border border-slate-800 rounded-lg px-3.5 py-2.5">' + escapeHtml(problemSpec.dataSummary) + '</div>'
          : '') +
        tableHtml +
        '<div class="mt-2">' + stepsHtml + '</div>' +
        verdictHtml +
      '</div>'
    );
  }

  // Shared Socratic "How / What / Why" learner Q&A card list
  function renderSocraticQA(items, headingText) {
    if (!Array.isArray(items) || items.length === 0) return '';
    const rows = items.map(function (qa) {
      return (
        '<div class="rounded-lg p-3.5 bg-slate-900/70 border border-slate-800/90">' +
          '<div class="text-xs sm:text-sm font-bold text-sky-300 mb-1.5">Student asks: "' + escapeHtml(qa.q) + '"</div>' +
          '<div class="text-xs sm:text-sm text-slate-200 leading-relaxed"><strong class="text-emerald-300">Tutor answers:</strong> ' + escapeHtml(qa.a) + '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div class="rounded-xl p-5 bg-sky-950/20 border border-sky-500/25">' +
        '<div class="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3">' +
          escapeHtml(headingText || 'Socratic Q&A • How, What & Why (15-Year-Old Friendly)') +
        '</div>' +
        '<div class="space-y-3">' + rows + '</div>' +
      '</div>'
    );
  }

  // Interactive Part-by-Part Pager Controller
  // Controls visibility of `.v8-part-panel` elements inside a module container,
  // injects the sticky Part Stepper + Prev/Next Part footer + "Show All Parts" toggle,
  // and fires `onPartChange` so hidden canvases draw crisply on reveal.
  function mountPartPager(containerEl, partsMeta, options) {
    if (!containerEl) return null;
    const opts = options || {};
    const panels = Array.from(containerEl.querySelectorAll(':scope > .v8-part-panel, .v8-part-panel[data-part-idx]'));
    // Deduplicate nested panels if any
    const directPanels = panels.filter(function (el) {
      return el.closest('[data-v8-pager-host]') === containerEl || el.parentElement === containerEl || panels.indexOf(el) !== -1;
    });

    // Only keep unique panels matching partsMeta count when possible
    const seen = new Set();
    const activePanels = [];
    directPanels.forEach(function (el) {
      if (!seen.has(el)) {
        seen.add(el);
        activePanels.push(el);
      }
    });

    if (activePanels.length === 0) return null;

    containerEl.setAttribute('data-v8-pager-host', 'true');

    // Remove previously mounted chrome if re-mounting on an existing DOM skeleton (e.g. LureLock)
    const oldTop = containerEl.querySelector(':scope > [data-v8-stepper="top"]');
    const oldBottom = containerEl.querySelector(':scope > [data-v8-stepper="bottom"]');
    const oldHintInt = containerEl.querySelector(':scope > .v82-depth-hint[data-hint="intuition"]');
    const oldHintMath = containerEl.querySelector(':scope > .v82-depth-hint[data-hint="math"]');
    if (oldTop) oldTop.remove();
    if (oldBottom) oldBottom.remove();
    if (oldHintInt) oldHintInt.remove();
    if (oldHintMath) oldHintMath.remove();

    const total = activePanels.length;
    const urlPartRaw = getQueryParam('part');
    let parsedUrlPart = urlPartRaw ? parseInt(urlPartRaw, 10) - 1 : NaN;
    let initialIdx = Number.isInteger(opts.initialPart)
      ? opts.initialPart
      : (Number.isInteger(parsedUrlPart) ? parsedUrlPart : 0);

    if (initialIdx < 0) initialIdx = 0;
    if (initialIdx >= total) initialIdx = total - 1;

    const showAllDefault = Boolean(opts.showAll || getQueryParam('part') === 'all');

    const state = {
      current: initialIdx,
      total: total,
      showAll: showAllDefault,
      visited: new Set([initialIdx])
    };

    const topBar = document.createElement('div');
    topBar.setAttribute('data-v8-stepper', 'top');
    topBar.className = 'v8-stepper rounded-2xl p-3.5 mb-5 border shadow-lg';

    const bottomBar = document.createElement('div');
    bottomBar.setAttribute('data-v8-stepper', 'bottom');
    bottomBar.className = 'mt-6 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3';

    function getMeta(idx) {
      const m = (partsMeta && partsMeta[idx]) || {};
      return {
        shortLabel: m.shortLabel || ('Part ' + (idx + 1)),
        title: m.title || ('Part ' + (idx + 1)),
        icon: m.icon || ''
      };
    }

    function applyVisibility(triggerScroll) {
      containerEl.classList.toggle('v8-all-mode', state.showAll);
      activePanels.forEach(function (panel, idx) {
        const visible = state.showAll || idx === state.current;
        panel.classList.toggle('v8-hidden', !visible);
        panel.setAttribute('aria-hidden', visible ? 'false' : 'true');
      });

      const pct = Math.round(((state.current + 1) / state.total) * 100);
      const curMeta = getMeta(state.current);

      // Render top stepper HTML
      let pillsHtml = '';
      for (let i = 0; i < state.total; i++) {
        const meta = getMeta(i);
        const isActive = !state.showAll && i === state.current;
        const isVisited = state.visited.has(i);
        const cls = 'v8-step-btn' + (isActive ? ' is-active' : '') + (isVisited ? ' is-visited' : '');
        pillsHtml +=
          '<button type="button" class="' + cls + '" data-v8-go="' + i + '" aria-current="' + (isActive ? 'step' : 'false') + '">' +
            '<span class="v8-step-num">' + (i + 1) + '</span>' +
            '<span>' + escapeHtml(meta.shortLabel) + '</span>' +
          '</button>';
      }

      const depthHtml =
        '<div class="v82-stepper-tools">' +
          '<div class="v82-depth-group" role="group" aria-label="Study Depth Filter">' +
            '<button type="button" class="v82-depth-btn' + (_depthMode === 'all' ? ' is-active' : '') + '" data-v82-depth-set="all" title="Show all intuition, visuals, and math">All</button>' +
            '<button type="button" class="v82-depth-btn' + (_depthMode === 'intuition' ? ' is-active' : '') + '" data-v82-depth-set="intuition" title="Hide dense math tables & decoders to focus on intuition">Intuition</button>' +
            '<button type="button" class="v82-depth-btn' + (_depthMode === 'math' ? ' is-active' : '') + '" data-v82-depth-set="math" title="Focus on formulas, numbers, and live calculations">Math</button>' +
          '</div>' +
          '<button type="button" data-v82-open-lab="calc" class="v82-lab-trigger" title="Open interactive step-by-step model statistics calculator">🧮 Calculate Model Stats</button>' +
          '<button type="button" data-v82-open-lab="movie" class="v82-lab-trigger-subtle" title="Open animated numbers walkthrough & same-data model comparison">🎬 Numbers &amp; Compare</button>' +
        '</div>';

      topBar.innerHTML =
        '<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">' +
          '<div class="flex items-center gap-2">' +
            '<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/35">' +
              (state.showAll ? ('All ' + state.total + ' Parts Expanded') : ('Part ' + (state.current + 1) + ' of ' + state.total)) +
            '</span>' +
            '<span class="text-xs sm:text-sm font-bold text-[var(--foreground)]">' +
              escapeHtml(state.showAll ? 'Complete Module Study View' : curMeta.title) +
            '</span>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2">' +
            depthHtml +
            '<button type="button" data-v8-action="prev" class="v8-nav-btn px-2.5 py-1 rounded-lg text-xs font-semibold border border-[var(--border)] bg-[var(--content)] text-[var(--foreground)] hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed" ' +
              (state.showAll || state.current === 0 ? 'disabled' : '') + '>◀ Prev Part</button>' +
            '<button type="button" data-v8-action="next" class="v8-nav-btn px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-500/50 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/35 disabled:opacity-40 disabled:cursor-not-allowed" ' +
              (state.showAll || state.current >= state.total - 1 ? 'disabled' : '') + '>Next Part ▶</button>' +
            '<button type="button" data-v8-action="toggle-all" class="v8-nav-btn px-2.5 py-1 rounded-lg text-xs font-semibold border ' +
              (state.showAll
                ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'border-[var(--border)] bg-[var(--content)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]') +
            '">' + (state.showAll ? 'Focus Part-by-Part' : 'Show All Parts') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="v8-scroll-x flex items-center gap-2 pb-1.5">' + pillsHtml + '</div>' +
        '<div class="v8-progress-track mt-1.5"><div class="v8-progress-fill" style="width:' + (state.showAll ? 100 : pct) + '%"></div></div>';

      applyDepthAttribute();

      // Render bottom footer HTML
      const prevTitle = state.current > 0 ? getMeta(state.current - 1).shortLabel : '';
      const nextTitle = state.current < state.total - 1 ? getMeta(state.current + 1).shortLabel : '';
      bottomBar.innerHTML =
        '<button type="button" data-v8-action="prev" class="v8-nav-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-[var(--border)] bg-[var(--content)] text-[var(--foreground)] hover:border-[var(--primary)] disabled:opacity-35 disabled:cursor-not-allowed" ' +
          (state.showAll || state.current === 0 ? 'disabled' : '') + '>' +
          (state.current > 0 ? '◀ Part ' + state.current + ': ' + escapeHtml(prevTitle) : '◀ Start of Module') +
        '</button>' +
        '<div class="text-xs font-mono text-[var(--muted-foreground)]">' +
          (state.showAll ? ('Showing all ' + state.total + ' parts') : ('Step ' + (state.current + 1) + ' / ' + state.total)) +
        '</div>' +
        '<button type="button" data-v8-action="next" class="v8-nav-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-emerald-500/50 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/35 disabled:opacity-35 disabled:cursor-not-allowed" ' +
          (state.showAll || state.current >= state.total - 1 ? 'disabled' : '') + '>' +
          (state.current < state.total - 1 ? 'Part ' + (state.current + 2) + ': ' + escapeHtml(nextTitle) + ' ▶' : 'All Module Parts Read ✓') +
        '</button>';

      if (triggerScroll) {
        try {
          topBar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (_) {}
      }

      if (typeof opts.onPartChange === 'function') {
        const fire = function () {
          try {
            opts.onPartChange(state.current, curMeta, state.showAll);
          } catch (err) {
            if (global.console && global.console.error) {
              global.console.error('v8 onPartChange error:', err);
            }
          }
        };
        fire();
        if (typeof global.requestAnimationFrame === 'function') {
          global.requestAnimationFrame(fire);
        }
      }
    }

    function setPart(idx, triggerScroll) {
      if (idx < 0 || idx >= state.total) return;
      state.showAll = false;
      state.current = idx;
      state.visited.add(idx);
      if (opts.syncUrl !== false) {
        setQueryParam('part', idx + 1);
      }
      applyVisibility(triggerScroll);
    }

    function handleActionClick(e) {
      const depthBtn = e.target.closest('[data-v82-depth-set]');
      if (depthBtn) {
        const mode = depthBtn.getAttribute('data-v82-depth-set');
        setDepthMode(mode);
        return;
      }
      const labBtn = e.target.closest('[data-v82-open-lab]');
      if (labBtn) {
        const tab = labBtn.getAttribute('data-v82-open-lab') || 'calc';
        if (global.AcademyStatsLab && typeof global.AcademyStatsLab.openForCurrentModule === 'function') {
          global.AcademyStatsLab.openForCurrentModule(tab);
        }
        return;
      }
      const stepBtn = e.target.closest('[data-v8-go]');
      if (stepBtn) {
        const idx = parseInt(stepBtn.getAttribute('data-v8-go'), 10);
        if (!isNaN(idx)) setPart(idx, true);
        return;
      }
      const actionBtn = e.target.closest('[data-v8-action]');
      if (!actionBtn) return;
      const action = actionBtn.getAttribute('data-v8-action');
      if (action === 'prev' && state.current > 0) {
        setPart(state.current - 1, true);
      } else if (action === 'next' && state.current < state.total - 1) {
        setPart(state.current + 1, true);
      } else if (action === 'toggle-all') {
        state.showAll = !state.showAll;
        if (opts.syncUrl !== false) {
          setQueryParam('part', state.showAll ? 'all' : (state.current + 1));
        }
        applyVisibility(false);
      }
    }

    const hintInt = document.createElement('div');
    hintInt.className = 'v82-depth-hint';
    hintInt.setAttribute('data-hint', 'intuition');
    hintInt.innerHTML =
      '<span>💡 <strong>Intuition Focus Mode:</strong> Dense math tables &amp; symbol decoders are tucked away so you can focus on intuition and visuals.</span>' +
      '<button type="button" class="v82-btn-sm" data-v82-depth-set="all">Show All Details</button>';
    hintInt.addEventListener('click', handleActionClick);

    const hintMath = document.createElement('div');
    hintMath.className = 'v82-depth-hint';
    hintMath.setAttribute('data-hint', 'math');
    hintMath.innerHTML =
      '<span>📐 <strong>Math &amp; Numbers Focus Mode:</strong> Intro prose cards are tucked away so formulas, numbers, and live calculations stay front and center.</span>' +
      '<button type="button" class="v82-btn-sm" data-v82-depth-set="all">Show All Details</button>';
    hintMath.addEventListener('click', handleActionClick);

    topBar.addEventListener('click', handleActionClick);
    bottomBar.addEventListener('click', handleActionClick);

    containerEl.insertBefore(topBar, activePanels[0]);
    containerEl.insertBefore(hintInt, activePanels[0]);
    containerEl.insertBefore(hintMath, activePanels[0]);
    containerEl.appendChild(bottomBar);

    applyVisibility(false);
    if (global.AcademyStatsLab && typeof global.AcademyStatsLab.onModuleSync === 'function') {
      try { global.AcademyStatsLab.onModuleSync(); } catch (_) {}
    }

    return {
      setPart: function (idx) { setPart(idx, false); },
      nextPart: function () { if (state.current < state.total - 1) setPart(state.current + 1, true); },
      prevPart: function () { if (state.current > 0) setPart(state.current - 1, true); },
      setShowAll: function (val) { state.showAll = Boolean(val); applyVisibility(false); },
      getState: function () { return { current: state.current, total: state.total, showAll: state.showAll }; }
    };
  }

  global.AcademyCore = {
    version: '8.2',
    escapeHtml: escapeHtml,
    getQueryParam: getQueryParam,
    setQueryParam: setQueryParam,
    consumeInitialPartParam: consumeInitialPartParam,
    getDepthMode: getDepthMode,
    setDepthMode: setDepthMode,
    toggleDrawer: toggleDrawer,
    renderRoleBanner: renderRoleBanner,
    renderDualParamCard: renderDualParamCard,
    renderSocraticQA: renderSocraticQA,
    mountPartPager: mountPartPager
  };
})(window);

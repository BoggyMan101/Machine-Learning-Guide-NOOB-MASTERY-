// ============================================================================
// STATISTICS FOR ML, PROPER MODEL TESTING & STEP-THROUGH VISUAL BUILDERS (V10)
// Runs 100% offline in browser; hooks into AcademyCore + BeginnerBlueprint.
// ============================================================================
(function (global) {
  'use strict';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function detectAcad() {
    const fname = (global.location.pathname || '').split('/').pop().toLowerCase();
    if (fname.includes('lurelock')) return 'll';
    if (fname.includes('ml_interactive')) return 'ml';
    if (fname.includes('rosetta')) return 'rosetta';
    return 'index';
  }

  const prefersReducedMotion = Boolean(
    global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Unified color system across ALL charts, trees, and curves
  const PALETTE = {
    phish: '#f43f5e',       // Rose Red = Phishing / Positive / Residual Error
    phishSoft: 'rgba(244,63,94,0.18)',
    safe: '#10b981',        // Emerald Green = Safe / Negative / Good
    safeSoft: 'rgba(16,185,129,0.18)',
    model: '#38bdf8',       // Sky Blue = Model Boundary / Curve / Split Line
    modelSoft: 'rgba(56,189,248,0.18)',
    accent: '#f59e0b',      // Amber Gold = Active Linked Point / Winner / Support Vector
    accentSoft: 'rgba(245,158,11,0.22)',
    grid: 'rgba(148,163,184,0.22)',
    axis: '#94a3b8',
    text: '#e2e8f0',
    muted: '#94a3b8',
    cardBg: '#0f172a'
  };

  // ============================================================================
  // RUNNING DATASET: 5 Core LureLock Links (+3 for 8-point Scatter/ROC visuals)
  // Kept consistent across every Statistics, Testing, and Visual lesson!
  // ============================================================================
  const RUNNING_URLS = [
    { id: 'L1', url: 'paypa1-login.tk/verify', len: 22, pathLen: 7, ent: 4.10, dots: 2, hasIp: 0, brandSpoof: 1, y: 1, pA: 0.92, pB: 0.94, leakedTag: 'train_seen_paypa1' },
    { id: 'L2', url: 'docs.google.com/help', len: 20, pathLen: 5, ent: 2.70, dots: 2, hasIp: 0, brandSpoof: 0, y: 0, pA: 0.08, pB: 0.06, leakedTag: 'train_seen_google' },
    { id: 'L3', url: '192.168.4.22/auth.php', len: 21, pathLen: 9, ent: 3.85, dots: 3, hasIp: 1, brandSpoof: 1, y: 1, pA: 0.78, pB: 0.81, leakedTag: 'train_seen_ip' },
    { id: 'L4', url: 'github.com/explore', len: 18, pathLen: 8, ent: 2.60, dots: 1, hasIp: 0, brandSpoof: 0, y: 0, pA: 0.38, pB: 0.31, leakedTag: 'train_seen_github' },
    { id: 'L5', url: 'secure-chase-update.xyz/8f3k9q', len: 30, pathLen: 7, ent: 4.35, dots: 1, hasIp: 0, brandSpoof: 1, y: 1, pA: 0.46, pB: 0.62, leakedTag: 'train_seen_chase' }
  ];

  const EXTENDED_URLS = RUNNING_URLS.concat([
    { id: 'L6', url: 'en.wikipedia.org/wiki/URL', len: 25, pathLen: 9, ent: 3.05, dots: 2, hasIp: 0, brandSpoof: 0, y: 0, pA: 0.14, pB: 0.11 },
    { id: 'L7', url: 'amz0n-billing.ga/confirm', len: 24, pathLen: 8, ent: 4.02, dots: 1, hasIp: 0, brandSpoof: 1, y: 1, pA: 0.86, pB: 0.89 },
    { id: 'L8', url: 'news.ycombinator.com/item', len: 25, pathLen: 5, ent: 3.15, dots: 2, hasIp: 0, brandSpoof: 0, y: 0, pA: 0.22, pB: 0.19 }
  ]);

  // ============================================================================
  // TRACK STATE
  // ============================================================================
  const state = {
    openTrack: null,           // null | 'stats' | 'testing' | 'visuals'
    activeStatId: 'mean_var_sd',
    activeTestId: 'train_val_test',
    activeVisualKey: 'decision_tree',

    // Interactive state for Statistics Track (6 lessons)
    statSpreadMode: 'running', // 'running' | 'outlier'
    distTransformed: false,    // false | true (log1p transform)
    probClueFilter: 'all',     // 'all' | 'spoof' | 'clean'
    bayesBaseRate: 1.0,        // 0.1 | 1.0 | 5.0 | 20.0 (%)
    splitSeed: 1,              // 1..5
    corrFeaturePair: 'path',   // 'path' | 'noise' | 'entropy'

    // Interactive state for Testing Track (10 lessons)
    splitMode: 'overfit',      // 'overfit' | 'regularized'
    leakPurged: false,         // false | true
    cvModelChoice: 'X',        // 'X' | 'Y'
    bootResamples: null,       // array of counts or computed summary
    bootCountRuns: 0,
    permResults: null,         // permutation p-value result
    permRuns: 0,
    thresholdTau: 0.50,        // 0.10 .. 0.90
    imbalanceModel: 'dummy',   // 'dummy' | 'xgboost'
    calibMode: 'uncal',        // 'uncal' | 'cal'
    bvFitIdx: 1,               // 0 (Too Simple), 1 (Just Right), 2 (Too Flexible)
    honestChecks: { c1: false, c2: false, c3: false, c4: false, c5: false },

    // Interactive state for Step-Through Visual Builders (keyed by contextId)
    vbState: {}
  };

  function getVbState(contextId, builderKey) {
    if (!state.vbState[contextId]) {
      state.vbState[contextId] = {
        builderKey: builderKey || 'decision_tree',
        stepIdx: 0,
        playing: false,
        slowMode: false,
        highlightRow: -1,
        predictAnswer: null,
        svmC: 1.0,
        sigZ: 0.0,
        timerId: null
      };
    } else if (builderKey && state.vbState[contextId].builderKey !== builderKey) {
      if (state.vbState[contextId].timerId) {
        clearInterval(state.vbState[contextId].timerId);
      }
      state.vbState[contextId] = {
        builderKey: builderKey,
        stepIdx: 0,
        playing: false,
        slowMode: false,
        highlightRow: -1,
        predictAnswer: null,
        svmC: 1.0,
        sigZ: 0.0,
        timerId: null
      };
    }
    return state.vbState[contextId];
  }

  // ============================================================================
  // PART 1A: STATISTICS FOR ML TRACK (6 LESSONS ON RUNNING DATASET)
  // ============================================================================
  const STATS_META = [
    { id: 'mean_var_sd', title: '1. Mean, Variance & Std Dev', short: 'Spread (μ, σ², σ)' },
    { id: 'distributions', title: '2. Distributions & Skew', short: 'Histogram & log(x)' },
    { id: 'probability_basics', title: '3. Conditional Prob P(A|B)', short: 'Probability Rules' },
    { id: 'bayes_theorem', title: '4. Bayes’ Theorem + Base Rate', short: 'False Alarm Math' },
    { id: 'sampling_randomness', title: '5. Sampling & Random Splits', short: 'Why Splits Jump' },
    { id: 'corr_vs_causation', title: '6. Correlation vs. Causation', short: 'Collinearity Trap' }
  ];

  function renderStatLessonBody(statId) {
    if (statId === 'mean_var_sd') {
      const lengths = state.statSpreadMode === 'outlier' ? [22, 20, 21, 18, 99] : [22, 20, 21, 18, 30];
      const n = lengths.length;
      const mean = lengths.reduce((a, b) => a + b, 0) / n;
      const diffs = lengths.map(v => v - mean);
      const sqs = diffs.map(d => d * d);
      const variance = sqs.reduce((a, b) => a + b, 0) / n;
      const sd = Math.sqrt(variance);

      const rowsHtml = RUNNING_URLS.map((r, i) => {
        const len = lengths[i];
        const d = diffs[i];
        const sq = sqs[i];
        return '<tr class="border-t border-[var(--border)]">' +
          '<td class="p-2 font-mono font-bold text-sky-300">' + r.id + '</td>' +
          '<td class="p-2 font-mono text-[11px] truncate max-w-[170px]">' + esc(r.url) + (i === 4 && state.statSpreadMode === 'outlier' ? ' (LONG!)' : '') + '</td>' +
          '<td class="p-2 font-mono font-bold text-[var(--foreground)]">' + len + ' chars</td>' +
          '<td class="p-2 font-mono ' + (d >= 0 ? 'text-amber-300' : 'text-emerald-300') + '">' + (d >= 0 ? '+' : '') + d.toFixed(1) + '</td>' +
          '<td class="p-2 font-mono text-rose-300">' + sq.toFixed(1) + '</td>' +
        '</tr>';
      }).join('');

      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Why ML Needs Mean (μ) &amp; Typical Spread:</strong> Feature scaling (`(x − μ)/σ`) stops large-scale columns (URL Length 20..200) from drowning small columns (Dots 1..4), and explains why averaging 300 trees shrinks variance by `1/√B`!</div>' +
            '<div class="flex gap-1.5">' +
              '<button type="button" onclick="window.StatsAndVisuals.setStatSpread(\'running\')" class="px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ' + (state.statSpreadMode === 'running' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]') + '">Normal 5 Links (σ = 4.1)</button>' +
              '<button type="button" onclick="window.StatsAndVisuals.setStatSpread(\'outlier\')" class="px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ' + (state.statSpreadMode === 'outlier' ? 'bg-rose-500 text-white border-rose-400' : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]') + '">Add 1 Long URL L5=99 (σ Spikes!)</button>' +
            '</div>' +
          '</div>' +
          '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--content)]">' +
            '<div class="px-3 py-2 text-xs font-bold text-amber-300 bg-slate-900/60 border-b border-[var(--border)]">✍️ Step 1 — Hand-Worked 5-URL Spread Table BEFORE Any Formula</div>' +
            '<table class="w-full text-left text-xs border-collapse">' +
              '<thead class="text-[var(--muted-foreground)] uppercase bg-slate-900/40">' +
                '<tr><th class="p-2">ID</th><th class="p-2">Running URL</th><th class="p-2">Length (x)</th><th class="p-2">Gap from Mean (x − μ)</th><th class="p-2">Squared Gap (x − μ)²</th></tr>' +
              '</thead>' +
              '<tbody>' + rowsHtml + '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="text-sky-400 font-bold font-sans">Step 2 • Mean (Center) μ = ∑x / 5</div><div class="text-base font-extrabold mt-1">μ = ' + mean.toFixed(1) + ' chars</div></div>' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="text-rose-400 font-bold font-sans">Step 3 • Variance σ² = ∑(x−μ)² / 5</div><div class="text-base font-extrabold mt-1">σ² = ' + variance.toFixed(1) + ' chars²</div></div>' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="text-emerald-400 font-bold font-sans">Step 4 • Std Dev σ = √σ²</div><div class="text-base font-extrabold mt-1">σ = ±' + sd.toFixed(2) + ' chars</div></div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“Two models both average 94% accuracy, or two datasets both have Mean = 22 chars, so they behave identically.”</em><br>' +
            'Wrong! Notice adding ONE 99-char spam URL barely budges the median, yet blows Std Dev σ up from <strong>4.1</strong> to <strong>31.5</strong>! Spread determines stability.' +
          '</div>' +
        '</div>'
      );
    }

    if (statId === 'distributions') {
      const bins = state.distTransformed
        ? [
            { label: '2.9–3.2 (log 18–24)', cnt: 4, col: 'bg-emerald-500', note: 'L1, L2, L3, L4 (Symmetric!)' },
            { label: '3.2–3.5 (log 25–33)', cnt: 3, col: 'bg-emerald-400', note: 'L5, L6, L8' },
            { label: '3.5–3.8 (log 34–44)', cnt: 1, col: 'bg-sky-400', note: 'Medium' },
            { label: '3.8–4.1 (log 45–60)', cnt: 1, col: 'bg-amber-400', note: 'Mild tail' },
            { label: '4.1–4.7 (log 61–110)', cnt: 1, col: 'bg-rose-400', note: 'Outlier tamed!' }
          ]
        : [
            { label: '15–30 chars', cnt: 6, col: 'bg-emerald-500', note: 'Most URLs cluster here (L1–L5!)' },
            { label: '31–45 chars', cnt: 1, col: 'bg-sky-400', note: 'Tracking params' },
            { label: '46–60 chars', cnt: 1, col: 'bg-amber-400', note: 'Multi-folder' },
            { label: '61–90 chars', cnt: 1, col: 'bg-orange-500', note: 'Long query string' },
            { label: '91–150+ chars (Right Tail)', cnt: 1, col: 'bg-rose-500', note: 'Skewed phishing redirect!' }
          ];

      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-sky-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Why ML Needs Distributions:</strong> Real URL lengths are strongly <strong>right-skewed</strong> (most URLs are 18–30 chars, with a long tail of 120-char redirects). Models that assume bell-shaped Gaussian data (Best-Fit Line, Logistic, Gaussian Naive Bayes) perform much better after a <code>log(1 + x)</code> transform!</div>' +
            '<button type="button" onclick="window.StatsAndVisuals.toggleDistTransform()" class="px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ' + (state.distTransformed ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950') + '">' +
              (state.distTransformed ? '↩ Reset to Raw Char Counts' : '✨ Apply log(1 + x) Transform Live') +
            '</button>' +
          '</div>' +
          '<div class="p-4 rounded-xl bg-[var(--content)] border border-[var(--border)] space-y-2.5">' +
            '<div class="text-xs font-bold text-sky-300">Live 10-URL Frequency Histogram (' + (state.distTransformed ? 'After log(1 + x): Compact & Bell-Like!' : 'Raw URL Length: Heavy Right Tail!') + ')</div>' +
            bins.map(b => (
              '<div class="space-y-1">' +
                '<div class="flex justify-between text-xs font-mono"><span>' + b.label + '</span><span class="text-[var(--muted-foreground)]">' + b.cnt + '/10 URLs • ' + b.note + '</span></div>' +
                '<div class="w-full h-3.5 rounded-full bg-slate-800 overflow-hidden"><div class="h-full ' + b.col + ' transition-all duration-300" style="width:' + (b.cnt * 15) + '%"></div></div>' +
              '</div>'
            )).join('') +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“Every feature follows a symmetric bell curve, so Mean = Median and 95% of URLs sit inside ±2σ.”</em><br>' +
            'False! In right-skewed URL lengths, the Mean gets pulled far right by outliers, and applying z-score scaling directly without <code>log1p</code> squishes normal URLs together.' +
          '</div>' +
        '</div>'
      );
    }

    if (statId === 'probability_basics') {
      const f = state.probClueFilter;
      const shown = RUNNING_URLS.filter(r => f === 'all' ? true : f === 'spoof' ? r.brandSpoof === 1 : r.brandSpoof === 0);
      const phishCnt = shown.filter(r => r.y === 1).length;
      const condProb = shown.length ? (phishCnt / shown.length) : 0;

      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-amber-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Probability vs. Conditional Probability P(Phish | Clue):</strong> Don’t confuse unconditional probability <code>P(Phish) = 3/5 = 60%</code> with conditional probability <em>given we narrow our magnifying glass to rows where Clue = 1</em>!</div>' +
            '<div class="flex gap-1.5">' +
              '<button type="button" onclick="window.StatsAndVisuals.setProbFilter(\'all\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (f === 'all' ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-[var(--card)] border-[var(--border)]') + '">All 5 Links: P(Phish)=60%</button>' +
              '<button type="button" onclick="window.StatsAndVisuals.setProbFilter(\'spoof\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (f === 'spoof' ? 'bg-rose-500 text-white border-rose-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Given Spoof=1: P(Phish|Spoof=1)</button>' +
              '<button type="button" onclick="window.StatsAndVisuals.setProbFilter(\'clean\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (f === 'clean' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Given Spoof=0: P(Phish|Spoof=0)</button>' +
            '</div>' +
          '</div>' +
          '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--content)]">' +
            '<table class="w-full text-left text-xs border-collapse">' +
              '<thead class="bg-slate-900/50 text-[var(--muted-foreground)] uppercase"><tr><th class="p-2">ID</th><th class="p-2">URL</th><th class="p-2">BrandSpoof</th><th class="p-2">True Label y</th></tr></thead>' +
              '<tbody>' +
                shown.map(r => (
                  '<tr class="border-t border-[var(--border)]"><td class="p-2 font-mono font-bold text-sky-300">' + r.id + '</td><td class="p-2 font-mono">' + esc(r.url) + '</td><td class="p-2 font-mono">' + r.brandSpoof + '</td><td class="p-2 font-bold ' + (r.y === 1 ? 'text-rose-400' : 'text-emerald-400') + '">' + (r.y === 1 ? '1 (PHISH)' : '0 (SAFE)') + '</td></tr>'
                )).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-emerald-500/40 font-mono text-xs sm:text-sm">' +
            'Selected Universe = <strong>' + shown.length + ' links</strong> | Phishing Count = <strong>' + phishCnt + '</strong> ➔ ' +
            '<span class="text-amber-300 font-extrabold">Probability = ' + phishCnt + ' / ' + shown.length + ' = ' + (condProb * 100).toFixed(1) + '%</span>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“P(Spoof | Phish) = 100% is the exact same number as P(Phish | Spoof).”</em><br>' +
            'Never swap conditional directions! Almost every phishing email uses “verify”, yet most emails containing “verify” are harmless bank receipts.' +
          '</div>' +
        '</div>'
      );
    }

    if (statId === 'bayes_theorem') {
      const priorPhish = state.bayesBaseRate / 100.0; // e.g., 0.01 (1%)
      const totalTraffic = 10000;
      const nPhish = Math.round(totalTraffic * priorPhish);
      const nSafe = totalTraffic - nPhish;
      // IP address / Suspicious clue rate: 80% of phishing have clue; 5% of safe have clue (e.g. intranet router / dev IP)
      const tp = Math.round(nPhish * 0.80);
      const fp = Math.round(nSafe * 0.05);
      const totalAlerts = tp + fp;
      const posterior = totalAlerts > 0 ? (tp / totalAlerts) * 100 : 0;

      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-rose-500/40 space-y-2">' +
            '<div class="text-xs sm:text-sm font-bold">“Given a URL has an IP address (`192.168.x.x`), how likely is phishing?” — Watch the Base Rate Change Everything!</div>' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<span class="text-xs font-bold text-amber-300">Choose Real-World Phishing Base Rate out of 10,000 Links:</span>' +
              [0.1, 1.0, 5.0, 20.0].map(rate => (
                '<button type="button" onclick="window.StatsAndVisuals.setBayesBase(' + rate + ')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (state.bayesBaseRate === rate ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-[var(--card)] border-[var(--border)]') + '">' + rate + '% Phish</button>'
              )).join('') +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">' +
            '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-[var(--border)] space-y-1">' +
              '<div class="font-sans font-bold text-rose-400">1. Real Phish Alarms (True Positives)</div>' +
              '<div>Out of <strong>' + nPhish + '</strong> real phish links:</div>' +
              '<div>80% trigger IP rule = <strong class="text-emerald-300 text-sm">' + tp + ' TP</strong></div>' +
            '</div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-[var(--border)] space-y-1">' +
              '<div class="font-sans font-bold text-amber-400">2. Safe Link False Alarms (5% Rate)</div>' +
              '<div>Out of <strong>' + nSafe + '</strong> safe links:</div>' +
              '<div>5% have router/test IP = <strong class="text-rose-300 text-sm">' + fp + ' FP</strong></div>' +
            '</div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-sky-500/40 space-y-1">' +
              '<div class="font-sans font-bold text-sky-400">3. Bayes Answer: P(Phish | Has_IP)</div>' +
              '<div>' + tp + ' / (' + tp + ' + ' + fp + ') =</div>' +
              '<div class="text-base font-extrabold text-amber-300">' + posterior.toFixed(1) + '% Truly Phish!</div>' +
            '</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> (Base-Rate Fallacy) <em>“A detector catches 80% of phishing and only false-alarms 5% of the time, so any flagged URL has a 95% chance of being phishing.”</em><br>' +
            'At a 1% real-world phishing base rate, 9,900 safe links generate <strong>' + (Math.round(9900 * 0.05)) + ' False Alarms</strong> vs only <strong>' + (Math.round(100 * 0.80)) + ' Real Catches</strong> — meaning <strong>86% of alerts are false alarms</strong>! That is why Naive Bayes &amp; XGBoost multiply multiple independent clues.' +
          '</div>' +
        '</div>'
      );
    }

    if (statId === 'sampling_randomness') {
      // Deterministic splits on EXTENDED_URLS (8 URLs: 4 Phish, 4 Safe) holding 3 out for Test
      const splits = {
        1: { testIds: ['L1', 'L2', 'L7'], acc: '100.0% (3/3)', note: 'L1, L2, L7 are clear-cut cases → looks unrealistically perfect!' },
        2: { testIds: ['L3', 'L4', 'L5'], acc: '66.7% (2/3)', note: 'Hard borderline L5 (p=0.46) landed in Test → accuracy crashes 33 points!' },
        3: { testIds: ['L1', 'L5', 'L8'], acc: '66.7% (2/3)', note: 'Same model, different random seed!' },
        4: { testIds: ['L2', 'L3', 'L6'], acc: '100.0% (3/3)', note: 'No weights changed — only `random_state` changed!' },
        5: { testIds: ['L4', 'L6', 'L7'], acc: '100.0% (3/3)', note: 'Bootstrapping draws WITH replacement so L7 can appear 2× in Sample #1.' }
      };
      const cur = splits[state.splitSeed] || splits[1];

      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-sky-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Why Different Random Seeds Give Different Scores:</strong> Notice the model itself NEVER changed — only WHICH 3 links randomly landed in the Test bucket changed! That is why K-Fold CV + Bootstrap Intervals are mandatory.</div>' +
            '<div class="flex gap-1.5">' +
              [1, 2, 3, 4, 5].map(s => (
                '<button type="button" onclick="window.StatsAndVisuals.setSplitSeed(' + s + ')" class="px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ' + (state.splitSeed === s ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)]') + '">🎲 Seed #' + s + '</button>'
              )).join('') +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-4 sm:grid-cols-8 gap-2 text-xs font-mono">' +
            EXTENDED_URLS.map(r => {
              const inTest = cur.testIds.indexOf(r.id) >= 0;
              return '<div class="p-2 rounded-xl border text-center ' + (inTest ? 'bg-amber-500/20 border-amber-400 font-bold' : 'bg-[var(--content)] border-[var(--border)] opacity-75') + '">' +
                '<div>' + r.id + '</div>' +
                '<div class="text-[10px]">' + (inTest ? '🧪 TEST' : '📚 TRAIN') + '</div>' +
                '<div class="text-[10px] ' + (r.pA >= 0.5 === (r.y === 1) ? 'text-emerald-400' : 'text-rose-400') + '">' + (r.pA >= 0.5 === (r.y === 1) ? '✔ Right' : '✘ Miss') + '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-emerald-500/40 text-xs font-mono">' +
            'Seed #' + state.splitSeed + ' Holdout Score = <strong class="text-amber-300 text-sm">' + cur.acc + '</strong> — <span>' + esc(cur.note) + '</span>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“I changed `random_state` until test accuracy hit 100%, so I made my model better.”</em><br>' +
            'You didn’t improve the model — you just cherry-picked an easy random test split! Use Stratified K-Fold CV to average across every possible test fold.' +
          '</div>' +
        '</div>'
      );
    }

    // corr_vs_causation
    const pairInfo = state.corrFeaturePair === 'path'
      ? { title: 'Redundant Collinearity: Total Length (x₁) vs Path+Domain Length (x₂)', r: '+0.97', status: '⚠️ MULTICOLLINEARITY: x₁ and x₂ tell the same story! Adding both gives linear weights unstable SEs without adding new phishing signal.' }
      : state.corrFeaturePair === 'entropy'
        ? { title: 'True Independent Signal: URL Entropy (x₂) vs Label (y)', r: '+0.89', status: '✅ HELPFUL FEATURE: High character randomness tracks typo-squatted & DGA phishing links even when total length is short!' }
        : { title: 'Confounder Trap: Ice Cream Sales / HTTPS Padlock vs Phishing', r: '+0.78', status: '🪤 SPURIOUS CONFOUNDER: 84% of modern phishing sites now use free Let’s Encrypt HTTPS! Correlation ≠ Safety or Causation.' };

    return (
      '<div class="space-y-4">' +
        '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-sky-500/30 flex flex-wrap items-center justify-between gap-2">' +
          '<div class="text-xs sm:text-sm"><strong>Correlation ≠ Usefulness or Causation:</strong> Two clues with <code>r = +0.97</code> might be identical twins (multicollinearity), or both driven by a third variable!</div>' +
          '<div class="flex gap-1.5">' +
            '<button type="button" onclick="window.StatsAndVisuals.setCorrPair(\'path\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (state.corrFeaturePair === 'path' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Length vs Path (r=+0.97)</button>' +
            '<button type="button" onclick="window.StatsAndVisuals.setCorrPair(\'entropy\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (state.corrFeaturePair === 'entropy' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Entropy vs Phish (r=+0.89)</button>' +
            '<button type="button" onclick="window.StatsAndVisuals.setCorrPair(\'noise\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (state.corrFeaturePair === 'noise' ? 'bg-rose-500 text-white border-rose-400' : 'bg-[var(--card)] border-[var(--border)]') + '">HTTPS Padlock Trap</button>' +
          '</div>' +
        '</div>' +
        '<div class="p-4 rounded-xl bg-[var(--content)] border border-[var(--border)] space-y-2">' +
          '<div class="flex items-center justify-between"><span class="font-bold text-sm">' + esc(pairInfo.title) + '</span><span class="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-xs">Move-Together Strength = ' + pairInfo.r + '</span></div>' +
          '<p class="text-xs sm:text-sm text-[var(--foreground)]">' + esc(pairInfo.status) + '</p>' +
        '</div>' +
        '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
          '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“I added a column with r = 0.96 to another feature, so my model now has twice as much information.”</em><br>' +
          'Adding duplicate correlated features adds ZERO new information while breaking Matrix Inversion <code>(XᵀX)⁻¹</code> and splitting SHAP/weight credit in half!' +
        '</div>' +
      '</div>'
    );
  }

  // ============================================================================
  // PART 1B: HOW TO TEST A MODEL PROPERLY TRACK (10 LESSONS)
  // ============================================================================
  const TESTING_META = [
    { id: 'train_val_test', title: '1. Train / Val / Test Split' },
    { id: 'data_leakage', title: '2. Data Leakage Detective' },
    { id: 'cross_validation', title: '3. 5-Fold CV (Mean ± Typical Spread)' },
    { id: 'bootstrap_ci', title: '4. 1,000× Bootstrap CI' },
    { id: 'model_comparison', title: '5. A vs B Permutation Luck Chance' },
    { id: 'threshold_slider', title: '6. Threshold Slider & Cost' },
    { id: 'imbalance_metrics', title: '7. 99% Accuracy Trap' },
    { id: 'calibration', title: '8. Calibration Reliability' },
    { id: 'bias_variance', title: '9. 3-Fit Bias-Variance' },
    { id: 'honest_reporting', title: '10. Honest Results Checklist' }
  ];

  function renderTestingLessonBody(testId) {
    if (testId === 'train_val_test') {
      const ov = state.splitMode === 'overfit';
      return (
        '<div class="space-y-4">' +
          '<div class="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-[var(--content)] border border-[var(--border)]">' +
            '<div class="text-xs sm:text-sm"><strong>3 Buckets Rule:</strong> <strong>Train (60–70%)</strong> tunes weights; <strong>Validation (15–20%)</strong> picks depth/threshold/C; <strong>Test (15–20%)</strong> is locked in a vault until the very end!</div>' +
            '<div class="flex gap-1.5">' +
              '<button type="button" onclick="window.StatsAndVisuals.setSplitMode(\'overfit\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (ov ? 'bg-rose-500 text-white border-rose-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Memorized Deep Tree (100% vs 70%)</button>' +
              '<button type="button" onclick="window.StatsAndVisuals.setSplitMode(\'regularized\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (!ov ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Pruned XGBoost (93% vs 92%)</button>' +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">' +
            '<div class="p-4 rounded-xl bg-[var(--content)] border ' + (ov ? 'border-rose-500/50' : 'border-emerald-500/50') + '">' +
              '<div class="font-sans font-bold text-sm">Training Set Accuracy (Seen Study Guide)</div>' +
              '<div class="text-2xl font-extrabold mt-1 ' + (ov ? 'text-amber-300' : 'text-emerald-300') + '">' + (ov ? '100.0%' : '93.2%') + '</div>' +
              '<div class="text-[11px] font-sans text-[var(--muted-foreground)] mt-1">' + (ov ? 'Tree grew 20 levels deep and memorized every training URL’s exact length!' : 'Depth capped at 6 + L2 regularization λ=1 learns real phishing patterns.') + '</div>' +
            '</div>' +
            '<div class="p-4 rounded-xl bg-[var(--content)] border ' + (ov ? 'border-rose-500/50' : 'border-emerald-500/50') + '">' +
              '<div class="font-sans font-bold text-sm">Unseen Holdout Test Accuracy (Real Final Exam)</div>' +
              '<div class="text-2xl font-extrabold mt-1 ' + (ov ? 'text-rose-400' : 'text-emerald-400') + '">' + (ov ? '70.0% ❌ OVERFIT GAP = 30%' : '92.4% ✅ GAP = 0.8%!') + '</div>' +
              '<div class="text-[11px] font-sans text-[var(--muted-foreground)] mt-1">' + (ov ? 'Fails badly on L5 and new phishing variations!' : 'Generalizes cleanly to brand-new zero-hour links.') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“My model got 100% accuracy during `.fit()`, so it’s ready for production!”</em><br>' +
            'Evaluating on your training set is like grading a student on the exact answer key they memorized last night.' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'data_leakage') {
      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-amber-500/40 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Spot the Leak!</strong> Look at Column 4 below: random phishing campaign URLs from the SAME domain (`paypa1-login.tk/a` and `paypa1-login.tk/b`) landed in both Train and Test, letting the model memorize the domain ID instead of learning phishing!</div>' +
            '<button type="button" onclick="window.StatsAndVisuals.toggleLeakPurge()" class="px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ' + (state.leakPurged ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white') + '">' +
              (state.leakPurged ? '✅ Leak Fixed! (Click to Re-Inject Leak)' : '🔍 Purge Same-Domain / Post-Label Leak') +
            '</button>' +
          '</div>' +
          '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--content)]">' +
            '<table class="w-full text-left text-xs border-collapse">' +
              '<thead class="bg-slate-900/50 text-[var(--muted-foreground)] uppercase">' +
                '<tr><th class="p-2">Test URL</th><th class="p-2">Real Feature: Entropy</th><th class="p-2">' + (state.leakPurged ? '✅ GroupKFold Split' : '🚨 LEAKED COLUMN: Apex_In_Train') + '</th><th class="p-2">Score</th></tr>' +
              '</thead>' +
              '<tbody>' +
                RUNNING_URLS.map(r => (
                  '<tr class="border-t border-[var(--border)]"><td class="p-2 font-mono">' + esc(r.url) + '</td><td class="p-2 font-mono">' + r.ent.toFixed(2) + '</td><td class="p-2 font-mono ' + (state.leakPurged ? 'text-emerald-300' : 'text-rose-400 font-bold') + '">' + (state.leakPurged ? 'Disjoint Apex Domain' : esc(r.leakedTag)) + '</td><td class="p-2 font-mono">' + (state.leakPurged ? (r.pA * 100).toFixed(0) + '%' : (r.y === 1 ? '99%' : '1%')) + '</td></tr>'
                )).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border ' + (state.leakPurged ? 'border-emerald-500/40' : 'border-rose-500/40') + ' font-mono text-xs sm:text-sm">' +
            (state.leakPurged
              ? '<span class="text-emerald-300 font-bold">✅ Honest GroupKFold Accuracy = 88.4%</span> — Every test link comes from a brand-new unseen apex domain!'
              : '<span class="text-rose-300 font-bold">🚨 Fake Leaked Accuracy = 99.2%</span> — The model simply memorized domain IDs that leaked between Train &amp; Test! In production tomorrow on a brand-new domain, accuracy plunges.') +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“99.2% test accuracy proves my model works — no need to check how Train and Test were split.”</em><br>' +
            'Whenever test accuracy looks miraculously high, suspect data leakage first (shared apex domain, duplicate URLs, or scaling `X_all` before splitting)!' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'cross_validation') {
      const m = state.cvModelChoice;
      const folds = m === 'X'
        ? [0.94, 0.95, 0.93, 0.94, 0.94]
        : [0.85, 0.99, 0.89, 0.99, 0.98];
      const mean = folds.reduce((a, b) => a + b, 0) / 5;
      const sd = Math.sqrt(folds.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / 5);

      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-sky-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>0.94 ± 0.01 vs 0.94 ± 0.06 are COMPLETELY different statements!</strong> Switch between Model X and Model Y to inspect all 5 Folds:</div>' +
            '<div class="flex gap-1.5">' +
              '<button type="button" onclick="window.StatsAndVisuals.setCvModel(\'X\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (m === 'X' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Model X: 0.94 ± 0.01 (Stable)</button>' +
              '<button type="button" onclick="window.StatsAndVisuals.setCvModel(\'Y\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (m === 'Y' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Model Y: 0.94 ± 0.06 (Erratic!)</button>' +
            '</div>' +
          '</div>' +
          '<div class="space-y-2">' +
            [0, 1, 2, 3, 4].map(fIdx => (
              '<div class="grid grid-cols-6 gap-1.5 items-center text-xs font-mono">' +
                [0, 1, 2, 3, 4].map(blk => (
                  '<div class="py-1.5 px-2 rounded text-center border ' + (blk === fIdx ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold' : 'bg-sky-500/15 border-sky-500/30 text-sky-200') + '">' +
                    (blk === fIdx ? '🧪 TEST' : '📚 TR') +
                  '</div>'
                )).join('') +
                '<div class="py-1.5 px-2 rounded bg-[var(--content)] border border-[var(--border)] font-bold text-right ' + (folds[fIdx] < 0.90 ? 'text-rose-400' : 'text-emerald-400') + '">Fold ' + (fIdx + 1) + ': ' + (folds[fIdx] * 100).toFixed(1) + '%</div>' +
              '</div>'
            )).join('') +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-emerald-500/40 font-mono text-xs sm:text-sm">' +
            '5-Fold Mean ± Std Dev = <strong class="text-sky-300 text-base">' + mean.toFixed(2) + ' ± ' + sd.toFixed(3) + '</strong> — ' +
            '<span class="font-sans">' + (m === 'X' ? 'Every fold stays between 93% and 95%. You can trust Model X on new traffic!' : 'Notice Model Y collapses to 85% on Fold 1! Its mean looks like 94%, yet one slice of users gets terrible defense.') + '</span>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“Reporting only a single mean score (94%) tells you everything about a model.”</em><br>' +
            'Always report <strong>Mean ± Typical Spread across folds</strong> so variance hides nowhere!' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'bootstrap_ci') {
      const hist = state.bootResamples || { low: 91.2, med: 94.1, high: 96.4, bins: [4, 18, 86, 234, 316, 224, 92, 22, 4] };
      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Confidence Interval With ZERO Scary Formulas:</strong> Resample your test set with replacement 1,000 times, measure accuracy on each resample, and simply read the <strong>middle 95%</strong> (25th to 975th sorted value)!</div>' +
            '<button type="button" onclick="window.StatsAndVisuals.runBootstrap1000()" class="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold cursor-pointer">▶ Resample Test Set 1,000 Times (Run #' + (state.bootCountRuns + 1) + ')</button>' +
          '</div>' +
          '<div class="p-4 rounded-xl bg-[var(--content)] border border-[var(--border)] space-y-2">' +
            '<div class="flex items-center justify-between text-xs font-mono"><span>Empirical 1,000-Bootstrap Distribution of Accuracy:</span><span class="text-emerald-300 font-bold">95% CI = [' + hist.low.toFixed(1) + '%, ' + hist.high.toFixed(1) + '%]</span></div>' +
            '<div class="grid grid-cols-9 gap-1.5 items-end h-28 pt-3">' +
              hist.bins.map((cnt, idx) => {
                const in95 = idx >= 1 && idx <= 7;
                const hPct = Math.max(8, Math.round((cnt / 330) * 100));
                const accLbl = (89 + idx * 1.25).toFixed(1) + '%';
                return '<div class="flex flex-col items-center justify-end h-full gap-1">' +
                  '<div class="w-full rounded-t ' + (in95 ? 'bg-emerald-500' : 'bg-rose-500/70') + '" style="height:' + hPct + '%" title="' + cnt + ' of 1,000 resamples"></div>' +
                  '<div class="text-[10px] font-mono text-[var(--muted-foreground)]">' + accLbl + '</div>' +
                '</div>';
              }).join('') +
            '</div>' +
            '<div class="text-xs text-[var(--muted-foreground)] pt-1">🟢 Green middle bars = Middle 95% of resamples ([' + hist.low.toFixed(1) + '%, ' + hist.high.toFixed(1) + '%]). 🔴 Outer 2.5% tails are excluded.</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“A 100-link test set score of 94.1% means true production accuracy is exactly 94.1%.”</em><br>' +
            'With 100 test links, resampling shows true accuracy lies anywhere in <strong>[91.2%, 96.4%]</strong>; only 1,000+ test links shrink that interval tight!' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'model_comparison') {
      const pRes = state.permResults || { obsDiff: 0.5, countAsBig: 342, pVal: 0.342 };
      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-sky-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Model A = 94.1% vs Model B = 94.6% (Gap = +0.5%). Is B genuinely better, or coin-flip luck?</strong> Compare paired 5-fold diffs, then run a Permutation Test (shuffle A/B labels 1,000 times)!</div>' +
            '<button type="button" onclick="window.StatsAndVisuals.runPermutation1000()" class="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold cursor-pointer">🔀 Shuffle Model A/B Labels 1,000× (Run #' + (state.permRuns + 1) + ')</button>' +
          '</div>' +
          '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--content)]">' +
            '<table class="w-full text-left text-xs font-mono border-collapse">' +
              '<thead class="bg-slate-900/50 text-[var(--muted-foreground)] uppercase"><tr><th class="p-2">Paired Fold</th><th class="p-2">Model A</th><th class="p-2">Model B</th><th class="p-2">Gap (B − A)</th></tr></thead>' +
              '<tbody>' +
                [
                  ['Fold 1', '93.0%', '94.2%', '+1.2%'],
                  ['Fold 2', '95.1%', '94.8%', '−0.3% (A won!)'],
                  ['Fold 3', '92.8%', '93.9%', '+1.1%'],
                  ['Fold 4', '95.4%', '94.6%', '−0.8% (A won!)'],
                  ['Fold 5', '94.2%', '95.5%', '+1.3%']
                ].map(row => '<tr class="border-t border-[var(--border)]"><td class="p-2">' + row[0] + '</td><td class="p-2">' + row[1] + '</td><td class="p-2">' + row[2] + '</td><td class="p-2 ' + (row[3].startsWith('+') ? 'text-emerald-300' : 'text-rose-300') + '">' + row[3] + '</td></tr>').join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-amber-500/40 text-xs sm:text-sm space-y-1">' +
            '<div class="font-mono font-bold text-amber-300">Permutation Test Result: ' + pRes.countAsBig + ' out of 1,000 pure-luck shuffles produced a ±0.5% gap ➔ Luck Chance = ' + pRes.pVal.toFixed(3) + '</div>' +
            '<p><strong>Plain-English Translation:</strong> If A and B had <em>zero true difference</em>, pure randomness still gives a 0.5% gap ~34% of the time! So 94.6% vs 94.1% here is NOT statistically significant (note also: Luck Chance says nothing about how big the business value of +0.5% is).</p>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“Model B scored 94.6% and Model A scored 94.1%, so Model B is guaranteed better — AND p = 0.04 proves B is a huge breakthrough.”</em><br>' +
            'Both are false: small gaps often flip on another sample, and with huge data even a useless +0.01% gap gets <code>p &lt; 0.05</code> (check practical effect size + CI too!).' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'threshold_slider') {
      const tau = state.thresholdTau;
      let tp = 0, fp = 0, fn = 0, tn = 0;
      const rows = RUNNING_URLS.map(r => {
        const pred = r.pA >= tau ? 1 : 0;
        let outcome = '';
        if (r.y === 1 && pred === 1) { tp++; outcome = 'TP (Caught Phish)'; }
        else if (r.y === 0 && pred === 1) { fp++; outcome = 'FP (False Alarm)'; }
        else if (r.y === 1 && pred === 0) { fn++; outcome = 'FN (MISSED PHISH!)'; }
        else { tn++; outcome = 'TN (Clean Safe)'; }
        return { ...r, pred, outcome };
      });
      const prec = (tp + fp) ? (tp / (tp + fp)) * 100 : 0;
      const rec = (tp + fn) ? (tp / (tp + fn)) * 100 : 0;
      const cost = fn * 500 + fp * 10;

      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-emerald-500/40 space-y-2">' +
            '<div class="flex flex-wrap items-center justify-between gap-2">' +
              '<span class="text-xs sm:text-sm font-bold">Drag Probability Cutoff τ (Default 0.50). Business Cost: Missed Phish = $500, False Alarm = $10!</span>' +
              '<span class="px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400 font-mono text-sm font-extrabold text-amber-300">Threshold τ = ' + tau.toFixed(2) + '</span>' +
            '</div>' +
            '<input type="range" min="0.10" max="0.90" step="0.02" value="' + tau + '" oninput="window.StatsAndVisuals.setThreshold(this.value)" class="w-full accent-amber-400 cursor-pointer">' +
          '</div>' +
          '<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">' +
            '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--content)]">' +
              '<table class="w-full text-left text-xs font-mono border-collapse">' +
                '<thead class="bg-slate-900/50 text-[var(--muted-foreground)] uppercase"><tr><th class="p-2">ID</th><th class="p-2">Model p</th><th class="p-2">p ≥ ' + tau.toFixed(2) + '?</th><th class="p-2">Outcome</th></tr></thead>' +
                '<tbody>' +
                  rows.map(r => (
                    '<tr class="border-t border-[var(--border)]"><td class="p-2">' + r.id + ' (y=' + r.y + ')</td><td class="p-2">' + r.pA.toFixed(2) + '</td><td class="p-2 font-bold">' + (r.pred ? 'BLOCK (1)' : 'ALLOW (0)') + '</td><td class="p-2 ' + (r.outcome.includes('MISSED') ? 'text-rose-400 font-bold' : r.outcome.includes('False') ? 'text-amber-300' : 'text-emerald-300') + '">' + r.outcome + '</td></tr>'
                  )).join('') +
                '</tbody>' +
              '</table>' +
            '</div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-[var(--border)] grid grid-cols-2 gap-2.5 text-xs font-mono">' +
              '<div class="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40"><div class="text-emerald-300 font-bold">TP = ' + tp + '</div><div>Phish Blocked</div></div>' +
              '<div class="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40"><div class="text-amber-300 font-bold">FP = ' + fp + '</div><div>Safe Blocked ($10 ea)</div></div>' +
              '<div class="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40"><div class="text-rose-300 font-bold">FN = ' + fn + '</div><div>Phish Missed ($500 ea)</div></div>' +
              '<div class="p-2.5 rounded-lg bg-sky-500/15 border border-sky-500/40"><div class="text-sky-300 font-bold">TN = ' + tn + '</div><div>Safe Allowed</div></div>' +
              '<div class="col-span-2 p-2.5 rounded-lg bg-slate-900/70 border border-[var(--border)] flex justify-between font-bold"><span>Precision: ' + prec.toFixed(0) + '% | Recall: ' + rec.toFixed(0) + '%</span><span class="text-rose-300">Total Cost = $' + cost + '</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“0.50 is always the best threshold.”</em><br>' +
            'Wrong! At τ = 0.50 here, <code>L5 (p=0.46)</code> slips through ($500 breach!). Lowering τ to <code>0.44</code> catches all 3 phish at $0 breach cost!' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'imbalance_metrics') {
      const isDummy = state.imbalanceModel === 'dummy';
      return (
        '<div class="space-y-4">' +
          '<div class="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-xl bg-[var(--content)] border border-rose-500/40">' +
            '<div class="text-xs sm:text-sm"><strong>1,000 Live Traffic Links: 990 Safe (99%) + 10 Phishing (1%).</strong> Compare a dumb <code>return SAFE</code> function against LureLock XGBoost:</div>' +
            '<div class="flex gap-1.5">' +
              '<button type="button" onclick="window.StatsAndVisuals.setImbalanceModel(\'dummy\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (isDummy ? 'bg-rose-500 text-white border-rose-400' : 'bg-[var(--card)] border-[var(--border)]') + '">🤡 Dummy "Always Safe" (99.0% Acc!)</button>' +
              '<button type="button" onclick="window.StatsAndVisuals.setImbalanceModel(\'xgboost\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (!isDummy ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)]') + '">🛡️ LureLock XGBoost (Catches Phish)</button>' +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="text-[var(--muted-foreground)] font-sans">Misleading Accuracy</div><div class="text-lg font-extrabold text-sky-300">' + (isDummy ? '99.0%' : '99.7%') + '</div></div>' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="text-[var(--muted-foreground)] font-sans">Recall (Caught/10)</div><div class="text-lg font-extrabold ' + (isDummy ? 'text-rose-400' : 'text-emerald-400') + '">' + (isDummy ? '0.0% (0/10!)' : '90.0% (9/10)') + '</div></div>' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="text-[var(--muted-foreground)] font-sans">Precision (True Alarms)</div><div class="text-lg font-extrabold ' + (isDummy ? 'text-rose-400' : 'text-emerald-400') + '">' + (isDummy ? '0.0% (0/0)' : '81.8% (9/11)') + '</div></div>' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="text-[var(--muted-foreground)] font-sans">PR-AUC (Best Under Imbalance)</div><div class="text-lg font-extrabold ' + (isDummy ? 'text-rose-400' : 'text-emerald-400') + '">' + (isDummy ? '0.01 (Useless)' : '0.91 (Strong)') + '</div></div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“99% accuracy means my phishing detector is almost perfect!”</em><br>' +
            'When 99% of data is Safe, predicting "Always Safe" scores 99% accuracy while letting 100% of hackers walk straight through! Always report Recall, Precision, F1, and PR-AUC.' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'calibration') {
      const cal = state.calibMode === 'cal';
      const rows = [
        { bucket: 'Predicted ~10% (Safe-ish)', actual: cal ? '11% Phish (11/100)' : '24% Phish (Over-low!)', gap: cal ? '+1%' : '+14% Off!' },
        { bucket: 'Predicted ~50% (Uncertain)', actual: cal ? '49% Phish (49/100)' : '50% Phish', gap: cal ? '−1%' : '0%' },
        { bucket: 'Predicted ~90% (High Risk)', actual: cal ? '89% Phish (89/100)' : '63% Phish (Overconfident!)', gap: cal ? '−1%' : '−27% Off!' }
      ];
      return (
        '<div class="space-y-4">' +
          '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-sky-500/30 flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm"><strong>Does "90% Phishing" ACTUALLY Mean 9 in 10 Are Phishing?</strong> Naive Bayes &amp; uncalibrated Random Forests often push probabilities toward 0% or 99% (bad Chance Mistake Score). Check the Reliability Buckets:</div>' +
            '<div class="flex gap-1.5">' +
              '<button type="button" onclick="window.StatsAndVisuals.setCalibMode(\'uncal\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (!cal ? 'bg-rose-500 text-white border-rose-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Uncalibrated SVM/NB (Brier = 0.14)</button>' +
              '<button type="button" onclick="window.StatsAndVisuals.setCalibMode(\'cal\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (cal ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] border-[var(--border)]') + '">Platt / Isotonic Calibrated (Brier = 0.04)</button>' +
            '</div>' +
          '</div>' +
          '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--content)]">' +
            '<table class="w-full text-left text-xs font-mono border-collapse">' +
              '<thead class="bg-slate-900/50 text-[var(--muted-foreground)] uppercase"><tr><th class="p-2">Model Confidence Bucket</th><th class="p-2">Actual True Phishing Rate in That Bucket</th><th class="p-2">Calibration Error</th></tr></thead>' +
              '<tbody>' +
                rows.map(r => '<tr class="border-t border-[var(--border)]"><td class="p-2">' + r.bucket + '</td><td class="p-2 font-bold">' + r.actual + '</td><td class="p-2 ' + (cal ? 'text-emerald-300' : 'text-rose-400') + '">' + r.gap + '</td></tr>').join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“Any model’s `.predict_proba()` output is automatically an exact real-world probability.”</em><br>' +
            'If you automate blocking at <code>p ≥ 0.90</code> or compute expected financial risk, always check the reliability curve and apply `CalibratedClassifierCV` if off!' +
          '</div>' +
        '</div>'
      );
    }

    if (testId === 'bias_variance') {
      const fits = [
        { name: 'Fit 1: Too Simple (Depth 1 Stump / Linear Bias)', trainErr: '28%', testErr: '29%', diag: 'UNDERFITTING (High Bias): Both Train AND Test error are high — the model misses multi-clue phishing rules completely!' },
        { name: 'Fit 2: Just Right (Depth 6 Tuned XGBoost)', trainErr: '6%', testErr: '7%', diag: 'SWEET SPOT: Low error on both Train AND unseen Test! Generalizes reliably.' },
        { name: 'Fit 3: Too Flexible (Depth 25 Memorized Tree)', trainErr: '0%', testErr: '24%', diag: 'OVERFITTING (High Variance): 0% error on Train, massive 24% crash on Test because it memorized sample noise!' }
      ];
      const cur = fits[state.bvFitIdx] || fits[1];
      return (
        '<div class="space-y-4">' +
          '<div class="flex flex-wrap gap-2">' +
            fits.map((f, i) => (
              '<button type="button" onclick="window.StatsAndVisuals.setBvFit(' + i + ')" class="px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ' + (state.bvFitIdx === i ? 'bg-amber-500 text-slate-950 border-amber-400 shadow' : 'bg-[var(--content)] border-[var(--border)]') + '">' + f.name + '</button>'
            )).join('') +
          '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">' +
            '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="font-sans text-[var(--muted-foreground)]">Train Error</div><div class="text-2xl font-extrabold text-sky-300 mt-1">' + cur.trainErr + '</div></div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-[var(--border)]"><div class="font-sans text-[var(--muted-foreground)]">Unseen Test Error</div><div class="text-2xl font-extrabold ' + (state.bvFitIdx === 1 ? 'text-emerald-400' : 'text-rose-400') + ' mt-1">' + cur.testErr + '</div></div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-[var(--border)] font-sans text-xs flex items-center">' + esc(cur.diag) + '</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
            '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“Adding more features and deeper trees always improves Test Accuracy.”</em><br>' +
            'Past Fit 2, extra flexibility keeps driving Train Error to 0% while driving Test Error UP!' +
          '</div>' +
        '</div>'
      );
    }

    // honest_reporting
    const checks = [
      { k: 'c1', label: '1. Compared against a dumb baseline (majority class / single-feature linear baseline)' },
      { k: 'c2', label: '2. Fixed random seed & Stratified/Group K-Fold documented so splits never leak or change stealthily' },
      { k: 'c3', label: '3. Reported Mean ± Typical Spread or 95% Bootstrap Confidence Interval — never a single lucky decimal' },
      { k: 'c4', label: '4. Included Precision, Recall, PR-AUC & Calibration (not just Accuracy under imbalance)' },
      { k: 'c5', label: '5. Holdout Final Test Set touched ONCE after locking hyperparameters and threshold τ' }
    ];
    const doneCnt = checks.filter(c => state.honestChecks[c.k]).length;
    return (
      '<div class="space-y-3">' +
        '<div class="p-3.5 rounded-xl bg-[var(--content)] border border-emerald-500/40 flex items-center justify-between">' +
          '<span class="text-xs sm:text-sm font-bold">5-Point Scientific Audit Checklist Before Trusting Any ML Claim:</span>' +
          '<span class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-extrabold">' + doneCnt + ' / 5 Audited</span>' +
        '</div>' +
        '<div class="space-y-2">' +
          checks.map(c => (
            '<label class="p-3 rounded-xl bg-[var(--content)] border ' + (state.honestChecks[c.k] ? 'border-emerald-400' : 'border-[var(--border)]') + ' flex items-center gap-3 text-xs sm:text-sm cursor-pointer">' +
              '<input type="checkbox" ' + (state.honestChecks[c.k] ? 'checked' : '') + ' onchange="window.StatsAndVisuals.toggleHonestCheck(\'' + c.k + '\')" class="accent-emerald-400 w-4 h-4">' +
              '<span>' + esc(c.label) + '</span>' +
            '</label>'
          )).join('') +
        '</div>' +
        '<div class="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs">' +
          '<strong class="text-rose-300">🪤 Common Wrong Conclusion:</strong> <em>“A blog post / student repo says 99.4% accuracy, so it works out of the box.”</em><br>' +
          'Without knowing baseline rate, leak checks, seed, CI, and holdout discipline, a headline accuracy number cannot be trusted.' +
        '</div>' +
      '</div>'
    );
  }

  // ============================================================================
  // PART 2A-2E: ALL 10 STEP-THROUGH VISUAL CONSTRUCTION BUILDERS
  // ============================================================================
  const BUILDERS = {
    decision_tree: {
      title: '1. Decision Tree Construction (Scatter Box + Growing Tree Synchronized)',
      subtitle: 'Watch all 8 URLs start in 1 mixed root box, score candidate splits via Gini, and draw the scatter split + tree node simultaneously.',
      predictQ: 'If you must split all 8 URLs (4 Phish, 4 Safe) using ONE yes/no question first, which feature drops Mix-Up Score the most?',
      predictOpts: [
        'Splitting randomly in the middle of URL Length (> 22)',
        'Splitting on Brand Spoof == 1 (separates nearly all Phish cleanly!)',
        'Do not split at all — keep Root Gini = 0.50'
      ],
      predictAns: 1,
      readingGuide: {
        axes: 'Left: Scatter X = URL Entropy (2.4–4.5 bits), Y = Brand Spoof (0 or 1). Right: Live Tree Flowchart.',
        shape: 'Clean colored boxes (pure green = Safe leaf, pure red = Phish leaf) mean Gini dropped to 0.00.',
        change: 'Adding deeper splits carves smaller sub-boxes — useful up to Depth 4–6, noisy if 1 row per leaf!'
      },
      tableCols: ['URL ID', 'Entropy x', 'Spoof y_feat', 'Current Node Assignment'],
      steps: [
        {
          label: 'Step 1: Root Box (All 8 URLs Mixed, Gini = 0.500)',
          eqTemplate: 'Root Gini = 1 − (4/8)² − (4/8)² = 0.500 | Highlighted {ID}: Entropy={X}, Spoof={Y}',
          desc: 'All 8 links sit in one unsorted root box (4 Rose Phish, 4 Green Safe). Impurity is 50/50 maximum (0.500).'
        },
        {
          label: 'Step 2: Try Weak Candidate Split (URL Length ≥ 23) → Gini = 0.45',
          eqTemplate: 'Candidate Length ≥ 23 leaves L1(22), L3(21) on Safe side! Weighted Gini = 0.450 (Too High)',
          desc: 'We test splitting by URL Length ≥ 23. Both L1 and L3 are short phishing URLs (21–22 chars), so both boxes stay mixed (Rejected!).'
        },
        {
          label: 'Step 3: Winner Split #1! (Brand Spoof == 1) → Gini Drops to 0.00!',
          eqTemplate: 'WINNER Gain = 0.500 − 0.000 = +0.500! Split draws sky-blue line AND adds Left/Right tree leaves at once!',
          desc: 'Splitting on Brand Spoof == 1 isolates all 4 Phishing URLs on top/right and all 4 Safe URLs on bottom/left — both boxes become 100% pure!'
        },
        {
          label: 'Step 4: Second Split on Hard Borderline (Entropy > 3.70)',
          eqTemplate: 'When unseen URL lacks Spoof flag, Depth 2 adds vertical split Entropy > 3.70 catching L5 (4.35 bits)!',
          desc: 'Adding a vertical Entropy split carves out high-randomness `/8f3k9q` links even when attackers hide brand names.'
        }
      ]
    },
    random_forest: {
      title: '2. Random Forest: 3 Bootstrap Trees + Majority Vote',
      subtitle: 'Built step by step: Bootstrap Sample #1, #2, #3 train 3 diverse trees, then all 3 vote on tricky borderline L5.',
      predictQ: 'Why does Random Forest build each tree on a slightly different resampled dataset + random subset of features?',
      predictOpts: [
        'To make every tree identical so they agree 100%',
        'So individual tree mistakes cancel out when we average their votes (crushes variance!)',
        'Because Python cannot read all columns at once'
      ],
      predictAns: 1,
      readingGuide: {
        axes: '3 Parallel Subtrees trained on Bootstrap resamples + Right Vote Bar for URL L5.',
        shape: 'Independent trees make different small boundary quirks; majority vote stabilizes to the true region.',
        change: 'Increasing `n_estimators` from 3 to 300 smooths the vote variance monotonically without overfitting.'
      },
      tableCols: ['Model', 'Bootstrap Resample Focus', 'Threshold Used', 'Vote on L5 (Ent=4.35, Len=30)'],
      steps: [
        {
          label: 'Step 1: Draw Tree #1 on Bootstrap Sample A (Votes PHISH)',
          eqTemplate: 'Tree #1 drew [L1,L1,L2,L4,L5] & split on Entropy > 3.7 → Predicts p₁ = 1 (PHISH)',
          desc: 'Because L1 was drawn twice and Entropy was sampled in the feature subset, Tree #1 catches L5 as PHISH.'
        },
        {
          label: 'Step 2: Draw Tree #2 on Bootstrap Sample B (Votes SAFE — Noisy Mistake)',
          eqTemplate: 'Tree #2 drew [L2,L3,L4,L4,L6] & missed Entropy column → Predicts p₂ = 0 (SAFE)',
          desc: 'By random feature subsampling, Tree #2 split on NumDots ≤ 1 and got tricked into voting SAFE on L5.'
        },
        {
          label: 'Step 3: Draw Tree #3 on Bootstrap Sample C (Votes PHISH)',
          eqTemplate: 'Tree #3 drew [L1,L3,L5,L5,L8] & split on BrandSpoof == 1 → Predicts p₃ = 1 (PHISH)',
          desc: 'Tree #3 gets BrandSpoof in its random feature subset and confidently votes PHISH.'
        },
        {
          label: 'Step 4: Combine Votes ➔ 2 PHISH vs 1 SAFE = 66.7% PHISH!',
          eqTemplate: 'Ensemble Avg P = (1 + 0 + 1) / 3 = 0.667 ➔ Final Majority Verdict: PHISH (Noise Cancelled!)',
          desc: 'One noisy tree (Tree #2) loses the 2-to-1 democratic vote. Scaling up to 300 trees stabilizes accuracy cleanly.'
        }
      ]
    },
    boosting: {
      title: '3. Gradient Boosting: Curves + Shrinking Residuals Tree by Tree',
      subtitle: 'Watch red vertical residual error lines g = p − y shrink from −0.50 to −0.01 across Tree 1 → Tree 2 → Tree 3 → Tree 10!',
      predictQ: 'In Gradient Boosting, what does each newly added tree predict instead of raw labels?',
      predictOpts: [
        'It re-predicts the original 0/1 label from scratch independently',
        'It predicts the leftover residual gradient g = p − y that earlier trees got wrong!',
        'It drops random rows permanently'
      ],
      predictAns: 1,
      readingGuide: {
        axes: 'X = Risk Signal Strength (0..5), Y = Probability (0.0 to 1.0). Vertical red bars = Error Gap |y − p|.',
        shape: 'As Tree 1 → 10 add, the blue step-curve climbs toward Phish dots (top) and drops toward Safe dots (bottom), shrinking red bars.',
        change: 'Lowering learning rate η makes each tree take gentler residual steps, requiring more trees but preventing overfitting.'
      },
      tableCols: ['URL ID', 'True y', 'Tree 1 p', 'Residual g = p − y'],
      steps: [
        { label: 'Step 1: Base Tree 0 (Flat 50% Guess Everywhere, Huge Red Residuals)', eqTemplate: 'F₀: p = 0.50 on all links → L1 residual g = 0.50 − 1.00 = −0.50', desc: 'Before any split, every URL sits at 50% uncertainty. Red vertical error bars stretch halfway to 0 and 1.' },
        { label: 'Step 2: Add Tree #1 (Residuals Shrink by 45%!)', eqTemplate: 'z₁ = 0 + 0.9·f₁(x) → L1 jumps to p = 71% (g shrinks from −0.50 to −0.29)', desc: 'Tree #1 fits the biggest negative gradients, pushing phishing predictions upward toward 1.0.' },
        { label: 'Step 3: Add Tree #3 (Borderline L5 Fixed, Residuals Tiny!)', eqTemplate: 'z₃ = ∑ f₁..₃ → L5 moves from 50% → 86% (g = −0.14)', desc: 'Tree #3 specifically targets high-entropy `.xyz` residuals that Tree #1 missed.' },
        { label: 'Step 4: Tree #10 Converged (Mean Residual < 0.02!)', eqTemplate: 'z₁₀ → L1 = 98.2%, L5 = 94.6%, Safe L2 = 2.1% (Red bars nearly gone!)', desc: 'All 10 sequential corrections sum in log-odds space until every residual error nearly vanishes.' }
      ]
    },
    roc_curve: {
      title: '4. ROC Curve Built Point-by-Point as Threshold τ Slides Down',
      subtitle: 'Start with ONE dot at (0, 0) when Threshold τ = 1.00, then lower τ step by step so the ROC curve emerges from the table!',
      predictQ: 'Where will the ROC curve lie if a model is purely random coin-flip guessing?',
      predictOpts: [
        'Hugging the top-left corner (False Alarm Rate = 0%, Threat Catch Rate = 100%)',
        'A straight diagonal dashed line from bottom-left (0,0) to top-right (1,1)',
        'A flat horizontal line along Threat Catch Rate = 1.0'
      ],
      predictAns: 1,
      readingGuide: {
        axes: 'X = False Positive Rate False Alarm Rate (Safe URLs wrongly blocked); Y = True Positive Rate / Recall (Phish caught).',
        shape: 'Curve hugging TOP-LEFT corner = Excellent (AUC ≈ 1.0). Diagonal line = Useless coin flip (AUC = 0.50).',
        change: 'Better feature separation lifts every threshold dot upward-left; threshold choice only picks WHICH dot along the curve you deploy!'
      },
      tableCols: ['Threshold τ', 'False Alarm Rate (Safe Blocked)', 'Threat Catch Rate (Phish Caught)', 'Point Status'],
      steps: [
        { label: 'Step 1: τ = 1.00 (Strictest Cutoff → Dot at Origin 0,0)', eqTemplate: 'At τ = 1.00: p ≥ 1.00 flags 0 links → False Alarm Rate = 0/4 = 0.00, Threat Catch Rate = 0/4 = 0.00', desc: 'Nobody passes cutoff 1.00! Zero false alarms, zero phishing caught — 1 lonely dot at bottom-left.' },
        { label: 'Step 2: τ = 0.75 (2 Clear Phish Caught → Dot at False Alarm Rate=0.00, Threat Catch Rate=0.50)', eqTemplate: 'At τ = 0.75: L1(0.92), L7(0.86), L3(0.78) caught → Threat Catch Rate = 3/4 = 0.75, False Alarm Rate = 0.00!', desc: 'Lowering cutoff to 0.75 catches 3 of 4 phishing URLs with ZERO false alarms — jumps straight up the left wall!' },
        { label: 'Step 3: τ = 0.42 (All 4 Phish Caught → Dot at False Alarm Rate=0.00, Threat Catch Rate=1.00!)', eqTemplate: 'At τ = 0.42: Even tricky L5(0.46) passes 0.42, while Safe L4(0.38) stays below → Corner (0.00, 1.00)!', desc: 'Perfect top-left corner! All 4 phishing links caught before a single safe link crosses the cutoff.' },
        { label: 'Step 4: τ = 0.00 (Flag Everything → Curve Ends at 1.00, 1.00)', eqTemplate: 'Complete ROC Curve connects dots → Area Under Curve (Ranking Accuracy) = 0.99!', desc: 'Lowering cutoff to 0.00 catches all phish AND blocks all safe links, reaching top-right (1,1).' }
      ]
    },
    pr_curve: {
      title: '5. Precision-Recall (PR) Curve Built Step-by-Step Under Imbalance',
      subtitle: 'See why Precision-Recall exposes rare-class false alarms (1% phishing rate) that hide on an ROC curve!',
      predictQ: 'Why does the PR curve stay in the bottom corner for a random model when only 1% of links are phishing?',
      predictOpts: [
        'Because Precision drops to the 1% base rate whenever a random model raises Recall!',
        'Because Recall cannot exceed 50%',
        'Because Precision is always equal to Accuracy'
      ],
      predictAns: 0,
      readingGuide: {
        axes: 'X = Recall (Share of Phish Caught); Y = Precision (Share of Alarms That Are True Phish).',
        shape: 'Curve hugging TOP-RIGHT corner (High Recall AND High Precision) = Good. Flat bottom line = Random baseline at base rate.',
        change: 'Lowering phishing prevalence from 50% to 1% drops a weak model’s PR curve dramatically because FP floods Precision.'
      },
      tableCols: ['Threshold τ', 'Recall', 'Precision', 'Why It Moved'],
      steps: [
        { label: 'Step 1: τ = 0.90 (Highest Confidence Alerts Only)', eqTemplate: 'At τ = 0.90: TP=1 (L1), FP=0 → Recall = 25%, Precision = 100%', desc: 'At very high threshold, Precision starts at 100% (no false alarms yet), while Recall is low.' },
        { label: 'Step 2: τ = 0.70 (High Recall, Still 100% Precision)', eqTemplate: 'At τ = 0.70: TP=3, FP=0 → Recall = 75%, Precision = 100%', desc: 'L1, L3, L7 are all caught cleanly with zero safe-link false positives.' },
        { label: 'Step 3: τ = 0.42 (All Phish Caught, 100% Precision Before L4)', eqTemplate: 'At τ = 0.42: TP=4, FP=0 → Recall = 100%, Precision = 100%!', desc: 'Because our scores separated L5 (0.46) above L4 (0.38), Precision stays high across full Recall.' },
        { label: 'Step 4: τ = 0.15 (Under 1% Imbalance, False Alarms Crash Precision!)', eqTemplate: 'At τ = 0.15: TP=4, FP=2 (L4, L8) → Precision plunges to 4/6 = 67% (and 20% at 1% base rate!)', desc: 'Unlike ROC where False Alarm Rate=2/990 looks tiny, PR-AUC immediately punishes false alarms plunging Precision.' }
      ]
    },
    loss_gd: {
      title: '6. Loss Bowl & Learning Rate Showdown (Too Small vs Right vs Too Big)',
      subtitle: 'Watch the ball step downhill along Loss L(w) = (w − 10)² while comparing 3 learning rates side by side!',
      predictQ: 'If you pick a Learning Rate α that is way too big (e.g., α = 0.98 on a steep bowl), what happens to the ball?',
      predictOpts: [
        'It reaches the exact minimum 10× faster',
        'It leaps clear across the valley onto the opposite wall higher and higher (Divergence / Overshoot!)',
        'It freezes in place at w = 0'
      ],
      predictAns: 1,
      readingGuide: {
        axes: 'Left: Parameter w vs Loss L(w) parabola with tangent slope. Right: Loss over Iterations 1..8 across 3 Learning Rates.',
        shape: 'Just-Right α drops smoothly down into the valley floor; Too-Small α creeps linearly; Too-Big α zig-zags upward!',
        change: 'Steeper Loss slopes `|∂L/∂w|` scale the jump `Δw = −α·g`, making optimal α smaller on sharp curved valleys.'
      },
      tableCols: ['Iter t', 'Weight w', 'Slope g = ∂L/∂w', 'Update Δw = −α·g'],
      steps: [
        { label: 'Step 1: Start High on Left Rim (w = 2.0, Loss = 64.0, Steep Slope)', eqTemplate: 'At w = 2.0: g = 2(2 − 10) = −16.0 (Steep downhill right!) → Optimal α=0.15 jumps +2.4', desc: 'Far from optimal w=10, the tangent line slopes sharply downward (−16), commanding a big step right.' },
        { label: 'Step 2: Mid-Slope Descent (w = 4.4 → 6.8, Loss Drops 64 → 10)', eqTemplate: 'At w = 5.6: g = −8.8 → Too-Small α stays stuck near w=2.9 while Just-Right reaches w=6.9!', desc: 'Notice Too-Big α=0.95 already slingshotted past w=10 to w=17.2 across the canyon!' },
        { label: 'Step 3: Approaching Valley Floor (w = 8.9, Slope Flattens!)', eqTemplate: 'At w = 8.9: Slope |g| shrinks to −2.2 → Steps automatically get gentler near minimum!', desc: 'Because gradient shrinks as the bowl flattens, the Just-Right ball lands gently instead of overshooting.' },
        { label: 'Step 4: Converged at Bottom (w = 10.0, g = 0, Loss = 0.00)', eqTemplate: 'At w = 10.0: ∂L/∂w = 0 → Just-Right converged! (Too-Big α is oscillating at w = +38!)', desc: 'Learning rate α = 0.15 achieves 0.02 loss in 6 steps while too-small lags and too-big explodes.' }
      ]
    },
    sigmoid: {
      title: '7. Sigmoid S-Curve: Raw Log-Odds z → 0–100% Probability',
      subtitle: 'See why z = −4 means "1.8% Very Sure Safe", z = 0 means "50/50 Coin Flip", and z = +4 means "98.2% Very Sure Phish".',
      predictQ: 'When an email has raw score z = +4.0, why is its probability 98.2% instead of 400%?',
      predictOpts: [
        'Because Sigmoid p = 1/(1 + e⁻ᶻ) squashes any real number (−∞ to +∞) smoothly inside (0, 1)',
        'Because Python deletes numbers greater than 1',
        'Because z gets divided by 100'
      ],
      predictAns: 0,
      readingGuide: {
        axes: 'X = Raw Linear Log-Odds Score z (−6 to +6); Y = Output Probability p = σ(z) (0% to 100%).',
        shape: 'Smooth S-curve crossing 50% at z = 0 and flattening gently near 0% and 100% (never exceeding [0,1]).',
        change: 'Multiplying weights w by 2× makes the middle S-slope twice as steep!'
      },
      tableCols: ['Landmark', 'Raw Score z', 'e⁻ᶻ Value', 'Probability p = 1/(1+e⁻ᶻ)'],
      steps: [
        { label: 'Step 1: Center Anchor at z = 0 ➔ 50.0% ("50/50 Unsure")', eqTemplate: 'p(0) = 1 / (1 + e⁰) = 1 / (1 + 1) = 0.500 (50.0% Exact Coin Flip!)', desc: 'Whenever positive clues and safe clues tie at z = 0, Sigmoid outputs exactly 50% uncertainty.' },
        { label: 'Step 2: Left Wing at z = −4 ➔ 1.8% ("Very Sure Safe")', eqTemplate: 'p(−4) = 1 / (1 + e⁺⁴) = 1 / 55.6 = 0.018 (1.8% Safe Domain!)', desc: 'Safe hallmarks (z = −4) map into the calm lower green tail below 2% risk.' },
        { label: 'Step 3: Right Wing at z = +4 ➔ 98.2% ("Very Sure Phishing")', eqTemplate: 'p(+4) = 1 / (1 + e⁻⁴) = 1 / 1.018 = 0.982 (98.2% High-Risk Block!)', desc: 'Strong phishing evidence (z = +4) lifts the curve into the upper red plateau.' },
        { label: 'Step 4: Full S-Curve + Steepness Zone (z ∈ [−6, +6])', eqTemplate: 'Slope of Sigmoid = p(1−p): steepest at z=0 (0.25), gentle saturation at ±4 (0.018)!', desc: 'Complete Sigmoid curve connects every score z cleanly without sudden corners.' }
      ]
    },
    kmeans: {
      title: '8. K-Means Clustering: Watch Centroids Move Per Iteration',
      subtitle: 'Step-by-step Unsupervised Learning: no y labels! Track μ₁ and μ₂ coordinates before & after each update.',
      predictQ: 'At the end of Iteration 1, where does K-Means move each centroid magnet μₖ?',
      predictOpts: [
        'To a random new corner of the chart',
        'To the exact average (mean x, mean y) of all dots currently assigned to that centroid!',
        'To the farthest outlier dot'
      ],
      predictAns: 1,
      readingGuide: {
        axes: 'X = URL Length (chars), Y = Character Randomness (bits/char). Crosshairs = Cluster Centroids μ₁, μ₂.',
        shape: 'Clusters converge when dashed movement trails stop moving (0 point reassignments).',
        change: 'A single extreme outlier shifts centroid averages heavily — scale features first and consider DBSCAN for noisy security data!'
      },
      tableCols: ['Iter', 'Centroid μ₁ (Safe Group)', 'Centroid μ₂ (Phish Group)', 'Reassigned Dots'],
      steps: [
        { label: 'Step 1: Random Start Before Training (μ₁ & μ₂ Poorly Placed)', eqTemplate: 'Init: μ₁ = (24.0, 3.30), μ₂ = (20.0, 3.20) → Mixed assignments before Iteration 1!', desc: 'Starting magnets are placed blindly with zero labels — points color by whichever magnet is closer right now.' },
        { label: 'Step 2: Iteration 1 Assignment + Mean Recalculation', eqTemplate: 'Move μ₁ → (20.8, 2.88) and μ₂ → (24.3, 4.08) along dashed golden vectors!', desc: 'Each centroid slides to the exact center of gravity of its assigned dots.' },
        { label: 'Step 3: Iteration 2 Fine Re-Grouping (3/3 Safe Left, 4/4 Phish Right)', eqTemplate: 'L1 & L3 switch cleanly to μ₂ cluster; μ₂ shifts to (24.3, 4.08)', desc: 'Re-measuring distances flips remaining border links into the true cluster.' },
        { label: 'Step 4: Converged! Centroids Stabilize (Zero Movement)', eqTemplate: 'Final μ₁ = (20.8, 2.88), μ₂ = (24.3, 4.08) → 0 points swapped (Done!)', desc: 'No point changes color anymore — K-Means found both traffic archetypes without ever seeing a label!' }
      ]
    },
    svm: {
      title: '9. Support Vector Machine: Margin Street & Penalty Knob C',
      subtitle: 'Build the boundary → draw the widest street → spotlight the few Support Vectors → toggle Soft vs Hard Margin C.',
      predictQ: 'If you move a Safe dot that sits 10 miles away from the street curb, does the SVM line move at all?',
      predictOpts: [
        'Yes, every single point pulls the boundary proportionally',
        'No! Only the closest boundary dots touching the street curbs (Support Vectors) anchor the line!',
        'It flips the Safe and Phish labels'
      ],
      predictAns: 1,
      readingGuide: {
        axes: 'X = Entropy (2.4–4.5), Y = Brand Spoof Risk Index. Sky line = Boundary; Dashed = ±1 Margin Curbs.',
        shape: 'Wide unobstructed safety street with only a few circled golden Support Vectors on the curbs.',
        change: 'Raising C shrinks the street width to chase every noisy outlier (overfit risk); lowering C widens the street!'
      },
      tableCols: ['Step / Setting', 'Margin Street Width (2/‖w‖)', 'Support Vectors Active', 'Behavior'],
      steps: [
        { label: 'Step 1: Raw Unseparated URLs (Safe Bottom-Left, Phish Top-Right)', eqTemplate: 'Goal: Find w·x + b = 0 leaving maximum safety gap between Safe and Phish classes.', desc: 'We start with our unlabeled boundary plane — infinitely many thin lines could separate these dots.' },
        { label: 'Step 2: Draw Center Boundary + Widest Parallel Street (±1 Curbs)', eqTemplate: 'Margin Width = 2 / ‖w‖ = 1.42 units wide! Maximizing gap minimizes future boundary flips.', desc: 'Instead of settling for a line hugging close to L3 or L4, SVM expands the street evenly until it bumps into dots.' },
        { label: 'Step 3: Spotlight Gold Support Vectors (L4, L3, L5 Curbs)', eqTemplate: 'Only L4 (Safe curb) and L3/L5 (Phish curb) have αᵢ > 0 — delete L2/L6/L8 and the line stays 100% IDENTICAL!', desc: 'Those 3 highlighted Support Vectors completely define the hyperplane; faraway points have weight 0.' },
        { label: 'Step 4: Toggle Penalty Budget C (Soft C=0.2 vs Hard C=50)', eqTemplate: 'High C=50 shrinks margin to bend around 1 noisy outlier; Low C=0.2 keeps a wide safe highway!', desc: 'Use the interactive C toggle below to watch how slack budget C trades margin width for zero training violations.' }
      ]
    },
    pca: {
      title: '10. PCA Dimensionality Reduction: 2D Cloud → PC1 Greatest Spread Axis',
      subtitle: 'Watch a correlated 2D cloud rotate onto its maximum-variance highway PC1 and drop perpendicular projections onto 1D!',
      predictQ: 'How does PCA choose the direction of Principal Component 1 (PC1) before rotating your table?',
      predictOpts: [
        'It points straight toward whichever feature correlates with y label',
        'It points along the direction where the spread (variance) of the points is LARGEST!',
        'It always drops the second column completely'
      ],
      predictAns: 1,
      readingGuide: {
        axes: 'X = Standardized URL Length (z₁); Y = Standardized Path+Tokens (z₂). Blue arrow = PC1 (94.2% Variance).',
        shape: 'Long diagonal cigar cloud flattens cleanly onto PC1 with minimal perpendicular projection error!',
        change: 'Unscaled columns distort PC1 toward the unit with biggest raw numbers — ALWAYS run StandardScaler before PCA!'
      },
      tableCols: ['URL ID', '2D Z-Coords (z₁, z₂)', '1D PC1 Projection', 'Dropped PC2 Error'],
      steps: [
        { label: 'Step 1: Standardized 2D Diagonal Cloud (z₁ & z₂ Move Together)', eqTemplate: 'Correlation r(Len, Tokens) = +0.92 → Almost all points fall near a diagonal corridor!', desc: 'Notice we don’t actually need two coordinates when length and path tokens move together.' },
        { label: 'Step 2: Draw PC1 (Max Variance Direction = 94.2%) & Orthogonal PC2', eqTemplate: 'Eigenvalue λ₁ = 1.88 (94.2% spread) along PC1 vs λ₂ = 0.12 (5.8% wiggle) along PC2.', desc: 'PC1 rotates to slice right down the spine of the cigar cloud; PC2 measures minor sideways thickness.' },
        { label: 'Step 3: Drop Perpendicular Projection Lines onto PC1!', eqTemplate: 'Each point zᵢ drops 90° onto PC1: pc1ᵢ = 0.707·z₁ + 0.707·z₂ (Red lines = discarded thickness!)', desc: 'We drop each dot straight onto the sky-blue PC1 line — keeping 94.2% of differences while halving columns from 2 to 1!' },
        { label: 'Step 4: Compressed 1D Representation Ready for Downstream ML', eqTemplate: 'Original 8×2 matrix → Compressed 8×1 PC1 column with collinearity completely eliminated!', desc: 'All redundant variance is gone; remaining PC1 score captures overall URL scale cleanly.' }
      ]
    }
  };

  // Map ALL 31 ML modules + 19 LureLock chapters to their primary Visual Builder & Stat Trust Topic
  const ML_MOD_MAP = {
    mod0: { vb: 'loss_gd', stat: 'mean_var_sd' },
    mod0_math: { vb: 'loss_gd', stat: 'sampling_randomness' },
    mod_vec: { vb: 'pca', stat: 'corr_vs_causation' },
    mod_design: { vb: 'pca', stat: 'corr_vs_causation' },
    mod_corr: { vb: 'pca', stat: 'corr_vs_causation' },
    mod_pval_ci: { vb: 'roc_curve', stat: 'bootstrap_ci' },
    mod_fisher: { vb: 'pr_curve', stat: 'probability_basics' },
    mod_bestfit: { vb: 'loss_gd', stat: 'mean_var_sd' },
    mod_coeff_r2: { vb: 'loss_gd', stat: 'corr_vs_causation' },
    mod_ttest: { vb: 'loss_gd', stat: 'model_comparison' },
    mod_anova_f: { vb: 'loss_gd', stat: 'model_comparison' },
    mod4_grad: { vb: 'loss_gd', stat: 'mean_var_sd' },
    mod4_hessian: { vb: 'boosting', stat: 'mean_var_sd' },
    mod4: { vb: 'loss_gd', stat: 'sampling_randomness' },
    mod5: { vb: 'loss_gd', stat: 'bias_variance' },
    mod6_odds: { vb: 'sigmoid', stat: 'probability_basics' },
    mod6_mle: { vb: 'sigmoid', stat: 'calibration' },
    mod6_deviance: { vb: 'roc_curve', stat: 'model_comparison' },
    mod6_wald: { vb: 'sigmoid', stat: 'bootstrap_ci' },
    mod_idf_idft: { vb: 'pr_curve', stat: 'distributions' },
    mod7: { vb: 'pr_curve', stat: 'bayes_theorem' },
    mod8: { vb: 'svm', stat: 'threshold_slider' },
    mod9: { vb: 'decision_tree', stat: 'train_val_test' },
    mod10: { vb: 'boosting', stat: 'cross_validation' },
    mod11: { vb: 'roc_curve', stat: 'imbalance_metrics' },
    mod12: { vb: 'kmeans', stat: 'distributions' },
    mod13: { vb: 'roc_curve', stat: 'data_leakage' },
    mod14: { vb: 'loss_gd', stat: 'bias_variance' },
    mod15: { vb: 'boosting', stat: 'honest_reporting' },
    mod16: { vb: 'pr_curve', stat: 'data_leakage' },
    mod17: { vb: 'roc_curve', stat: 'honest_reporting' }
  };

  const LL_MOD_MAP = {
    mod0: { vb: 'sigmoid', stat: 'bayes_theorem' },
    mod1: { vb: 'decision_tree', stat: 'distributions' },
    mod2: { vb: 'pr_curve', stat: 'mean_var_sd' },
    mod3: { vb: 'boosting', stat: 'cross_validation' },
    mod4: { vb: 'sigmoid', stat: 'threshold_slider' },
    mod5: { vb: 'pr_curve', stat: 'imbalance_metrics' },
    mod6: { vb: 'random_forest', stat: 'honest_reporting' },
    mod7: { vb: 'roc_curve', stat: 'data_leakage' },
    mod8: { vb: 'decision_tree', stat: 'data_leakage' },
    mod9: { vb: 'pca', stat: 'corr_vs_causation' },
    mod10: { vb: 'svm', stat: 'mean_var_sd' },
    mod11: { vb: 'boosting', stat: 'bias_variance' },
    mod12: { vb: 'roc_curve', stat: 'calibration' },
    mod13: { vb: 'random_forest', stat: 'honest_reporting' },
    mod14: { vb: 'kmeans', stat: 'distributions' },
    mod15: { vb: 'sigmoid', stat: 'probability_basics' },
    mod16: { vb: 'decision_tree', stat: 'data_leakage' },
    mod17: { vb: 'roc_curve', stat: 'threshold_slider' },
    mod18: { vb: 'boosting', stat: 'calibration' }
  };

  // ============================================================================
  // HTML5 CANVAS DRAWING ENGINE FOR ALL 10 VISUAL BUILDERS (Unified Palette!)
  // ============================================================================
  function getCanvasPts() {
    // Stable pixel coordinates inside 640x290 logical canvas
    return EXTENDED_URLS.map(r => ({
      id: r.id,
      url: r.url,
      len: r.len,
      ent: r.ent,
      spoof: r.brandSpoof,
      y: r.y,
      pA: r.pA
    }));
  }

  function setupCanvasBox(canvas, titleX, titleY, legendItems) {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = 640;
    const H = canvas.height = 290;

    ctx.fillStyle = PALETTE.cardBg;
    ctx.fillRect(0, 0, W, H);

    // Subtle grid
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    for (let x = 60; x <= 600; x += 90) {
      ctx.beginPath(); ctx.moveTo(x, 34); ctx.lineTo(x, 245); ctx.stroke();
    }
    for (let y = 45; y <= 245; y += 50) {
      ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(600, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = PALETTE.axis;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(60, 34); ctx.lineTo(60, 245); ctx.lineTo(605, 245); ctx.stroke();

    // Axis Titles
    ctx.fillStyle = PALETTE.text;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(titleX, 330, 276);
    ctx.save();
    ctx.translate(18, 140);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(titleY, 0, 0);
    ctx.restore();

    // Top Legend
    let lx = 64;
    ctx.textAlign = 'left';
    ctx.font = 'bold 11px sans-serif';
    (legendItems || []).forEach(it => {
      ctx.fillStyle = it.col;
      ctx.fillRect(lx, 10, 11, 11);
      ctx.fillStyle = PALETTE.text;
      ctx.fillText(it.label, lx + 16, 19);
      lx += ctx.measureText(it.label).width + 32;
    });

    return { ctx, W, H };
  }

  function drawCircleDot(ctx, x, y, radius, fillCol, label, isHighlight) {
    if (isHighlight) {
      ctx.beginPath();
      ctx.arc(x, y, radius + 6, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE.accentSoft;
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = PALETTE.accent;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillCol;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
    if (label) {
      ctx.fillStyle = isHighlight ? PALETTE.accent : PALETTE.text;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y - radius - 4);
    }
  }

  function drawVisualBuilderCanvas(contextId) {
    const canvas = document.getElementById('v10-vb-canvas-' + contextId);
    if (!canvas) return;
    const st = getVbState(contextId);
    const key = st.builderKey;
    const step = st.stepIdx;
    const hi = st.highlightRow;
    const pts = getCanvasPts();

    if (key === 'decision_tree') {
      const box = setupCanvasBox(canvas, 'Left: Scatter Plot (URL Entropy bits vs BrandSpoof) | Right: Synchronized Tree', 'Brand / Risk', [
        { col: PALETTE.phish, label: 'Phishing (y=1)' },
        { col: PALETTE.safe, label: 'Safe (y=0)' },
        { col: PALETTE.model, label: 'Tree Split Line' },
        { col: PALETTE.accent, label: 'Highlighted / Winner' }
      ]);
      const ctx = box.ctx;
      // Divider between Scatter (60..340) and Tree (360..610)
      ctx.strokeStyle = PALETTE.grid;
      ctx.beginPath(); ctx.moveTo(350, 34); ctx.lineTo(350, 245); ctx.stroke();

      // Plot 8 points on Left scatter: X = Entropy (2.4..4.5 -> 75..325), Y = Spoof (0 -> 210, 1 -> 85) with slight jitter
      const pCoords = pts.map((p, idx) => ({
        x: 75 + ((p.ent - 2.4) / 2.1) * 235,
        y: p.spoof ? 85 + (idx % 2 === 0 ? -12 : 12) : 205 + (idx % 2 === 0 ? -12 : 12),
        p
      }));

      // Draw candidate / winning split lines on Scatter + matching Tree diagram on Right
      if (step === 1) {
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = PALETTE.phish;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(195, 40); ctx.lineTo(195, 240); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = PALETTE.phish;
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Weak Split Gini=0.45 (Mixed!)', 195, 52);
      }
      if (step >= 2) {
        // Winning horizontal split Spoof == 1
        ctx.fillStyle = PALETTE.phishSoft; ctx.fillRect(62, 36, 286, 112);
        ctx.fillStyle = PALETTE.safeSoft; ctx.fillRect(62, 148, 286, 95);
        ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(62, 148); ctx.lineTo(348, 148); ctx.stroke();
        ctx.fillStyle = PALETTE.model; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'left';
        ctx.fillText('Winner Split #1: BrandSpoof == 1', 70, 142);
      }
      if (step >= 3) {
        ctx.strokeStyle = PALETTE.accent; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(220, 36); ctx.lineTo(220, 244); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = PALETTE.accent; ctx.fillText('Split #2: Ent > 3.7', 224, 238);
      }

      pCoords.forEach((c, idx) => {
        drawCircleDot(ctx, c.x, c.y, 6.5, c.p.y ? PALETTE.phish : PALETTE.safe, c.p.id, idx === hi);
      });

      // Right Side: Synchronized Tree Diagram
      const drawNode = (nx, ny, w, h, text, sub, borderCol) => {
        ctx.fillStyle = '#1e293b'; ctx.fillRect(nx - w / 2, ny, w, h);
        ctx.strokeStyle = borderCol; ctx.lineWidth = 2; ctx.strokeRect(nx - w / 2, ny, w, h);
        ctx.fillStyle = PALETTE.text; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
        ctx.fillText(text, nx, ny + 15);
        ctx.fillStyle = PALETTE.muted; ctx.font = '10px sans-serif';
        ctx.fillText(sub, nx, ny + 29);
      };
      drawNode(485, 44, 156, 36, step >= 2 ? 'BrandSpoof == 1 ?' : 'ROOT: All 8 URLs', step >= 2 ? '4 Phish / 4 Safe (Gini 0.50)' : 'Gini = 0.500 (Mixed)', PALETTE.model);
      if (step >= 2) {
        ctx.strokeStyle = PALETTE.safe; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(455, 80); ctx.lineTo(415, 130); ctx.stroke();
        ctx.strokeStyle = PALETTE.phish;
        ctx.beginPath(); ctx.moveTo(515, 80); ctx.lineTo(555, 130); ctx.stroke();
        drawNode(415, 130, 108, 36, 'NO → SAFE Leaf', '[0 Phish, 4 Safe] Gini=0', PALETTE.safe);
        drawNode(555, 130, 108, 36, 'YES → PHISH Leaf', '[4 Phish, 0 Safe] Gini=0', PALETTE.phish);
      }
      if (step >= 3) {
        ctx.strokeStyle = PALETTE.accent; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(415, 166); ctx.lineTo(415, 196); ctx.stroke();
        drawNode(415, 196, 118, 36, 'Entropy > 3.7?', 'Catches Stealth Links!', PALETTE.accent);
      }
      return;
    }

    if (key === 'random_forest') {
      const box = setupCanvasBox(canvas, '3 Parallel Bootstrap Trees → Majority Democratic Vote on URL L5', 'Vote', [
        { col: PALETTE.phish, label: 'Vote: PHISH' },
        { col: PALETTE.safe, label: 'Vote: SAFE' },
        { col: PALETTE.accent, label: 'Final Winner' }
      ]);
      const ctx = box.ctx;
      const trees = [
        { x: 145, name: 'Tree #1 (Boot A)', feat: 'Entropy > 3.7?', pred: 'PHISH', col: PALETTE.phish, active: step >= 0 },
        { x: 300, name: 'Tree #2 (Boot B)', feat: 'NumDots > 1?', pred: 'SAFE (Miss!)', col: PALETTE.safe, active: step >= 1 },
        { x: 455, name: 'Tree #3 (Boot C)', feat: 'Spoof == 1?', pred: 'PHISH', col: PALETTE.phish, active: step >= 2 }
      ];
      trees.forEach((t, idx) => {
        ctx.globalAlpha = t.active ? 1.0 : 0.22;
        ctx.fillStyle = '#1e293b'; ctx.fillRect(t.x - 62, 46, 124, 34);
        ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 2; ctx.strokeRect(t.x - 62, 46, 124, 34);
        ctx.fillStyle = PALETTE.text; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
        ctx.fillText(t.name, t.x, 60); ctx.fillText(t.feat, t.x, 73);
        ctx.strokeStyle = t.col; ctx.beginPath(); ctx.moveTo(t.x, 80); ctx.lineTo(t.x, 124); ctx.stroke();
        ctx.fillStyle = t.col; ctx.fillRect(t.x - 52, 124, 104, 34);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 11px monospace';
        ctx.fillText(t.pred, t.x, 145);
        if (idx === hi) {
          ctx.strokeStyle = PALETTE.accent; ctx.lineWidth = 3; ctx.strokeRect(t.x - 66, 42, 132, 120);
        }
      });
      ctx.globalAlpha = 1.0;
      if (step >= 3) {
        ctx.fillStyle = '#1e293b'; ctx.fillRect(115, 184, 410, 48);
        ctx.strokeStyle = PALETTE.accent; ctx.lineWidth = 2.5; ctx.strokeRect(115, 184, 410, 48);
        ctx.fillStyle = PALETTE.accent; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center';
        ctx.fillText('MAJORITY VOTE: 2 PHISH vs 1 SAFE → 66.7% PHISH (Noise Cancelled!)', 320, 213);
      }
      return;
    }

    if (key === 'boosting') {
      const box = setupCanvasBox(canvas, 'Clue Strength Index (0..5) — URL L1..L8', 'Prob p', [
        { col: PALETTE.phish, label: 'Target y=1 (Phish)' },
        { col: PALETTE.safe, label: 'Target y=0 (Safe)' },
        { col: PALETTE.model, label: 'Ensemble Curve' },
        { col: PALETTE.phish, label: 'Residual Line g = p−y' }
      ]);
      const ctx = box.ctx;
      const ysCurve = [0.50, 0.72, 0.88, 0.96];
      const predPhish = ysCurve[step];
      const predSafe = 1 - predPhish * 0.96;

      // Draw step curve across X = 70..590 (X < 330 Safe zone, X >= 330 Phish zone)
      const safeY = 230 - predSafe * 175;
      const phishY = 230 - predPhish * 175;
      ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(70, safeY); ctx.lineTo(330, safeY); ctx.lineTo(330, phishY); ctx.lineTo(590, phishY); ctx.stroke();

      // Plot Safe dots (left) and Phish dots (right) + shrinking red residual lines!
      pts.forEach((p, idx) => {
        const px = p.y ? (360 + ((idx % 4) * 58)) : (95 + ((idx % 4) * 58));
        const trueY = p.y ? 55 : 230;
        const curModelY = p.y ? phishY : safeY;
        // Residual segment in Rose Red
        ctx.strokeStyle = PALETTE.phish; ctx.lineWidth = 2.4; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(px, trueY); ctx.lineTo(px, curModelY); ctx.stroke();
        ctx.setLineDash([]);
        drawCircleDot(ctx, px, trueY, 6.5, p.y ? PALETTE.phish : PALETTE.safe, p.id, idx === hi);
      });
      ctx.fillStyle = PALETTE.accent; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
      ctx.fillText('Max Residual |g| = ' + (1 - predPhish).toFixed(2) + (step === 3 ? ' (Converged!)' : ' (Shrinking!)'), 74, 46);
      return;
    }

    if (key === 'roc_curve') {
      const box = setupCanvasBox(canvas, 'False Positive Rate False Alarm Rate (Safe Blocked / Total Safe)', 'Threat Catch Rate (Recall)', [
        { col: PALETTE.model, label: 'Emerging ROC Curve' },
        { col: PALETTE.accent, label: 'Current τ Dot' },
        { col: PALETTE.muted, label: 'Random Coin Flip (Diag)' }
      ]);
      const ctx = box.ctx;
      // Diagonal random line
      ctx.strokeStyle = PALETTE.muted; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(60, 245); ctx.lineTo(590, 45); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = PALETTE.muted; ctx.font = '10px monospace'; ctx.textAlign = 'center';
      ctx.fillText('Random Guessing (AUC = 0.50)', 335, 160);

      const rocDots = [
        { fpr: 0.00, tpr: 0.00, lbl: 'τ=1.00' },
        { fpr: 0.00, tpr: 0.75, lbl: 'τ=0.75' },
        { fpr: 0.00, tpr: 1.00, lbl: 'τ=0.42 (Perfect!)' },
        { fpr: 1.00, tpr: 1.00, lbl: 'τ=0.00' }
      ];
      const maxPlot = step + 1;
      ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < maxPlot; i++) {
        const dx = 60 + rocDots[i].fpr * 530;
        const dy = 245 - rocDots[i].tpr * 200;
        if (i === 0) ctx.moveTo(dx, dy); else ctx.lineTo(dx, dy);
      }
      ctx.stroke();

      for (let i = 0; i < maxPlot; i++) {
        const dx = 60 + rocDots[i].fpr * 530;
        const dy = 245 - rocDots[i].tpr * 200;
        drawCircleDot(ctx, dx, dy, 6.5, (i === step || i === hi) ? PALETTE.accent : PALETTE.model, rocDots[i].lbl, i === step || i === hi);
      }
      return;
    }

    if (key === 'pr_curve') {
      const box = setupCanvasBox(canvas, 'Recall (Share of Phish Caught)', 'Precision', [
        { col: PALETTE.safe, label: 'Emerging PR Curve' },
        { col: PALETTE.phish, label: '1% Random Base Rate Floor' },
        { col: PALETTE.accent, label: 'Current τ Dot' }
      ]);
      const ctx = box.ctx;
      // 1% random imbalance baseline near bottom
      ctx.strokeStyle = PALETTE.phish; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(60, 238); ctx.lineTo(590, 238); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = PALETTE.phish; ctx.font = '10px monospace'; ctx.textAlign = 'left';
      ctx.fillText('Random Baseline Under 1% Imbalance (Precision = 0.01)', 70, 232);

      const prDots = [
        { rec: 0.25, prec: 1.00, lbl: 'τ=0.90' },
        { rec: 0.75, prec: 1.00, lbl: 'τ=0.70' },
        { rec: 1.00, prec: 1.00, lbl: 'τ=0.42' },
        { rec: 1.00, prec: 0.67, lbl: 'τ=0.15 (FPs!)' }
      ];
      ctx.strokeStyle = PALETTE.safe; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= step; i++) {
        const dx = 60 + prDots[i].rec * 520;
        const dy = 245 - prDots[i].prec * 195;
        if (i === 0) ctx.moveTo(dx, dy); else ctx.lineTo(dx, dy);
      }
      ctx.stroke();
      for (let i = 0; i <= step; i++) {
        const dx = 60 + prDots[i].rec * 520;
        const dy = 245 - prDots[i].prec * 195;
        drawCircleDot(ctx, dx, dy, 6.5, (i === step || i === hi) ? PALETTE.accent : PALETTE.safe, prDots[i].lbl, i === step || i === hi);
      }
      return;
    }

    if (key === 'loss_gd') {
      const box = setupCanvasBox(canvas, 'Left: Ball on Loss Bowl L(w)=(w−10)² | Right: Learning Rate Race', 'Loss L(w)', [
        { col: PALETTE.safe, label: 'Just Right (α=0.15)' },
        { col: PALETTE.accent, label: 'Too Small (α=0.01)' },
        { col: PALETTE.phish, label: 'Too Big (α=0.95!)' }
      ]);
      const ctx = box.ctx;
      ctx.strokeStyle = PALETTE.grid; ctx.beginPath(); ctx.moveTo(340, 34); ctx.lineTo(340, 245); ctx.stroke();

      // Draw parabola on left (w from 0..20 -> x 70..320)
      ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let w = 0; w <= 20; w += 0.4) {
        const px = 70 + (w / 20) * 250;
        const py = 235 - Math.min(185, Math.pow(w - 10, 2) * 1.8);
        if (w === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const wsGood = [2.0, 5.6, 8.9, 10.0];
      const wCur = wsGood[step];
      const bx = 70 + (wCur / 20) * 250;
      const by = 235 - Math.min(185, Math.pow(wCur - 10, 2) * 1.8);
      drawCircleDot(ctx, bx, by, 8, PALETTE.safe, 'w=' + wCur.toFixed(1), true);

      // Right side: Learning Rate curves across steps 0..step
      const tracks = [
        { ys: [64, 55, 48, 41], col: PALETTE.accent, lbl: 'α=0.01 (Slow)' },
        { ys: [64, 19, 1.2, 0.0], col: PALETTE.safe, lbl: 'α=0.15 (Clean!)' },
        { ys: [64, 52, 81, 95], col: PALETTE.phish, lbl: 'α=0.95 (Boom!)' }
      ];
      tracks.forEach(tr => {
        ctx.strokeStyle = tr.col; ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= step; i++) {
          const tx = 370 + i * 72;
          const ty = 235 - Math.min(180, tr.ys[i] * 1.8);
          if (i === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        const lx = 370 + step * 72;
        const ly = 235 - Math.min(180, tr.ys[step] * 1.8);
        drawCircleDot(ctx, lx, ly, 5, tr.col, tr.lbl, false);
      });
      return;
    }

    if (key === 'sigmoid') {
      const box = setupCanvasBox(canvas, 'Raw Log-Odds Score z (−6 to +6)', 'Prob p = σ(z)', [
        { col: PALETTE.safe, label: 'z = −4 (1.8% Safe)' },
        { col: PALETTE.accent, label: 'z = 0 (50% Unsure)' },
        { col: PALETTE.phish, label: 'z = +4 (98.2% Phish)' }
      ]);
      const ctx = box.ctx;
      if (step >= 3) {
        ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let z = -6; z <= 6; z += 0.2) {
          const px = 70 + ((z + 6) / 12) * 520;
          const py = 240 - (1 / (1 + Math.exp(-z))) * 195;
          if (z === -6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
      // Show landmark dots progressively
      const marks = [
        { z: 0, p: 0.50, col: PALETTE.accent, lbl: 'z=0 → 50/50 Unsure', show: step >= 0 },
        { z: -4, p: 0.018, col: PALETTE.safe, lbl: 'z=−4 → 1.8% Very Sure Safe', show: step >= 1 },
        { z: 4, p: 0.982, col: PALETTE.phish, lbl: 'z=+4 → 98.2% Very Sure Phish', show: step >= 2 }
      ];
      marks.forEach((m, idx) => {
        if (!m.show) return;
        const mx = 70 + ((m.z + 6) / 12) * 520;
        const my = 240 - m.p * 195;
        drawCircleDot(ctx, mx, my, 7.5, m.col, m.lbl, idx === hi || step === idx);
      });
      return;
    }

    if (key === 'kmeans') {
      const box = setupCanvasBox(canvas, 'URL Length (chars)', 'Entropy (bits)', [
        { col: PALETTE.safe, label: 'Cluster 1 (Safe)' },
        { col: PALETTE.phish, label: 'Cluster 2 (Phish)' },
        { col: PALETTE.accent, label: 'Moving Centroids μ₁, μ₂' }
      ]);
      const ctx = box.ctx;
      const c1Path = [[24, 3.3], [20.8, 2.88], [20.8, 2.88], [20.8, 2.88]];
      const c2Path = [[20, 3.2], [24.3, 4.08], [24.3, 4.08], [24.3, 4.08]];
      const toX = l => 75 + ((l - 16) / 16) * 510;
      const toY = e => 240 - ((e - 2.4) / 2.2) * 190;

      pts.forEach((p, idx) => {
        drawCircleDot(ctx, toX(p.len), toY(p.ent), 6, p.y ? PALETTE.phish : PALETTE.safe, p.id, idx === hi);
      });

      // Draw dashed movement trails
      [c1Path, c2Path].forEach((path, cIdx) => {
        ctx.strokeStyle = cIdx === 0 ? PALETTE.safe : PALETTE.phish;
        ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.beginPath();
        for (let i = 0; i <= step; i++) {
          const px = toX(path[i][0]), py = toY(path[i][1]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke(); ctx.setLineDash([]);
        const cx = toX(path[step][0]), cy = toY(path[step][1]);
        ctx.strokeStyle = PALETTE.accent; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx - 9, cy); ctx.lineTo(cx + 9, cy); ctx.moveTo(cx, cy - 9); ctx.lineTo(cx, cy + 9); ctx.stroke();
        ctx.fillStyle = PALETTE.accent; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
        ctx.fillText('μ' + (cIdx + 1) + ' (' + path[step][0].toFixed(1) + ',' + path[step][1].toFixed(1) + ')', cx, cy - 13);
      });
      return;
    }

    if (key === 'svm') {
      const box = setupCanvasBox(canvas, 'URL Entropy (2.4–4.5 bits)', 'Risk Composite Score', [
        { col: PALETTE.phish, label: 'Phishing (y=+1)' },
        { col: PALETTE.safe, label: 'Safe (y=−1)' },
        { col: PALETTE.model, label: 'Boundary & ±1 Street' },
        { col: PALETTE.accent, label: 'Support Vectors' }
      ]);
      const ctx = box.ctx;
      const marginPx = (step === 3 && st.svmC > 5) ? 26 : 58;
      if (step >= 1) {
        // Decision boundary x = 330 + ±margin
        ctx.fillStyle = PALETTE.modelSoft;
        ctx.fillRect(330 - marginPx, 36, marginPx * 2, 208);
        ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(330, 36); ctx.lineTo(330, 244); ctx.stroke();
        ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(330 - marginPx, 36); ctx.lineTo(330 - marginPx, 244); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(330 + marginPx, 36); ctx.lineTo(330 + marginPx, 244); ctx.stroke();
        ctx.setLineDash([]);
      }
      pts.forEach((p, idx) => {
        const px = p.y ? (330 + marginPx + (idx % 3) * 65) : (330 - marginPx - (idx % 3) * 65);
        const py = 65 + (idx * 22);
        const isSV = (step >= 2 && (p.id === 'L4' || p.id === 'L3' || p.id === 'L1'));
        drawCircleDot(ctx, px, py, 6.5, p.y ? PALETTE.phish : PALETTE.safe, p.id + (isSV ? '★' : ''), isSV || idx === hi);
      });
      return;
    }

    // pca
    const box = setupCanvasBox(canvas, 'Standardized URL Length (z₁)', 'Path+Token Length (z₂)', [
      { col: PALETTE.model, label: 'PC1 (94.2% Variance)' },
      { col: PALETTE.phish, label: 'Perpendicular Projection Drops' },
      { col: PALETTE.accent, label: 'PC1 1D Scores' }
    ]);
    const ctx = box.ctx;
    if (step >= 1) {
      ctx.strokeStyle = PALETTE.model; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(95, 225); ctx.lineTo(565, 55); ctx.stroke();
      ctx.fillStyle = PALETTE.model; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
      ctx.fillText('PC1 Principal Axis (94.2% Spread)', 355, 62);
    }
    pts.forEach((p, idx) => {
      const t = (idx + 0.5) / pts.length;
      const onLineX = 110 + t * 430;
      const onLineY = 220 - t * 155;
      const jitter = (idx % 2 === 0 ? -1 : 1) * 24;
      const px = onLineX + jitter * 0.4;
      const py = onLineY + jitter * 0.9;
      if (step >= 2) {
        ctx.strokeStyle = PALETTE.phish; ctx.lineWidth = 1.6; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(onLineX, onLineY); ctx.stroke();
        ctx.setLineDash([]);
        drawCircleDot(ctx, onLineX, onLineY, 4.5, PALETTE.accent, '', false);
      }
      drawCircleDot(ctx, px, py, 6, p.y ? PALETTE.phish : PALETTE.safe, p.id, idx === hi);
    });
  }

  // ============================================================================
  // RENDERER FOR ANY STEP-THROUGH VISUAL BUILDER INSTANCE
  // ============================================================================
  function renderVisualBuilderWidget(contextId, builderKey, allowSwitcher) {
    const b = BUILDERS[builderKey] || BUILDERS.decision_tree;
    const st = getVbState(contextId, builderKey);
    const stepIdx = Math.max(0, Math.min(b.steps.length - 1, st.stepIdx));
    const curStep = b.steps[stepIdx];
    const pts = getCanvasPts();

    // Linked live equation substitution based on highlighted row (or default L1)
    const activeRow = st.highlightRow >= 0 && pts[st.highlightRow] ? pts[st.highlightRow] : pts[0];
    const liveEq = curStep.eqTemplate
      .replace('{ID}', activeRow.id)
      .replace('{X}', activeRow.ent.toFixed(2))
      .replace('{Y}', String(activeRow.spoof));

    const switcherHtml = allowSwitcher ? (
      '<div class="flex flex-wrap gap-1.5 pb-3 border-b border-[var(--border)]">' +
        Object.keys(BUILDERS).map(k => (
          '<button type="button" onclick="window.StatsAndVisuals.selectDeckVisual(\'' + k + '\')" class="px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (k === builderKey ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]') + '">' +
            esc(BUILDERS[k].title.split('(')[0]) +
          '</button>'
        )).join('') +
      '</div>'
    ) : '';

    // Linked table rows (hover/click syncs canvas + live equation!)
    const rowsHtml = pts.slice(0, 5).map((r, rIdx) => {
      const isHi = st.highlightRow === rIdx;
      return (
        '<tr id="v10-vb-row-' + contextId + '-' + rIdx + '" ' +
            'onmouseenter="window.StatsAndVisuals.hoverRow(\'' + contextId + '\', ' + rIdx + ')" ' +
            'onclick="window.StatsAndVisuals.hoverRow(\'' + contextId + '\', ' + rIdx + ')" ' +
            'class="border-t border-[var(--border)] cursor-pointer transition ' + (isHi ? 'bg-amber-500/20 text-amber-200 font-bold' : 'hover:bg-slate-800/60') + '">' +
          '<td class="p-2 font-mono">' + r.id + '</td>' +
          '<td class="p-2 font-mono">' + r.ent.toFixed(2) + '</td>' +
          '<td class="p-2 font-mono">' + r.spoof + '</td>' +
          '<td class="p-2 font-mono ' + (r.y ? 'text-rose-400' : 'text-emerald-400') + '">' + (r.y ? 'PHISH (1)' : 'SAFE (0)') + ' • p=' + r.pA.toFixed(2) + '</td>' +
        '</tr>'
      );
    }).join('');

    const predictAnswered = st.predictAnswer !== null;
    const predictCorrect = st.predictAnswer === b.predictAns;

    return (
      '<div id="v10-vb-wrap-' + contextId + '" tabindex="0" ' +
           'onkeydown="window.StatsAndVisuals.handleKey(\'' + contextId + '\', event)" ' +
           'aria-label="' + esc(b.title) + '. Press Left/Right arrows to step, Space to play/pause, R to replay." ' +
           'class="p-4 sm:p-5 rounded-2xl bg-[var(--content)] border-2 border-sky-500/45 space-y-3.5 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400">' +
        switcherHtml +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<div>' +
            '<div class="text-xs font-bold uppercase tracking-wider text-sky-400">🎨 Step-Through Visual Construction (Built Frame by Frame)</div>' +
            '<h4 class="text-sm sm:text-base font-extrabold text-[var(--foreground)]">' + esc(b.title) + '</h4>' +
            '<p class="text-xs text-[var(--muted-foreground)]">' + esc(b.subtitle) + '</p>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-1.5">' +
            '<button type="button" onclick="window.StatsAndVisuals.stepVb(\'' + contextId + '\', -1)" ' + (stepIdx === 0 ? 'disabled' : '') + ' class="px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-bold disabled:opacity-40 cursor-pointer">◀ Prev</button>' +
            '<span class="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/40 text-xs font-mono font-bold text-sky-300">Step ' + (stepIdx + 1) + '/' + b.steps.length + '</span>' +
            '<button type="button" onclick="window.StatsAndVisuals.stepVb(\'' + contextId + '\', 1)" ' + (stepIdx === b.steps.length - 1 ? 'disabled' : '') + ' class="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 text-xs font-extrabold disabled:opacity-40 cursor-pointer">Next ▶</button>' +
            '<button type="button" onclick="window.StatsAndVisuals.togglePlayVb(\'' + contextId + '\')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer">' + (st.playing ? '⏸ Pause' : '▶ Auto-Play') + '</button>' +
            '<button type="button" onclick="window.StatsAndVisuals.toggleSlowVb(\'' + contextId + '\')" class="px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ' + (st.slowMode ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-[var(--card)] border-[var(--border)]') + '">🐢 Slow Mode</button>' +
            '<button type="button" onclick="window.StatsAndVisuals.replayVb(\'' + contextId + '\')" class="px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-bold cursor-pointer">↺ Replay</button>' +
          '</div>' +
        '</div>' +

        '<!-- D. PREDICT THEN REVEAL -->' +
        '<div id="v10-vb-predict-' + contextId + '" class="p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2 text-xs">' +
          '<div class="font-bold text-amber-300">🔮 Predict First, Then Build: ' + esc(b.predictQ) + '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-3 gap-2">' +
            b.predictOpts.map((opt, oIdx) => {
              const chosen = st.predictAnswer === oIdx;
              const cls = predictAnswered
                ? (oIdx === b.predictAns ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold' : chosen ? 'bg-rose-500/25 border-rose-400 text-rose-200' : 'bg-[var(--card)] border-[var(--border)] opacity-60')
                : 'bg-[var(--card)] border-[var(--border)] hover:border-amber-400 cursor-pointer';
              return '<button type="button" onclick="window.StatsAndVisuals.answerPredict(\'' + contextId + '\', ' + oIdx + ')" class="p-2 rounded-lg border text-left transition ' + cls + '">' + esc(opt) + '</button>';
            }).join('') +
          '</div>' +
          (predictAnswered ? '<div class="font-bold ' + (predictCorrect ? 'text-emerald-300' : 'text-amber-300') + '">' + (predictCorrect ? '✅ Exact prediction! Now step through Next ▶ to watch the canvas build it!' : '💡 Good guess — step through Next ▶ to see why Option B happens!') + '</div>' : '') +
        '</div>' +

        '<!-- B. LINKED VIEWS: CANVAS + LIVE ROW TABLE -->' +
        '<div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">' +
          '<div class="lg:col-span-7 space-y-2">' +
            '<canvas id="v10-vb-canvas-' + contextId + '" width="640" height="290" role="img" onclick="window.StatsAndVisuals.canvasClick(\'' + contextId + '\', event)" aria-label="' + esc(curStep.label + ': ' + curStep.desc) + '" class="w-full rounded-xl border border-[var(--border)] bg-slate-950 cursor-crosshair"></canvas>' +
            (builderKey === 'svm' ? (
              '<div class="flex items-center gap-2 text-xs">' +
                '<button type="button" onclick="window.StatsAndVisuals.setSvmC(\'' + contextId + '\', 0.2)" class="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold cursor-pointer">Soft Wide Street (C=0.2)</button>' +
                '<button type="button" onclick="window.StatsAndVisuals.setSvmC(\'' + contextId + '\', 50)" class="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold cursor-pointer">Hard Narrow Street (C=50)</button>' +
              '</div>'
            ) : '') +
          '</div>' +
          '<div class="lg:col-span-5 space-y-2">' +
            '<div class="text-xs font-bold text-amber-300">🔗 Hover/Click Any Row Below to Highlight Its Point &amp; Equation!</div>' +
            '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">' +
              '<table class="w-full text-left text-xs border-collapse">' +
                '<thead class="bg-slate-900/60 text-[var(--muted-foreground)] uppercase"><tr><th class="p-2">URL</th><th class="p-2">Ent</th><th class="p-2">Spoof</th><th class="p-2">Label &amp; p</th></tr></thead>' +
                '<tbody>' + rowsHtml + '</tbody>' +
              '</table>' +
            '</div>' +
            '<div id="v10-vb-eq-' + contextId + '" class="p-2.5 rounded-xl bg-slate-950 border border-sky-500/40 font-mono text-xs text-sky-300">' +
              '<div class="text-[11px] text-amber-300 font-bold font-sans mb-0.5">' + esc(curStep.label) + '</div>' +
              '<div id="v10-vb-eq-live-' + contextId + '">' + esc(liveEq) + '</div>' +
              '<div class="font-sans text-[11px] text-[var(--foreground)] mt-1">' + esc(curStep.desc) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<!-- C. VISUAL READING GUIDE -->' +
        '<div id="v10-vb-guide-' + contextId + '" class="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">' +
          '<div><strong class="text-sky-400">📐 Visual Reading Guide • Axes:</strong> ' + esc(b.readingGuide.axes) + '</div>' +
          '<div><strong class="text-emerald-400">✅ Good vs ❌ Bad Shape:</strong> ' + esc(b.readingGuide.shape) + '</div>' +
          '<div><strong class="text-amber-400">🔄 What Makes It Change:</strong> ' + esc(b.readingGuide.change) + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // ============================================================================
  // MASTER TOP TRACK DECK RENDERER (#v10-stats-testing-visual-deck)
  // ============================================================================
  function renderMasterStatsDeck() {
    const acad = detectAcad();
    if (acad !== 'ml' && acad !== 'll') return;
    const v9Deck = document.getElementById('v9-beginner-master-deck');
    const currSec = document.getElementById('view-curriculum');
    if (!currSec) return;

    let deck = document.getElementById('v10-stats-testing-visual-deck');
    if (!deck) {
      deck = document.createElement('div');
      deck.id = 'v10-stats-testing-visual-deck';
      deck.className = 'space-y-3 my-3';
      if (v9Deck && v9Deck.parentNode) {
        v9Deck.parentNode.insertBefore(deck, v9Deck.nextSibling);
      } else {
        currSec.insertBefore(deck, currSec.firstChild);
      }
    }

    const btn = (id, icon, title, sub, col) => {
      const act = state.openTrack === id;
      return '<button type="button" onclick="window.StatsAndVisuals.toggleTrack(\'' + id + '\')" class="p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ' +
        (act ? 'bg-sky-500/20 border-sky-400 shadow-md' : 'bg-[var(--card)] border-[var(--border)] hover:border-amber-400/50') + '">' +
        '<div class="min-w-0">' +
          '<div class="text-xs font-extrabold text-' + col + '-400 flex items-center gap-1.5"><span>' + icon + '</span><span>' + esc(title) + '</span></div>' +
          '<div class="text-[11px] text-[var(--muted-foreground)] truncate mt-0.5">' + esc(sub) + '</div>' +
        '</div>' +
        '<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--content)] border border-[var(--border)]">' + (act ? '▲ Hide' : '▼ Open') + '</span>' +
      '</button>';
    };

    let panelHtml = '';
    if (state.openTrack === 'stats') {
      panelHtml =
        '<div id="v10-panel-stats-track" class="p-4 sm:p-5 rounded-2xl bg-[var(--card)] border-2 border-emerald-500/45 space-y-4 shadow-xl">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<div>' +
              '<span class="text-xs font-bold uppercase tracking-wider text-emerald-400">📊 Pre-Level 0 Track A • Statistics for Machine Learning</span>' +
              '<h3 class="text-base sm:text-lg font-extrabold text-[var(--foreground)]">Is 94.6% Really Better Than 94.1%? Build Intuition on 5 Running URLs!</h3>' +
            '</div>' +
            '<div class="flex flex-wrap gap-1.5">' +
              STATS_META.map(m => '<button type="button" onclick="window.StatsAndVisuals.selectStat(\'' + m.id + '\')" class="px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (state.activeStatId === m.id ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--content)] border-[var(--border)]') + '">' + esc(m.title) + '</button>').join('') +
            '</div>' +
          '</div>' +
          renderStatLessonBody(state.activeStatId) +
        '</div>';
    } else if (state.openTrack === 'testing') {
      panelHtml =
        '<div id="v10-panel-testing-track" class="p-4 sm:p-5 rounded-2xl bg-[var(--card)] border-2 border-amber-500/45 space-y-4 shadow-xl">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<div>' +
              '<span class="text-xs font-bold uppercase tracking-wider text-amber-400">🧪 Track B • How to Test a Model Properly (Zero Self-Deception)</span>' +
              '<h3 class="text-base sm:text-lg font-extrabold text-[var(--foreground)]">Leakage, 5-Fold ± Typical Spread, 1,000× Bootstrap CI, Permutation Test, Threshold Cost &amp; Imbalance</h3>' +
            '</div>' +
            '<div class="flex flex-wrap gap-1.5">' +
              TESTING_META.map(m => '<button type="button" onclick="window.StatsAndVisuals.selectTest(\'' + m.id + '\')" class="px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (state.activeTestId === m.id ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-[var(--content)] border-[var(--border)]') + '">' + esc(m.title) + '</button>').join('') +
            '</div>' +
          '</div>' +
          renderTestingLessonBody(state.activeTestId) +
        '</div>';
    } else if (state.openTrack === 'visuals') {
      panelHtml =
        '<div id="v10-panel-visual-builders" class="space-y-3">' +
          renderVisualBuilderWidget('deck', state.activeVisualKey, true) +
        '</div>';
    }

    deck.innerHTML =
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">' +
        btn('stats', '📊', 'Track A: Statistics for ML (6 Interactive Labs)', 'Mean/Typical Spread • Skew • Conditional Prob • Bayes Base Rate • Random Splits • Correlation', 'emerald') +
        btn('testing', '🧪', 'Track B: How to Test a Model Properly (10 Labs)', 'Splits • Leakage • 5-Fold ± Typical Spread • Bootstrap CI • Permutation Test • Threshold Cost', 'amber') +
        btn('visuals', '🎨', 'Track C: Step-Through Visual Builders (All 10)', 'Build Decision Trees, RF, Boosting, ROC/PR, GD, Sigmoid, K-Means, SVM & PCA', 'sky') +
      '</div>' +
      panelHtml;

    if (state.openTrack === 'visuals') {
      drawVisualBuilderCanvas('deck');
    }
  }

  // ============================================================================
  // PER-MODULE MOUNTING IN PART 1 (STATISTICAL REASONING) & PART 2 (VISUAL BUILDER)
  // ============================================================================
  function getModuleMapping(modId) {
    const acad = detectAcad();
    const map = acad === 'll' ? LL_MOD_MAP : ML_MOD_MAP;
    return map[modId] || { vb: 'loss_gd', stat: 'train_val_test' };
  }

  function mountModuleV10(modId) {
    const acad = detectAcad();
    if (acad !== 'ml' && acad !== 'll') return;
    renderMasterStatsDeck();

    const activeId = modId || (global.appState && global.appState.activeModuleId) || 'mod0';
    const mapping = getModuleMapping(activeId);

    // 1. Part 1 Statistical Trust & Hand-Worked Card
    const part0 = document.getElementById(acad === 'll' ? 'v8-ll-part-0' : 'v8-ml-part-0');
    if (part0) {
      const oldStat = document.getElementById('v10-module-stat-trust-' + activeId);
      if (oldStat) oldStat.remove();

      const statMeta = STATS_META.find(x => x.id === mapping.stat);
      const testMeta = TESTING_META.find(x => x.id === mapping.stat);
      const isStat = Boolean(statMeta);
      const heading = statMeta ? ('📊 Linked Statistics Companion: ' + statMeta.title) : ('🧪 Linked Proper Testing Companion: ' + (testMeta ? testMeta.title : 'Train / Val / Test'));

      const card = document.createElement('section');
      card.id = 'v10-module-stat-trust-' + activeId;
      card.className = 'p-4 rounded-2xl bg-[var(--card)] border border-emerald-500/40 space-y-3 my-4';
      card.innerHTML =
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<div>' +
            '<span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Statistical Trust &amp; Hand-Worked Check (Running 5-URL Dataset)</span>' +
            '<h4 class="text-sm sm:text-base font-extrabold text-[var(--foreground)]">' + esc(heading) + '</h4>' +
          '</div>' +
          '<button type="button" onclick="window.StatsAndVisuals.openTrackTopic(\'' + (isStat ? 'stats' : 'testing') + '\', \'' + mapping.stat + '\')" class="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold cursor-pointer">Open Full Track Deck ↑</button>' +
        '</div>' +
        (isStat ? renderStatLessonBody(mapping.stat) : renderTestingLessonBody(mapping.stat || 'train_val_test'));

      const v9El = document.getElementById('v9-seven-block-template-' + activeId);
      if (v9El && v9El.parentNode === part0) {
        part0.insertBefore(card, v9El.nextSibling);
      } else {
        part0.appendChild(card);
      }
    }

    // 2. Part 2 Step-Through Visual Construction Builder
    const part1 = document.getElementById(acad === 'll' ? 'v8-ll-part-1' : 'v8-ml-part-1');
    if (part1) {
      const ctxId = 'mod_' + activeId;
      const oldVb = document.getElementById('v10-module-visual-builder-' + activeId);
      if (oldVb) oldVb.remove();

      const wrap = document.createElement('section');
      wrap.id = 'v10-module-visual-builder-' + activeId;
      wrap.className = 'my-4';
      wrap.innerHTML = renderVisualBuilderWidget(ctxId, mapping.vb, false);
      part1.insertBefore(wrap, part1.firstChild);
      setTimeout(function () { drawVisualBuilderCanvas(ctxId); }, 15);
    }
  }

  function refreshVbWidget(contextId) {
    const st = getVbState(contextId);
    const wrap = document.getElementById('v10-vb-wrap-' + contextId);
    if (wrap) {
      const tmp = document.createElement('div');
      tmp.innerHTML = renderVisualBuilderWidget(contextId, st.builderKey, contextId === 'deck');
      if (tmp.firstElementChild) {
        wrap.replaceWith(tmp.firstElementChild);
        drawVisualBuilderCanvas(contextId);
      }
    }
  }

  function stepVb(contextId, delta) {
    const st = getVbState(contextId);
    const b = BUILDERS[st.builderKey] || BUILDERS.decision_tree;
    st.stepIdx = Math.max(0, Math.min(b.steps.length - 1, st.stepIdx + delta));
    refreshVbWidget(contextId);
  }

  function togglePlayVb(contextId) {
    const st = getVbState(contextId);
    if (prefersReducedMotion && !st.playing) {
      stepVb(contextId, 1);
      return;
    }
    st.playing = !st.playing;
    if (st.timerId) { clearInterval(st.timerId); st.timerId = null; }
    if (st.playing) {
      const delay = st.slowMode ? 1900 : 950;
      st.timerId = setInterval(function () {
        const b = BUILDERS[st.builderKey];
        if (st.stepIdx >= b.steps.length - 1) {
          st.playing = false;
          clearInterval(st.timerId);
          st.timerId = null;
          refreshVbWidget(contextId);
        } else {
          st.stepIdx += 1;
          refreshVbWidget(contextId);
        }
      }, delay);
    }
    refreshVbWidget(contextId);
  }

  function bootStatsAndVisuals() {
    const acad = detectAcad();
    if (acad !== 'ml' && acad !== 'll') return;

    if (global.AcademyCore && typeof global.AcademyCore.enhanceRenderedModule === 'function' && !global.AcademyCore.enhanceRenderedModule._v10Wrapped) {
      const origEnhance = global.AcademyCore.enhanceRenderedModule;
      const wrapped = function (modId) {
        const res = origEnhance.apply(this, arguments);
        mountModuleV10(modId);
        return res;
      };
      wrapped._v10Wrapped = true;
      global.AcademyCore.enhanceRenderedModule = wrapped;
    }

    // Re-draw visible Part 2 canvases when user clicks part buttons
    document.addEventListener('click', function () {
      Object.keys(state.vbState).forEach(function (cid) {
        drawVisualBuilderCanvas(cid);
      });
    }, true);

    const activeId = (global.appState && global.appState.activeModuleId) || 'mod0';
    mountModuleV10(activeId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootStatsAndVisuals);
  } else {
    setTimeout(bootStatsAndVisuals, 0);
  }

  function refreshActiveModuleStatCard() {
    const activeId = (global.appState && global.appState.activeModuleId) || 'mod0';
    mountModuleV10(activeId);
  }

  global.StatsAndVisuals = {
    version: '10.0',
    toggleTrack: function (t) { state.openTrack = state.openTrack === t ? null : t; renderMasterStatsDeck(); },
    openTrackTopic: function (track, topicId) {
      state.openTrack = track;
      if (track === 'stats') state.activeStatId = topicId;
      else if (track === 'testing') state.activeTestId = topicId;
      renderMasterStatsDeck();
      const el = document.getElementById('v10-stats-testing-visual-deck');
      if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    },
    selectStat: function (id) { state.activeStatId = id; renderMasterStatsDeck(); },
    selectTest: function (id) { state.activeTestId = id; renderMasterStatsDeck(); },
    selectDeckVisual: function (k) { state.activeVisualKey = k; renderMasterStatsDeck(); },

    // Track A & B interactive setters
    setStatSpread: function (m) { state.statSpreadMode = m; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    toggleDistTransform: function () { state.distTransformed = !state.distTransformed; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setProbFilter: function (f) { state.probClueFilter = f; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setBayesBase: function (r) { state.bayesBaseRate = r; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setSplitSeed: function (s) { state.splitSeed = s; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setCorrPair: function (p) { state.corrFeaturePair = p; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },

    setSplitMode: function (m) { state.splitMode = m; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    toggleLeakPurge: function () { state.leakPurged = !state.leakPurged; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setCvModel: function (c) { state.cvModelChoice = c; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    runBootstrap1000: function () {
      state.bootCountRuns += 1;
      const scores = [];
      const base = [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1]; // 28/30 = 93.3%
      for (let r = 0; r < 1000; r++) {
        let hit = 0;
        for (let i = 0; i < 30; i++) hit += base[Math.floor(Math.random() * 30)];
        scores.push((hit / 30) * 100);
      }
      scores.sort((a, b) => a - b);
      const bins = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      scores.forEach(s => {
        const bIdx = Math.max(0, Math.min(8, Math.floor((s - 88) / 1.5)));
        bins[bIdx] += 1;
      });
      state.bootResamples = { low: scores[25], med: scores[500], high: scores[975], bins: bins };
      renderMasterStatsDeck(); refreshActiveModuleStatCard();
    },
    runPermutation1000: function () {
      state.permRuns += 1;
      let asBig = 0;
      for (let i = 0; i < 1000; i++) {
        // Null diffs around 0
        const simDiff = ((Math.random() - 0.5) * 3.0);
        if (Math.abs(simDiff) >= 0.5) asBig++;
      }
      state.permResults = { obsDiff: 0.5, countAsBig: asBig, pVal: asBig / 1000 };
      renderMasterStatsDeck(); refreshActiveModuleStatCard();
    },
    setThreshold: function (val) { state.thresholdTau = parseFloat(val); renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setImbalanceModel: function (m) { state.imbalanceModel = m; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setCalibMode: function (m) { state.calibMode = m; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    setBvFit: function (idx) { state.bvFitIdx = idx; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },
    toggleHonestCheck: function (k) { state.honestChecks[k] = !state.honestChecks[k]; renderMasterStatsDeck(); refreshActiveModuleStatCard(); },

    // Visual Builder interactive setters
    stepVb: stepVb,
    togglePlayVb: togglePlayVb,
    toggleSlowVb: function (cid) { const st = getVbState(cid); st.slowMode = !st.slowMode; refreshVbWidget(cid); },
    replayVb: function (cid) {
      const st = getVbState(cid);
      if (st.timerId) { clearInterval(st.timerId); st.timerId = null; }
      st.playing = false;
      st.stepIdx = 0;
      refreshVbWidget(cid);
    },
    hoverRow: function (cid, rIdx) {
      const st = getVbState(cid);
      if (st.highlightRow === rIdx) return;
      st.highlightRow = rIdx;
      for (let i = 0; i < 5; i++) {
        const rowEl = document.getElementById('v10-vb-row-' + cid + '-' + i);
        if (rowEl) {
          rowEl.className = 'border-t border-[var(--border)] cursor-pointer transition ' +
            (i === rIdx ? 'bg-amber-500/20 text-amber-200 font-bold' : 'hover:bg-slate-800/60');
        }
      }
      const eqLive = document.getElementById('v10-vb-eq-live-' + cid);
      if (eqLive) {
        const b = BUILDERS[st.builderKey] || BUILDERS.decision_tree;
        const curStep = b.steps[Math.max(0, Math.min(b.steps.length - 1, st.stepIdx))];
        const pts = getCanvasPts();
        const activeRow = pts[rIdx] || pts[0];
        eqLive.textContent = curStep.eqTemplate
          .replace('{ID}', activeRow.id)
          .replace('{X}', activeRow.ent.toFixed(2))
          .replace('{Y}', String(activeRow.spoof));
      }
      drawVisualBuilderCanvas(cid);
    },
    canvasClick: function (cid, ev) {
      const canvas = document.getElementById('v10-vb-canvas-' + cid);
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const relX = Math.max(0, Math.min(0.999, (ev.clientX - rect.left) / (rect.width || 1)));
      const rowIdx = Math.min(4, Math.floor(relX * 5));
      global.StatsAndVisuals.hoverRow(cid, rowIdx);
    },
    answerPredict: function (cid, oIdx) {
      const st = getVbState(cid);
      st.predictAnswer = oIdx;
      refreshVbWidget(cid);
    },
    setSvmC: function (cid, cVal) {
      const st = getVbState(cid);
      st.svmC = cVal;
      st.stepIdx = 3;
      refreshVbWidget(cid);
    },
    handleKey: function (cid, ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); stepVb(cid, 1); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); stepVb(cid, -1); }
      else if (ev.key === ' ') { ev.preventDefault(); togglePlayVb(cid); }
      else if (ev.key === 'r' || ev.key === 'R') { ev.preventDefault(); global.StatsAndVisuals.replayVb(cid); }
    },
    mountModuleV10: mountModuleV10,
    BUILDERS: BUILDERS
  };
})(window);

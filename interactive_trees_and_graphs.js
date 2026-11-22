
/* =====================================================================
   INTERACTIVE TREES & GRAPHS ENGINE (100% Client-Side Canvas)
   Zero external dependencies. Works 100% offline.
   ===================================================================== */

(function() {
  window.InteractiveStudios = window.InteractiveStudios || {};

  /* -------------------------------------------------------------------
     1. STUDENT-T DISTRIBUTION & P-VALUE HELPER FUNCTIONS
     ------------------------------------------------------------------- */
  function gammaLn(z) {
    const g = 7;
    const c = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.138571095836526, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - gammaLn(1 - z);
    z -= 1;
    let base = c[0];
    for (let i = 1; i < g + 2; i++) base += c[i] / (z + i);
    const t = z + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(base);
  }

  function betainc(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(gammaLn(a + b) - gammaLn(a) - gammaLn(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) {
      return bt * betacf(x, a, b) / a;
    } else {
      return 1 - bt * betacf(1 - x, b, a) / b;
    }
  }

  function betacf(x, a, b) {
    const maxIt = 100, eps = 1e-12;
    const qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < eps) d = eps;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= maxIt; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < eps) d = eps;
      c = 1 + aa / c;
      if (Math.abs(c) < eps) c = eps;
      d = 1 / d;
      h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < eps) d = eps;
      c = 1 + aa / c;
      if (Math.abs(c) < eps) c = eps;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < eps) break;
    }
    return h;
  }

  function studentTPdf(t, df) {
    const num = Math.exp(gammaLn((df + 1) / 2) - gammaLn(df / 2));
    const denom = Math.sqrt(df * Math.PI) * Math.pow(1 + (t * t) / df, (df + 1) / 2);
    return num / denom;
  }

  function studentTCdf(t, df) {
    const x = (t + Math.sqrt(t * t + df)) / (2 * Math.sqrt(t * t + df));
    return betainc(x, df / 2, df / 2);
  }

  function calculatePValue(tStat, df) {
    if (isNaN(tStat) || !isFinite(tStat)) return 1.0;
    const absT = Math.abs(tStat);
    const cdf = studentTCdf(absT, df);
    const pVal = 2 * (1 - cdf);
    return Math.max(0.000001, Math.min(1.0, pVal));
  }

  /* -------------------------------------------------------------------
     2. ML INTERACTIVE DECISION TREE STUDIO
     Real-World: Credit Underwriting & Automated Loan Decisioning
     ------------------------------------------------------------------- */
  window.InteractiveStudios.mlTree = {
    state: {
      fico: 665,
      dti: 38,
      income: 68,
      loan: 25,
      alpha: 0.00
    },

    setPreset: function(presetKey) {
      if (presetKey === 'prime') {
        this.state = { fico: 785, dti: 18, income: 125, loan: 20, alpha: 0.00 };
      } else if (presetKey === 'near_prime') {
        this.state = { fico: 665, dti: 38, income: 68, loan: 25, alpha: 0.00 };
      } else if (presetKey === 'subprime') {
        this.state = { fico: 540, dti: 54, income: 32, loan: 15, alpha: 0.00 };
      } else if (presetKey === 'jumbo_stress') {
        this.state = { fico: 710, dti: 44, income: 110, loan: 75, alpha: 0.00 };
      }
      this.syncUI();
      this.render();
    },

    syncUI: function() {
      ['fico', 'dti', 'income', 'loan', 'alpha'].forEach(k => {
        const input = document.getElementById('ml-tree-input-' + k);
        const valSpan = document.getElementById('ml-tree-val-' + k);
        if (input) input.value = this.state[k];
        if (valSpan) {
          if (k === 'dti') valSpan.textContent = this.state[k] + '%';
          else if (k === 'income' || k === 'loan') valSpan.textContent = '$' + this.state[k] + 'k';
          else if (k === 'alpha') valSpan.textContent = this.state[k].toFixed(2);
          else valSpan.textContent = this.state[k];
        }
      });
    },

    onSliderChange: function(key, val) {
      this.state[key] = parseFloat(val);
      const valSpan = document.getElementById('ml-tree-val-' + key);
      if (valSpan) {
        if (key === 'dti') valSpan.textContent = this.state[key] + '%';
        else if (key === 'income' || key === 'loan') valSpan.textContent = '$' + this.state[key] + 'k';
        else if (key === 'alpha') valSpan.textContent = this.state[key].toFixed(2);
        else valSpan.textContent = this.state[key];
      }
      this.render();
    },

    render: function() {
      const canvas = document.getElementById('canvas-ml-interactive-tree');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(1, '#050811');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const st = this.state;
      const alpha = st.alpha;

      // Logic rules
      const rootCond = st.dti <= 36;
      const n1Cond = st.fico >= 670;
      const n2Cond = st.income >= 80;

      const pruneRight = alpha >= 0.12;
      const pruneLeft = alpha >= 0.20;

      const rootX = w * 0.5, rootY = 60;
      const n1X = w * 0.25, n1Y = 160;
      const n2X = w * 0.75, n2Y = 160;

      const leafAX = w * 0.13, leafAY = 270;
      const leafBX = w * 0.37, leafBY = 270;
      const leafCX = w * 0.63, leafCY = 270;
      const leafDX = w * 0.87, leafDY = 270;

      const isPathN1 = rootCond;
      const isPathN2 = !rootCond;
      const isPathLeafA = isPathN1 && n1Cond && !pruneLeft;
      const isPathLeafB = isPathN1 && !n1Cond && !pruneLeft;
      const isPathLeafC = isPathN2 && n2Cond && !pruneRight;
      const isPathLeafD = isPathN2 && !n2Cond && !pruneRight;

      function drawBranch(x1, y1, x2, y2, isActive, label) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1, (y1 + y2) / 2, x2, (y1 + y2) / 2, x2, y2);
        if (isActive) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.restore();

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 4;
        ctx.fillStyle = isActive ? '#38bdf8' : '#64748b';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, midX, midY);
      }

      drawBranch(rootX, rootY + 22, n1X, n1Y - 22, isPathN1, 'YES (DTI ≤ 36%)');
      drawBranch(rootX, rootY + 22, n2X, n2Y - 22, isPathN2, 'NO (DTI > 36%)');

      if (!pruneLeft) {
        drawBranch(n1X, n1Y + 22, leafAX, leafAY - 22, isPathLeafA, 'YES (FICO ≥ 670)');
        drawBranch(n1X, n1Y + 22, leafBX, leafBY - 22, isPathLeafB, 'NO (FICO < 670)');
      }

      if (!pruneRight) {
        drawBranch(n2X, n2Y + 22, leafCX, leafCY - 22, isPathLeafC, 'YES (Income ≥ $80k)');
        drawBranch(n2X, n2Y + 22, leafDX, leafDY - 22, isPathLeafD, 'NO (Income < $80k)');
      }

      function drawNode(x, y, title, subtitle, gini, samples, isActive, isLeaf, leafVerdict) {
        const nw = isLeaf ? 150 : 160;
        const nh = 54;
        const nx = x - nw / 2;
        const ny = y - nh / 2;

        ctx.save();
        if (isActive) {
          ctx.shadowColor = isLeaf ? (leafVerdict.approved ? '#34d399' : '#f87171') : '#38bdf8';
          ctx.shadowBlur = 16;
        }

        const grad = ctx.createLinearGradient(nx, ny, nx, ny + nh);
        if (isActive) {
          if (isLeaf) {
            grad.addColorStop(0, leafVerdict.approved ? '#064e3b' : '#7f1d1d');
            grad.addColorStop(1, '#0f172a');
          } else {
            grad.addColorStop(0, '#0c4a6e');
            grad.addColorStop(1, '#0f172a');
          }
        } else {
          grad.addColorStop(0, '#1e293b');
          grad.addColorStop(1, '#0f172a');
        }
        ctx.fillStyle = grad;
        ctx.strokeStyle = isActive ? (isLeaf ? (leafVerdict.approved ? '#34d399' : '#f87171') : '#38bdf8') : '#334155';
        ctx.lineWidth = isActive ? 2.5 : 1.2;

        ctx.beginPath();
        ctx.roundRect(nx, ny, nw, nh, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = isActive ? '#ffffff' : '#94a3b8';
        ctx.fillText(title, x, y - 13);

        ctx.font = '10px monospace';
        ctx.fillStyle = isActive ? (isLeaf ? '#fcd34d' : '#38bdf8') : '#64748b';
        ctx.fillText(subtitle, x, y);

        ctx.font = '9px system-ui, sans-serif';
        ctx.fillStyle = '#a1a1aa';
        ctx.fillText(`Gini: ${gini} | N = ${samples}`, x, y + 14);
      }

      drawNode(rootX, rootY, 'Root Split: DTI Ratio', `Input DTI = ${st.dti}%`, '0.485', '1,000', true, false);

      if (pruneLeft) {
        drawNode(n1X, n1Y, 'Pruned Node: Low DTI', 'Approved (Tier 2 Blend)', '0.180', '580', isPathN1, true, { approved: true });
      } else {
        drawNode(n1X, n1Y, 'Split 1: Credit Score', `Input FICO = ${st.fico}`, '0.240', '580', isPathN1, false);
      }

      if (pruneRight) {
        drawNode(n2X, n2Y, 'Pruned Node: High DTI', 'Denied (Debt Ceiling)', '0.080', '420', isPathN2, true, { approved: false });
      } else {
        drawNode(n2X, n2Y, 'Split 2: Annual Income', `Input Inc = $${st.income}k`, '0.360', '420', isPathN2, false);
      }

      if (!pruneLeft) {
        drawNode(leafAX, leafAY, 'Leaf A: Tier 1 Prime', '✅ Approved (4.5% APR)', '0.040', '410', isPathLeafA, true, { approved: true });
        drawNode(leafBX, leafBY, 'Leaf B: Manual Review', '⚠️ Conditional (6.8% APR)', '0.290', '170', isPathLeafB, true, { approved: true });
      }

      if (!pruneRight) {
        drawNode(leafCX, leafCY, 'Leaf C: Asset Collateral', '⚠️ Approved w/ Liens', '0.140', '120', isPathLeafC, true, { approved: true });
        drawNode(leafDX, leafDY, 'Leaf D: Risk Critical', '❌ Denied (High Risk)', '0.020', '300', isPathLeafD, true, { approved: false });
      }

      this.updateDecisionTrace(rootCond, n1Cond, n2Cond, pruneLeft, pruneRight);
    },

    updateDecisionTrace: function(rootCond, n1Cond, n2Cond, pruneLeft, pruneRight) {
      const traceEl = document.getElementById('ml-tree-trace-steps');
      const badgeEl = document.getElementById('ml-tree-verdict-badge');
      if (!traceEl || !badgeEl) return;

      const st = this.state;
      const steps = [];

      if (rootCond) {
        steps.push(`1. <strong>Root Question (DTI ≤ 36%):</strong> Borrower DTI is <strong>${st.dti}%</strong> ≤ 36% ➔ <span class="text-sky-400 font-bold">Passed! Moving Left (Low Debt Burden)</span>.`);
        if (pruneLeft) {
          steps.push(`2. <strong>Pruning Cutoff (α = ${st.alpha.toFixed(2)}):</strong> Left branch sub-splits collapsed into parent leaf ➔ <span class="text-emerald-400 font-bold">Standard Tier 2 Approval</span>.`);
          badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✅ APPROVED (Standard Tier 2 - Pruned Leaf)</span>`;
        } else {
          if (n1Cond) {
            steps.push(`2. <strong>Split 1 (FICO ≥ 670):</strong> Borrower FICO is <strong>${st.fico}</strong> ≥ 670 ➔ <span class="text-emerald-400 font-bold">Passed! Moving to Leaf A</span>.`);
            steps.push(`3. <strong>Final Leaf Reached: Leaf A:</strong> Gini Impurity = 0.040, 96% Historical Repayment ➔ <span class="text-emerald-400 font-bold">TIER 1 PRIME APPROVAL (Lowest Interest 4.5%)</span>.`);
            badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✅ APPROVED (Tier 1 Prime - 4.5% APR)</span>`;
          } else {
            steps.push(`2. <strong>Split 1 (FICO ≥ 670):</strong> Borrower FICO is <strong>${st.fico}</strong> < 670 ➔ <span class="text-amber-400 font-bold">Sub-threshold! Moving to Leaf B</span>.`);
            steps.push(`3. <strong>Final Leaf Reached: Leaf B:</strong> Gini Impurity = 0.290 ➔ <span class="text-amber-400 font-bold">CONDITIONAL APPROVAL (Requires Paystub Verification & 6.8% APR)</span>.`);
            badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">⚠️ CONDITIONAL (Tier 2 Review - 6.8% APR)</span>`;
          }
        }
      } else {
        steps.push(`1. <strong>Root Question (DTI ≤ 36%):</strong> Borrower DTI is <strong>${st.dti}%</strong> > 36% ➔ <span class="text-rose-400 font-bold">Warning: Elevated Debt Ratio! Moving Right</span>.`);
        if (pruneRight) {
          steps.push(`2. <strong>Pruning Cutoff (α = ${st.alpha.toFixed(2)}):</strong> High-DTI sub-splits collapsed into parent leaf ➔ <span class="text-rose-400 font-bold">Policy Denied (Over-Leveraged)</span>.`);
          badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">❌ DENIED (High Debt Pruned Ceiling)</span>`;
        } else {
          if (n2Cond) {
            steps.push(`2. <strong>Split 2 (Annual Income ≥ $80k):</strong> Borrower Income is <strong>$${st.income}k</strong> ≥ $80k ➔ <span class="text-sky-400 font-bold">High Income Offsets DTI! Moving to Leaf C</span>.`);
            steps.push(`3. <strong>Final Leaf Reached: Leaf C:</strong> Gini Impurity = 0.140 ➔ <span class="text-sky-400 font-bold">APPROVED WITH LIEN / COLLATERAL (Secured Asset Required)</span>.`);
            badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">⚠️ APPROVED WITH COLLATERAL (Asset Backed)</span>`;
          } else {
            steps.push(`2. <strong>Split 2 (Annual Income ≥ $80k):</strong> Borrower Income is <strong>$${st.income}k</strong> < $80k ➔ <span class="text-rose-400 font-bold">Insufficient Cash Buffer! Moving to Leaf D</span>.`);
            steps.push(`3. <strong>Final Leaf Reached: Leaf D:</strong> Gini Impurity = 0.020, 98% Default Risk ➔ <span class="text-rose-400 font-bold">DECLINED (Strict Debt Ceiling Breached)</span>.`);
            badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">❌ DECLINED (High Risk Default Factor)</span>`;
          }
        }
      }

      traceEl.innerHTML = steps.map(s => `<li class="p-2 rounded bg-[var(--card)] border border-[var(--border)]">${s}</li>`).join('');
    }
  };

  /* -------------------------------------------------------------------
     3. INTERACTIVE REGRESSION, CORRELATION & P-VALUE STUDIO
     Unified Student Cohort: Study Hours (0-6 hrs) vs Exam Score (40-100 pts)
     ------------------------------------------------------------------- */
  window.InteractiveStudios.pvalueReg = {
    state: {
      slope: 7.50,
      intercept: 52.00,
      noise: 4.50,
      n: 45,
      customPoints: []
    },

    dataset: [],

    init: function() {
      this.generateData();
      this.syncUI();
      this.render();
      this.attachCanvasClick();
    },

    attachCanvasClick: function() {
      const canvas = document.getElementById('canvas-pvalue-reg');
      if (!canvas) return;
      const self = this;
      canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;
        const pad = { left: 60, right: 260, top: 40, bottom: 45 };

        if (clickX >= pad.left && clickX <= canvas.width - pad.right && clickY >= pad.top && clickY <= canvas.height - pad.bottom) {
          const plotW = (canvas.width - pad.left - pad.right);
          const plotH = (canvas.height - pad.top - pad.bottom);
          const minX = 0, maxX = 6.5;
          const minY = 35, maxY = 105;
          const dataX = minX + ((clickX - pad.left) / plotW) * (maxX - minX);
          const dataY = maxY - ((clickY - pad.top) / plotH) * (maxY - minY);
          self.state.customPoints.push({ x: dataX, y: Math.max(0, Math.min(100, dataY)), isCustom: true });
          self.render();
        }
      });
    },

    generateData: function() {
      this.dataset = [];
      const st = this.state;
      // Deterministic pseudo-random seed-like spread so slider drags feel smooth & predictable
      for (let i = 0; i < st.n; i++) {
        const x = 0.4 + (i / Math.max(1, st.n - 1)) * 5.4;
        const u1 = Math.max(0.0001, Math.random());
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const y = Math.max(38, Math.min(100, st.intercept + st.slope * x + z * st.noise));
        this.dataset.push({ x: x, y: y, isCustom: false });
      }
    },

    clearCustomPoints: function() {
      this.state.customPoints = [];
      this.generateData();
      this.render();
    },

    onSliderChange: function(key, val) {
      this.state[key] = parseFloat(val);
      const valSpan = document.getElementById('pvalue-val-' + key);
      if (valSpan) {
        if (key === 'slope' || key === 'intercept' || key === 'noise') valSpan.textContent = this.state[key].toFixed(2);
        else valSpan.textContent = this.state[key];
      }
      this.generateData();
      this.render();
    },

    syncUI: function() {
      ['slope', 'intercept', 'noise', 'n'].forEach(k => {
        const input = document.getElementById('pvalue-input-' + k);
        const valSpan = document.getElementById('pvalue-val-' + k);
        if (input) input.value = this.state[k];
        if (valSpan) {
          if (k === 'slope' || k === 'intercept' || k === 'noise') valSpan.textContent = this.state[k].toFixed(2);
          else valSpan.textContent = this.state[k];
        }
      });
    },

    render: function() {
      const canvas = document.getElementById('canvas-pvalue-reg');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#0a0f1d');
      bg.addColorStop(1, '#050811');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const pad = { left: 60, right: 260, top: 40, bottom: 45 };
      const plotW = w - pad.left - pad.right;
      const plotH = h - pad.top - pad.bottom;

      const allPts = this.dataset.concat(this.state.customPoints);
      const N = allPts.length;

      let sumX = 0, sumY = 0;
      allPts.forEach(p => { sumX += p.x; sumY += p.y; });
      const meanX = sumX / N;
      const meanY = sumY / N;

      let ssXX = 0, ssYY = 0, ssXY = 0;
      allPts.forEach(p => {
        const dx = p.x - meanX;
        const dy = p.y - meanY;
        ssXX += dx * dx;
        ssYY += dy * dy;
        ssXY += dx * dy;
      });

      const b1 = ssXX !== 0 ? ssXY / ssXX : 0;
      const b0 = meanY - b1 * meanX;

      let ssr = 0;
      allPts.forEach(p => {
        const yHat = b0 + b1 * p.x;
        const res = p.y - yHat;
        ssr += res * res;
      });

      const df = Math.max(1, N - 2);
      const mse = ssr / df;
      const seB1 = Math.sqrt(mse / Math.max(0.0001, ssXX));
      const tStat = seB1 > 0 ? b1 / seB1 : 0;
      const pVal = calculatePValue(tStat, df);

      const denom = Math.sqrt(Math.max(0.0001, ssXX * ssYY));
      const pearsonR = denom > 0 ? ssXY / denom : 0;
      const r2 = pearsonR * pearsonR;

      // 1. Draw Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 6; i++) {
        const x = pad.left + (i / 6.5) * plotW;
        ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, h - pad.bottom); ctx.stroke();
      }
      for (let i = 0; i <= 5; i++) {
        const y = pad.top + (i / 5) * plotH;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      }

      const minX = 0, maxX = 6.5;
      const minY = 35, maxY = 105;
      const toPlotX = v => pad.left + ((v - minX) / (maxX - minX)) * plotW;
      const toPlotY = v => h - pad.bottom - ((v - minY) / (maxY - minY)) * plotH;

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Unified Student Cohort: Study Hours (hrs) vs Exam Score (pts)', pad.left + plotW / 2, 22);

      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Study Hours (hrs)  [Click Anywhere Inside Chart to Drop an Extra Student!]', pad.left + plotW / 2, h - 12);

      ctx.save();
      ctx.translate(18, pad.top + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Exam Score (pts)', 0, 0);
      ctx.restore();

      ctx.font = '10px monospace';
      ctx.fillStyle = '#64748b';
      for (let hr = 0; hr <= 6; hr += 1) {
        ctx.fillText(hr + 'h', toPlotX(hr), h - pad.bottom + 14);
      }
      for (let sc = 40; sc <= 100; sc += 15) {
        ctx.fillText(sc.toFixed(0), pad.left - 18, toPlotY(sc) + 3);
      }

      // Residual Lines
      ctx.strokeStyle = '#ef444466';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      allPts.forEach(p => {
        const yHat = b0 + b1 * p.x;
        ctx.beginPath();
        ctx.moveTo(toPlotX(p.x), toPlotY(p.y));
        ctx.lineTo(toPlotX(p.x), toPlotY(Math.max(minY, Math.min(maxY, yHat))));
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // OLS Line
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toPlotX(minX), toPlotY(Math.max(minY, Math.min(maxY, b0 + b1 * minX))));
      ctx.lineTo(toPlotX(maxX), toPlotY(Math.max(minY, Math.min(maxY, b0 + b1 * maxX))));
      ctx.stroke();

      // Scatter Points
      allPts.forEach(p => {
        const cx = toPlotX(p.x);
        const cy = toPlotY(p.y);
        ctx.beginPath();
        ctx.arc(cx, cy, p.isCustom ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = p.isCustom ? '#f59e0b' : '#34d399';
        ctx.fill();
        ctx.strokeStyle = p.isCustom ? '#ffffff' : '#064e3b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Right Panel: Student-t distribution
      const tX0 = w - pad.right + 25;
      const tW = 215;
      const tY0 = pad.top + 30;
      const tH = plotH - 30;

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w - pad.right + 10, pad.top - 10);
      ctx.lineTo(w - pad.right + 10, h - pad.bottom + 20);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Coincidence Bell Curve (${df} leftover pts)`, tX0 + tW / 2, pad.top);

      const minT = -4.5, maxT = 4.5;
      const toTX = val => tX0 + ((val - minT) / (maxT - minT)) * tW;
      const maxPdf = studentTPdf(0, df);
      const toTY = pdfVal => tY0 + tH - (pdfVal / (maxPdf * 1.15)) * tH;

      const absT = Math.abs(tStat);

      ctx.fillStyle = pVal < 0.05 ? '#ef444455' : '#eab30844';
      ctx.beginPath();
      ctx.moveTo(toTX(Math.min(maxT, absT)), toTY(0));
      for (let tv = Math.min(maxT, absT); tv <= maxT; tv += 0.1) {
        ctx.lineTo(toTX(tv), toTY(studentTPdf(tv, df)));
      }
      ctx.lineTo(toTX(maxT), toTY(0));
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(toTX(-maxT), toTY(0));
      for (let tv = -maxT; tv <= Math.max(minT, -absT); tv += 0.1) {
        ctx.lineTo(toTX(tv), toTY(studentTPdf(tv, df)));
      }
      ctx.lineTo(toTX(Math.max(minT, -absT)), toTY(0));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let tv = minT; tv <= maxT; tv += 0.1) {
        const cx = toTX(tv);
        const cy = toTY(studentTPdf(tv, df));
        if (tv === minT) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tX0, tY0 + tH);
      ctx.lineTo(tX0 + tW, tY0 + tH);
      ctx.stroke();

      const clampT = Math.max(minT, Math.min(maxT, tStat));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(toTX(clampT), tY0 + 5);
      ctx.lineTo(toTX(clampT), tY0 + tH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`Score=${tStat.toFixed(2)}`, toTX(clampT), tY0 - 3);

      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.fillText('-3', toTX(-3), tY0 + tH + 12);
      ctx.fillText('0', toTX(0), tY0 + tH + 12);
      ctx.fillText('+3', toTX(3), tY0 + tH + 12);

      this.updateMetricsDOM(b0, b1, pearsonR, r2, seB1, tStat, pVal, df, N);
    },

    updateMetricsDOM: function(b0, b1, r, r2, seB1, tStat, pVal, df, N) {
      const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };

      setTxt('pvalue-metric-slope', (b1 >= 0 ? '+' : '') + b1.toFixed(2) + ' pts/hr');
      setTxt('pvalue-metric-intercept', b0.toFixed(1) + ' pts');
      setTxt('pvalue-metric-r', (r >= 0 ? '+' : '') + r.toFixed(3));
      setTxt('pvalue-metric-r2', r2.toFixed(3) + ` (${(r2 * 100).toFixed(1)}%)`);
      setTxt('pvalue-metric-se', seB1.toFixed(3));
      setTxt('pvalue-metric-t', tStat.toFixed(2));

      const pFmt = pVal < 0.0001 ? '< 0.0001' : pVal.toFixed(4);
      setTxt('pvalue-metric-p', pFmt);

      const badge = document.getElementById('pvalue-significance-badge');
      if (badge) {
        if (pVal < 0.001) {
          badge.className = 'px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
          badge.innerHTML = `⭐ PROVEN EFFECT (Luck ${pFmt} &lt; 0.001) ➔ Study Hours Truly Boost Exam Scores!`;
        } else if (pVal < 0.05) {
          badge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30';
          badge.innerHTML = `✓ REAL PATTERN (Luck = ${pFmt} &lt; 0.05) ➔ Unlikely to be Pure Luck!`;
        } else {
          badge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30';
          badge.innerHTML = `⚠️ MIGHT BE LUCK (Luck = ${pFmt} ≥ 0.05) ➔ Too Noisy or Too Few Students`;
        }
      }
    }
  };

  /* -------------------------------------------------------------------
     4. INTERACTIVE LOGISTIC REGRESSION, LOG-LOSS & CUTOFF STUDIO
     Unified Student Cohort: Study Hours (1-6 hrs) vs Exam Pass (1) / Fail (0)
     Matching the exact 10-Student & 4-Student Transcript Classes!
     ------------------------------------------------------------------- */
  window.InteractiveStudios.logisticDeviance = {
    state: {
      b0: -5.85,
      b1: 1.80,
      threshold: 0.50,
      mode: 'transcript10'
    },

    datasets: {
      transcript10: [
        { hours: 1.0, pass: 0 }, { hours: 1.5, pass: 0 }, { hours: 2.0, pass: 0 },
        { hours: 2.5, pass: 0 }, { hours: 3.0, pass: 0 },
        { hours: 3.5, pass: 1 }, { hours: 4.0, pass: 1 }, { hours: 4.5, pass: 1 },
        { hours: 5.0, pass: 1 }, { hours: 6.0, pass: 1 }
      ],
      starter4: [
        { hours: 1.0, pass: 0 }, { hours: 2.0, pass: 0 },
        { hours: 3.0, pass: 1 }, { hours: 4.0, pass: 1 }
      ]
    },

    setCohortMode: function(mode) {
      this.state.mode = mode;
      if (mode === 'starter4') {
        this.state.b0 = -6.125;
        this.state.b1 = 2.45;
      } else {
        this.state.b0 = -5.85;
        this.state.b1 = 1.80;
      }
      this.syncUI();
      this.render();
    },

    onSliderChange: function(key, val) {
      this.state[key] = parseFloat(val);
      const valSpan = document.getElementById('logdev-val-' + key);
      if (valSpan) {
        if (key === 'b0') valSpan.textContent = this.state[key].toFixed(2);
        else if (key === 'b1') valSpan.textContent = this.state[key].toFixed(2);
        else if (key === 'threshold') valSpan.textContent = (this.state[key] * 100).toFixed(0) + '%';
      }
      this.render();
    },

    syncUI: function() {
      ['b0', 'b1', 'threshold'].forEach(k => {
        const input = document.getElementById('logdev-input-' + k);
        const valSpan = document.getElementById('logdev-val-' + k);
        if (input) input.value = this.state[k];
        if (valSpan) {
          if (k === 'b0') valSpan.textContent = this.state[k].toFixed(2);
          else if (k === 'b1') valSpan.textContent = this.state[k].toFixed(2);
          else if (k === 'threshold') valSpan.textContent = (this.state[k] * 100).toFixed(0) + '%';
        }
      });
    },

    render: function() {
      const canvas = document.getElementById('canvas-logistic-deviance');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#0a0f1d');
      bg.addColorStop(1, '#050811');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const pad = { left: 60, right: 40, top: 42, bottom: 45 };
      const plotW = w - pad.left - pad.right;
      const plotH = h - pad.top - pad.bottom;

      const st = this.state;
      const activePts = this.datasets[st.mode] || this.datasets.transcript10;
      const minH = 0, maxH = 6.5;

      const toX = hrs => pad.left + ((hrs - minH) / (maxH - minH)) * plotW;
      const toY = p => h - pad.bottom - p * plotH;

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let p = 0; p <= 1.0; p += 0.25) {
        const y = toY(p);
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      }
      for (let hr = 0; hr <= 6; hr += 1) {
        const x = toX(hr);
        ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, h - pad.bottom); ctx.stroke();
      }

      // Tipping Point Vertical Line x_cutoff = (logit(threshold) - b0) / b1
      const threshLogit = Math.log(st.threshold / Math.max(0.001, 1 - st.threshold));
      const xCutoff = st.b1 !== 0 ? (threshLogit - st.b0) / st.b1 : 3.25;
      if (xCutoff >= minH && xCutoff <= maxH) {
        const cxCut = toX(xCutoff);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
        ctx.fillRect(pad.left, pad.top, cxCut - pad.left, plotH);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
        ctx.fillRect(cxCut, pad.top, (w - pad.right) - cxCut, plotH);

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(cxCut, pad.top); ctx.lineTo(cxCut, h - pad.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Tipping Cutoff: ${xCutoff.toFixed(2)}h`, cxCut, pad.top + 14);
      }

      // Title & Labels
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Unified Student Class (${activePts.length} Students): Study Hours vs Pass Chance (S-Curve & Log-Loss)`, pad.left + plotW / 2, 22);

      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Study Hours Before Quiz (x)', pad.left + plotW / 2, h - 12);

      ctx.save();
      ctx.translate(18, pad.top + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Pass Probability p = 1/(1+e⁻ᶻ)', 0, 0);
      ctx.restore();

      ctx.font = '10px monospace';
      ctx.fillStyle = '#64748b';
      for (let hr = 0; hr <= 6; hr += 1) {
        ctx.fillText(hr + 'h', toX(hr), h - pad.bottom + 14);
      }
      for (let p = 0; p <= 1.0; p += 0.25) {
        ctx.fillText((p * 100).toFixed(0) + '%', pad.left - 24, toY(p) + 3);
      }

      // Horizontal Cutoff Line
      const threshY = toY(st.threshold);
      ctx.strokeStyle = '#f59e0b55';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(pad.left, threshY); ctx.lineTo(w - pad.right, threshY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Pass Decision Line = ${(st.threshold * 100).toFixed(0)}%`, w - pad.right - 8, threshY - 5);

      // Draw Sigmoid S-Curve
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let hrs = minH; hrs <= maxH; hrs += 0.05) {
        const z = st.b0 + st.b1 * hrs;
        const prob = 1 / (1 + Math.exp(-z));
        const cx = toX(hrs);
        const cy = toY(prob);
        if (hrs === minH) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // Compute Log-Loss & Accuracy
      let logLikelihood = 0;
      let tp = 0, fp = 0, tn = 0, fn = 0;

      activePts.forEach((pt, idx) => {
        const z = st.b0 + st.b1 * pt.hours;
        const p = Math.max(0.00001, Math.min(0.99999, 1 / (1 + Math.exp(-z))));
        const ll = pt.pass === 1 ? Math.log(p) : Math.log(1 - p);
        logLikelihood += ll;

        const predClass = p >= st.threshold ? 1 : 0;
        if (pt.pass === 1 && predClass === 1) tp++;
        else if (pt.pass === 0 && predClass === 1) fp++;
        else if (pt.pass === 0 && predClass === 0) tn++;
        else if (pt.pass === 1 && predClass === 0) fn++;

        const cx = toX(pt.hours);
        const cy = toY(pt.pass);
        const curveY = toY(p);

        // Pulling spring line from dot (reality) to curve (prediction)
        ctx.strokeStyle = pt.pass === 1 ? '#10b98166' : '#ef444466';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, curveY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = pt.pass === 1 ? '#10b981' : '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('S' + (idx + 1), cx, pt.pass === 1 ? cy - 9 : cy + 14);
      });

      const avgLoss = -logLikelihood / activePts.length;
      const oddsMultiplier = Math.exp(st.b1);

      const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };

      setTxt('logdev-metric-ll', avgLoss.toFixed(4));
      setTxt('logdev-metric-deviance', (-2 * logLikelihood).toFixed(2));
      setTxt('logdev-metric-or', oddsMultiplier.toFixed(2) + '× odds per +1 hr');
      setTxt('logdev-metric-accuracy', `${tp + tn} / ${activePts.length} (${(((tp + tn) / activePts.length) * 100).toFixed(0)}%)`);
    }
  };

  /* -------------------------------------------------------------------
     5. LURELOCK CYBERSECURITY INTERACTIVE DECISION TREE STUDIO
     Real-World: Zero-Day Phishing URL Detection & XGBoost Gain
     ------------------------------------------------------------------- */
  window.InteractiveStudios.lureTree = {
    state: {
      entropy: 3.85,
      domainAge: 14,
      subdomains: 3,
      homograph: 0.82
    },

    setPreset: function(type) {
      if (type === 'zero_day_phish') {
        this.state = { entropy: 4.45, domainAge: 3, subdomains: 4, homograph: 0.92 };
      } else if (type === 'legit_microsoft') {
        this.state = { entropy: 2.15, domainAge: 2500, subdomains: 1, homograph: 0.02 };
      } else if (type === 'cloudflare_tunnel') {
        this.state = { entropy: 4.10, domainAge: 18, subdomains: 5, homograph: 0.35 };
      } else if (type === 'dga_ransomware') {
        this.state = { entropy: 4.88, domainAge: 1, subdomains: 2, homograph: 0.15 };
      }
      this.syncUI();
      this.render();
    },

    syncUI: function() {
      ['entropy', 'domainAge', 'subdomains', 'homograph'].forEach(k => {
        const input = document.getElementById('ll-tree-input-' + k);
        const valSpan = document.getElementById('ll-tree-val-' + k);
        if (input) input.value = this.state[k];
        if (valSpan) {
          if (k === 'domainAge') valSpan.textContent = this.state[k] + ' days';
          else if (k === 'entropy') valSpan.textContent = this.state[k].toFixed(2) + ' bits';
          else if (k === 'homograph') valSpan.textContent = this.state[k].toFixed(2);
          else valSpan.textContent = this.state[k];
        }
      });
    },

    onSliderChange: function(key, val) {
      this.state[key] = parseFloat(val);
      const valSpan = document.getElementById('ll-tree-val-' + key);
      if (valSpan) {
        if (key === 'domainAge') valSpan.textContent = this.state[key] + ' days';
        else if (key === 'entropy') valSpan.textContent = this.state[key].toFixed(2) + ' bits';
        else if (key === 'homograph') valSpan.textContent = this.state[key].toFixed(2);
        else valSpan.textContent = this.state[key];
      }
      this.render();
    },

    render: function() {
      const canvas = document.getElementById('canvas-ll-interactive-tree');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#0c1322');
      bgGrad.addColorStop(1, '#060a14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const st = this.state;

      const rootIsNewDomain = st.domainAge <= 30;
      const n1HighEntropy = st.entropy >= 3.60;
      const n2HighHomograph = st.homograph >= 0.70;

      const isPathN1 = rootIsNewDomain;
      const isPathN2 = !rootIsNewDomain;
      const isLeaf1 = isPathN1 && n1HighEntropy;
      const isLeaf2 = isPathN1 && !n1HighEntropy;
      const isLeaf3 = isPathN2 && n2HighHomograph;
      const isLeaf4 = isPathN2 && !n2HighHomograph;

      const rootX = w * 0.5, rootY = 55;
      const n1X = w * 0.25, n1Y = 155;
      const n2X = w * 0.75, n2Y = 155;

      const leaf1X = w * 0.13, leaf1Y = 265;
      const leaf2X = w * 0.37, leaf2Y = 265;
      const leaf3X = w * 0.63, leaf3Y = 265;
      const leaf4X = w * 0.87, leaf4Y = 265;

      function drawBranch(x1, y1, x2, y2, isActive, label) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(x1, (y1 + y2) / 2, x2, (y1 + y2) / 2, x2, y2);
        if (isActive) {
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 12;
        } else {
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.restore();

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 4;
        ctx.fillStyle = isActive ? '#22d3ee' : '#64748b';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, midX, midY);
      }

      drawBranch(rootX, rootY + 22, n1X, n1Y - 22, isPathN1, 'YES (Age ≤ 30d)');
      drawBranch(rootX, rootY + 22, n2X, n2Y - 22, isPathN2, 'NO (Age > 30d)');

      drawBranch(n1X, n1Y + 22, leaf1X, leaf1Y - 22, isLeaf1, 'YES (H ≥ 3.60b)');
      drawBranch(n1X, n1Y + 22, leaf2X, leaf2Y - 22, isLeaf2, 'NO (H < 3.60b)');

      drawBranch(n2X, n2Y + 22, leaf3X, leaf3Y - 22, isLeaf3, 'YES (Typo ≥ 0.70)');
      drawBranch(n2X, n2Y + 22, leaf4X, leaf4Y - 22, isLeaf4, 'NO (Typo < 0.70)');

      function drawNode(x, y, title, subtitle, gainText, samples, isActive, isLeaf, isPhish) {
        const nw = isLeaf ? 150 : 160;
        const nh = 52;
        const nx = x - nw / 2;
        const ny = y - nh / 2;

        ctx.save();
        if (isActive) {
          ctx.shadowColor = isLeaf ? (isPhish ? '#ef4444' : '#10b981') : '#06b6d4';
          ctx.shadowBlur = 16;
        }

        const grad = ctx.createLinearGradient(nx, ny, nx, ny + nh);
        if (isActive) {
          if (isLeaf) {
            grad.addColorStop(0, isPhish ? '#7f1d1d' : '#064e3b');
            grad.addColorStop(1, '#0f172a');
          } else {
            grad.addColorStop(0, '#083344');
            grad.addColorStop(1, '#0f172a');
          }
        } else {
          grad.addColorStop(0, '#1e293b');
          grad.addColorStop(1, '#0f172a');
        }
        ctx.fillStyle = grad;
        ctx.strokeStyle = isActive ? (isLeaf ? (isPhish ? '#ef4444' : '#10b981') : '#06b6d4') : '#334155';
        ctx.lineWidth = isActive ? 2.5 : 1.2;

        ctx.beginPath();
        ctx.roundRect(nx, ny, nw, nh, 8);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = isActive ? '#ffffff' : '#94a3b8';
        ctx.fillText(title, x, y - 12);

        ctx.font = '10px monospace';
        ctx.fillStyle = isActive ? (isLeaf ? (isPhish ? '#fca5a5' : '#86efac') : '#22d3ee') : '#64748b';
        ctx.fillText(subtitle, x, y + 1);

        ctx.font = '9px system-ui, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${gainText} | N=${samples}`, x, y + 14);
      }

      drawNode(rootX, rootY, 'XGB Split 0: Domain Age', `Age = ${st.domainAge} days`, 'Gain = +28.4', '10,000', true, false, false);
      drawNode(n1X, n1Y, 'Split 1: Shannon Entropy', `Entropy = ${st.entropy.toFixed(2)}b`, 'Gain = +19.2', '2,400', isPathN1, false, false);
      drawNode(n2X, n2Y, 'Split 2: Homograph Typo', `Similarity = ${st.homograph.toFixed(2)}`, 'Gain = +14.6', '7,600', isPathN2, false, false);

      drawNode(leaf1X, leaf1Y, 'Leaf 1: Zero-Day Phish', '🚨 MALICIOUS (99.4%)', 'Weight +2.85', '1,850', isLeaf1, true, true);
      drawNode(leaf2X, leaf2Y, 'Leaf 2: Suspicious Sandbox', '⚠️ SUSPICIOUS (74.2%)', 'Weight +1.10', '550', isLeaf2, true, true);
      drawNode(leaf3X, leaf3Y, 'Leaf 3: Brand Typosquat', '🚨 PHISHING (96.8%)', 'Weight +2.30', '480', isLeaf3, true, true);
      drawNode(leaf4X, leaf4Y, 'Leaf 4: Valid Enterprise', '✅ BENIGN (0.2% Risk)', 'Weight -3.40', '7,120', isLeaf4, true, false);

      this.updateTraceDOM(rootIsNewDomain, n1HighEntropy, n2HighHomograph);
    },

    updateTraceDOM: function(isNewDomain, highEntropy, highHomograph) {
      const traceEl = document.getElementById('ll-tree-trace-steps');
      const badgeEl = document.getElementById('ll-tree-verdict-badge');
      if (!traceEl || !badgeEl) return;

      const st = this.state;
      const steps = [];

      if (isNewDomain) {
        steps.push(`1. <strong>Root Gate (Domain Age ≤ 30d):</strong> Domain is <strong>${st.domainAge} days old</strong> ≤ 30d ➔ <span class="text-rose-400 font-bold">New Domain Alert! Routed Left</span>.`);
        if (highEntropy) {
          steps.push(`2. <strong>Split 1 (Shannon Entropy ≥ 3.60 bits):</strong> URL entropy is <strong>${st.entropy.toFixed(2)} bits</strong> ≥ 3.60b ➔ <span class="text-rose-400 font-bold">DGA Random Character Pattern Detected!</span>`);
          steps.push(`3. <strong>Final Leaf 1 Reached:</strong> Leaf Weight = +2.85 ➔ <span class="text-rose-400 font-bold">BLOCKED: ZERO-DAY PHISHING / RANSOMWARE C2 (Confidence 99.4%)</span>.`);
          badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">🚨 ZERO-DAY HARVESTER DETECTED (99.4% CONFIDENCE)</span>`;
        } else {
          steps.push(`2. <strong>Split 1 (Shannon Entropy ≥ 3.60 bits):</strong> URL entropy is <strong>${st.entropy.toFixed(2)} bits</strong> < 3.60b (Low Entropy) ➔ <span class="text-amber-400 font-bold">Standard Lexical Words</span>.`);
          steps.push(`3. <strong>Final Leaf 2 Reached:</strong> Leaf Weight = +1.10 ➔ <span class="text-amber-400 font-bold">ISOLATED: SUSPICIOUS NEW DOMAIN (Browser Sandbox Quarantine)</span>.`);
          badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">⚠️ ISOLATE IN ZERO-TRUST SANDBOX (Score +1.10)</span>`;
        }
      } else {
        steps.push(`1. <strong>Root Gate (Domain Age ≤ 30d):</strong> Domain is <strong>${st.domainAge} days old</strong> > 30d ➔ <span class="text-sky-400 font-bold">Aged Domain. Routed Right</span>.`);
        if (highHomograph) {
          steps.push(`2. <strong>Split 2 (Homograph Similarity ≥ 0.70):</strong> Homograph score is <strong>${st.homograph.toFixed(2)}</strong> ≥ 0.70 ➔ <span class="text-rose-400 font-bold">Punycode / Cyrillic Character Spoof Detected!</span>`);
          steps.push(`3. <strong>Final Leaf 3 Reached:</strong> Leaf Weight = +2.30 ➔ <span class="text-rose-400 font-bold">BLOCKED: BRAND IMPERSONATION ATTACK (Confidence 96.8%)</span>.`);
          badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">🚨 BRAND TYPOSQUAT BLOCKED (Confidence 96.8%)</span>`;
        } else {
          steps.push(`2. <strong>Split 2 (Homograph Similarity ≥ 0.70):</strong> Homograph score is <strong>${st.homograph.toFixed(2)}</strong> < 0.70 ➔ <span class="text-emerald-400 font-bold">Clean Lexical Syntax</span>.`);
          steps.push(`3. <strong>Final Leaf 4 Reached:</strong> Leaf Weight = -3.40 ➔ <span class="text-emerald-400 font-bold">ALLOW TRAFFIC: VERIFIED BENIGN ENTERPRISE DOMAIN</span>.`);
          badgeEl.innerHTML = `<span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✅ VERIFIED BENIGN (0.2% Misclassification Risk)</span>`;
        }
      }

      traceEl.innerHTML = steps.map(s => `<li class="p-2 rounded bg-[var(--card)] border border-[var(--border)]">${s}</li>`).join('');
    }
  };

  // Window load hooks
  window.addEventListener('DOMContentLoaded', function() {
    if (window.InteractiveStudios.mlTree) window.InteractiveStudios.mlTree.render();
    if (window.InteractiveStudios.pvalueReg) window.InteractiveStudios.pvalueReg.init();
    if (window.InteractiveStudios.logisticDeviance) window.InteractiveStudios.logisticDeviance.syncUI(), window.InteractiveStudios.logisticDeviance.render();
    if (window.InteractiveStudios.lureTree) window.InteractiveStudios.lureTree.render();
  });
})();

// ============================================================================
// VERSION 7 UNIFIED INTERACTIVE CANVAS & 1-PARAM vs MULTI-PARAM STUDIO ENGINE
// Every topic uses the Unified Student Study Cohort & supports live toggling
// between Non-Multiparameter (1 Feature: Hours) & Multiparameter (2+ Features).
// ============================================================================
(function() {
  const V7 = window.V7Studios = {
    state: {}
  };

  function getPalette() {
    const dark = !document.documentElement.classList.contains('light-mode') &&
                 document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      dark,
      bg: dark ? '#0b1120' : '#f8fafc',
      grid: dark ? '#1e293b' : '#e2e8f0',
      axis: dark ? '#64748b' : '#475569',
      text: dark ? '#e2e8f0' : '#0f172a',
      muted: dark ? '#94a3b8' : '#64748b',
      sky: '#38bdf8',
      emerald: '#34d399',
      amber: '#fbbf24',
      rose: '#fb7185',
      violet: '#a78bfa'
    };
  }

  function setupCanvas(canvasId) {
    const c = document.getElementById(canvasId);
    if (!c) return null;
    const ctx = c.getContext('2d');
    const P = getPalette();
    ctx.fillStyle = P.bg;
    ctx.fillRect(0, 0, c.width, c.height);
    return { c, ctx, W: c.width, H: c.height, P };
  }

  function drawAxes(ctx, W, H, P, pad, xLabel, yLabel) {
    ctx.strokeStyle = P.grid;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const gx = pad.l + ((W - pad.l - pad.r) * i) / 5;
      const gy = pad.t + ((H - pad.t - pad.b) * i) / 5;
      ctx.beginPath(); ctx.moveTo(gx, pad.t); ctx.lineTo(gx, H - pad.b); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
    }
    ctx.strokeStyle = P.axis;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, H - pad.b);
    ctx.lineTo(W - pad.r, H - pad.b);
    ctx.stroke();

    ctx.fillStyle = P.muted;
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, (pad.l + W - pad.r) / 2, H - 8);
    ctx.save();
    ctx.translate(14, (pad.t + H - pad.b) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
  }

  function erf(x) {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  function stepBox(title, steps) {
    return `<div class="mt-3 p-3 rounded-lg bg-slate-900/70 border border-emerald-500/30 space-y-1.5 text-xs">
      <div class="font-bold text-emerald-300 uppercase tracking-wide text-[11px]">📝 ${title}</div>
      ${steps.map((s, i) => `<div class="leading-relaxed"><span class="font-bold text-sky-300">Step ${i + 1}:</span> ${s}</div>`).join('')}
    </div>`;
  }

  // 1. VECTORS & COSINE SIMILARITY (mod_vec) - Student Cohort Only
  V7.renderVec = function() {
    const env = setupCanvas('v7-canvas-vec');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.vecMode || 'multi';
    const deg = Number(document.getElementById('v7-vec-angle')?.value ?? 26);
    const rad = deg * Math.PI / 180;
    const wLen = 5.0; // weight intensity
    const xLen = Number(document.getElementById('v7-vec-xlen')?.value ?? 4.5);

    if (mode === 'single') {
      // 1D Scalar Number Line
      const pad = { l: 55, r: 35, t: 45, b: 50 };
      const yMid = H / 2;
      ctx.strokeStyle = P.axis; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pad.l, yMid); ctx.lineTo(W - pad.r, yMid); ctx.stroke();
      const mapX = v => pad.l + (v / 6) * (W - pad.l - pad.r);
      for (let t = 0; t <= 6; t++) {
        const px = mapX(t);
        ctx.fillStyle = P.muted; ctx.font = '10px monospace'; ctx.textAlign = 'center';
        ctx.beginPath(); ctx.moveTo(px, yMid - 5); ctx.lineTo(px, yMid + 5); ctx.stroke();
        ctx.fillText(`${t}h`, px, yMid + 20);
      }
      const x1 = xLen;
      ctx.strokeStyle = P.emerald; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(mapX(0), yMid - 18); ctx.lineTo(mapX(x1), yMid - 18); ctx.stroke();
      ctx.fillStyle = P.emerald; ctx.beginPath(); ctx.arc(mapX(x1), yMid - 18, 6, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
      ctx.fillText(`1D Feature: Hours = ${x1.toFixed(1)} | Score = 10 × ${x1.toFixed(1)} + 40 = ${(10 * x1 + 40).toFixed(1)} pts`, pad.l, 32);

      const box = document.getElementById('v7-vec-readout');
      if (box) box.innerHTML = `
        <div class="font-bold text-sky-300">Non-Multiparameter (1D Number Line):</div>
        <div>Feature vector has 1 number: <code>x = [${x1.toFixed(1)}]</code> (Study Hours)</div>
        <div>Formula: <code>ŷ = w₁x₁ + b = 10(${x1.toFixed(1)}) + 40 = <strong>${(10*x1+40).toFixed(1)} pts</strong></code></div>
        <div class="text-[var(--muted-foreground)]">In 1D, there is no angle θ between multiple study habits—only length along one axis!</div>
        ${stepBox('Live Step-by-Step Solution (1D)', [
          `Identify 1D feature vector <code>x = [${x1.toFixed(1)}]</code>, weight <code>w₁ = 10</code>, bias <code>b = 40</code>.`,
          `Multiply weight × feature: <code>10 × ${x1.toFixed(1)} = ${(10 * x1).toFixed(1)}</code>.`,
          `Add baseline score: <code>${(10 * x1).toFixed(1)} + 40 = <strong>${(10 * x1 + 40).toFixed(1)} pts</strong></code>.`
        ])}`;
    } else {
      // 2D Student Profile Vector [Hours, PracticeTests]
      const ox = 85, oy = H - 55;
      const scale = 32;
      ctx.strokeStyle = P.grid; ctx.lineWidth = 1;
      for (let r = 1; r <= 5; r++) {
        ctx.beginPath(); ctx.arc(ox, oy, r * scale, -Math.PI/2 - 0.1, 0.2); ctx.stroke();
      }
      ctx.strokeStyle = P.axis; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(ox, 25); ctx.lineTo(ox, oy); ctx.lineTo(W - 35, oy); ctx.stroke();
      ctx.fillStyle = P.muted; ctx.font = '11px monospace';
      ctx.fillText('x₁: Study Hours →', W - 140, oy + 20);
      ctx.fillText('x₂: Practice Tests ↑', ox + 10, 30);

      // Weight vector w along (5, 0) rotated slightly or horizontal baseline
      const wx = 5.0, wy = 1.5;
      const wNorm = Math.hypot(wx, wy);
      const wAng = Math.atan2(wy, wx);
      const xAng = wAng + rad;
      const xx = xLen * Math.cos(xAng);
      const xy = xLen * Math.sin(xAng);
      const dot = wx * xx + wy * xy;
      const cosT = Math.cos(rad);

      const drawArrow = (vx, vy, col, lbl) => {
        const tx = ox + vx * scale, ty = oy - vy * scale;
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.beginPath(); ctx.arc(tx, ty, 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = 'bold 11px monospace';
        ctx.fillText(lbl, tx + 8, ty - 6);
      };
      drawArrow(wx, wy, P.sky, `Weight w = [${wx.toFixed(1)}, ${wy.toFixed(1)}]`);
      drawArrow(xx, xy, P.emerald, `Student x = [${xx.toFixed(2)}, ${xy.toFixed(2)}]`);

      // Projection dashed line
      const projScalar = dot / wNorm;
      const px = ox + projScalar * (wx / wNorm) * scale;
      const py = oy - projScalar * (wy / wNorm) * scale;
      ctx.setLineDash([4, 4]); ctx.strokeStyle = P.amber; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(ox + xx * scale, oy - xy * scale); ctx.lineTo(px, py); ctx.stroke();
      ctx.setLineDash([]);

      const box = document.getElementById('v7-vec-readout');
      if (box) box.innerHTML = `
        <div class="font-bold text-emerald-300">Multiparameter (2D Student Vector [Hours, Tests]):</div>
        <div>Dot Product: <code>w · x = (${wx.toFixed(1)})(${xx.toFixed(2)}) + (${wy.toFixed(1)})(${xy.toFixed(2)}) = <strong>${dot.toFixed(2)}</strong></code></div>
        <div>Magnitudes: <code>||w||=${wNorm.toFixed(2)}, ||x||=${xLen.toFixed(2)}</code> → <code>cos(${deg}°) = <strong>${cosT.toFixed(3)}</strong></code></div>
        <div class="text-[var(--muted-foreground)]">Predicted Boost: Score = Base 40 + 2.5×(${dot.toFixed(2)}) = <strong>${(40 + 2.5*dot).toFixed(1)} pts</strong></div>
        ${stepBox('Live Step-by-Step Solution (2D Vector, Dot Product & Cosine Similarity)', [
          `<strong>Dot Product:</strong> <code>w · x = (${wx.toFixed(1)} × ${xx.toFixed(2)}) + (${wy.toFixed(1)} × ${xy.toFixed(2)}) = ${(wx * xx).toFixed(2)} + ${(wy * xy).toFixed(2)} = <strong>${dot.toFixed(2)}</strong></code> <span class="text-[var(--muted-foreground)]">(computed with unrounded slider coordinates before rounding x to 2 decimals)</span>.`,
          `<strong>Vector Lengths (Magnitudes):</strong> <code>||w|| = √(${wx.toFixed(1)}² + ${wy.toFixed(1)}²) = √${(wx*wx + wy*wy).toFixed(2)} = <strong>${wNorm.toFixed(2)}</strong></code> | <code>||x|| = √(${xx.toFixed(2)}² + ${xy.toFixed(2)}²) = √${(xx*xx + xy*xy).toFixed(2)} = <strong>${xLen.toFixed(2)}</strong></code>.`,
          `<strong>Cosine Similarity & Angle:</strong> <code>cos(θ) = (w · x) ÷ (||w|| × ||x||) = ${dot.toFixed(2)} ÷ (${wNorm.toFixed(2)} × ${xLen.toFixed(2)}) = ${dot.toFixed(2)} ÷ ${(wNorm * xLen).toFixed(2)} = <strong>${cosT.toFixed(3)}</strong></code> → <code>θ = arccos(${cosT.toFixed(3)}) = <strong>${deg}°</strong></code>.`,
          `<strong>Orange Projection Check:</strong> Shadow length <code>||x||·cos(θ) = ${xLen.toFixed(2)} × ${cosT.toFixed(3)} = ${projScalar.toFixed(2)}</code>, and <code>${projScalar.toFixed(2)} × ${wNorm.toFixed(2)} = <strong>${(projScalar * wNorm).toFixed(2)}</strong></code> (matches Dot Product!).`,
          `<strong>Predicted Score:</strong> <code>40 + 2.5 × ${dot.toFixed(2)} = 40 + ${(2.5 * dot).toFixed(2)} = <strong>${(40 + 2.5 * dot).toFixed(1)} pts</strong></code>.`
        ])}`;
    }
    const lbl = document.getElementById('v7-vec-angle-lbl');
    if (lbl) lbl.textContent = `${deg}°`;
  };

  // 2. DESIGN MATRIX (mod_design)
  V7.renderDesign = function() {
    const env = setupCanvas('v7-canvas-design');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.designMode || 'multi';
    const rowIdx = Number(document.getElementById('v7-design-row')?.value ?? 1);

    const students = [
      { name: 'Student 1', h: 1, t: 0, grp: 0, y: 50 },
      { name: 'Student 2', h: 2, t: 1, grp: 0, y: 62 },
      { name: 'Student 3', h: 3, t: 1, grp: 1, y: 68 },
      { name: 'Student 4', h: 4, t: 2, grp: 1, y: 81 },
      { name: 'Student 5', h: 5, t: 3, grp: 1, y: 92 }
    ];

    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = P.sky;
    ctx.textAlign = 'left';
    ctx.fillText(mode === 'single' ? '1-Parameter Design Matrix X (5×2) × β = ŷ' : 'Multi-Parameter Design Matrix X (5×4) × β = ŷ', 24, 28);

    const cols = mode === 'single' ? ['1 (Bias)', 'Hours x₁'] : ['1 (Bias)', 'Hours x₁', 'Tests x₂', 'TutorGrp d'];
    const betas = mode === 'single' ? [40, 10] : [38, 8, 4, 3];
    const startX = 28, startY = 58, colW = mode === 'single' ? 95 : 80, rowH = 38;

    cols.forEach((c, ci) => {
      ctx.fillStyle = P.muted; ctx.font = '10px monospace';
      ctx.fillText(c, startX + ci * colW + 8, startY - 10);
    });

    students.forEach((st, ri) => {
      const vals = mode === 'single' ? [1, st.h] : [1, st.h, st.t, st.grp];
      const pred = vals.reduce((acc, v, k) => acc + v * betas[k], 0);
      const yPos = startY + ri * rowH;
      const isSel = ri === rowIdx;
      ctx.fillStyle = isSel ? 'rgba(56,189,248,0.18)' : (P.dark ? 'rgba(30,41,59,0.5)' : '#e2e8f0');
      ctx.strokeStyle = isSel ? P.sky : P.grid;
      ctx.lineWidth = isSel ? 2 : 1;
      ctx.fillRect(startX, yPos, cols.length * colW, rowH - 5);
      ctx.strokeRect(startX, yPos, cols.length * colW, rowH - 5);

      vals.forEach((v, ci) => {
        ctx.fillStyle = isSel ? P.amber : P.text;
        ctx.font = isSel ? 'bold 12px monospace' : '11px monospace';
        ctx.fillText(String(v), startX + ci * colW + 24, yPos + 21);
      });
      // Result on right
      const resX = startX + cols.length * colW + 24;
      ctx.fillStyle = isSel ? P.emerald : P.muted;
      ctx.font = isSel ? 'bold 12px monospace' : '11px monospace';
      ctx.fillText(`→ ŷ=${pred} (Real ${st.y})`, resX, yPos + 21);
    });

    const st = students[rowIdx];
    const vals = mode === 'single' ? [1, st.h] : [1, st.h, st.t, st.grp];
    const eq = vals.map((v, k) => `(${v}×${betas[k]})`).join(' + ');
    const sum = vals.reduce((a, v, k) => a + v * betas[k], 0);
    const box = document.getElementById('v7-design-readout');
    if (box) box.innerHTML = `
      <div class="font-bold text-sky-300">Selected Row: ${st.name}</div>
      <div>Row Vector: <code>[${vals.join(', ')}]</code> · Weight Vector <code>β = [${betas.join(', ')}]ᵀ</code></div>
      <div>Matrix Multiply Row Calculation: <code>${eq} = <strong>${sum} pts</strong></code> (Real Score: ${st.y} pts)</div>
      ${stepBox('Live Step-by-Step Row Multiplication', [
        `Extract Row ${rowIdx + 1} from Design Matrix X: <code>[${vals.join(', ')}]</code> (leading <code>1</code> multiplies the Bias β₀).`,
        `Multiply each entry by its weight in β: <code>${vals.map((v, k) => `${v}×${betas[k]}=${v * betas[k]}`).join(', ')}</code>.`,
        `Sum the products: <code>${vals.map((v, k) => v * betas[k]).join(' + ')} = <strong>${sum} pts</strong></code> (Error vs Real ${st.y}: <code>${sum} − ${st.y} = ${sum - st.y >= 0 ? '+' : ''}${sum - st.y} pts</code>).`
      ])}`;
  };

  // 3. CORRELATION & COVARIANCE (mod_corr)
  V7.renderCorr = function() {
    const env = setupCanvas('v7-canvas-corr');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.corrMode || 'single';
    const noise = Number(document.getElementById('v7-corr-noise')?.value ?? 1);
    const pad = { l: 55, r: 30, t: 35, b: 42 };
    drawAxes(ctx, W, H, P, pad, mode === 'single' ? 'Study Hours (x₁)' : 'Feature Value (Scaled)', 'Quiz Score (y)');

    const base = [
      { h: 1, s: 8, y: 50 },
      { h: 2, s: 5, y: 62 },
      { h: 3, s: 7, y: 68 },
      { h: 4, s: 6, y: 78 },
      { h: 5, s: 8, y: 90 }
    ];
    const pts = base.map((d, i) => ({
      x: d.h,
      y: Math.max(30, Math.min(99, d.y + (i % 2 === 0 ? -1 : 1) * (noise - 1) * 3.5)),
      s: d.s + (i % 2 === 0 ? 0.5 : -0.5) * (noise - 1)
    }));

    const calcCorr = (arrX, arrY) => {
      const n = arrX.length;
      const mx = arrX.reduce((a, b) => a + b, 0) / n;
      const my = arrY.reduce((a, b) => a + b, 0) / n;
      let num = 0, dx2 = 0, dy2 = 0;
      for (let i = 0; i < n; i++) {
        num += (arrX[i] - mx) * (arrY[i] - my);
        dx2 += (arrX[i] - mx) ** 2;
        dy2 += (arrY[i] - my) ** 2;
      }
      const cov = num / (n - 1);
      const r = num / Math.sqrt(dx2 * dy2 || 1);
      return { mx, my, num, dx2, dy2, cov, r };
    };

    const rHours = calcCorr(pts.map(p => p.x), pts.map(p => p.y));
    const rSleep = calcCorr(pts.map(p => p.s), pts.map(p => p.y));

    const toX = v => pad.l + ((v - 0.5) / 5.5) * (W - pad.l - pad.r);
    const toY = v => H - pad.b - ((v - 35) / 65) * (H - pad.t - pad.b);

    pts.forEach(p => {
      ctx.fillStyle = P.sky;
      ctx.beginPath(); ctx.arc(toX(p.x), toY(p.y), 6, 0, Math.PI * 2); ctx.fill();
      if (mode === 'multi') {
        ctx.fillStyle = P.rose;
        ctx.beginPath(); ctx.rect(toX(p.s - 3.5) - 5, toY(p.y) - 5, 10, 10); ctx.fill();
      }
    });

    ctx.fillStyle = P.emerald; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`r(Hours, Score) = ${rHours.r >= 0 ? '+' : ''}${rHours.r.toFixed(3)}`, pad.l + 12, 24);
    if (mode === 'multi') {
      ctx.fillStyle = P.rose;
      ctx.fillText(`| r(Sleep, Score) = ${rSleep.r >= 0 ? '+' : ''}${rSleep.r.toFixed(3)}`, pad.l + 210, 24);
    }

    const box = document.getElementById('v7-corr-readout');
    if (box) {
      const steps = [
        `Compute sample means (n=5): <code>x̄ = ${rHours.mx.toFixed(2)} hrs</code>, <code>ȳ = ${rHours.my.toFixed(2)} pts</code>.`,
        `Sum paired deviations: <code>Σ(xᵢ−x̄)(yᵢ−ȳ) = ${rHours.num.toFixed(2)}</code> | <code>Σ(xᵢ−x̄)² = ${rHours.dx2.toFixed(2)}</code> | <code>Σ(yᵢ−ȳ)² = ${rHours.dy2.toFixed(2)}</code>.`,
        `Sample Covariance: <code>Cov = ${rHours.num.toFixed(2)} ÷ (5 − 1) = <strong>${rHours.cov.toFixed(2)}</strong></code>.`,
        `Pearson r: <code>r = ${rHours.num.toFixed(2)} ÷ √(${rHours.dx2.toFixed(2)} × ${rHours.dy2.toFixed(2)}) = ${rHours.num.toFixed(2)} ÷ ${Math.sqrt(rHours.dx2 * rHours.dy2).toFixed(2)} = <strong>${rHours.r.toFixed(3)}</strong></code>${mode === 'multi' ? ` (vs Sleep <code>r = ${rSleep.r.toFixed(3)}</code>)` : ''}.`
      ];
      box.innerHTML = (mode === 'single'
        ? `<div><strong>Single-Feature Covariance & Correlation:</strong> Cov(Hours, Score) = <code>${rHours.cov.toFixed(2)}</code> | Pearson <code>r = ${rHours.r.toFixed(3)}</code> (Strong Positive Trend!)</div>`
        : `<div><strong>Multi-Feature Correlation Matrix Check:</strong> Study Hours has <code>r = ${rHours.r.toFixed(3)}</code> (Strong signal), while Random Sleep Fluctuation has <code>r = ${rSleep.r.toFixed(3)}</code> (Weak linear link).</div>`)
        + stepBox('Live Step-by-Step Covariance & Pearson r', steps);
    }
  };

  // 4. BEST FIT LINE & NORMAL EQUATION (mod_bestfit)
  V7.renderBestFit = function() {
    const env = setupCanvas('v7-canvas-bestfit');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.bestfitMode || 'single';
    const m = Number(document.getElementById('v7-bf-slope')?.value ?? 10);
    const b = Number(document.getElementById('v7-bf-intercept')?.value ?? 40);
    const b2 = Number(document.getElementById('v7-bf-b2')?.value ?? 4);
    const pad = { l: 55, r: 30, t: 35, b: 42 };
    drawAxes(ctx, W, H, P, pad, 'Study Hours (x₁)', 'Quiz Score (y)');

    const data = [
      { h: 1, t: 0, y: 50 },
      { h: 2, t: 1, y: 62 },
      { h: 3, t: 1, y: 68 },
      { h: 4, t: 2, y: 82 },
      { h: 5, t: 3, y: 92 }
    ];
    const toX = v => pad.l + (v / 6) * (W - pad.l - pad.r);
    const toY = v => H - pad.b - ((v - 30) / 75) * (H - pad.t - pad.b);

    let ssr = 0;
    const bfRows = [];
    data.forEach(d => {
      const pred = mode === 'single' ? (m * d.h + b) : (m * d.h + b2 * d.t + b);
      const err = pred - d.y;
      const err2 = err * err;
      ssr += err2;
      bfRows.push({ h: d.h, t: d.t, y: d.y, pred, err, err2 });
      ctx.strokeStyle = P.rose; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(toX(d.h), toY(d.y)); ctx.lineTo(toX(d.h), toY(pred)); ctx.stroke();
      ctx.fillStyle = P.sky;
      ctx.beginPath(); ctx.arc(toX(d.h), toY(d.y), 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.amber;
      ctx.beginPath(); ctx.arc(toX(d.h), toY(pred), 4, 0, Math.PI * 2); ctx.fill();
    });

    ctx.strokeStyle = P.emerald; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toX(0.5), toY(m * 0.5 + b + (mode === 'multi' ? b2 * 1 : 0)));
    ctx.lineTo(toX(5.5), toY(m * 5.5 + b + (mode === 'multi' ? b2 * 1 : 0)));
    ctx.stroke();

    const box = document.getElementById('v7-bf-readout');
    if (box) {
      const eqStr = mode === 'single' ? `${m.toFixed(1)} × Hours + ${b.toFixed(1)}` : `${m.toFixed(1)} × Hours + ${b2.toFixed(1)} × Tests + ${b.toFixed(1)}`;
      const steps = [
        `Predict <code>Guess = ${eqStr}</code> for all 5 students: <code>[${bfRows.map(r => r.pred.toFixed(1)).join(', ')}]</code>.`,
        `Subtract real scores <code>(Guess − Real)</code>: <code>[${bfRows.map(r => `${r.pred.toFixed(1)}−${r.y}=${r.err.toFixed(1)}`).join(', ')}]</code>.`,
        `Square each error & add up: <code>${bfRows.map(r => r.err2.toFixed(1)).join(' + ')} = <strong>Model Squared Error ${ssr.toFixed(1)}</strong></code> (<code>Average Squared Error = ${ssr.toFixed(1)} ÷ 5 = ${(ssr / 5).toFixed(2)}</code>).`
      ];
      box.innerHTML = (mode === 'single'
        ? `<div><strong>1-Clue Line:</strong> <code>Guess = ${m.toFixed(1)}×Hours + ${b.toFixed(1)}</code> → <strong>Model Squared Error = ${ssr.toFixed(1)}</strong> (Best-Fit Winner ≈ slope 10.4, base 39.6 → Error 3.2)</div>`
        : `<div><strong>2-Clue Plane (holding Tests slice fixed):</strong> <code>Guess = ${m.toFixed(1)}×Hours + ${b2.toFixed(1)}×Tests + ${b.toFixed(1)}</code> → <strong>Model Squared Error = ${ssr.toFixed(1)}</strong> (Best Weights [39.4, 8.8, 3.6] → Error ≈ 1.1)</div>`)
        + stepBox('Live Step-by-Step Leftover Errors & Squared Total', steps);
    }
  };

  // 5. COEFFICIENTS & R² vs ADJUSTED R² (mod_coeff_r2)
  V7.renderCoeffR2 = function() {
    const env = setupCanvas('v7-canvas-r2');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.r2Mode || 'multi';
    const extraType = V7.state.r2Extra || 'noise';

    const bars = mode === 'single'
      ? [
          { lbl: 'Raw R² (1 Feature: Hours)', val: 0.985, col: P.sky },
          { lbl: 'Adjusted R² (p=1, n=5)', val: 0.980, col: P.emerald }
        ]
      : extraType === 'real'
      ? [
          { lbl: '1 Feature (Hours) Adj-R²', val: 0.980, col: P.muted },
          { lbl: '+Real Feature (Tests) Raw R²', val: 0.996, col: P.sky },
          { lbl: '+Real Feature Adjusted R²', val: 0.992, col: P.emerald }
        ]
      : [
          { lbl: '1 Feature (Hours) Adj-R²', val: 0.980, col: P.emerald },
          { lbl: '+Fake Pen Color Raw R²', val: 0.986, col: P.amber },
          { lbl: '+Fake Pen Color Adj-R² (Drops!)', val: 0.972, col: P.rose }
        ];

    ctx.fillStyle = P.text; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
    ctx.fillText('Raw R² vs Adjusted R² (Adding Real Signal vs Fake Noise)', 28, 28);
    bars.forEach((br, idx) => {
      const y = 58 + idx * 55;
      const maxW = W - 120;
      ctx.fillStyle = P.muted; ctx.font = '11px monospace';
      ctx.fillText(br.lbl, 30, y - 6);
      ctx.fillStyle = P.grid; ctx.fillRect(30, y, maxW, 24);
      ctx.fillStyle = br.col; ctx.fillRect(30, y, maxW * br.val, 24);
      ctx.fillStyle = P.text; ctx.font = 'bold 12px monospace';
      ctx.fillText(`${(br.val * 100).toFixed(1)}%`, 38 + maxW * br.val, y + 17);
    });

    const box = document.getElementById('v7-r2-readout');
    if (box) {
      const r2Steps = mode === 'single'
        ? [
            `Formula: <code>Adj-R² = 1 − (1 − R²) × (n − 1) ÷ (n − p − 1)</code> with <code>n=5, p=1, R²=0.985</code>.`,
            `Compute penalty ratio: <code>(5 − 1) ÷ (5 − 1 − 1) = 4 ÷ 3 = 1.333</code>.`,
            `Multiply & subtract: <code>1 − (0.015 × 1.333) = 1 − 0.020 = <strong>0.980 (98.0%)</strong></code>.`
          ]
        : extraType === 'real'
        ? [
            `Adding <strong>Practice Tests</strong> raises <code>p</code> from 1 to 2 (<code>n=5</code>), penalty ratio <code>(5−1)÷(5−2−1) = 4÷2 = 2.0</code>.`,
            `New Raw <code>R² = 0.996</code> → unexplained variance <code>1 − 0.996 = 0.004</code>.`,
            `Multiply & subtract: <code>1 − (0.004 × 2.0) = 1 − 0.008 = <strong>0.992 (99.2% &gt; 98.0% ✅ Keep!)</strong></code>.`
          ]
        : [
            `Adding <strong>Pen Color</strong> raises <code>p</code> from 1 to 2 (<code>n=5</code>), penalty ratio <code>(5−1)÷(5−2−1) = 4÷2 = 2.0</code>.`,
            `Raw <code>R²</code> barely moves to <code>0.986</code> → unexplained variance <code>1 − 0.986 = 0.014</code>.`,
            `Multiply & subtract: <code>1 − (0.014 × 2.0) = 1 − 0.028 = <strong>0.972 (97.2% &lt; 98.0% ❌ Drop!)</strong></code>.`
          ];
      box.innerHTML = (mode === 'single'
        ? `<div><strong>Single-Parameter R²:</strong> Hours alone explains <strong>98.5%</strong> of grade differences. Adjusted R² = <code>1 - (1-0.985)(4/3) = 98.0%</code>.</div>`
        : extraType === 'real'
        ? `<div><strong>Multi-Parameter + Real Practice Tests:</strong> Both Raw R² (<code>99.6%</code>) AND Adjusted R² (<code>99.2%</code>) go UP — keep Practice Tests!</div>`
        : `<div><strong>Multi-Parameter + Fake Noise (Pen Color):</strong> Raw R² sneaks up slightly (<code>98.5% → 98.6%</code>), but <strong>Adjusted R² DROPS (<code>98.0% → 97.2%</code>)</strong> — Proof that Pen Color is useless junk!</div>`)
        + stepBox('Live Step-by-Step Adjusted R² Penalty', r2Steps);
    }
  };

  // 6. P-VALUE & CONFIDENCE LEVEL (mod_pval_ci)
  V7.renderPvalCI = function() {
    const env = setupCanvas('v7-canvas-pvalci');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.pvalMode || 'single';
    const conf = Number(document.getElementById('v7-ci-level')?.value ?? 95);
    const zCrit = conf === 90 ? 1.645 : conf === 99 ? 2.576 : 1.96;

    if (mode === 'single') {
      const pad = { l: 45, r: 30, t: 35, b: 40 };
      const mu = 10, se = 0.85;
      const lo = mu - zCrit * se, hi = mu + zCrit * se;
      const toX = v => pad.l + ((v - 5) / 10) * (W - pad.l - pad.r);
      const toY = g => H - pad.b - g * (H - pad.t - pad.b) * 0.9;
      ctx.fillStyle = 'rgba(52, 211, 153, 0.28)';
      ctx.beginPath(); ctx.moveTo(toX(lo), toY(0));
      for (let x = lo; x <= hi; x += 0.1) {
        const z = (x - mu) / se;
        ctx.lineTo(toX(x), toY(Math.exp(-0.5 * z * z)));
      }
      ctx.lineTo(toX(hi), toY(0)); ctx.closePath(); ctx.fill();

      ctx.strokeStyle = P.sky; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let x = 5; x <= 15; x += 0.1) {
        const z = (x - mu) / se;
        const px = toX(x), py = toY(Math.exp(-0.5 * z * z));
        if (x === 5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.fillStyle = P.text; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
      ctx.fillText(`${conf}% Safe Range for Hours Slope: [${lo.toFixed(2)}, ${hi.toFixed(2)}] pts/hr (Clear of 0!)`, W / 2, 24);
    } else {
      // Multi-param Forest CI Plot
      ctx.fillStyle = P.text; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
      ctx.fillText(`Multi-Clue ${conf}% Safe Ranges (Zero-Effect Check)`, 30, 26);
      const mapX = v => 140 + ((v + 4) / 18) * (W - 180);
      const zeroX = mapX(0);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = P.rose; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(zeroX, 45); ctx.lineTo(zeroX, H - 30); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = P.rose; ctx.font = '10px monospace'; ctx.fillText('Zero Effect', zeroX - 28, H - 15);

      const feats = [
        { name: 'Hours Weight', b: 8.8, se: 0.9, col: P.emerald },
        { name: 'Tests Weight', b: 3.6, se: 1.1, col: P.sky },
        { name: 'PenColor Wt', b: 0.4, se: 1.7, col: P.amber }
      ];
      feats.forEach((f, i) => {
        const y = 78 + i * 52;
        const lo = f.b - zCrit * f.se, hi = f.b + zCrit * f.se;
        ctx.fillStyle = P.text; ctx.font = '11px monospace'; ctx.fillText(f.name, 20, y + 4);
        ctx.strokeStyle = f.col; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(mapX(lo), y); ctx.lineTo(mapX(hi), y); ctx.stroke();
        ctx.fillStyle = f.col; ctx.beginPath(); ctx.arc(mapX(f.b), y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.font = '10px monospace';
        ctx.fillText(`[${lo.toFixed(1)}, ${hi.toFixed(1)}]`, mapX(hi) + 8, y + 4);
      });
    }

    const box = document.getElementById('v7-ci-readout');
    if (box) {
      const ciSteps = mode === 'single'
        ? [
            `Pick safety multiplier for ${conf}% certainty: <code>${zCrit}</code> (Slope = 10.0, Wiggle Margin = 0.85).`,
            `Compute Wiggle Cushion: <code>Multiplier × Wiggle Margin = ${zCrit} × 0.85 = ${(zCrit * 0.85).toFixed(2)}</code>.`,
            `Build Safe Range: <code>[10 − ${(zCrit * 0.85).toFixed(2)}, 10 + ${(zCrit * 0.85).toFixed(2)}] = <strong>[${(10 - zCrit * 0.85).toFixed(2)}, ${(10 + zCrit * 0.85).toFixed(2)}]</strong></code> (Clear of 0 → Real signal!).`
          ]
        : [
            `Apply <code>Weight ± ${zCrit} × Wiggle Margin</code> to each clue:`,
            `<code>Hours: 8.8 ± ${zCrit}(0.9) = [${(8.8 - zCrit*0.9).toFixed(1)}, ${(8.8 + zCrit*0.9).toFixed(1)}]</code> (clear of 0 ✅) | <code>Tests: 3.6 ± ${zCrit}(1.1) = [${(3.6 - zCrit*1.1).toFixed(1)}, ${(3.6 + zCrit*1.1).toFixed(1)}]</code>.`,
            `<code>PenColor: 0.4 ± ${zCrit}(1.7) = [${(0.4 - zCrit*1.7).toFixed(1)}, ${(0.4 + zCrit*1.7).toFixed(1)}]</code> → <strong>Crosses 0 ❌</strong> (Could just be pure luck!).`
          ];
      box.innerHTML = `<div><strong>${conf}% Safe Range Rule (Multiplier = ${zCrit}):</strong> Higher certainty (99%) casts a wider net. If a clue's range <strong>crosses 0</strong> (like Noise Pen Color), its effect might just be luck!</div>`
        + stepBox(`Live Step-by-Step ${conf}% Safe Range`, ciSteps);
    }
  };

  // 7. ANOVA & F-TEST FOR R² (mod_anova_f)
  V7.renderAnova = function() {
    const env = setupCanvas('v7-canvas-anova');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.anovaMode || 'multi';
    const noiseLevel = Number(document.getElementById('v7-anova-noise')?.value ?? 1);
    const ssReg = 980;
    const ssRes = 15 * noiseLevel * noiseLevel;
    const ssTot = ssReg + ssRes;
    const p = mode === 'single' ? 1 : 2;
    const n = 10;
    const dfReg = p, dfRes = n - p - 1;
    const msReg = ssReg / dfReg;
    const msRes = ssRes / dfRes;
    const F = msReg / msRes;
    const r2 = ssReg / ssTot;
    const pApprox = Math.exp(-0.5 * Math.min(F, 25));

    ctx.fillStyle = P.text; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`Signal vs Noise Split Check (${mode === 'single' ? '1 Clue' : '2 Clues'})`, 24, 26);

    const barW = W - 80;
    const regW = barW * r2;
    ctx.fillStyle = P.emerald; ctx.fillRect(30, 52, regW, 30);
    ctx.fillStyle = P.rose; ctx.fillRect(30 + regW, 52, barW - regW, 30);
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 11px monospace';
    ctx.fillText(`Explained=${ssReg} (${(r2*100).toFixed(1)}%)`, 38, 71);
    if (barW - regW > 85) {
      ctx.fillStyle = '#fff';
      ctx.fillText(`Noise ${ssRes.toFixed(0)}`, 34 + regW, 71);
    }

    ctx.fillStyle = P.sky; ctx.font = 'bold 13px monospace';
    ctx.fillText(`Signal/Noise Ratio = ${msReg.toFixed(1)} / ${msRes.toFixed(1)} = ${F.toFixed(2)}`, 30, 125);
    ctx.fillStyle = pApprox < 0.05 ? P.emerald : P.amber;
    ctx.fillText(`Luck Chance for Score Explained: ${pApprox < 0.0001 ? '< 0.0001 (Real Pattern!)' : pApprox.toFixed(4)}`, 30, 152);

    const box = document.getElementById('v7-anova-readout');
    if (box) box.innerHTML = `<div><strong>Overall Signal Check (${n} students, ${p} clues):</strong> Explained per Clue = <code>${ssReg}/${dfReg} = ${msReg.toFixed(1)}</code> | Avg Leftover Error = <code>${ssRes.toFixed(1)}/${dfRes} = ${msRes.toFixed(1)}</code> → <code>Signal Ratio = ${F.toFixed(2)}</code>. Bigger ratio = tiny luck chance!</div>`
      + stepBox('Live Step-by-Step Signal vs. Noise Check', [
        `Count clues & leftover points: <code>Clues = ${p}</code>, <code>Leftover Points = ${n} − ${p} − 1 = ${dfRes}</code>.`,
        `Average spread per item: <code>Explained per Clue = ${ssReg} ÷ ${dfReg} = ${msReg.toFixed(1)}</code> | <code>Avg Leftover Error = ${ssRes.toFixed(1)} ÷ ${dfRes} = ${msRes.toFixed(1)}</code>.`,
        `Signal Ratio & Score Explained: <code>Ratio = ${msReg.toFixed(1)} ÷ ${msRes.toFixed(1)} = <strong>${F.toFixed(2)}</strong></code> | <code>Explained = ${ssReg} ÷ (${ssReg} + ${ssRes.toFixed(1)}) = <strong>${(r2*100).toFixed(1)}%</strong></code>.`
      ]);
  };

  // 8. FISHER'S EXACT TEST (mod_fisher)
  V7.renderFisher = function() {
    const env = setupCanvas('v7-canvas-fisher');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const a = Number(document.getElementById('v7-fish-a')?.value ?? 4);
    const b = 5 - a;
    const c = 1;
    const d = 4;
    const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
    const comb = (n, k) => fact(n) / (fact(k) * fact(n - k));
    const totalN = a + b + c + d;
    const row1 = a + b, col1 = a + c;
    const exactP = (comb(row1, a) * comb(c + d, c)) / comb(totalN, col1);

    ctx.fillStyle = P.text; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`Fisher's Exact Hypergeometric Distribution (n=${totalN} Students)`, 24, 26);

    const maxK = Math.min(row1, col1);
    const barSlot = (W - 80) / (maxK + 1);
    let pTwoSided = 0;
    const probs = [];
    for (let k = 0; k <= maxK; k++) {
      const cc = col1 - k;
      if (cc < 0 || cc > c + d) { probs.push(0); continue; }
      const pk = (comb(row1, k) * comb(c + d, cc)) / comb(totalN, col1);
      probs.push(pk);
      if (pk <= exactP + 1e-9) pTwoSided += pk;
    }

    probs.forEach((pk, k) => {
      const bx = 42 + k * barSlot;
      const bh = pk * 220;
      const isObs = k === a;
      ctx.fillStyle = isObs ? P.amber : (pk <= exactP + 1e-9 ? P.rose : P.sky);
      ctx.fillRect(bx, H - 45 - bh, Math.max(24, barSlot - 16), bh);
      ctx.fillStyle = P.text; ctx.font = '10px monospace';
      ctx.fillText(`a=${k}`, bx + 2, H - 25);
      ctx.fillText(`${(pk*100).toFixed(1)}%`, bx, H - 50 - bh);
    });

    const box = document.getElementById('v7-fisher-readout');
    if (box) box.innerHTML = `<div><strong>2×2 Table [Pass-Tutor=${a}, Fail-Tutor=${b}, Pass-Solo=${c}, Fail-Solo=${d}]:</strong> Exact P(this table) = <code>${exactP.toFixed(4)}</code> | Two-sided Fisher p-value = <strong>${Math.min(1, pTwoSided).toFixed(4)}</strong> ${pTwoSided < 0.05 ? '(Significant!)' : '(Small-sample uncertain)'}</div>`
      + stepBox("Live Step-by-Step Fisher's Exact Hypergeometric Test", [
        `Row & column totals: Tutor Row = <code>${a}+${b}=${row1}</code>, Solo Row = <code>${c}+${d}=${c+d}</code>, Pass Col = <code>${a}+${c}=${col1}</code>, Total <code>N=${totalN}</code>.`,
        `Combinations numerator: <code>C(${row1},${a}) × C(${c+d},${c}) = ${comb(row1,a)} × ${comb(c+d,c)} = ${comb(row1,a)*comb(c+d,c)}</code>.`,
        `Exact table probability: <code>${comb(row1,a)*comb(c+d,c)} ÷ C(${totalN},${col1}) = ${comb(row1,a)*comb(c+d,c)} ÷ ${comb(totalN,col1)} = <strong>${exactP.toFixed(4)}</strong></code>.`,
        `Sum all extreme tables with <code>P ≤ ${exactP.toFixed(4)}</code> → Two-sided <code>p = <strong>${Math.min(1, pTwoSided).toFixed(4)}</strong></code>.`
      ]);
  };

  // 9. PURE GRADIENT ALONE (mod4_grad)
  V7.renderGrad = function() {
    const env = setupCanvas('v7-canvas-grad');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.gradMode || 'single';
    const w1 = Number(document.getElementById('v7-grad-w1')?.value ?? 4);
    const pad = { l: 55, r: 30, t: 35, b: 42 };

    if (mode === 'single') {
      drawAxes(ctx, W, H, P, pad, 'Slope Weight w₁ (Optimal = 10)', 'Squared Loss L(w₁)');
      const toX = w => pad.l + ((w - 2) / 16) * (W - pad.l - pad.r);
      const toY = l => H - pad.b - (l / 1200) * (H - pad.t - pad.b);
      ctx.strokeStyle = P.sky; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let w = 2; w <= 18; w += 0.25) {
        const loss = 15 * (w - 10) ** 2 + 20;
        const px = toX(w), py = toY(loss);
        if (w === 2) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      const currLoss = 15 * (w1 - 10) ** 2 + 20;
      const slope = 30 * (w1 - 10);
      ctx.fillStyle = P.amber;
      ctx.beginPath(); ctx.arc(toX(w1), toY(currLoss), 7, 0, Math.PI * 2); ctx.fill();
      // Tangent line
      ctx.strokeStyle = P.rose; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toX(w1 - 2.2), toY(currLoss - 2.2 * slope));
      ctx.lineTo(toX(w1 + 2.2), toY(currLoss + 2.2 * slope));
      ctx.stroke();

      const box = document.getElementById('v7-grad-readout');
      if (box) box.innerHTML = `<div><strong>1-Weight Downhill Check:</strong> At <code>Weight = ${w1.toFixed(1)}</code>, Error = <code>${currLoss.toFixed(1)}</code>, Steepness = <code>30(${w1.toFixed(1)}−10) = <strong>${slope.toFixed(1)}</strong></code> → Next Weight (step 0.02): <code>${(w1 - 0.02*slope).toFixed(2)}</code></div>`
        + stepBox('Live Step-by-Step 1-Weight Downhill Stepping', [
          `Check Error at <code>Weight=${w1.toFixed(1)}</code>: <code>15(${w1.toFixed(1)}−10)² + 20 = 15(${((w1-10)**2).toFixed(2)}) + 20 = <strong>${currLoss.toFixed(1)}</strong></code>.`,
          `Measure Bowl Steepness: <code>30 × (${w1.toFixed(1)} − 10) = <strong>${slope.toFixed(1)}</strong></code>.`,
          `Nudge Weight (step size 0.02): <code>Next Weight = ${w1.toFixed(1)} − 0.02 × (${slope.toFixed(1)}) = ${w1.toFixed(1)} − ${(0.02*slope).toFixed(2)} = <strong>${(w1 - 0.02*slope).toFixed(2)}</strong></code>.`
        ]);
    } else {
      // 2D Contour gradient vector [∂L/∂w1, ∂L/∂w2]
      drawAxes(ctx, W, H, P, pad, 'Hours Weight', 'Tests Weight');
      const toX = w => pad.l + ((w - 2) / 14) * (W - pad.l - pad.r);
      const toY = w => H - pad.b - ((w - 0) / 8) * (H - pad.t - pad.b);
      const w2 = 1.0;
      [35, 70, 110, 150].forEach(r => {
        ctx.strokeStyle = P.grid; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(toX(9), toY(4), r * 1.1, r * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.fillStyle = P.emerald; ctx.beginPath(); ctx.arc(toX(9), toY(4), 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(toX(w1), toY(w2), 7, 0, Math.PI * 2); ctx.fill();

      const g1 = 2 * (w1 - 9), g2 = 6 * (w2 - 4);
      ctx.strokeStyle = P.rose; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(toX(w1), toY(w2)); ctx.lineTo(toX(w1 - 0.15 * g1), toY(w2 - 0.15 * g2)); ctx.stroke();

      const box = document.getElementById('v7-grad-readout');
      if (box) box.innerHTML = `<div><strong>2-Weight Downhill Compass:</strong> At <code>(${w1.toFixed(1)}, ${w2.toFixed(1)})</code> → <code>Nudge Pulls = [<strong>${g1.toFixed(1)}, ${g2.toFixed(1)}</strong>]</code> → Arrow points straight downhill toward best weights (9.0, 4.0)!</div>`
        + stepBox('Live Step-by-Step 2-Weight Compass', [
          `Find pull on Hours Weight: <code>2(${w1.toFixed(1)} − 9) = <strong>${g1.toFixed(1)}</strong></code>.`,
          `Find pull on Tests Weight: <code>6(${w2.toFixed(1)} − 4) = <strong>${g2.toFixed(1)}</strong></code>.`,
          `Take downhill step (size 0.15): <code>Next Weights = [${w1.toFixed(1)} − 0.15(${g1.toFixed(1)}), ${w2.toFixed(1)} − 0.15(${g2.toFixed(1)})] = <strong>(${(w1 - 0.15*g1).toFixed(2)}, ${(w2 - 0.15*g2).toFixed(2)})</strong></code>.`
        ]);
    }
  };

  // 10. HESSIAN CURVATURE & NEWTON STEP (mod4_hessian)
  V7.renderHessian = function() {
    const env = setupCanvas('v7-canvas-hessian');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.hessMode || 'single';
    const curv = Number(document.getElementById('v7-hess-curv')?.value ?? 8);
    const pad = { l: 55, r: 30, t: 35, b: 42 };
    drawAxes(ctx, W, H, P, pad, 'Weight w (Minimum at w* = 5)', 'Loss L(w)');

    const toX = w => pad.l + (w / 10) * (W - pad.l - pad.r);
    const toY = l => H - pad.b - Math.min(1, l / 300) * (H - pad.t - pad.b);
    ctx.strokeStyle = P.sky; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let w = 0; w <= 10; w += 0.2) {
      const loss = 0.5 * curv * (w - 5) ** 2 + 15;
      const px = toX(w), py = toY(loss);
      if (w === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const w0 = 2.0;
    const g = curv * (w0 - 5);
    const h = curv;
    const newtonStep = -g / h;
    const fixedGradNew = w0 - 0.15 * g;
    const newtonNew = w0 + newtonStep;

    ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(toX(w0), toY(0.5*h*(w0-5)**2 + 15), 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = P.emerald; ctx.beginPath(); ctx.arc(toX(newtonNew), toY(15), 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = P.rose; ctx.beginPath(); ctx.arc(toX(Math.min(10, Math.max(0, fixedGradNew))), toY(0.5*h*(fixedGradNew-5)**2 + 15), 6, 0, Math.PI*2); ctx.fill();

    const box = document.getElementById('v7-hess-readout');
    if (box) box.innerHTML = (mode === 'single'
      ? `<div><strong>Bowl Steepness = ${h.toFixed(1)}:</strong> Slope at weight 2 is <code>${g.toFixed(1)}</code>. A blind downhill step lands at <code>${fixedGradNew.toFixed(2)}</code>, whereas <strong>dividing by steepness (<code>−Slope ÷ Steepness = ${newtonStep.toFixed(1)}</code>) jumps straight to the bottom (5.00) in ONE leap!</strong></div>`
      : `<div><strong>2-Direction Bowl Steepness (Hours: ${h.toFixed(1)}, Tests: 2.0):</strong> Measuring steepness along each axis automatically shrinks big steps on steep directions and boosts flat directions — the exact trick inside XGBoost leaf jumps!</div>`)
      + stepBox('Live Step-by-Step Smart Bowl-Jump', [
        `Slope at starting weight <code>2.0</code>: <code>${curv.toFixed(1)} × (2.0 − 5.0) = <strong>${g.toFixed(1)}</strong></code>.`,
        `Bowl Steepness (how fast slope curves): <code><strong>${h.toFixed(1)}</strong></code>.`,
        `Blind Small Step (size 0.15): <code>2.0 − 0.15(${g.toFixed(1)}) = <strong>${fixedGradNew.toFixed(2)}</strong></code> (can fall short or overshoot!).`,
        `Smart Bowl-Jump Step: <code>Jump = −(${g.toFixed(1)}) ÷ ${h.toFixed(1)} = ${newtonStep.toFixed(2)}</code> → <code>Next Weight = 2.0 + ${newtonStep.toFixed(2)} = <strong>${newtonNew.toFixed(2)}</strong></code>.`
      ]);
  };

  // 11. IDF & IDFT DUAL CANVAS (mod_idf_idft)
  V7.renderIdfIdft = function() {
    const env = setupCanvas('v7-canvas-idf');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.idfMode || 'idft_multi';

    if (mode === 'idf') {
      const df = Number(document.getElementById('v7-idf-df')?.value ?? 1);
      const N = 100;
      const idfVal = Math.log((N + 1) / (df + 1)) + 1;
      const terms = [
        { t: '"homework" (df=85)', val: Math.log(101 / 86) + 1, col: P.muted },
        { t: '"quiz" (df=35)', val: Math.log(101 / 36) + 1, col: P.sky },
        { t: `Chosen Clue (df=${df})`, val: idfVal, col: P.emerald }
      ];
      ctx.fillStyle = P.text; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'left';
      ctx.fillText(`Pattern Rarity Weights (${N} Links): Common Shrunk, Rare Boosted`, 24, 28);
      terms.forEach((tm, idx) => {
        const y = 62 + idx * 54;
        const bw = (tm.val / 5.5) * (W - 140);
        ctx.fillStyle = P.text; ctx.font = '11px monospace'; ctx.fillText(tm.t, 28, y - 6);
        ctx.fillStyle = tm.col; ctx.fillRect(28, y, bw, 24);
        ctx.fillStyle = P.text; ctx.fillText(`rarity = ${tm.val.toFixed(2)}`, 36 + bw, y + 17);
      });
      const box = document.getElementById('v7-idf-readout');
      if (box) box.innerHTML = `<div><strong>Pattern Rarity Bonus:</strong> Seen in <code>${df} of ${N}</code> links → <code>Rarity Bonus = ln(101/${df+1}) + 1 = <strong>${idfVal.toFixed(2)}</strong></code>. Final importance multiplies Softened Count by Rarity Bonus!</div>`
        + stepBox('Live Step-by-Step Smooth Rarity Bonus', [
          `Compute padded ratio: <code>(Total Links + 1) ÷ (Links With Word + 1) = (100 + 1) ÷ (${df} + 1) = 101 ÷ ${df + 1} = ${(101 / (df + 1)).toFixed(3)}</code>.`,
          `Take gentle log: <code>ln(${(101 / (df + 1)).toFixed(3)}) = ${Math.log(101 / (df + 1)).toFixed(3)}</code>.`,
          `Add 1 safety baseline: <code>${Math.log(101 / (df + 1)).toFixed(3)} + 1 = <strong>${idfVal.toFixed(2)}</strong></code>.`
        ]);
    } else {
      // IDFT Waveform Reconstructor
      const a1 = Number(document.getElementById('v7-idft-a1')?.value ?? 2.0);
      const a2 = mode === 'idft_single' ? 0 : Number(document.getElementById('v7-idft-a2')?.value ?? 1.0);
      const pad = { l: 55, r: 30, t: 35, b: 42 };
      drawAxes(ctx, W, H, P, pad, 'Time Step n (0 to N=16)', 'Reconstructed Signal x[n]');
      const toX = n => pad.l + (n / 16) * (W - pad.l - pad.r);
      const toY = v => (pad.t + H - pad.b) / 2 - (v / 3.5) * ((H - pad.t - pad.b) / 2.2);

      ctx.strokeStyle = P.emerald; ctx.lineWidth = 2.5; ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const n = i / 4;
        const val = a1 * Math.cos((2 * Math.PI * 1 * n) / 16) + a2 * Math.cos((2 * Math.PI * 3 * n) / 16);
        const px = toX(n), py = toY(val);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      const box = document.getElementById('v7-idf-readout');
      if (box) box.innerHTML = (mode === 'idft_single'
        ? `<div><strong>IDFT Single Frequency (1 Wave):</strong> <code>x[n] = ${a1.toFixed(1)}·cos(2π·1·n/16)</code> → Smooth pure sine/cosine cycle!</div>`
        : `<div><strong>IDFT Multi-Frequency Sum (Chord):</strong> <code>x[n] = ${a1.toFixed(1)}·cos(1×freq) + ${a2.toFixed(1)}·cos(3×freq)</code> → Complex signal built from simple frequency weights!</div>`)
        + stepBox('Live Step-by-Step Signal Reconstruction (at n=0 and n=2)', [
          `At <code>n=0</code>: <code>x[0] = ${a1.toFixed(1)}·cos(0) + ${a2.toFixed(1)}·cos(0) = ${a1.toFixed(1)}(1) + ${a2.toFixed(1)}(1) = <strong>${(a1 + a2).toFixed(2)}</strong></code>.`,
          `At <code>n=2</code> (angle <code>2π·2/16 = π/4</code>): <code>x[2] = ${a1.toFixed(1)}·cos(π/4) + ${a2.toFixed(1)}·cos(3π/4) = ${(a1*Math.cos(Math.PI/4)).toFixed(2)} + ${(a2*Math.cos(3*Math.PI/4)).toFixed(2)} = <strong>${(a1*Math.cos(Math.PI/4) + a2*Math.cos(3*Math.PI/4)).toFixed(2)}</strong></code>.`
        ]);
    }
  };

  // 12. LOGISTIC ODDS & MLE & WALD (mod6_odds, mod6_mle, mod6_wald)
  V7.renderLogitOdds = function() {
    const env = setupCanvas('v7-canvas-odds');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.oddsMode || 'single';
    const hrs = Number(document.getElementById('v7-odds-hrs')?.value ?? 3.5);
    const tests = mode === 'single' ? 0 : Number(document.getElementById('v7-odds-tests')?.value ?? 2);
    const pad = { l: 55, r: 30, t: 35, b: 42 };
    drawAxes(ctx, W, H, P, pad, 'Log-Odds z = β₀ + β₁x₁ (+ β₂x₂)', 'Pass Probability σ(z)');
    const toX = z => pad.l + ((z + 6) / 12) * (W - pad.l - pad.r);
    const toY = p => H - pad.b - p * (H - pad.t - pad.b);

    ctx.strokeStyle = P.sky; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let z = -6; z <= 6; z += 0.2) {
      const p = 1 / (1 + Math.exp(-z));
      if (z === -6) ctx.moveTo(toX(z), toY(p)); else ctx.lineTo(toX(z), toY(p));
    }
    ctx.stroke();

    const zVal = mode === 'single' ? (-5 + 1.8 * hrs) : (-5.5 + 1.5 * hrs + 0.9 * tests);
    const pVal = 1 / (1 + Math.exp(-zVal));
    const odds = pVal / Math.max(1e-6, 1 - pVal);
    ctx.fillStyle = P.amber; ctx.beginPath(); ctx.arc(toX(Math.max(-6, Math.min(6, zVal))), toY(pVal), 7, 0, Math.PI * 2); ctx.fill();

    const box = document.getElementById('v7-odds-readout');
    if (box) {
      const zExpr = mode === 'single' ? `-5 + 1.8(${hrs.toFixed(1)}) = -5 + ${(1.8*hrs).toFixed(2)}` : `-5.5 + 1.5(${hrs.toFixed(1)}) + 0.9(${tests}) = -5.5 + ${(1.5*hrs).toFixed(2)} + ${(0.9*tests).toFixed(2)}`;
      box.innerHTML = (mode === 'single'
        ? `<div><strong>1-Feature (Hours=${hrs.toFixed(1)}):</strong> <code>z = -5 + 1.8(${hrs.toFixed(1)}) = ${zVal.toFixed(2)}</code> → Odds = <code>e^(${zVal.toFixed(2)}) = ${odds.toFixed(2)}</code> → Pass Probability = <strong>${(pVal*100).toFixed(1)}%</strong></div>`
        : `<div><strong>Multi-Feature (Hours=${hrs.toFixed(1)}, Tests=${tests}):</strong> Odds Ratio per Test = <code>e^(0.9) = 2.46×</code>! Total <code>z=${zVal.toFixed(2)}</code> → Pass Probability = <strong>${(pVal*100).toFixed(1)}%</strong></div>`)
        + stepBox('Live Step-by-Step Log-Odds → Odds → Probability', [
          `Compute Log-Odds: <code>z = ${zExpr} = <strong>${zVal.toFixed(2)}</strong></code>.`,
          `Exponentiate to get Odds: <code>Odds = e^(${zVal.toFixed(2)}) = <strong>${odds.toFixed(2)}</strong></code>.`,
          `Convert via Sigmoid: <code>p = 1 ÷ (1 + e^(${(-zVal).toFixed(2)})) = 1 ÷ (1 + ${Math.exp(-zVal).toFixed(3)}) = ${pVal.toFixed(4)} = <strong>${(pVal*100).toFixed(1)}%</strong></code>.`
        ]);
    }
  };

  V7.renderMLE = function() {
    const env = setupCanvas('v7-canvas-mle');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const slope = Number(document.getElementById('v7-mle-slope')?.value ?? 1.8);
    const pad = { l: 55, r: 30, t: 35, b: 42 };
    drawAxes(ctx, W, H, P, pad, 'Study Hours (x₁)', 'Predicted Pass Prob p(y=1)');
    const pts = [{ h: 1, y: 0 }, { h: 2, y: 0 }, { h: 3, y: 1 }, { h: 4, y: 1 }, { h: 5, y: 1 }];
    const toX = h => pad.l + (h / 6) * (W - pad.l - pad.r);
    const toY = p => H - pad.b - p * (H - pad.t - pad.b);

    ctx.strokeStyle = P.sky; ctx.lineWidth = 2.5; ctx.beginPath();
    for (let h = 0.2; h <= 5.8; h += 0.1) {
      const p = 1 / (1 + Math.exp(-(-4.5 + slope * h)));
      if (h === 0.2) ctx.moveTo(toX(h), toY(p)); else ctx.lineTo(toX(h), toY(p));
    }
    ctx.stroke();

    let likelihood = 1, logLik = 0;
    const mleRows = [];
    pts.forEach(pt => {
      const p = 1 / (1 + Math.exp(-(-4.5 + slope * pt.h)));
      const li = pt.y === 1 ? p : (1 - p);
      likelihood *= li;
      logLik += Math.log(Math.max(li, 1e-6));
      mleRows.push({ h: pt.h, y: pt.y, p, li });
      ctx.fillStyle = pt.y === 1 ? P.emerald : P.rose;
      ctx.beginPath(); ctx.arc(toX(pt.h), toY(pt.y), 6, 0, Math.PI * 2); ctx.fill();
      ctx.setLineDash([3, 3]); ctx.strokeStyle = P.amber;
      ctx.beginPath(); ctx.moveTo(toX(pt.h), toY(pt.y)); ctx.lineTo(toX(pt.h), toY(p)); ctx.stroke();
      ctx.setLineDash([]);
    });

    const box = document.getElementById('v7-mle-readout');
    if (box) box.innerHTML = `<div><strong>Slope Try m=${slope.toFixed(1)}:</strong> Joint Likelihood <code>∏ Lᵢ = ${(likelihood*100).toFixed(2)}%</code> | Log-Likelihood <code>ln(L) = <strong>${logLik.toFixed(2)}</strong></code> (Drag slope toward ~1.8–2.0 to MAXIMIZE Log-Likelihood!)</div>`
      + stepBox('Live Step-by-Step Maximum Likelihood (MLE)', [
        `Compute predicted probability <code>pᵢ = σ(−4.5 + ${slope.toFixed(1)}h)</code> and match likelihood <code>Lᵢ</code> (<code>pᵢ</code> if y=1, <code>1−pᵢ</code> if y=0): <code>[${mleRows.map(r => `h=${r.h}→${r.li.toFixed(2)}`).join(', ')}]</code>.`,
        `Multiply all 5 likelihoods: <code>${mleRows.map(r => r.li.toFixed(2)).join(' × ')} = <strong>${likelihood.toFixed(4)} (${(likelihood*100).toFixed(2)}%)</strong></code>.`,
        `Sum natural logs: <code>Σ ln(Lᵢ) = ${mleRows.map(r => Math.log(Math.max(r.li, 1e-6)).toFixed(2)).join(' + ')} = <strong>${logLik.toFixed(2)}</strong></code>.`
      ]);
  };

  V7.renderWald = function() {
    const env = setupCanvas('v7-canvas-wald');
    if (!env) return;
    const { ctx, W, H, P } = env;
    const mode = V7.state.waldMode || 'multi';
    const pad = { l: 45, r: 30, t: 35, b: 40 };
    const toX = z => pad.l + ((z + 4) / 8) * (W - pad.l - pad.r);
    const toY = g => H - pad.b - g * (H - pad.t - pad.b) * 0.88;

    ctx.strokeStyle = P.sky; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let z = -4; z <= 4; z += 0.1) {
      const px = toX(z), py = toY(Math.exp(-0.5 * z * z));
      if (z === -4) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();

    const drawMarker = (zVal, col, lbl) => {
      const clampZ = Math.max(-3.8, Math.min(3.8, zVal));
      ctx.strokeStyle = col; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(toX(clampZ), toY(0)); ctx.lineTo(toX(clampZ), toY(0.95)); ctx.stroke();
      ctx.fillStyle = col; ctx.font = 'bold 11px monospace'; ctx.fillText(lbl, toX(clampZ) - 35, 24);
    };

    drawMarker(2.45, P.emerald, 'Hours Score +2.45 (Luck=0.014 ✅)');
    if (mode === 'multi') {
      drawMarker(0.21, P.rose, 'PenColor +0.21 (Luck=0.83 ❌)');
    }
    const box = document.getElementById('v7-wald-readout');
    if (box) box.innerHTML = (mode === 'single'
      ? `<div><strong>1-Clue Signal Check:</strong> <code>Signal Score = Weight ÷ Wiggle Margin = 1.80 / 0.735 = <strong>+2.45</strong></code> → Beats the 1.96 threshold → <strong>Luck Chance = 0.014</strong> (Study Hours truly matters!).</div>`
      : `<div><strong>2-Clue Signal Check (Yes/No Chance Model):</strong> <code>Hours</code> scores <code>+2.45 (Luck 0.014, Keep!)</code>, while <code>PenColor</code> scores <code>+0.21 (Luck 0.83, Noise — Drop!)</code>.</div>`)
      + stepBox('Live Step-by-Step Weight Signal Check', [
        `Divide each weight by its wiggle margin: <code>Hours = 1.80 ÷ 0.735 = <strong>+2.45</strong></code>${mode === 'multi' ? ` | <code>PenColor = 0.15 ÷ 0.714 = <strong>+0.21</strong></code>` : ''}.`,
        `Compare against the 95% cutoff (<code>1.96</code>): <code>2.45 &gt; 1.96</code> → <code>Luck = 0.014 &lt; 0.05</code> (Keep Hours ✅)${mode === 'multi' ? `; <code>0.21 &lt; 1.96</code> → <code>Luck = 0.83</code> (Drop PenColor ❌)` : ''}.`
      ]);
  };

  V7.initForModule = function(modId) {
    setTimeout(() => {
      if (modId === 'mod_vec') V7.renderVec();
      else if (modId === 'mod_design') V7.renderDesign();
      else if (modId === 'mod_corr') V7.renderCorr();
      else if (modId === 'mod_bestfit') V7.renderBestFit();
      else if (modId === 'mod_coeff_r2') V7.renderCoeffR2();
      else if (modId === 'mod_pval_ci') V7.renderPvalCI();
      else if (modId === 'mod_ttest' && window.InteractiveStudios?.pvalueReg) window.InteractiveStudios.pvalueReg.init();
      else if (modId === 'mod_anova_f') V7.renderAnova();
      else if (modId === 'mod_fisher') V7.renderFisher();
      else if (modId === 'mod4_grad') V7.renderGrad();
      else if (modId === 'mod4_hessian') V7.renderHessian();
      else if (modId === 'mod_idf_idft') V7.renderIdfIdft();
      else if (modId === 'mod6_odds') V7.renderLogitOdds();
      else if (modId === 'mod6_mle') V7.renderMLE();
      else if (modId === 'mod6_deviance' && window.InteractiveStudios?.logisticDeviance) {
        window.InteractiveStudios.logisticDeviance.syncUI();
        window.InteractiveStudios.logisticDeviance.render();
      }
      else if (modId === 'mod6_wald') V7.renderWald();
      else if (modId === 'mod4_opt' && typeof drawMod4GradientCanvas === 'function') drawMod4GradientCanvas();
      else if (modId === 'mod9' && typeof drawMod9TreeCanvas === 'function') drawMod9TreeCanvas();
      else if (modId === 'mod12' && typeof drawMod12KMeansCanvas === 'function') drawMod12KMeansCanvas();
      else if (modId === 'mod14' && typeof drawMod14NeuralCanvas === 'function') drawMod14NeuralCanvas();
    }, 35);
  };
})();

// Unified canvas refresh trigger for v8 Part-by-Part slide transitions
window.v8RefreshModuleCanvases = function(modId) {
  if (!modId && typeof appState !== 'undefined') modId = appState.activeModuleId;
  try {
    if (typeof initActiveCurriculumModuleSims === 'function') initActiveCurriculumModuleSims();
  } catch (_) {}
  try {
    if (window.V7Studios) window.V7Studios.initForModule(modId);
  } catch (_) {}
  try {
    if ((modId === 'mod_ttest' || modId === 'mod3') && window.InteractiveStudios && window.InteractiveStudios.pvalueReg) {
      window.InteractiveStudios.pvalueReg.init();
    } else if ((modId === 'mod6_deviance' || modId === 'mod6') && window.InteractiveStudios && window.InteractiveStudios.logisticDeviance) {
      window.InteractiveStudios.logisticDeviance.syncUI();
      window.InteractiveStudios.logisticDeviance.render();
    } else if (modId === 'mod9' && window.InteractiveStudios && window.InteractiveStudios.mlTree) {
      window.InteractiveStudios.mlTree.syncUI();
      window.InteractiveStudios.mlTree.render();
    }
  } catch (_) {}
  try {
    if (modId === 'mod0') {
      if (typeof drawMod0HousingCanvas === 'function') drawMod0HousingCanvas();
      if (typeof drawMod0Step2House === 'function') drawMod0Step2House();
      if (typeof drawMod0Taxi === 'function') drawMod0Taxi();
    }
  } catch (_) {}
  try {
    if (typeof updateMlModUniversalSim === 'function' && document.getElementById('ml-mod-universal-canvas')) {
      updateMlModUniversalSim(modId);
    }
  } catch (_) {}
  try {
    if (typeof initMatplotlibStudio === 'function') initMatplotlibStudio();
  } catch (_) {}
};

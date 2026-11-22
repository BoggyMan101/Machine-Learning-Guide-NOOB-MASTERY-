// ============================================================================
// ACADEMY LEARNING & MODEL STATISTICS LAB (v8.2)
// Zero Tests • Zero Page Crowding • Teaches Exact Statistics Calculation
// for Every Training Model + Numbers Movie + Same-Data Showdown in a Clean Drawer
// ============================================================================
(function (global) {
  'use strict';

  function esc(val) {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function detectAcad() {
    var path = (global.location && global.location.pathname ? global.location.pathname : '').toLowerCase();
    if (path.indexOf('lurelock') !== -1) return 'll';
    if (path.indexOf('ml_interactive') !== -1) return 'ml';
    return 'ml';
  }

  function getActiveModId() {
    try {
      if (global.appState && global.appState.activeModuleId) return global.appState.activeModuleId;
    } catch (_) {}
    return 'mod0';
  }

  function fmt(num, digits) {
    if (num === null || num === undefined || isNaN(num) || !isFinite(num)) return '—';
    var d = typeof digits === 'number' ? digits : 3;
    return Number(num).toFixed(d);
  }

  function fmtSigned(num, digits) {
    if (num === null || num === undefined || isNaN(num) || !isFinite(num)) return '—';
    var d = typeof digits === 'number' ? digits : 3;
    var v = Number(num);
    return (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d);
  }

  function sigmoid(z) {
    var c = Math.max(-30, Math.min(30, z));
    return 1 / (1 + Math.exp(-c));
  }

  function logit(p) {
    var c = Math.max(1e-6, Math.min(1 - 1e-6, p));
    return Math.log(c / (1 - c));
  }

  // Exact statistical distribution helpers (Lanczos Gamma + Incomplete Beta + Erf)
  function gammaLn(z) {
    var c = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.138571095836526, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - gammaLn(1 - z);
    z -= 1;
    var base = c[0];
    for (var i = 1; i < 9; i++) base += c[i] / (z + i);
    var t = z + 7.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(base);
  }

  function betacf(x, a, b) {
    var maxIt = 100, eps = 1e-12;
    var qab = a + b, qap = a + 1, qam = a - 1;
    var c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < eps) d = eps;
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= maxIt; m++) {
      var m2 = 2 * m;
      var aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < eps) d = eps;
      c = 1 + aa / c; if (Math.abs(c) < eps) c = eps;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < eps) d = eps;
      c = 1 + aa / c; if (Math.abs(c) < eps) c = eps;
      d = 1 / d;
      var del = d * c;
      h *= del;
      if (Math.abs(del - 1) < eps) break;
    }
    return h;
  }

  function betainc(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    var bt = Math.exp(gammaLn(a + b) - gammaLn(a) - gammaLn(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) return bt * betacf(x, a, b) / a;
    return 1 - bt * betacf(1 - x, b, a) / b;
  }

  function tPValue(tStat, df) {
    if (!isFinite(tStat) || isNaN(tStat) || df <= 0) return 1.0;
    var absT = Math.abs(tStat);
    var x = df / (df + absT * absT);
    var p = betainc(x, df / 2, 0.5);
    return Math.max(0.00001, Math.min(1.0, p));
  }

  function fPValue(fStat, df1, df2) {
    if (!isFinite(fStat) || isNaN(fStat) || fStat <= 0 || df1 <= 0 || df2 <= 0) return 1.0;
    var x = df2 / (df2 + df1 * fStat);
    var p = betainc(x, df2 / 2, df1 / 2);
    return Math.max(0.00001, Math.min(1.0, p));
  }

  function erfApprox(x) {
    var sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return sign * y;
  }

  function normalPValue(z) {
    if (!isFinite(z) || isNaN(z)) return 1.0;
    var p = 1 - erfApprox(Math.abs(z) / Math.SQRT2);
    return Math.max(0.00001, Math.min(1.0, p));
  }

  function fmtP(p) {
    if (p < 0.0001) return '< 0.0001';
    return p.toFixed(4);
  }

  function solve2x2(A, b) {
    var det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (Math.abs(det) < 1e-10) return null;
    return {
      x: [
        (A[1][1] * b[0] - A[0][1] * b[1]) / det,
        (-A[1][0] * b[0] + A[0][0] * b[1]) / det
      ],
      inv: [
        [A[1][1] / det, -A[0][1] / det],
        [-A[1][0] / det, A[0][0] / det]
      ]
    };
  }

  function invert3x3(M) {
    var a = M[0][0], b = M[0][1], c = M[0][2];
    var d = M[1][0], e = M[1][1], f = M[1][2];
    var g = M[2][0], h = M[2][1], i = M[2][2];
    var A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
    var D = -(b * i - c * h), E = a * i - c * g, F = -(a * h - b * g);
    var G = b * f - c * e, H = -(a * f - c * d), I = a * e - b * d;
    var det = a * A + b * B + c * C;
    if (Math.abs(det) < 1e-10) return null;
    return [
      [A / det, D / det, G / det],
      [B / det, E / det, H / det],
      [C / det, F / det, I / det]
    ];
  }

  // ============================================================================
  // CURATED NUMBERS MOVIES (Test-Free Step-by-Step Numerical Walkthroughs)
  // ============================================================================
  var ALL_MOVIES = {"linear_regression": {"title": "Linear Regression Numbers Movie: How It Finds the Line Step by Step", "naiveQ": "“How does it find the line?”", "headers": ["Iteration", "Slope (m)", "Intercept (b)", "Guess for 4 hrs (4×Slope + Base)", "Real Score (Real)", "Error (Guess − y)", "Gradient (Slope Nudge)", "Update Applied"], "steps": [{"label": "Step 1: Cold Start (Wild Initial Guess)", "summary": "The model starts with lazy default knobs: m = 0 pts/hr and b = 40 pts. For a student who studied 4 hours (real score y = 80), it guesses only 40 pts — missing by −40 points!", "rows": [["Iter 0 (Start)", "0.00", "40.00", "4(0) + 40 = 40.0", "80.0", "−40.0 (Way too low!)", "−320.0 (Steep downhill!)", "Updated Slope = 0 − 0.02(−320) = +6.40"]], "bars": [{"label": "Guess", "val": 40, "max": 100, "col": "sky"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 40, "max": 100, "col": "rose"}]}, {"label": "Step 2: First Gradient Nudge (Line Tilts Upward)", "summary": "Because the gradient was −320 (negative means 'raise m!'), the update raises m from 0.00 to +6.40. Now for 4 hours it guesses 65.6 pts — cutting the error from −40 down to −14.4!", "rows": [["Iter 0", "0.00", "40.00", "40.0", "80.0", "−40.0", "−320.0", "m → +6.40"], ["Iter 1", "6.40", "40.00", "4(6.4) + 40 = 65.6", "80.0", "−14.4 (Closer!)", "−115.2 (Smaller slope)", "Updated Slope = 6.40 − 0.02(−115.2) = +8.70"]], "bars": [{"label": "Guess", "val": 65.6, "max": 100, "col": "sky"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 14.4, "max": 100, "col": "amber"}]}, {"label": "Step 3: Second Update (Approaching the Best-Fit Line)", "summary": "At m = 8.70, the guess for 4 hours is 74.8 pts (error = −5.2). Notice how the gradient shrinks (−41.6) as the line gets closer to the truth, so the steps automatically get gentler!", "rows": [["Iter 0", "0.00", "40.00", "40.0", "80.0", "−40.0", "−320.0", "m → +6.40"], ["Iter 1", "6.40", "40.00", "65.6", "80.0", "−14.4", "−115.2", "m → +8.70"], ["Iter 2", "8.70", "40.00", "4(8.7) + 40 = 74.8", "80.0", "−5.2 (Almost there!)", "−41.6", "Updated Slope = 8.70 − 0.02(−41.6) = +9.53"]], "bars": [{"label": "Guess", "val": 74.8, "max": 100, "col": "sky"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 5.2, "max": 100, "col": "amber"}]}, {"label": "Step 4: Convergence (Gradient Hits 0 = Best-Fit Line Found!)", "summary": "By Iteration 10, m = 10.00 and b = 40.00. Now 4(10) + 40 = 80.0 pts! Error is 0.0, Gradient is 0.0, and the update is 0 — the line locks into place!", "rows": [["Iter 0", "0.00", "40.00", "40.0", "80.0", "−40.0", "−320.0", "m → +6.40"], ["Iter 1", "6.40", "40.00", "65.6", "80.0", "−14.4", "−115.2", "m → +8.70"], ["Iter 2", "8.70", "40.00", "74.8", "80.0", "−5.2", "−41.6", "m → +9.53"], ["Iter 10 (Converged)", "10.00", "40.00", "4(10) + 40 = 80.0", "80.0", "0.0 (Bullseye!)", "0.0 (Flat bottom!)", "Done! Final Line: Guess = 10x + 40"]], "bars": [{"label": "Guess", "val": 80, "max": 100, "col": "emerald"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 0, "max": 100, "col": "emerald"}]}]}, "logistic_regression": {"title": "Logistic Regression Numbers Movie: Score z → Sigmoid p → Gradient (p − y) → Weight Update", "naiveQ": "“Why sigmoid? What is log-loss?”", "headers": ["Step / Iteration", "Weight (w)", "Raw Score z = w·x + b", "Sigmoid Squashed Chance (0%–100%)", "True Label (Real)", "Gradient Mistake Gap = Guess − Truth", "Surprise Penalty", "Updated Weight"], "steps": [{"label": "Step 1: Raw Score z = 0.00 on a Phishing Link (y = 1)", "summary": "Our suspect URL has x = 2 red flags (fake 'paypa1' + '.tk' TLD), and true label y = 1 (Phish). Starting with w = 0, b = 0 gives raw score z = 0.00. Sigmoid turns z = 0 into p = 0.50 (50% coin flip).", "rows": [["Iter 0 (Coin Flip)", "w = 0.00", "z = 0(2) + 0 = 0.00", "p = 1/(1+e⁰) = 0.500 (50%)", "y = 1 (Phish)", "g = 0.50 − 1 = −0.50", "−ln(0.50) = 0.693", "Updated Weight = 0 − 0.5(−0.50×2) = +0.50"]], "bars": [{"label": "Phish Prob p (%)", "val": 50.0, "max": 100, "col": "amber"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 69.3, "max": 100, "col": "rose"}]}, {"label": "Step 2: Weight Rises to w = +0.50 → Sigmoid Pushes p to 73.1%", "summary": "Because Mistake Gap = Guess − Truth = −0.50 was negative, subtracting the gradient boosted w to +0.50. Now raw score z = +1.00, which Sigmoid squashes into p = 73.1% probability!", "rows": [["Iter 0", "w = 0.00", "z = 0.00", "p = 0.500 (50.0%)", "y = 1", "g = −0.500", "0.693", "w → +0.50"], ["Iter 1", "w = 0.50", "z = 0.50(2) = +1.00", "p = 1/(1+e⁻¹) = 0.731 (73.1%)", "y = 1", "g = 0.731 − 1 = −0.269", "−ln(0.731) = 0.313", "Updated Weight = 0.50 − 0.5(−0.269×2) = +0.77"]], "bars": [{"label": "Phish Prob p (%)", "val": 73.1, "max": 100, "col": "sky"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 31.3, "max": 100, "col": "amber"}]}, {"label": "Step 3: Weight Reaches w = +1.20 → Sigmoid Pushes p to 91.7%", "summary": "Why Sigmoid? Without Sigmoid, a linear line could output p = +2.40 (240% chance — impossible!). Sigmoid smoothly bends z = +2.40 into a valid 91.7% probability, and Surprise Penalty drops to 0.087.", "rows": [["Iter 0", "w = 0.00", "z = 0.00", "p = 0.500 (50.0%)", "y = 1", "g = −0.500", "0.693", "w → +0.50"], ["Iter 1", "w = 0.50", "z = +1.00", "p = 0.731 (73.1%)", "y = 1", "g = −0.269", "0.313", "w → +0.77"], ["Iter 3", "w = 1.20", "z = 1.20(2) = +2.40", "p = 1/(1+e⁻²·⁴) = 0.917 (91.7%)", "y = 1", "g = 0.917 − 1 = −0.083", "−ln(0.917) = 0.087", "Updated Weight = +1.28"]], "bars": [{"label": "Phish Prob p (%)", "val": 91.7, "max": 100, "col": "emerald"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 8.7, "max": 100, "col": "emerald"}]}, {"label": "Step 4: High-Confidence Convergence (z = +4.00 → p = 98.2% Phishing!)", "summary": "At w = +2.00, raw score z = +4.00, Sigmoid outputs p = 98.2%, residual Mistake Gap = Guess − Truth = −0.018 is nearly zero, and Surprise Penalty is 0.018. The link is flagged as HIGH-RISK PHISHING!", "rows": [["Iter 0", "w = 0.00", "z = 0.00", "p = 50.0%", "y = 1", "g = −0.500", "0.693", "w → +0.50"], ["Iter 1", "w = 0.50", "z = +1.00", "p = 73.1%", "y = 1", "g = −0.269", "0.313", "w → +0.77"], ["Iter 3", "w = 1.20", "z = +2.40", "p = 91.7%", "y = 1", "g = −0.083", "0.087", "w → +1.28"], ["Iter 8 (Converged)", "w = 2.00", "z = 2.00(2) = +4.00", "p = 0.982 (98.2% 🚨)", "y = 1", "g = −0.018 (Tiny)", "0.018 (Near 0!)", "Locked: 98.2% Phish!"]], "bars": [{"label": "Phish Prob p (%)", "val": 98.2, "max": 100, "col": "emerald"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 1.8, "max": 100, "col": "emerald"}]}]}, "ridge_lasso": {"title": "Ridge vs. Lasso Numbers Movie: Watch Weights Shrink as Penalty λ Grows", "naiveQ": "“Why punish big weights?”", "headers": ["Penalty Strength (λ)", "Model Type", "Weight 1 (Study Hours — Real Signal)", "Weight 2 (Shoe Size — Useless Noise)", "Weight 3 (Lucky Shirt — Useless Noise)", "Training Error", "Test Set Error (New Students)"], "steps": [{"label": "Step 1: λ = 0.0 (No Penalty — Overfitting Wildly to Noise!)", "summary": "With λ = 0, the model memorizes the 5 training students by giving huge weights to useless coincidences (Shoe Size Weight 2 = +18.4, Lucky Shirt Weight 3 = −24.0). Training error is 0, but Test Error on new students is a terrible 42.5!", "rows": [["λ = 0.0 (No Penalty)", "Unregularized Best-Fit Line", "+10.2", "+18.4 (Memorized noise!)", "−24.0 (Memorized noise!)", "0.0 pts (Fake perfection)", "42.5 pts (Crashes on test!)"]], "bars": [{"label": "|Weight 1| Real Signal", "val": 10.2, "max": 25, "col": "emerald"}, {"label": "|Weight 2| Shoe Noise", "val": 18.4, "max": 25, "col": "rose"}, {"label": "|Weight 3| Shirt Noise", "val": 24.0, "max": 25, "col": "rose"}]}, {"label": "Step 2: λ = 0.5 (Gentle Penalty — Noise Weights Shrinking)", "summary": "Adding penalty λ = 0.5 charges a 'weight tax' for huge coefficients. Both Ridge (L2) and Lasso (L1) pull the noisy Shoe Size and Lucky Shirt weights down, cutting Test Error in half!", "rows": [["λ = 0.5", "Ridge (L2: λ∑w²)", "+9.9", "+6.2 (Shrunk 3×)", "−7.8 (Shrunk 3×)", "2.1 pts", "14.8 pts (Much better!)"], ["λ = 0.5", "Lasso (L1: λ∑|w|)", "+9.8", "+3.1 (Shrinking fast)", "−4.0 (Shrinking fast)", "2.4 pts", "11.2 pts"]], "bars": [{"label": "|Weight 1| Real Signal", "val": 9.8, "max": 25, "col": "emerald"}, {"label": "Ridge |Weight 2|", "val": 6.2, "max": 25, "col": "amber"}, {"label": "Lasso |Weight 2|", "val": 3.1, "max": 25, "col": "sky"}]}, {"label": "Step 3: λ = 2.0 (Sweet Spot — Lasso Hits EXACTLY 0.00 on Noise!)", "summary": "Look at the difference at λ = 2.0: Ridge shrinks noise weights to small non-zero decimals (+1.4, −1.8), whereas Lasso's absolute-value diamond corner snaps Weight 2 = 0.00 and Weight 3 = 0.00 — deleting useless features automatically!", "rows": [["λ = 2.0 (Sweet Spot)", "Ridge (L2: shrinks)", "+9.5 (Kept!)", "+1.4 (Small, never 0)", "−1.8 (Small, never 0)", "3.2 pts", "6.4 pts (Strong)"], ["λ = 2.0 (Sweet Spot)", "Lasso (L1: zeroes!)", "+9.6 (Kept!)", "0.00 (Deleted! ✅)", "0.00 (Deleted! ✅)", "3.1 pts", "4.8 pts (Best Test Score! 🏆)"]], "bars": [{"label": "|Weight 1| Real Signal", "val": 9.6, "max": 25, "col": "emerald"}, {"label": "Ridge |Weight 2|", "val": 1.4, "max": 25, "col": "amber"}, {"label": "Lasso |Weight 2| = 0!", "val": 0.0, "max": 25, "col": "emerald"}]}, {"label": "Step 4: λ = 50.0 (Too Much Penalty — Underfitting!)", "summary": "If you crank λ way too high (λ = 50), the penalty crushes even the real Study Hours signal Weight 1 down toward 0! Both Training and Test error rise because the line becomes flat.", "rows": [["λ = 50.0 (Over-Penalized)", "Ridge (L2)", "+1.8 (Crushed too far!)", "+0.1", "−0.1", "19.5 pts", "21.0 pts (Underfit!)"], ["λ = 50.0 (Over-Penalized)", "Lasso (L1)", "0.00 (All zeroed!)", "0.00", "0.00", "25.0 pts", "25.0 pts (Flat line!)"]], "bars": [{"label": "Ridge |Weight 1|", "val": 1.8, "max": 25, "col": "rose"}, {"label": "Lasso |Weight 1|", "val": 0.0, "max": 25, "col": "rose"}, {"label": "Test Error", "val": 21.0, "max": 25, "col": "rose"}]}]}, "knn": {"title": "KNN Numbers Movie: Distance Table from One New Link to Its Neighbors, Then the Vote", "naiveQ": "“Where is the training?” (There is none — KNN memorizes the table and measures distances at prediction time!)", "headers": ["Known Link in Database", "Dots in URL (Clue 1)", "Entropy (Clue 2)", "True Label", "Distance to New Link (4 dots, 4.2 randomness)", "Rank (Closest First)", "In Top k=3 Vote?"], "steps": [{"label": "Step 1: A New Mystery Link Arrives (Clue 1 = 4 dots, Clue 2 = 4.2 entropy)", "summary": "Why is there no 'training loop' in KNN? Because KNN simply stores the 5 known links in memory! All the math happens right now when our new mystery link (4 dots, 4.2 entropy) arrives.", "rows": [["Mystery Query Link", "4", "4.2", "❓ Unknown", "0.00 (Measure distance to all 5 rows!)", "—", "Let's compute Euclidean distances!"]], "bars": [{"label": "Query Dots Clue 1", "val": 4.0, "max": 6, "col": "sky"}, {"label": "Query Entropy Clue 2", "val": 4.2, "max": 6, "col": "amber"}]}, {"label": "Step 2: Compute Straight-Line Distance √((ΔClue 1)² + (ΔClue 2)²) to Every Stored Link", "summary": "We plug each stored link into √((Clue 1 − 4)² + (Clue 2 − 4.2)²). Link A (4 dots, 4.0 entropy) is only √(0² + (−0.2)²) = 0.20 away, while safe Link D (1 dot, 2.2 entropy) is 3.61 away!", "rows": [["Link A: paypa1.login.tk", "4", "4.0", "🚨 Phishing", "√((4−4)² + (4.0−4.2)²) = 0.20", "#1 Closest", "—"], ["Link B: secure.bank-up.xyz", "5", "4.3", "🚨 Phishing", "√((5−4)² + (4.3−4.2)²) = 1.00", "#2 Closest", "—"], ["Link C: docs.portal.internal", "3", "3.9", "✅ Safe", "√((3−4)² + (3.9−4.2)²) = 1.04", "#3 Closest", "—"], ["Link D: github.com/home", "1", "2.2", "✅ Safe", "√((1−4)² + (2.2−4.2)²) = 3.61", "#4 Far", "—"], ["Link E: wikipedia.org/wiki", "1", "2.0", "✅ Safe", "√((1−4)² + (2.0−4.2)²) = 3.72", "#5 Farthest", "—"]], "bars": [{"label": "Dist to Link A (Phish)", "val": 0.2, "max": 4, "col": "emerald"}, {"label": "Dist to Link B (Phish)", "val": 1.0, "max": 4, "col": "emerald"}, {"label": "Dist to Link D (Safe)", "val": 3.61, "max": 4, "col": "rose"}]}, {"label": "Step 3: Pick Top k = 3 Closest Neighbors & Hold a Majority Vote!", "summary": "Sort by distance and keep the top k = 3 closest neighbors: Link A (Phish, dist 0.20), Link B (Phish, dist 1.00), and Link C (Safe, dist 1.04). The vote is 2 Phishing vs 1 Safe → 66.7% Phishing Verdict!", "rows": [["Link A: paypa1.login.tk", "4", "4.0", "🚨 Phishing", "0.20", "#1", "✅ YES (Vote 1: Phish)"], ["Link B: secure.bank-up.xyz", "5", "4.3", "🚨 Phishing", "1.00", "#2", "✅ YES (Vote 2: Phish)"], ["Link C: docs.portal.internal", "3", "3.9", "✅ Safe", "1.04", "#3", "✅ YES (Vote 3: Safe)"], ["Link D: github.com/home", "1", "2.2", "✅ Safe", "3.61", "#4", "❌ Outside k=3"], ["FINAL VOTE (k = 3)", "—", "—", "🚨 PHISHING WINS (2 to 1)", "p(Phish) = 2/3 = 66.7%", "Winner!", "Classified as Phishing!"]], "bars": [{"label": "Phishing Votes", "val": 2, "max": 3, "col": "rose"}, {"label": "Safe Votes", "val": 1, "max": 3, "col": "emerald"}]}]}, "naive_bayes": {"title": "Naive Bayes Numbers Movie: Counts → Probabilities → Multiplied Clue by Clue", "naiveQ": "“Why is it called naive?” (Because it naively multiplies clue probabilities as if '.tk domain' and 'word verify' were 100% independent coin flips!)", "headers": ["Clue / Step", "Count in 100 Phish URLs", "Count in 100 Safe URLs", "P(Clue | Phish)", "P(Clue | Safe)", "Running Phish Score", "Running Safe Score"], "steps": [{"label": "Step 1: Start with Prior Baseline Counts (50% Phish vs 50% Safe in Training Set)", "summary": "We have 100 Phishing URLs and 100 Safe URLs in our past logbook. Before looking at any words inside the new URL 'verify-login.tk', both classes start equal at 0.50.", "rows": [["0. Prior Baseline", "100 Phish total", "100 Safe total", "P(Phish) = 0.50", "P(Safe) = 0.50", "0.5000", "0.5000"]], "bars": [{"label": "Phish Score", "val": 50, "max": 100, "col": "rose"}, {"label": "Safe Score", "val": 50, "max": 100, "col": "emerald"}]}, {"label": "Step 2: Multiply by Clue #1 — URL Contains Word 'verify'", "summary": "In our logbook, 'verify' appeared in 40 of 100 Phish URLs (0.40), but only 5 of 100 Safe URLs (0.05). Multiply the baseline by those likelihoods: Phish = 0.50 × 0.40 = 0.2000 vs Safe = 0.50 × 0.05 = 0.0250!", "rows": [["0. Prior Baseline", "100", "100", "0.50", "0.50", "0.5000", "0.5000"], ["1. Clue 'verify'", "40 / 100", "5 / 100", "0.40 (8× more common!)", "0.05", "0.50 × 0.40 = 0.2000", "0.50 × 0.05 = 0.0250"]], "bars": [{"label": "Phish (Normalized %)", "val": 88.9, "max": 100, "col": "rose"}, {"label": "Safe (Normalized %)", "val": 11.1, "max": 100, "col": "emerald"}]}, {"label": "Step 3: Multiply by Clue #2 (.tk TLD) & Normalize to 100%", "summary": "Why 'Naive'? Even though '.tk' and 'verify' often appear together in scams, Naive Bayes just multiplies straight across: 0.2000 × 0.30 = 0.0600 (Phish) vs 0.0250 × 0.01 = 0.00025 (Safe). Normalizing gives 99.6% Phishing!", "rows": [["0. Prior Baseline", "100", "100", "0.50", "0.50", "0.5000", "0.5000"], ["1. Clue 'verify'", "40 / 100", "5 / 100", "0.40", "0.05", "0.2000", "0.0250"], ["2. Clue '.tk TLD'", "30 / 100", "1 / 100", "0.30 (30× more common!)", "0.01", "0.20 × 0.30 = 0.0600", "0.025 × 0.01 = 0.00025"], ["3. Normalize (A / (A+B))", "—", "—", "—", "—", "0.06 / 0.06025 = 99.6% 🚨", "0.00025 / 0.06025 = 0.4%"]], "bars": [{"label": "Final Phish Prob (%)", "val": 99.6, "max": 100, "col": "rose"}, {"label": "Final Safe Prob (%)", "val": 0.4, "max": 100, "col": "emerald"}]}]}, "svm": {"title": "SVM Numbers Movie: Margin Street Width, Support Vectors, and C / Kernel Effects", "naiveQ": "“Why only some points matter?” (Because the boundary is held up ONLY by the closest edge points — the Support Vectors!)", "headers": ["Scenario / Step", "Safe Points (Hours)", "Pass Points (Hours)", "Boundary Cutoff", "Closest Edge Points (Support Vectors)", "Street Margin Width (Safety Cushion Width)", "What Happens If You Move Far Points?"], "steps": [{"label": "Step 1: Many Lines Can Separate Fail (≤3h) from Pass (≥5h) — Which Is Safest?", "summary": "Suppose Fail students studied [1h, 2h, 3h] and Pass students studied [5h, 7h, 9h]. A cutoff at 3.1h barely scrapes past the 3h student! SVM searches for the widest cushioned street between the two groups.", "rows": [["Bad Line A (Off-center)", "[1h, 2h, 3h]", "[5h, 7h, 9h]", "x = 3.1h", "3h is only 0.1h away!", "0.2h (Dangerously narrow)", "High risk of misclassifying 3.2h!"], ["SVM Optimal Line", "[1h, 2h, 3h]", "[5h, 7h, 9h]", "x = 4.0h (Dead center!)", "Only x = 3h and x = 5h touch the curbs!", "2.0h (Maximum cushion! ✅)", "1h, 2h, 7h, 9h don't affect the line at all!"]], "bars": [{"label": "Bad Line Margin", "val": 0.2, "max": 2.5, "col": "rose"}, {"label": "SVM Max Margin", "val": 2.0, "max": 2.5, "col": "emerald"}]}, {"label": "Step 2: Why Only Support Vectors Matter (Delete 1h, 2h, 7h, 9h — Line Doesn't Budge!)", "summary": "Only the points sitting right on the dashed curb lines (x = 3h and x = 5h) have non-zero dual weights (αᵢ > 0). If the 9h student studies 50h instead, the boundary stays at 4.0h because only the Support Vectors hold up the street!", "rows": [["Student S1 (1h, Fail)", "Distance = 3.0h from boundary", "Inside safe zone", "Dual weight α₁ = 0.00", "Not a Support Vector", "—", "Deleting S1 changes nothing!"], ["Student S3 (3h, Fail)", "Distance = 1.0h (On left curb!)", "Touches margin wall", "Dual weight α₃ = 0.50 > 0", "⭐ SUPPORT VECTOR", "2.0h", "Moving S3 moves the whole street!"], ["Student S4 (5h, Pass)", "Distance = 1.0h (On right curb!)", "Touches margin wall", "Dual weight α₄ = 0.50 > 0", "⭐ SUPPORT VECTOR", "2.0h", "Moving S4 moves the whole street!"], ["Student S6 (9h, Pass)", "Distance = 5.0h from boundary", "Inside safe zone", "Dual weight α₆ = 0.00", "Not a Support Vector", "—", "Deleting S6 changes nothing!"]], "bars": [{"label": "Support Vectors Used", "val": 2, "max": 6, "col": "sky"}, {"label": "Ignored Interior Points", "val": 4, "max": 6, "col": "emerald"}]}, {"label": "Step 3: The C Slider (Soft vs Hard Street) & The Kernel Trick (Lifting 2D Rings into 3D)", "summary": "What if one noisy outlier sits at 4.5h? Small C allows a wide street and tolerates 1 outlier; huge C narrows the street to force 0 training mistakes. And if data is a circle, the RBF Kernel lifts points into 3D so a flat sheet slices them cleanly!", "rows": [["Small C (C = 0.1)", "Prioritize Wide Street", "Ignores 1 noisy outlier", "Cutoff stays stable at 4.0h", "3 Support Vectors", "2.0h (Wide & robust)", "Great generalization on noisy data"], ["Huge C (C = 100)", "Zero-Mistake Obsession", "Bends for 1 outlier at 4.5h", "Cutoff shifts to 4.75h", "2 Support Vectors", "0.5h (Pinched thin!)", "Risk of overfitting to outliers"], ["RBF Kernel (γ = 1.0)", "Circular Phishing Cluster", "Lifts x into e^(−γ‖x−x'‖²)", "Flat 3D plane = 2D Circle!", "Boundary ring points", "Nonlinear ring margin", "Separates nested rings linearly can't!"]], "bars": [{"label": "Small C Street Width", "val": 2.0, "max": 2.5, "col": "emerald"}, {"label": "Huge C Street Width", "val": 0.5, "max": 2.5, "col": "rose"}]}]}, "decision_tree": {"title": "Decision Tree Numbers Movie: Candidate Splits With Gini Scores, Winner Highlighted", "naiveQ": "“How does it pick a question?” (It tests every possible split question and picks the one that produces the purest YES/NO buckets — lowest weighted Mix-Up Score!)", "headers": ["Candidate Question Tested", "Left Bucket (YES)", "Right Bucket (NO)", "Left Gini (Mix-Up Formula)", "Right Gini", "Weighted Average Gini", "Decision"], "steps": [{"label": "Step 1: Root Bucket Before Splitting (6 Links: 3 Phish 🚨, 3 Safe ✅)", "summary": "At the top of the tree, our bucket has 3 Phishing and 3 Safe links (50% / 50% mix). Mix-Up Score is 1 − (0.5² + 0.5²) = 0.500 (maximum confusion!). The tree wants a question that drops Gini as close to 0.000 as possible.", "rows": [["0. Unsplit Root Bucket", "3 Phish, 3 Safe (Total 6)", "—", "1 − (0.5² + 0.5²) = 0.500", "—", "0.500 (Maximum mixedness)", "Test candidate questions below!"]], "bars": [{"label": "Root Mix-Up Score", "val": 0.5, "max": 0.5, "col": "rose"}]}, {"label": "Step 2: Test Question A ('Is URL Length > 40?') vs Question B ('Does URL Use https?')", "summary": "The tree tries Question A (URL Length > 40): Left gets [2 Phish, 1 Safe] (Gini = 0.444), Right gets [1 Phish, 2 Safe] (Gini = 0.444). Question B (Uses https?): Left gets [2 Phish, 2 Safe] (Gini = 0.500 — useless!).", "rows": [["Question A: Length > 40?", "2 Phish, 1 Safe (3 links)", "1 Phish, 2 Safe (3 links)", "1 − ((2/3)²+(1/3)²) = 0.444", "0.444", "(3/6)(0.444)+(3/6)(0.444) = 0.444", "Okay (Gain = 0.056)"], ["Question B: Uses https?", "2 Phish, 2 Safe (4 links)", "1 Phish, 1 Safe (2 links)", "1 − (0.5² + 0.5²) = 0.500", "0.500", "0.500 (Zero improvement!)", "❌ Reject (Useless question)"]], "bars": [{"label": "Root Gini", "val": 0.5, "max": 0.5, "col": "rose"}, {"label": "Question A Gini", "val": 0.444, "max": 0.5, "col": "amber"}, {"label": "Question B Gini", "val": 0.5, "max": 0.5, "col": "rose"}]}, {"label": "Step 3: Test Question C ('Is Brand Name in Subdomain?') → 🏆 WINNER!", "summary": "Now the tree tests Question C ('Is Brand in Subdomain?'): Left bucket gets [3 Phish, 0 Safe] (100% pure Phish, Gini = 0.000!) and Right bucket gets [0 Phish, 3 Safe] (100% pure Safe, Gini = 0.000!). Weighted Gini drops to 0.000 — Question C wins!", "rows": [["Question A: Length > 40?", "2 Phish, 1 Safe", "1 Phish, 2 Safe", "0.444", "0.444", "0.444", "Runner-up"], ["Question B: Uses https?", "2 Phish, 2 Safe", "1 Phish, 1 Safe", "0.500", "0.500", "0.500", "❌ Rejected"], ["🏆 Question C: Brand in Subdomain?", "3 Phish, 0 Safe (Pure!)", "0 Phish, 3 Safe (Pure!)", "1 − (1² + 0²) = 0.000", "1 − (0² + 1²) = 0.000", "0.000 (Perfect Split! Gain = +0.500)", "✅ SELECTED AS ROOT SPLIT!"]], "bars": [{"label": "Question A Gini", "val": 0.444, "max": 0.5, "col": "amber"}, {"label": "Question B Gini", "val": 0.5, "max": 0.5, "col": "rose"}, {"label": "🏆 Question C Gini = 0!", "val": 0.01, "max": 0.5, "col": "emerald"}]}]}, "random_forest": {"title": "Random Forest Numbers Movie: Bootstrap Samples, Each Tree's Vote, and the Final Majority", "naiveQ": "“Why are many weak guesses better than one?” (Because independent trees make mistakes on different rows, so averaging/voting cancels out individual tree quirks!)", "headers": ["Tree ID", "Bootstrap Sample (Rows Drawn With Replacement)", "Random Feature Subset Allowed", "Top Split Chosen by Tree", "Vote on Suspect Link X", "Why This Tree Voted That Way"], "steps": [{"label": "Step 1: Why 1 Single Deep Tree Breaks (It Memorizes Quirks!)", "summary": "If we train 5 trees on the EXACT same rows and features, we just get 5 identical clones! Random Forest forces diversity in two ways: (1) Bootstrap rows with replacement, and (2) Random subset of features at each split.", "rows": [["Single Deep Tree", "All Rows [1, 2, 3, 4, 5]", "All Features [TLD, Entropy, Length, Port]", "Port == 8080 (Quirk in row 2!)", "❌ Safe (Fooled!)", "Memorized one weird training row"]], "bars": [{"label": "1-Tree Accuracy (%)", "val": 72, "max": 100, "col": "amber"}]}, {"label": "Step 2: Build 5 Diverse Trees (Bootstrap Rows + Random Feature Subsets)", "summary": "Watch how each tree sees a slightly different slice of data and features. Tree 3 gets fooled by a benign length quirk, but Trees 1, 2, 4, and 5 catch the phishing signals from different angles!", "rows": [["🌲 Tree 1", "Rows [1, 1, 3, 4, 5]", "[TLD, Entropy]", "TLD == '.tk'?", "🚨 Phish (Vote 1)", "Saw .tk domain clue"], ["🌲 Tree 2", "Rows [2, 3, 3, 4, 5]", "[BrandSubdomain, Hyphens]", "Brand in Subdomain?", "🚨 Phish (Vote 2)", "Saw 'paypa1' brand spoof"], ["🌲 Tree 3", "Rows [1, 2, 2, 2, 4]", "[Length, HTTPS]", "Uses HTTPS?", "✅ Safe (Wrong vote)", "Fooled because phish had HTTPS"], ["🌲 Tree 4", "Rows [1, 3, 4, 4, 5]", "[Entropy, Digits]", "Entropy > 4.1?", "🚨 Phish (Vote 3)", "Caught random folder '8f3k9q'"], ["🌲 Tree 5", "Rows [1, 2, 3, 5, 5]", "[TLD, Redirects]", "Has '?redirect='?", "🚨 Phish (Vote 4)", "Caught open redirect parameter"]], "bars": [{"label": "Phish Votes (Trees 1,2,4,5)", "val": 4, "max": 5, "col": "emerald"}, {"label": "Safe Votes (Tree 3)", "val": 1, "max": 5, "col": "rose"}]}, {"label": "Step 3: The Wisdom-of-the-Crowd Majority Vote (4 to 1 → 80% Phishing!)", "summary": "Even though Tree 3 made a mistake, the 4 other independent trees outvoted it 4 to 1! By Condorcet's Jury Theorem, combining many uncorrelated 75%-accurate trees drives ensemble accuracy above 96%!", "rows": [["FINAL FOREST VERDICT", "5 Independent Trees", "4 voted Phish, 1 voted Safe", "Majority = 4 / 5 (80.0%)", "🚨 PHISHING", "Tree 3's mistake was canceled out by the crowd!"]], "bars": [{"label": "Single Tree Accuracy (%)", "val": 72, "max": 100, "col": "amber"}, {"label": "5-Tree Forest Accuracy (%)", "val": 94, "max": 100, "col": "emerald"}]}]}, "adaboost": {"title": "AdaBoost Numbers Movie: Sample Weights Per Round (Watch Mistakes Grow Heavier!)", "naiveQ": "“What does ‘focus on mistakes’ mean?” (Literally multiplying the weight wᵢ of every misclassified row by e⁺ᵃ so the next tree is forced to prioritize it!)", "headers": ["Training Row", "True Label", "Round 1 Weight (Equal)", "Stump 1 Guess", "Round 2 Weight (Mistakes Grow!)", "Stump 2 Guess", "Round 3 Weight"], "steps": [{"label": "Step 1: Round 1 Starts Fair — Every Row Has Equal Weight 1/5 = 0.20", "summary": "At the start of Round 1, all 5 links have the exact same importance weight (0.20). Stump 1 splits on '.tk TLD' and gets 4 links right, but MISSES Row #3 (a sneaky phishing link on '.com'!).", "rows": [["Row 1: login-pay.tk", "🚨 Phish", "0.20 (20%)", "🚨 Phish (✅ Correct)", "—", "—", "—"], ["Row 2: bank-sec.tk", "🚨 Phish", "0.20 (20%)", "🚨 Phish (✅ Correct)", "—", "—", "—"], ["Row 3: paypa1-auth.com (Sneaky!)", "🚨 Phish", "0.20 (20%)", "✅ Safe (❌ MISSED!)", "—", "—", "—"], ["Row 4: github.com", "✅ Safe", "0.20 (20%)", "✅ Safe (✅ Correct)", "—", "—", "—"], ["Row 5: python.org", "✅ Safe", "0.20 (20%)", "✅ Safe (✅ Correct)", "—", "—", "—"]], "bars": [{"label": "Row 1 Weight (%)", "val": 20, "max": 60, "col": "sky"}, {"label": "Row 3 (Missed!) Weight (%)", "val": 20, "max": 60, "col": "rose"}, {"label": "Row 4 Weight (%)", "val": 20, "max": 60, "col": "sky"}]}, {"label": "Step 2: Round 2 — Missed Row #3's Weight Skyrockets from 20% to 50%!", "summary": "Because Stump 1 missed Row #3, AdaBoost boosts Row #3's weight (`wᵢ ← wᵢ · e⁺ᵃ`) and shrinks the 4 easy rows (`wᵢ ← wᵢ · e⁻ᵃ`). After normalizing, Row #3 now counts for 50% of the entire dataset's penalty!", "rows": [["Row 1: login-pay.tk", "🚨 Phish", "0.20", "✅ Correct", "0.125 (Shrunk — already easy)", "—", "—"], ["Row 2: bank-sec.tk", "🚨 Phish", "0.20", "✅ Correct", "0.125 (Shrunk)", "—", "—"], ["Row 3: paypa1-auth.com", "🚨 Phish", "0.20", "❌ MISSED!", "🔥 0.500 (50% of total weight!)", "🚨 Phish (✅ Stump 2 nails it!)", "—"], ["Row 4: github.com", "✅ Safe", "0.20", "✅ Correct", "0.125 (Shrunk)", "—", "—"], ["Row 5: python.org", "✅ Safe", "0.20", "✅ Correct", "0.125 (Shrunk)", "—", "—"]], "bars": [{"label": "Easy Row 1 Weight (%)", "val": 12.5, "max": 60, "col": "sky"}, {"label": "🔥 Missed Row 3 Weight (%)", "val": 50.0, "max": 60, "col": "rose"}, {"label": "Easy Row 4 Weight (%)", "val": 12.5, "max": 60, "col": "sky"}]}, {"label": "Step 3: Stump 2 Is Forced to Solve Row #3 → Combined Weighted Vote = 100% Accuracy!", "summary": "Because missing Row #3 would cost 50% error, Stump 2 HAS to pick a question that catches Row #3 ('Digit-for-Letter Swap paypa1?'). Combining α₁·Stump1 + α₂·Stump2 classifies all 5 rows with 100% accuracy!", "rows": [["Row 3: paypa1-auth.com", "🚨 Phish", "0.20", "❌ Stump 1 Missed", "0.500 (Forced focus!)", "✅ Stump 2 Caught!", "0.167 (Back down — solved!)"], ["Final Ensemble: α₁Brake 1 + α₂Brake 2", "All 5 Rows", "—", "Stump 1 catches .tk", "Stump 2 catches paypa1", "100% Combined Accuracy! 🏆", "Mistake-driven teamwork!"]], "bars": [{"label": "Stump 1 Alone (%)", "val": 80, "max": 100, "col": "amber"}, {"label": "Stump 1 + Stump 2 (%)", "val": 100, "max": 100, "col": "emerald"}]}]}, "xgboost": {"title": "GBDT / XGBoost Numbers Movie: Table of Mistake Gap = Guess − Truth, Safety Brake, Leaf Values & Updated p Per Tree", "naiveQ": "“What is a gradient doing here?” (Instead of nudging weights in one formula, each new tree is trained to predict the residual gradient Mistake Gap = Guess − Truth left behind by the previous trees!)", "headers": ["Stage / Tree Added", "Running Log-Odds (z)", "Current Prob Chance (%)", "True y", "Gradient Mistake Gap = Guess − Truth (Residual)", "Bowl Steepness Safety Brake (Curvature)", "New Tree Leaf New Leaf Nudge", "New Prob Updated Chance"], "steps": [{"label": "Step 1: Base Prediction (Tree 0) — Start at 50% Coin Flip (Starting Score = 0.00)", "summary": "Before growing any trees, XGBoost starts every URL at log-odds Starting Score = 0.00, which Sigmoid turns into p = 0.50 (50%). For a real Phishing URL (y = 1), the gradient is Mistake Gap = Guess − Truth = 0.50 − 1.00 = −0.50 ('we are 50% too low!').", "rows": [["Tree 0 (Baseline)", "Starting Score = 0.00", "Starting Chance = 0.500 (50.0%)", "y = 1", "Gap 1 = 0.50 − 1 = −0.500", "Brake 1 = 0.50(0.50) = 0.250", "Tree 1 Nudge = −(−0.50)/(0.25+0) × 0.5 = +1.00", "Tree 1 Score = +1.00 → Tree 1 Chance = 73.1%"]], "bars": [{"label": "Current Prob p (%)", "val": 50.0, "max": 100, "col": "amber"}, {"label": "|Gradient g = p−y| (%)", "val": 50.0, "max": 100, "col": "rose"}, {"label": "Bowl Steepness h×100", "val": 25.0, "max": 100, "col": "sky"}]}, {"label": "Step 2: Tree 1 Added (Tree 1 Score = +1.00, Tree 1 Chance = 73.1%) → Compute Leftover Gradient Gap 2 = −0.269", "summary": "Tree 1 added +1.00 to the log-odds, pushing p from 50.0% to 73.1%! Now we recompute the leftover error: Gap 2 = Tree 1 Chance − y = 0.731 − 1 = −0.269, and curvature Brake 2 = 0.731(1 − 0.731) = 0.197. Tree 2 is trained to fix this remaining −0.269 gap!", "rows": [["Tree 0 (Baseline)", "0.00", "50.0%", "1", "Gap 1 = −0.500", "Brake 1 = 0.250", "+1.00", "73.1%"], ["After Tree 1 → Build Tree 2", "Tree 1 Score = +1.00", "Tree 1 Chance = 0.731 (73.1%)", "1", "Gap 2 = 0.731 − 1 = −0.269", "Brake 2 = 0.731(0.269) = 0.197", "Tree 2 Nudge = −(−0.269)/(0.197) × 0.5 = +0.68", "Tree 2 Score = +1.68 → Tree 2 Chance = 84.3%"]], "bars": [{"label": "Current Prob p (%)", "val": 73.1, "max": 100, "col": "sky"}, {"label": "|Gradient g = p−y| (%)", "val": 26.9, "max": 100, "col": "amber"}, {"label": "Bowl Steepness h×100", "val": 19.7, "max": 100, "col": "sky"}]}, {"label": "Step 3: Tree 2 Added (Tree 2 Score = +1.68, Tree 2 Chance = 84.3%) → Leftover Gradient Shrinks to Gap 3 = −0.157", "summary": "Notice how Safety Brake acts as an automatic brake pedal in Best Leaf Nudge: as p approaches 1.0, Mistake Gap = Guess − Truth gets smaller and each new tree adds a finer correction (+0.60), pushing p to 90.7%!", "rows": [["Tree 0 (Baseline)", "0.00", "50.0%", "1", "−0.500", "0.250", "+1.00", "73.1%"], ["After Tree 1", "+1.00", "73.1%", "1", "−0.269", "0.197", "+0.68", "84.3%"], ["After Tree 2 → Build Tree 3", "Tree 2 Score = +1.68", "Tree 2 Chance = 0.843 (84.3%)", "1", "Gap 3 = 0.843 − 1 = −0.157", "Brake 3 = 0.843(0.157) = 0.132", "Tree 3 Nudge = +0.60", "Tree 3 Score = +2.28 → p₃ = 90.7%"]], "bars": [{"label": "Current Prob p (%)", "val": 84.3, "max": 100, "col": "emerald"}, {"label": "|Gradient g = p−y| (%)", "val": 15.7, "max": 100, "col": "amber"}, {"label": "Bowl Steepness h×100", "val": 13.2, "max": 100, "col": "sky"}]}, {"label": "Step 4: After Tree 10 (Raw Score after 10 Trees = +4.60, Chance after 10 Trees = 99.0% 🚨) — Residual g Is Nearly Zero!", "summary": "By Tree 10, the accumulated log-odds reach z = +4.60, Sigmoid outputs p = 99.0% Phishing, and the residual gradient g = 0.990 − 1.000 = −0.010 is almost zero! Each tree chipped away at the previous tree's residual error.", "rows": [["Tree 0 (Start)", "0.00", "50.0%", "1", "−0.500 (Huge gap)", "0.250", "+1.00", "73.1%"], ["Tree 1", "+1.00", "73.1%", "1", "−0.269", "0.197", "+0.68", "84.3%"], ["Tree 2", "+1.68", "84.3%", "1", "−0.157", "0.132", "+0.60", "90.7%"], ["Tree 10 (Final)", "Raw Score after 10 Trees = +4.60", "Chance after 10 Trees = 0.990 (99.0% 🚨)", "1", "g = −0.010 (Solved!)", "h = 0.010", "Leaf Nudge ≈ +0.02 (Tiny polish)", "99.0% Phishing Block! 🏆"]], "bars": [{"label": "Current Prob p (%)", "val": 99.0, "max": 100, "col": "emerald"}, {"label": "|Gradient g = p−y| (%)", "val": 1.0, "max": 100, "col": "emerald"}, {"label": "Bowl Steepness h×100", "val": 1.0, "max": 100, "col": "emerald"}]}]}, "kmeans_dbscan": {"title": "K-Means & DBSCAN Numbers Movie: Centroid Updates & Core / Border / Noise Labels", "naiveQ": "“How does it learn without answers?” (By grouping points that sit close together in feature space — either pulling K magnets to the center of each cloud, or linking dense neighborhoods!)", "headers": ["Point / Step", "URL Length (Clue 1)", "Entropy (Clue 2)", "Dist to Magnet Group 1 Center (Safe)", "Dist to Magnet Group 2 Center (Botnet)", "Assigned Cluster (K-Means)", "DBSCAN Density Role (ε=1.5, MinPts=2)"], "steps": [{"label": "Step 1: Unlabeled Data Arrives (5 URLs, Zero 'y' Labels!) — Place 2 Initial Magnets", "summary": "Nobody told the computer which URLs are safe or botnet! We drop Magnet Group 1 Center at (20, 2.5) and Magnet Group 2 Center at (70, 4.5), and measure which magnet each point is closer to.", "rows": [["URL 1 (google.com)", "18", "2.4", "2.0 (Closer to Group 1 Center)", "52.0", "Cluster 1 (Group A)", "🟢 CORE (Has 2 neighbors ≤ 1.5)"], ["URL 2 (github.com)", "22", "2.6", "2.0 (Closer to Group 1 Center)", "48.0", "Cluster 1 (Group A)", "🟢 CORE (Has 2 neighbors ≤ 1.5)"], ["URL 3 (8x9q2z-login.tk)", "78", "4.7", "58.0", "8.0 (Closer to Group 2 Center)", "Cluster 2 (Group B)", "🟢 CORE (Dense botnet pair)"], ["URL 4 (7k4m9p-login.tk)", "82", "4.9", "62.0", "12.0 (Closer to Group 2 Center)", "Cluster 2 (Group B)", "🟡 BORDER (Within ε of URL 3)"], ["URL 5 (weird-port:9999)", "140", "1.1", "120.0", "70.1", "Forced into Cluster 2 by K-Means!", "🔴 NOISE (-1 Outlier! 0 neighbors!)"]], "bars": [{"label": "Cluster 1 Size", "val": 2, "max": 5, "col": "emerald"}, {"label": "Cluster 2 Size", "val": 2, "max": 5, "col": "sky"}, {"label": "DBSCAN Outliers Caught", "val": 1, "max": 5, "col": "rose"}]}, {"label": "Step 2: K-Means Iteration 2 — Move Each Magnet to the Average (Mean) of Its Group!", "summary": "Magnet Group 1 Center slides to the average of URL 1 & URL 2: ((18+22)/2, (2.4+2.6)/2) = (20.0, 2.50). Magnet Group 2 Center slides to the center of URL 3 & URL 4: ((78+82)/2, (4.7+4.9)/2) = (80.0, 4.80). Assignments don't change anymore — converged!", "rows": [["Magnet Group 1 Center (Center of Group 1)", "Avg(18, 22) = 20.0", "Avg(2.4, 2.6) = 2.50", "0.0 (Locked!)", "—", "Normal Traffic Cluster", "2 Core Points"], ["Magnet Group 2 Center (Center of Group 2)", "Avg(78, 82) = 80.0", "Avg(4.7, 4.9) = 4.80", "—", "0.0 (Locked!)", "DGA Botnet Cluster", "1 Core + 1 Border"], ["URL 5 (Extreme Anomaly)", "140", "1.10", "Dist = 120.0", "Dist = 60.1", "⚠️ K-Means forces it into Group 2", "✅ DBSCAN labels it -1 NOISE!"]], "bars": [{"label": "Group 1 Center Avg Length", "val": 20, "max": 100, "col": "emerald"}, {"label": "Group 2 Center Avg Length", "val": 80, "max": 100, "col": "rose"}]}]}, "pca": {"title": "PCA Numbers Movie: Variance Explained & Projected Points Step by Step", "naiveQ": "“What does ‘reducing dimensions’ mean?” (Rotating the axes to point along the longest spread of the cloud, so 2 redundant columns compress into 1 master score without losing the pattern!)", "headers": ["House Row", "SqFt in 1000s (Clue 1)", "Rooms (Clue 2 — Redundant!)", "Centered (SqFt vs Avg, Rooms vs Avg)", "Main Axis Score (Main Axis = 96% Variance)", "Extra Wiggle Axis Score (Wiggle Noise = 4% Variance)", "After Dropping Extra Wiggle Axis"], "steps": [{"label": "Step 1: Two Redundant Columns (SqFt Clue 1 and Rooms Clue 2 Move Almost Identically!)", "summary": "Look at our 3 houses: bigger SqFt almost always means more Rooms. Carrying both columns is 96% duplicate information! First, PCA centers both columns by subtracting their averages (Avg SqFt = 2.0, Avg Rooms = 6.0).", "rows": [["House A (Small)", "1.0k", "3 rooms", "(−1.0, −3.0)", "—", "—", "—"], ["House B (Medium)", "2.0k", "6 rooms", "(0.0, 0.0)", "—", "—", "—"], ["House C (Large)", "3.0k", "9 rooms", "(+1.0, +3.0)", "—", "—", "—"]], "bars": [{"label": "Col 1 + Col 2 (2D)", "val": 2, "max": 2, "col": "sky"}, {"label": "Correlation Between Clue 1,Clue 2 (%)", "val": 98, "max": 100, "col": "amber"}]}, {"label": "Step 2: Project onto Principal Component 1 (The Diagonal Axis of Maximum Spread)", "summary": "PCA finds the diagonal direction v₁ = [0.316, 0.949] where the points spread out the most (Eigenvalue λ₁ = 96% of total variance). Perpendicular axis Extra Wiggle Axis captures only 4% random noise — so we drop Extra Wiggle Axis and keep 1 number per house!", "rows": [["House A (Small)", "1.0k", "3 rooms", "(−1.0, −3.0)", "Main Axis = −3.16 (Small House Score)", "Extra Wiggle Axis = +0.02 (Tiny noise)", "Keep only −3.16!"], ["House B (Medium)", "2.0k", "6 rooms", "(0.0, 0.0)", "Main Axis = 0.00 (Average House Score)", "Extra Wiggle Axis = −0.01 (Tiny noise)", "Keep only 0.00!"], ["House C (Large)", "3.0k", "9 rooms", "(+1.0, +3.0)", "Main Axis = +3.16 (Large House Score)", "Extra Wiggle Axis = +0.01 (Tiny noise)", "Keep only +3.16!"], ["VARIANCE SUMMARY", "50% raw", "50% raw", "—", "✅ Main Axis Captures 96.0% of Signal!", "🗑️ Extra Wiggle Axis = 4.0% (Dropped!)", "2 Columns → 1 Column (96% preserved!)"]], "bars": [{"label": "Main Axis Variance Kept (%)", "val": 96, "max": 100, "col": "emerald"}, {"label": "Extra Wiggle Axis Noise Dropped (%)", "val": 4, "max": 100, "col": "rose"}]}]}, "q_learning": {"title": "Q-Learning Numbers Movie: Watch the Q-Table Fill In After Episode 1, 10, and 100", "naiveQ": "“How does it learn from rewards?” (When the agent hits the +100 Goal at the end, the Bellman equation passes that value one square backward per episode like a bucket brigade!)", "headers": ["Training Stage", "State Square 1 (Start Square) → Go Right", "State Square 2 (Middle Square) → Go Right", "State Square 3 (Next to Goal) → Go Right", "State Goal Square 4 (Goal = +100 Reward)", "What the Agent Does Now"], "steps": [{"label": "Step 1: Episode 0 (Blank Brain — All Q-Values Are 0.0)", "summary": "Imagine a 4-square hallway: [Square 1 Start] → [Square 2 Middle] → [Square 3 Near Goal] → [Goal Square 4 Goal +100]. At Episode 0, every Q(state, Right) = 0.0. The agent wanders blindly because every square looks equally worthless.", "rows": [["Episode 0 (Untrained)", "Square 1 → Right Score = 0.0", "Square 2 → Right Score = 0.0", "Square 3 → Right Score = 0.0", "+100 Goal Treasure", "Wanders randomly (0% clue)"]], "bars": [{"label": "Square 1 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 2 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 3 → Right Score", "val": 0, "max": 100, "col": "rose"}]}, {"label": "Step 2: After Episode 1 — Only Square 3 (Right Next to the Goal!) Learns +50.0", "summary": "In Episode 1, the agent stumbles from Square 3 into Goal Square 4 and collects r = +100! Bellman update (`Q ← Q + α(r + γ·maxQ' − Q)` with α=0.5, γ=0.9) updates Square 3 → Right Score from 0 to +50.0. Notice Square 1 and Square 2 are STILL 0.0!", "rows": [["Episode 0", "0.0", "0.0", "0.0", "+100", "Blind"], ["After Episode 1", "0.0 (Hasn't heard yet!)", "0.0 (Hasn't heard yet!)", "0 + 0.5(100) = +50.0 💡", "+100", "Knows Square 3 → Goal Square 4 is great!"]], "bars": [{"label": "Square 1 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 2 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 3 → Right Score", "val": 50, "max": 100, "col": "amber"}]}, {"label": "Step 3: After Episode 10 — Reward Ripples Backward to Square 2 (+68.0) and Square 1 (+45.0)!", "summary": "On the next episodes, stepping Square 2 → Square 3 sees Square 3's high Q-value (`γ·maxQ(Square 3)`), so Square 2's Q-value rises! Then stepping Square 1 → Square 2 sees Square 2's Q-value, so Square 1 rises too — the reward ripples backward to the Start square!", "rows": [["After Episode 1", "0.0", "0.0", "+50.0", "+100", "Only Square 3 knows"], ["After Episode 10", "+45.0 (Heard from Square 2!)", "+68.0 (Heard from Square 3!)", "+89.0 (Heard from Goal!)", "+100", "Follows breadcrumbs Square 1→Square 2→Square 3→Goal Square 4!"]], "bars": [{"label": "Square 1 → Right Score", "val": 45, "max": 100, "col": "sky"}, {"label": "Square 2 → Right Score", "val": 68, "max": 100, "col": "sky"}, {"label": "Square 3 → Right Score", "val": 89, "max": 100, "col": "emerald"}]}, {"label": "Step 4: After Episode 100 — Converged Discounted Trail (81.0 → 90.0 → 100.0)!", "summary": "With discount factor γ = 0.9, Square 3 → Right Score converges to 100, Square 2 → Right Score = 0.9×100 = 90.0, and Square 1 → Right Score = 0.9×90 = 81.0! From Square 1, the agent marches straight to the goal with zero wasted steps!", "rows": [["After Episode 1", "0.0", "0.0", "+50.0", "+100", "Random"], ["After Episode 10", "+45.0", "+68.0", "+89.0", "+100", "Mostly right"], ["After Episode 100 (Converged)", "81.0 (0.9² × 100)", "90.0 (0.9¹ × 100)", "100.0 (1.0 × 100)", "+100", "🏆 Optimal Policy Locked!"]], "bars": [{"label": "Square 1 → Right Score", "val": 81, "max": 100, "col": "emerald"}, {"label": "Square 2 → Right Score", "val": 90, "max": 100, "col": "emerald"}, {"label": "Square 3 → Right Score", "val": 100, "max": 100, "col": "emerald"}]}]}, "vectors_dot": {"title": "Vectors & Dot Product Numbers Movie: Multiply Matching Slots, Then Add!", "naiveQ": "“How does a list of numbers turn into one prediction score?”", "headers": ["Feature Slot", "Student Vector x", "Model Weights w", "Slot Product (wᵢ × xᵢ)", "Running Sum (Dot Product)"], "steps": [{"label": "Step 1: Slot 1 — Multiply Study Hours (Clue 1 = 4) by Weight (Weight 1 = 10)", "summary": "A vector is just a row of numbers: x = [4 hours, 3 practice tests]. Weight vector w = [10 pts/hr, 5 pts/test]. Multiply Slot 1: 10 × 4 = 40 pts.", "rows": [["Slot 1: Study Hours", "Clue 1 = 4", "Weight 1 = +10", "10 × 4 = +40", "40"]], "bars": [{"label": "Slot 1 Contribution", "val": 40, "max": 85, "col": "sky"}, {"label": "Running Total", "val": 40, "max": 85, "col": "emerald"}]}, {"label": "Step 2: Slot 2 — Multiply Practice Tests (Clue 2 = 3) by Weight (Weight 2 = 5) & Add!", "summary": "Now multiply Slot 2: 5 × 3 = 15 pts, and add it to Slot 1: 40 + 15 = 55 pts! Add baseline intercept b = 25 → Final Score Guess = 80 pts.", "rows": [["Slot 1: Study Hours", "Clue 1 = 4", "Weight 1 = +10", "10 × 4 = +40", "40"], ["Slot 2: Practice Tests", "Clue 2 = 3", "Weight 2 = +5", "5 × 3 = +15", "40 + 15 = 55"], ["+ Baseline Intercept b", "1", "b = +25", "+25", "55 + 25 = 80 pts (Done!)"]], "bars": [{"label": "Slot 1 (40)", "val": 40, "max": 85, "col": "sky"}, {"label": "Slot 2 (15)", "val": 15, "max": 85, "col": "amber"}, {"label": "Total Guess (80)", "val": 80, "max": 85, "col": "emerald"}]}]}, "stats_hypothesis": {"title": "Statistical Test Numbers Movie: Signal Divided by Noise → Luck Chance Verdict", "naiveQ": "“How do we know a weight w isn't just a lucky fluke in 5 rows?”", "headers": ["Step", "Estimated Slope (ŵ)", "Noise / Bounce (Standard Error Wiggle Margin)", "Signal-to-Noise Ratio (t or z or F)", "Probability of Random Luck (Luck Chance)", "Verdict (α = 0.05 Cutoff)"], "steps": [{"label": "Step 1: Measure the Signal (Slope ŵ = +10.0 pts/hr)", "summary": "Our best-fit line says each study hour adds ŵ = +10.0 points. Wait — could a random coin-flip feature also look like +10.0 in a tiny sample?", "rows": [["1. Measure Effect Signal", "ŵ = +10.0 pts/hr", "—", "—", "—", "Need to compare against noise Wiggle Margin!"]], "bars": [{"label": "Signal |ŵ|", "val": 10.0, "max": 12, "col": "sky"}]}, {"label": "Step 2: Divide Signal by Noise Wiggle Margin → t-Score = 5.0 → p = 0.002 (< 0.05!)", "summary": "The wiggle uncertainty is Wiggle Margin = 2.0. Dividing Signal by Noise gives t = 10.0 / 2.0 = 5.0 standard errors away from zero! The chance of seeing 5.0 by pure luck is p = 0.002 (0.2% < 5%), so Study Hours is a REAL signal!", "rows": [["Real Clue: Study Hours", "ŵ = +10.0", "Wiggle Margin = 2.0", "t = 10 / 2 = 5.00 (Huge!)", "p = 0.002 (0.2% luck)", "✅ SIGNIFICANT (Keep feature!)"], ["Fake Clue: Shoe Size", "ŵ = +0.8", "Wiggle Margin = 2.5", "t = 0.8 / 2.5 = 0.32 (Tiny)", "p = 0.760 (76% luck!)", "❌ NOISE (Drop feature!)"]], "bars": [{"label": "Study Hours t-Score", "val": 5.0, "max": 6, "col": "emerald"}, {"label": "Shoe Size t-Score", "val": 0.32, "max": 6, "col": "rose"}]}]}, "neural_backprop": {"title": "Neural Net & Backprop Numbers Movie: Forward Pass → ReLU Bend → Backward Chain Rule", "naiveQ": "“What do hidden layers actually do to the numbers?”", "headers": ["Pass Stage", "Input (Hours x)", "Hidden Neuron 1 (ReLU(2x−2))", "Hidden Neuron 2 (ReLU(x−6) Burnout)", "Output Prediction Guess", "Backward Gradient Flow"], "steps": [{"label": "Step 1: Forward Pass — Hidden Neurons Create Hinge Bends (ReLU = max(0, z))", "summary": "A straight line cannot bend when a student studies 8 hours and burns out! Neuron 1 turns on after 1 hr (+boost); Neuron 2 turns on only after 6 hrs (−burnout penalty). Together they form a bent roof curve!", "rows": [["x = 4 hrs (Fresh)", "4.0", "max(0, 8−2) = +6.0 (Active!)", "max(0, 4−6) = 0.0 (Asleep)", "50 + 5(6) − 20(0) = 80 pts", "Neuron 1 gets gradient; Neuron 2 = 0"], ["x = 8 hrs (Burnout)", "8.0", "max(0, 16−2) = +14.0", "max(0, 8−6) = +2.0 (Wakes up!)", "50 + 5(14) − 20(2) = 80 pts", "Both neurons get error blame!"]], "bars": [{"label": "Neuron 1 Output", "val": 14, "max": 16, "col": "emerald"}, {"label": "Neuron 2 Burnout", "val": 2, "max": 16, "col": "rose"}]}, {"label": "Step 2: Backward Pass (Chain Rule Blame Assignment)", "summary": "If the final prediction is off by −6 pts, Backpropagation multiplies the output error by each layer's weight to send exact blame to every hidden weight — updating only the neurons that fired (ReLU > 0)!", "rows": [["Output Layer", "Error δ_out = −6.0", "Weight v₁ = +5.0", "Weight v₂ = −20.0", "v_new = v − α(δ_out · a_hidden)", "Direct gradient step"], ["Hidden Layer (Chain Rule)", "Blame δ₁ = δ_out × v₁ = −30", "ReLU slope = 1 (since z>0)", "∂L/∂Weight 1 = δ₁ × x", "Weight 1 nudged to reduce error!", "Chain rule = multiply slopes backward!"]], "bars": [{"label": "Output Error |δ|", "val": 6, "max": 35, "col": "amber"}, {"label": "Hidden Blame |δ₁|", "val": 30, "max": 35, "col": "sky"}]}]}, "url_forensics": {"title": "URL Forensics Numbers Movie: Watch Raw URL Characters Turn into Risk Numbers", "naiveQ": "“How does a text link like 'http://paypa1-login.tk/8f3k9q' become math numbers?”", "headers": ["Stage", "What the Code Inspects", "Raw Substring Found", "Formula Applied", "Numeric Feature Output", "Phishing Signal Strength"], "steps": [{"label": "Step 1: Split Hostname into Subdomain vs True Registrable Apex (domain_utils.py)", "summary": "Attackers write 'paypal.com.verify-login.tk' hoping you look at the left side. Our parser reads right-to-left against the Public Suffix List: '.tk' is the TLD, 'verify-login.tk' is the true owner, and 'paypal.com' is just a fake subdomain!", "rows": [["1. Public Suffix Split", "Rightmost registrable root", "Apex = 'verify-login.tk'", "Subdomain = 'paypal.com'", "F10 (Brand_in_Subdomain) = 1", "🚨 CRITICAL (+2.40 log-odds)"]], "bars": [{"label": "Brand Spoof Flag F10", "val": 100, "max": 100, "col": "rose"}]}, {"label": "Step 2: Compute Character Randomness H(X) & 3–5 Char N-Gram Rare-Pattern Score", "summary": "Normal words like '/account/login' repeat letters and have low entropy (H ≈ 2.9 bits). Random DGA folders like '/8f3k9q/' have flat character probabilities (1/6 each → H = 4.32 bits), and N-grams catch 'paypa1'!", "rows": [["2. Character Randomness F12", "Randomness of path chars", "'/8f3k9q/'", "H = −∑ p(c) loGap 2 p(c)", "H = 4.32 bits/char", "🚨 High Randomness (> 4.0)"], ["3. Char N-Gram Rare-Pattern Score", "3-char sliding window", "'pay', 'ypa', 'pa1', '.tk'", "(1 + ln tf) × idf / ‖v‖₂", "F809 ('pa1') = 0.482", "🚨 Catches typo-squat '1' for 'l'!"]], "bars": [{"label": "Normal URL Entropy", "val": 2.9, "max": 5.0, "col": "emerald"}, {"label": "Suspect URL Entropy", "val": 4.32, "max": 5.0, "col": "rose"}]}]}};

  // ============================================================================
  // MODULE -> MODEL CALCULATOR & NUMBERS MOVIE MAPPING
  // ============================================================================
  var ML_LAB_MAP = {
    mod0: { calc: 'ols', movie: 'linear_regression', label: 'Best-Fit Line' },
    mod0_math: { calc: 'ols', movie: 'linear_regression', label: 'Main Goal & Best-Fit Line' },
    mod_vec: { calc: 'ols', movie: 'vectors_dot', label: 'Feature Lists, Multiply-and-Add & Best-Fit Line' },
    mod_design: { calc: 'ols', movie: 'linear_regression', label: 'Feature Table & Best-Fit Line' },
    mod_corr: { calc: 'ols', movie: 'stats_hypothesis', label: 'Move-Together Strength & Spread' },
    mod_pval_ci: { calc: 'ols', movie: 'stats_hypothesis', label: 'Chance of Pure Luck & Safe Range' },
    mod_fisher: { calc: 'knn_nb', sub: 'nb', movie: 'stats_hypothesis', label: 'Category Counts & Clue Odds' },
    mod_bestfit: { calc: 'ols', movie: 'linear_regression', label: 'Best-Fit Line & Direct Solution' },
    mod_coeff_r2: { calc: 'ols', movie: 'linear_regression', label: 'Score Explained % & Feature Weights' },
    mod_ttest: { calc: 'ols', movie: 'stats_hypothesis', label: 'Single-Clue Signal Test' },
    mod_anova_f: { calc: 'ols', movie: 'stats_hypothesis', label: 'Overall Signal-vs-Noise Test' },
    mod4_grad: { calc: 'gd_reg', movie: 'linear_regression', label: 'Downhill Error Nudge' },
    mod4_hessian: { calc: 'gd_reg', movie: 'linear_regression', label: 'Bowl Steepness Jump' },
    mod4: { calc: 'gd_reg', movie: 'linear_regression', label: 'Step-by-Step Tuners' },
    mod4_opt: { calc: 'gd_reg', movie: 'linear_regression', label: 'Step-by-Step Tuners' },
    mod5: { calc: 'gd_reg', movie: 'ridge_lasso', label: 'Smooth Shrink vs Zero-Out Penalties' },
    mod6_odds: { calc: 'logistic', movie: 'logistic_regression', label: 'Score-to-Odds & Risk Multiplier' },
    mod6_mle: { calc: 'logistic', movie: 'logistic_regression', label: 'Best-Fit Chance & Surprise Penalty' },
    mod6_deviance: { calc: 'logistic', movie: 'logistic_regression', label: 'Error Penalty & Penalty Reduction %' },
    mod6_wald: { calc: 'logistic', movie: 'logistic_regression', label: 'Weight Signal-to-Noise Check' },
    mod_idf_idft: { calc: 'tfidf_entropy', sub: 'tfidf', movie: 'url_forensics', label: 'Pattern Rarity & Balanced Score' },
    mod7: { calc: 'knn_nb', sub: 'knn', movie: 'knn', label: 'Nearest Neighbors & Clue Odds' },
    mod8: { calc: 'svm', movie: 'svm', label: 'Widest Safety Street Classifier' },
    mod9: { calc: 'cart_tree', movie: 'decision_tree', label: 'Yes-or-No Question Tree' },
    mod10: { calc: 'xgboost_rf', sub: 'xgb', movie: 'xgboost', label: 'Team of Mistake-Fixing Trees & Voting Forest' },
    mod11: { calc: 'eval_metrics', movie: 'logistic_regression', label: 'Accuracy Report & Ranking Curve' },
    mod12: { calc: 'unsup_pca', sub: 'kmeans', movie: 'kmeans_dbscan', label: 'Group Finding & Column Compression' },
    mod13: { calc: 'unsup_pca', sub: 'pca', movie: 'pca', label: 'Fair Scaling, Compression & Pattern Rarity' },
    mod14: { calc: 'nn_backprop', sub: 'mlp', movie: 'neural_backprop', label: 'Layered Network & Blame Assignment' },
    mod15: { calc: 'nn_backprop', sub: 'attn_rl', movie: 'q_learning', label: 'Focus Weights & Reward Learning' },
    mod16: { calc: 'eval_metrics', movie: 'xgboost', label: 'Full Pipeline Accuracy Check' },
    mod17: { calc: 'eval_metrics', movie: 'xgboost', label: 'Live Monitoring & Data Shift' }
  };

  var LL_LAB_MAP = {
    mod0: { calc: 'logistic', movie: 'logistic_regression', label: 'Phishing Clue Odds & Risk' },
    mod1: { calc: 'tfidf_entropy', sub: 'entropy', movie: 'url_forensics', label: 'Character Randomness Score' },
    mod2: { calc: 'tfidf_entropy', sub: 'tfidf', movie: 'url_forensics', label: 'Letter-Chunk Rarity Score' },
    mod3: { calc: 'xgboost_rf', sub: 'xgb', movie: 'xgboost', label: 'Boosting Tree Split & Leaf Updates' },
    mod4: { calc: 'logistic', movie: 'xgboost', label: '300-Tree Score to Phishing Chance' },
    mod5: { calc: 'eval_metrics', movie: 'logistic_regression', label: 'Imbalance, Chance Error & Balance Score' },
    mod6: { calc: 'lurelock_pipeline', movie: 'url_forensics', label: 'Full Phishing Pipeline Score' },
    mod7: { calc: 'lurelock_pipeline', movie: 'url_forensics', label: 'Balanced Data Split & Cleaning' },
    mod8: { calc: 'cart_tree', movie: 'decision_tree', label: 'Domain Question Split & Purity' },
    mod9: { calc: 'tfidf_entropy', sub: 'entropy', movie: 'url_forensics', label: '18 Link Clues & Randomness' },
    mod10: { calc: 'tfidf_entropy', sub: 'tfidf', movie: 'url_forensics', label: 'Combined Word & Character Clues' },
    mod11: { calc: 'xgboost_rf', sub: 'xgb', movie: 'xgboost', label: 'Training 300 Mistake-Fixing Trees' },
    mod12: { calc: 'eval_metrics', movie: 'xgboost', label: 'Final Test Report & Honest Chances' },
    mod13: { calc: 'lurelock_pipeline', movie: 'xgboost', label: '5-Layer Defense Summary' },
    mod14: { calc: 'tfidf_entropy', sub: 'entropy', movie: 'url_forensics', label: 'Domain vs Path Randomness Gap' },
    mod15: { calc: 'tfidf_entropy', sub: 'entropy', movie: 'url_forensics', label: 'Character Pool Randomness Check' },
    mod16: { calc: 'tfidf_entropy', sub: 'entropy', movie: 'url_forensics', label: 'Raw Character Randomness' },
    mod17: { calc: 'lurelock_pipeline', movie: 'url_forensics', label: 'Live Link Signals & Data Split' },
    mod18: { calc: 'lurelock_pipeline', movie: 'xgboost', label: '3-Layer Final Threat Verdict' }
  };

  var CALCULATOR_CATALOG = [
    { id: 'ols', name: 'Best-Fit Line (Slope, Score Explained, Signal Tests)' },
    { id: 'gd_reg', name: 'Downhill Error Nudge, Bowl Jump & Weight Penalties' },
    { id: 'logistic', name: 'Yes/No Chance Line (Odds, Surprise Penalty, Signal Check)' },
    { id: 'knn_nb', name: 'Closest Neighbor Distances & Clue Odds' },
    { id: 'svm', name: 'Widest Safety Street & Curb Violations' },
    { id: 'cart_tree', name: 'Yes-or-No Question Tree (Mix-Up & Purity Gain)' },
    { id: 'xgboost_rf', name: 'Mistake-Fixing Trees & Voting Forest' },
    { id: 'eval_metrics', name: 'Threat Detection Report (Catch Rate, False Alarms, Ranking)' },
    { id: 'unsup_pca', name: 'Group Clustering Spread & Column Compression' },
    { id: 'nn_backprop', name: 'Neural Network Blame Flow, Focus & Reward Learning' },
    { id: 'tfidf_entropy', name: 'Character Randomness & Rare-Pattern Scoring' },
    { id: 'lurelock_pipeline', name: 'LureLock Data Split, Rare-Class Balance & Final Blend' }
  ];

  // ============================================================================
  // MUTABLE INTERACTIVE STATE FOR ALL 12 CALCULATORS & DRAWER
  // ============================================================================
  var ui = {
    isOpen: false,
    activeTab: 'calc', // 'calc' | 'movie' | 'showdown'
    activeCalcId: 'ols',
    activeMovieKey: 'linear_regression',
    movieStep: 0,
    showdownDs: 'phish',
    calcStep: 0,
    showAllCalcSteps: true,
    hlKey: null,
    subMode: {
      ols: '1d',       // '1d' | '2d'
      knn_nb: 'knn',   // 'knn' | 'nb'
      xgboost_rf: 'xgb', // 'xgb' | 'rf'
      unsup_pca: 'kmeans', // 'kmeans' | 'pca'
      nn_backprop: 'mlp',  // 'mlp' | 'attn_rl'
      tfidf_entropy: 'entropy' // 'entropy' | 'tfidf'
    }
  };

  var data = {
    ols: [
      { x1: 1, x2: 0, y: 50 },
      { x1: 2, x2: 1, y: 62 },
      { x1: 3, x2: 1, y: 68 },
      { x1: 4, x2: 2, y: 82 },
      { x1: 5, x2: 3, y: 92 }
    ],
    gd: {
      w: 2.0, b: 20.0, lr: 0.04, l2: 0.0, l1: 0.0,
      rows: [
        { x: 1, y: 50 },
        { x: 2, y: 60 },
        { x: 3, y: 70 },
        { x: 4, y: 80 }
      ]
    },
    logistic: {
      b0: -3.2, b1: 1.1,
      rows: [
        { x: 1.0, y: 0 },
        { x: 2.0, y: 0 },
        { x: 3.0, y: 1 },
        { x: 4.0, y: 1 },
        { x: 5.0, y: 1 }
      ]
    },
    knn: {
      k: 3, scaleZ: false, q1: 4.0, q2: 4.2,
      rows: [
        { name: 'paypa1.tk', x1: 4, x2: 4.0, y: 1 },
        { name: 'bank-sec.xyz', x1: 5, x2: 4.3, y: 1 },
        { name: 'docs.internal', x1: 3, x2: 3.9, y: 0 },
        { name: 'github.com', x1: 1, x2: 2.2, y: 0 },
        { name: 'wiki.org', x1: 1, x2: 2.0, y: 0 }
      ]
    },
    nb: {
      nPhish: 100, nSafe: 100,
      c1Phish: 40, c1Safe: 5,
      c2Phish: 30, c2Safe: 1,
      alpha: 1.0, hasC1: true, hasC2: true
    },
    svm: {
      w1: 0.8, w2: 0.6, b: -3.0, C: 1.0,
      rows: [
        { x1: 1, x2: 1, y: -1 },
        { x1: 2, x2: 1.5, y: -1 },
        { x1: 3, x2: 2.5, y: 1 },
        { x1: 4, x2: 3, y: 1 }
      ]
    },
    cart: {
      theta: 3.5,
      rows: [
        { name: 'google.com', x: 2.65, y: 0 },
        { name: 'github.com', x: 2.80, y: 0 },
        { name: 'wiki.org', x: 3.10, y: 0 },
        { name: '192.168.4.22', x: 3.85, y: 1 },
        { name: 'paypa1.tk', x: 4.10, y: 1 },
        { name: 'chase-8f3k.xyz', x: 4.35, y: 1 }
      ]
    },
    xgb: {
      lam: 1.0, gamma: 0.10, eta: 0.30, posW: 1.0,
      rows: [
        { name: 'google.com', y: 0, p: 0.50, side: 'L' },
        { name: 'github.com', y: 0, p: 0.50, side: 'L' },
        { name: '192.168.4.22', y: 1, p: 0.50, side: 'R' },
        { name: 'paypa1.tk', y: 1, p: 0.50, side: 'R' },
        { name: 'chase-8f3k.xyz', y: 1, p: 0.50, side: 'R' }
      ]
    },
    rf: {
      B: 25, rho: 0.25, sigma2: 1.0,
      // 5 rows x 4 trees: 1=In-Bag, 0=OOB(correct), -1=OOB(wrong)
      oob: [
        [1, 0, 1, 0],   // y=1, OOB trees vote right
        [0, 1, 0, 1],   // y=0
        [1, 1, -1, 0],  // mixed OOB
        [0, 0, 1, 1],
        [1, 0, 0, 1]
      ]
    },
    eval: {
      tau: 0.50,
      rows: [
        { name: 'URL #1', y: 1, p: 0.94 },
        { name: 'URL #2', y: 1, p: 0.81 },
        { name: 'URL #3', y: 1, p: 0.44 },
        { name: 'URL #4', y: 0, p: 0.62 },
        { name: 'URL #5', y: 0, p: 0.24 },
        { name: 'URL #6', y: 0, p: 0.08 }
      ]
    },
    kmeans: {
      rows: [
        { name: 'A1', x1: 1.0, x2: 1.5, c: 'A' },
        { name: 'A2', x1: 2.0, x2: 2.5, c: 'A' },
        { name: 'B1', x1: 6.0, x2: 5.5, c: 'B' },
        { name: 'B2', x1: 7.0, x2: 6.5, c: 'B' }
      ]
    },
    pca: {
      rows: [
        { x1: 1.0, x2: 3.0 },
        { x1: 2.0, x2: 6.2 },
        { x1: 3.0, x2: 8.8 },
        { x1: 4.0, x2: 12.0 }
      ]
    },
    mlp: {
      x: 1.5, y: 4.0, w1: 1.2, b1: 0.2, w2: 1.5, lr: 0.1, act: 'relu'
    },
    attn_rl: {
      s1: 2.4, s2: 1.0, s3: 0.2, dk: 4.0,
      qOld: 20.0, reward: 100.0, maxQNext: 50.0, alpha: 0.5, gamma: 0.9
    },
    entropy: {
      domain: 'paypa1-secure.tk',
      path: '8f3k9q2m'
    },
    tfidf: {
      N: 100000,
      rows: [
        { tok: 'pay', tf: 1, df: 4500 },
        { tok: 'ypa', tf: 1, df: 1200 },
        { tok: 'pa1', tf: 2, df: 15 }
      ]
    },
    llpipe: {
      nBenign: 160000, nPhish: 20000, testPct: 20, valPct: 10, pXgb: 0.86, pSub: 0.72
    }
  };

  function cloneDefaults(key) {
    var fresh = {
      ols: [{ x1: 1, x2: 0, y: 50 }, { x1: 2, x2: 1, y: 62 }, { x1: 3, x2: 1, y: 68 }, { x1: 4, x2: 2, y: 82 }, { x1: 5, x2: 3, y: 92 }],
      gd: { w: 2.0, b: 20.0, lr: 0.04, l2: 0.0, l1: 0.0, rows: [{ x: 1, y: 50 }, { x: 2, y: 60 }, { x: 3, y: 70 }, { x: 4, y: 80 }] },
      logistic: { b0: -3.2, b1: 1.1, rows: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }] },
      knn: { k: 3, scaleZ: false, q1: 4.0, q2: 4.2, rows: [{ name: 'paypa1.tk', x1: 4, x2: 4.0, y: 1 }, { name: 'bank-sec.xyz', x1: 5, x2: 4.3, y: 1 }, { name: 'docs.internal', x1: 3, x2: 3.9, y: 0 }, { name: 'github.com', x1: 1, x2: 2.2, y: 0 }, { name: 'wiki.org', x1: 1, x2: 2.0, y: 0 }] },
      nb: { nPhish: 100, nSafe: 100, c1Phish: 40, c1Safe: 5, c2Phish: 30, c2Safe: 1, alpha: 1.0, hasC1: true, hasC2: true },
      svm: { w1: 0.8, w2: 0.6, b: -3.0, C: 1.0, rows: [{ x1: 1, x2: 1, y: -1 }, { x1: 2, x2: 1.5, y: -1 }, { x1: 3, x2: 2.5, y: 1 }, { x1: 4, x2: 3, y: 1 }] },
      cart: { theta: 3.5, rows: [{ name: 'google.com', x: 2.65, y: 0 }, { name: 'github.com', x: 2.80, y: 0 }, { name: 'wiki.org', x: 3.10, y: 0 }, { name: '192.168.4.22', x: 3.85, y: 1 }, { name: 'paypa1.tk', x: 4.10, y: 1 }, { name: 'chase-8f3k.xyz', x: 4.35, y: 1 }] },
      xgb: { lam: 1.0, gamma: 0.10, eta: 0.30, posW: 1.0, rows: [{ name: 'google.com', y: 0, p: 0.50, side: 'L' }, { name: 'github.com', y: 0, p: 0.50, side: 'L' }, { name: '192.168.4.22', y: 1, p: 0.50, side: 'R' }, { name: 'paypa1.tk', y: 1, p: 0.50, side: 'R' }, { name: 'chase-8f3k.xyz', y: 1, p: 0.50, side: 'R' }] },
      rf: { B: 25, rho: 0.25, sigma2: 1.0, oob: [[1, 0, 1, 0], [0, 1, 0, 1], [1, 1, -1, 0], [0, 0, 1, 1], [1, 0, 0, 1]] },
      eval: { tau: 0.50, rows: [{ name: 'URL #1', y: 1, p: 0.94 }, { name: 'URL #2', y: 1, p: 0.81 }, { name: 'URL #3', y: 1, p: 0.44 }, { name: 'URL #4', y: 0, p: 0.62 }, { name: 'URL #5', y: 0, p: 0.24 }, { name: 'URL #6', y: 0, p: 0.08 }] },
      kmeans: { rows: [{ name: 'A1', x1: 1.0, x2: 1.5, c: 'A' }, { name: 'A2', x1: 2.0, x2: 2.5, c: 'A' }, { name: 'B1', x1: 6.0, x2: 5.5, c: 'B' }, { name: 'B2', x1: 7.0, x2: 6.5, c: 'B' }] },
      pca: { rows: [{ x1: 1.0, x2: 3.0 }, { x1: 2.0, x2: 6.2 }, { x1: 3.0, x2: 8.8 }, { x1: 4.0, x2: 12.0 }] },
      mlp: { x: 1.5, y: 4.0, w1: 1.2, b1: 0.2, w2: 1.5, lr: 0.1, act: 'relu' },
      attn_rl: { s1: 2.4, s2: 1.0, s3: 0.2, dk: 4.0, qOld: 20.0, reward: 100.0, maxQNext: 50.0, alpha: 0.5, gamma: 0.9 },
      entropy: { domain: 'paypa1-secure.tk', path: '8f3k9q2m' },
      tfidf: { N: 100000, rows: [{ tok: 'pay', tf: 1, df: 4500 }, { tok: 'ypa', tf: 1, df: 1200 }, { tok: 'pa1', tf: 2, df: 15 }] },
      llpipe: { nBenign: 160000, nPhish: 20000, testPct: 20, valPct: 10, pXgb: 0.86, pSub: 0.72 }
    };
    return JSON.parse(JSON.stringify(fresh[key]));
  }

  // ============================================================================
  // SHARED HTML FRAGMENT BUILDERS FOR STEPS, CHIPS, STAT CARDS & PYTHON BOX
  // ============================================================================
  function renderStatGrid(items) {
    return '<div class="v82-stat-grid">' + items.map(function (it) {
      return '<div class="v82-stat-pill">' +
        '<div class="v82-stat-label">' + esc(it.label) + '</div>' +
        '<div class="v82-stat-val" style="' + (it.color ? ('color:' + it.color + ';') : '') + '">' + esc(it.val) + '</div>' +
        (it.sub ? '<div class="text-[10px] text-[var(--muted-foreground)] mt-0.5">' + esc(it.sub) + '</div>' : '') +
      '</div>';
    }).join('') + '</div>';
  }

  function renderFormulaChips(chips) {
    return '<div class="v82-card">' +
      '<div class="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2">🔍 Hover or Click a Formula Term to Highlight Its Table Column &amp; Step</div>' +
      '<div class="v82-chip-row">' +
      chips.map(function (ch) {
        var active = ui.hlKey === ch.key ? ' is-hl' : '';
        return '<button type="button" class="v82-formula-chip' + active + '" data-v82-hl="' + esc(ch.key) + '">' + esc(ch.label) + '</button>';
      }).join('') +
      '</div></div>';
  }

  function renderStepCards(steps) {
    var total = steps.length;
    if (ui.calcStep >= total) ui.calcStep = 0;
    var nav =
      '<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">' +
        '<div class="text-xs font-bold uppercase tracking-wider text-sky-400">🔢 Step-by-Step Arithmetic With Your Live Numbers</div>' +
        '<div class="flex items-center gap-1.5">' +
          (!ui.showAllCalcSteps
            ? '<button type="button" class="v82-btn-sm" data-v82-cstep="-1" ' + (ui.calcStep === 0 ? 'disabled' : '') + '>◀ Prev</button>' +
              '<span class="text-[11px] font-mono text-[var(--muted-foreground)]">Step ' + (ui.calcStep + 1) + '/' + total + '</span>' +
              '<button type="button" class="v82-btn-sm" data-v82-cstep="1" ' + (ui.calcStep >= total - 1 ? 'disabled' : '') + '>Next ▶</button>'
            : '') +
          '<button type="button" class="v82-btn-sm ' + (ui.showAllCalcSteps ? 'is-active' : '') + '" data-v82-toggle-csteps="1">' +
            (ui.showAllCalcSteps ? 'Focus 1 Step at a Time' : 'Expand All ' + total + ' Steps') +
          '</button>' +
        '</div>' +
      '</div>';

    var cards = steps.map(function (st, idx) {
      var visible = ui.showAllCalcSteps || idx === ui.calcStep;
      var hlCls = (ui.hlKey && st.hl && st.hl.indexOf(ui.hlKey) !== -1) ? ' is-hl' : '';
      if (!visible) {
        return '<button type="button" data-v82-goto-cstep="' + idx + '" class="w-full text-left v82-step-card opacity-75 hover:opacity-100 cursor-pointer">' +
          '<span class="v82-step-badge">Step ' + (idx + 1) + '</span>' +
          '<strong>' + esc(st.title) + '</strong>' +
          '<span class="text-[11px] text-sky-400 ml-2">(click to inspect)</span>' +
        '</button>';
      }
      return '<div class="v82-step-card' + hlCls + '" data-hl-step="' + esc((st.hl || []).join(' ')) + '">' +
        '<div class="font-bold text-[var(--foreground)] mb-1"><span class="v82-step-badge">Step ' + (idx + 1) + '</span>' + esc(st.title) + '</div>' +
        '<div class="text-slate-200 leading-relaxed space-y-1">' + st.body + '</div>' +
      '</div>';
    }).join('');

    return '<div class="v82-card space-y-2">' + nav + '<div class="space-y-2">' + cards + '</div></div>';
  }

  function renderPythonBox(code) {
    return '<details class="v82-card">' +
      '<summary class="text-xs font-bold text-emerald-300 cursor-pointer flex items-center justify-between gap-2">' +
        '<span>🐍 Verify These Exact Live Numbers in Python (NumPy / Scikit-Learn)</span>' +
        '<span class="text-[11px] font-mono text-[var(--muted-foreground)]">Tap to expand</span>' +
      '</summary>' +
      '<div class="mt-2.5 space-y-2">' +
        '<div class="flex justify-end"><button type="button" class="v82-btn-sm" data-v82-copy-py="1">📋 Copy Python</button></div>' +
        '<pre id="v82-py-snippet-pre" class="p-3 rounded-lg bg-[#020617] border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">' + esc(code) + '</pre>' +
      '</div>' +
    '</details>';
  }

  // ============================================================================
  // CALCULATOR 1: OLS LINEAR REGRESSION & INFERENCE (1D & 2D)
  // ============================================================================
  function buildOlsInputs() {
    var is2d = ui.subMode.ols === '2d';
    var rows = data.ols;
    var presetBar =
      '<div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">' +
        '<div class="flex flex-wrap items-center gap-1.5">' +
          '<button type="button" class="v82-btn-sm ' + (!is2d ? 'is-active' : '') + '" data-v82-sub="ols:1d">1-Clue Line (Hours only)</button>' +
          '<button type="button" class="v82-btn-sm ' + (is2d ? 'is-active' : '') + '" data-v82-sub="ols:2d">2-Clue Plane (Hours + Tests)</button>' +
        '</div>' +
        '<div class="flex flex-wrap items-center gap-1.5">' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="ols:default">Cohort</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="ols:perfect">Perfect Line</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="ols:outlier">With Outlier</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="ols:noise">Pure Noise</button>' +
        '</div>' +
      '</div>';

    var tableRows = rows.map(function (r, idx) {
      return '<tr>' +
        '<td class="font-bold text-sky-300">S' + (idx + 1) + '</td>' +
        '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="ols.' + idx + '.x1" value="' + r.x1 + '" /></td>' +
        (is2d ? '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="ols.' + idx + '.x2" value="' + r.x2 + '" /></td>' : '') +
        '<td><input type="number" step="1" class="v82-num-input" data-v82-edit="ols.' + idx + '.y" value="' + r.y + '" /></td>' +
      '</tr>';
    }).join('');

    return '<div class="v82-card v82-card-sky">' +
      presetBar +
      '<div class="text-[11px] text-slate-300 mb-2">Edit any Study Hours, ' + (is2d ? 'Practice Tests, ' : '') + 'or Real Score below — every mistake, score share explained, wiggle margin, signal score, and luck chance updates live:</div>' +
      '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>Row</th><th>Study Hours</th>' + (is2d ? '<th>Practice Tests</th>' : '') + '<th>Real Score</th>' +
      '</tr></thead><tbody>' + tableRows + '</tbody></table></div>' +
    '</div>';
  }

  function buildOlsOutputs() {
    var rows = data.ols;
    var n = rows.length;
    var is2d = ui.subMode.ols === '2d';
    var p = is2d ? 2 : 1;

    var sumX1 = 0, sumX2 = 0, sumY = 0;
    rows.forEach(function (r) { sumX1 += r.x1; sumX2 += r.x2; sumY += r.y; });
    var meanX1 = sumX1 / n, meanX2 = sumX2 / n, meanY = sumY / n;

    var b0 = 0, b1 = 0, b2 = 0, seB1 = NaN, seB2 = NaN;
    var ssxx = 0, ssyy = 0, ssxy = 0;
    rows.forEach(function (r) {
      var dx = r.x1 - meanX1, dy = r.y - meanY;
      ssxx += dx * dx; ssyy += dy * dy; ssxy += dx * dy;
    });
    var pearsonR = (ssxx > 0 && ssyy > 0) ? (ssxy / Math.sqrt(ssxx * ssyy)) : 0;

    if (!is2d) {
      b1 = ssxx > 1e-12 ? ssxy / ssxx : 0;
      b0 = meanY - b1 * meanX1;
    } else {
      var XtX = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      var Xty = [0, 0, 0];
      rows.forEach(function (r) {
        var v = [1, r.x1, r.x2];
        for (var i = 0; i < 3; i++) {
          Xty[i] += v[i] * r.y;
          for (var j = 0; j < 3; j++) XtX[i][j] += v[i] * v[j];
        }
      });
      var inv = invert3x3(XtX);
      if (inv) {
        b0 = inv[0][0] * Xty[0] + inv[0][1] * Xty[1] + inv[0][2] * Xty[2];
        b1 = inv[1][0] * Xty[0] + inv[1][1] * Xty[1] + inv[1][2] * Xty[2];
        b2 = inv[2][0] * Xty[0] + inv[2][1] * Xty[1] + inv[2][2] * Xty[2];
        // will scale by s later
        seB1 = inv[1][1];
        seB2 = inv[2][2];
      } else {
        b1 = ssxx > 1e-12 ? ssxy / ssxx : 0;
        b0 = meanY - b1 * meanX1;
      }
    }

    var ssRes = 0, ssReg = 0;
    var compRows = rows.map(function (r, idx) {
      var yh = is2d ? (b0 + b1 * r.x1 + b2 * r.x2) : (b0 + b1 * r.x1);
      var e = r.y - yh;
      var e2 = e * e;
      var dy = r.y - meanY;
      var dy2 = dy * dy;
      ssRes += e2;
      ssReg += (yh - meanY) * (yh - meanY);
      return { idx: idx + 1, x1: r.x1, x2: r.x2, y: r.y, dx: r.x1 - meanX1, dy: dy, yh: yh, e: e, e2: e2, dy2: dy2 };
    });

    var r2 = ssyy > 1e-12 ? (1 - ssRes / ssyy) : 0;
    var dfRes = Math.max(1, n - p - 1);
    var adjR2 = 1 - ((1 - r2) * (n - 1) / dfRes);
    var mse = ssRes / n;
    var rmse = Math.sqrt(mse);
    var resSD = Math.sqrt(ssRes / dfRes);

    var se1 = !is2d ? (ssxx > 1e-12 ? resSD / Math.sqrt(ssxx) : NaN) : (!isNaN(seB1) ? resSD * Math.sqrt(Math.max(0, seB1)) : NaN);
    var se2 = is2d && !isNaN(seB2) ? resSD * Math.sqrt(Math.max(0, seB2)) : NaN;
    var t1 = se1 > 1e-12 ? (b1 / se1) : (Math.abs(b1) > 1e-9 ? 999 : 0);
    var p1 = tPValue(t1, dfRes);
    var t2 = is2d && se2 > 1e-12 ? (b2 / se2) : NaN;
    var p2 = is2d ? tPValue(t2, dfRes) : NaN;

    var msReg = Math.max(0, ssyy - ssRes) / p;
    var msRes = ssRes / dfRes;
    var fStat = msRes > 1e-12 ? (msReg / msRes) : 999;
    var fP = fPValue(fStat, p, dfRes);

    var chips = renderFormulaChips([
      { key: 'xdev', label: 'Hours Above/Below Average' },
      { key: 'ydev', label: 'Score Above/Below Average' },
      { key: 'yhat', label: is2d ? 'Line Guess (Base + Hours + Tests)' : 'Line Guess (Base + Hours)' },
      { key: 'resid', label: 'Guess Error (Real − Guess)' },
      { key: 'sqerr', label: 'Model Squared Error Total' },
      { key: 'sqtot', label: 'Baseline Squared Error Total' }
    ]);

    var statItems = [
      { label: 'Points per Hour (Slope)', val: fmtSigned(b1, 3), sub: 'Starting Base = ' + fmt(b0, 2) },
      is2d ? { label: 'Points per Test (Slope 2)', val: fmtSigned(b2, 3), sub: 'Signal = ' + fmt(t2, 2) + ' (Luck=' + fmtP(p2) + ')' } : { label: 'Move-Together Strength', val: fmtSigned(pearsonR, 4), sub: 'Squared = ' + fmt(pearsonR * pearsonR, 4) },
      { label: 'Score Explained %', val: (r2 * 100).toFixed(1) + '%', sub: 'Share = ' + fmt(r2, 4) + ' of score spread' },
      { label: 'Clue-Adjusted Explained %', val: (adjR2 * 100).toFixed(1) + '%', sub: 'Leftover points = ' + dfRes + ' (Clues = ' + p + ')' },
      { label: 'Typical Error Size', val: fmt(rmse, 2) + ' pts', sub: 'Avg Squared Error = ' + fmt(mse, 2) },
      { label: 'Signal-to-Noise Score', val: fmt(t1, 2), sub: 'Luck chance = ' + fmtP(p1) + (p1 < 0.05 ? ' ✅' : ' (Could be luck)'), color: p1 < 0.05 ? '#34d399' : '#fbbf24' },
      { label: 'Overall Signal-vs-Noise', val: fmt(fStat, 2), sub: 'Model luck = ' + fmtP(fP), color: fP < 0.05 ? '#34d399' : '#fbbf24' }
    ];

    var calcTable = '<div class="v82-card"><div class="text-xs font-bold text-sky-300 mb-2">📊 Live Row-by-Row Number Breakdown (Totals &amp; Averages at Bottom)</div>' +
      '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>Row</th>' +
        '<th data-col="xdev">Hours vs Avg</th>' +
        '<th data-col="ydev">Score vs Avg</th>' +
        '<th data-col="yhat">Line Guess</th>' +
        '<th data-col="resid">Leftover Error</th>' +
        '<th data-col="sqerr">Error Squared</th>' +
        '<th data-col="sqtot">Spread Squared</th>' +
      '</tr></thead><tbody>' +
      compRows.map(function (c) {
        return '<tr>' +
          '<td class="font-bold text-sky-300">S' + c.idx + '</td>' +
          '<td data-col="xdev">' + fmtSigned(c.dx, 2) + '</td>' +
          '<td data-col="ydev">' + fmtSigned(c.dy, 2) + '</td>' +
          '<td data-col="yhat" class="text-sky-300">' + fmt(c.yh, 2) + '</td>' +
          '<td data-col="resid" class="text-amber-300">' + fmtSigned(c.e, 2) + '</td>' +
          '<td data-col="sqerr" class="text-rose-300">' + fmt(c.e2, 2) + '</td>' +
          '<td data-col="sqtot">' + fmt(c.dy2, 2) + '</td>' +
        '</tr>';
      }).join('') +
      '<tr class="bg-slate-900/90 font-bold">' +
        '<td>TOTAL / AVG</td>' +
        '<td data-col="xdev">Avg Hours=' + fmt(meanX1, 2) + '</td>' +
        '<td data-col="ydev">Avg Score=' + fmt(meanY, 2) + '</td>' +
        '<td data-col="yhat">Hours Spread=' + fmt(ssxx, 1) + '</td>' +
        '<td data-col="resid">Error Sum=0.00</td>' +
        '<td data-col="sqerr" class="text-rose-400">Model Sq Err=' + fmt(ssRes, 2) + '</td>' +
        '<td data-col="sqtot" class="text-emerald-400">Baseline Sq Err=' + fmt(ssyy, 2) + '</td>' +
      '</tr></tbody></table></div></div>';

    var steps = [
      {
        title: 'Find Averages & How Hours and Scores Move Together',
        hl: ['xdev', 'ydev'],
        body: 'Average Hours = <code>' + fmt(sumX1, 1) + ' ÷ ' + n + ' = ' + fmt(meanX1, 2) + '</code>, Average Score = <code>' + fmt(sumY, 1) + ' ÷ ' + n + ' = ' + fmt(meanY, 2) + '</code>.<br>' +
              'Hours-Score Move-Together Sum = <code>' + fmt(ssxy, 2) + '</code>; Hours Squared Spread = <code>' + fmt(ssxx, 2) + '</code>.<br>' +
              'Move-Together Strength: <code>' + fmt(ssxy, 2) + ' ÷ √(' + fmt(ssxx, 2) + ' × ' + fmt(ssyy, 2) + ') = <strong>' + fmtSigned(pearsonR, 4) + '</strong></code>.'
      },
      {
        title: is2d ? 'Solve Best-Fit Weights for Both Clues Together' : 'Find Best-Fit Slope (Points per Hour) & Starting Base',
        hl: ['xdev', 'ydev', 'yhat'],
        body: !is2d
          ? 'Points per Hour (Slope): <code>Move-Together Sum ÷ Hours Spread = ' + fmt(ssxy, 2) + ' ÷ ' + fmt(ssxx, 2) + ' = <strong>' + fmt(b1, 3) + '</strong></code>.<br>' +
            'Starting Base: <code>Avg Score − (Slope × Avg Hours) = ' + fmt(meanY, 2) + ' − (' + fmt(b1, 3) + ' × ' + fmt(meanX1, 2) + ') = <strong>' + fmt(b0, 3) + '</strong></code>.'
          : 'Solving the 2-clue balance system gives: Starting Base = <code>' + fmt(b0, 3) + '</code>, Hours Weight = <code>' + fmtSigned(b1, 3) + '</code>, Tests Weight = <code>' + fmtSigned(b2, 3) + '</code>.'
      },
      {
        title: 'Measure Leftover Errors, Score Explained % & Typical Error Size',
        hl: ['yhat', 'resid', 'sqerr', 'sqtot'],
        body: 'Model Squared Error Total = <code>' + compRows.map(function (c) { return fmt(c.e2, 2); }).join(' + ') + ' = <strong>' + fmt(ssRes, 2) + '</strong></code>.<br>' +
              'Blind-average Baseline Squared Error = <code><strong>' + fmt(ssyy, 2) + '</strong></code>.<br>' +
              'Score Explained = <code>1 − (' + fmt(ssRes, 2) + ' ÷ ' + fmt(ssyy, 2) + ') = <strong>' + (r2 * 100).toFixed(1) + '%</strong></code>; ' +
              'Clue-Adjusted Explained = <code>1 − [(1 − ' + fmt(r2, 4) + ') × ' + (n - 1) + ' ÷ ' + dfRes + '] = <strong>' + (adjR2 * 100).toFixed(1) + '%</strong></code>; ' +
              'Typical Error Size = <code>√(' + fmt(ssRes, 2) + ' ÷ ' + n + ') = <strong>' + fmt(rmse, 3) + ' pts</strong></code>.'
      },
      {
        title: 'Check Wiggle Uncertainty, Signal-to-Noise Score & Luck Chance',
        hl: ['sqerr', 'sqtot'],
        body: 'Typical Leftover Error: <code>√(Model Squared Error ÷ Leftover Points) = √(' + fmt(ssRes, 2) + ' ÷ ' + dfRes + ') = <strong>' + fmt(resSD, 3) + '</strong></code>.<br>' +
              'Slope Wiggle Margin = <code><strong>' + fmt(se1, 3) + '</strong></code> → Signal-to-Noise Score = <code>' + fmt(b1, 3) + ' ÷ ' + fmt(se1, 3) + ' = <strong>' + fmt(t1, 2) + '</strong></code> → Luck Chance = <code><strong>' + fmtP(p1) + '</strong></code>.<br>' +
              'Overall Signal vs Noise: <code>Explained per Clue = ' + fmt(Math.max(0, ssyy - ssRes), 2) + ' ÷ ' + p + ' = ' + fmt(msReg, 2) + '</code>; <code>Avg Leftover Error = ' + fmt(msRes, 2) + '</code> → <code>Signal Ratio = <strong>' + fmt(fStat, 2) + '</strong></code> (Luck Chance = <code>' + fmtP(fP) + '</code>).'
      }
    ];

    var pyCode =
      'import numpy as np\n' +
      'from scipy import stats\n' +
      'hours = np.array([' + rows.map(function (r) { return r.x1; }).join(', ') + '], dtype=float)\n' +
      (is2d ? 'tests = np.array([' + rows.map(function (r) { return r.x2; }).join(', ') + '], dtype=float)\n' : '') +
      'score = np.array([' + rows.map(function (r) { return r.y; }).join(', ') + '], dtype=float)\n' +
      (is2d
        ? 'table = np.column_stack([np.ones_like(hours), hours, tests])\nweights = np.linalg.lstsq(table, score, rcond=None)[0]\nguess = table @ weights'
        : 'res = stats.linregress(hours, score)\nweights = [res.intercept, res.slope]\nguess = weights[0] + weights[1] * hours') + '\n' +
      'model_sq_err = np.sum((score - guess)**2); base_sq_err = np.sum((score - score.mean())**2)\n' +
      'explained_share = 1 - model_sq_err / base_sq_err\n' +
      'print("weights:", np.round(weights, 3), "Explained:", round(explained_share * 100, 1), "%  Typical Error:", round(np.sqrt(model_sq_err/len(score)), 3))';

    return chips + renderStatGrid(statItems) + calcTable + renderStepCards(steps) + renderPythonBox(pyCode);
  }

  // ============================================================================
  // CALCULATOR 2: GRADIENT DESCENT, HESSIAN & RIDGE / LASSO LOSS
  // ============================================================================
  function buildGdInputs() {
    var st = data.gd;
    return '<div class="v82-card v82-card-sky space-y-2.5">' +
      '<div class="flex flex-wrap items-center justify-between gap-2">' +
        '<div class="flex flex-wrap gap-1.5">' +
          '<button type="button" class="v82-btn-sm is-active" data-v82-action="gd:step">⬇ Take 1 Small Downhill Step</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-action="gd:newton">⚡ Take 1 Smart Bowl-Jump Step</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="gd:default">↺ Reset</button>' +
        '</div>' +
      '</div>' +
      '<div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">' +
        '<div><label class="block text-[10px] text-slate-400">Slope Weight</label><input type="number" step="0.5" class="v82-num-input w-full" data-v82-edit="gd.w" value="' + st.w + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Starting Base</label><input type="number" step="1" class="v82-num-input w-full" data-v82-edit="gd.b" value="' + st.b + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Step Size</label><input type="number" step="0.01" min="0.001" class="v82-num-input w-full" data-v82-edit="gd.lr" value="' + st.lr + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Smooth Shrink Penalty</label><input type="number" step="0.5" min="0" class="v82-num-input w-full" data-v82-edit="gd.l2" value="' + st.l2 + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Zero-Out Penalty</label><input type="number" step="0.5" min="0" class="v82-num-input w-full" data-v82-edit="gd.l1" value="' + st.l1 + '"></div>' +
      '</div>' +
      '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Row</th><th>Study Hours</th><th>Real Score</th></tr></thead><tbody>' +
        st.rows.map(function (r, idx) {
          return '<tr><td class="text-sky-300 font-bold">#' + (idx + 1) + '</td>' +
            '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="gd.rows.' + idx + '.x" value="' + r.x + '"></td>' +
            '<td><input type="number" step="1" class="v82-num-input" data-v82-edit="gd.rows.' + idx + '.y" value="' + r.y + '"></td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
  }

  function computeGdStats() {
    var st = data.gd;
    var n = st.rows.length;
    var sumE = 0, sumE2 = 0, sumEX = 0, sumX2 = 0;
    var comp = st.rows.map(function (r, idx) {
      var yh = st.w * r.x + st.b;
      var e = yh - r.y;
      var e2 = e * e;
      var ex = 2 * e * r.x;
      sumE += e; sumE2 += e2; sumEX += ex; sumX2 += r.x * r.x;
      return { idx: idx + 1, x: r.x, y: r.y, yh: yh, e: e, e2: e2, ex: ex };
    });
    var mse = sumE2 / n;
    var penL2 = st.l2 * st.w * st.w;
    var penL1 = st.l1 * Math.abs(st.w);
    var totLoss = mse + penL2 + penL1;
    var signW = st.w > 0 ? 1 : (st.w < 0 ? -1 : 0);
    var gradW = (sumEX / n) + 2 * st.l2 * st.w + st.l1 * signW;
    var gradB = (2 * sumE) / n;
    var hessWW = (2 * sumX2 / n) + 2 * st.l2;
    var hessBB = 2.0;
    var nextW = st.w - st.lr * gradW;
    var nextB = st.b - st.lr * gradB;
    var newtonW = hessWW > 1e-10 ? (st.w - gradW / hessWW) : st.w;
    return { comp: comp, n: n, mse: mse, penL2: penL2, penL1: penL1, totLoss: totLoss, gradW: gradW, gradB: gradB, hessWW: hessWW, hessBB: hessBB, nextW: nextW, nextB: nextB, newtonW: newtonW, sumE2: sumE2, sumEX: sumEX, sumX2: sumX2 };
  }

  function buildGdOutputs() {
    var st = data.gd;
    var g = computeGdStats();
    var chips = renderFormulaChips([
      { key: 'yhat', label: 'Model Guess = Weight × Hours + Base' },
      { key: 'err', label: 'Error = Guess − Real Score' },
      { key: 'err2', label: 'Average Squared Error' },
      { key: 'ex', label: 'Weight Nudge Direction' }
    ]);
    var stats = renderStatGrid([
      { label: 'Average Squared Error', val: fmt(g.mse, 2), sub: 'Total Squared Error = ' + fmt(g.sumE2, 1) },
      { label: 'Weight Size Penalty', val: fmt(g.penL2 + g.penL1, 2), sub: 'Smooth=' + fmt(g.penL2, 1) + ', Zero-Out=' + fmt(g.penL1, 1) },
      { label: 'Combined Score to Shrink', val: fmt(g.totLoss, 2), color: '#fbbf24' },
      { label: 'Weight Nudge Pull', val: fmtSigned(g.gradW, 2), sub: 'Base Nudge Pull = ' + fmtSigned(g.gradB, 2), color: '#38bdf8' },
      { label: 'Bowl Steepness', val: fmt(g.hessWW, 2), sub: 'How fast slope bends' },
      { label: 'Next Downhill Weight', val: fmt(g.nextW, 3), sub: 'Smart Bowl Jump = ' + fmt(g.newtonW, 3), color: '#34d399' }
    ]);
    var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
      '<th>Row</th><th>Hours</th><th>Real Score</th><th data-col="yhat">Model Guess</th><th data-col="err">Guess − Real</th><th data-col="err2">Error Squared</th><th data-col="ex">Row Nudge Pull</th>' +
      '</tr></thead><tbody>' +
      g.comp.map(function (c) {
        return '<tr><td class="font-bold text-sky-300">#' + c.idx + '</td><td>' + c.x + '</td><td>' + c.y + '</td>' +
          '<td data-col="yhat">' + fmt(c.yh, 2) + '</td>' +
          '<td data-col="err" class="text-amber-300">' + fmtSigned(c.e, 2) + '</td>' +
          '<td data-col="err2" class="text-rose-300">' + fmt(c.e2, 2) + '</td>' +
          '<td data-col="ex" class="text-sky-300">' + fmtSigned(c.ex, 2) + '</td></tr>';
      }).join('') +
      '</tbody></table></div></div>';

    var steps = [
      { title: 'Make Guesses & Measure Misses', hl: ['yhat', 'err'], body: 'Plug Weight = <code>' + fmt(st.w, 2) + '</code> and Base = <code>' + fmt(st.b, 2) + '</code> into <code>Weight × Hours + Base</code>, then subtract the Real Score to see whether each guess is too high or too low.' },
      { title: 'Add Up Average Squared Error + Weight Penalties', hl: ['err2'], body: '<code>Average Squared Error = ' + fmt(g.sumE2, 2) + ' ÷ ' + g.n + ' = <strong>' + fmt(g.mse, 2) + '</strong></code>.<br>Add weight penalties: Smooth Shrink + Zero-Out = <code><strong>' + fmt(g.penL2 + g.penL1, 2) + '</strong></code> → Total Score to Minimize = <code><strong>' + fmt(g.totLoss, 2) + '</strong></code>.' },
      { title: 'Find Which Way & How Strongly to Nudge Weight and Base', hl: ['ex'], body: '<code>Weight Nudge Pull = (' + fmt(g.sumEX, 2) + ' ÷ ' + g.n + ') + 2(' + fmt(st.l2, 2) + ')(' + fmt(st.w, 2) + ')' + (st.l1 > 0 ? (' + ' + fmt(st.l1, 2) + ' × sign') : '') + ' = <strong>' + fmtSigned(g.gradW, 3) + '</strong></code>.<br><code>Base Nudge Pull = <strong>' + fmtSigned(g.gradB, 3) + '</strong></code>.' },
      { title: 'Compare Small Step vs. Smart Bowl-Jump Step', hl: ['ex'], body: '<strong>Small Downhill Step:</strong> <code>Updated Weight = ' + fmt(st.w, 3) + ' − ' + st.lr + ' × (' + fmt(g.gradW, 3) + ') = <strong>' + fmt(g.nextW, 3) + '</strong></code>.<br><strong>Smart Bowl-Jump Step:</strong> Dividing by Bowl Steepness (<code>' + fmt(g.hessWW, 3) + '</code>) jumps straight to the bottom along fixed base: <code><strong>' + fmt(g.newtonW, 3) + '</strong></code>!' }
    ];

    var py = 'import numpy as np\nhours = np.array([' + st.rows.map(function (r) { return r.x; }).join(', ') + '], float)\nscore = np.array([' + st.rows.map(function (r) { return r.y; }).join(', ') + '], float)\nweight, base, step_size, shrink_pen, zero_pen = ' + st.w + ', ' + st.b + ', ' + st.lr + ', ' + st.l2 + ', ' + st.l1 + '\nerr = (weight*hours + base) - score\ntotal_loss = np.mean(err**2) + shrink_pen*weight**2 + zero_pen*abs(weight)\nnudge_weight = np.mean(2*err*hours) + 2*shrink_pen*weight + zero_pen*np.sign(weight)\nsteepness = np.mean(2*hours**2) + 2*shrink_pen\nprint("loss:", round(total_loss, 3), "nudge:", round(nudge_weight, 3), "steepness:", round(steepness, 3))';
    return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
  }

  // ============================================================================
  // CALCULATOR 3: LOGISTIC REGRESSION (LOGIT, ODDS, DEVIANCE, MCFADDEN R2, WALD)
  // ============================================================================
  function buildLogisticInputs() {
    var st = data.logistic;
    return '<div class="v82-card v82-card-sky space-y-2.5">' +
      '<div class="flex flex-wrap items-center justify-between gap-2">' +
        '<div class="flex flex-wrap gap-1.5">' +
          '<button type="button" class="v82-btn-sm is-active" data-v82-action="logistic:irls">⚡ Take 1 Smart Best-Fit Jump</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="logistic:default">Study Hours</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="logistic:phish">Phish Flags</button>' +
        '</div>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-2 text-xs">' +
        '<div><label class="block text-[10px] text-slate-400">Starting Score Base</label><input type="number" step="0.2" class="v82-num-input w-full" data-v82-edit="logistic.b0" value="' + fmt(st.b0, 3) + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Weight per Clue</label><input type="number" step="0.2" class="v82-num-input w-full" data-v82-edit="logistic.b1" value="' + fmt(st.b1, 3) + '"></div>' +
      '</div>' +
      '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Row</th><th>Clue Count</th><th>True Outcome (0 or 1)</th></tr></thead><tbody>' +
        st.rows.map(function (r, idx) {
          return '<tr><td class="text-sky-300 font-bold">#' + (idx + 1) + '</td>' +
            '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="logistic.rows.' + idx + '.x" value="' + r.x + '"></td>' +
            '<td><select class="v82-num-input" data-v82-edit="logistic.rows.' + idx + '.y"><option value="0" ' + (r.y === 0 ? 'selected' : '') + '>0 (Safe/Fail)</option><option value="1" ' + (r.y === 1 ? 'selected' : '') + '>1 (Phish/Pass)</option></select></td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
  }

  function computeLogisticStats() {
    var st = data.logistic;
    var n = st.rows.length;
    var ySum = 0;
    st.rows.forEach(function (r) { ySum += r.y; });
    var pBar = Math.max(1e-4, Math.min(1 - 1e-4, ySum / n));
    var nullNLL = 0, modelNLL = 0;
    var I00 = 0, I01 = 0, I11 = 0, g0 = 0, g1 = 0;
    var comp = st.rows.map(function (r, idx) {
      var z = st.b0 + st.b1 * r.x;
      var p = Math.max(1e-6, Math.min(1 - 1e-6, sigmoid(z)));
      var ll = -(r.y * Math.log(p) + (1 - r.y) * Math.log(1 - p));
      var nll = -(r.y * Math.log(pBar) + (1 - r.y) * Math.log(1 - pBar));
      var g = p - r.y;
      var h = p * (1 - p);
      modelNLL += ll; nullNLL += nll;
      I00 += h; I01 += h * r.x; I11 += h * r.x * r.x;
      g0 += g; g1 += g * r.x;
      return { idx: idx + 1, x: r.x, y: r.y, z: z, odds: Math.exp(Math.max(-20, Math.min(20, z))), p: p, ll: ll, g: g, h: h };
    });
    var nullDev = 2 * nullNLL;
    var modelDev = 2 * modelNLL;
    var mcFadden = nullDev > 1e-10 ? (1 - modelDev / nullDev) : 0;
    var sol = solve2x2([[I00, I01], [I01, I11]], [g0, g1]);
    var seB1 = sol ? Math.sqrt(Math.max(1e-12, sol.inv[1][1])) : NaN;
    var waldZ = (sol && seB1 > 1e-9) ? (st.b1 / seB1) : NaN;
    var waldP = normalPValue(waldZ);
    var oddsRatio = Math.exp(Math.max(-20, Math.min(20, st.b1)));
    return { comp: comp, n: n, pBar: pBar, meanLL: modelNLL / n, modelNLL: modelNLL, nullDev: nullDev, modelDev: modelDev, mcFadden: mcFadden, seB1: seB1, waldZ: waldZ, waldP: waldP, oddsRatio: oddsRatio, sol: sol };
  }

  function buildLogisticOutputs() {
    var st = data.logistic;
    var s = computeLogisticStats();
    var chips = renderFormulaChips([
      { key: 'logit', label: 'Raw Score = Base + Weight × Clue' },
      { key: 'prob', label: 'Squashed Chance (0% to 100%)' },
      { key: 'loss', label: 'Surprise Penalty' },
      { key: 'grad', label: 'Chance Gap (Guess − Truth)' },
      { key: 'hess', label: 'Confidence Brake' }
    ]);
    var stats = renderStatGrid([
      { label: 'Odds Multiplier per Clue', val: fmt(s.oddsRatio, 3) + '×', sub: 'Each +1 clue multiplies odds' },
      { label: 'Average Surprise Penalty', val: fmt(s.meanLL, 4), sub: 'Total Penalty = ' + fmt(s.modelNLL, 3) },
      { label: 'Model vs Baseline Penalty', val: fmt(s.modelDev, 2) + ' / ' + fmt(s.nullDev, 2), sub: 'Blind guess chance = ' + (s.pBar * 100).toFixed(0) + '%' },
      { label: 'Penalty Reduction %', val: (s.mcFadden * 100).toFixed(1) + '%', sub: '1 − (Model ÷ Baseline Penalty)', color: s.mcFadden > 0.2 ? '#34d399' : '#fbbf24' },
      { label: 'Weight Signal-to-Noise', val: fmt(s.waldZ, 2), sub: 'Wiggle Margin = ' + fmt(s.seB1, 3) },
      { label: 'Chance of Pure Luck', val: fmtP(s.waldP), sub: s.waldP < 0.05 ? 'Real Signal ✅' : 'Click Smart Jump above!', color: s.waldP < 0.05 ? '#34d399' : '#fbbf24' }
    ]);
    var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
      '<th>Row</th><th>Clue</th><th>Truth</th><th data-col="logit">Raw Score</th><th data-col="prob">Squashed Chance</th><th data-col="loss">Surprise Penalty</th><th data-col="grad">Chance Gap</th><th data-col="hess">Safety Brake</th>' +
      '</tr></thead><tbody>' +
      s.comp.map(function (c) {
        return '<tr><td class="text-sky-300 font-bold">#' + c.idx + '</td><td>' + c.x + '</td><td>' + c.y + '</td>' +
          '<td data-col="logit">' + fmtSigned(c.z, 2) + '</td>' +
          '<td data-col="prob" class="text-emerald-300">' + (c.p * 100).toFixed(1) + '%</td>' +
          '<td data-col="loss" class="text-rose-300">' + fmt(c.ll, 3) + '</td>' +
          '<td data-col="grad" class="text-amber-300">' + fmtSigned(c.g, 3) + '</td>' +
          '<td data-col="hess">' + fmt(c.h, 3) + '</td></tr>';
      }).join('') +
      '</tbody></table></div></div>';

    var steps = [
      { title: 'Raw Score → Odds Multiplier → 0%–100% Chance', hl: ['logit', 'prob'], body: 'For each row compute <code>Raw Score = ' + fmt(st.b0, 2) + ' + ' + fmt(st.b1, 2) + ' × Clue</code>, then squash it smoothly between 0% and 100%. Each extra +1 clue multiplies the Yes-vs-No odds by <code><strong>' + fmt(s.oddsRatio, 3) + '×</strong></code>!' },
      { title: 'Add Up Surprise Penalties Across All Rows', hl: ['loss'], body: 'Sum per-row mistake penalties: <code>Total Surprise Penalty = ' + s.comp.map(function (c) { return fmt(c.ll, 3); }).join(' + ') + ' = <strong>' + fmt(s.modelNLL, 3) + '</strong></code> → Average Penalty = <code><strong>' + fmt(s.meanLL, 4) + '</strong></code>.' },
      { title: 'Compare Model Penalty vs. Blind-Guess Baseline Penalty', hl: ['loss'], body: 'A blind model guessing the same baseline chance (<code>' + (s.pBar * 100).toFixed(0) + '%</code>) for everyone gets Baseline Penalty = <code><strong>' + fmt(s.nullDev, 3) + '</strong></code>.<br>Your model gets Model Penalty = <code><strong>' + fmt(s.modelDev, 3) + '</strong></code> → Penalty Reduction = <code>1 − (' + fmt(s.modelDev, 2) + ' ÷ ' + fmt(s.nullDev, 2) + ') = <strong>' + (s.mcFadden * 100).toFixed(1) + '%</strong></code>.' },
      { title: 'Check Weight Wiggle Margin & Chance of Pure Luck', hl: ['grad', 'hess'], body: 'Using the row Safety Brakes, the Clue Weight Wiggle Margin is <code><strong>' + fmt(s.seB1, 3) + '</strong></code>.<br>Signal-to-Noise Score = <code>' + fmt(st.b1, 3) + ' ÷ ' + fmt(s.seB1, 3) + ' = <strong>' + fmt(s.waldZ, 2) + '</strong></code> → Chance of Pure Luck = <code><strong>' + fmtP(s.waldP) + '</strong></code>.' }
    ];

    var py = 'import numpy as np\nfrom sklearn.metrics import log_loss\nclue = np.array([' + st.rows.map(function (r) { return r.x; }).join(', ') + '])\ntruth = np.array([' + st.rows.map(function (r) { return r.y; }).join(', ') + '])\nraw_score = ' + fmt(st.b0, 4) + ' + ' + fmt(st.b1, 4) + ' * clue\nchance = 1 / (1 + np.exp(-raw_score))\nmodel_pen = 2 * len(truth) * log_loss(truth, chance)\nbase_pen = 2 * len(truth) * log_loss(truth, np.full_like(chance, truth.mean()))\nprint("Avg Penalty:", round(model_pen/(2*len(truth)), 4), "Penalty Reduced:", round((1 - model_pen/base_pen)*100, 1), "%")';
    return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
  }

  // ============================================================================
  // CALCULATOR 4: KNN DISTANCES & NAIVE BAYES POSTERIOR
  // ============================================================================
  function buildKnnNbInputs() {
    var sub = ui.subMode.knn_nb;
    var head = '<div class="flex flex-wrap gap-1.5 mb-2.5">' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'knn' ? 'is-active' : '') + '" data-v82-sub="knn_nb:knn">📍 Nearest Neighbor Distances &amp; Scaling</button>' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'nb' ? 'is-active' : '') + '" data-v82-sub="knn_nb:nb">🎲 Clue Counts &amp; Combined Odds</button>' +
    '</div>';

    if (sub === 'knn') {
      var st = data.knn;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">' +
          '<div><label class="block text-[10px] text-slate-400">New Link Dots</label><input type="number" step="0.5" class="v82-num-input w-full" data-v82-edit="knn.q1" value="' + st.q1 + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">New Link Randomness</label><input type="number" step="0.1" class="v82-num-input w-full" data-v82-edit="knn.q2" value="' + st.q2 + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Neighbors Checked</label><select class="v82-num-input w-full" data-v82-edit="knn.k"><option value="1" ' + (st.k === 1 ? 'selected' : '') + '>1 Neighbor</option><option value="3" ' + (st.k === 3 ? 'selected' : '') + '>3 Neighbors</option><option value="5" ' + (st.k === 5 ? 'selected' : '') + '>5 Neighbors</option></select></div>' +
          '<div class="flex items-end"><button type="button" class="v82-btn-sm w-full ' + (st.scaleZ ? 'is-active' : '') + '" data-v82-action="knn:toggleZ">' + (st.scaleZ ? '✅ Fair Spread Scaling On' : 'Raw Units (Unscaled)') + '</button></div>' +
        '</div>' +
        '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Link</th><th>Dots Count</th><th>Randomness</th><th>Class</th></tr></thead><tbody>' +
          st.rows.map(function (r, idx) {
            return '<tr><td class="text-sky-300">' + esc(r.name) + '</td>' +
              '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="knn.rows.' + idx + '.x1" value="' + r.x1 + '"></td>' +
              '<td><input type="number" step="0.1" class="v82-num-input" data-v82-edit="knn.rows.' + idx + '.x2" value="' + r.x2 + '"></td>' +
              '<td><select class="v82-num-input" data-v82-edit="knn.rows.' + idx + '.y"><option value="1" ' + (r.y === 1 ? 'selected' : '') + '>1 (Phish)</option><option value="0" ' + (r.y === 0 ? 'selected' : '') + '>0 (Safe)</option></select></td></tr>';
          }).join('') +
        '</tbody></table></div></div>';
    } else {
      var nb = data.nb;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">' +
          '<div><label class="block text-[10px] text-slate-400">Total Phish Links</label><input type="number" min="1" class="v82-num-input w-full" data-v82-edit="nb.nPhish" value="' + nb.nPhish + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Total Safe Links</label><input type="number" min="1" class="v82-num-input w-full" data-v82-edit="nb.nSafe" value="' + nb.nSafe + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Zero-Proof Safety Pad</label><input type="number" step="0.5" min="0" class="v82-num-input w-full" data-v82-edit="nb.alpha" value="' + nb.alpha + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">\'verify\' in Phish</label><input type="number" min="0" class="v82-num-input w-full" data-v82-edit="nb.c1Phish" value="' + nb.c1Phish + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">\'verify\' in Safe</label><input type="number" min="0" class="v82-num-input w-full" data-v82-edit="nb.c1Safe" value="' + nb.c1Safe + '"></div>' +
          '<div class="flex items-end"><button type="button" class="v82-btn-sm w-full ' + (nb.hasC1 ? 'is-active' : '') + '" data-v82-action="nb:tog1">' + (nb.hasC1 ? '✅ URL has "verify"' : '❌ No "verify"') + '</button></div>' +
          '<div><label class="block text-[10px] text-slate-400">\'.tk\' in Phish</label><input type="number" min="0" class="v82-num-input w-full" data-v82-edit="nb.c2Phish" value="' + nb.c2Phish + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">\'.tk\' in Safe</label><input type="number" min="0" class="v82-num-input w-full" data-v82-edit="nb.c2Safe" value="' + nb.c2Safe + '"></div>' +
          '<div class="flex items-end"><button type="button" class="v82-btn-sm w-full ' + (nb.hasC2 ? 'is-active' : '') + '" data-v82-action="nb:tog2">' + (nb.hasC2 ? '✅ URL has ".tk"' : '❌ No ".tk"') + '</button></div>' +
        '</div></div>';
    }
  }

  function buildKnnNbOutputs() {
    if (ui.subMode.knn_nb === 'knn') {
      var st = data.knn;
      var n = st.rows.length;
      var m1 = 0, m2 = 0;
      st.rows.forEach(function (r) { m1 += r.x1; m2 += r.x2; });
      m1 /= n; m2 /= n;
      var v1 = 0, v2 = 0;
      st.rows.forEach(function (r) { v1 += Math.pow(r.x1 - m1, 2); v2 += Math.pow(r.x2 - m2, 2); });
      var sd1 = Math.sqrt(v1 / n) || 1;
      var sd2 = Math.sqrt(v2 / n) || 1;

      var calc = st.rows.map(function (r, idx) {
        var ux = st.scaleZ ? (r.x1 - m1) / sd1 : r.x1;
        var uy = st.scaleZ ? (r.x2 - m2) / sd2 : r.x2;
        var uq1 = st.scaleZ ? (st.q1 - m1) / sd1 : st.q1;
        var uq2 = st.scaleZ ? (st.q2 - m2) / sd2 : st.q2;
        var dx = ux - uq1, dy = uy - uq2;
        var d2 = Math.sqrt(dx * dx + dy * dy);
        var d1 = Math.abs(dx) + Math.abs(dy);
        return { idx: idx, name: r.name, y: r.y, ux: ux, uy: uy, dx: dx, dy: dy, d2: d2, d1: d1 };
      }).sort(function (a, b) { return a.d2 - b.d2; });

      var topK = calc.slice(0, st.k);
      var phishVotes = 0, wSum = 0, wPhish = 0;
      topK.forEach(function (c) {
        if (c.y === 1) phishVotes++;
        var w = 1 / (c.d2 + 0.05);
        wSum += w;
        if (c.y === 1) wPhish += w;
      });
      var pUnw = phishVotes / st.k;
      var pWtd = wSum > 0 ? wPhish / wSum : 0;

      var chips = renderFormulaChips([
        { key: 'scaled', label: st.scaleZ ? 'Scaled Units (Centered by Spread)' : 'Raw Units (Dots, Randomness)' },
        { key: 'd2', label: 'Straight-Line Distance' },
        { key: 'd1', label: 'City-Block Distance' },
        { key: 'vote', label: 'Closest Neighbors Vote' }
      ]);
      var stats = renderStatGrid([
        { label: 'Majority Vote (' + st.k + ' closest)', val: pUnw >= 0.5 ? '🚨 PHISH' : '✅ SAFE', sub: phishVotes + ' of ' + st.k + ' Phish (' + (pUnw * 100).toFixed(1) + '%)' },
        { label: 'Closer-Gets-More-Say Chance', val: (pWtd * 100).toFixed(1) + '%', sub: 'Closer neighbors get louder vote' },
        { label: 'Spread Ratio (Dots vs Rand)', val: fmt(sd1 / sd2, 2) + '×', sub: 'Dots Spread=' + fmt(sd1, 2) + ', Rand=' + fmt(sd2, 2) },
        { label: 'Closest Neighbor', val: calc[0].name, sub: 'Distance = ' + fmt(calc[0].d2, 3) }
      ]);
      var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>Rank</th><th>Link</th><th>Class</th><th data-col="scaled">Numbers Used</th><th data-col="d2">Straight-Line Dist</th><th data-col="d1">City-Block Dist</th><th data-col="vote">Votes?</th>' +
        '</tr></thead><tbody>' +
        calc.map(function (c, rank) {
          var inK = rank < st.k;
          return '<tr class="' + (inK ? 'bg-emerald-950/20' : '') + '">' +
            '<td class="font-bold">#' + (rank + 1) + '</td><td>' + esc(c.name) + '</td>' +
            '<td>' + (c.y === 1 ? '🚨 Phish' : '✅ Safe') + '</td>' +
            '<td data-col="scaled">(' + fmt(c.ux, 2) + ', ' + fmt(c.uy, 2) + ')</td>' +
            '<td data-col="d2" class="text-sky-300 font-bold">' + fmt(c.d2, 3) + '</td>' +
            '<td data-col="d1">' + fmt(c.d1, 3) + '</td>' +
            '<td data-col="vote">' + (inK ? '✅ Vote' : '—') + '</td></tr>';
        }).join('') +
      '</tbody></table></div></div>';

      var steps = [
        { title: 'Check Feature Spread & Put Both Clues on Equal Footing', hl: ['scaled'], body: 'Column Averages: Dots = <code>' + fmt(m1, 2) + '</code>, Randomness = <code>' + fmt(m2, 2) + '</code>; Typical Spreads: Dots = <code>' + fmt(sd1, 2) + '</code>, Randomness = <code>' + fmt(sd2, 2) + '</code>. ' + (st.scaleZ ? 'Scaling by spread puts both clues on equal footing!' : 'In raw units, whichever column has bigger numbers dominates the distance — click "Raw Units" above to toggle Fair Scaling!') },
        { title: 'Measure Straight-Line & City-Block Distances to New Link', hl: ['d2', 'd1'], body: 'Closest neighbor <code>' + esc(calc[0].name) + '</code>: Straight-Line Distance = <code>√((' + fmt(calc[0].dx, 2) + ')² + (' + fmt(calc[0].dy, 2) + ')²) = <strong>' + fmt(calc[0].d2, 3) + '</strong></code>; City-Block Distance = <code><strong>' + fmt(calc[0].d1, 3) + '</strong></code>.' },
        { title: 'Sort & Count Majority + Distance-Weighted Votes', hl: ['vote'], body: 'Top ' + st.k + ' closest neighbors include <code>' + phishVotes + '</code> Phishing links → Equal-Vote Chance = <code>' + phishVotes + '/' + st.k + ' = <strong>' + (pUnw * 100).toFixed(1) + '%</strong></code>; Closer-Weighted Chance = <code><strong>' + (pWtd * 100).toFixed(1) + '%</strong></code>.' }
      ];
      var py = 'import numpy as np\nfrom sklearn.neighbors import KNeighborsClassifier\nclues = np.array([' + st.rows.map(function (r) { return '[' + r.x1 + ',' + r.x2 + ']'; }).join(', ') + '])\nlabels = np.array([' + st.rows.map(function (r) { return r.y; }).join(', ') + '])\nmodel = KNeighborsClassifier(n_neighbors=' + st.k + ').fit(clues, labels)\nprint("Pred chance:", model.predict_proba([[' + st.q1 + ', ' + st.q2 + ']]))';
      return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    } else {
      var nb = data.nb;
      var tot = Math.max(1, nb.nPhish + nb.nSafe);
      var priP = nb.nPhish / tot;
      var priS = nb.nSafe / tot;
      var p1P = (nb.c1Phish + nb.alpha) / (nb.nPhish + 2 * nb.alpha);
      var p1S = (nb.c1Safe + nb.alpha) / (nb.nSafe + 2 * nb.alpha);
      var p2P = (nb.c2Phish + nb.alpha) / (nb.nPhish + 2 * nb.alpha);
      var p2S = (nb.c2Safe + nb.alpha) / (nb.nSafe + 2 * nb.alpha);

      var l1P = nb.hasC1 ? p1P : (1 - p1P);
      var l1S = nb.hasC1 ? p1S : (1 - p1S);
      var l2P = nb.hasC2 ? p2P : (1 - p2P);
      var l2S = nb.hasC2 ? p2S : (1 - p2S);

      var jointP = priP * l1P * l2P;
      var jointS = priS * l1S * l2S;
      var postP = (jointP + jointS) > 0 ? jointP / (jointP + jointS) : 0.5;
      var logP = Math.log(Math.max(1e-12, priP)) + Math.log(Math.max(1e-12, l1P)) + Math.log(Math.max(1e-12, l2P));
      var logS = Math.log(Math.max(1e-12, priS)) + Math.log(Math.max(1e-12, l1S)) + Math.log(Math.max(1e-12, l2S));

      var chips = renderFormulaChips([
        { key: 'prior', label: 'Starting Group Share' },
        { key: 'like', label: 'Padded Clue Rate' },
        { key: 'joint', label: 'Multiply All Clue Rates' },
        { key: 'post', label: 'Final Phishing Chance' }
      ]);
      var stats = renderStatGrid([
        { label: 'Starting Phish Share', val: (priP * 100).toFixed(1) + '%', sub: nb.nPhish + ' of ' + tot + ' past links' },
        { label: 'Combined Phish Score', val: jointP.toFixed(5), sub: 'Log score = ' + fmt(logP, 2) },
        { label: 'Combined Safe Score', val: jointS.toFixed(5), sub: 'Log score = ' + fmt(logS, 2) },
        { label: 'Final Phishing Chance', val: (postP * 100).toFixed(2) + '%', sub: postP >= 0.5 ? '🚨 PHISH' : '✅ SAFE', color: postP >= 0.5 ? '#fb7185' : '#34d399' }
      ]);
      var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>Clue Step</th><th data-col="like">Phish Rate</th><th data-col="like">Safe Rate</th><th data-col="joint">Phish vs Safe Multiplier</th>' +
        '</tr></thead><tbody>' +
        '<tr><td data-col="prior">Starting Baseline Share</td><td>' + fmt(priP, 4) + '</td><td>' + fmt(priS, 4) + '</td><td>' + fmt(priP / Math.max(1e-6, priS), 2) + '×</td></tr>' +
        '<tr><td data-col="like">Clue 1 ("verify"=' + (nb.hasC1 ? 'Present' : 'Absent') + ')</td><td class="text-rose-300">' + fmt(l1P, 4) + '</td><td class="text-emerald-300">' + fmt(l1S, 4) + '</td><td>' + fmt(l1P / Math.max(1e-6, l1S), 2) + '×</td></tr>' +
        '<tr><td data-col="like">Clue 2 (".tk"=' + (nb.hasC2 ? 'Present' : 'Absent') + ')</td><td class="text-rose-300">' + fmt(l2P, 4) + '</td><td class="text-emerald-300">' + fmt(l2S, 4) + '</td><td>' + fmt(l2P / Math.max(1e-6, l2S), 2) + '×</td></tr>' +
        '<tr class="font-bold"><td data-col="joint">Combined Score (Base × Clues)</td><td>' + jointP.toFixed(5) + '</td><td>' + jointS.toFixed(5) + '</td><td data-col="post" class="text-amber-300">Chance=' + (postP * 100).toFixed(2) + '%</td></tr>' +
      '</tbody></table></div></div>';

      var steps = [
        { title: 'Find Starting Phish vs Safe Share in Past Logbook', hl: ['prior'], body: '<code>Starting Phish Share = ' + nb.nPhish + ' ÷ ' + tot + ' = <strong>' + fmt(priP, 4) + '</strong></code>; <code>Starting Safe Share = ' + nb.nSafe + ' ÷ ' + tot + ' = <strong>' + fmt(priS, 4) + '</strong></code>.' },
        { title: 'Add Zero-Proof Safety Padding (' + nb.alpha + ') So One Zero Never Wipes Out All Clues', hl: ['like'], body: 'For Clue 1: <code>Phish Rate = (' + nb.c1Phish + ' + ' + nb.alpha + ') ÷ (' + nb.nPhish + ' + ' + (2 * nb.alpha) + ') = <strong>' + fmt(p1P, 4) + '</strong></code>; <code>Safe Rate = <strong>' + fmt(p1S, 4) + '</strong></code>.' },
        { title: 'Multiply Baseline by Each Clue Rate & Scale to 100%', hl: ['joint', 'post'], body: '<code>Phish Score = ' + fmt(priP, 3) + ' × ' + fmt(l1P, 4) + ' × ' + fmt(l2P, 4) + ' = <strong>' + jointP.toFixed(5) + '</strong></code>.<br>Scale to 100%: <code>Final Chance = ' + jointP.toFixed(5) + ' ÷ (' + jointP.toFixed(5) + ' + ' + jointS.toFixed(5) + ') = <strong>' + (postP * 100).toFixed(2) + '%</strong></code>!' }
      ];
      var py = 'base_phish, base_safe = ' + fmt(priP, 4) + ', ' + fmt(priS, 4) + '\nrate_phish = [' + fmt(l1P, 4) + ', ' + fmt(l2P, 4) + ']\nrate_safe = [' + fmt(l1S, 4) + ', ' + fmt(l2S, 4) + ']\nimport math\nscore_phish = base_phish * math.prod(rate_phish); score_safe = base_safe * math.prod(rate_safe)\nprint("Final Phish Chance:", round(score_phish / (score_phish + score_safe), 4))';
      return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    }
  }

  // ============================================================================
  // CALCULATOR 5: SVM MARGIN STREET, SUPPORT VECTORS & HINGE LOSS
  // ============================================================================
  function buildSvmInputs() {
    var st = data.svm;
    return '<div class="v82-card v82-card-sky space-y-2.5">' +
      '<div class="flex flex-wrap gap-1.5">' +
        '<button type="button" class="v82-btn-sm" data-v82-preset="svm:default">Clean Street</button>' +
        '<button type="button" class="v82-btn-sm" data-v82-preset="svm:violator">With Rule Breaker</button>' +
      '</div>' +
      '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">' +
        '<div><label class="block text-[10px] text-slate-400">Weight 1</label><input type="number" step="0.1" class="v82-num-input w-full" data-v82-edit="svm.w1" value="' + st.w1 + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Weight 2</label><input type="number" step="0.1" class="v82-num-input w-full" data-v82-edit="svm.w2" value="' + st.w2 + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Offset</label><input type="number" step="0.2" class="v82-num-input w-full" data-v82-edit="svm.b" value="' + st.b + '"></div>' +
        '<div><label class="block text-[10px] text-slate-400">Mistake Strictness</label><input type="number" step="0.5" min="0.01" class="v82-num-input w-full" data-v82-edit="svm.C" value="' + st.C + '"></div>' +
      '</div>' +
      '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Pt</th><th>Clue 1</th><th>Clue 2</th><th>Group (−1 Safe or +1 Phish)</th></tr></thead><tbody>' +
        st.rows.map(function (r, idx) {
          return '<tr><td class="text-sky-300 font-bold">P' + (idx + 1) + '</td>' +
            '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="svm.rows.' + idx + '.x1" value="' + r.x1 + '"></td>' +
            '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="svm.rows.' + idx + '.x2" value="' + r.x2 + '"></td>' +
            '<td><select class="v82-num-input" data-v82-edit="svm.rows.' + idx + '.y"><option value="-1" ' + (r.y === -1 ? 'selected' : '') + '>−1 (Safe)</option><option value="1" ' + (r.y === 1 ? 'selected' : '') + '>+1 (Phish)</option></select></td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
  }

  function buildSvmOutputs() {
    var st = data.svm;
    var normW = Math.sqrt(st.w1 * st.w1 + st.w2 * st.w2) || 1e-6;
    var halfMargin = 1 / normW;
    var fullStreet = 2 / normW;
    var sumSlack = 0, svCount = 0;
    var comp = st.rows.map(function (r, idx) {
      var raw = st.w1 * r.x1 + st.w2 * r.x2 + st.b;
      var funcM = r.y * raw;
      var xi = Math.max(0, 1 - funcM);
      sumSlack += xi;
      var status = funcM < 0.99 ? '🚨 Violates Curb' : (funcM <= 1.15 ? '⭐ Edge Guard Point' : '✅ Safely Outside Curb');
      if (funcM <= 1.15) svCount++;
      return { idx: idx + 1, x1: r.x1, x2: r.x2, y: r.y, raw: raw, funcM: funcM, xi: xi, status: status };
    });
    var regTerm = 0.5 * normW * normW;
    var obj = regTerm + st.C * sumSlack;

    var chips = renderFormulaChips([
      { key: 'norm', label: 'Combined Weight Size' },
      { key: 'func', label: 'Safety Cushion Score' },
      { key: 'slack', label: 'Curb Violation Penalty' },
      { key: 'obj', label: 'Total Score to Shrink' }
    ]);
    var stats = renderStatGrid([
      { label: 'Combined Weight Size', val: fmt(normW, 3), sub: 'Half-squared = ' + fmt(regTerm, 3) },
      { label: 'Safety Street Width', val: fmt(fullStreet, 3), sub: 'Half-Street = ' + fmt(halfMargin, 3), color: '#38bdf8' },
      { label: 'Total Curb Violations', val: fmt(sumSlack, 3), sub: 'Strictness Penalty = ' + fmt(st.C * sumSlack, 3), color: sumSlack > 0 ? '#fbbf24' : '#34d399' },
      { label: 'Total Score to Shrink', val: fmt(obj, 3), sub: svCount + ' active edge/curb pts' }
    ]);
    var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
      '<th>Pt</th><th>Group</th><th>Raw Line Score</th><th data-col="func">Safety Cushion</th><th data-col="slack">Curb Violation</th><th>Role</th>' +
      '</tr></thead><tbody>' +
      comp.map(function (c) {
        return '<tr><td class="text-sky-300 font-bold">P' + c.idx + '</td><td>' + (c.y > 0 ? '+1' : '−1') + '</td>' +
          '<td>' + fmtSigned(c.raw, 2) + '</td>' +
          '<td data-col="func" class="text-amber-300">' + fmtSigned(c.funcM, 2) + '</td>' +
          '<td data-col="slack" class="' + (c.xi > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400') + '">' + fmt(c.xi, 3) + '</td>' +
          '<td>' + c.status + '</td></tr>';
      }).join('') +
      '</tbody></table></div></div>';

    var steps = [
      { title: 'Weight Size & Safety Street Width', hl: ['norm'], body: '<code>Combined Weight Size = √((' + st.w1 + ')² + (' + st.w2 + ')²) = <strong>' + fmt(normW, 3) + '</strong></code>.<br>Full Safety Street Width = <code>2 ÷ ' + fmt(normW, 3) + ' = <strong>' + fmt(fullStreet, 3) + ' units</strong></code>.' },
      { title: 'Safety Cushion per Point (Correct Side × Raw Score)', hl: ['func'], body: 'Safe outside points have <code>Cushion &gt; 1</code>. Points sitting right on the dashed curbs have <code>Cushion = 1</code> (these edge points hold up the street!).' },
      { title: 'Curb Violations & Total Score to Shrink', hl: ['slack', 'obj'], body: '<code>Total Violation = ' + comp.map(function (c) { return fmt(c.xi, 2); }).join(' + ') + ' = <strong>' + fmt(sumSlack, 3) + '</strong></code>.<br>Total Score: <code>½(' + fmt(normW * normW, 3) + ') + ' + st.C + ' × (' + fmt(sumSlack, 3) + ') = <strong>' + fmt(obj, 3) + '</strong></code>.' }
    ];
    var py = 'import numpy as np\nweights = np.array([' + st.w1 + ', ' + st.w2 + ']); offset = ' + st.b + '; strictness = ' + st.C + '\nclues = np.array([' + st.rows.map(function (r) { return '[' + r.x1 + ',' + r.x2 + ']'; }).join(', ') + '])\ngroup = np.array([' + st.rows.map(function (r) { return r.y; }).join(', ') + '])\ncushion = group * (clues @ weights + offset)\nviolations = np.maximum(0, 1 - cushion)\nprint("Street width:", round(2/np.linalg.norm(weights), 3), "Total score:", round(0.5*np.dot(weights,weights) + strictness*violations.sum(), 3))';
    return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
  }

  // ============================================================================
  // CALCULATOR 6: DECISION TREE CART (GINI, ENTROPY & INFORMATION GAIN)
  // ============================================================================
  function giniFromCounts(c0, c1) {
    var tot = c0 + c1;
    if (tot === 0) return 0;
    var p0 = c0 / tot, p1 = c1 / tot;
    return 1 - (p0 * p0 + p1 * p1);
  }

  function entropyFromCounts(c0, c1) {
    var tot = c0 + c1;
    if (tot === 0) return 0;
    var p0 = c0 / tot, p1 = c1 / tot;
    var h = 0;
    if (p0 > 0) h -= p0 * Math.log(p0) / Math.LN2;
    if (p1 > 0) h -= p1 * Math.log(p1) / Math.LN2;
    return h;
  }

  function buildCartInputs() {
    var st = data.cart;
    return '<div class="v82-card v82-card-sky space-y-2.5">' +
      '<div class="flex flex-wrap items-center justify-between gap-2">' +
        '<div class="text-xs font-bold text-slate-200">Split Rule: <code>Randomness ≤ Cutoff</code> → Left Group | <code>&gt; Cutoff</code> → Right Group</div>' +
        '<div class="flex gap-1.5">' +
          '<button type="button" class="v82-btn-sm is-active" data-v82-action="cart:best">🏆 Snap to Purest Cutoff</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="cart:default">↺ Reset</button>' +
        '</div>' +
      '</div>' +
      '<div class="flex items-center gap-3 text-xs">' +
        '<label class="font-bold text-amber-300 whitespace-nowrap">Split Cutoff = <span id="v82-cart-theta-lbl">' + fmt(st.theta, 2) + '</span></label>' +
        '<input type="range" min="2.0" max="5.0" step="0.05" value="' + st.theta + '" class="flex-1 accent-amber-400" data-v82-edit="cart.theta">' +
      '</div>' +
      '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Link</th><th>Randomness Score</th><th>Group</th></tr></thead><tbody>' +
        st.rows.map(function (r, idx) {
          return '<tr><td class="text-sky-300">' + esc(r.name) + '</td>' +
            '<td><input type="number" step="0.05" class="v82-num-input" data-v82-edit="cart.rows.' + idx + '.x" value="' + r.x + '"></td>' +
            '<td><select class="v82-num-input" data-v82-edit="cart.rows.' + idx + '.y"><option value="0" ' + (r.y === 0 ? 'selected' : '') + '>0 (Safe)</option><option value="1" ' + (r.y === 1 ? 'selected' : '') + '>1 (Phish)</option></select></td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
  }

  function findBestCartSplit() {
    var xs = data.cart.rows.map(function (r) { return r.x; }).sort(function (a, b) { return a - b; });
    var bestTh = data.cart.theta, bestGain = -1;
    var p0 = 0, p1 = 0;
    data.cart.rows.forEach(function (r) { if (r.y === 0) p0++; else p1++; });
    var parentG = giniFromCounts(p0, p1);
    var n = data.cart.rows.length;
    for (var i = 0; i < xs.length - 1; i++) {
      var cand = (xs[i] + xs[i + 1]) / 2;
      var l0 = 0, l1 = 0, r0 = 0, r1 = 0;
      data.cart.rows.forEach(function (r) {
        if (r.x <= cand) { if (r.y === 0) l0++; else l1++; }
        else { if (r.y === 0) r0++; else r1++; }
      });
      var wg = ((l0 + l1) / n) * giniFromCounts(l0, l1) + ((r0 + r1) / n) * giniFromCounts(r0, r1);
      var gain = parentG - wg;
      if (gain > bestGain) { bestGain = gain; bestTh = cand; }
    }
    return { theta: Number(bestTh.toFixed(2)), gain: bestGain };
  }

  function buildCartOutputs() {
    var st = data.cart;
    var lbl = document.getElementById('v82-cart-theta-lbl');
    if (lbl) lbl.textContent = fmt(st.theta, 2);

    var n = st.rows.length;
    var p0 = 0, p1 = 0, l0 = 0, l1 = 0, r0 = 0, r1 = 0;
    st.rows.forEach(function (r) {
      if (r.y === 0) p0++; else p1++;
      if (r.x <= st.theta) { if (r.y === 0) l0++; else l1++; }
      else { if (r.y === 0) r0++; else r1++; }
    });
    var nL = l0 + l1, nR = r0 + r1;
    var gP = giniFromCounts(p0, p1), gL = giniFromCounts(l0, l1), gR = giniFromCounts(r0, r1);
    var gW = (nL / n) * gL + (nR / n) * gR;
    var gGain = gP - gW;

    var hP = entropyFromCounts(p0, p1), hL = entropyFromCounts(l0, l1), hR = entropyFromCounts(r0, r1);
    var hW = (nL / n) * hL + (nR / n) * hR;
    var ig = hP - hW;
    var best = findBestCartSplit();

    var chips = renderFormulaChips([
      { key: 'left', label: 'Left Group (≤ Cutoff)' },
      { key: 'right', label: 'Right Group (> Cutoff)' },
      { key: 'gini', label: 'Mix-Up Score' },
      { key: 'gain', label: 'Purity Gain' }
    ]);
    var stats = renderStatGrid([
      { label: 'Parent Mix-Up / Disorder', val: fmt(gP, 3) + ' / ' + fmt(hP, 3), sub: p0 + ' Safe, ' + p1 + ' Phish' },
      { label: 'Combined Group Mix-Up', val: fmt(gW, 3), sub: 'Left=' + fmt(gL, 3) + ' (' + nL + '), Right=' + fmt(gR, 3) + ' (' + nR + ')' },
      { label: 'Mix-Up Drop (Gain)', val: fmtSigned(gGain, 3), sub: 'Best cutoff ≈ ' + fmt(best.theta, 2), color: gGain >= best.gain - 1e-4 ? '#34d399' : '#fbbf24' },
      { label: 'Disorder Drop (Info Gain)', val: fmtSigned(ig, 3), sub: 'Combined Disorder = ' + fmt(hW, 3) }
    ]);

    var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
      '<th>Bucket</th><th>Counts (Safe, Phish)</th><th>Links Count</th><th data-col="gini">Mix-Up Score</th><th>Disorder Bits</th><th data-col="gain">Share of Links</th>' +
      '</tr></thead><tbody>' +
      '<tr><td class="font-bold">Starting Bucket</td><td>(' + p0 + ', ' + p1 + ')</td><td>' + n + '</td><td data-col="gini">' + fmt(gP, 4) + '</td><td>' + fmt(hP, 4) + '</td><td data-col="gain">1.000</td></tr>' +
      '<tr><td data-col="left" class="text-emerald-300 font-bold">Left (≤ ' + fmt(st.theta, 2) + ')</td><td data-col="left">(' + l0 + ', ' + l1 + ')</td><td data-col="left">' + nL + '</td><td data-col="gini">' + fmt(gL, 4) + '</td><td>' + fmt(hL, 4) + '</td><td data-col="gain">' + nL + '/' + n + ' = ' + fmt(nL / n, 3) + '</td></tr>' +
      '<tr><td data-col="right" class="text-rose-300 font-bold">Right (&gt; ' + fmt(st.theta, 2) + ')</td><td data-col="right">(' + r0 + ', ' + r1 + ')</td><td data-col="right">' + nR + '</td><td data-col="gini">' + fmt(gR, 4) + '</td><td>' + fmt(hR, 4) + '</td><td data-col="gain">' + nR + '/' + n + ' = ' + fmt(nR / n, 3) + '</td></tr>' +
    '</tbody></table></div></div>';

    var steps = [
      { title: 'Measure Starting Bucket Mix-Up Before Any Split', hl: ['gini'], body: 'Shares: <code>Safe = ' + p0 + '/' + n + ' = ' + fmt(p0 / n, 3) + '</code>, <code>Phish = ' + p1 + '/' + n + ' = ' + fmt(p1 / n, 3) + '</code>.<br>Starting Mix-Up Score = <code>1 − (' + fmt(p0 / n, 3) + '² + ' + fmt(p1 / n, 3) + '²) = <strong>' + fmt(gP, 4) + '</strong></code>; Disorder = <code><strong>' + fmt(hP, 4) + ' bits</strong></code>.' },
      { title: 'Sort Links Into Left (≤ ' + fmt(st.theta, 2) + ') & Right (> ' + fmt(st.theta, 2) + ')', hl: ['left', 'right', 'gini'], body: 'Left bucket gets <code>' + nL + '</code> links (<code>' + l0 + ' Safe, ' + l1 + ' Phish</code>) → Left Mix-Up = <code><strong>' + fmt(gL, 4) + '</strong></code>.<br>Right bucket gets <code>' + nR + '</code> links (<code>' + r0 + ' Safe, ' + r1 + ' Phish</code>) → Right Mix-Up = <code><strong>' + fmt(gR, 4) + '</strong></code>.' },
      { title: 'Weight Both Buckets by Size & Find Purity Gain', hl: ['gain'], body: '<code>Combined Mix-Up = (' + nL + '/' + n + ')(' + fmt(gL, 3) + ') + (' + nR + '/' + n + ')(' + fmt(gR, 3) + ') = <strong>' + fmt(gW, 4) + '</strong></code>.<br><code>Purity Gain = ' + fmt(gP, 4) + ' − ' + fmt(gW, 4) + ' = <strong>' + fmt(gGain, 4) + '</strong></code> (Best cutoff ≈ <code>' + fmt(best.theta, 2) + '</code> gives Gain = <code>' + fmt(best.gain, 4) + '</code>!).' }
    ];
    var py = 'import numpy as np\nfrom sklearn.tree import DecisionTreeClassifier\nclues = np.array([' + st.rows.map(function (r) { return '[' + r.x + ']'; }).join(', ') + '])\nlabels = np.array([' + st.rows.map(function (r) { return r.y; }).join(', ') + '])\ntree = DecisionTreeClassifier(max_depth=1, criterion="gini").fit(clues, labels)\nprint("Best cutoff:", round(tree.tree_.threshold[0], 3), "Bucket Mix-Ups:", np.round(tree.tree_.impurity, 4))';
    return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
  }

  // ============================================================================
  // CALCULATOR 7: XGBOOST 2ND-ORDER TAYLOR STATS & RANDOM FOREST OOB/VARIANCE
  // ============================================================================
  function buildXgbRfInputs() {
    var sub = ui.subMode.xgboost_rf;
    var head = '<div class="flex flex-wrap gap-1.5 mb-2.5">' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'xgb' ? 'is-active' : '') + '" data-v82-sub="xgboost_rf:xgb">🚀 Mistake-Fixing Trees (Split Score &amp; Leaf Update)</button>' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'rf' ? 'is-active' : '') + '" data-v82-sub="xgboost_rf:rf">🌲 Voting Forest Held-Out Accuracy &amp; Spread</button>' +
    '</div>';

    if (sub === 'xgb') {
      var st = data.xgb;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="flex flex-wrap gap-1.5">' +
          '<button type="button" class="v82-btn-sm is-active" data-v82-action="xgb:step">🌲 Grow Next Tree (Update Chances)</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="xgb:default">↺ Reset to Start (50%)</button>' +
        '</div>' +
        '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">' +
          '<div><label class="block text-[10px] text-slate-400">Leaf Cushion Penalty</label><input type="number" step="0.5" min="0" class="v82-num-input w-full" data-v82-edit="xgb.lam" value="' + st.lam + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Min Split Gain Fee</label><input type="number" step="0.05" min="0" class="v82-num-input w-full" data-v82-edit="xgb.gamma" value="' + st.gamma + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Step Size (Shrinkage)</label><input type="number" step="0.05" min="0.05" max="1" class="v82-num-input w-full" data-v82-edit="xgb.eta" value="' + st.eta + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Rare-Phish Importance</label><input type="number" step="0.5" min="0.5" class="v82-num-input w-full" data-v82-edit="xgb.posW" value="' + st.posW + '"></div>' +
        '</div>' +
        '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>URL</th><th>Truth</th><th>Current Chance</th><th>Sent to Branch</th></tr></thead><tbody>' +
          st.rows.map(function (r, idx) {
            return '<tr><td class="text-sky-300">' + esc(r.name) + '</td>' +
              '<td><select class="v82-num-input" data-v82-edit="xgb.rows.' + idx + '.y"><option value="0" ' + (r.y === 0 ? 'selected' : '') + '>0 (Safe)</option><option value="1" ' + (r.y === 1 ? 'selected' : '') + '>1 (Phish)</option></select></td>' +
              '<td><input type="number" step="0.02" min="0.01" max="0.99" class="v82-num-input" data-v82-edit="xgb.rows.' + idx + '.p" value="' + fmt(r.p, 3) + '"></td>' +
              '<td><select class="v82-num-input" data-v82-edit="xgb.rows.' + idx + '.side"><option value="L" ' + (r.side === 'L' ? 'selected' : '') + '>Left Branch</option><option value="R" ' + (r.side === 'R' ? 'selected' : '') + '>Right Branch</option></select></td></tr>';
          }).join('') +
        '</tbody></table></div></div>';
    } else {
      var rf = data.rf;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="grid grid-cols-3 gap-2 text-xs">' +
          '<div><label class="block text-[10px] text-slate-400">Number of Trees</label><input type="number" min="1" max="500" step="5" class="v82-num-input w-full" data-v82-edit="rf.B" value="' + rf.B + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Tree Overlap (0 to 1)</label><input type="number" min="0" max="1" step="0.05" class="v82-num-input w-full" data-v82-edit="rf.rho" value="' + rf.rho + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">1-Tree Error Wobble</label><input type="number" min="0.1" step="0.2" class="v82-num-input w-full" data-v82-edit="rf.sigma2" value="' + rf.sigma2 + '"></div>' +
        '</div>' +
        '<div class="text-[11px] text-slate-300">Click cells below to toggle each row across 4 trees (<code>Used in Tree</code> vs <code>Held Out ✓</code> vs <code>Held Out ✗</code>):</div>' +
        '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Row</th><th>Tree 1</th><th>Tree 2</th><th>Tree 3</th><th>Tree 4</th></tr></thead><tbody>' +
          rf.oob.map(function (row, ri) {
            return '<tr><td class="text-sky-300 font-bold">Row ' + (ri + 1) + '</td>' + row.map(function (val, ci) {
              var lbl = val === 1 ? 'Used in Tree (Skip)' : (val === 0 ? 'Held Out ✓ Right' : 'Held Out ✗ Wrong');
              var cls = val === 1 ? 'text-slate-400' : (val === 0 ? 'text-emerald-300 font-bold' : 'text-rose-400 font-bold');
              return '<td><button type="button" class="v82-btn-sm ' + cls + '" data-v82-rfoob="' + ri + ':' + ci + '">' + lbl + '</button></td>';
            }).join('') + '</tr>';
          }).join('') +
        '</tbody></table></div></div>';
    }
  }

  function computeXgbStats() {
    var st = data.xgb;
    var GR = 0, HR = 0, GL = 0, HL = 0, GRi = 0, HRi = 0;
    var comp = st.rows.map(function (r, idx) {
      var w = r.y === 1 ? st.posW : 1.0;
      var g = w * (r.p - r.y);
      var h = w * r.p * (1 - r.p);
      GR += g; HR += h;
      if (r.side === 'L') { GL += g; HL += h; } else { GRi += g; HRi += h; }
      return { idx: idx + 1, name: r.name, y: r.y, p: r.p, w: w, g: g, h: h, side: r.side };
    });
    var simP = (GR * GR) / (HR + st.lam);
    var simL = (GL * GL) / (HL + st.lam);
    var simR = (GRi * GRi) / (HRi + st.lam);
    var gain = 0.5 * (simL + simR - simP) - st.gamma;
    var wL = -GL / (HL + st.lam);
    var wR = -GRi / (HRi + st.lam);
    return { comp: comp, GR: GR, HR: HR, GL: GL, HL: HL, GRi: GRi, HRi: HRi, simP: simP, simL: simL, simR: simR, gain: gain, wL: wL, wR: wR };
  }

  function buildXgbRfOutputs() {
    if (ui.subMode.xgboost_rf === 'xgb') {
      var st = data.xgb;
      var x = computeXgbStats();
      var chips = renderFormulaChips([
        { key: 'grad', label: 'Chance Gap (Guess − Truth)' },
        { key: 'hess', label: 'Safety Brake (Uncertainty)' },
        { key: 'sim', label: 'Bucket Purity Score' },
        { key: 'leaf', label: 'New Leaf Nudge' }
      ]);
      var stats = renderStatGrid([
        { label: 'Left / Right Bucket Score', val: fmt(x.simL, 3) + ' / ' + fmt(x.simR, 3), sub: 'Starting Bucket = ' + fmt(x.simP, 3) },
        { label: 'Net Split Improvement', val: fmtSigned(x.gain, 3), sub: x.gain > 0 ? 'Keep Split ✅ (> 0)' : 'Trim Split ✂️ (< 0)', color: x.gain > 0 ? '#34d399' : '#fb7185' },
        { label: 'Left Leaf Raw Adjustment', val: fmtSigned(x.wL, 3), sub: 'Gentle Nudge = ' + fmtSigned(st.eta * x.wL, 3) },
        { label: 'Right Leaf Raw Adjustment', val: fmtSigned(x.wR, 3), sub: 'Gentle Nudge = ' + fmtSigned(st.eta * x.wR, 3) }
      ]);
      var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>URL</th><th>Truth</th><th>Current</th><th data-col="grad">Mistake Gap</th><th data-col="hess">Safety Brake</th><th>Branch</th><th data-col="leaf">Updated Chance</th>' +
        '</tr></thead><tbody>' +
        x.comp.map(function (c) {
          var wLeaf = c.side === 'L' ? x.wL : x.wR;
          var pNext = sigmoid(logit(c.p) + st.eta * wLeaf);
          return '<tr><td>' + esc(c.name) + '</td><td>' + c.y + '</td><td>' + fmt(c.p, 3) + '</td>' +
            '<td data-col="grad" class="text-rose-300">' + fmtSigned(c.g, 3) + '</td>' +
            '<td data-col="hess" class="text-sky-300">' + fmt(c.h, 3) + '</td>' +
            '<td>' + (c.side === 'L' ? '⬅ Left' : '➡ Right') + '</td>' +
            '<td data-col="leaf" class="text-emerald-300 font-bold">' + (pNext * 100).toFixed(1) + '%</td></tr>';
        }).join('') +
        '<tr class="bg-slate-900/90 font-bold">' +
          '<td colspan="3">BRANCH TOTALS</td>' +
          '<td data-col="grad">Left=' + fmtSigned(x.GL, 2) + ', Right=' + fmtSigned(x.GRi, 2) + '</td>' +
          '<td data-col="hess">Left=' + fmt(x.HL, 2) + ', Right=' + fmt(x.HRi, 2) + '</td>' +
          '<td data-col="sim" colspan="2">Split Gain = <strong>' + fmtSigned(x.gain, 3) + '</strong></td>' +
        '</tr></tbody></table></div></div>';

      var steps = [
        { title: 'Find Each Row’s Mistake Gap & Safety Brake', hl: ['grad', 'hess'], body: 'A negative Mistake Gap means a Phishing link needs a higher chance. The Safety Brake is largest (<code>0.25</code>) when the model is unsure (<code>50%</code>), keeping steps gentle.' },
        { title: 'Add Up Mistakes & Brakes per Branch → Compute Bucket Scores', hl: ['sim'], body: '<code>Starting Bucket Score = (' + fmt(x.GR, 2) + ')² ÷ (' + fmt(x.HR, 2) + ' + ' + st.lam + ') = <strong>' + fmt(x.simP, 3) + '</strong></code>.<br><code>Left Bucket Score = <strong>' + fmt(x.simL, 3) + '</strong></code>; <code>Right Bucket Score = <strong>' + fmt(x.simR, 3) + '</strong></code>.' },
        { title: 'Check Whether Split Gain Beats Minimum Fee (' + st.gamma + ')', hl: ['sim'], body: '<code>Split Gain = ½(' + fmt(x.simL, 3) + ' + ' + fmt(x.simR, 3) + ' − ' + fmt(x.simP, 3) + ') − ' + st.gamma + ' = <strong>' + fmtSigned(x.gain, 3) + '</strong></code>.' },
        { title: 'Pick Optimal Leaf Nudges & Update Link Chances', hl: ['leaf'], body: '<code>Left Leaf Nudge = −(' + fmt(x.GL, 2) + ') ÷ (' + fmt(x.HL, 2) + ' + ' + st.lam + ') = <strong>' + fmtSigned(x.wL, 3) + '</strong></code>; <code>Right Leaf Nudge = <strong>' + fmtSigned(x.wR, 3) + '</strong></code>.<br>Click <strong>"Grow Next Tree"</strong> above to add <code>' + st.eta + ' × Leaf Nudge</code> to the raw score and watch the mistakes shrink!' }
      ];
      var py = 'import numpy as np\ny = np.array([' + st.rows.map(function (r) { return r.y; }).join(', ') + '])\np = np.array([' + st.rows.map(function (r) { return fmt(r.p, 3); }).join(', ') + '])\nw = np.where(y == 1, ' + st.posW + ', 1.0)\ngap = w * (p - y); brake = w * p * (1 - p)\nleft = np.array([' + st.rows.map(function (r) { return r.side === 'L' ? 'True' : 'False'; }).join(', ') + '])\nbucket_score = lambda mask: (gap[mask].sum()**2) / (brake[mask].sum() + ' + st.lam + ')\ngain = 0.5 * (bucket_score(left) + bucket_score(~left) - bucket_score(np.ones_like(left, bool))) - ' + st.gamma + '\nprint("Split Gain:", round(gain, 4), "Left Leaf:", round(-gap[left].sum()/(brake[left].sum()+' + st.lam + '), 4), "Right Leaf:", round(-gap[~left].sum()/(brake[~left].sum()+' + st.lam + '), 4))';
      return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    } else {
      var rf = data.rf;
      var ensVar = (rf.rho * rf.sigma2) + ((1 - rf.rho) / rf.B) * rf.sigma2;
      var oobRight = 0, oobTotal = 0;
      var rowSummary = rf.oob.map(function (row, ri) {
        var rgt = 0, wrg = 0;
        row.forEach(function (v) { if (v === 0) rgt++; else if (v === -1) wrg++; });
        var hasOob = (rgt + wrg) > 0;
        var ok = hasOob ? (rgt >= wrg) : null;
        if (hasOob) { oobTotal++; if (ok) oobRight++; }
        return { row: ri + 1, rgt: rgt, wrg: wrg, hasOob: hasOob, ok: ok };
      });
      var oobAcc = oobTotal > 0 ? oobRight / oobTotal : 1;
      var stats = renderStatGrid([
        { label: 'Held-Out Accuracy', val: (oobAcc * 100).toFixed(1) + '%', sub: oobRight + ' of ' + oobTotal + ' held-out rows right', color: '#34d399' },
        { label: 'Held-Out Error Rate', val: ((1 - oobAcc) * 100).toFixed(1) + '%', sub: 'Free check with no extra test set!' },
        { label: 'Forest Wobble (Spread)', val: fmt(ensVar, 4), sub: 'vs 1-Tree Wobble = ' + fmt(rf.sigma2, 2), color: '#38bdf8' },
        { label: 'Shared-Overlap Floor', val: fmt(rf.rho * rf.sigma2, 4), sub: 'Lowered by picking random clues!' }
      ]);
      var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Row</th><th>Held-Out Votes Right</th><th>Held-Out Votes Wrong</th><th>Held-Out Verdict</th></tr></thead><tbody>' +
        rowSummary.map(function (s) {
          return '<tr><td class="text-sky-300 font-bold">Row ' + s.row + '</td><td class="text-emerald-300">' + s.rgt + '</td><td class="text-rose-300">' + s.wrg + '</td><td>' + (!s.hasOob ? 'All trees saw this row' : (s.ok ? '✅ Held-Out Right' : '❌ Held-Out Wrong')) + '</td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
      var steps = [
        { title: 'Why Roughly 36.8% of Rows Are Left Out of Each Tree', hl: [], body: 'When a tree draws <code>N</code> rows with repeats allowed, about <code>36.8%</code> of rows never get picked for that tree. Those skipped trees give an honest Held-Out vote for every row!' },
        { title: 'How Voting Trees Shrink Error Wobble', hl: [], body: '<code>Forest Wobble = Overlap × Tree Wobble + ((1 − Overlap) ÷ Trees) × Tree Wobble = (' + rf.rho + ')(' + rf.sigma2 + ') + ((1 − ' + rf.rho + ')/' + rf.B + ')(' + rf.sigma2 + ') = <strong>' + fmt(ensVar, 4) + '</strong></code>.<br>Adding more trees shrinks the second piece, while letting each tree check only a random subset of clues lowers Overlap!' }
      ];
      var py = 'num_trees, overlap, tree_wobble = ' + rf.B + ', ' + rf.rho + ', ' + rf.sigma2 + '\nforest_wobble = overlap * tree_wobble + ((1 - overlap) / num_trees) * tree_wobble\nprint("Forest wobble:", round(forest_wobble, 4), "Floor:", round(overlap * tree_wobble, 4))';
      return stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    }
  }

  // ============================================================================
  // CALCULATOR 8: EVALUATION METRICS (CM, F1, MCC, BRIER, LOG-LOSS, ROC-AUC)
  // ============================================================================
  function buildEvalInputs() {
    var st = data.eval;
    return '<div class="v82-card v82-card-sky space-y-2.5">' +
      '<div class="flex flex-wrap items-center justify-between gap-2">' +
        '<div class="text-xs font-bold text-amber-300">Alert Cutoff = <span id="v82-eval-tau-lbl">' + fmt(st.tau, 2) + '</span></div>' +
        '<div class="flex gap-1.5">' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="eval:default">Default</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="eval:perfect">Perfect Ranking</button>' +
        '</div>' +
      '</div>' +
      '<input type="range" min="0.05" max="0.95" step="0.05" value="' + st.tau + '" class="w-full accent-amber-400" data-v82-edit="eval.tau">' +
      '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Sample</th><th>Real Outcome (0 or 1)</th><th>Model Predicted Chance</th></tr></thead><tbody>' +
        st.rows.map(function (r, idx) {
          return '<tr><td class="text-sky-300">' + esc(r.name) + '</td>' +
            '<td><select class="v82-num-input" data-v82-edit="eval.rows.' + idx + '.y"><option value="1" ' + (r.y === 1 ? 'selected' : '') + '>1 (Phish)</option><option value="0" ' + (r.y === 0 ? 'selected' : '') + '>0 (Safe)</option></select></td>' +
            '<td><input type="number" step="0.02" min="0.01" max="0.99" class="v82-num-input" data-v82-edit="eval.rows.' + idx + '.p" value="' + fmt(r.p, 2) + '"></td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
  }

  function buildEvalOutputs() {
    var st = data.eval;
    var lbl = document.getElementById('v82-eval-tau-lbl');
    if (lbl) lbl.textContent = fmt(st.tau, 2);

    var TP = 0, FP = 0, TN = 0, FN = 0, brierSum = 0, llSum = 0;
    var comp = st.rows.map(function (r) {
      var pred = r.p >= st.tau ? 1 : 0;
      var cell = '';
      if (r.y === 1 && pred === 1) { TP++; cell = '✅ Caught Phish'; }
      else if (r.y === 0 && pred === 1) { FP++; cell = '⚠️ False Alarm'; }
      else if (r.y === 0 && pred === 0) { TN++; cell = '✅ Cleared Safe'; }
      else { FN++; cell = '🚨 Missed Phish'; }
      var b = Math.pow(r.p - r.y, 2);
      var pc = Math.max(1e-6, Math.min(1 - 1e-6, r.p));
      var ll = -(r.y * Math.log(pc) + (1 - r.y) * Math.log(1 - pc));
      brierSum += b; llSum += ll;
      return { name: r.name, y: r.y, p: r.p, pred: pred, cell: cell, b: b, ll: ll };
    });
    var n = st.rows.length;
    var acc = (TP + TN) / n;
    var prec = (TP + FP) > 0 ? TP / (TP + FP) : 0;
    var rec = (TP + FN) > 0 ? TP / (TP + FN) : 0;
    var fpr = (FP + TN) > 0 ? FP / (FP + TN) : 0;
    var f1 = (prec + rec) > 0 ? (2 * prec * rec) / (prec + rec) : 0;
    var mccDen = Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
    var mcc = mccDen > 0 ? ((TP * TN - FP * FN) / mccDen) : 0;
    var brier = brierSum / n, logLoss = llSum / n;

    // Exact Mann-Whitney concordance ROC-AUC
    var pos = st.rows.filter(function (r) { return r.y === 1; });
    var neg = st.rows.filter(function (r) { return r.y === 0; });
    var conc = 0, totalPairs = pos.length * neg.length;
    pos.forEach(function (a) {
      neg.forEach(function (b) {
        if (a.p > b.p) conc += 1;
        else if (a.p === b.p) conc += 0.5;
      });
    });
    var auc = totalPairs > 0 ? conc / totalPairs : 1.0;

    var chips = renderFormulaChips([
      { key: 'pred', label: 'Flagged If Chance ≥ Cutoff' },
      { key: 'cm', label: 'Caught / False Alarm / Cleared / Missed' },
      { key: 'brier', label: 'Chance Mistake Squared' },
      { key: 'll', label: 'Surprise Penalty' }
    ]);
    var stats = renderStatGrid([
      { label: 'Caught / False Alarm / Cleared / Missed', val: TP + ' / ' + FP + ' / ' + TN + ' / ' + FN, sub: 'Overall Accuracy = ' + (acc * 100).toFixed(1) + '%' },
      { label: 'Alert Trust / Threat Catch Rate', val: (prec * 100).toFixed(1) + '% / ' + (rec * 100).toFixed(1) + '%', sub: 'False Alarm Rate = ' + (fpr * 100).toFixed(1) + '%' },
      { label: 'Precision-Recall Balance', val: fmt(f1, 4), sub: 'Balances false alarms & catches', color: '#34d399' },
      { label: 'Balanced Overall Score', val: fmtSigned(mcc, 4), sub: 'Range [−1.00 to +1.00]' },
      { label: 'Chance Mistake / Surprise Penalty', val: fmt(brier, 4) + ' / ' + fmt(logLoss, 3), sub: 'Lower = more honest chances' },
      { label: 'Ranking Accuracy (All Pairs)', val: fmt(auc, 4), sub: conc + ' of ' + (totalPairs || 1) + ' phish beat safe', color: '#38bdf8' }
    ]);
    var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
      '<th>Row</th><th>Truth</th><th>Chance</th><th data-col="pred">Flagged (≥' + fmt(st.tau, 2) + ')</th><th data-col="cm">Outcome Box</th><th data-col="brier">Chance Error²</th><th data-col="ll">Surprise Penalty</th>' +
      '</tr></thead><tbody>' +
      comp.map(function (c) {
        return '<tr><td>' + esc(c.name) + '</td><td>' + c.y + '</td><td>' + fmt(c.p, 2) + '</td>' +
          '<td data-col="pred">' + c.pred + '</td><td data-col="cm" class="font-bold">' + c.cell + '</td>' +
          '<td data-col="brier">' + fmt(c.b, 4) + '</td><td data-col="ll">' + fmt(c.ll, 3) + '</td></tr>';
      }).join('') +
      '</tbody></table></div></div>';

    var steps = [
      { title: 'Apply Alert Cutoff (' + fmt(st.tau, 2) + ') to Count All 4 Outcome Boxes', hl: ['pred', 'cm'], body: 'Rows with <code>Chance ≥ ' + fmt(st.tau, 2) + '</code> trigger a Phish alert: <code>Caught=' + TP + ', False Alarms=' + FP + ', Cleared Safe=' + TN + ', Missed Phish=' + FN + '</code>.' },
      { title: 'Measure Alert Trust, Catch Rate, Balance Score & Overall Score', hl: ['cm'], body: '<code>Alert Trust = ' + TP + ' ÷ (' + TP + ' + ' + FP + ') = <strong>' + fmt(prec, 3) + '</strong></code>; <code>Threat Catch Rate = ' + TP + ' ÷ (' + TP + ' + ' + FN + ') = <strong>' + fmt(rec, 3) + '</strong></code>.<br><code>Precision-Recall Balance = 2×' + fmt(prec, 3) + '×' + fmt(rec, 3) + ' ÷ (' + fmt(prec + rec, 3) + ') = <strong>' + fmt(f1, 4) + '</strong></code>; <code>Balanced Overall Score = <strong>' + fmtSigned(mcc, 4) + '</strong></code>.' },
      { title: 'Measure How Honest the Chances Are (No Cutoff Needed)', hl: ['brier', 'll'], body: '<code>Average Squared Chance Error = ' + fmt(brierSum, 4) + ' ÷ ' + n + ' = <strong>' + fmt(brier, 4) + '</strong></code>; <code>Average Surprise Penalty = ' + fmt(llSum, 3) + ' ÷ ' + n + ' = <strong>' + fmt(logLoss, 4) + '</strong></code>.' },
      { title: 'Check Pair-by-Pair Ranking Accuracy', hl: [], body: 'Across all <code>' + pos.length + ' × ' + neg.length + ' = ' + totalPairs + '</code> (Phish, Safe) pairs, the Phish link got a higher risk score <code>' + conc + '</code> times → <code>Ranking Accuracy = ' + conc + ' ÷ ' + (totalPairs || 1) + ' = <strong>' + fmt(auc, 4) + '</strong></code>!' }
    ];
    var py = 'import numpy as np\nfrom sklearn.metrics import f1_score, matthews_corrcoef, brier_score_loss, roc_auc_score, log_loss\ntruth = np.array([' + st.rows.map(function (r) { return r.y; }).join(', ') + '])\nchance = np.array([' + st.rows.map(function (r) { return fmt(r.p, 2); }).join(', ') + '])\nflagged = (chance >= ' + fmt(st.tau, 2) + ').astype(int)\nprint("Balance Score:", round(f1_score(truth, flagged), 4), "Overall Score:", round(matthews_corrcoef(truth, flagged), 4), "Chance Error:", round(brier_score_loss(truth, chance), 4), "Ranking:", round(roc_auc_score(truth, chance), 4))';
    return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
  }

  // ============================================================================
  // CALCULATOR 9: K-MEANS INERTIA / SILHOUETTE & PCA EIGENVALUES / Z-SCALING
  // ============================================================================
  function buildUnsupInputs() {
    var sub = ui.subMode.unsup_pca;
    var head = '<div class="flex flex-wrap gap-1.5 mb-2.5">' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'kmeans' ? 'is-active' : '') + '" data-v82-sub="unsup_pca:kmeans">🎯 Group Tightness &amp; Separation Score</button>' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'pca' ? 'is-active' : '') + '" data-v82-sub="unsup_pca:pca">📐 Column Compression &amp; Fair Scaling</button>' +
    '</div>';
    if (sub === 'kmeans') {
      var st = data.kmeans;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="flex flex-wrap gap-1.5">' +
          '<button type="button" class="v82-btn-sm is-active" data-v82-action="kmeans:lloyd">⚡ Move Points to Closest Group Center</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="kmeans:default">↺ Reset</button>' +
        '</div>' +
        '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Pt</th><th>Clue 1</th><th>Clue 2</th><th>Group</th></tr></thead><tbody>' +
          st.rows.map(function (r, idx) {
            return '<tr><td class="text-sky-300 font-bold">' + esc(r.name) + '</td>' +
              '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="kmeans.rows.' + idx + '.x1" value="' + r.x1 + '"></td>' +
              '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="kmeans.rows.' + idx + '.x2" value="' + r.x2 + '"></td>' +
              '<td><select class="v82-num-input" data-v82-edit="kmeans.rows.' + idx + '.c"><option value="A" ' + (r.c === 'A' ? 'selected' : '') + '>Group A</option><option value="B" ' + (r.c === 'B' ? 'selected' : '') + '>Group B</option></select></td></tr>';
          }).join('') +
        '</tbody></table></div></div>';
    } else {
      var pca = data.pca;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="flex gap-1.5"><button type="button" class="v82-btn-sm" data-v82-preset="pca:default">Linked Columns (99% Kept)</button><button type="button" class="v82-btn-sm" data-v82-preset="pca:uncorr">Independent Cloud</button></div>' +
        '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Row</th><th>House Size (1000s SqFt)</th><th>Room Count</th></tr></thead><tbody>' +
          pca.rows.map(function (r, idx) {
            return '<tr><td class="text-sky-300 font-bold">#' + (idx + 1) + '</td>' +
              '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="pca.rows.' + idx + '.x1" value="' + r.x1 + '"></td>' +
              '<td><input type="number" step="0.5" class="v82-num-input" data-v82-edit="pca.rows.' + idx + '.x2" value="' + r.x2 + '"></td></tr>';
          }).join('') +
        '</tbody></table></div></div>';
    }
  }

  function buildUnsupOutputs() {
    if (ui.subMode.unsup_pca === 'kmeans') {
      var rows = data.kmeans.rows;
      var sumA = [0, 0, 0], sumB = [0, 0, 0];
      rows.forEach(function (r) {
        if (r.c === 'A') { sumA[0] += r.x1; sumA[1] += r.x2; sumA[2]++; }
        else { sumB[0] += r.x1; sumB[1] += r.x2; sumB[2]++; }
      });
      var muA = sumA[2] ? [sumA[0] / sumA[2], sumA[1] / sumA[2]] : [0, 0];
      var muB = sumB[2] ? [sumB[0] / sumB[2], sumB[1] / sumB[2]] : [0, 0];

      var wcss = 0, silSum = 0;
      var comp = rows.map(function (r, idx) {
        var mu = r.c === 'A' ? muA : muB;
        var sq = Math.pow(r.x1 - mu[0], 2) + Math.pow(r.x2 - mu[1], 2);
        wcss += sq;
        var sameD = [], otherD = [];
        rows.forEach(function (o, j) {
          if (idx === j) return;
          var d = Math.sqrt(Math.pow(r.x1 - o.x1, 2) + Math.pow(r.x2 - o.x2, 2));
          if (o.c === r.c) sameD.push(d); else otherD.push(d);
        });
        var a = sameD.length ? sameD.reduce(function (s, v) { return s + v; }, 0) / sameD.length : 0;
        var b = otherD.length ? otherD.reduce(function (s, v) { return s + v; }, 0) / otherD.length : 0;
        var s = (sameD.length && otherD.length && Math.max(a, b) > 0) ? (b - a) / Math.max(a, b) : 0;
        silSum += s;
        return { name: r.name, c: r.c, dCent: Math.sqrt(sq), sq: sq, a: a, b: b, s: s };
      });
      var meanSil = silSum / rows.length;

      var chips = renderFormulaChips([
        { key: 'cent', label: 'Group Center (Average Point)' },
        { key: 'wcss', label: 'Within-Group Tightness' },
        { key: 'sil', label: 'Group Separation Score' }
      ]);
      var stats = renderStatGrid([
        { label: 'Group A Center', val: '(' + fmt(muA[0], 2) + ', ' + fmt(muA[1], 2) + ')', sub: sumA[2] + ' points' },
        { label: 'Group B Center', val: '(' + fmt(muB[0], 2) + ', ' + fmt(muB[1], 2) + ')', sub: sumB[2] + ' points' },
        { label: 'Total Within-Group Spread', val: fmt(wcss, 3), sub: 'Lower = tighter groups' },
        { label: 'Average Separation Score', val: fmtSigned(meanSil, 4), sub: 'Range [−1.00 to +1.00]', color: meanSil > 0.5 ? '#34d399' : '#fbbf24' }
      ]);
      var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>Pt</th><th>Group</th><th data-col="wcss">Dist to Center</th><th data-col="wcss">Squared Dist</th><th data-col="sil">Same-Group Dist</th><th data-col="sil">Other-Group Dist</th><th data-col="sil">Separation Score</th>' +
        '</tr></thead><tbody>' +
        comp.map(function (c) {
          return '<tr><td class="text-sky-300 font-bold">' + esc(c.name) + '</td><td>' + c.c + '</td>' +
            '<td data-col="wcss">' + fmt(c.dCent, 3) + '</td><td data-col="wcss" class="text-rose-300">' + fmt(c.sq, 3) + '</td>' +
            '<td data-col="sil">' + fmt(c.a, 3) + '</td><td data-col="sil">' + fmt(c.b, 3) + '</td>' +
            '<td data-col="sil" class="text-emerald-300 font-bold">' + fmtSigned(c.s, 3) + '</td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
      var steps = [
        { title: 'Find the Average Center of Group A and Group B', hl: ['cent'], body: 'Average coordinates inside each group: <code>Group A Center = (' + fmt(muA[0], 2) + ', ' + fmt(muA[1], 2) + ')</code>, <code>Group B Center = (' + fmt(muB[0], 2) + ', ' + fmt(muB[1], 2) + ')</code>.' },
        { title: 'Add Up Squared Distances to Measure Group Tightness', hl: ['wcss'], body: '<code>Within-Group Spread = ' + comp.map(function (c) { return fmt(c.sq, 2); }).join(' + ') + ' = <strong>' + fmt(wcss, 3) + '</strong></code>.' },
        { title: 'Score How Cleanly Separated the Groups Are (−1 to +1)', hl: ['sil'], body: 'For <code>' + esc(comp[0].name) + '</code>: average distance to teammates = <code>' + fmt(comp[0].a, 3) + '</code>, average distance to rivals = <code>' + fmt(comp[0].b, 3) + '</code> → <code>Separation = <strong>' + fmtSigned(comp[0].s, 3) + '</strong></code>. Overall Average = <code><strong>' + fmtSigned(meanSil, 4) + '</strong></code>.' }
      ];
      var py = 'import numpy as np\nfrom sklearn.metrics import silhouette_score\npts = np.array([' + rows.map(function (r) { return '[' + r.x1 + ',' + r.x2 + ']'; }).join(', ') + '])\ngroups = np.array([' + rows.map(function (r) { return r.c === 'A' ? 0 : 1; }).join(', ') + '])\nprint("Separation Score:", round(silhouette_score(pts, groups), 4))';
      return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    } else {
      var rows = data.pca.rows;
      var n = rows.length;
      var m1 = 0, m2 = 0;
      rows.forEach(function (r) { m1 += r.x1; m2 += r.x2; });
      m1 /= n; m2 /= n;
      var s11 = 0, s22 = 0, s12 = 0;
      rows.forEach(function (r) {
        var d1 = r.x1 - m1, d2 = r.x2 - m2;
        s11 += d1 * d1; s22 += d2 * d2; s12 += d1 * d2;
      });
      var cov11 = s11 / (n - 1), cov22 = s22 / (n - 1), cov12 = s12 / (n - 1);
      var sd1 = Math.sqrt(cov11) || 1, sd2 = Math.sqrt(cov22) || 1;
      var tr = cov11 + cov22;
      var det = cov11 * cov22 - cov12 * cov12;
      var disc = Math.sqrt(Math.max(0, tr * tr - 4 * det));
      var lam1 = (tr + disc) / 2;
      var lam2 = Math.max(0, (tr - disc) / 2);
      var totVar = lam1 + lam2 || 1;
      var evr1 = lam1 / totVar, evr2 = lam2 / totVar;

      var chips = renderFormulaChips([
        { key: 'z', label: 'Fair Spread Scale (Standardized)' },
        { key: 'cov', label: 'How Columns Move Together' },
        { key: 'eig', label: 'Share of Information Kept' }
      ]);
      var stats = renderStatGrid([
        { label: 'SqFt Spread / Rooms Spread', val: fmt(cov11, 2) + ' / ' + fmt(cov22, 2), sub: 'Move-Together = ' + fmtSigned(cov12, 2) },
        { label: 'Main vs Extra Axis Spread', val: fmt(lam1, 3) + ' vs ' + fmt(lam2, 3), sub: 'Total Spread = ' + fmt(tr, 3) },
        { label: 'Info Kept on Main Axis', val: (evr1 * 100).toFixed(2) + '%', sub: 'Extra Wiggle = ' + (evr2 * 100).toFixed(2) + '%', color: '#34d399' }
      ]);
      var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>Row</th><th>Centered SqFt</th><th>Centered Rooms</th><th data-col="z">Scaled SqFt</th><th data-col="z">Scaled Rooms</th><th data-col="cov">Move-Together Product</th>' +
        '</tr></thead><tbody>' +
        rows.map(function (r, idx) {
          var d1 = r.x1 - m1, d2 = r.x2 - m2;
          return '<tr><td class="text-sky-300 font-bold">#' + (idx + 1) + '</td><td>' + fmtSigned(d1, 2) + '</td><td>' + fmtSigned(d2, 2) + '</td>' +
            '<td data-col="z">' + fmtSigned(d1 / sd1, 2) + '</td><td data-col="z">' + fmtSigned(d2 / sd2, 2) + '</td>' +
            '<td data-col="cov">' + fmtSigned(d1 * d2, 2) + '</td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
      var steps = [
        { title: 'Center Columns at Zero & Scale by Typical Spread', hl: ['z'], body: '<code>Avg SqFt = ' + fmt(m1, 2) + ', Typical Spread = ' + fmt(sd1, 2) + '</code>; <code>Avg Rooms = ' + fmt(m2, 2) + ', Typical Spread = ' + fmt(sd2, 2) + '</code>. Subtracting averages puts the data cloud right on (0, 0).' },
        { title: 'Measure Individual Spreads & Move-Together Score', hl: ['cov'], body: 'SqFt Spread = <code>' + fmt(cov11, 2) + '</code>, Rooms Spread = <code>' + fmt(cov22, 2) + '</code>, Move-Together Score = <code>' + fmt(cov12, 2) + '</code> (dividing sums by <code>' + (n - 1) + '</code>).' },
        { title: 'Rotate to Main Axis & Find How Much Information Survives', hl: ['eig'], body: 'Rotating onto the longest diagonal gives Main Axis Spread = <code><strong>' + fmt(lam1, 3) + '</strong></code> and Extra Wiggle = <code><strong>' + fmt(lam2, 3) + '</strong></code>.<br>Compressing 2 columns into 1 Master Score keeps <code>' + fmt(lam1, 3) + ' ÷ ' + fmt(totVar, 3) + ' = <strong>' + (evr1 * 100).toFixed(2) + '%</strong></code> of the information!' }
      ];
      var py = 'import numpy as np\nfrom sklearn.decomposition import PCA\nX = np.array([' + rows.map(function (r) { return '[' + r.x1 + ',' + r.x2 + ']'; }).join(', ') + '])\npca = PCA().fit(X)\nprint("Axis spreads:", np.round(pca.explained_variance_, 3), "Info kept:", np.round(pca.explained_variance_ratio_, 4))';
      return chips + stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    }
  }

  // ============================================================================
  // CALCULATOR 10: NEURAL BACKPROPAGATION + ATTENTION SOFTMAX & Q-LEARNING
  // ============================================================================
  function buildNnInputs() {
    var sub = ui.subMode.nn_backprop;
    var head = '<div class="flex flex-wrap gap-1.5 mb-2.5">' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'mlp' ? 'is-active' : '') + '" data-v82-sub="nn_backprop:mlp">🧠 Layered Network Blame Passing</button>' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'attn_rl' ? 'is-active' : '') + '" data-v82-sub="nn_backprop:attn_rl">⚡ Word Focus Weights &amp; Reward Learning</button>' +
    '</div>';
    if (sub === 'mlp') {
      var m = data.mlp;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="flex flex-wrap gap-1.5">' +
          '<button type="button" class="v82-btn-sm is-active" data-v82-action="mlp:step">🔄 Apply 1 Learning Nudge</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="mlp:default">↺ Reset</button>' +
        '</div>' +
        '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">' +
          '<div><label class="block text-[10px] text-slate-400">Input Number</label><input type="number" step="0.5" class="v82-num-input w-full" data-v82-edit="mlp.x" value="' + m.x + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Target Answer</label><input type="number" step="0.5" class="v82-num-input w-full" data-v82-edit="mlp.y" value="' + m.y + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Layer 1 Weight</label><input type="number" step="0.1" class="v82-num-input w-full" data-v82-edit="mlp.w1" value="' + fmt(m.w1, 3) + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Layer 1 Base</label><input type="number" step="0.1" class="v82-num-input w-full" data-v82-edit="mlp.b1" value="' + fmt(m.b1, 3) + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Output Weight</label><input type="number" step="0.1" class="v82-num-input w-full" data-v82-edit="mlp.w2" value="' + fmt(m.w2, 3) + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Step Size</label><input type="number" step="0.05" min="0.01" class="v82-num-input w-full" data-v82-edit="mlp.lr" value="' + m.lr + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Bend Gate</label><select class="v82-num-input w-full" data-v82-edit="mlp.act"><option value="relu" ' + (m.act === 'relu' ? 'selected' : '') + '>Hinge Gate (ReLU)</option><option value="sigmoid" ' + (m.act === 'sigmoid' ? 'selected' : '') + '>S-Curve (Sigmoid)</option><option value="tanh" ' + (m.act === 'tanh' ? 'selected' : '') + '>Centered S-Curve</option></select></div>' +
        '</div></div>';
    } else {
      var ar = data.attn_rl;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">' +
          '<div><label class="block text-[10px] text-slate-400">Word 1 Match Score</label><input type="number" step="0.2" class="v82-num-input w-full" data-v82-edit="attn_rl.s1" value="' + ar.s1 + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Word 2 Match Score</label><input type="number" step="0.2" class="v82-num-input w-full" data-v82-edit="attn_rl.s2" value="' + ar.s2 + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Word 3 Match Score</label><input type="number" step="0.2" class="v82-num-input w-full" data-v82-edit="attn_rl.s3" value="' + ar.s3 + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Word Vector Length</label><input type="number" step="1" min="1" class="v82-num-input w-full" data-v82-edit="attn_rl.dk" value="' + ar.dk + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Old Move Score</label><input type="number" step="5" class="v82-num-input w-full" data-v82-edit="attn_rl.qOld" value="' + ar.qOld + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Step Reward</label><input type="number" step="10" class="v82-num-input w-full" data-v82-edit="attn_rl.reward" value="' + ar.reward + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Best Next-Square Score</label><input type="number" step="5" class="v82-num-input w-full" data-v82-edit="attn_rl.maxQNext" value="' + ar.maxQNext + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Learn Rate / Future Trust</label><div class="flex gap-1"><input type="number" step="0.1" min="0" max="1" class="v82-num-input w-1/2" data-v82-edit="attn_rl.alpha" value="' + ar.alpha + '"><input type="number" step="0.05" min="0" max="0.99" class="v82-num-input w-1/2" data-v82-edit="attn_rl.gamma" value="' + ar.gamma + '"></div></div>' +
        '</div></div>';
    }
  }

  function computeMlpStats() {
    var m = data.mlp;
    var z1 = m.w1 * m.x + m.b1;
    var a1 = 0, dAct = 0;
    if (m.act === 'relu') {
      a1 = Math.max(0, z1); dAct = z1 > 0 ? 1 : 0;
    } else if (m.act === 'sigmoid') {
      a1 = sigmoid(z1); dAct = a1 * (1 - a1);
    } else {
      a1 = Math.tanh(z1); dAct = 1 - a1 * a1;
    }
    var yHat = m.w2 * a1;
    var loss = 0.5 * Math.pow(yHat - m.y, 2);
    var delta2 = yHat - m.y;
    var dw2 = delta2 * a1;
    var delta1 = delta2 * m.w2 * dAct;
    var dw1 = delta1 * m.x;
    var db1 = delta1;
    return {
      z1: z1, a1: a1, dAct: dAct, yHat: yHat, loss: loss,
      delta2: delta2, dw2: dw2, delta1: delta1, dw1: dw1, db1: db1,
      nw1: m.w1 - m.lr * dw1, nb1: m.b1 - m.lr * db1, nw2: m.w2 - m.lr * dw2
    };
  }

  function buildNnOutputs() {
    if (ui.subMode.nn_backprop === 'mlp') {
      var m = data.mlp;
      var s = computeMlpStats();
      var stats = renderStatGrid([
        { label: 'Hidden Raw → Gate Output', val: fmt(s.z1, 2) + ' → ' + fmt(s.a1, 3), sub: 'Gate Tilt = ' + fmt(s.dAct, 3) },
        { label: 'Guess vs Target Answer', val: fmt(s.yHat, 3) + ' vs ' + m.y, sub: 'Half-Squared Error = ' + fmt(s.loss, 4) },
        { label: 'Weight Blame (L1, Out)', val: fmtSigned(s.dw1, 3) + ', ' + fmtSigned(s.dw2, 3), sub: 'Signal L1=' + fmtSigned(s.delta1, 3) + ', Out=' + fmtSigned(s.delta2, 3) },
        { label: 'Next Weights (L1, Out)', val: fmt(s.nw1, 3) + ', ' + fmt(s.nw2, 3), color: '#34d399' }
      ]);
      var steps = [
        { title: 'Forward Pass: Input → Hidden Neuron → Output Guess → Error', hl: [], body: '<code>Hidden Raw = ' + fmt(m.w1, 2) + '(' + m.x + ') + ' + fmt(m.b1, 2) + ' = <strong>' + fmt(s.z1, 3) + '</strong></code>.<br>After bend gate: <code>Gate Output = <strong>' + fmt(s.a1, 3) + '</strong></code> → Output Guess = <code>' + fmt(m.w2, 2) + '×' + fmt(s.a1, 3) + ' = <strong>' + fmt(s.yHat, 3) + '</strong></code> → Error Score = <code><strong>' + fmt(s.loss, 4) + '</strong></code>.' },
        { title: 'Assign Blame to the Output Weight', hl: [], body: '<code>Output Miss = Guess − Target = ' + fmt(s.yHat, 3) + ' − ' + m.y + ' = <strong>' + fmtSigned(s.delta2, 3) + '</strong></code>.<br><code>Output Weight Blame = (' + fmt(s.delta2, 3) + ') × (' + fmt(s.a1, 3) + ') = <strong>' + fmtSigned(s.dw2, 3) + '</strong></code>.' },
        { title: 'Pass Remaining Blame Backward Through the Gate to Layer 1', hl: [], body: '<code>Hidden Blame = Output Miss × Out Weight × Gate Tilt = (' + fmt(s.delta2, 3) + ')(' + fmt(m.w2, 2) + ')(' + fmt(s.dAct, 3) + ') = <strong>' + fmtSigned(s.delta1, 3) + '</strong></code>.<br><code>Layer 1 Weight Blame = Hidden Blame × Input = (' + fmt(s.delta1, 3) + ')(' + m.x + ') = <strong>' + fmtSigned(s.dw1, 3) + '</strong></code>.' },
        { title: 'Nudge Both Weights Downhill (Step Size = ' + m.lr + ')', hl: [], body: '<code>Next Layer 1 Weight = ' + fmt(m.w1, 3) + ' − ' + m.lr + '(' + fmt(s.dw1, 3) + ') = <strong>' + fmt(s.nw1, 3) + '</strong></code>; <code>Next Output Weight = <strong>' + fmt(s.nw2, 3) + '</strong></code>.' }
      ];
      var py = 'inp, target, w1, b1, w2, step = ' + m.x + ', ' + m.y + ', ' + fmt(m.w1, 3) + ', ' + fmt(m.b1, 3) + ', ' + fmt(m.w2, 3) + ', ' + m.lr + '\nhid_raw = w1*inp + b1\ngate_out = max(0, hid_raw)\nguess = w2*gate_out\nerr = 0.5*(guess - target)**2\nmiss = guess - target; blame_w2 = miss*gate_out\nhid_blame = miss*w2*(1 if hid_raw > 0 else 0); blame_w1 = hid_blame*inp\nprint("error:", round(err, 4), "blame_w1:", round(blame_w1, 3), "blame_w2:", round(blame_w2, 3))';
      return stats + renderStepCards(steps) + renderPythonBox(py);
    } else {
      var ar = data.attn_rl;
      var sc = Math.sqrt(Math.max(1, ar.dk));
      var logits = [ar.s1 / sc, ar.s2 / sc, ar.s3 / sc];
      var exps = logits.map(function (v) { return Math.exp(Math.max(-20, Math.min(20, v))); });
      var sumExp = exps[0] + exps[1] + exps[2];
      var probs = exps.map(function (e) { return e / sumExp; });
      var tdTarget = ar.reward + ar.gamma * ar.maxQNext;
      var tdErr = tdTarget - ar.qOld;
      var qNew = ar.qOld + ar.alpha * tdErr;

      var stats = renderStatGrid([
        { label: 'Size-Balanced Match Scores', val: logits.map(function (v) { return fmt(v, 2); }).join(', '), sub: 'Divided by √' + ar.dk + ' = ' + fmt(sc, 2) },
        { label: 'Focus Share (% of Attention)', val: probs.map(function (p) { return (p * 100).toFixed(1) + '%'; }).join(' | '), sub: 'Adds up to 100.0%', color: '#38bdf8' },
        { label: 'Updated Reward Target', val: fmt(tdTarget, 2), sub: 'Surprise Gap = ' + fmtSigned(tdErr, 2) },
        { label: 'Updated Move Score', val: fmt(qNew, 2), sub: 'Was ' + fmt(ar.qOld, 1), color: '#34d399' }
      ]);
      var steps = [
        { title: 'Word Focus Weights (Balance by Word Length → Turn Into Percentages)', hl: [], body: 'Divide match scores by <code>√' + ar.dk + ' = ' + fmt(sc, 2) + '</code>: <code>[' + logits.map(function (v) { return fmt(v, 3); }).join(', ') + ']</code>.<br>Raise e to each score: <code>[' + exps.map(function (e) { return fmt(e, 3); }).join(', ') + ']</code> (Sum = <code>' + fmt(sumExp, 3) + '</code>) → Focus Shares = <code><strong>[' + probs.map(function (p) { return (p * 100).toFixed(1) + '%'; }).join(', ') + ']</strong></code>.' },
        { title: 'Reward Learning: Pull Move Score Toward Reward + Best Next Square', hl: [], body: 'New Target: <code>Reward + Trust × Next Best = ' + ar.reward + ' + ' + ar.gamma + '×' + ar.maxQNext + ' = <strong>' + fmt(tdTarget, 2) + '</strong></code>.<br>Surprise Gap: <code>' + fmt(tdTarget, 2) + ' − ' + ar.qOld + ' = <strong>' + fmtSigned(tdErr, 2) + '</strong></code> → <code>Updated Move Score = ' + ar.qOld + ' + ' + ar.alpha + '(' + fmt(tdErr, 2) + ') = <strong>' + fmt(qNew, 2) + '</strong></code>!' }
      ];
      var py = 'import numpy as np\nscores = np.array([' + ar.s1 + ', ' + ar.s2 + ', ' + ar.s3 + ']) / np.sqrt(' + ar.dk + ')\nfocus_shares = np.exp(scores) / np.exp(scores).sum()\nupdated_move = ' + ar.qOld + ' + ' + ar.alpha + ' * ((' + ar.reward + ' + ' + ar.gamma + '*' + ar.maxQNext + ') - ' + ar.qOld + ')\nprint("Focus Shares:", np.round(focus_shares, 4), "Updated Move Score:", round(updated_move, 2))';
      return stats + renderStepCards(steps) + renderPythonBox(py);
    }
  }

  // ============================================================================
  // CALCULATOR 11: SHANNON ENTROPY H(X) & SUBLINEAR L2 TF-IDF
  // ============================================================================
  function calcStringEntropy(str) {
    var s = String(str || '');
    var L = s.length;
    if (!L) return { L: 0, rows: [], H: 0, sigma: 1, hMax: 0, hNorm: 0 };
    var counts = {};
    for (var i = 0; i < L; i++) counts[s[i]] = (counts[s[i]] || 0) + 1;
    var rows = Object.keys(counts).map(function (ch) {
      var c = counts[ch];
      var p = c / L;
      var bits = -Math.log(p) / Math.LN2;
      return { ch: ch, c: c, p: p, bits: bits, term: p * bits };
    });
    var H = rows.reduce(function (acc, r) { return acc + r.term; }, 0);
    var hasHexOnly = /^[0-9a-fA-F]+$/.test(s);
    var hasAlnum = /^[0-9a-z]+$/.test(s);
    var sigma = hasHexOnly ? 16 : (hasAlnum ? 36 : (/[A-Z]/.test(s) ? 64 : 38));
    var hMax = Math.log(sigma) / Math.LN2;
    return { L: L, rows: rows, H: H, sigma: sigma, hMax: hMax, hNorm: hMax > 0 ? H / hMax : 0 };
  }

  function buildTfidfEntropyInputs() {
    var sub = ui.subMode.tfidf_entropy;
    var head = '<div class="flex flex-wrap gap-1.5 mb-2.5">' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'entropy' ? 'is-active' : '') + '" data-v82-sub="tfidf_entropy:entropy">🧬 Live Character Randomness &amp; Contrast</button>' +
      '<button type="button" class="v82-btn-sm ' + (sub === 'tfidf' ? 'is-active' : '') + '" data-v82-sub="tfidf_entropy:tfidf">🔤 Rare Letter-Chunk Score &amp; Balancing</button>' +
    '</div>';
    if (sub === 'entropy') {
      var st = data.entropy;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="flex flex-wrap gap-1.5 mb-1">' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="entropy:phish">paypa1-secure.tk</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="entropy:safe">google.com</button>' +
          '<button type="button" class="v82-btn-sm" data-v82-preset="entropy:dga">x8k9q2m1v7p4.xyz</button>' +
        '</div>' +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">' +
          '<div><label class="block text-[10px] text-slate-400">Website Name (Type Any Host!)</label><input type="text" class="v82-num-input w-full text-left" data-v82-edit="entropy.domain" value="' + esc(st.domain) + '"></div>' +
          '<div><label class="block text-[10px] text-slate-400">Folder / Page Ending</label><input type="text" class="v82-num-input w-full text-left" data-v82-edit="entropy.path" value="' + esc(st.path) + '"></div>' +
        '</div></div>';
    } else {
      var tf = data.tfidf;
      return '<div class="v82-card v82-card-sky space-y-2.5">' + head +
        '<div class="flex items-center gap-2 text-xs">' +
          '<label class="text-slate-300 font-bold">Total Links in Library:</label>' +
          '<input type="number" min="10" step="1000" class="v82-num-input" data-v82-edit="tfidf.N" value="' + tf.N + '">' +
        '</div>' +
        '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>3-Letter Chunk</th><th>Times Inside This URL</th><th>Links With This Chunk</th></tr></thead><tbody>' +
          tf.rows.map(function (r, idx) {
            return '<tr><td class="text-amber-300 font-bold">\'' + esc(r.tok) + '\'</td>' +
              '<td><input type="number" min="1" step="1" class="v82-num-input" data-v82-edit="tfidf.rows.' + idx + '.tf" value="' + r.tf + '"></td>' +
              '<td><input type="number" min="1" step="10" class="v82-num-input" data-v82-edit="tfidf.rows.' + idx + '.df" value="' + r.df + '"></td></tr>';
          }).join('') +
        '</tbody></table></div></div>';
    }
  }

  function buildTfidfEntropyOutputs() {
    if (ui.subMode.tfidf_entropy === 'entropy') {
      var st = data.entropy;
      var dom = calcStringEntropy(st.domain);
      var pth = calcStringEntropy(st.path);
      var deltaH = pth.hNorm - dom.hNorm;
      var stats = renderStatGrid([
        { label: 'Domain Randomness', val: fmt(dom.H, 3) + ' bits', sub: dom.L + ' chars, ' + dom.rows.length + ' unique' },
        { label: 'Scaled Domain Randomness', val: fmt(dom.hNorm, 3), sub: 'Alphabet size ≈' + dom.sigma + ' (max ' + fmt(dom.hMax, 2) + 'b)' },
        { label: 'Folder Randomness', val: fmt(pth.H, 3) + ' bits', sub: 'Scaled (0 to 1) = ' + fmt(pth.hNorm, 3) },
        { label: 'Folder vs Domain Gap', val: fmtSigned(deltaH, 3), sub: deltaH > 0.15 ? '🚨 High folder randomness!' : 'Balanced structure', color: deltaH > 0.15 ? '#fb7185' : '#34d399' }
      ]);
      var tbl = '<div class="v82-card"><div class="text-xs font-bold text-sky-300 mb-2">📊 Exact Character Table for Domain "' + esc(st.domain) + '"</div>' +
        '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr><th>Letter</th><th>Count</th><th>Share (' + dom.L + ' chars)</th><th>Surprise Bits</th><th>Weighted Contribution</th></tr></thead><tbody>' +
        dom.rows.slice(0, 14).map(function (r) {
          return '<tr><td class="text-amber-300 font-bold">\'' + esc(r.ch) + '\'</td><td>' + r.c + '</td><td>' + fmt(r.p, 4) + '</td><td>' + fmt(r.bits, 3) + '</td><td class="text-emerald-300 font-bold">' + fmt(r.term, 4) + '</td></tr>';
        }).join('') +
        (dom.rows.length > 14 ? '<tr><td colspan="5" class="text-slate-400">... plus ' + (dom.rows.length - 14) + ' more unique characters included in total randomness</td></tr>' : '') +
      '</tbody></table></div></div>';
      var steps = [
        { title: 'Count How Often Each Letter Appears & Its Share', hl: [], body: 'Total length = <code>' + dom.L + '</code> across <code>' + dom.rows.length + '</code> unique characters. All character shares add up to <code>1.000</code>.' },
        { title: 'Add Up Weighted Surprise Bits & Scale From 0 to 1', hl: [], body: '<code>Domain Randomness = <strong>' + fmt(dom.H, 4) + ' bits per char</strong></code>.<br>Dividing by max possible randomness (<code>' + fmt(dom.hMax, 3) + '</code> for ' + dom.sigma + ' chars) gives <code>Scaled Randomness = <strong>' + fmt(dom.hNorm, 4) + '</strong></code>; Folder-vs-Domain gap = <code><strong>' + fmtSigned(deltaH, 3) + '</strong></code>.' }
      ];
      var py = 'import math\nfrom collections import Counter\ns = ' + JSON.stringify(st.domain) + '\nrandomness = -sum((c/len(s))*math.log2(c/len(s)) for c in Counter(s).values())\nprint("Character Randomness:", round(randomness, 4), "bits/char")';
      return stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    } else {
      var tf = data.tfidf;
      var comp = tf.rows.map(function (r) {
        var tfSub = 1 + Math.log(Math.max(1, r.tf));
        var idf = Math.log((1 + tf.N) / (1 + Math.min(tf.N, r.df))) + 1;
        var raw = tfSub * idf;
        return { tok: r.tok, tf: r.tf, df: r.df, tfSub: tfSub, idf: idf, raw: raw };
      });
      var norm2 = Math.sqrt(comp.reduce(function (s, c) { return s + c.raw * c.raw; }, 0)) || 1;
      comp.forEach(function (c) { c.l2 = c.raw / norm2; });

      var stats = renderStatGrid([
        { label: 'Total Vector Length', val: fmt(norm2, 3), sub: 'Square root of squared sum' },
        { label: 'Rarest Chunk Final Score', val: fmt(comp[2].l2, 4), sub: "'" + comp[2].tok + "' stands out!", color: '#34d399' }
      ]);
      var tbl = '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>3-Letter Chunk</th><th>Softened Count</th><th>Rarity Bonus</th><th>Raw Importance</th><th>Balanced Score (0 to 1)</th>' +
        '</tr></thead><tbody>' +
        comp.map(function (c) {
          return '<tr><td class="text-amber-300 font-bold">\'' + esc(c.tok) + '\'</td><td>' + fmt(c.tfSub, 3) + '</td><td>' + fmt(c.idf, 3) + '</td><td>' + fmt(c.raw, 3) + '</td><td class="text-emerald-300 font-bold">' + fmt(c.l2, 4) + '</td></tr>';
        }).join('') +
      '</tbody></table></div></div>';
      var steps = [
        { title: 'Soften Repeat Counts & Boost Rare Chunks', hl: [], body: 'For <code>"' + esc(comp[2].tok) + '"</code> (appears <code>' + comp[2].tf + '</code> times here, seen in <code>' + comp[2].df + '</code> links overall): Softened Count = <code>' + fmt(comp[2].tfSub, 3) + '</code>, Rarity Bonus = <code><strong>' + fmt(comp[2].idf, 3) + '</strong></code>.' },
        { title: 'Balance Scores to Unit Length So Long Links Don’t Cheat', hl: [], body: '<code>Total Length = √(' + comp.map(function (c) { return fmt(c.raw, 2) + '²'; }).join(' + ') + ') = <strong>' + fmt(norm2, 3) + '</strong></code>. Dividing by Total Length ensures squared scores always sum to <code>1.000</code>!' }
      ];
      var py = 'import numpy as np\nN = ' + tf.N + '\ncount_here = np.array([' + tf.rows.map(function (r) { return r.tf; }).join(', ') + '])\nlinks_with = np.array([' + tf.rows.map(function (r) { return r.df; }).join(', ') + '])\nimportance = (1 + np.log(count_here)) * (np.log((1 + N)/(1 + links_with)) + 1)\nbalanced = importance / np.linalg.norm(importance)\nprint("Balanced Rare-Pattern Scores:", np.round(balanced, 4))';
      return stats + tbl + renderStepCards(steps) + renderPythonBox(py);
    }
  }

  // ============================================================================
  // CALCULATOR 12: LURELOCK SPLIT, IMBALANCE & 3-TIER NEURO-SYMBOLIC SCORE
  // ============================================================================
  function buildLlPipeInputs() {
    var st = data.llpipe;
    return '<div class="v82-card v82-card-sky grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">' +
      '<div><label class="block text-[10px] text-slate-400">Safe Links Count</label><input type="number" min="100" step="1000" class="v82-num-input w-full" data-v82-edit="llpipe.nBenign" value="' + st.nBenign + '"></div>' +
      '<div><label class="block text-[10px] text-slate-400">Phish Links Count</label><input type="number" min="10" step="1000" class="v82-num-input w-full" data-v82-edit="llpipe.nPhish" value="' + st.nPhish + '"></div>' +
      '<div><label class="block text-[10px] text-slate-400">Final Test % / Check %</label><div class="flex gap-1"><input type="number" min="5" max="40" class="v82-num-input w-1/2" data-v82-edit="llpipe.testPct" value="' + st.testPct + '"><input type="number" min="5" max="30" class="v82-num-input w-1/2" data-v82-edit="llpipe.valPct" value="' + st.valPct + '"></div></div>' +
      '<div><label class="block text-[10px] text-slate-400">Main Model Chance</label><input type="number" min="0.01" max="0.99" step="0.02" class="v82-num-input w-full" data-v82-edit="llpipe.pXgb" value="' + st.pXgb + '"></div>' +
      '<div><label class="block text-[10px] text-slate-400">Path Model Chance</label><input type="number" min="0.01" max="0.99" step="0.02" class="v82-num-input w-full" data-v82-edit="llpipe.pSub" value="' + st.pSub + '"></div>' +
    '</div>';
  }

  function buildLlPipeOutputs() {
    var st = data.llpipe;
    var nTot = st.nBenign + st.nPhish;
    var testFrac = st.testPct / 100;
    var valFrac = st.valPct / 100;
    var nTest = Math.round(nTot * testFrac);
    var pool = nTot - nTest;
    var rVal = valFrac / Math.max(0.05, 1 - testFrac);
    var nVal = Math.round(pool * rVal);
    var nTrain = pool - nVal;

    var spw = st.nBenign / Math.max(1, st.nPhish);
    var zRaw = logit(st.pXgb);
    var zCal = zRaw - Math.log(spw);
    var pCal = sigmoid(zCal);

    var blend = 0.65 * st.pXgb + 0.35 * st.pSub;
    var tier = blend >= 0.70 ? '🚨 TIER 3: BLOCK (≥ 70%)' : (blend >= 0.35 ? '⚠️ TIER 2: SANDBOX WARN (35–70%)' : '✅ TIER 1: ALLOW (< 35%)');

    var stats = renderStatGrid([
      { label: 'Second-Cut Check Share', val: fmt(rVal, 4), sub: 'Check=' + nVal.toLocaleString() + ', Train=' + nTrain.toLocaleString() },
      { label: 'Rare-Class Boost Weight', val: fmt(spw, 2) + '×', sub: st.nBenign.toLocaleString() + ' ÷ ' + st.nPhish.toLocaleString() },
      { label: 'Honest Calibrated Chance', val: (pCal * 100).toFixed(1) + '%', sub: 'Adjusted Score = ' + fmtSigned(zCal, 2) },
      { label: '3-Layer Final Score', val: (blend * 100).toFixed(1) + '%', sub: tier, color: blend >= 0.70 ? '#fb7185' : (blend >= 0.35 ? '#fbbf24' : '#34d399') }
    ]);
    var steps = [
      { title: 'Two-Step Balanced Split (Carving Out Exact Check Set)', hl: [], body: 'Final Test takes <code>' + st.testPct + '% = ' + nTest.toLocaleString() + '</code> links, leaving <code>' + pool.toLocaleString() + '</code> in the pool. To carve <code>' + st.valPct + '%</code> of the ORIGINAL dataset for validation, cut the remaining pool at <code>' + fmt(valFrac, 2) + ' ÷ ' + fmt(1 - testFrac, 2) + ' = <strong>' + fmt(rVal, 4) + '</strong></code> → <code>Check = ' + nVal.toLocaleString() + ', Train = ' + nTrain.toLocaleString() + '</code>.' },
      { title: 'Rare-Class Weighting & Restoring Honest Probabilities', hl: [], body: '<code>Rare-Class Weight = ' + st.nBenign + ' ÷ ' + st.nPhish + ' = <strong>' + fmt(spw, 2) + '×</strong></code>. Boosting Phish mistakes shifts raw scores up by <code>+' + fmt(Math.log(spw), 3) + '</code>; subtracting that shift restores honest <code>Calibrated Chance = <strong>' + (pCal * 100).toFixed(2) + '%</strong></code>.' },
      { title: 'Three-Layer Final Decision Blend', hl: [], body: '<code>Final = 0.65(' + st.pXgb + ') + 0.35(' + st.pSub + ') = <strong>' + (blend * 100).toFixed(2) + '%</strong></code> → <strong>' + tier + '</strong>.' }
    ];
    var py = 'import math\ncheck_cut = ' + fmt(valFrac, 2) + ' / (1 - ' + fmt(testFrac, 2) + ')\nrare_weight = ' + st.nBenign + ' / ' + st.nPhish + '\nblend = 0.65 * ' + st.pXgb + ' + 0.35 * ' + st.pSub + '\nprint("Check cut:", round(check_cut, 4), "Rare weight:", round(rare_weight, 2), "Blend:", round(blend, 4))';
    return stats + renderStepCards(steps) + renderPythonBox(py);
  }

  // ============================================================================
  // DISPATCH CALCULATOR INPUTS & OUTPUTS
  // ============================================================================
  var CALC_REGISTRY = {
    ols: { title: 'Best-Fit Line & Signal Reliability Check', inputs: buildOlsInputs, outputs: buildOlsOutputs },
    gd_reg: { title: 'Downhill Error Nudge, Bowl Jump & Weight Penalties', inputs: buildGdInputs, outputs: buildGdOutputs },
    logistic: { title: 'Yes/No Chance Line: Odds, Surprise Penalty & Signal Check', inputs: buildLogisticInputs, outputs: buildLogisticOutputs },
    knn_nb: { title: 'Closest Neighbor Distances & Clue Odds', inputs: buildKnnNbInputs, outputs: buildKnnNbOutputs },
    svm: { title: 'Widest Safety Street & Curb Violations', inputs: buildSvmInputs, outputs: buildSvmOutputs },
    cart_tree: { title: 'Yes-or-No Question Tree: Mix-Up & Purity Gain', inputs: buildCartInputs, outputs: buildCartOutputs },
    xgboost_rf: { title: 'Mistake-Fixing Trees & Voting Forest Held-Out Check', inputs: buildXgbRfInputs, outputs: buildXgbRfOutputs },
    eval_metrics: { title: 'Threat Detection Report: Catch Rate, False Alarms & Ranking', inputs: buildEvalInputs, outputs: buildEvalOutputs },
    unsup_pca: { title: 'Group Tightness, Separation & Column Compression', inputs: buildUnsupInputs, outputs: buildUnsupOutputs },
    nn_backprop: { title: 'Neural Network Blame Passing, Focus & Reward Learning', inputs: buildNnInputs, outputs: buildNnOutputs },
    tfidf_entropy: { title: 'Character Randomness & Rare Letter-Chunk Scoring', inputs: buildTfidfEntropyInputs, outputs: buildTfidfEntropyOutputs },
    lurelock_pipeline: { title: 'LureLock Data Split, Honest Chances & 3-Layer Verdict', inputs: buildLlPipeInputs, outputs: buildLlPipeOutputs }
  };

  // ============================================================================
  // TAB 2: STEP-BY-STEP NUMBERS MOVIE & TAB 3: SAME-DATA SHOWDOWN
  // ============================================================================
  function renderMovieTab() {
    var keys = Object.keys(ALL_MOVIES);
    var mv = ALL_MOVIES[ui.activeMovieKey] || ALL_MOVIES[keys[0]];
    if (ui.movieStep >= mv.steps.length) ui.movieStep = mv.steps.length - 1;
    if (ui.movieStep < 0) ui.movieStep = 0;
    var step = mv.steps[ui.movieStep];

    var sel = '<select class="v82-num-input w-full text-left" style="width:100%;padding:0.42rem 0.6rem;" data-v82-movie-sel="1">' +
      keys.map(function (k) {
        return '<option value="' + esc(k) + '" ' + (k === ui.activeMovieKey ? 'selected' : '') + '>' + esc(ALL_MOVIES[k].title) + '</option>';
      }).join('') + '</select>';

    var pills = '<div class="flex flex-wrap gap-1.5">' +
      mv.steps.map(function (st, idx) {
        return '<button type="button" class="v82-btn-sm ' + (idx === ui.movieStep ? 'is-active' : '') + '" data-v82-mstep="' + idx + '">Frame ' + (idx + 1) + '</button>';
      }).join('') +
      '<button type="button" class="v82-btn-sm" data-v82-mdelta="-1" ' + (ui.movieStep === 0 ? 'disabled' : '') + '>◀ Prev</button>' +
      '<button type="button" class="v82-btn-sm" data-v82-mdelta="1" ' + (ui.movieStep >= mv.steps.length - 1 ? 'disabled' : '') + '>Next ▶</button>' +
    '</div>';

    var colMap = { sky: '#38bdf8', emerald: '#34d399', amber: '#fbbf24', rose: '#fb7185' };
    var bars = (step.bars || []).map(function (b) {
      var pct = Math.max(2, Math.min(100, (b.val / (b.max || 1)) * 100));
      var col = colMap[b.col] || '#38bdf8';
      return '<div class="space-y-1">' +
        '<div class="flex justify-between text-[11px] font-mono"><span>' + esc(b.label) + '</span><strong style="color:' + col + '">' + esc(b.val) + '</strong></div>' +
        '<div class="v82-movie-bar-track"><div class="v82-movie-bar-fill" style="width:' + pct + '%;background:' + col + ';"></div></div>' +
      '</div>';
    }).join('');

    var tbl = '<div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
      mv.headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
      step.rows.map(function (row, ri) {
        var isLatest = ri === step.rows.length - 1;
        return '<tr class="' + (isLatest ? 'bg-emerald-950/25 font-bold' : '') + '">' +
          row.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';

    return '<div class="v82-card v82-card-sky space-y-2.5">' +
        '<div class="text-xs font-bold text-sky-300">🎬 Step-by-Step Numbers Movie (Zero-Jargon Execution Trace)</div>' +
        sel +
        '<div class="text-xs text-amber-300 font-semibold">' + esc(mv.naiveQ || '') + '</div>' +
        pills +
      '</div>' +
      '<div class="v82-card space-y-3">' +
        '<div class="text-sm font-bold text-white">' + esc(step.label) + '</div>' +
        '<div class="text-xs text-slate-200 leading-relaxed">' + esc(step.summary) + '</div>' +
        (bars ? '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">' + bars + '</div>' : '') +
        tbl +
      '</div>';
  }

  function renderShowdownTab() {
    var isPhish = ui.showdownDs === 'phish';
    var rows = isPhish ? [
      ['Yes/No Chance Line (Logistic)', '91.2%', '94.8%', '0.12 s', '🟢 Clue odds multipliers', 'Misses Brand × Domain combinations like "paypal.verify.tk"', 'mod6_odds', 'logistic'],
      ['Independent Clue Counter (Naive Bayes)', '88.5%', '92.1%', '0.02 s', '🟢 Clue counts', 'Gets over-confident when two clues repeat the same warning', 'mod7', 'knn_nb'],
      ['Closest Neighbors (5 Neighbors)', '84.0%', '88.5%', '0.00 s train', '🟡 Nearby examples', 'Gets lost when looking at 1,018 clues at once', 'mod7', 'knn_nb'],
      ['Widest Safety Street (SVM)', '94.1%', '97.2%', '4.80 s', '🟡 Edge guard points', 'Draws a strong border; needs extra calibration for percentages', 'mod8', 'svm'],
      ['Single Yes/No Tree', '92.8%', '95.1%', '0.18 s', '🟢 Flowchart', 'Shifts easily if a few training examples change', 'mod9', 'cart_tree'],
      ['100-Tree Voting Forest', '96.4%', '98.8%', '0.95 s', '🟡 Top clues', 'Cancels single-tree mistakes; misses step-by-step error polishing', 'mod10', 'xgboost_rf'],
      ['🏆 300 Mistake-Fixing Trees (XGBoost)', '98.7%', '99.6%', '0.45 s', '🟢 11 Explainable clues', 'Scores 99.3% by chaining Brand × Domain × Randomness clues!', 'mod10', 'xgboost_rf'],
      ['Layered Neural Network', '96.8%', '98.9%', '3.40 s', '🔴 Hidden weights', 'Needs careful scaling; slower than boosting trees on tables', 'mod14', 'nn_backprop']
    ] : [
      ['Best-Fit Line', '78% Explained', '$42.5k Error', '0.01 s', '🟢 Clear slopes', 'Overfits when noisy or duplicate columns are added', 'mod_bestfit', 'ols'],
      ['Smooth-Shrink Line (Ridge)', '86% Explained', '$29.4k Error', '0.01 s', '🟢 Shrunk slopes', 'Shrinks noisy clues gently; keeps every clue slightly active', 'mod5', 'gd_reg'],
      ['Zero-Out Line (Lasso)', '88% Explained', '$26.1k Error', '0.02 s', '🟢 Clean clue list', 'Snaps useless noisy clues straight to 0.00', 'mod5', 'gd_reg'],
      ['Closest Neighbors (5 Neighbors)', '81% Explained', '$36.0k Error', '0.00 s', '🟡 Nearby examples', 'Cannot predict higher than the priciest training house', 'mod7', 'knn_nb'],
      ['Single Regression Tree', '83% Explained', '$33.8k Error', '0.03 s', '🟢 Step rules', 'Predicts in flat stair-steps; sensitive to single splits', 'mod9', 'cart_tree'],
      ['100-Tree Voting Forest', '93% Explained', '$19.2k Error', '0.40 s', '🟡 Top clues', 'Averages 100 diverse trees for a smooth prediction', 'mod10', 'xgboost_rf'],
      ['🏆 Mistake-Fixing Trees (XGBoost)', '96% Explained', '$14.1k Error', '0.22 s', '🟢 Clue breakdown', 'Captures curved size × location interactions!', 'mod10', 'xgboost_rf'],
      ['Layered Neural Network', '92% Explained', '$20.5k Error', '1.80 s', '🔴 Hidden weights', 'Learns curves well but needs scaling and careful tuning', 'mod14', 'nn_backprop']
    ];

    return '<div class="v82-card v82-card-sky space-y-2.5">' +
      '<div class="text-xs font-bold text-indigo-300">⚖️ Same-Data Cross-Model Showdown (Compare Every Model on Identical Data)</div>' +
      '<div class="flex flex-wrap gap-2">' +
        '<button type="button" class="v82-btn-sm ' + (isPhish ? 'is-active' : '') + '" data-v82-sd="phish">🎣 LureLock Phishing URLs (Yes/No Sorting)</button>' +
        '<button type="button" class="v82-btn-sm ' + (!isPhish ? 'is-active' : '') + '" data-v82-sd="house">🏠 Housing &amp; Scores (Number Prediction)</button>' +
      '</div></div>' +
      '<div class="v82-card"><div class="overflow-x-auto"><table class="v82-calc-table"><thead><tr>' +
        '<th>Model</th><th>' + (isPhish ? 'Balance Score' : 'Score Explained') + '</th><th>' + (isPhish ? 'Ranking Accuracy' : 'Typical Error') + '</th><th>Easy to Read?</th><th>Behavior on Same Data</th><th>Open Calc</th>' +
      '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td class="font-bold text-white">' + esc(r[0]) + '</td><td class="text-emerald-300 font-bold">' + esc(r[1]) + '</td><td class="text-sky-300">' + esc(r[2]) + '</td><td>' + esc(r[4]) + '</td><td class="font-sans">' + esc(r[5]) + '</td>' +
          '<td><button type="button" class="v82-btn-sm is-active" data-v82-jumpcalc="' + esc(r[7]) + '">🧮 Open</button></td></tr>';
      }).join('') +
      '</tbody></table></div></div>';
  }

  // ============================================================================
  // DRAWER SHELL, EVENT DELEGATION & LIVE REACTIVE UPDATES (ZERO FOCUS LOSS)
  // ============================================================================
  function ensureDrawer() {
    var el = document.getElementById('v82-stats-drawer');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'v82-stats-drawer';
    el.className = 'v82-drawer-backdrop';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Model Statistics Calculation Lab');
    el.innerHTML =
      '<div class="v82-drawer-panel">' +
        '<div class="v82-drawer-header">' +
          '<div>' +
            '<div class="text-[11px] font-bold uppercase tracking-wider text-amber-400">🧮 Model Statistics Calculation Lab &amp; Numbers Studio</div>' +
            '<div id="v82-drawer-subtitle" class="text-sm font-extrabold text-white">Interactive Step-by-Step Model Arithmetic</div>' +
          '</div>' +
          '<button type="button" class="v82-close-btn" data-v82-close="1">✕ Close</button>' +
        '</div>' +
        '<div class="v82-drawer-tabs">' +
          '<button type="button" class="v82-dtab" data-v82-dtab="calc">🧮 Calculate Model Stats</button>' +
          '<button type="button" class="v82-dtab" data-v82-dtab="movie">🎬 Step-by-Step Numbers</button>' +
          '<button type="button" class="v82-dtab" data-v82-dtab="showdown">⚖️ Same-Data Showdown</button>' +
        '</div>' +
        '<div id="v82-drawer-body" class="v82-drawer-body"></div>' +
      '</div>';

    document.body.appendChild(el);

    el.addEventListener('click', function (e) {
      if (e.target === el || e.target.closest('[data-v82-close]')) {
        closeDrawer();
        return;
      }
      var dtab = e.target.closest('[data-v82-dtab]');
      if (dtab) {
        ui.activeTab = dtab.getAttribute('data-v82-dtab');
        renderDrawer();
        return;
      }
      var subBtn = e.target.closest('[data-v82-sub]');
      if (subBtn) {
        var parts = subBtn.getAttribute('data-v82-sub').split(':');
        ui.subMode[parts[0]] = parts[1];
        ui.hlKey = null;
        renderDrawer();
        return;
      }
      var presetBtn = e.target.closest('[data-v82-preset]');
      if (presetBtn) {
        applyPreset(presetBtn.getAttribute('data-v82-preset'));
        renderDrawer();
        return;
      }
      var actBtn = e.target.closest('[data-v82-action]');
      if (actBtn) {
        applyAction(actBtn.getAttribute('data-v82-action'));
        renderDrawer();
        return;
      }
      var oobBtn = e.target.closest('[data-v82-rfoob]');
      if (oobBtn) {
        var rc = oobBtn.getAttribute('data-v82-rfoob').split(':');
        var r = parseInt(rc[0], 10), c = parseInt(rc[1], 10);
        var cur = data.rf.oob[r][c];
        data.rf.oob[r][c] = cur === 1 ? 0 : (cur === 0 ? -1 : 1);
        renderDrawer();
        return;
      }
      var hlBtn = e.target.closest('[data-v82-hl]');
      if (hlBtn) {
        var k = hlBtn.getAttribute('data-v82-hl');
        ui.hlKey = (ui.hlKey === k) ? null : k;
        applyHighlight();
        return;
      }
      var csBtn = e.target.closest('[data-v82-cstep]');
      if (csBtn) {
        ui.calcStep += parseInt(csBtn.getAttribute('data-v82-cstep'), 10);
        if (ui.calcStep < 0) ui.calcStep = 0;
        renderOutputsOnly();
        return;
      }
      var gotoBtn = e.target.closest('[data-v82-goto-cstep]');
      if (gotoBtn) {
        ui.calcStep = parseInt(gotoBtn.getAttribute('data-v82-goto-cstep'), 10);
        renderOutputsOnly();
        return;
      }
      if (e.target.closest('[data-v82-toggle-csteps]')) {
        ui.showAllCalcSteps = !ui.showAllCalcSteps;
        renderOutputsOnly();
        return;
      }
      if (e.target.closest('[data-v82-copy-py]')) {
        var pre = document.getElementById('v82-py-snippet-pre');
        var btn = e.target.closest('[data-v82-copy-py]');
        if (pre && global.navigator && global.navigator.clipboard) {
          global.navigator.clipboard.writeText(pre.textContent).then(function () {
            btn.textContent = '✓ Copied!';
            setTimeout(function () { btn.textContent = '📋 Copy Python'; }, 1400);
          }).catch(function () {});
        }
        return;
      }
      var msBtn = e.target.closest('[data-v82-mstep]');
      if (msBtn) {
        ui.movieStep = parseInt(msBtn.getAttribute('data-v82-mstep'), 10);
        renderDrawer();
        return;
      }
      var mdBtn = e.target.closest('[data-v82-mdelta]');
      if (mdBtn) {
        ui.movieStep += parseInt(mdBtn.getAttribute('data-v82-mdelta'), 10);
        renderDrawer();
        return;
      }
      var sdBtn = e.target.closest('[data-v82-sd]');
      if (sdBtn) {
        ui.showdownDs = sdBtn.getAttribute('data-v82-sd');
        renderDrawer();
        return;
      }
      var jcBtn = e.target.closest('[data-v82-jumpcalc]');
      if (jcBtn) {
        ui.activeCalcId = jcBtn.getAttribute('data-v82-jumpcalc');
        ui.activeTab = 'calc';
        ui.hlKey = null;
        renderDrawer();
        return;
      }
    });

    el.addEventListener('mouseover', function (e) {
      var hlBtn = e.target.closest('[data-v82-hl]');
      if (hlBtn) {
        applyHighlight(hlBtn.getAttribute('data-v82-hl'));
      }
    });

    el.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest('[data-v82-hl]')) {
        applyHighlight(ui.hlKey);
      }
    });

    el.addEventListener('change', handleDrawerInput);
    el.addEventListener('input', handleDrawerInput);

    global.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ui.isOpen) closeDrawer();
    });

    return el;
  }

  function handleDrawerInput(e) {
    var target = e.target;
    if (!target) return;
    if (target.matches('[data-v82-calc-sel]')) {
      ui.activeCalcId = target.value;
      ui.hlKey = null;
      ui.calcStep = 0;
      renderDrawer();
      return;
    }
    if (target.matches('[data-v82-movie-sel]')) {
      ui.activeMovieKey = target.value;
      ui.movieStep = 0;
      renderDrawer();
      return;
    }
    var editPath = target.getAttribute('data-v82-edit');
    if (!editPath) return;

    var val = target.type === 'text' ? target.value : parseFloat(target.value);
    if (target.type !== 'text' && (isNaN(val) || !isFinite(val))) {
      // Allow select strings like 'L'/'R', 'A'/'B', 'relu'
      if (target.tagName === 'SELECT') val = target.value;
      else return;
    }
    if (target.tagName === 'SELECT' && (target.value === '0' || target.value === '1' || target.value === '-1' || target.value === '3' || target.value === '5')) {
      val = parseInt(target.value, 10);
    }

    var parts = editPath.split('.');
    var ref = data;
    for (var i = 0; i < parts.length - 1; i++) {
      ref = ref[parts[i]];
      if (!ref) return;
    }
    ref[parts[parts.length - 1]] = val;
    renderOutputsOnly();
  }

  function applyHighlight(tempKey) {
    var key = typeof tempKey === 'string' ? tempKey : ui.hlKey;
    var box = document.getElementById('v82-calc-outputs');
    if (!box) return;
    box.querySelectorAll('[data-col]').forEach(function (cell) {
      cell.classList.toggle('v82-col-hl', Boolean(key && cell.getAttribute('data-col') === key));
    });
    box.querySelectorAll('[data-v82-hl]').forEach(function (chip) {
      chip.classList.toggle('is-hl', Boolean(key && chip.getAttribute('data-v82-hl') === key));
    });
    box.querySelectorAll('[data-hl-step]').forEach(function (st) {
      var list = (st.getAttribute('data-hl-step') || '').split(' ');
      st.classList.toggle('is-hl', Boolean(key && list.indexOf(key) !== -1));
    });
  }

  function applyPreset(spec) {
    var parts = spec.split(':');
    var k = parts[0], p = parts[1];
    if (k === 'ols') {
      if (p === 'default') data.ols = cloneDefaults('ols');
      else if (p === 'perfect') data.ols = [{ x1: 1, x2: 0, y: 50 }, { x1: 2, x2: 1, y: 60 }, { x1: 3, x2: 2, y: 70 }, { x1: 4, x2: 3, y: 80 }, { x1: 5, x2: 4, y: 90 }];
      else if (p === 'outlier') data.ols = [{ x1: 1, x2: 0, y: 50 }, { x1: 2, x2: 1, y: 62 }, { x1: 3, x2: 1, y: 40 }, { x1: 4, x2: 2, y: 82 }, { x1: 5, x2: 3, y: 92 }];
      else if (p === 'noise') data.ols = [{ x1: 1, x2: 2, y: 72 }, { x1: 2, x2: 0, y: 65 }, { x1: 3, x2: 3, y: 70 }, { x1: 4, x2: 1, y: 68 }, { x1: 5, x2: 2, y: 71 }];
    } else if (k === 'gd') {
      data.gd = cloneDefaults('gd');
    } else if (k === 'logistic') {
      if (p === 'default') data.logistic = cloneDefaults('logistic');
      else data.logistic = { b0: -2.0, b1: 1.3, rows: [{ x: 0.2, y: 0 }, { x: 0.8, y: 0 }, { x: 2.1, y: 1 }, { x: 3.4, y: 1 }, { x: 4.5, y: 1 }] };
    } else if (k === 'svm') {
      if (p === 'default') data.svm = cloneDefaults('svm');
      else data.svm = { w1: 0.8, w2: 0.6, b: -3.0, C: 1.0, rows: [{ x1: 1, x2: 1, y: -1 }, { x1: 2.5, x2: 2.0, y: -1 }, { x1: 3, x2: 2.5, y: 1 }, { x1: 4, x2: 3, y: 1 }] };
    } else if (k === 'cart') {
      data.cart = cloneDefaults('cart');
    } else if (k === 'xgb') {
      data.xgb = cloneDefaults('xgb');
    } else if (k === 'eval') {
      if (p === 'default') data.eval = cloneDefaults('eval');
      else data.eval = { tau: 0.50, rows: [{ name: 'URL #1', y: 1, p: 0.96 }, { name: 'URL #2', y: 1, p: 0.88 }, { name: 'URL #3', y: 1, p: 0.72 }, { name: 'URL #4', y: 0, p: 0.31 }, { name: 'URL #5', y: 0, p: 0.14 }, { name: 'URL #6', y: 0, p: 0.05 }] };
    } else if (k === 'kmeans') {
      data.kmeans = cloneDefaults('kmeans');
    } else if (k === 'pca') {
      if (p === 'default') data.pca = cloneDefaults('pca');
      else data.pca = { rows: [{ x1: 1, x2: 5 }, { x1: 2, x2: 2 }, { x1: 3, x2: 6 }, { x1: 4, x2: 3 }] };
    } else if (k === 'mlp') {
      data.mlp = cloneDefaults('mlp');
    } else if (k === 'entropy') {
      if (p === 'phish') data.entropy = { domain: 'paypa1-secure.tk', path: '8f3k9q2m' };
      else if (p === 'safe') data.entropy = { domain: 'google.com', path: 'search' };
      else data.entropy = { domain: 'x8k9q2m1v7p4.xyz', path: 'a9c4e1b7' };
    }
  }

  function applyAction(act) {
    if (act === 'gd:step') {
      var g = computeGdStats();
      data.gd.w = Number(g.nextW.toFixed(4));
      data.gd.b = Number(g.nextB.toFixed(4));
    } else if (act === 'gd:newton') {
      var g2 = computeGdStats();
      data.gd.w = Number(g2.newtonW.toFixed(4));
    } else if (act === 'logistic:irls') {
      var l = computeLogisticStats();
      if (l.sol) {
        data.logistic.b0 = Number((data.logistic.b0 - l.sol.x[0]).toFixed(4));
        data.logistic.b1 = Number((data.logistic.b1 - l.sol.x[1]).toFixed(4));
      }
    } else if (act === 'knn:toggleZ') {
      data.knn.scaleZ = !data.knn.scaleZ;
    } else if (act === 'nb:tog1') {
      data.nb.hasC1 = !data.nb.hasC1;
    } else if (act === 'nb:tog2') {
      data.nb.hasC2 = !data.nb.hasC2;
    } else if (act === 'cart:best') {
      data.cart.theta = findBestCartSplit().theta;
    } else if (act === 'xgb:step') {
      var x = computeXgbStats();
      data.xgb.rows.forEach(function (r) {
        var wLeaf = r.side === 'L' ? x.wL : x.wR;
        r.p = Number(sigmoid(logit(r.p) + data.xgb.eta * wLeaf).toFixed(4));
      });
    } else if (act === 'kmeans:lloyd') {
      var rows = data.kmeans.rows;
      var sA = [0, 0, 0], sB = [0, 0, 0];
      rows.forEach(function (r) {
        if (r.c === 'A') { sA[0] += r.x1; sA[1] += r.x2; sA[2]++; }
        else { sB[0] += r.x1; sB[1] += r.x2; sB[2]++; }
      });
      var mA = sA[2] ? [sA[0] / sA[2], sA[1] / sA[2]] : [0, 0];
      var mB = sB[2] ? [sB[0] / sB[2], sB[1] / sB[2]] : [0, 0];
      rows.forEach(function (r) {
        var dA = Math.pow(r.x1 - mA[0], 2) + Math.pow(r.x2 - mA[1], 2);
        var dB = Math.pow(r.x1 - mB[0], 2) + Math.pow(r.x2 - mB[1], 2);
        r.c = dA <= dB ? 'A' : 'B';
      });
    } else if (act === 'mlp:step') {
      var m = computeMlpStats();
      data.mlp.w1 = Number(m.nw1.toFixed(4));
      data.mlp.b1 = Number(m.nb1.toFixed(4));
      data.mlp.w2 = Number(m.nw2.toFixed(4));
    }
  }

  function renderOutputsOnly() {
    var outEl = document.getElementById('v82-calc-outputs');
    if (!outEl) return;
    var spec = CALC_REGISTRY[ui.activeCalcId] || CALC_REGISTRY.ols;
    outEl.innerHTML = spec.outputs();
    applyHighlight();
  }

  function renderDrawer() {
    var el = ensureDrawer();
    el.querySelectorAll('[data-v82-dtab]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-v82-dtab') === ui.activeTab);
    });
    var body = document.getElementById('v82-drawer-body');
    var subEl = document.getElementById('v82-drawer-subtitle');
    if (!body) return;

    if (ui.activeTab === 'calc') {
      var spec = CALC_REGISTRY[ui.activeCalcId] || CALC_REGISTRY.ols;
      if (subEl) subEl.textContent = spec.title;
      var sel =
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<label class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Training Model Calculator:</label>' +
          '<select data-v82-calc-sel="1" class="v82-num-input flex-1 text-left" style="width:auto;min-width:230px;padding:0.38rem 0.6rem;">' +
            CALCULATOR_CATALOG.map(function (c) {
              return '<option value="' + esc(c.id) + '" ' + (c.id === ui.activeCalcId ? 'selected' : '') + '>' + esc(c.name) + '</option>';
            }).join('') +
          '</select>' +
        '</div>';
      body.innerHTML = sel + '<div id="v82-calc-inputs">' + spec.inputs() + '</div><div id="v82-calc-outputs" class="space-y-3">' + spec.outputs() + '</div>';
      applyHighlight();
    } else if (ui.activeTab === 'movie') {
      if (subEl) subEl.textContent = 'Step-by-Step Numerical Execution Movie';
      body.innerHTML = renderMovieTab();
    } else {
      if (subEl) subEl.textContent = 'Same-Data Cross-Model Showdown';
      body.innerHTML = renderShowdownTab();
    }
  }

  function syncFromActiveModule() {
    var acad = detectAcad();
    var modId = getActiveModId();
    var map = (acad === 'll' ? LL_LAB_MAP : ML_LAB_MAP)[modId] || { calc: 'ols', movie: 'linear_regression' };
    ui.activeCalcId = map.calc;
    if (map.sub) ui.subMode[map.calc] = map.sub;
    if (map.movie && ALL_MOVIES[map.movie]) ui.activeMovieKey = map.movie;
    ui.hlKey = null;
    ui.calcStep = 0;
    ui.movieStep = 0;
    ui.showdownDs = acad === 'll' ? 'phish' : ((modId === 'mod0' || modId === 'mod_bestfit' || modId === 'mod5') ? 'house' : 'phish');
  }

  function openForCurrentModule(tab) {
    syncFromActiveModule();
    if (tab === 'calc' || tab === 'movie' || tab === 'showdown') ui.activeTab = tab;
    var el = ensureDrawer();
    ui.isOpen = true;
    el.classList.add('is-open');
    renderDrawer();
  }

  function openCalculator(calcId, subMode) {
    if (calcId && CALC_REGISTRY[calcId]) ui.activeCalcId = calcId;
    if (subMode) ui.subMode[ui.activeCalcId] = subMode;
    ui.activeTab = 'calc';
    ui.hlKey = null;
    var el = ensureDrawer();
    ui.isOpen = true;
    el.classList.add('is-open');
    renderDrawer();
  }

  function closeDrawer() {
    var el = document.getElementById('v82-stats-drawer');
    if (el) el.classList.remove('is-open');
    ui.isOpen = false;
  }

  function onModuleSync() {
    if (!ui.isOpen) return;
    syncFromActiveModule();
    renderDrawer();
  }

  function getModuleQuickSpec(modId, acad) {
    var map = ((acad || detectAcad()) === 'll' ? LL_LAB_MAP : ML_LAB_MAP)[modId] || { calc: 'ols', label: 'Model Statistics' };
    return map;
  }

  // Compact Part 5 "Verify Hand Math in Python" snippet matched to module
  var MODULE_PY_SNIPPETS = {
    ols: 'import numpy as np\nfrom scipy import stats\nhours = np.array([1, 2, 3, 4, 5], float); score = np.array([50, 62, 68, 82, 92], float)\nres = stats.linregress(hours, score)\nprint(f"slope={res.slope:.3f}, base={res.intercept:.3f}, explained={res.rvalue**2:.4f}, luck_chance={res.pvalue:.5f}")',
    gd_reg: 'import numpy as np\nhours = np.array([1, 2, 3, 4], float); score = np.array([50, 60, 70, 80], float)\nweight, base, step_size, shrink_pen = 2.0, 20.0, 0.04, 0.5\nerr = (weight*hours + base) - score\nnudge_weight = np.mean(2*err*hours) + 2*shrink_pen*weight\nprint("total_error:", round(np.mean(err**2) + shrink_pen*weight**2, 3), "next_weight:", round(weight - step_size*nudge_weight, 3))',
    logistic: 'import numpy as np\nfrom sklearn.metrics import log_loss\nclues = np.array([1, 2, 3, 4, 5]); truth = np.array([0, 0, 1, 1, 1])\nchance = 1 / (1 + np.exp(-(-3.2 + 1.1*clues)))\nmodel_pen = 2*len(truth)*log_loss(truth, chance); base_pen = 2*len(truth)*log_loss(truth, np.full_like(chance, truth.mean()))\nprint("Penalty Reduced %:", round((1 - model_pen/base_pen)*100, 1))',
    knn_nb: 'from sklearn.neighbors import KNeighborsClassifier\nclues = [[4, 4.0], [5, 4.3], [3, 3.9], [1, 2.2], [1, 2.0]]; labels = [1, 1, 0, 0, 0]\nprint("3 closest neighbors chance:", KNeighborsClassifier(n_neighbors=3).fit(clues, labels).predict_proba([[4.0, 4.2]]))',
    svm: 'import numpy as np\nweights = np.array([0.8, 0.6]); offset = -3.0\nclues = np.array([[1,1], [2,1.5], [3,2.5], [4,3]]); group = np.array([-1, -1, 1, 1])\nviolations = np.maximum(0, 1 - group*(clues@weights + offset))\nprint("Street width:", round(2/np.linalg.norm(weights), 3), "Total violations:", round(violations.sum(), 3))',
    cart_tree: 'from sklearn.tree import DecisionTreeClassifier\nclues = [[2.65], [2.80], [3.10], [3.85], [4.10], [4.35]]; labels = [0, 0, 0, 1, 1, 1]\ntree = DecisionTreeClassifier(max_depth=1, criterion="gini").fit(clues, labels)\nprint("Best cutoff:", tree.tree_.threshold[0], "Bucket mix-ups:", tree.tree_.impurity.round(4))',
    xgboost_rf: 'import numpy as np\ntruth = np.array([0, 0, 1, 1, 1]); chance = np.full(5, 0.50); cushion = 1.0\ngap = chance - truth; brake = chance * (1 - chance); left = truth == 0\nbucket_score = lambda m: (gap[m].sum()**2) / (brake[m].sum() + cushion)\nprint("Split Gain:", round(0.5*(bucket_score(left) + bucket_score(~left) - bucket_score(np.ones(5, bool))), 4), "Right Leaf:", round(-gap[~left].sum()/(brake[~left].sum()+cushion), 4))',
    eval_metrics: 'from sklearn.metrics import f1_score, matthews_corrcoef, brier_score_loss, roc_auc_score\ntruth = [1, 1, 1, 0, 0, 0]; chance = [0.94, 0.81, 0.44, 0.62, 0.24, 0.08]; flagged = [int(v >= 0.5) for v in chance]\nprint("Balance Score:", round(f1_score(truth, flagged), 4), "Overall Score:", round(matthews_corrcoef(truth, flagged), 4), "Ranking:", round(roc_auc_score(truth, chance), 4))',
    unsup_pca: 'import numpy as np\nfrom sklearn.decomposition import PCA\nhouses = np.array([[1, 3.0], [2, 6.2], [3, 8.8], [4, 12.0]])\npca = PCA().fit(houses)\nprint("Axis spreads:", pca.explained_variance_.round(3), "Info kept:", pca.explained_variance_ratio_.round(4))',
    nn_backprop: 'inp, target, w1, b1, w2, step = 1.5, 4.0, 1.2, 0.2, 1.5, 0.1\nhid_raw = w1*inp + b1; gate_out = max(0, hid_raw); guess = w2*gate_out\nmiss = guess - target; hid_blame = miss*w2*(1 if hid_raw > 0 else 0)\nprint("Error:", round(0.5*miss**2, 4), "Layer1 Blame:", round(hid_blame*inp, 4), "Out Blame:", round(miss*gate_out, 4))',
    tfidf_entropy: 'import math\nfrom collections import Counter\nhost = "paypa1-secure.tk"\nrandomness = -sum((c/len(host))*math.log2(c/len(host)) for c in Counter(host).values())\nprint("Character Randomness:", round(randomness, 4), "bits/char")',
    lurelock_pipeline: 'safe_count, phish_count = 160000, 20000\ncheck_cut = 0.10 / (1 - 0.20)\nblend = 0.65 * 0.86 + 0.35 * 0.72\nprint("Check cut:", check_cut, "Rare weight:", safe_count/phish_count, "3-layer score:", round(blend, 4))'
  };

  function getVerifyBlockHtml(modId, acad) {
    var spec = getModuleQuickSpec(modId, acad);
    var code = MODULE_PY_SNIPPETS[spec.calc] || MODULE_PY_SNIPPETS.ols;
    return '<details class="rounded-xl p-3.5 bg-emerald-950/20 border border-emerald-500/35 space-y-2.5">' +
      '<summary class="cursor-pointer flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-emerald-300">' +
        '<span>🧪 Verify Hand-Calculated Stats in Python (' + esc(spec.label) + ')</span>' +
        '<span class="text-[11px] font-mono text-amber-300">Matches Interactive Calculator 🧮</span>' +
      '</summary>' +
      '<div class="space-y-2 pt-1">' +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<span class="text-[11px] text-slate-300">Run or compare these exact numbers inside the live calculator drawer:</span>' +
          '<button type="button" onclick="window.AcademyStatsLab.openCalculator(\'' + esc(spec.calc) + '\'' + (spec.sub ? (', \'' + esc(spec.sub) + '\'') : '') + ')" class="v82-lab-trigger">🧮 Open ' + esc(spec.label) + ' Lab</button>' +
        '</div>' +
        '<pre class="p-3 rounded-lg bg-[#020617] border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">' + esc(code) + '</pre>' +
      '</div>' +
    '</details>';
  }

  global.AcademyStatsLab = {
    version: '8.2',
    openForCurrentModule: openForCurrentModule,
    openCalculator: openCalculator,
    close: closeDrawer,
    onModuleSync: onModuleSync,
    getModuleQuickSpec: getModuleQuickSpec,
    getVerifyBlockHtml: getVerifyBlockHtml
  };
})(window);

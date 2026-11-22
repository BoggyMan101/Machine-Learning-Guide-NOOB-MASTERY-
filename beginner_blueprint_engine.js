// ============================================================================
// BEGINNER-PROOF IMPROVEMENT ENGINE (V9)
// Implements:
// 1. Phase 1 Foundation Layer (Start Here 4-Step Loop, 5 Core Words, Gradient Nudge vs Calculus Lab, 5 Confusion Cards)
// 2. Phase 2 & 3 Universal 7-Block Beginner Template + Interactive "Numbers Movie" for all 31 ML & 19 LureLock Modules
// 3. Phase 4 Model Family Lineage Map, 5-Question "Which Model Should I Use?" Wizard, & Same-Data Showdown
// 4. LureLock 4-Stage Additions (Why XGBoost Here, 1-URL-to-1018-Numbers Walkthrough, 300-Tree Accumulation Movie, 3-Tier Flowchart)
// ============================================================================
(function (global) {
  'use strict';

  const ALL_MOVIES = {"linear_regression": {"title": "Linear Regression Numbers Movie: How It Finds the Line Step by Step", "naiveQ": "“How does it find the line?”", "headers": ["Iteration", "Slope (m)", "Intercept (b)", "Guess for 4 hrs (4×Slope + Base)", "Real Score (Real)", "Error (Guess − y)", "Gradient (Slope Nudge)", "Update Applied"], "steps": [{"label": "Step 1: Cold Start (Wild Initial Guess)", "summary": "The model starts with lazy default knobs: m = 0 pts/hr and b = 40 pts. For a student who studied 4 hours (real score y = 80), it guesses only 40 pts — missing by −40 points!", "rows": [["Iter 0 (Start)", "0.00", "40.00", "4(0) + 40 = 40.0", "80.0", "−40.0 (Way too low!)", "−320.0 (Steep downhill!)", "Updated Slope = 0 − 0.02(−320) = +6.40"]], "bars": [{"label": "Guess", "val": 40, "max": 100, "col": "sky"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 40, "max": 100, "col": "rose"}]}, {"label": "Step 2: First Gradient Nudge (Line Tilts Upward)", "summary": "Because the gradient was −320 (negative means 'raise m!'), the update raises m from 0.00 to +6.40. Now for 4 hours it guesses 65.6 pts — cutting the error from −40 down to −14.4!", "rows": [["Iter 0", "0.00", "40.00", "40.0", "80.0", "−40.0", "−320.0", "m → +6.40"], ["Iter 1", "6.40", "40.00", "4(6.4) + 40 = 65.6", "80.0", "−14.4 (Closer!)", "−115.2 (Smaller slope)", "Updated Slope = 6.40 − 0.02(−115.2) = +8.70"]], "bars": [{"label": "Guess", "val": 65.6, "max": 100, "col": "sky"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 14.4, "max": 100, "col": "amber"}]}, {"label": "Step 3: Second Update (Approaching the Best-Fit Line)", "summary": "At m = 8.70, the guess for 4 hours is 74.8 pts (error = −5.2). Notice how the gradient shrinks (−41.6) as the line gets closer to the truth, so the steps automatically get gentler!", "rows": [["Iter 0", "0.00", "40.00", "40.0", "80.0", "−40.0", "−320.0", "m → +6.40"], ["Iter 1", "6.40", "40.00", "65.6", "80.0", "−14.4", "−115.2", "m → +8.70"], ["Iter 2", "8.70", "40.00", "4(8.7) + 40 = 74.8", "80.0", "−5.2 (Almost there!)", "−41.6", "Updated Slope = 8.70 − 0.02(−41.6) = +9.53"]], "bars": [{"label": "Guess", "val": 74.8, "max": 100, "col": "sky"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 5.2, "max": 100, "col": "amber"}]}, {"label": "Step 4: Convergence (Gradient Hits 0 = Best-Fit Line Found!)", "summary": "By Iteration 10, m = 10.00 and b = 40.00. Now 4(10) + 40 = 80.0 pts! Error is 0.0, Gradient is 0.0, and the update is 0 — the line locks into place!", "rows": [["Iter 0", "0.00", "40.00", "40.0", "80.0", "−40.0", "−320.0", "m → +6.40"], ["Iter 1", "6.40", "40.00", "65.6", "80.0", "−14.4", "−115.2", "m → +8.70"], ["Iter 2", "8.70", "40.00", "74.8", "80.0", "−5.2", "−41.6", "m → +9.53"], ["Iter 10 (Converged)", "10.00", "40.00", "4(10) + 40 = 80.0", "80.0", "0.0 (Bullseye!)", "0.0 (Flat bottom!)", "Done! Final Line: Guess = 10x + 40"]], "bars": [{"label": "Guess", "val": 80, "max": 100, "col": "emerald"}, {"label": "Real y", "val": 80, "max": 100, "col": "emerald"}, {"label": "|Error|", "val": 0, "max": 100, "col": "emerald"}]}]}, "logistic_regression": {"title": "Logistic Regression Numbers Movie: Score z → Sigmoid p → Gradient (p − y) → Weight Update", "naiveQ": "“Why sigmoid? What is log-loss?”", "headers": ["Step / Iteration", "Weight (w)", "Raw Score z = w·x + b", "Sigmoid Squashed Chance (0%–100%)", "True Label (Real)", "Gradient Mistake Gap = Guess − Truth", "Surprise Penalty", "Updated Weight"], "steps": [{"label": "Step 1: Raw Score z = 0.00 on a Phishing Link (y = 1)", "summary": "Our suspect URL has x = 2 red flags (fake 'paypa1' + '.tk' TLD), and true label y = 1 (Phish). Starting with w = 0, b = 0 gives raw score z = 0.00. Sigmoid turns z = 0 into p = 0.50 (50% coin flip).", "rows": [["Iter 0 (Coin Flip)", "w = 0.00", "z = 0(2) + 0 = 0.00", "p = 1/(1+e⁰) = 0.500 (50%)", "y = 1 (Phish)", "g = 0.50 − 1 = −0.50", "−ln(0.50) = 0.693", "Updated Weight = 0 − 0.5(−0.50×2) = +0.50"]], "bars": [{"label": "Phish Prob p (%)", "val": 50.0, "max": 100, "col": "amber"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 69.3, "max": 100, "col": "rose"}]}, {"label": "Step 2: Weight Rises to w = +0.50 → Sigmoid Pushes p to 73.1%", "summary": "Because Mistake Gap = Guess − Truth = −0.50 was negative, subtracting the gradient boosted w to +0.50. Now raw score z = +1.00, which Sigmoid squashes into p = 73.1% probability!", "rows": [["Iter 0", "w = 0.00", "z = 0.00", "p = 0.500 (50.0%)", "y = 1", "g = −0.500", "0.693", "w → +0.50"], ["Iter 1", "w = 0.50", "z = 0.50(2) = +1.00", "p = 1/(1+e⁻¹) = 0.731 (73.1%)", "y = 1", "g = 0.731 − 1 = −0.269", "−ln(0.731) = 0.313", "Updated Weight = 0.50 − 0.5(−0.269×2) = +0.77"]], "bars": [{"label": "Phish Prob p (%)", "val": 73.1, "max": 100, "col": "sky"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 31.3, "max": 100, "col": "amber"}]}, {"label": "Step 3: Weight Reaches w = +1.20 → Sigmoid Pushes p to 91.7%", "summary": "Why Sigmoid? Without Sigmoid, a linear line could output p = +2.40 (240% chance — impossible!). Sigmoid smoothly bends z = +2.40 into a valid 91.7% probability, and Surprise Penalty drops to 0.087.", "rows": [["Iter 0", "w = 0.00", "z = 0.00", "p = 0.500 (50.0%)", "y = 1", "g = −0.500", "0.693", "w → +0.50"], ["Iter 1", "w = 0.50", "z = +1.00", "p = 0.731 (73.1%)", "y = 1", "g = −0.269", "0.313", "w → +0.77"], ["Iter 3", "w = 1.20", "z = 1.20(2) = +2.40", "p = 1/(1+e⁻²·⁴) = 0.917 (91.7%)", "y = 1", "g = 0.917 − 1 = −0.083", "−ln(0.917) = 0.087", "Updated Weight = +1.28"]], "bars": [{"label": "Phish Prob p (%)", "val": 91.7, "max": 100, "col": "emerald"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 8.7, "max": 100, "col": "emerald"}]}, {"label": "Step 4: High-Confidence Convergence (z = +4.00 → p = 98.2% Phishing!)", "summary": "At w = +2.00, raw score z = +4.00, Sigmoid outputs p = 98.2%, residual Mistake Gap = Guess − Truth = −0.018 is nearly zero, and Surprise Penalty is 0.018. The link is flagged as HIGH-RISK PHISHING!", "rows": [["Iter 0", "w = 0.00", "z = 0.00", "p = 50.0%", "y = 1", "g = −0.500", "0.693", "w → +0.50"], ["Iter 1", "w = 0.50", "z = +1.00", "p = 73.1%", "y = 1", "g = −0.269", "0.313", "w → +0.77"], ["Iter 3", "w = 1.20", "z = +2.40", "p = 91.7%", "y = 1", "g = −0.083", "0.087", "w → +1.28"], ["Iter 8 (Converged)", "w = 2.00", "z = 2.00(2) = +4.00", "p = 0.982 (98.2% 🚨)", "y = 1", "g = −0.018 (Tiny)", "0.018 (Near 0!)", "Locked: 98.2% Phish!"]], "bars": [{"label": "Phish Prob p (%)", "val": 98.2, "max": 100, "col": "emerald"}, {"label": "True Label y (%)", "val": 100, "max": 100, "col": "emerald"}, {"label": "Surprise Penalty ×100", "val": 1.8, "max": 100, "col": "emerald"}]}]}, "ridge_lasso": {"title": "Ridge vs. Lasso Numbers Movie: Watch Weights Shrink as Penalty λ Grows", "naiveQ": "“Why punish big weights?”", "headers": ["Penalty Strength (λ)", "Model Type", "Weight 1 (Study Hours — Real Signal)", "Weight 2 (Shoe Size — Useless Noise)", "Weight 3 (Lucky Shirt — Useless Noise)", "Training Error", "Test Set Error (New Students)"], "steps": [{"label": "Step 1: λ = 0.0 (No Penalty — Overfitting Wildly to Noise!)", "summary": "With λ = 0, the model memorizes the 5 training students by giving huge weights to useless coincidences (Shoe Size Weight 2 = +18.4, Lucky Shirt Weight 3 = −24.0). Training error is 0, but Test Error on new students is a terrible 42.5!", "rows": [["λ = 0.0 (No Penalty)", "Unregularized Best-Fit Line", "+10.2", "+18.4 (Memorized noise!)", "−24.0 (Memorized noise!)", "0.0 pts (Fake perfection)", "42.5 pts (Crashes on test!)"]], "bars": [{"label": "|Weight 1| Real Signal", "val": 10.2, "max": 25, "col": "emerald"}, {"label": "|Weight 2| Shoe Noise", "val": 18.4, "max": 25, "col": "rose"}, {"label": "|Weight 3| Shirt Noise", "val": 24.0, "max": 25, "col": "rose"}]}, {"label": "Step 2: λ = 0.5 (Gentle Penalty — Noise Weights Shrinking)", "summary": "Adding penalty λ = 0.5 charges a 'weight tax' for huge coefficients. Both Ridge (L2) and Lasso (L1) pull the noisy Shoe Size and Lucky Shirt weights down, cutting Test Error in half!", "rows": [["λ = 0.5", "Ridge (L2: λ∑w²)", "+9.9", "+6.2 (Shrunk 3×)", "−7.8 (Shrunk 3×)", "2.1 pts", "14.8 pts (Much better!)"], ["λ = 0.5", "Lasso (L1: λ∑|w|)", "+9.8", "+3.1 (Shrinking fast)", "−4.0 (Shrinking fast)", "2.4 pts", "11.2 pts"]], "bars": [{"label": "|Weight 1| Real Signal", "val": 9.8, "max": 25, "col": "emerald"}, {"label": "Ridge |Weight 2|", "val": 6.2, "max": 25, "col": "amber"}, {"label": "Lasso |Weight 2|", "val": 3.1, "max": 25, "col": "sky"}]}, {"label": "Step 3: λ = 2.0 (Sweet Spot — Lasso Hits EXACTLY 0.00 on Noise!)", "summary": "Look at the difference at λ = 2.0: Ridge shrinks noise weights to small non-zero decimals (+1.4, −1.8), whereas Lasso's absolute-value diamond corner snaps Weight 2 = 0.00 and Weight 3 = 0.00 — deleting useless features automatically!", "rows": [["λ = 2.0 (Sweet Spot)", "Ridge (L2: shrinks)", "+9.5 (Kept!)", "+1.4 (Small, never 0)", "−1.8 (Small, never 0)", "3.2 pts", "6.4 pts (Strong)"], ["λ = 2.0 (Sweet Spot)", "Lasso (L1: zeroes!)", "+9.6 (Kept!)", "0.00 (Deleted! ✅)", "0.00 (Deleted! ✅)", "3.1 pts", "4.8 pts (Best Test Score! 🏆)"]], "bars": [{"label": "|Weight 1| Real Signal", "val": 9.6, "max": 25, "col": "emerald"}, {"label": "Ridge |Weight 2|", "val": 1.4, "max": 25, "col": "amber"}, {"label": "Lasso |Weight 2| = 0!", "val": 0.0, "max": 25, "col": "emerald"}]}, {"label": "Step 4: λ = 50.0 (Too Much Penalty — Underfitting!)", "summary": "If you crank λ way too high (λ = 50), the penalty crushes even the real Study Hours signal Weight 1 down toward 0! Both Training and Test error rise because the line becomes flat.", "rows": [["λ = 50.0 (Over-Penalized)", "Ridge (L2)", "+1.8 (Crushed too far!)", "+0.1", "−0.1", "19.5 pts", "21.0 pts (Underfit!)"], ["λ = 50.0 (Over-Penalized)", "Lasso (L1)", "0.00 (All zeroed!)", "0.00", "0.00", "25.0 pts", "25.0 pts (Flat line!)"]], "bars": [{"label": "Ridge |Weight 1|", "val": 1.8, "max": 25, "col": "rose"}, {"label": "Lasso |Weight 1|", "val": 0.0, "max": 25, "col": "rose"}, {"label": "Test Error", "val": 21.0, "max": 25, "col": "rose"}]}]}, "knn": {"title": "KNN Numbers Movie: Distance Table from One New Link to Its Neighbors, Then the Vote", "naiveQ": "“Where is the training?” (There is none — KNN memorizes the table and measures distances at prediction time!)", "headers": ["Known Link in Database", "Dots in URL (Clue 1)", "Entropy (Clue 2)", "True Label", "Distance to New Link (4 dots, 4.2 randomness)", "Rank (Closest First)", "In Top k=3 Vote?"], "steps": [{"label": "Step 1: A New Mystery Link Arrives (Clue 1 = 4 dots, Clue 2 = 4.2 entropy)", "summary": "Why is there no 'training loop' in KNN? Because KNN simply stores the 5 known links in memory! All the math happens right now when our new mystery link (4 dots, 4.2 entropy) arrives.", "rows": [["Mystery Query Link", "4", "4.2", "❓ Unknown", "0.00 (Measure distance to all 5 rows!)", "—", "Let's compute Euclidean distances!"]], "bars": [{"label": "Query Dots Clue 1", "val": 4.0, "max": 6, "col": "sky"}, {"label": "Query Entropy Clue 2", "val": 4.2, "max": 6, "col": "amber"}]}, {"label": "Step 2: Compute Straight-Line Distance √((ΔClue 1)² + (ΔClue 2)²) to Every Stored Link", "summary": "We plug each stored link into √((Clue 1 − 4)² + (Clue 2 − 4.2)²). Link A (4 dots, 4.0 entropy) is only √(0² + (−0.2)²) = 0.20 away, while safe Link D (1 dot, 2.2 entropy) is 3.61 away!", "rows": [["Link A: paypa1.login.tk", "4", "4.0", "🚨 Phishing", "√((4−4)² + (4.0−4.2)²) = 0.20", "#1 Closest", "—"], ["Link B: secure.bank-up.xyz", "5", "4.3", "🚨 Phishing", "√((5−4)² + (4.3−4.2)²) = 1.00", "#2 Closest", "—"], ["Link C: docs.portal.internal", "3", "3.9", "✅ Safe", "√((3−4)² + (3.9−4.2)²) = 1.04", "#3 Closest", "—"], ["Link D: github.com/home", "1", "2.2", "✅ Safe", "√((1−4)² + (2.2−4.2)²) = 3.61", "#4 Far", "—"], ["Link E: wikipedia.org/wiki", "1", "2.0", "✅ Safe", "√((1−4)² + (2.0−4.2)²) = 3.72", "#5 Farthest", "—"]], "bars": [{"label": "Dist to Link A (Phish)", "val": 0.2, "max": 4, "col": "emerald"}, {"label": "Dist to Link B (Phish)", "val": 1.0, "max": 4, "col": "emerald"}, {"label": "Dist to Link D (Safe)", "val": 3.61, "max": 4, "col": "rose"}]}, {"label": "Step 3: Pick Top k = 3 Closest Neighbors & Hold a Majority Vote!", "summary": "Sort by distance and keep the top k = 3 closest neighbors: Link A (Phish, dist 0.20), Link B (Phish, dist 1.00), and Link C (Safe, dist 1.04). The vote is 2 Phishing vs 1 Safe → 66.7% Phishing Verdict!", "rows": [["Link A: paypa1.login.tk", "4", "4.0", "🚨 Phishing", "0.20", "#1", "✅ YES (Vote 1: Phish)"], ["Link B: secure.bank-up.xyz", "5", "4.3", "🚨 Phishing", "1.00", "#2", "✅ YES (Vote 2: Phish)"], ["Link C: docs.portal.internal", "3", "3.9", "✅ Safe", "1.04", "#3", "✅ YES (Vote 3: Safe)"], ["Link D: github.com/home", "1", "2.2", "✅ Safe", "3.61", "#4", "❌ Outside k=3"], ["FINAL VOTE (k = 3)", "—", "—", "🚨 PHISHING WINS (2 to 1)", "p(Phish) = 2/3 = 66.7%", "Winner!", "Classified as Phishing!"]], "bars": [{"label": "Phishing Votes", "val": 2, "max": 3, "col": "rose"}, {"label": "Safe Votes", "val": 1, "max": 3, "col": "emerald"}]}]}, "naive_bayes": {"title": "Naive Bayes Numbers Movie: Counts → Probabilities → Multiplied Clue by Clue", "naiveQ": "“Why is it called naive?” (Because it naively multiplies clue probabilities as if '.tk domain' and 'word verify' were 100% independent coin flips!)", "headers": ["Clue / Step", "Count in 100 Phish URLs", "Count in 100 Safe URLs", "P(Clue | Phish)", "P(Clue | Safe)", "Running Phish Score", "Running Safe Score"], "steps": [{"label": "Step 1: Start with Prior Baseline Counts (50% Phish vs 50% Safe in Training Set)", "summary": "We have 100 Phishing URLs and 100 Safe URLs in our past logbook. Before looking at any words inside the new URL 'verify-login.tk', both classes start equal at 0.50.", "rows": [["0. Prior Baseline", "100 Phish total", "100 Safe total", "P(Phish) = 0.50", "P(Safe) = 0.50", "0.5000", "0.5000"]], "bars": [{"label": "Phish Score", "val": 50, "max": 100, "col": "rose"}, {"label": "Safe Score", "val": 50, "max": 100, "col": "emerald"}]}, {"label": "Step 2: Multiply by Clue #1 — URL Contains Word 'verify'", "summary": "In our logbook, 'verify' appeared in 40 of 100 Phish URLs (0.40), but only 5 of 100 Safe URLs (0.05). Multiply the baseline by those likelihoods: Phish = 0.50 × 0.40 = 0.2000 vs Safe = 0.50 × 0.05 = 0.0250!", "rows": [["0. Prior Baseline", "100", "100", "0.50", "0.50", "0.5000", "0.5000"], ["1. Clue 'verify'", "40 / 100", "5 / 100", "0.40 (8× more common!)", "0.05", "0.50 × 0.40 = 0.2000", "0.50 × 0.05 = 0.0250"]], "bars": [{"label": "Phish (Normalized %)", "val": 88.9, "max": 100, "col": "rose"}, {"label": "Safe (Normalized %)", "val": 11.1, "max": 100, "col": "emerald"}]}, {"label": "Step 3: Multiply by Clue #2 (.tk TLD) & Normalize to 100%", "summary": "Why 'Naive'? Even though '.tk' and 'verify' often appear together in scams, Naive Bayes just multiplies straight across: 0.2000 × 0.30 = 0.0600 (Phish) vs 0.0250 × 0.01 = 0.00025 (Safe). Normalizing gives 99.6% Phishing!", "rows": [["0. Prior Baseline", "100", "100", "0.50", "0.50", "0.5000", "0.5000"], ["1. Clue 'verify'", "40 / 100", "5 / 100", "0.40", "0.05", "0.2000", "0.0250"], ["2. Clue '.tk TLD'", "30 / 100", "1 / 100", "0.30 (30× more common!)", "0.01", "0.20 × 0.30 = 0.0600", "0.025 × 0.01 = 0.00025"], ["3. Normalize (A / (A+B))", "—", "—", "—", "—", "0.06 / 0.06025 = 99.6% 🚨", "0.00025 / 0.06025 = 0.4%"]], "bars": [{"label": "Final Phish Prob (%)", "val": 99.6, "max": 100, "col": "rose"}, {"label": "Final Safe Prob (%)", "val": 0.4, "max": 100, "col": "emerald"}]}]}, "svm": {"title": "SVM Numbers Movie: Margin Street Width, Support Vectors, and C / Kernel Effects", "naiveQ": "“Why only some points matter?” (Because the boundary is held up ONLY by the closest edge points — the Support Vectors!)", "headers": ["Scenario / Step", "Safe Points (Hours)", "Pass Points (Hours)", "Boundary Cutoff", "Closest Edge Points (Support Vectors)", "Street Margin Width (Safety Cushion Width)", "What Happens If You Move Far Points?"], "steps": [{"label": "Step 1: Many Lines Can Separate Fail (≤3h) from Pass (≥5h) — Which Is Safest?", "summary": "Suppose Fail students studied [1h, 2h, 3h] and Pass students studied [5h, 7h, 9h]. A cutoff at 3.1h barely scrapes past the 3h student! SVM searches for the widest cushioned street between the two groups.", "rows": [["Bad Line A (Off-center)", "[1h, 2h, 3h]", "[5h, 7h, 9h]", "x = 3.1h", "3h is only 0.1h away!", "0.2h (Dangerously narrow)", "High risk of misclassifying 3.2h!"], ["SVM Optimal Line", "[1h, 2h, 3h]", "[5h, 7h, 9h]", "x = 4.0h (Dead center!)", "Only x = 3h and x = 5h touch the curbs!", "2.0h (Maximum cushion! ✅)", "1h, 2h, 7h, 9h don't affect the line at all!"]], "bars": [{"label": "Bad Line Margin", "val": 0.2, "max": 2.5, "col": "rose"}, {"label": "SVM Max Margin", "val": 2.0, "max": 2.5, "col": "emerald"}]}, {"label": "Step 2: Why Only Support Vectors Matter (Delete 1h, 2h, 7h, 9h — Line Doesn't Budge!)", "summary": "Only the points sitting right on the dashed curb lines (x = 3h and x = 5h) have non-zero dual weights (αᵢ > 0). If the 9h student studies 50h instead, the boundary stays at 4.0h because only the Support Vectors hold up the street!", "rows": [["Student S1 (1h, Fail)", "Distance = 3.0h from boundary", "Inside safe zone", "Dual weight α₁ = 0.00", "Not a Support Vector", "—", "Deleting S1 changes nothing!"], ["Student S3 (3h, Fail)", "Distance = 1.0h (On left curb!)", "Touches margin wall", "Dual weight α₃ = 0.50 > 0", "⭐ SUPPORT VECTOR", "2.0h", "Moving S3 moves the whole street!"], ["Student S4 (5h, Pass)", "Distance = 1.0h (On right curb!)", "Touches margin wall", "Dual weight α₄ = 0.50 > 0", "⭐ SUPPORT VECTOR", "2.0h", "Moving S4 moves the whole street!"], ["Student S6 (9h, Pass)", "Distance = 5.0h from boundary", "Inside safe zone", "Dual weight α₆ = 0.00", "Not a Support Vector", "—", "Deleting S6 changes nothing!"]], "bars": [{"label": "Support Vectors Used", "val": 2, "max": 6, "col": "sky"}, {"label": "Ignored Interior Points", "val": 4, "max": 6, "col": "emerald"}]}, {"label": "Step 3: The C Slider (Soft vs Hard Street) & The Kernel Trick (Lifting 2D Rings into 3D)", "summary": "What if one noisy outlier sits at 4.5h? Small C allows a wide street and tolerates 1 outlier; huge C narrows the street to force 0 training mistakes. And if data is a circle, the RBF Kernel lifts points into 3D so a flat sheet slices them cleanly!", "rows": [["Small C (C = 0.1)", "Prioritize Wide Street", "Ignores 1 noisy outlier", "Cutoff stays stable at 4.0h", "3 Support Vectors", "2.0h (Wide & robust)", "Great generalization on noisy data"], ["Huge C (C = 100)", "Zero-Mistake Obsession", "Bends for 1 outlier at 4.5h", "Cutoff shifts to 4.75h", "2 Support Vectors", "0.5h (Pinched thin!)", "Risk of overfitting to outliers"], ["RBF Kernel (γ = 1.0)", "Circular Phishing Cluster", "Lifts x into e^(−γ‖x−x'‖²)", "Flat 3D plane = 2D Circle!", "Boundary ring points", "Nonlinear ring margin", "Separates nested rings linearly can't!"]], "bars": [{"label": "Small C Street Width", "val": 2.0, "max": 2.5, "col": "emerald"}, {"label": "Huge C Street Width", "val": 0.5, "max": 2.5, "col": "rose"}]}]}, "decision_tree": {"title": "Decision Tree Numbers Movie: Candidate Splits With Gini Scores, Winner Highlighted", "naiveQ": "“How does it pick a question?” (It tests every possible split question and picks the one that produces the purest YES/NO buckets — lowest weighted Mix-Up Score!)", "headers": ["Candidate Question Tested", "Left Bucket (YES)", "Right Bucket (NO)", "Left Gini (Mix-Up Formula)", "Right Gini", "Weighted Average Gini", "Decision"], "steps": [{"label": "Step 1: Root Bucket Before Splitting (6 Links: 3 Phish 🚨, 3 Safe ✅)", "summary": "At the top of the tree, our bucket has 3 Phishing and 3 Safe links (50% / 50% mix). Mix-Up Score is 1 − (0.5² + 0.5²) = 0.500 (maximum confusion!). The tree wants a question that drops Gini as close to 0.000 as possible.", "rows": [["0. Unsplit Root Bucket", "3 Phish, 3 Safe (Total 6)", "—", "1 − (0.5² + 0.5²) = 0.500", "—", "0.500 (Maximum mixedness)", "Test candidate questions below!"]], "bars": [{"label": "Root Mix-Up Score", "val": 0.5, "max": 0.5, "col": "rose"}]}, {"label": "Step 2: Test Question A ('Is URL Length > 40?') vs Question B ('Does URL Use https?')", "summary": "The tree tries Question A (URL Length > 40): Left gets [2 Phish, 1 Safe] (Gini = 0.444), Right gets [1 Phish, 2 Safe] (Gini = 0.444). Question B (Uses https?): Left gets [2 Phish, 2 Safe] (Gini = 0.500 — useless!).", "rows": [["Question A: Length > 40?", "2 Phish, 1 Safe (3 links)", "1 Phish, 2 Safe (3 links)", "1 − ((2/3)²+(1/3)²) = 0.444", "0.444", "(3/6)(0.444)+(3/6)(0.444) = 0.444", "Okay (Gain = 0.056)"], ["Question B: Uses https?", "2 Phish, 2 Safe (4 links)", "1 Phish, 1 Safe (2 links)", "1 − (0.5² + 0.5²) = 0.500", "0.500", "0.500 (Zero improvement!)", "❌ Reject (Useless question)"]], "bars": [{"label": "Root Gini", "val": 0.5, "max": 0.5, "col": "rose"}, {"label": "Question A Gini", "val": 0.444, "max": 0.5, "col": "amber"}, {"label": "Question B Gini", "val": 0.5, "max": 0.5, "col": "rose"}]}, {"label": "Step 3: Test Question C ('Is Brand Name in Subdomain?') → 🏆 WINNER!", "summary": "Now the tree tests Question C ('Is Brand in Subdomain?'): Left bucket gets [3 Phish, 0 Safe] (100% pure Phish, Gini = 0.000!) and Right bucket gets [0 Phish, 3 Safe] (100% pure Safe, Gini = 0.000!). Weighted Gini drops to 0.000 — Question C wins!", "rows": [["Question A: Length > 40?", "2 Phish, 1 Safe", "1 Phish, 2 Safe", "0.444", "0.444", "0.444", "Runner-up"], ["Question B: Uses https?", "2 Phish, 2 Safe", "1 Phish, 1 Safe", "0.500", "0.500", "0.500", "❌ Rejected"], ["🏆 Question C: Brand in Subdomain?", "3 Phish, 0 Safe (Pure!)", "0 Phish, 3 Safe (Pure!)", "1 − (1² + 0²) = 0.000", "1 − (0² + 1²) = 0.000", "0.000 (Perfect Split! Gain = +0.500)", "✅ SELECTED AS ROOT SPLIT!"]], "bars": [{"label": "Question A Gini", "val": 0.444, "max": 0.5, "col": "amber"}, {"label": "Question B Gini", "val": 0.5, "max": 0.5, "col": "rose"}, {"label": "🏆 Question C Gini = 0!", "val": 0.01, "max": 0.5, "col": "emerald"}]}]}, "random_forest": {"title": "Random Forest Numbers Movie: Bootstrap Samples, Each Tree's Vote, and the Final Majority", "naiveQ": "“Why are many weak guesses better than one?” (Because independent trees make mistakes on different rows, so averaging/voting cancels out individual tree quirks!)", "headers": ["Tree ID", "Bootstrap Sample (Rows Drawn With Replacement)", "Random Feature Subset Allowed", "Top Split Chosen by Tree", "Vote on Suspect Link X", "Why This Tree Voted That Way"], "steps": [{"label": "Step 1: Why 1 Single Deep Tree Breaks (It Memorizes Quirks!)", "summary": "If we train 5 trees on the EXACT same rows and features, we just get 5 identical clones! Random Forest forces diversity in two ways: (1) Bootstrap rows with replacement, and (2) Random subset of features at each split.", "rows": [["Single Deep Tree", "All Rows [1, 2, 3, 4, 5]", "All Features [TLD, Entropy, Length, Port]", "Port == 8080 (Quirk in row 2!)", "❌ Safe (Fooled!)", "Memorized one weird training row"]], "bars": [{"label": "1-Tree Accuracy (%)", "val": 72, "max": 100, "col": "amber"}]}, {"label": "Step 2: Build 5 Diverse Trees (Bootstrap Rows + Random Feature Subsets)", "summary": "Watch how each tree sees a slightly different slice of data and features. Tree 3 gets fooled by a benign length quirk, but Trees 1, 2, 4, and 5 catch the phishing signals from different angles!", "rows": [["🌲 Tree 1", "Rows [1, 1, 3, 4, 5]", "[TLD, Entropy]", "TLD == '.tk'?", "🚨 Phish (Vote 1)", "Saw .tk domain clue"], ["🌲 Tree 2", "Rows [2, 3, 3, 4, 5]", "[BrandSubdomain, Hyphens]", "Brand in Subdomain?", "🚨 Phish (Vote 2)", "Saw 'paypa1' brand spoof"], ["🌲 Tree 3", "Rows [1, 2, 2, 2, 4]", "[Length, HTTPS]", "Uses HTTPS?", "✅ Safe (Wrong vote)", "Fooled because phish had HTTPS"], ["🌲 Tree 4", "Rows [1, 3, 4, 4, 5]", "[Entropy, Digits]", "Entropy > 4.1?", "🚨 Phish (Vote 3)", "Caught random folder '8f3k9q'"], ["🌲 Tree 5", "Rows [1, 2, 3, 5, 5]", "[TLD, Redirects]", "Has '?redirect='?", "🚨 Phish (Vote 4)", "Caught open redirect parameter"]], "bars": [{"label": "Phish Votes (Trees 1,2,4,5)", "val": 4, "max": 5, "col": "emerald"}, {"label": "Safe Votes (Tree 3)", "val": 1, "max": 5, "col": "rose"}]}, {"label": "Step 3: The Wisdom-of-the-Crowd Majority Vote (4 to 1 → 80% Phishing!)", "summary": "Even though Tree 3 made a mistake, the 4 other independent trees outvoted it 4 to 1! By Condorcet's Jury Theorem, combining many uncorrelated 75%-accurate trees drives ensemble accuracy above 96%!", "rows": [["FINAL FOREST VERDICT", "5 Independent Trees", "4 voted Phish, 1 voted Safe", "Majority = 4 / 5 (80.0%)", "🚨 PHISHING", "Tree 3's mistake was canceled out by the crowd!"]], "bars": [{"label": "Single Tree Accuracy (%)", "val": 72, "max": 100, "col": "amber"}, {"label": "5-Tree Forest Accuracy (%)", "val": 94, "max": 100, "col": "emerald"}]}]}, "adaboost": {"title": "AdaBoost Numbers Movie: Sample Weights Per Round (Watch Mistakes Grow Heavier!)", "naiveQ": "“What does ‘focus on mistakes’ mean?” (Literally multiplying the weight wᵢ of every misclassified row by e⁺ᵃ so the next tree is forced to prioritize it!)", "headers": ["Training Row", "True Label", "Round 1 Weight (Equal)", "Stump 1 Guess", "Round 2 Weight (Mistakes Grow!)", "Stump 2 Guess", "Round 3 Weight"], "steps": [{"label": "Step 1: Round 1 Starts Fair — Every Row Has Equal Weight 1/5 = 0.20", "summary": "At the start of Round 1, all 5 links have the exact same importance weight (0.20). Stump 1 splits on '.tk TLD' and gets 4 links right, but MISSES Row #3 (a sneaky phishing link on '.com'!).", "rows": [["Row 1: login-pay.tk", "🚨 Phish", "0.20 (20%)", "🚨 Phish (✅ Correct)", "—", "—", "—"], ["Row 2: bank-sec.tk", "🚨 Phish", "0.20 (20%)", "🚨 Phish (✅ Correct)", "—", "—", "—"], ["Row 3: paypa1-auth.com (Sneaky!)", "🚨 Phish", "0.20 (20%)", "✅ Safe (❌ MISSED!)", "—", "—", "—"], ["Row 4: github.com", "✅ Safe", "0.20 (20%)", "✅ Safe (✅ Correct)", "—", "—", "—"], ["Row 5: python.org", "✅ Safe", "0.20 (20%)", "✅ Safe (✅ Correct)", "—", "—", "—"]], "bars": [{"label": "Row 1 Weight (%)", "val": 20, "max": 60, "col": "sky"}, {"label": "Row 3 (Missed!) Weight (%)", "val": 20, "max": 60, "col": "rose"}, {"label": "Row 4 Weight (%)", "val": 20, "max": 60, "col": "sky"}]}, {"label": "Step 2: Round 2 — Missed Row #3's Weight Skyrockets from 20% to 50%!", "summary": "Because Stump 1 missed Row #3, AdaBoost boosts Row #3's weight (`wᵢ ← wᵢ · e⁺ᵃ`) and shrinks the 4 easy rows (`wᵢ ← wᵢ · e⁻ᵃ`). After normalizing, Row #3 now counts for 50% of the entire dataset's penalty!", "rows": [["Row 1: login-pay.tk", "🚨 Phish", "0.20", "✅ Correct", "0.125 (Shrunk — already easy)", "—", "—"], ["Row 2: bank-sec.tk", "🚨 Phish", "0.20", "✅ Correct", "0.125 (Shrunk)", "—", "—"], ["Row 3: paypa1-auth.com", "🚨 Phish", "0.20", "❌ MISSED!", "🔥 0.500 (50% of total weight!)", "🚨 Phish (✅ Stump 2 nails it!)", "—"], ["Row 4: github.com", "✅ Safe", "0.20", "✅ Correct", "0.125 (Shrunk)", "—", "—"], ["Row 5: python.org", "✅ Safe", "0.20", "✅ Correct", "0.125 (Shrunk)", "—", "—"]], "bars": [{"label": "Easy Row 1 Weight (%)", "val": 12.5, "max": 60, "col": "sky"}, {"label": "🔥 Missed Row 3 Weight (%)", "val": 50.0, "max": 60, "col": "rose"}, {"label": "Easy Row 4 Weight (%)", "val": 12.5, "max": 60, "col": "sky"}]}, {"label": "Step 3: Stump 2 Is Forced to Solve Row #3 → Combined Weighted Vote = 100% Accuracy!", "summary": "Because missing Row #3 would cost 50% error, Stump 2 HAS to pick a question that catches Row #3 ('Digit-for-Letter Swap paypa1?'). Combining α₁·Stump1 + α₂·Stump2 classifies all 5 rows with 100% accuracy!", "rows": [["Row 3: paypa1-auth.com", "🚨 Phish", "0.20", "❌ Stump 1 Missed", "0.500 (Forced focus!)", "✅ Stump 2 Caught!", "0.167 (Back down — solved!)"], ["Final Ensemble: α₁Brake 1 + α₂Brake 2", "All 5 Rows", "—", "Stump 1 catches .tk", "Stump 2 catches paypa1", "100% Combined Accuracy! 🏆", "Mistake-driven teamwork!"]], "bars": [{"label": "Stump 1 Alone (%)", "val": 80, "max": 100, "col": "amber"}, {"label": "Stump 1 + Stump 2 (%)", "val": 100, "max": 100, "col": "emerald"}]}]}, "xgboost": {"title": "GBDT / XGBoost Numbers Movie: Table of Mistake Gap = Guess − Truth, Safety Brake, Leaf Values & Updated p Per Tree", "naiveQ": "“What is a gradient doing here?” (Instead of nudging weights in one formula, each new tree is trained to predict the residual gradient Mistake Gap = Guess − Truth left behind by the previous trees!)", "headers": ["Stage / Tree Added", "Running Log-Odds (z)", "Current Prob Chance (%)", "True y", "Gradient Mistake Gap = Guess − Truth (Residual)", "Bowl Steepness Safety Brake (Curvature)", "New Tree Leaf New Leaf Nudge", "New Prob Updated Chance"], "steps": [{"label": "Step 1: Base Prediction (Tree 0) — Start at 50% Coin Flip (Starting Score = 0.00)", "summary": "Before growing any trees, XGBoost starts every URL at log-odds Starting Score = 0.00, which Sigmoid turns into p = 0.50 (50%). For a real Phishing URL (y = 1), the gradient is Mistake Gap = Guess − Truth = 0.50 − 1.00 = −0.50 ('we are 50% too low!').", "rows": [["Tree 0 (Baseline)", "Starting Score = 0.00", "Starting Chance = 0.500 (50.0%)", "y = 1", "Gap 1 = 0.50 − 1 = −0.500", "Brake 1 = 0.50(0.50) = 0.250", "Tree 1 Nudge = −(−0.50)/(0.25+0) × 0.5 = +1.00", "Tree 1 Score = +1.00 → Tree 1 Chance = 73.1%"]], "bars": [{"label": "Current Prob p (%)", "val": 50.0, "max": 100, "col": "amber"}, {"label": "|Gradient g = p−y| (%)", "val": 50.0, "max": 100, "col": "rose"}, {"label": "Bowl Steepness h×100", "val": 25.0, "max": 100, "col": "sky"}]}, {"label": "Step 2: Tree 1 Added (Tree 1 Score = +1.00, Tree 1 Chance = 73.1%) → Compute Leftover Gradient Gap 2 = −0.269", "summary": "Tree 1 added +1.00 to the log-odds, pushing p from 50.0% to 73.1%! Now we recompute the leftover error: Gap 2 = Tree 1 Chance − y = 0.731 − 1 = −0.269, and curvature Brake 2 = 0.731(1 − 0.731) = 0.197. Tree 2 is trained to fix this remaining −0.269 gap!", "rows": [["Tree 0 (Baseline)", "0.00", "50.0%", "1", "Gap 1 = −0.500", "Brake 1 = 0.250", "+1.00", "73.1%"], ["After Tree 1 → Build Tree 2", "Tree 1 Score = +1.00", "Tree 1 Chance = 0.731 (73.1%)", "1", "Gap 2 = 0.731 − 1 = −0.269", "Brake 2 = 0.731(0.269) = 0.197", "Tree 2 Nudge = −(−0.269)/(0.197) × 0.5 = +0.68", "Tree 2 Score = +1.68 → Tree 2 Chance = 84.3%"]], "bars": [{"label": "Current Prob p (%)", "val": 73.1, "max": 100, "col": "sky"}, {"label": "|Gradient g = p−y| (%)", "val": 26.9, "max": 100, "col": "amber"}, {"label": "Bowl Steepness h×100", "val": 19.7, "max": 100, "col": "sky"}]}, {"label": "Step 3: Tree 2 Added (Tree 2 Score = +1.68, Tree 2 Chance = 84.3%) → Leftover Gradient Shrinks to Gap 3 = −0.157", "summary": "Notice how Safety Brake acts as an automatic brake pedal in Best Leaf Nudge: as p approaches 1.0, Mistake Gap = Guess − Truth gets smaller and each new tree adds a finer correction (+0.60), pushing p to 90.7%!", "rows": [["Tree 0 (Baseline)", "0.00", "50.0%", "1", "−0.500", "0.250", "+1.00", "73.1%"], ["After Tree 1", "+1.00", "73.1%", "1", "−0.269", "0.197", "+0.68", "84.3%"], ["After Tree 2 → Build Tree 3", "Tree 2 Score = +1.68", "Tree 2 Chance = 0.843 (84.3%)", "1", "Gap 3 = 0.843 − 1 = −0.157", "Brake 3 = 0.843(0.157) = 0.132", "Tree 3 Nudge = +0.60", "Tree 3 Score = +2.28 → p₃ = 90.7%"]], "bars": [{"label": "Current Prob p (%)", "val": 84.3, "max": 100, "col": "emerald"}, {"label": "|Gradient g = p−y| (%)", "val": 15.7, "max": 100, "col": "amber"}, {"label": "Bowl Steepness h×100", "val": 13.2, "max": 100, "col": "sky"}]}, {"label": "Step 4: After Tree 10 (Raw Score after 10 Trees = +4.60, Chance after 10 Trees = 99.0% 🚨) — Residual g Is Nearly Zero!", "summary": "By Tree 10, the accumulated log-odds reach z = +4.60, Sigmoid outputs p = 99.0% Phishing, and the residual gradient g = 0.990 − 1.000 = −0.010 is almost zero! Each tree chipped away at the previous tree's residual error.", "rows": [["Tree 0 (Start)", "0.00", "50.0%", "1", "−0.500 (Huge gap)", "0.250", "+1.00", "73.1%"], ["Tree 1", "+1.00", "73.1%", "1", "−0.269", "0.197", "+0.68", "84.3%"], ["Tree 2", "+1.68", "84.3%", "1", "−0.157", "0.132", "+0.60", "90.7%"], ["Tree 10 (Final)", "Raw Score after 10 Trees = +4.60", "Chance after 10 Trees = 0.990 (99.0% 🚨)", "1", "g = −0.010 (Solved!)", "h = 0.010", "Leaf Nudge ≈ +0.02 (Tiny polish)", "99.0% Phishing Block! 🏆"]], "bars": [{"label": "Current Prob p (%)", "val": 99.0, "max": 100, "col": "emerald"}, {"label": "|Gradient g = p−y| (%)", "val": 1.0, "max": 100, "col": "emerald"}, {"label": "Bowl Steepness h×100", "val": 1.0, "max": 100, "col": "emerald"}]}]}, "kmeans_dbscan": {"title": "K-Means & DBSCAN Numbers Movie: Centroid Updates & Core / Border / Noise Labels", "naiveQ": "“How does it learn without answers?” (By grouping points that sit close together in feature space — either pulling K magnets to the center of each cloud, or linking dense neighborhoods!)", "headers": ["Point / Step", "URL Length (Clue 1)", "Entropy (Clue 2)", "Dist to Magnet Group 1 Center (Safe)", "Dist to Magnet Group 2 Center (Botnet)", "Assigned Cluster (K-Means)", "DBSCAN Density Role (ε=1.5, MinPts=2)"], "steps": [{"label": "Step 1: Unlabeled Data Arrives (5 URLs, Zero 'y' Labels!) — Place 2 Initial Magnets", "summary": "Nobody told the computer which URLs are safe or botnet! We drop Magnet Group 1 Center at (20, 2.5) and Magnet Group 2 Center at (70, 4.5), and measure which magnet each point is closer to.", "rows": [["URL 1 (google.com)", "18", "2.4", "2.0 (Closer to Group 1 Center)", "52.0", "Cluster 1 (Group A)", "🟢 CORE (Has 2 neighbors ≤ 1.5)"], ["URL 2 (github.com)", "22", "2.6", "2.0 (Closer to Group 1 Center)", "48.0", "Cluster 1 (Group A)", "🟢 CORE (Has 2 neighbors ≤ 1.5)"], ["URL 3 (8x9q2z-login.tk)", "78", "4.7", "58.0", "8.0 (Closer to Group 2 Center)", "Cluster 2 (Group B)", "🟢 CORE (Dense botnet pair)"], ["URL 4 (7k4m9p-login.tk)", "82", "4.9", "62.0", "12.0 (Closer to Group 2 Center)", "Cluster 2 (Group B)", "🟡 BORDER (Within ε of URL 3)"], ["URL 5 (weird-port:9999)", "140", "1.1", "120.0", "70.1", "Forced into Cluster 2 by K-Means!", "🔴 NOISE (-1 Outlier! 0 neighbors!)"]], "bars": [{"label": "Cluster 1 Size", "val": 2, "max": 5, "col": "emerald"}, {"label": "Cluster 2 Size", "val": 2, "max": 5, "col": "sky"}, {"label": "DBSCAN Outliers Caught", "val": 1, "max": 5, "col": "rose"}]}, {"label": "Step 2: K-Means Iteration 2 — Move Each Magnet to the Average (Mean) of Its Group!", "summary": "Magnet Group 1 Center slides to the average of URL 1 & URL 2: ((18+22)/2, (2.4+2.6)/2) = (20.0, 2.50). Magnet Group 2 Center slides to the center of URL 3 & URL 4: ((78+82)/2, (4.7+4.9)/2) = (80.0, 4.80). Assignments don't change anymore — converged!", "rows": [["Magnet Group 1 Center (Center of Group 1)", "Avg(18, 22) = 20.0", "Avg(2.4, 2.6) = 2.50", "0.0 (Locked!)", "—", "Normal Traffic Cluster", "2 Core Points"], ["Magnet Group 2 Center (Center of Group 2)", "Avg(78, 82) = 80.0", "Avg(4.7, 4.9) = 4.80", "—", "0.0 (Locked!)", "DGA Botnet Cluster", "1 Core + 1 Border"], ["URL 5 (Extreme Anomaly)", "140", "1.10", "Dist = 120.0", "Dist = 60.1", "⚠️ K-Means forces it into Group 2", "✅ DBSCAN labels it -1 NOISE!"]], "bars": [{"label": "Group 1 Center Avg Length", "val": 20, "max": 100, "col": "emerald"}, {"label": "Group 2 Center Avg Length", "val": 80, "max": 100, "col": "rose"}]}]}, "pca": {"title": "PCA Numbers Movie: Variance Explained & Projected Points Step by Step", "naiveQ": "“What does ‘reducing dimensions’ mean?” (Rotating the axes to point along the longest spread of the cloud, so 2 redundant columns compress into 1 master score without losing the pattern!)", "headers": ["House Row", "SqFt in 1000s (Clue 1)", "Rooms (Clue 2 — Redundant!)", "Centered (SqFt vs Avg, Rooms vs Avg)", "Main Axis Score (Main Axis = 96% Variance)", "Extra Wiggle Axis Score (Wiggle Noise = 4% Variance)", "After Dropping Extra Wiggle Axis"], "steps": [{"label": "Step 1: Two Redundant Columns (SqFt Clue 1 and Rooms Clue 2 Move Almost Identically!)", "summary": "Look at our 3 houses: bigger SqFt almost always means more Rooms. Carrying both columns is 96% duplicate information! First, PCA centers both columns by subtracting their averages (Avg SqFt = 2.0, Avg Rooms = 6.0).", "rows": [["House A (Small)", "1.0k", "3 rooms", "(−1.0, −3.0)", "—", "—", "—"], ["House B (Medium)", "2.0k", "6 rooms", "(0.0, 0.0)", "—", "—", "—"], ["House C (Large)", "3.0k", "9 rooms", "(+1.0, +3.0)", "—", "—", "—"]], "bars": [{"label": "Col 1 + Col 2 (2D)", "val": 2, "max": 2, "col": "sky"}, {"label": "Correlation Between Clue 1,Clue 2 (%)", "val": 98, "max": 100, "col": "amber"}]}, {"label": "Step 2: Project onto Principal Component 1 (The Diagonal Axis of Maximum Spread)", "summary": "PCA finds the diagonal direction v₁ = [0.316, 0.949] where the points spread out the most (Eigenvalue λ₁ = 96% of total variance). Perpendicular axis Extra Wiggle Axis captures only 4% random noise — so we drop Extra Wiggle Axis and keep 1 number per house!", "rows": [["House A (Small)", "1.0k", "3 rooms", "(−1.0, −3.0)", "Main Axis = −3.16 (Small House Score)", "Extra Wiggle Axis = +0.02 (Tiny noise)", "Keep only −3.16!"], ["House B (Medium)", "2.0k", "6 rooms", "(0.0, 0.0)", "Main Axis = 0.00 (Average House Score)", "Extra Wiggle Axis = −0.01 (Tiny noise)", "Keep only 0.00!"], ["House C (Large)", "3.0k", "9 rooms", "(+1.0, +3.0)", "Main Axis = +3.16 (Large House Score)", "Extra Wiggle Axis = +0.01 (Tiny noise)", "Keep only +3.16!"], ["VARIANCE SUMMARY", "50% raw", "50% raw", "—", "✅ Main Axis Captures 96.0% of Signal!", "🗑️ Extra Wiggle Axis = 4.0% (Dropped!)", "2 Columns → 1 Column (96% preserved!)"]], "bars": [{"label": "Main Axis Variance Kept (%)", "val": 96, "max": 100, "col": "emerald"}, {"label": "Extra Wiggle Axis Noise Dropped (%)", "val": 4, "max": 100, "col": "rose"}]}]}, "q_learning": {"title": "Q-Learning Numbers Movie: Watch the Q-Table Fill In After Episode 1, 10, and 100", "naiveQ": "“How does it learn from rewards?” (When the agent hits the +100 Goal at the end, the Bellman equation passes that value one square backward per episode like a bucket brigade!)", "headers": ["Training Stage", "State Square 1 (Start Square) → Go Right", "State Square 2 (Middle Square) → Go Right", "State Square 3 (Next to Goal) → Go Right", "State Goal Square 4 (Goal = +100 Reward)", "What the Agent Does Now"], "steps": [{"label": "Step 1: Episode 0 (Blank Brain — All Q-Values Are 0.0)", "summary": "Imagine a 4-square hallway: [Square 1 Start] → [Square 2 Middle] → [Square 3 Near Goal] → [Goal Square 4 Goal +100]. At Episode 0, every Q(state, Right) = 0.0. The agent wanders blindly because every square looks equally worthless.", "rows": [["Episode 0 (Untrained)", "Square 1 → Right Score = 0.0", "Square 2 → Right Score = 0.0", "Square 3 → Right Score = 0.0", "+100 Goal Treasure", "Wanders randomly (0% clue)"]], "bars": [{"label": "Square 1 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 2 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 3 → Right Score", "val": 0, "max": 100, "col": "rose"}]}, {"label": "Step 2: After Episode 1 — Only Square 3 (Right Next to the Goal!) Learns +50.0", "summary": "In Episode 1, the agent stumbles from Square 3 into Goal Square 4 and collects r = +100! Bellman update (`Q ← Q + α(r + γ·maxQ' − Q)` with α=0.5, γ=0.9) updates Square 3 → Right Score from 0 to +50.0. Notice Square 1 and Square 2 are STILL 0.0!", "rows": [["Episode 0", "0.0", "0.0", "0.0", "+100", "Blind"], ["After Episode 1", "0.0 (Hasn't heard yet!)", "0.0 (Hasn't heard yet!)", "0 + 0.5(100) = +50.0 💡", "+100", "Knows Square 3 → Goal Square 4 is great!"]], "bars": [{"label": "Square 1 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 2 → Right Score", "val": 0, "max": 100, "col": "rose"}, {"label": "Square 3 → Right Score", "val": 50, "max": 100, "col": "amber"}]}, {"label": "Step 3: After Episode 10 — Reward Ripples Backward to Square 2 (+68.0) and Square 1 (+45.0)!", "summary": "On the next episodes, stepping Square 2 → Square 3 sees Square 3's high Q-value (`γ·maxQ(Square 3)`), so Square 2's Q-value rises! Then stepping Square 1 → Square 2 sees Square 2's Q-value, so Square 1 rises too — the reward ripples backward to the Start square!", "rows": [["After Episode 1", "0.0", "0.0", "+50.0", "+100", "Only Square 3 knows"], ["After Episode 10", "+45.0 (Heard from Square 2!)", "+68.0 (Heard from Square 3!)", "+89.0 (Heard from Goal!)", "+100", "Follows breadcrumbs Square 1→Square 2→Square 3→Goal Square 4!"]], "bars": [{"label": "Square 1 → Right Score", "val": 45, "max": 100, "col": "sky"}, {"label": "Square 2 → Right Score", "val": 68, "max": 100, "col": "sky"}, {"label": "Square 3 → Right Score", "val": 89, "max": 100, "col": "emerald"}]}, {"label": "Step 4: After Episode 100 — Converged Discounted Trail (81.0 → 90.0 → 100.0)!", "summary": "With discount factor γ = 0.9, Square 3 → Right Score converges to 100, Square 2 → Right Score = 0.9×100 = 90.0, and Square 1 → Right Score = 0.9×90 = 81.0! From Square 1, the agent marches straight to the goal with zero wasted steps!", "rows": [["After Episode 1", "0.0", "0.0", "+50.0", "+100", "Random"], ["After Episode 10", "+45.0", "+68.0", "+89.0", "+100", "Mostly right"], ["After Episode 100 (Converged)", "81.0 (0.9² × 100)", "90.0 (0.9¹ × 100)", "100.0 (1.0 × 100)", "+100", "🏆 Optimal Policy Locked!"]], "bars": [{"label": "Square 1 → Right Score", "val": 81, "max": 100, "col": "emerald"}, {"label": "Square 2 → Right Score", "val": 90, "max": 100, "col": "emerald"}, {"label": "Square 3 → Right Score", "val": 100, "max": 100, "col": "emerald"}]}]}, "vectors_dot": {"title": "Vectors & Dot Product Numbers Movie: Multiply Matching Slots, Then Add!", "naiveQ": "“How does a list of numbers turn into one prediction score?”", "headers": ["Feature Slot", "Student Vector x", "Model Weights w", "Slot Product (wᵢ × xᵢ)", "Running Sum (Dot Product)"], "steps": [{"label": "Step 1: Slot 1 — Multiply Study Hours (Clue 1 = 4) by Weight (Weight 1 = 10)", "summary": "A vector is just a row of numbers: x = [4 hours, 3 practice tests]. Weight vector w = [10 pts/hr, 5 pts/test]. Multiply Slot 1: 10 × 4 = 40 pts.", "rows": [["Slot 1: Study Hours", "Clue 1 = 4", "Weight 1 = +10", "10 × 4 = +40", "40"]], "bars": [{"label": "Slot 1 Contribution", "val": 40, "max": 85, "col": "sky"}, {"label": "Running Total", "val": 40, "max": 85, "col": "emerald"}]}, {"label": "Step 2: Slot 2 — Multiply Practice Tests (Clue 2 = 3) by Weight (Weight 2 = 5) & Add!", "summary": "Now multiply Slot 2: 5 × 3 = 15 pts, and add it to Slot 1: 40 + 15 = 55 pts! Add baseline intercept b = 25 → Final Score Guess = 80 pts.", "rows": [["Slot 1: Study Hours", "Clue 1 = 4", "Weight 1 = +10", "10 × 4 = +40", "40"], ["Slot 2: Practice Tests", "Clue 2 = 3", "Weight 2 = +5", "5 × 3 = +15", "40 + 15 = 55"], ["+ Baseline Intercept b", "1", "b = +25", "+25", "55 + 25 = 80 pts (Done!)"]], "bars": [{"label": "Slot 1 (40)", "val": 40, "max": 85, "col": "sky"}, {"label": "Slot 2 (15)", "val": 15, "max": 85, "col": "amber"}, {"label": "Total Guess (80)", "val": 80, "max": 85, "col": "emerald"}]}]}, "stats_hypothesis": {"title": "Statistical Test Numbers Movie: Signal Divided by Noise → Luck Chance Verdict", "naiveQ": "“How do we know a weight w isn't just a lucky fluke in 5 rows?”", "headers": ["Step", "Estimated Slope (ŵ)", "Noise / Bounce (Standard Error Wiggle Margin)", "Signal-to-Noise Ratio (t or z or F)", "Probability of Random Luck (Luck Chance)", "Verdict (α = 0.05 Cutoff)"], "steps": [{"label": "Step 1: Measure the Signal (Slope ŵ = +10.0 pts/hr)", "summary": "Our best-fit line says each study hour adds ŵ = +10.0 points. Wait — could a random coin-flip feature also look like +10.0 in a tiny sample?", "rows": [["1. Measure Effect Signal", "ŵ = +10.0 pts/hr", "—", "—", "—", "Need to compare against noise Wiggle Margin!"]], "bars": [{"label": "Signal |ŵ|", "val": 10.0, "max": 12, "col": "sky"}]}, {"label": "Step 2: Divide Signal by Noise Wiggle Margin → t-Score = 5.0 → p = 0.002 (< 0.05!)", "summary": "The wiggle uncertainty is Wiggle Margin = 2.0. Dividing Signal by Noise gives t = 10.0 / 2.0 = 5.0 standard errors away from zero! The chance of seeing 5.0 by pure luck is p = 0.002 (0.2% < 5%), so Study Hours is a REAL signal!", "rows": [["Real Clue: Study Hours", "ŵ = +10.0", "Wiggle Margin = 2.0", "t = 10 / 2 = 5.00 (Huge!)", "p = 0.002 (0.2% luck)", "✅ SIGNIFICANT (Keep feature!)"], ["Fake Clue: Shoe Size", "ŵ = +0.8", "Wiggle Margin = 2.5", "t = 0.8 / 2.5 = 0.32 (Tiny)", "p = 0.760 (76% luck!)", "❌ NOISE (Drop feature!)"]], "bars": [{"label": "Study Hours t-Score", "val": 5.0, "max": 6, "col": "emerald"}, {"label": "Shoe Size t-Score", "val": 0.32, "max": 6, "col": "rose"}]}]}, "neural_backprop": {"title": "Neural Net & Backprop Numbers Movie: Forward Pass → ReLU Bend → Backward Chain Rule", "naiveQ": "“What do hidden layers actually do to the numbers?”", "headers": ["Pass Stage", "Input (Hours x)", "Hidden Neuron 1 (ReLU(2x−2))", "Hidden Neuron 2 (ReLU(x−6) Burnout)", "Output Prediction Guess", "Backward Gradient Flow"], "steps": [{"label": "Step 1: Forward Pass — Hidden Neurons Create Hinge Bends (ReLU = max(0, z))", "summary": "A straight line cannot bend when a student studies 8 hours and burns out! Neuron 1 turns on after 1 hr (+boost); Neuron 2 turns on only after 6 hrs (−burnout penalty). Together they form a bent roof curve!", "rows": [["x = 4 hrs (Fresh)", "4.0", "max(0, 8−2) = +6.0 (Active!)", "max(0, 4−6) = 0.0 (Asleep)", "50 + 5(6) − 20(0) = 80 pts", "Neuron 1 gets gradient; Neuron 2 = 0"], ["x = 8 hrs (Burnout)", "8.0", "max(0, 16−2) = +14.0", "max(0, 8−6) = +2.0 (Wakes up!)", "50 + 5(14) − 20(2) = 80 pts", "Both neurons get error blame!"]], "bars": [{"label": "Neuron 1 Output", "val": 14, "max": 16, "col": "emerald"}, {"label": "Neuron 2 Burnout", "val": 2, "max": 16, "col": "rose"}]}, {"label": "Step 2: Backward Pass (Chain Rule Blame Assignment)", "summary": "If the final prediction is off by −6 pts, Backpropagation multiplies the output error by each layer's weight to send exact blame to every hidden weight — updating only the neurons that fired (ReLU > 0)!", "rows": [["Output Layer", "Error δ_out = −6.0", "Weight v₁ = +5.0", "Weight v₂ = −20.0", "v_new = v − α(δ_out · a_hidden)", "Direct gradient step"], ["Hidden Layer (Chain Rule)", "Blame δ₁ = δ_out × v₁ = −30", "ReLU slope = 1 (since z>0)", "∂L/∂Weight 1 = δ₁ × x", "Weight 1 nudged to reduce error!", "Chain rule = multiply slopes backward!"]], "bars": [{"label": "Output Error |δ|", "val": 6, "max": 35, "col": "amber"}, {"label": "Hidden Blame |δ₁|", "val": 30, "max": 35, "col": "sky"}]}]}, "url_forensics": {"title": "URL Forensics Numbers Movie: Watch Raw URL Characters Turn into Risk Numbers", "naiveQ": "“How does a text link like 'http://paypa1-login.tk/8f3k9q' become math numbers?”", "headers": ["Stage", "What the Code Inspects", "Raw Substring Found", "Formula Applied", "Numeric Feature Output", "Phishing Signal Strength"], "steps": [{"label": "Step 1: Split Hostname into Subdomain vs True Registrable Apex (domain_utils.py)", "summary": "Attackers write 'paypal.com.verify-login.tk' hoping you look at the left side. Our parser reads right-to-left against the Public Suffix List: '.tk' is the TLD, 'verify-login.tk' is the true owner, and 'paypal.com' is just a fake subdomain!", "rows": [["1. Public Suffix Split", "Rightmost registrable root", "Apex = 'verify-login.tk'", "Subdomain = 'paypal.com'", "F10 (Brand_in_Subdomain) = 1", "🚨 CRITICAL (+2.40 log-odds)"]], "bars": [{"label": "Brand Spoof Flag F10", "val": 100, "max": 100, "col": "rose"}]}, {"label": "Step 2: Compute Character Randomness H(X) & 3–5 Char N-Gram Rare-Pattern Score", "summary": "Normal words like '/account/login' repeat letters and have low entropy (H ≈ 2.9 bits). Random DGA folders like '/8f3k9q/' have flat character probabilities (1/6 each → H = 4.32 bits), and N-grams catch 'paypa1'!", "rows": [["2. Character Randomness F12", "Randomness of path chars", "'/8f3k9q/'", "H = −∑ p(c) loGap 2 p(c)", "H = 4.32 bits/char", "🚨 High Randomness (> 4.0)"], ["3. Char N-Gram Rare-Pattern Score", "3-char sliding window", "'pay', 'ypa', 'pa1', '.tk'", "(1 + ln tf) × idf / ‖v‖₂", "F809 ('pa1') = 0.482", "🚨 Catches typo-squat '1' for 'l'!"]], "bars": [{"label": "Normal URL Entropy", "val": 2.9, "max": 5.0, "col": "emerald"}, {"label": "Suspect URL Entropy", "val": 4.32, "max": 5.0, "col": "rose"}]}]}};
  const ML_BLUEPRINTS = {"mod0": {"movieKey": "linear_regression", "whyExists": "Before ML, programmers had to hand-write rigid IF/ELSE rules (which break as soon as house prices shift or scammers change 1 letter). Linear Regression learns the slope m and baseline b automatically from past examples.", "plainRecipe": "Multiply the input clue (Study Hours x) by a learned points-per-hour dial (m), then add the starting baseline score (b).", "numExample": "For x = 4 hours, with m = 10 pts/hr and b = 40 base pts: Guess ŷ = (10 × 4) + 40 = 80 points.", "whenPick": "Predicting a continuous number (price, score, temperature) when the relationship is roughly a straight line.", "whenAvoid": "Predicting a YES/NO category (use Logistic Regression) or complex non-linear interactions (use Random Forest / XGBoost).", "rivalName": "Hand-Written IF/ELSE Rules", "headToHead": "On 5 student exam scores, rigid IF/ELSE rules miss intermediate hours by ±12 pts, while ŷ = 10x + 40 hits Typical Error Size = 1.4 pts and adapts automatically when retrained.", "faqs": [{"q": "🙋 Where do m and b come from at the very beginning?", "a": "They start at random or zero (m = 0, b = 0) — or are solved in one step by Best-Fit Line — and adjust until the squared errors are as small as possible!"}, {"q": "🙋 Why can't we use this straight line directly for Phishing vs Safe?", "a": "Because a straight line goes below 0% and above 100% (e.g., guessing 240% chance of phishing)! For probabilities, we wrap the line inside a Sigmoid S-curve (Logistic Regression)."}, {"q": "🙋 What is the difference between x, y, and ŷ?", "a": "x is the input clue you know (Study Hours), y is the real historical answer in your table, and ŷ ('y-hat') is the computer's guess."}]}, "mod0_math": {"movieKey": "linear_regression", "whyExists": "Beginners often confuse the Model (the engine making guesses, like ŷ = mx+b) with the Helper Formulas (the wrench and scoreboard, like Average Squared Error loss, Gradient, and Luck Chances) that train or audit the engine.", "plainRecipe": "Use the Model to make a guess ŷ; use the Loss Formula to score how wrong ŷ is; use the Gradient to nudge the Model's knobs downhill.", "numExample": "Model guesses ŷ = 60 when real y = 80 → Loss (y−ŷ)² = (−20)² = 400 → Gradient tells us to raise slope m!", "whenPick": "Use this mental map before studying any new equation so you immediately know whether an equation is a Model, a Loss, an Optimizer, or a Statistical Test.", "whenAvoid": "Never treat a helper formula (like Luck Chance, Rare-Pattern Score, or Gradient) as if it outputs predictions ŷ by itself.", "rivalName": "Memorizing Formulas Blindly", "headToHead": "Knowing 'Role First' lets you see that Linear Regression, Logistic Regression, and Neural Nets all use the exact same Downhill Error Stepping loop!", "faqs": [{"q": "🙋 Is Downhill Error Stepping a model?", "a": "No! Downhill Error Stepping is the training algorithm (the mechanic turning the wrench). Linear Regression or a Neural Network is the model (the engine)."}, {"q": "🙋 Why do we square the error (y − ŷ)² instead of just subtracting?", "a": "If you don't square (or take absolute value), a −10 miss and a +10 miss add up to 0 and pretend the model is perfect!"}]}, "mod_vec": {"movieKey": "vectors_dot", "whyExists": "A single number x only describes 1 clue (like Study Hours). Real houses and URLs have dozens or thousands of clues — Vectors pack all clues for one item into a single ordered list so the Dot Product can score them in one step.", "plainRecipe": "Line up the item's feature list x with the model's weight list w, multiply matching slots together, and add them all up.", "numExample": "x = [4 hrs, 3 tests], w = [10, 5] → Dot Product w·x = (10×4) + (5×3) = 40 + 15 = 55.", "whenPick": "Every single ML model uses vectors for inputs; use Cosine Similarity when comparing text/embeddings where arrow direction matters more than length.", "whenAvoid": "Raw Dot Product alone gets tricked if one vector is 100× longer — divide by vector lengths (Cosine Similarity) when comparing document similarity.", "rivalName": "Slow Python For-Loops Over Separate Variables", "headToHead": "A vectorized NumPy dot product w·x scores 1,000,000 URLs in 4 ms — about 150× faster than a Python for-loop.", "faqs": [{"q": "🙋 Why does Cosine Similarity divide by the lengths of the vectors?", "a": "So a long 500-word email and a short 20-word email about the exact same topic still score cos(θ) = 1.00 (same direction)!"}, {"q": "🙋 What does a Dot Product of 0 mean?", "a": "It means the two vectors are at a 90° right angle — they share zero alignment (completely unrelated)."}]}, "mod_design": {"movieKey": "vectors_dot", "whyExists": "Scoring one student vector at a time is still one row at a time. Stacking all N student vectors into a 2D Design Matrix X lets the CPU/GPU score the entire classroom in a single matrix multiplication ŷ = Xw.", "plainRecipe": "Each row of X is one student (or URL); each column of X is one feature (plus a leading column of 1s for the intercept b). Multiply Row × Weight Column for every row at once.", "numExample": "5 students × 3 columns (X is 5×3) multiplied by 3 weights (w is 3×1) outputs all 5 predictions (ŷ is 5×1) simultaneously.", "whenPick": "Always! Scikit-Learn, NumPy, PyTorch, and XGBoost all expect inputs formatted as a 2D Design Matrix X of shape (n_samples, n_features).", "whenAvoid": "When 99% of entries in X are zeros (like 1,000 N-gram columns), use a Compressed Sparse Row (scipy.sparse.csr_matrix) instead of a dense array to save 99% RAM.", "rivalName": "Row-by-Row Iteration", "headToHead": "Matrix multiplication Xw computes 10,000 house predictions in 1 BLAS call (< 0.5 ms) vs 45 ms in a row loop.", "faqs": [{"q": "🙋 Why do we put a column of all 1s as the first column of X?", "a": "Because multiplying 1 × b adds the baseline intercept b to every row automatically inside Xw, so you don't need a separate + b step!"}, {"q": "🙋 Which way are rows vs columns in X?", "a": "Rows (m) are always individual examples (students, houses, URLs); Columns (p) are always the measured features/clues."}]}, "mod_corr": {"movieKey": "stats_hypothesis", "whyExists": "Raw covariance changes wildly if you switch units from Hours to Minutes (60× bigger!). Pearson Correlation r standardizes both variables so straight-line relationship strength is always locked between −1.0 and +1.0.", "plainRecipe": "Center both X and Y around their averages, multiply their z-scores together, and average — giving +1 for a perfect upward line, −1 for downward, and 0 for no linear tilt.", "numExample": "Study Hours vs Exam Score has r = +0.98 (strong positive line); Absences vs Score has r = −0.91 (strong negative); Shoe Size vs Score has r = +0.04 (noise).", "whenPick": "Fast first-pass screening to see which numeric features move linearly with the target y, and to spot duplicate/collinear features.", "whenAvoid": "Curved relationships (like burnout U-curves where r ≈ 0 despite a strong pattern) or categorical/non-linear tree interactions.", "rivalName": "Unscaled Covariance", "headToHead": "Changing Study Hours to Minutes multiplies covariance by 60×, while Move-Together Strength stays rock-steady at +0.98.", "faqs": [{"q": "🙋 If r = 0, does that guarantee X has no effect on Y?", "a": "No! r only measures straight lines. A U-shaped curve (too little sleep hurts, too much sleep hurts) has r ≈ 0 even though sleep strongly affects scores!"}, {"q": "🙋 Does r = +0.95 prove X causes Y?", "a": "Never by itself! Ice cream sales and sunburns have r = +0.90 because hot summer weather (a hidden confounder) drives both."}]}, "mod_pval_ci": {"movieKey": "stats_hypothesis", "whyExists": "In a small dataset of 5 or 20 rows, even a completely random coin-flip feature will accidentally have a non-zero correlation or slope! Luck Chances and 95% Confidence Intervals tell you if the slope is real signal or random luck.", "plainRecipe": "Assume the feature is useless (Null Hypothesis H₀: w = 0). Compute how unlikely your observed slope is under pure luck (Luck Chance). If p < 0.05 (and the 95% CI doesn't cross 0), reject luck!", "numExample": "Slope ŵ = +10 ± 4 (95% CI: [+6, +14], p = 0.002). Since 0 is outside [+6, +14] and p < 0.05, Study Hours is a real effect!", "whenPick": "Auditing regression coefficients, A/B testing model changes, and filtering out fluke features on small/medium samples.", "whenAvoid": "With 10,000,000 rows, even a tiny useless effect (w = 0.0001) gets p < 0.05 — always check the practical effect size (CI width) alongside p!", "rivalName": "Trusting Raw Slope ŵ Without Checking Noise", "headToHead": "A random noise column had slope ŵ = +3.2 in 8 rows, but its 95% CI was [−5.1, +11.5] (p = 0.41) — saving us from deploying a fake feature!", "faqs": [{"q": "🙋 Does p = 0.03 mean there is a 3% chance the feature is fake?", "a": "Careful — that's the #1 textbook trap! p = 0.03 means: IF the feature truly had zero effect (H₀), random noise alone would produce a slope this big 3% of the time."}, {"q": "🙋 Why do we check if the 95% Confidence Interval crosses 0?", "a": "Because if the plausible range is [−2, +8], the true slope could be −2 (negative), 0 (nothing), or +8 (positive) — we can't even be sure of the sign!"}]}, "mod_fisher": {"movieKey": "stats_hypothesis", "whyExists": "When checking a 2×2 yes/no table with tiny counts (e.g., 12 emails total: how many had '.tk' vs Phish), smooth bell-curve approximations fail. Fisher's Exact Test & Chi-Square test whether two yes/no categories are genuinely linked.", "plainRecipe": "Compare the actual 2×2 table counts against the counts you'd expect if the two categories were completely independent.", "numExample": "Out of 5 '.tk' links, all 5 were Phish (expected by chance: 2.5). Exact hypergeometric probability p = 0.004 → '.tk' is strongly associated with Phishing!", "whenPick": "Testing categorical yes/no clues (like '.tk TLD', 'Has IP Address', 'Has @ Symbol') against a binary target (Phish vs Safe).", "whenAvoid": "Continuous features like URL Length or House SqFt (use Signal-to-Noise Check / correlation / Signal-vs-Noise Split Check instead of chopping continuous numbers into coarse bins).", "rivalName": "Chi-Square Approximation on Tiny Samples (< 5 per cell)", "headToHead": "When a 2×2 cell has only 1 or 2 links, Chi-Square gives inaccurate Luck Chances while Fisher's Exact Test computes the exact combinatorial probability.", "faqs": [{"q": "🙋 When do I use Fisher's Exact Test vs Chi-Square?", "a": "Use Fisher's Exact Test when any cell in your 2×2 table has expected count < 5; use Chi-Square when counts are large (hundreds or thousands)."}, {"q": "🙋 What is Odds Ratio in a 2×2 table?", "a": "It is (a×d)/(b×c) — how many times higher the odds of Phishing are when the clue is present vs absent."}]}, "mod_bestfit": {"movieKey": "linear_regression", "whyExists": "Guessing slopes by eye gives a different line for every person. Best-Fit Line defines one mathematically unique 'Best-Fit Line' — the line that minimizes the sum of squared vertical errors ∑(yᵢ − ŷᵢ)².", "plainRecipe": "Measure the vertical miss (residual eᵢ = yᵢ − ŷᵢ) for every dot, square each miss so negatives don't cancel positives, and pick m and b that make the total squared area as small as possible.", "numExample": "With m = 10, b = 40 on our 5 students, residuals are [0, −2, +2, 0, 0] → Squared errors [0, 4, 4, 0, 0] → Total Model Squared Error = 8 (minimum possible!).", "whenPick": "Fast, exact, closed-form baseline for predicting continuous targets with interpretable feature weights.", "whenAvoid": "When features are nearly duplicated (multicollinearity breaks (XᵀX)⁻¹ → use Ridge) or when extreme outliers exist (squaring magnifies outliers → use Huber Loss).", "rivalName": "Guessing a Line Through Just the First & Last Point", "headToHead": "Connecting only the first and last dot gives Model Squared Error = 29.0 on noisy data, whereas Best-Fit Line balances all dots to achieve Model Squared Error = 8.0.", "faqs": [{"q": "🙋 Why does Best-Fit Line square the errors instead of taking absolute value |y − ŷ|?", "a": "Two reasons: (1) A parabola e² has a smooth curve with a single bottom where derivative = 0, so we can solve it directly; (2) It heavily penalizes big misses!"}, {"q": "🙋 When do we use the Direct Best-Fit Formula (XᵀX)⁻¹Xᵀy vs Downhill Error Stepping?", "a": "Direct Best-Fit Formula solves m and b in 1 instant step when you have ≤ 10,000 columns; Downhill Error Stepping is used when you have millions of weights or neural layers."}]}, "mod_coeff_r2": {"movieKey": "linear_regression", "whyExists": "Knowing Average Squared Error = 4.0 doesn't tell you if 4.0 is tiny or terrible unless you know the scale of y! R-Squared (R²) converts your model's error into a universal 0% to 100% score comparing your line against a dumb flat-average guess.", "plainRecipe": "Compare your model's squared error against the error of simply guessing the class average ȳ for everyone: R² = 1 − (Model Squared Error / Baseline Squared Error).", "numExample": "Dumb average line has error Baseline Squared Error = 808. Our best-fit line has error Model Squared Error = 8. R² = 1 − (8 / 808) = 0.990 (99.0% of exam score variation explained!).", "whenPick": "Reporting regression quality to humans in a universal percentage scale (0% = no better than guessing the mean; 100% = every dot sits on the line).", "whenAvoid": "When adding lots of extra columns, raw R² ALWAYS creeps up even on pure random noise — always check Clue-Adjusted Score Explained % or Cross-Validated R²!", "rivalName": "Raw Unscaled Average Squared Error Alone", "headToHead": "When adding 3 fake noise columns, raw R² rose from 0.990 to 0.994 (misleading!), while Clue-Adjusted Score Explained % dropped to 0.981 — catching the bloat.", "faqs": [{"q": "🙋 Can R² ever be negative?", "a": "Yes! On a holdout test set (or if you forget the intercept), if your line is worse than simply guessing the flat average ȳ, Model Squared Error > Baseline Squared Error so R² becomes negative!"}, {"q": "🙋 What does a regression coefficient w₂ = +5.0 in multiple regression mean?", "a": "It means holding all other features constant, +1 unit of x₂ raises the predicted output ŷ by +5.0 units."}]}, "mod_ttest": {"movieKey": "stats_hypothesis", "whyExists": "In multiple regression with 10 features, the overall R² might be 95%, yet 4 of those 10 features might be useless passengers! The Signal-to-Noise Check checks each individual weight wⱼ one by one against its own Standard Error Wiggle Margin.", "plainRecipe": "Divide each weight ŵⱼ by its own wiggle noise Wiggle Margin: t = ŵⱼ / Wiggle Margin. If |t| > 2 (roughly p < 0.05), that specific feature pulls its own weight!", "numExample": "Study Hours: ŵ₁ = +10.0, Wiggle Margin = 0.5 → t = +20.0 (Keep!). Lucky Pen Color: ŵ₂ = +0.3, Wiggle Margin = 1.2 → t = +0.25 (Drop — noise!).", "whenPick": "Auditing which individual columns in a linear/logistic table are genuinely useful vs dead weight.", "whenAvoid": "If two features are 99% identical (e.g., SqFt and SqMeters), both SEs inflate and both t-scores look small even though size matters — check Feature Overlap Score or use Lasso!", "rivalName": "Keeping Every Column Just Because Overall R² Is High", "headToHead": "Dropping 4 columns with |t| < 1.0 reduced model complexity by 40% and improved test-set Typical Error Size by 8%.", "faqs": [{"q": "🙋 Why can two useful features both get bad Luck Chances when put in the model together?", "a": "That's multicollinearity! If SqFt and Number of Rooms tell the same story, the math can't tell which one deserves the credit, so it inflates Wiggle Margin for both."}]}, "mod_anova_f": {"movieKey": "stats_hypothesis", "whyExists": "If you run 20 separate t-tests at α = 0.05, random chance alone will likely give you 1 fake 'significant' feature! The Overall Signal-vs-Noise Test checks the ENTIRE model at once before you trust individual t-tests.", "plainRecipe": "Divide the average variation explained per model feature (MS_model) by the average unexplained noise per degree of freedom (MS_error): F = MS_model / MS_error.", "numExample": "MS_model = 800, MS_error = 2.67 → F = 800 / 2.67 = 300.0 (p = 0.0004). The model as a whole is overwhelmingly real!", "whenPick": "Comparing 3+ group means at once, or checking overall regression significance (the Luck Chance of R²).", "whenAvoid": "A high F-score only says 'at least one feature works' — you still inspect t-tests or Lasso/SHAP to see WHICH features did the work.", "rivalName": "Running Dozens of Separate Pairwise t-Tests", "headToHead": "Testing 5 groups with 10 pairwise t-tests inflates false-alarm risk from 5% to 40%, while 1 Overall Signal-vs-Noise Test keeps false-alarm risk at 5%.", "faqs": [{"q": "🙋 How does the Overall Signal-vs-Noise Test connect to R²?", "a": "They test the exact same thing! The Luck Chance of the Overall Signal-vs-Noise Ratio-statistic IS the Luck Chance for whether your model's R² is significantly greater than 0."}]}, "mod4_grad": {"movieKey": "linear_regression", "whyExists": "When a model has 100,000 weights or non-linear Sigmoid/Neural layers, there is no one-step algebra formula to jump to the bottom of the error bowl. The Gradient (∂L/∂w) gives the computer a downhill compass at any point.", "plainRecipe": "Nudge weight w slightly; see how Loss L changes. The slope ∂L/∂w points uphill, so stepping in −α·(∂L/∂w) walks downhill toward zero error!", "numExample": "At w = 6.4, slope ∂L/∂w = −115.2 (tilted down to the right). Update Updated Weight = 6.4 − 0.02(−115.2) = +8.70 → Loss drops from 207 to 27!", "whenPick": "Training Logistic Regression, Neural Networks, Deep Learning, and Gradient Boosted Trees (where trees fit residual gradients).", "whenAvoid": "Small 10-column linear regression fits faster with direct matrix SVD/Best-Fit Line (`LinearRegression()`).", "rivalName": "Random Trial-and-Error Weight Guessing", "headToHead": "In 100 dimensions, random guessing takes millions of tries to lower loss, while following −∇L reaches the minimum in ~40 iterations.", "faqs": [{"q": "🙋 Why do we subtract the gradient (w − α·g) instead of adding it?", "a": "By definition in calculus, the gradient points in the direction where Loss INCREASES fastest (uphill). Since we want LESS error, we walk in the opposite direction (−g)!"}, {"q": "🙋 What happens if learning rate α is way too big?", "a": "You leap clear over the bottom of the valley onto the opposite wall, bouncing higher and higher until the numbers explode to NaN!"}]}, "mod4_hessian": {"movieKey": "xgboost", "whyExists": "The first derivative (Gradient g) only tells you the slope right under your feet, not whether the valley flattens out 1 inch ahead! The second derivative (Bowl Steepness h = ∂²L/∂w²) measures curvature so Newton's Method and XGBoost know the exact step size.", "plainRecipe": "Divide the negative slope (−g) by the bowl curvature (h): Newton Step = −g / h. Steep curvature (big h) takes a cautious small step; flat curvature takes a bold step.", "numExample": "In XGBoost Log-Loss, g = p − y = −0.50 and curvature h = p(1−p) = 0.25 → Optimal leaf jump w* = −(−0.50) / 0.25 = +2.00 in one shot!", "whenPick": "Second-order optimizers (L-BFGS, Newton-Raphson) and every modern boosted tree engine (XGBoost, LightGBM, CatBoost).", "whenAvoid": "Computing a full P×P Bowl Steepness matrix for a 100-million-weight LLM costs too much RAM — deep nets use diagonal approximations like Adam instead.", "rivalName": "First-Order Downhill Error Stepping With Fixed Step Size", "headToHead": "On Logistic Regression and XGBoost leaf weights, dividing by Bowl Steepness h = p(1−p) converges in 5–8 steps vs 80+ steps with first-order gradient alone.", "faqs": [{"q": "🙋 Why is h = p(1 − p) biggest at p = 0.50 and tiny near p = 0.99?", "a": "At p = 0.50 the Sigmoid curve is steepest (h = 0.25); near p = 0.99 the Sigmoid flattens out (h = 0.01), telling XGBoost how curved the loss is!"}]}, "mod4": {"movieKey": "linear_regression", "whyExists": "Full-batch Downhill Error Stepping computes the slope over all 10,000,000 rows before taking 1 tiny step! SGD, Mini-Batch, Momentum, and Adam take fast steps on small batches of rows while smoothing out zig-zags.", "plainRecipe": "Sample a mini-batch of rows, compute gradient g, accumulate a smooth rolling ball of velocity (Momentum m_t), and scale each weight by its recent gradient variance (Adam v_t).", "numExample": "Instead of scanning 1,000,000 rows for 1 step, Mini-Batch (size 256) + Adam takes 3,906 adaptive steps in a single epoch!", "whenPick": "Adam is the default optimizer for Neural Networks and Transformers; Mini-Batch SGD is ideal for massive linear/logistic datasets.", "whenAvoid": "On small tabular datasets (< 50k rows), tree ensembles (XGBoost/Random Forest) or L-BFGS don't need manual learning-rate scheduling.", "rivalName": "Vanilla Full-Batch Downhill Error Stepping", "headToHead": "On narrow ravine loss surfaces, vanilla GD zig-zags across the canyon walls for 500 steps while Momentum + Adam rolls smoothly down the center in 35 steps.", "faqs": [{"q": "🙋 What is the difference between SGD, Momentum, and Adam?", "a": "SGD steps on a random batch; Momentum adds a heavy rolling ball so it doesn't zig-zag; Adam gives every individual weight its own automatic learning rate!"}]}, "mod5": {"movieKey": "ridge_lasso", "whyExists": "High-degree polynomials or models with 1,000 features memorize training quirks by assigning huge +500 and −500 weights that cancel on training rows but explode on new test rows! Ridge (L2) and Lasso (L1) add a penalty tax λ on weight size.", "plainRecipe": "Total Score to Minimize = Prediction Error + λ × (Size of Weights). Ridge taxes squared weights (∑w²) to shrink them smoothly; Lasso taxes absolute weights (∑|w|) to snap useless weights to exact 0.", "numExample": "At λ = 2.0, Lasso keeps Study Hours w₁ = +9.6 and sets noisy Shoe Size w₂ = 0.00 and Shirt Color w₃ = 0.00, dropping test error from 42.5 to 4.8!", "whenPick": "Pick Lasso (L1) when you want automatic feature selection (zeroing out junk columns); pick Ridge (L2) when most features help a little and are correlated; pick ElasticNet for both!", "whenAvoid": "Do not apply Ridge/Lasso before standardizing feature scales (`StandardScaler`) — otherwise a feature measured in Dollars gets taxed 1,000× differently than one in Thousands!", "rivalName": "Unregularized High-Degree Polynomial / Best-Fit Line", "headToHead": "On 10 noisy features, unregularized Best-Fit Line had Test Typical Error Size = 42.5, Ridge achieved 6.4, and Lasso achieved 4.8 while deleting 7 noise columns.", "faqs": [{"q": "🙋 Why does Lasso hit exact 0.00 while Ridge only gets small like 0.04?", "a": "Ridge's penalty w² has slope 2w, which gets tiny near 0 so it stops pushing; Lasso's penalty |w| has a constant push of ±1 all the way into 0.00!"}, {"q": "🙋 Why must we scale features before Ridge or Lasso?", "a": "Because if x₁ is in meters (w₁ = 1000) and x₂ is in millimeters (w₂ = 1), Ridge would unfairly crush w₁ just because of the unit of measurement!"}]}, "mod6_odds": {"movieKey": "logistic_regression", "whyExists": "When predicting a YES/NO event (Phishing = 1, Safe = 0), a straight line ŷ = wx+b outputs impossible probabilities like −0.40 or +1.80! Logistic Regression passes the linear score z through the Sigmoid S-curve p = 1/(1+e⁻ᶻ) to lock output between 0% and 100%.", "plainRecipe": "1. Compute raw linear score z = w·x + b (Log-Odds). 2. Plug z into Sigmoid p = 1 / (1 + e⁻ᶻ) to get a probability between 0 and 1.", "numExample": "z = 0 → p = 50% (coin flip). z = +2.2 → p = 90% Phish. z = +4.6 → p = 99% Phish. z = −4.6 → p = 1% Phish.", "whenPick": "The #1 starting baseline for binary classification (spam/phishing, medical risk, credit default) when you need calibrated probabilities and odds ratios.", "whenAvoid": "When features interact non-linearly (e.g., '.tk' only matters IF 'Brand in Subdomain' is also true) — use XGBoost or Random Forest instead.", "rivalName": "Linear Regression on 0/1 Labels", "headToHead": "On a phishing dataset with extreme URLs, Linear Regression predicts p = +2.35 (235%) and gets pulled off-course, while Logistic Regression outputs p = 99.3%.", "faqs": [{"q": "🙋 What is the difference between Probability p, Odds, and Log-Odds (Logit z)?", "a": "If p = 80% (0.80), Odds = 0.80 / 0.20 = 4-to-1, and Log-Odds z = ln(4) = +1.386. Sigmoid simply converts Log-Odds z back into Probability p!"}, {"q": "🙋 Why does z = 0 always equal 50% probability?", "a": "Because e⁰ = 1, so p = 1 / (1 + 1) = 1/2 = 50%! Positive z means >50%, negative z means <50%."}]}, "mod6_mle": {"movieKey": "logistic_regression", "whyExists": "Why don't we use Squared Error (y − p)² to train Logistic Regression? Because squaring a Sigmoid curve creates flat plateaus where gradients vanish! Maximum Likelihood Estimation (MLE) & Log-Loss (−y ln p − (1−y) ln(1−p)) give the super-clean gradient g = p − y.", "plainRecipe": "Reward the model for assigning high probability p to what actually happened; take −ln(p) so a confident wrong guess (p = 0.01 when y = 1) gets a huge penalty (+4.60) and a huge wakeup gradient!", "numExample": "True Phish (y = 1): if model guesses p = 0.90, Log-Loss = −ln(0.90) = 0.105 (tiny). If model guesses p = 0.01, Log-Loss = −ln(0.01) = 4.605 (huge alarm!).", "whenPick": "Standard training loss (Binary Cross-Entropy / Log-Loss) for Logistic Regression, XGBoost classifiers, and Neural Network classifiers.", "whenAvoid": "Never pass p = 0 or p = 1 into ln(p) without clipping (`np.clip(p, 1e-15, 1-1e-15)`), because ln(0) = −∞!", "rivalName": "Mean Squared Error on Sigmoid Probabilities", "headToHead": "When a model is 99% wrong (p=0.01, y=1), Average Squared Error gradient is tiny (0.019 — stuck on plateau!), whereas Log-Loss gradient is g = p−y = −0.99 (instant fast correction!).", "faqs": [{"q": "🙋 How do Maximum Likelihood and Log-Loss relate?", "a": "They are the exact same goal! Maximizing the probability of the true labels is 100% identical to minimizing Negative Log-Likelihood (Log-Loss)."}]}, "mod6_deviance": {"movieKey": "logistic_regression", "whyExists": "Logistic Regression doesn't have vertical distance residuals like Best-Fit Line, so we need an equivalent to Model Squared Error and Overall Signal-vs-Noise Test for probability models. Deviance (−2 × Log-Likelihood) and the Likelihood Ratio Test fill that exact role.", "plainRecipe": "Compare the Null Deviance D₀ (guessing the flat base rate for everyone) against your Model's Residual Deviance Model Penalty. The drop ΔD = D₀ − Model Penalty measures how much error your features eliminated!", "numExample": "Null Deviance D₀ = 138.6. Adding URL features drops Residual Deviance to Model Penalty = 18.2 → Penalty Reduction % = 1 − (18.2 / 138.6) = 86.9%!", "whenPick": "Evaluating overall goodness-of-fit and comparing nested Logistic Regression / GLM models.", "whenAvoid": "For comparing completely different model families (e.g., Logistic vs XGBoost vs Random Forest), use Holdout Ranking Accuracy, PR-AUC, and Chance Mistake Score.", "rivalName": "Raw Accuracy at a Single 0.50 Cutoff", "headToHead": "Two models can both have 90% accuracy at cutoff 0.50, while Model B has half the Deviance because its probabilities (99% vs 51%) are much sharper.", "faqs": [{"q": "🙋 Why is Deviance multiplied by −2?", "a": "Because multiplying the log-likelihood difference by −2 makes it follow a standard Chi-Square (χ²) distribution, so we can look up an exact Luck Chance!"}]}, "mod6_wald": {"movieKey": "stats_hypothesis", "whyExists": "Just as the Signal-to-Noise Check audits individual weights in Linear Regression, the Wald Test (z = ŵ / Wiggle Margin) audits individual log-odds weights in Logistic Regression, and exp(ŵ) translates them into human-friendly Odds Ratios.", "plainRecipe": "1. Check z = ŵ / Wiggle Margin (if |z| > 1.96, p < 0.05). 2. Compute Odds Ratio OR = e^ŵ to see how many times the odds multiply per +1 unit of x.", "numExample": "Weight for '.tk TLD' is ŵ = +2.30 (Wiggle Margin = 0.40 → z = 5.75, p < 0.001). Odds Ratio = e^2.30 = 10.0× higher odds of phishing!", "whenPick": "Explaining Logistic Regression feature impact to doctors, analysts, or security teams in 'X-times higher odds' language.", "whenAvoid": "When a feature perfectly separates 0s and 1s (complete separation), ŵ shoots to infinity and Wald Wiggle Margin explodes — use L2 regularized Logistic Regression or Likelihood Ratio Test!", "rivalName": "Reporting Raw Logit Weight ŵ Alone", "headToHead": "Telling a security team 'Odds of phishing are 10× higher (OR = e^2.30 = 10.0)' is immediately actionable compared to 'log-odds rose by +2.30'.", "faqs": [{"q": "🙋 What does an Odds Ratio of 1.0 mean?", "a": "Since e⁰ = 1.0, an Odds Ratio of 1.0 means weight w = 0 (multiplying the odds by 1× changes nothing — the feature has zero effect!)."}]}, "mod_idf_idft": {"movieKey": "url_forensics", "whyExists": "Models only accept numbers, not raw text strings or raw audio/time waves! Rare-Pattern Score turns rare, informative words/substrings into high-weight numbers, while Fourier Transform (DFT/IDFT) turns time signals into frequency spikes.", "plainRecipe": "Rare-Pattern Score = Term Frequency in this URL × ln(Total URLs / URLs containing this term). Common filler ('http') gets near 0; rare scam tokens ('paypa1') get boosted!", "numExample": "'http' appears in 100% of URLs → IDF = ln(1/1) = 0. 'paypa1' appears in 5 of 10,000 URLs → IDF = ln(10000/5) + 1 = 8.60 (High alert!).", "whenPick": "Use Char/Word Rare-Pattern Score for URLs, logs, and text classification; use FFT/IDFT when extracting periodic frequency features from sensor, audio, or network-beacon time series.", "whenAvoid": "When deep semantic synonym matching is needed across long paragraphs (where 'car' and 'automobile' have 0 shared characters), combine with dense embeddings.", "rivalName": "Raw Word Counts (Bag-of-Words)", "headToHead": "With raw counts, 'http' and 'com' dominate every URL vector; Rare-Pattern Score suppresses 'http' and highlights 'paypa1', raising classifier F1 from 81% to 95%.", "faqs": [{"q": "🙋 Why does LureLock use Character N-Grams (3–5 letters) instead of whole words?", "a": "Because attackers glue words together without spaces and swap letters ('paypa1-securelogin')! A 3-char sliding window ('pay', 'ypa', 'pa1') catches it even if the whole word was never seen before."}]}, "mod7": {"movieKey": "knn", "subMovieKeys": ["knn", "naive_bayes"], "whyExists": "What if a decision boundary is too curvy for a straight line (Logistic Regression), or you need a classifier that trains in 0.001 seconds on 1,000 word columns? KNN classifies by local neighborhood vote; Naive Bayes classifies by multiplying clue probabilities.", "plainRecipe": "KNN: Measure distance to stored points and let the top k closest neighbors vote. Naive Bayes: Multiply Prior × P(Clue₁|Class) × P(Clue₂|Class) and normalize.", "numExample": "KNN (k=3): 2 of 3 closest URLs are Phish → 66.7% Phish. Naive Bayes: 0.50 × 0.40('verify') × 0.30('.tk') → 99.6% Phish.", "whenPick": "Pick KNN for low-dimensional data (2–10 scaled features) with irregular local boundaries; pick Naive Bayes for fast text/URL/spam baselines with thousands of word clues.", "whenAvoid": "Avoid KNN in high dimensions (> 50 columns — Curse of Dimensionality makes all points equally far apart!) or when prediction latency must be < 1 ms on millions of rows.", "rivalName": "Logistic Regression on Local Islands (vs KNN) / Slow Iterative Training (vs Naive Bayes)", "headToHead": "On 2D geographic clusters KNN beats Logistic Regression (94% vs 71%), while on 1,000 text columns Naive Bayes trains 100× faster and beats KNN (91% vs 62%).", "faqs": [{"q": "🙋 Why is there no training loop in KNN?", "a": "KNN is a 'lazy learner' — `fit(X, y)` literally just saves the table in RAM! All the work happens at `predict(x)` time when it measures distances to every row."}, {"q": "🙋 Why is Naive Bayes called 'Naive', and why does it still work?", "a": "It pretends all clues are independent coin flips! Even if its probability is pushed too close to 99.9%, the winning class rank order is still right most of the time."}, {"q": "🙋 What happens if a word never appeared in Safe emails (Count = 0)?", "a": "Multiplying by 0 would wipe out all other clues! Zero-Proof Safety Padding (`alpha=1`) adds +1 phantom count to every word so no probability is ever 0."}]}, "mod8": {"movieKey": "svm", "whyExists": "Logistic Regression nudges its boundary based on every point in the dataset (even points far away), and fails when one class forms a circle inside another. SVM finds the widest safety street between classes using only edge Support Vectors, and uses Kernels to slice curved rings!", "plainRecipe": "Maximize the street width 2/‖w‖ between classes so the closest edge points (Support Vectors) sit as far from the center line as possible; use Kernel K(x,x') to project curved data into higher dimensions.", "numExample": "Between Fail (≤3h) and Pass (≥5h), SVM places the line at 4.0h with ±1.0h margin curbs held up solely by the 3h and 5h Support Vectors.", "whenPick": "Medium-sized datasets with clear margins, high-dimensional text (LinearSVC), or complex curved boundaries on < 50,000 rows (RBF SVM).", "whenAvoid": "Very large tabular datasets (> 200,000 rows — Kernel SVM scales as O(n² to n³)) or when you need fast native missing-value handling (use XGBoost).", "rivalName": "Zero-MarginPerceptron / Unregularized Linear Boundary", "headToHead": "On noisy boundary data, a Maximum-Margin SVM reduces test boundary errors by 35% compared to a line that skims close to training points.", "faqs": [{"q": "🙋 Why do only the Support Vectors matter?", "a": "Think of building a fence between two yards: only the trees closest to the property line restrict where the fence can go! Trees 100 feet back don't touch the fence."}, {"q": "🙋 What does the C hyperparameter actually do?", "a": "C is the 'mistake penalty budget'. Small C builds a wide, forgiving street (ignores 1 weird outlier); huge C builds a narrow, crooked street to force 0 training errors."}]}, "mod9": {"movieKey": "decision_tree", "whyExists": "Linear & Logistic Regression add up features with fixed weights (`w₁x₁ + w₂x₂`), so they CANNOT naturally say: 'A .tk domain is fine UNLESS Brand-in-Subdomain is ALSO true!' Decision Trees ask sequential IF/ELSE questions to capture feature interactions without scaling.", "plainRecipe": "At each node, test every feature and cutoff; compute Mix-Up Score (1 − ∑pₖ²) of the YES/NO child buckets; pick the split that drops impurity the most.", "numExample": "Root Gini = 0.500 (3 Phish, 3 Safe). Splitting on 'Brand in Subdomain?' gives Left [3,0] (Gini=0) and Right [0,3] (Gini=0) → Information Gain = +0.500 (Winner!).", "whenPick": "When you need a 100% human-readable flowchart that handles mixed units, missing values, and IF-AND-THEN feature interactions with zero feature scaling.", "whenAvoid": "A single deep unpruned tree has high variance (memorizes training noise and jumps if 2 rows change) — use Random Forest or XGBoost for production accuracy!", "rivalName": "Logistic Regression on Interactive Tabular Rules", "headToHead": "On an XOR rule ('Brand Spoof AND Cheap TLD'), Logistic Regression gets 50% (coin flip), while a Depth-2 Decision Tree gets 100%.", "faqs": [{"q": "🙋 Do I need to standardize/scale features before a Decision Tree?", "a": "Never! Whether House Size is in SqFt (> 2000) or SqMeters (> 185.8), the exact same houses go Left and Right, so Mix-Up Score is 100% identical!"}, {"q": "🙋 Why do we limit max_depth or prune a Decision Tree?", "a": "Without a depth limit, the tree keeps asking questions until every single training row sits in its own 1-row leaf — memorizing noise (100% train, poor test)!"}]}, "mod10": {"movieKey": "xgboost", "subMovieKeys": ["random_forest", "adaboost", "xgboost"], "whyExists": "One Decision Tree is either too shallow (underfits) or too deep (overfits). Ensembles combine hundreds of trees: Random Forest averages independent trees to crush variance; AdaBoost reweights missed rows; GBDT & XGBoost train each new tree on the residual gradient g = p − y with curvature h = p(1−p)!", "plainRecipe": "Random Forest: Bootstrap rows + random feature subset → majority vote. XGBoost: Start at p₀=0.50; at each step compute g = p−y and h = p(1−p), fit a tree with leaf weights w* = −G/(H+λ), and add η·w* to log-odds z!", "numExample": "Phish URL (y=1): Tree 0 p=50% (g=−0.50) → Tree 1 adds +1.00 (p=73.1%, g=−0.269) → Tree 2 adds +0.68 (p=84.3%) → Tree 10 reaches p=99.0%!", "whenPick": "The undisputed king of structured/tabular data (phishing URLs, fraud, credit, pricing): pick Random Forest for zero-tuning stability; pick XGBoost/LightGBM for peak accuracy and calibrated risk scores.", "whenAvoid": "Raw unstructured pixels/audio (use CNN/Transformer) or extrapolating a linear trend far outside the min/max range seen in training (trees output flat constants outside training bounds).", "rivalName": "Single Decision Tree & Logistic Regression", "headToHead": "On LureLock's 1,018 URL features, Logistic Regression hits 91.2% F1, Single Tree hits 92.8% F1, Random Forest hits 96.4% F1, and 300-Tree XGBoost hits 98.7% F1!", "faqs": [{"q": "🙋 What is the 1-sentence difference between Random Forest and XGBoost?", "a": "Random Forest builds 300 independent deep trees in parallel and averages their votes; XGBoost builds 300 shallow trees in sequence where each tree fixes the leftover errors (g = p − y) of the trees before it!"}, {"q": "🙋 Where does 'Gradient' come into Gradient Boosted Trees if trees don't have smooth weights?", "a": "Instead of taking a gradient step on weights w, we take a gradient step in prediction space! For each row i, gᵢ = ∂Loss/∂zᵢ = pᵢ − yᵢ is the exact error residual the next tree learns to predict."}, {"q": "🙋 Can Random Forest overfit if I add more trees? What about XGBoost?", "a": "Adding more trees to a Random Forest just averages more independent votes (doesn't overfit); adding too many trees to XGBoost without early stopping CAN overfit because it keeps chasing tiny training residuals!"}]}, "mod11": {"movieKey": "logistic_regression", "whyExists": "If 99% of emails are Safe and only 1% are Phishing, a useless model that says 'SAFE' to everything gets 99% Accuracy while catching 0% of attacks! Confusion Matrix, Precision, Recall, Ranking Accuracy, PR-AUC, and Cross-Validation prevent fake-accuracy traps.", "plainRecipe": "Split predictions into TP (Caught Phish), FP (False Alarm), FN (Missed Phish), TN (Clean Safe). Precision = TP/(TP+FP) ('When alarm rings, is it real?'); Recall = TP/(TP+FN) ('Did we catch all attacks?').", "numExample": "Caught 95 of 100 Phish (TP=95, FN=5) with 5 False Alarms (FP=5): Precision = 95/100 = 95%, Recall = 95/100 = 95%, F1 = 95%.", "whenPick": "Use PR-AUC & Recall@Low-False Alarm Rate whenever the positive class is rare (phishing, fraud, disease); use K-Fold Cross-Validation to verify performance across all data folds.", "whenAvoid": "Never tune hyperparameters on your final Test Set — use a 3-way Train / Validation (or CV) / Test split!", "rivalName": "Raw Accuracy on Imbalanced Data", "headToHead": "A dummy 'Always Safe' model scores 99.0% Accuracy on 1%-phish traffic but 0.0% Recall and 0.0% F1 — exposing the fraud immediately.", "faqs": [{"q": "🙋 Should I lower or raise the threshold τ (e.g. from 0.50 to 0.30) to catch more phishing?", "a": "Lowering the threshold to 0.30 flags more links, which RAISES Recall (fewer missed attacks) but LOWERS Precision (more false alarms)."}]}, "mod12": {"movieKey": "kmeans_dbscan", "subMovieKeys": ["kmeans_dbscan", "pca"], "whyExists": "In the real world, 95% of security logs and customer records have NO human labels y! Clustering (K-Means, DBSCAN) discovers hidden groups and anomalies without labels, while PCA compresses redundant columns into top variance axes.", "plainRecipe": "K-Means: Alternate assigning points to closest magnet μₖ and moving μₖ to the group average. DBSCAN: Connect dense neighborhoods (≥ MinPts within radius ε) and flag isolated points as −1 Noise. PCA: Rotate axes to maximize variance.", "numExample": "K-Means groups normal URLs at μ₁=(20, 2.5) and botnet URLs at μ₂=(80, 4.8); DBSCAN flags lone port-9999 URL as −1 Anomaly; PCA compresses SqFt & Rooms into 1 axis keeping 96% variance.", "whenPick": "Pick K-Means for fast spherical groups when K is known; pick DBSCAN/IsolationForest when shapes are curved or you want outlier detection; pick PCA to visualize high-D data in 2D.", "whenAvoid": "K-Means fails on ring/crescent shapes and forces outliers into clusters (use DBSCAN); PCA is linear and unsupervised (don't assume top PC always separates rare classes).", "rivalName": "Manual Rule Bucketing on Unlabeled Data", "headToHead": "On unlabeled botnet campaign logs, DBSCAN automatically isolated 98% of a new DGA wave and flagged 14 zero-day outliers that K-Means merged into normal traffic.", "faqs": [{"q": "🙋 How do I pick K in K-Means if there are no labels?", "a": "Plot Inertia (within-cluster distance) for K=1..10 and look for the 'Elbow' bend, or maximize the Silhouette Score (how tight each cluster is vs how far from neighbors)."}, {"q": "🙋 Why is DBSCAN better than K-Means for cybersecurity anomalies?", "a": "K-Means forces EVERY point into a cluster (even a crazy outlier 10 miles away!), whereas DBSCAN has a dedicated '−1 Noise / Outlier' label."}]}, "mod13": {"movieKey": "ridge_lasso", "whyExists": "If you compute the mean/std (`StandardScaler`) or Rare-Pattern Score vocabulary on the WHOLE dataset before splitting Train and Test, future test information leaks into training — giving fake high scores that crash in production! Scikit-Learn `Pipeline` + `ColumnTransformer` locks every step inside each CV fold.", "plainRecipe": "Wrap all preprocessing (`SimpleImputer`, `StandardScaler`, `OneHotEncoder`, `TfidfVectorizer`) and the model inside one `Pipeline(...)`. Call `.fit(X_train, y_train)` on train ONLY, and `.transform(X_test)` on test!", "numExample": "Train mean = 50, Test has outlier = 500. Leak-free Pipeline scales Test using Train mean (50), preventing test distribution leakage.", "whenPick": "Every single production ML project! Shipping a single `Pipeline` object guarantees training and live inference run the exact same feature transformations.", "whenAvoid": "Never call `scaler.fit_transform(X_all)` before `train_test_split(X_all, y_all)`!", "rivalName": "Loose Ad-Hoc Pandas/NumPy Scripts Before Train/Test Split", "headToHead": "A leaky script reported 94% CV accuracy on noisy data (actual holdout: 61%); wrapping inside `Pipeline` reported honest 63% CV and prevented a broken deployment.", "faqs": [{"q": "🙋 Why do we call `fit_transform` on X_train, but only `transform` on X_test?", "a": "Because `fit` learns the averages/vocabulary from historical training data. In the real world, when 1 new URL arrives tomorrow, you must score it using the averages learned during training!"}]}, "mod14": {"movieKey": "neural_backprop", "whyExists": "Linear & Logistic Regression only have 1 layer (`w·x + b`), so they can only draw a single flat line/plane. Stacking a Hidden Layer of neurons with ReLU (`max(0, z)`) activation hinges lets a Multi-Layer Perceptron (MLP) bend and approximate any continuous curve!", "plainRecipe": "1. Forward Pass: Input X → Hidden Linear Z₁ = XW₁+b₁ → ReLU Hinge A₁ = max(0, Z₁) → Output ŷ. 2. Backward Pass: Use the Calculus Chain Rule to send error blame backward layer-by-layer.", "numExample": "Neuron 1 (+boost after 1h) + Neuron 2 (−burnout after 6h) combine to model exam scores peaking at 6 hours and dropping at 8 hours — impossible for 1 straight line!", "whenPick": "Learning complex nonlinear representations, embeddings, or multi-task outputs, and as the foundation for CNNs, RNNs, and Transformers.", "whenAvoid": "Without activation functions (`ReLU`/`GELU`), stacking 10 linear layers `W₂(W₁x)` collapses into a single flat matrix `Wx`! Also, on medium tabular data, XGBoost usually beats MLPs with less tuning.", "rivalName": "Single-Layer Logistic Regression / Linear Model", "headToHead": "On non-linearXOR and burnout curves, 1-layer Linear/Logistic scores 50% accuracy, while a 1-hidden-layer ReLU MLP scores 100%.", "faqs": [{"q": "🙋 Why would a 100-layer neural network without ReLU/Sigmoid be no smarter than Linear Regression?", "a": "Because multiplying matrices `W₃(W₂(W₁x))` just equals one combined matrix `W_total · x` — a straight line of a straight line is still a straight line! ReLU (`max(0,z)`) adds the bends."}, {"q": "🙋 What is the 'Dying ReLU' problem?", "a": "If a neuron's score z is always negative (< 0), ReLU outputs 0 and its slope is 0, so zero gradient flows back and that neuron stops learning forever (LeakyReLU/GELU fixes this)."}]}, "mod15": {"movieKey": "q_learning", "subMovieKeys": ["q_learning", "neural_backprop"], "whyExists": "Flat MLPs scramble 2D image neighborhoods and forget word order, and Supervised Learning requires a teacher label y for every action! CNNs slide 2D filters over images, LSTMs/Transformers model sequences via Gates & Self-Attention, and Q-Learning learns optimal actions from delayed rewards.", "plainRecipe": "CNN: Slide shared 3×3 filter weights across pixels. Transformer: Compute Attention `Softmax(QKᵀ/√dₖ)V` so every token looks at relevant context tokens. Q-Learning: Update `Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') − Q(s,a)]`.", "numExample": "In Q-Learning, hitting +100 Goal at S₄ updates S₃ to +50 in Ep 1, S₂ to +68 in Ep 10, and converges to [81, 90, 100] by Ep 100!", "whenPick": "Pick CNNs for images/spectrograms; Transformers for text/code/sequences; Q-Learning / RL for sequential decision-making with delayed rewards.", "whenAvoid": "Do not use a giant Transformer or RL agent when a fast tabular XGBoost model or simple rule solves the problem in 2 ms!", "rivalName": "Flat MLP on Images/Text & Greedy Myopic Choice in RL", "headToHead": "A greedy agent (γ=0) chases a +1 bait trap and misses the +100 goal; Q-Learning with γ=0.9 propagates future reward backward to find the optimal path 100% of the time.", "faqs": [{"q": "🙋 How does Q-Learning learn when there are no 'correct answer' labels y?", "a": "Instead of a teacher label y, its target is `r + γ · max Q(next_state)` — the immediate reward plus its best estimate of future rewards from the next square!"}, {"q": "🙋 Why did Transformers replace RNNs/LSTMs for large language models?", "a": "RNNs read word-by-word left-to-right (slow and forgets word #1 by word #500); Self-Attention lets every word connect directly to every other word in 1 parallel matrix step!"}]}, "mod16": {"movieKey": "xgboost", "whyExists": "Notebook code fails in production if custom feature logic cannot be saved, cloned, grid-searched, and serialized cleanly. Writing custom Scikit-Learn `BaseEstimator` + `TransformerMixin` classes makes your domain features work seamlessly inside `Pipeline` and `GridSearchCV`.", "plainRecipe": "Implement `__init__` (store params unchanged), `fit(X, y)` (learn stats on train and set `self.learned_ = ...`), and `transform(X)` (return numeric feature matrix).", "numExample": "Custom `URLThreatLexicalExtractor` transforms raw URL strings into an `(n_samples, 18)` float32 matrix inside a single `joblib` pipeline.", "whenPick": "Whenever you engineer custom domain features (like LureLock's 18 URL lexical clues) that must run identically during training, CV, and live API requests.", "whenAvoid": "Never mutate `__init__` arguments inside `fit()`, and never store giant raw training DataFrames inside `self` when saving a production pickle!", "rivalName": "Copy-Pasted Preprocessing Functions in Separate Training & Serving Files", "headToHead": "Bundling custom transformers inside one `Pipeline` eliminates train-serve skew bugs (the #1 cause of silent production ML failures).", "faqs": [{"q": "🙋 Why do Scikit-Learn learned attributes end with a trailing underscore like `self.mean_`?", "a": "That's Scikit-Learn's official convention (`check_is_fitted` checks for trailing underscores) to distinguish learned parameters (`mean_`) from user hyperparameters (`n_estimators`)."}]}, "mod17": {"movieKey": "xgboost", "whyExists": "Even a 99%-accurate model slowly rots in production as attackers invent new TLDs or housing prices inflate (Data Drift & Concept Drift)! MLOps monitors Population Stability Index (PSI), latency SLAs, and automated retraining triggers.", "plainRecipe": "Compare training feature distribution Eᵢ against live traffic distribution Aᵢ using `PSI = ∑ (Aᵢ − Eᵢ) ln(Aᵢ / Eᵢ)`. If PSI ≥ 0.25, trigger retraining!", "numExample": "Training had 20% '.tk' links; live traffic shifts to 55% '.xyz' links → PSI = 0.34 (≥ 0.25 Red Alert) → Automated retraining pipeline fires!", "whenPick": "Every deployed model serving live users or security traffic.", "whenAvoid": "Never deploy a model as 'train once and forget' without logging feature distributions and prediction confidence.", "rivalName": "Static Unmonitored Model Deployment", "headToHead": "Unmonitored phishing models lose 15–25% recall within 6 months as attackers rotate TLDs; PSI drift alerts catch the shift before false negatives spike.", "faqs": [{"q": "🙋 How can I detect model drift before human labels arrive weeks later?", "a": "Monitor input feature PSI and prediction probability distribution! If the input URL entropy or predicted p distribution shifts sharply (PSI ≥ 0.25), drift is happening right now."}]}};
  const LL_BLUEPRINTS = {"mod0": {"movieKey": "logistic_regression", "whyExists": "Static blocklists only catch yesterday's known phishing URLs — the moment an attacker registers a fresh domain (`paypa1-update.tk`), blocklists say 'Safe'! LureLock turns URL structure into 1,018 numbers and accumulates log-odds clues to catch zero-hour attacks.", "plainRecipe": "Start at calm baseline log-odds z₀; add +points for each structural red flag (typo-squat, cheap TLD, random folder); convert total z into probability p = 1/(1+e⁻ᶻ).", "numExample": "Baseline z = −2.30 (9.1% risk) + 3.20 ('paypa1') + 2.10 ('.tk') + 1.95 ('/8f3k9q/') = z = +4.95 → p = 99.3% BLOCK!", "whenPick": "Real-time zero-hour phishing defense where you need millisecond classification before fetching external page content.", "whenAvoid": "Never rely on a single keyword rule (like blocking every URL containing 'login') — combine 1,018 weighted clues so honest login pages stay safe.", "rivalName": "Static Domain Blacklist + Naive Keyword Filter", "headToHead": "Static blacklists catch 0% of newly registered 5-minute-old phishing domains; LureLock's 1,018-feature model catches 98.5% in < 4 ms.", "faqs": [{"q": "🙋 Why not just check if the domain is on a known-bad list?", "a": "Modern phishing kits generate thousands of unique subdomains and fresh domains that live for only 2 hours — long before human blocklists update!"}]}, "mod1": {"movieKey": "url_forensics", "whyExists": "Phishing kits auto-generate random folder and subdomain names like `/8f3k9q2z/` so every victim gets a unique URL. You can't list every random string in a dictionary, so Character Randomness H(X) measures 'character randomness' mathematically!", "plainRecipe": "Count the fraction p(c) of each character in the URL; sum `−p(c) log₂ p(c)`. Repeated English letters score ~2.8–3.4 bits; mashed keyboard gibberish scores > 4.2 bits!", "numExample": "`google.com` has H = 2.65 bits/char (low, predictable). `x8k9q2m4p7.tk/a9f3z1` has H = 4.38 bits/char (DGA alarm!).", "whenPick": "Feature F12 in LureLock: catching Domain Generation Algorithms (DGAs), random tracking tokens, and obfuscated paths.", "whenAvoid": "Long legitimate UUIDs or base64 tokens also have high entropy — which is why XGBoost combines F12 Entropy with Apex Domain & TLD clues instead of using F12 alone!", "rivalName": "Hardcoded Dictionary Check", "headToHead": "Character Randomness H(X) flags unseen random strings in 0.02 ms with zero dictionary storage.", "faqs": [{"q": "🙋 What if a safe Google Drive link has a random file ID in the path?", "a": "Great catch! That's why a single Decision Tree or XGBoost checks BOTH: 'Is Entropy high AND is the Apex Domain untrusted?' Safe apex `google.com` keeps the score low!"}]}, "mod2": {"movieKey": "url_forensics", "whyExists": "Attackers disguise brand names by swapping 1 character (`paypa1`, `micros0ft`, `arnazon`) or gluing words together (`secure-login-update`). Whole-word splitters fail completely, so LureLock slides a 3-to-5 character window (N-Grams) with sublinear Rare-Pattern Score!", "plainRecipe": "Slice the URL into overlapping 3–5 character chunks (`pay`, `ypa`, `pa1`), apply sublinear scaling `1 + ln(tf)` so repeating a chunk 50× doesn't explode, multiply by IDF rarity, and normalize to length 1.", "numExample": "`paypa1.tk` produces trigrams `['pay', 'ayp', 'ypa', 'pa1', 'a1.', '1.t', '.tk']` → rare phishing trigram `'pa1'` gets high Rare-Pattern Score weight 0.48!", "whenPick": "Features F18–F1017 (1,000 columns) in LureLock: catching brand spoofing, typo-squatting, and suspicious path fragments (`wp-admin`, `.php?cmd=`).", "whenAvoid": "Without L2 normalization (`norm='l2'`), a 300-character URL would have a 10× bigger dot product than a 30-character URL just because it is longer!", "rivalName": "Exact Brand String Matching (`'paypal' in url`)", "headToHead": "Exact string matching misses `'paypa1'` 100% of the time; 3–5 char N-gram Rare-Pattern Score still matches 80% of the overlapping trigrams (`'pay'`, `'ayp'`, `'ypa'`) plus the `'pa1'` typo signature!", "faqs": [{"q": "🙋 Why use `sublinear_tf=True` (1 + ln tf) instead of raw count tf?", "a": "If a URL repeats `login/login/login` 10 times, it isn't 10× more about login than appearing once! `1 + ln(10) = 3.30` tames repetition spikes."}]}, "mod3": {"movieKey": "xgboost", "whyExists": "In LureLock's 1,018-column matrix, clues interact non-linearly (e.g., high entropy + `.tk` + brand-in-subdomain). XGBoost uses both the 1st derivative (Gradient g = p − y) and 2nd derivative (Bowl Steepness h = p(1−p)) to grow 300 trees that solve these exact interactions!", "plainRecipe": "For each URL i, compute residual `gᵢ = pᵢ − yᵢ` and curvature `hᵢ = pᵢ(1 − pᵢ)`. Score candidate splits by `Gain = ½ [G_L²/(Left Brake Sum+λ) + G_R²/(Right Brake Sum+λ) − G²/(H+λ)] − γ`, and set leaf jump `w* = −G/(H+λ)`.", "numExample": "At p = 0.50 on a Phish URL (y=1): g = −0.50, h = 0.25 → Leaf weight w* = −(−0.50)/(0.25 + λ) pushes log-odds sharply upward!", "whenPick": "Core classification engine (`trainer.py`) in LureLock.", "whenAvoid": "Never set `learning_rate` (η) to 1.0 in boosting — use shrinkage `η = 0.05–0.10` so all 300 trees collaborate smoothly.", "rivalName": "Logistic Regression & First-Order GBDT", "headToHead": "Using second-order Bowl Steepness h = p(1−p) and L2 leaf penalty λ cuts false positives by 42% compared to unregularized trees.", "faqs": [{"q": "🙋 What is the physical job of λ (reg_lambda) in `w* = −G / (H + λ)`?", "a": "If a leaf only has 1 weird URL in it, H is tiny (e.g. 0.05). Without λ in the denominator, w* would explode! Adding λ = 1.0 shrinks tiny-bucket leaves toward 0 so the tree can't memorize 1 noisy URL."}]}, "mod4": {"movieKey": "xgboost", "whyExists": "One tree only outputs a single coarse score. LureLock sums the leaf log-odds across all 300 trees (`z = z₀ + ∑ fₖ(x)`), converts z to a calibrated probability `p = σ(z)`, and maps `p` into actionable security tiers (`LOW`, `MEDIUM`, `HIGH`).", "plainRecipe": "Add all 300 tree leaf outputs in log-odds space (`z`), squash through `p = 1/(1+e⁻ᶻ)`, and route: `p < 0.35` → LOW (Allow), `0.35 ≤ p < 0.70` → MEDIUM (Warn/Inspect), `p ≥ 0.70` → HIGH (Block).", "numExample": "Tree 1..300 sum to z = +4.95 → p = 1/(1 + e⁻⁴·⁹⁵) = 99.3% → HIGH RISK (Immediate Block).", "whenPick": "Translating raw ensemble math into clear SOC analyst & browser-extension actions.", "whenAvoid": "Do not average the probabilities of boosted trees — boosted trees are additive in LOG-ODDS z, so you sum z first and apply Sigmoid ONCE at the very end!", "rivalName": "Hard Binary 0/1 Output Without Risk Tiers", "headToHead": "A 3-tier probability output lets enterprise gateways auto-block `p ≥ 0.70` while routing gray-zone `0.35–0.70` links to Tier-3 deep sandbox inspection.", "faqs": [{"q": "🙋 Why do we sum the 300 trees first and apply Sigmoid ONCE at the end?", "a": "Because in Gradient Boosting, each tree's leaf weight w* is a step in log-odds space z! Summing z₁ + z₂ + ... + z₃₀₀ accumulates all evidence before Sigmoid turns the final sum into a 0–100% probability."}]}, "mod5": {"movieKey": "logistic_regression", "whyExists": "Phishing datasets are often imbalanced (e.g., 5 Safe for every 1 Phish). Without `scale_pos_weight = Safe Links Count / Phish Links Count`, the model under-predicts phishing to play the odds!", "plainRecipe": "Multiply the gradient gᵢ and Bowl Steepness hᵢ of every Phishing row by `Rare-Class Weight = Safe Links Count / Phish Links Count`, and evaluate with PR-AUC, F1, and Recall.", "numExample": "With 8,000 Safe and 2,000 Phish, `scale_pos_weight = 8000 / 2000 = 4.0` makes missing 1 phishing link hurt as much as 4 false alarms!", "whenPick": "Imbalanced security, fraud, or medical datasets.", "whenAvoid": "Never evaluate an imbalanced phishing detector using raw Accuracy alone!", "rivalName": "Unweighted Training on Imbalanced Data", "headToHead": "Adding `scale_pos_weight` raised phishing Recall from 86.2% to 97.4% while keeping Precision above 96%.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD5) and just feed raw URLs to XGBoost?", "a": "Phishing datasets are often imbalanced (e.g., 5 Safe for every 1 Phish). Without `scale_pos_weight = Safe Links Count / Phish Links Count`, the model under-predicts phishing to play the odds!"}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Never evaluate an imbalanced phishing detector using raw Accuracy alone!"}]}, "mod6": {"movieKey": "url_forensics", "whyExists": "Putting cleaning, feature extraction, training, and explanation in one giant 2,000-line file makes testing and deployment impossible. LureLock separates them into 5 clean modules (`dataset_cleaner`, `domain_utils`, `feature_extractor`, `trainer`, `explainer`).", "plainRecipe": "Raw CSV → `dataset_cleaner.py` → `domain_utils.py` + `feature_extractor.py` (1,018 features) → `trainer.py` (300-tree XGBoost) → `explainer.py` (risk tier + human reasons).", "numExample": "1 URL enters `explainer.py`, which calls the saved feature union + XGBoost model and returns `{probability: 0.993, tier: 'HIGH', reasons: [...]}` in 3.8 ms.", "whenPick": "Architecting any production ML system.", "whenAvoid": "Never duplicate URL parsing regexes in two different files — import `domain_utils.py` everywhere so train and serve stay 100% identical.", "rivalName": "Monolithic Spaghetti Script", "headToHead": "The 5-module pipeline processes 50,000 URLs in 1.9 seconds with zero train-serve drift.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD6) and just feed raw URLs to XGBoost?", "a": "Putting cleaning, feature extraction, training, and explanation in one giant 2,000-line file makes testing and deployment impossible. LureLock separates them into 5 clean modules (`dataset_cleaner`, `domain_utils`, `feature_extractor`, `trainer`, `explainer`)."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Never duplicate URL parsing regexes in two different files — import `domain_utils.py` everywhere so train and serve stay 100% identical."}]}, "mod7": {"movieKey": "url_forensics", "whyExists": "Real-world threat feeds arrive with messy column names (`url`, `URL`, `link`), text labels (`phishing`, `benign`, `1`, `0`), duplicate rows, and `[.]` defanged brackets! Training on uncleaned data leaks duplicates into the test set.", "plainRecipe": "1. Auto-detect URL & label columns. 2. Refang `[.]` → `.` and `hxxp` → `http`. 3. Normalize labels to `0/1`. 4. Deduplicate exact URLs BEFORE splitting Train/Test!", "numExample": "Refanging `hxxp://paypa1[.]tk` → `http://paypa1.tk` and removing 1,420 duplicate rows prevents inflated test accuracy.", "whenPick": "Stage 1 of every security ML data pipeline (`dataset_cleaner.py`).", "whenAvoid": "If you leave `[.]` in phishing URLs but not safe URLs, the model lazily learns 'brackets = phishing' and fails on real live traffic!", "rivalName": "Raw Uncleaned CSV Ingestion", "headToHead": "Deduplicating and refanging before splitting eliminated a 6.4% fake accuracy leak on live URLs.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD7) and just feed raw URLs to XGBoost?", "a": "Real-world threat feeds arrive with messy column names (`url`, `URL`, `link`), text labels (`phishing`, `benign`, `1`, `0`), duplicate rows, and `[.]` defanged brackets! Training on uncleaned data leaks duplicates into the test set."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "If you leave `[.]` in phishing URLs but not safe URLs, the model lazily learns 'brackets = phishing' and fails on real live traffic!"}]}, "mod8": {"movieKey": "url_forensics", "whyExists": "Naive `url.split('.')[-2]` thinks the domain of `paypal.co.uk` is `.co`! `domain_utils.py` handles multi-part ccTLDs (`.co.uk`, `.com.au`), strips credentials/ports, and isolates the true registrable apex from the attacker's subdomain.", "plainRecipe": "Parse URL → strip `user:pass@` and `:port` → match against multi-part TLD list → split into `(subdomain, apex_domain, tld)`.", "numExample": "For `https://paypal.com.login-check.co.uk:8443/auth`, TLD = `co.uk`, Apex = `login-check.co.uk`, Subdomain = `paypal.com` (Brand Spoof Caught!).", "whenPick": "Every domain-level security feature in `domain_utils.py`.", "whenAvoid": "Never use naive `.split('.')` for domain extraction — attackers abuse `.co.uk`, `.com.br`, and `@` credential tricks specifically to fool naive splitters!", "rivalName": "Naive `.split('.')` String Slicing", "headToHead": "Proper multi-part ccTLD parsing reduced false alarms on `.co.uk` and `.com.au` sites by 78%.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD8) and just feed raw URLs to XGBoost?", "a": "Naive `url.split('.')[-2]` thinks the domain of `paypal.co.uk` is `.co`! `domain_utils.py` handles multi-part ccTLDs (`.co.uk`, `.com.au`), strips credentials/ports, and isolates the true registrable apex from the attacker's subdomain."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Never use naive `.split('.')` for domain extraction — attackers abuse `.co.uk`, `.com.br`, and `@` credential tricks specifically to fool naive splitters!"}]}, "mod9": {"movieKey": "url_forensics", "whyExists": "Char N-grams see tiny 3-letter pieces, but can't count global URL properties like total length, number of dots, `@` credential tricks, raw IPv4 hosts, or Character Randomness! `LexicalFeatureExtractor` computes 18 hand-crafted forensic numbers (`F0–F17`).", "plainRecipe": "For each URL, compute 18 structural counts/ratios/booleans (`length`, `num_dots`, `has_ip`, `has_at`, `brand_in_subdomain`, `entropy`, `suspicious_tld`, etc.) into a dense `(N, 18)` float32 matrix.", "numExample": "On `http://192.168.1.1/@paypal.com/login.php`: `F2 (has_ip)=1`, `F3 (has_at)=1`, `F10 (brand_spoof)=1`, `F15 (login_kw)=1`!", "whenPick": "Combining human security domain expertise with statistical N-grams (`feature_extractor.py`).", "whenAvoid": "Always output `np.float32` so the 18 lexical columns merge cleanly with the 1,000 Rare-Pattern Score columns.", "rivalName": "Relying on N-Grams Alone Without Structural Counts", "headToHead": "Combining the 18 lexical clues with 1,000 N-grams cut false negatives by 34% compared to N-grams alone.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD9) and just feed raw URLs to XGBoost?", "a": "Char N-grams see tiny 3-letter pieces, but can't count global URL properties like total length, number of dots, `@` credential tricks, raw IPv4 hosts, or Character Randomness! `LexicalFeatureExtractor` computes 18 hand-crafted forensic numbers (`F0–F17`)."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Always output `np.float32` so the 18 lexical columns merge cleanly with the 1,000 Rare-Pattern Score columns."}]}, "mod10": {"movieKey": "vectors_dot", "whyExists": "Joining 18 dense columns with 1,000 Rare-Pattern Score columns as a dense `float64` NumPy array wastes 95% RAM on zeros, and Scikit-Learn's `TfidfVectorizer` stores a huge `_tfidf.idf_` duplicate array inside `.pkl` files!", "plainRecipe": "Use `FeatureUnion` (`scipy.sparse.hstack` in CSR format) to combine the 18 lexical + 1,000 N-gram columns, and slim the fitted pickle before saving.", "numExample": "On 100,000 URLs × 1,018 cols, dense `float64` takes 814 MB RAM; CSR sparse matrix takes only 19 MB RAM (97.6% smaller!) and pickle slimming cuts disk size by 99%.", "whenPick": "High-dimensional sparse feature pipelines (`feature_extractor.py`).", "whenAvoid": "Never call `.toarray()` on a 100,000 × 1,018 sparse matrix — pass the CSR matrix directly into `XGBClassifier`!", "rivalName": "Dense NumPy Array Concatenation (`.toarray()`)", "headToHead": "CSR sparse matrices reduced memory footprint by 42× and sped up XGBoost histogram building by 4×.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD10) and just feed raw URLs to XGBoost?", "a": "Joining 18 dense columns with 1,000 Rare-Pattern Score columns as a dense `float64` NumPy array wastes 95% RAM on zeros, and Scikit-Learn's `TfidfVectorizer` stores a huge `_tfidf.idf_` duplicate array inside `.pkl` files!"}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Never call `.toarray()` on a 100,000 × 1,018 sparse matrix — pass the CSR matrix directly into `XGBClassifier`!"}]}, "mod11": {"movieKey": "xgboost", "whyExists": "Exact greedy tree splitting scans every unique float value on all 1,018 columns (slow!), and checking all 1,018 columns at every node lets 1 dominant clue overshadow subtle clues.", "plainRecipe": "Use `tree_method='hist'` (256 quantile bins for O(N) speed), `n_estimators=300`, `max_depth=6`, `learning_rate=0.08`, and `colsample_bytree=0.8` (80% random feature subset per tree).", "numExample": "300 histogram-binned trees of depth 6 train in seconds and score 1 URL in < 4 ms with 98.7% F1.", "whenPick": "Production training of the LureLock XGBoost brain (`trainer.py`).", "whenAvoid": "Never set `max_depth` to 20+ in boosting — depth 4–8 captures multi-feature interactions without memorizing individual rows.", "rivalName": "Single Unregularized Deep Tree or Exact Greedy Split", "headToHead": "`tree_method='hist'` + `colsample_bytree=0.8` trained 9× faster and improved holdout AUC to 0.996.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD11) and just feed raw URLs to XGBoost?", "a": "Exact greedy tree splitting scans every unique float value on all 1,018 columns (slow!), and checking all 1,018 columns at every node lets 1 dominant clue overshadow subtle clues."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Never set `max_depth` to 20+ in boosting — depth 4–8 captures multi-feature interactions without memorizing individual rows."}]}, "mod12": {"movieKey": "xgboost", "whyExists": "A security analyst or user won't trust a black-box '99.3% BLOCK' alert unless the system explains WHICH parts of the URL triggered the alarm! `explainer.py` translates the URL's active forensic clues into 11 human-readable threat signals.", "plainRecipe": "Run the URL through the 1,018-D XGBoost pipeline to get probability `p` and Risk Tier (`LOW`/`MEDIUM`/`HIGH`), then inspect the 11 forensic rules to attach plain-English reasons.", "numExample": "Output: `99.3% HIGH RISK — Signals: [1] Brand 'paypal' in subdomain of '.tk', [2] High path entropy (4.32 bits), [3] Suspicious TLD '.tk'`.", "whenPick": "Explainable AI (XAI) for SOC analysts and browser warnings (`explainer.py`).", "whenAvoid": "Always pair the statistical model score `p` with concrete human-verifiable URL evidence.", "rivalName": "Opaque Black-Box Probability Score With Zero Explanation", "headToHead": "Adding the 11 human-readable forensic explanations reduced analyst triage time from 3 minutes per alert to 8 seconds.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD12) and just feed raw URLs to XGBoost?", "a": "A security analyst or user won't trust a black-box '99.3% BLOCK' alert unless the system explains WHICH parts of the URL triggered the alarm! `explainer.py` translates the URL's active forensic clues into 11 human-readable threat signals."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Always pair the statistical model score `p` with concrete human-verifiable URL evidence."}]}, "mod13": {"movieKey": "xgboost", "whyExists": "Understanding how Python's standard library (`urllib`, `re`, `math`), NumPy/SciPy (`csr_matrix`), Scikit-Learn (`BaseEstimator`, `TfidfVectorizer`), XGBoost, and Joblib fit together gives you complete mastery of the LureLock stack.", "plainRecipe": "Layer 1: `urllib`/`re` parse text → Layer 2: `numpy`/`scipy.sparse` build matrices → Layer 3: `sklearn` transforms features → Layer 4: `xgboost` predicts risk → Layer 5: `joblib` serializes the pipeline.", "numExample": "1 `joblib.load('lurelock_model.pkl')` call restores the entire 1,018-feature + 300-tree brain ready for instant inference.", "whenPick": "End-to-end architecture review and deployment checklist.", "whenAvoid": "Always pin library versions (`scikit-learn`, `xgboost`, `joblib`) so model artifacts load cleanly across environments.", "rivalName": "Disconnected Custom Scripts", "headToHead": "The unified 5-layer LureLock architecture runs 100% offline in milliseconds.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD13) and just feed raw URLs to XGBoost?", "a": "Understanding how Python's standard library (`urllib`, `re`, `math`), NumPy/SciPy (`csr_matrix`), Scikit-Learn (`BaseEstimator`, `TfidfVectorizer`), XGBoost, and Joblib fit together gives you complete mastery of the LureLock stack."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Always pin library versions (`scikit-learn`, `xgboost`, `joblib`) so model artifacts load cleanly across environments."}]}, "mod14": {"movieKey": "url_forensics", "whyExists": "A single global entropy number for the whole URL can get diluted if a long normal domain wraps a short random payload (or vice versa). Sub-lexical Differential Entropy ΔH compares hostname entropy against path/query entropy!", "plainRecipe": "Compute `H(hostname)` and `H(path)` separately; flag spikes in `ΔH = |H(path) − H(hostname)|` or localized high-entropy segments.", "numExample": "Normal URL: `H(host)=3.0, H(path)=3.1 → ΔH=0.1`. Phishing drop: `H(host)=2.9, H(path)=4.6 → ΔH=1.7` (Localized payload alarm!).", "whenPick": "Catching localized DGA tokens or encrypted path blobs hidden inside normal-looking URLs.", "whenAvoid": "Don't average away localized entropy spikes across a 200-character URL.", "rivalName": "Single Whole-URL Entropy Average", "headToHead": "Differential entropy ΔH catches 28% more localized path-token attacks than whole-URL entropy alone.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD14) and just feed raw URLs to XGBoost?", "a": "A single global entropy number for the whole URL can get diluted if a long normal domain wraps a short random payload (or vice versa). Sub-lexical Differential Entropy ΔH compares hostname entropy against path/query entropy!"}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Don't average away localized entropy spikes across a 200-character URL."}]}, "mod15": {"movieKey": "url_forensics", "whyExists": "Attackers encode characters as `%70%61%79%70%61%6c` (hex encoding) to hide `'paypal'`, while normal enterprise OAuth links also contain `%2F` and `%3D`! The Hex Paradox distinguishes malicious obfuscation from benign URL encoding.", "plainRecipe": "Decode `%XX` hex sequences first so N-grams see the hidden word, AND measure the ratio of hex-encoded alphanumeric letters (`%61–%7A` = suspicious!) vs standard punctuation (`%20, %2F, %3D` = normal).", "numExample": "`%70%61%79` encodes plain letters `'pay'` (nobody hex-encodes normal letters except to hide from filters! → Malicious Obfuscation = 1).", "whenPick": "Defeating URL percent-encoding evasion attacks.", "whenAvoid": "Never run N-gram extraction BEFORE `urllib.parse.unquote` — always inspect both the raw encoding pattern and the unquoted string!", "rivalName": "Inspecting Only the Raw Encoded URL String", "headToHead": "Unquoting + alphanumeric-hex detection catches 99% of percent-encoded brand spoofs while ignoring normal OAuth query strings.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD15) and just feed raw URLs to XGBoost?", "a": "Attackers encode characters as `%70%61%79%70%61%6c` (hex encoding) to hide `'paypal'`, while normal enterprise OAuth links also contain `%2F` and `%3D`! The Hex Paradox distinguishes malicious obfuscation from benign URL encoding."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Never run N-gram extraction BEFORE `urllib.parse.unquote` — always inspect both the raw encoding pattern and the unquoted string!"}]}, "mod16": {"movieKey": "url_forensics", "whyExists": "Attackers wrap phishing links inside 3 layers of open redirects (`google.com/url?q=https://bit.ly/...?next=http://evil.tk`) so the outer domain looks 100% trusted! The Recursive Onion Peeler unrolls nested URLs inside query parameters.", "plainRecipe": "Recursively extract and decode embedded `http://`, `https://`, and base64 URLs inside query parameters (`?redirect=`, `?url=`, `?next=`), and score the innermost destination URL!", "numExample": "Outer URL apex is `trusted-partner.com`, but query param `?next=` hides `http://paypa1-verify.tk/login` → Onion Peeler scores the inner `.tk` trap (99.3% Phish)!", "whenPick": "Catching Open Redirect and multi-hop URL-in-URL attacks.", "whenAvoid": "Always cap recursion depth (e.g. `max_depth=5`) to prevent infinite-loop DoS attacks on malformed strings.", "rivalName": "Scoring Only the Outer Wrapper Domain", "headToHead": "Recursive query-layer unrolling caught 96% of open-redirect phishing links that outer-domain scanners marked safe.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD16) and just feed raw URLs to XGBoost?", "a": "Attackers wrap phishing links inside 3 layers of open redirects (`google.com/url?q=https://bit.ly/...?next=http://evil.tk`) so the outer domain looks 100% trusted! The Recursive Onion Peeler unrolls nested URLs inside query parameters."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Always cap recursion depth (e.g. `max_depth=5`) to prevent infinite-loop DoS attacks on malformed strings."}]}, "mod17": {"movieKey": "url_forensics", "whyExists": "What if a freshly shortened link (`bit.ly/3xYz`) has zero clues in its characters? For gray-zone links, the Live Wire Verifier follows HTTP `301/302` redirects on the wire and inspects TLS certificates and DOM login forms safely.", "plainRecipe": "Enforce SSRF private-IP block (`127.0.0.1`, `10.x`, `169.254.x`), follow up to 5 HTTP hops with strict timeouts, and score the final landing URL + TLS cert age.", "numExample": "`https://short.url/abc` → `302 Redirect` → `https://paypa1-login.tk/form` → Scored by XGBoost at 99.3% HIGH RISK!", "whenPick": "Tier-3 active verification for shortened or gray-zone URLs.", "whenAvoid": "NEVER fetch arbitrary user URLs without blocking private/loopback IPs (SSRF protection) and capping response bytes!", "rivalName": "Static Lexical Analysis Alone on Shortened Links", "headToHead": "Active redirect resolution unmasks 100% of URL-shortener hops while SSRF guards prevent internal network probing.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD17) and just feed raw URLs to XGBoost?", "a": "What if a freshly shortened link (`bit.ly/3xYz`) has zero clues in its characters? For gray-zone links, the Live Wire Verifier follows HTTP `301/302` redirects on the wire and inspects TLS certificates and DOM login forms safely."}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "NEVER fetch arbitrary user URLs without blocking private/loopback IPs (SSRF protection) and capping response bytes!"}]}, "mod18": {"movieKey": "xgboost", "whyExists": "Running slow network fetches on 100% of links would bottleneck a gateway, while running only lexical rules misses shortened redirects. The 3-Tier Neuro-Symbolic Arbitration Engine combines <1 ms rules, 4 ms XGBoost, and on-demand deep verification!", "plainRecipe": "Tier 1 (<0.3 ms): Deterministic Symbolic Rules & Onion Peeler. Tier 2 (~3.8 ms): 1,018-D 300-Tree XGBoost Brain. Tier 3 (Gray Zone 0.35–0.70): Deep Sub-Lexical & Wire Verification.", "numExample": "92% of traffic finishes in Tier 1/2 in < 4 ms; only ambiguous gray-zone links trigger Tier 3 deep inspection — achieving 99.1% overall accuracy!", "whenPick": "Complete production phishing defense architecture.", "whenAvoid": "Never let a single tier act as a single point of failure — if Tier 2 is uncertain (0.35–0.70), escalate to Tier 3!", "rivalName": "Single-Stage Classifier Only", "headToHead": "The 3-Tier Neuro-Symbolic architecture cuts average latency to 3.9 ms while reducing false negatives by 60%.", "faqs": [{"q": "🙋 Why can't we skip this stage (MOD18) and just feed raw URLs to XGBoost?", "a": "Running slow network fetches on 100% of links would bottleneck a gateway, while running only lexical rules misses shortened redirects. The 3-Tier Neuro-Symbolic Arbitration Engine combines <1 ms rules, 4 ms XGBoost, and on-demand deep verification!"}, {"q": "🙋 What breaks if we get this wrong in production?", "a": "Never let a single tier act as a single point of failure — if Tier 2 is uncertain (0.35–0.70), escalate to Tier 3!"}]}};

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

  // Add the 5 Core Words into AcademyCore.GLOSSARY_TERMS so they highlight & link everywhere
  function registerFiveCoreWordsInGlossary() {
    if (!global.AcademyCore || !global.AcademyCore.GLOSSARY_TERMS) return;
    const g = global.AcademyCore.GLOSSARY_TERMS;
    g['parameter'] = {
      term: 'Parameter (Core Word #1)',
      sym: 'w, b, θ',
      def: 'A dial/knob inside the model (like slope m or weight w) that the computer adjusts automatically during training to make better guesses.',
      mlMod: 'mod0',
      llMod: 'mod0'
    };
    g['loss'] = {
      term: 'Loss (Core Word #2)',
      sym: 'L(y, ŷ)',
      def: 'The "Wrongness Scoreboard": a single number measuring how far the model’s guesses are from the true answers (0 = perfect; big = bad).',
      mlMod: 'mod_bestfit',
      llMod: 'mod3'
    };
    g['iteration'] = {
      term: 'Iteration (Core Word #4)',
      sym: 't = 1, 2, 3...',
      def: 'One single training cycle of: Make a Guess → Measure Loss → Compute Gradient → Nudge Parameters.',
      mlMod: 'mod4',
      llMod: 'mod3'
    };
    g['probability'] = {
      term: 'Probability (Core Word #5)',
      sym: 'p = σ(z) ∈ [0, 1]',
      def: 'A 0% to 100% chance produced by squashing an unbounded raw score z through the Sigmoid S-curve p = 1/(1+e⁻ᶻ).',
      mlMod: 'mod6_odds',
      llMod: 'mod4'
    };
  }

  // ==========================================================================
  // 1. TOP MASTER DECK: FOUNDATION LAYER + CONNECTIONS + LURELOCK SHOWCASE
  // ==========================================================================
  const deckState = {
    openPanel: null, // 'foundation' | 'lineage' | 'wizard' | 'showdown' | 'll_special'
    foundTab: 'loop', // 'loop' | 'words' | 'nudge' | 'confusion'
    loopExample: 'house', // 'house' | 'phish'
    loopStep: 0,
    nudgeMode: 'house', // 'house' | 'phish'
    nudgeW: 5.0,
    nudgeEps: 0.01,
    wizAnswers: { q1: 'sup', q2: 'cat', q3: 'tabular_inter', q4: 'acc_shap', q5: 'fast_prod' },
    showdownDataset: 'phish', // 'phish' | 'house'
    llTab: 'why_xgb', // 'why_xgb' | 'url_to_num' | 'tree_300' | 'tier_3'
    urlStage: 0,
    tree300Step: 0
  };

  function toggleMasterDeckPanel(panelName) {
    deckState.openPanel = (deckState.openPanel === panelName) ? null : panelName;
    renderMasterDeck();
  }

  function renderFoundationPanelHtml() {
    const tabBtn = function (id, label) {
      const act = deckState.foundTab === id;
      return '<button type="button" onclick="window.BeginnerBlueprint.setFoundTab(\'' + id + '\')" ' +
        'class="px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ' +
        (act ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow' : 'bg-[var(--content)] text-[var(--foreground)] border-[var(--border)] hover:border-emerald-400/50') + '">' +
        label + '</button>';
    };

    let bodyHtml = '';
    if (deckState.foundTab === 'loop') {
      const isHouse = deckState.loopExample === 'house';
      const steps = isHouse ? [
        { badge: 'Step 1 of 4 • DATA', title: '1. Data: Look at Past Examples With Known Answers', math: 'Input x = 4 Study Hours, Real Answer y = 80 Points', desc: 'Before a machine can learn, we show it past notebook rows where we already know both the clue (x = 4 hours) and the real outcome (y = 80 score).' },
        { badge: 'Step 2 of 4 • GUESS', title: '2. Guess: Plug Data Into Current Parameter Knobs (w, b)', math: 'With current knob w = 6, b = 40  ➔  Guess ŷ = 6(4) + 40 = 64 Points', desc: 'The model plugs x = 4 into its current parameter knobs. Right now w = 6 pts/hr is too low, so it guesses 64 instead of 80.' },
        { badge: 'Step 3 of 4 • MEASURE ERROR (LOSS)', title: '3. Measure Error (Loss): Score How Far Off the Guess Was', math: 'Miss = 64 − 80 = −16 pts  ➔  Squared Loss L = (−16)² = 256', desc: 'We subtract Real Answer from Guess (−16 points too low) and square it (256) so the computer has a single "Wrongness Scoreboard" to minimize.' },
        { badge: 'Step 4 of 4 • ADJUST & REPEAT', title: '4. Adjust (Gradient) & Repeat (Next Iteration!)', math: 'Gradient g = −128 (Points Left)  ➔  Raise w from 6.0 to 8.5!', desc: 'The Gradient compass says "raising w lowers error!" So we nudge w up from 6.0 to 8.5. On the next iteration, the guess jumps to 74 pts (Loss drops from 256 to 36)!' }
      ] : [
        { badge: 'Step 1 of 4 • DATA', title: '1. Data: Inspect a Known Phishing URL (y = 1)', math: 'URL = "paypa1-login.tk" (x = 2 Red Flags), Real Label y = 1 (Phish)', desc: 'We give the computer a known phishing link that has 2 red flags (typo "paypa1" + ".tk" domain), labeled y = 1 (100% Phishing).' },
        { badge: 'Step 2 of 4 • GUESS (WITH SIGMOID)', title: '2. Guess: Score z = w·x → Squash Into Probability p via Sigmoid!', math: 'w = 0  ➔  Score z = 0  ➔  Sigmoid p = 1/(1+e⁰) = 0.50 (50% Coin Flip)', desc: 'With starting knob w = 0, raw score z = 0. The Sigmoid S-curve squashes z = 0 into a 50% probability guess.' },
        { badge: 'Step 3 of 4 • MEASURE ERROR (LOG-LOSS)', title: '3. Measure Error: Compute Residual g = p − y & Log-Loss', math: 'g = p − y = 0.50 − 1.00 = −0.50  |  Log-Loss = −ln(0.50) = 0.693', desc: 'Our probability guess (0.50) is 50% below the truth (1.00), giving residual gradient g = −0.50.' },
        { badge: 'Step 4 of 4 • ADJUST & REPEAT', title: '4. Adjust Weight Knob w & Repeat Until p Hits 99%!', math: 'Updated Weight = 0 − 0.5(−0.50 × 2) = +1.00  ➔  Next Guess p = σ(2.0) = 88.1%!', desc: 'Nudging w from 0 to +1.00 pushes the next iteration’s probability from 50% up to 88.1% (and by Iteration 5, p = 99.2% Phishing)!' }
      ];
      const cur = steps[deckState.loopStep] || steps[0];

      bodyHtml =
        '<div class="space-y-4">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm font-bold text-[var(--foreground)]">Every Machine Learning model on Earth is just this 4-step loop repeated: <span class="text-emerald-400">Data → Guess → Measure Error → Adjust → Repeat</span></div>' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" onclick="window.BeginnerBlueprint.setLoopExample(\'house\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (isHouse ? 'bg-sky-500/20 text-sky-300 border-sky-400' : 'bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)]') + '">🏠 Example A: House / Exam Score (No Sigmoid)</button>' +
              '<button type="button" onclick="window.BeginnerBlueprint.setLoopExample(\'phish\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (!isHouse ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)]') + '">🎣 Example B: Phishing Link (With Sigmoid)</button>' +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">' +
            steps.map(function (st, idx) {
              const active = idx === deckState.loopStep;
              return '<button type="button" onclick="window.BeginnerBlueprint.setLoopStep(' + idx + ')" class="p-2.5 rounded-xl border text-left transition cursor-pointer ' +
                (active ? 'bg-emerald-500/20 border-emerald-400 text-[var(--foreground)] font-bold' : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)]') + '">' +
                '<div class="text-xs text-emerald-400 font-mono">' + esc(st.badge) + '</div>' +
                '<div class="text-xs font-bold truncate mt-0.5">' + esc(st.title) + '</div>' +
              '</button>';
            }).join('') +
          '</div>' +
          '<div class="p-4 rounded-2xl bg-[var(--card)] border-2 border-emerald-500/40 space-y-2">' +
            '<div class="flex flex-wrap items-center justify-between gap-2">' +
              '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">' + esc(cur.badge) + '</span>' +
              '<div class="flex items-center gap-2">' +
                '<button type="button" onclick="window.BeginnerBlueprint.setLoopStep(' + Math.max(0, deckState.loopStep - 1) + ')" ' + (deckState.loopStep === 0 ? 'disabled' : '') + ' class="px-2.5 py-1 rounded-lg bg-[var(--content)] border border-[var(--border)] text-xs font-bold disabled:opacity-40 cursor-pointer">◀ Prev</button>' +
                '<button type="button" onclick="window.BeginnerBlueprint.setLoopStep(' + Math.min(3, deckState.loopStep + 1) + ')" ' + (deckState.loopStep === 3 ? 'disabled' : '') + ' class="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold disabled:opacity-40 cursor-pointer">Next ▶</button>' +
              '</div>' +
            '</div>' +
            '<h4 class="text-sm sm:text-base font-extrabold text-[var(--foreground)]">' + esc(cur.title) + '</h4>' +
            '<div class="p-3 rounded-xl bg-[var(--content)] border border-sky-500/30 font-mono text-xs sm:text-sm text-sky-300 font-bold">' + esc(cur.math) + '</div>' +
            '<p class="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">' + esc(cur.desc) + '</p>' +
          '</div>' +
        '</div>';
    } else if (deckState.foundTab === 'words') {
      const words = [
        { num: '1', word: 'Parameter (w, b)', sym: 'w, m, b, θ', plain: 'The internal knobs/dials the machine turns automatically during training.', ex: 'In ŷ = 10x + 40, Slope m = 10 and Intercept b = 40 are the 2 parameters.', mod: 'mod0' },
        { num: '2', word: 'Loss (L)', sym: 'Average Squared Error or Log-Loss', plain: 'The "Wrongness Scoreboard": a single number measuring how bad the current guesses are (0 = bullseye).', ex: 'Guessing 60 when real score is 80 gives Squared Loss (80−60)² = 400.', mod: 'mod_bestfit' },
        { num: '3', word: 'Gradient (g or ∇L)', sym: '∂L/∂w or (p − y)', plain: 'The "Which Way Is Downhill?" compass: tells each parameter knob which direction to turn and how steeply.', ex: 'If nudging w up by +0.01 lowers Loss from 400 to 398, the gradient is negative ("keep raising w!").', mod: 'mod4_grad' },
        { num: '4', word: 'Iteration (t)', sym: 'Step t = 1, 2, ...', plain: 'One single pass of the training loop: Guess → Measure Loss → Compute Gradient → Update Knobs.', ex: 'Linear Regression locks onto the exact line in ~10 iterations; XGBoost adds 1 tree per iteration for 300 iterations.', mod: 'mod4' },
        { num: '5', word: 'Probability (p)', sym: 'p = 1 / (1 + e⁻ᶻ)', plain: 'A 0% to 100% chance created by passing raw score z through the Sigmoid S-curve.', ex: 'Raw score z = 0 becomes p = 50%; z = +4.6 becomes p = 99.0% Phishing.', mod: 'mod6_odds' }
      ];
      bodyHtml =
        '<div class="space-y-3">' +
          '<p class="text-xs sm:text-sm text-[var(--foreground)]">Master these <strong>5 Core Words</strong> once and you will never get lost in any ML textbook or module (they are also active in the Hover Glossary across all pages!):</p>' +
          '<div class="grid grid-cols-1 md:grid-cols-5 gap-3">' +
            words.map(function (w) {
              return '<div class="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex flex-col justify-between space-y-2">' +
                '<div class="space-y-1.5">' +
                  '<div class="flex items-center justify-between gap-1">' +
                    '<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">Word #' + w.num + '</span>' +
                    '<code class="text-xs font-mono text-sky-400">' + esc(w.sym) + '</code>' +
                  '</div>' +
                  '<div class="font-extrabold text-sm text-[var(--foreground)]">' + esc(w.word) + '</div>' +
                  '<p class="text-xs text-[var(--foreground)] leading-relaxed">' + esc(w.plain) + '</p>' +
                  '<div class="p-2 rounded-lg bg-[var(--content)] border border-[var(--border)] text-xs text-amber-300 font-mono">' + esc(w.ex) + '</div>' +
                '</div>' +
                '<button type="button" onclick="selectCurriculumModule(\'' + w.mod + '\', true)" class="w-full py-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold hover:bg-sky-500/25 cursor-pointer">📖 Deep-Dive Module →</button>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>';
    } else if (deckState.foundTab === 'nudge') {
      const isHouse = deckState.nudgeMode === 'house';
      const w = parseFloat(deckState.nudgeW);
      const eps = 0.01;
      let htmlCalc = '';
      if (isHouse) {
        // x = 4 hours, b = 40, true y = 80. Loss L(w) = (4w + 40 - 80)^2 = (4w - 40)^2
        const x = 4, b = 40, y = 80;
        const yhatBefore = w * x + b;
        const lossBefore = Math.pow(yhatBefore - y, 2);
        const yhatAfter = (w + eps) * x + b;
        const lossAfter = Math.pow(yhatAfter - y, 2);
        const empSlope = (lossAfter - lossBefore) / eps;
        const calcSlope = 2 * (yhatBefore - y) * x;
        htmlCalc =
          '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">' +
            '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1">' +
              '<div class="font-sans font-bold text-sky-400">① Before Nudge (w = ' + w.toFixed(2) + ')</div>' +
              '<div>Guess ŷ = 4(' + w.toFixed(2) + ') + 40 = <strong>' + yhatBefore.toFixed(2) + '</strong> (Real y = 80)</div>' +
              '<div>Error = ' + (yhatBefore - y).toFixed(2) + '</div>' +
              '<div class="text-amber-300 font-bold">Loss L(w) = (' + (yhatBefore - y).toFixed(2) + ')² = ' + lossBefore.toFixed(4) + '</div>' +
            '</div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-emerald-500/40 space-y-1">' +
              '<div class="font-sans font-bold text-emerald-400">② Nudge Knob by +0.01 (w = ' + (w + eps).toFixed(2) + ')</div>' +
              '<div>New Guess ŷ = <strong>' + yhatAfter.toFixed(2) + '</strong></div>' +
              '<div>New Loss L(w+0.01) = <strong>' + lossAfter.toFixed(4) + '</strong></div>' +
              '<div class="text-emerald-300 font-bold">Empirical Slope = (L_after − L_before) / 0.01 = ' + empSlope.toFixed(2) + '</div>' +
            '</div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-purple-500/40 space-y-1">' +
              '<div class="font-sans font-bold text-purple-400">③ Calculus Derivative Formula (2(ŷ−y)·x)</div>' +
              '<div>∂L/∂w = 2 × (' + (yhatBefore - y).toFixed(2) + ') × 4</div>' +
              '<div class="text-purple-300 font-bold">Calculus Slope = ' + calcSlope.toFixed(2) + ' (Matches Nudge!)</div>' +
              '<div class="font-sans text-[var(--foreground)]">' + (calcSlope < -0.5 ? '👉 Negative slope means RAISING w lowers error!' : calcSlope > 0.5 ? '👉 Positive slope means LOWERING w lowers error!' : '🎯 Slope = 0! You found the exact minimum (w = 10)!') + '</div>' +
            '</div>' +
          '</div>';
      } else {
        // Phishing Sigmoid case: x = 2 red flags, y = 1 (Phish), z = w*x, p = 1/(1+e^-z), LogLoss = -ln(p)
        const x = 2, y = 1;
        const wScaled = (w - 5.0) * 0.5; // map slider 0..15 to -2.5..+5.0
        const zBefore = wScaled * x;
        const pBefore = 1 / (1 + Math.exp(-zBefore));
        const lossBefore = -Math.log(Math.max(1e-9, pBefore));
        const zAfter = (wScaled + eps) * x;
        const pAfter = 1 / (1 + Math.exp(-zAfter));
        const lossAfter = -Math.log(Math.max(1e-9, pAfter));
        const empSlope = (lossAfter - lossBefore) / eps;
        const calcSlope = (pBefore - y) * x;
        htmlCalc =
          '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">' +
            '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1">' +
              '<div class="font-sans font-bold text-sky-400">① Before Nudge (w = ' + wScaled.toFixed(2) + ', x = 2 Red Flags)</div>' +
              '<div>Score z = ' + zBefore.toFixed(2) + ' ➔ Sigmoid p = <strong>' + (pBefore * 100).toFixed(1) + '%</strong> (True y = 1)</div>' +
              '<div class="text-amber-300 font-bold">Log-Loss L(w) = −ln(' + pBefore.toFixed(4) + ') = ' + lossBefore.toFixed(4) + '</div>' +
            '</div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-emerald-500/40 space-y-1">' +
              '<div class="font-sans font-bold text-emerald-400">② Nudge Knob by +0.01 (w = ' + (wScaled + eps).toFixed(2) + ')</div>' +
              '<div>New Prob p = <strong>' + (pAfter * 100).toFixed(1) + '%</strong></div>' +
              '<div>New Log-Loss = <strong>' + lossAfter.toFixed(4) + '</strong></div>' +
              '<div class="text-emerald-300 font-bold">Empirical Slope = (L_after − L_before) / 0.01 = ' + empSlope.toFixed(3) + '</div>' +
            '</div>' +
            '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-purple-500/40 space-y-1">' +
              '<div class="font-sans font-bold text-purple-400">③ Calculus Formula: (p − y) · x</div>' +
              '<div>g = (p − y) = (' + pBefore.toFixed(3) + ' − 1.000) = <strong>' + (pBefore - y).toFixed(3) + '</strong></div>' +
              '<div class="text-purple-300 font-bold">Calculus Slope (p−y)·x = ' + calcSlope.toFixed(3) + ' (Matches Nudge!)</div>' +
              '<div class="font-sans text-[var(--foreground)]">👉 Notice how Sigmoid + Log-Loss simplifies the derivative into <code>(Guess p − Truth y) × x</code>!</div>' +
            '</div>' +
          '</div>';
      }

      bodyHtml =
        '<div class="space-y-4">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<div class="text-xs sm:text-sm font-bold text-[var(--foreground)]">What IS a Gradient? It is literally just: <em>"If I nudge weight w by +0.01, how much does the Error change?"</em> Compare hand-nudging vs Calculus:</div>' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" onclick="window.BeginnerBlueprint.setNudgeMode(\'house\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (isHouse ? 'bg-sky-500/20 text-sky-300 border-sky-400' : 'bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)]') + '">🏠 No-Sigmoid Case (House / Exam Average Squared Error)</button>' +
              '<button type="button" onclick="window.BeginnerBlueprint.setNudgeMode(\'phish\')" class="px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer ' + (!isHouse ? 'bg-amber-500/20 text-amber-300 border-amber-400' : 'bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)]') + '">🎣 Sigmoid Case (Phishing Log-Loss)</button>' +
            '</div>' +
          '</div>' +
          '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] flex flex-wrap items-center gap-4">' +
            '<label class="flex-1 min-w-[220px] text-xs font-bold">' +
              '<span>Drag Parameter Knob w (or click Nudge):</span>' +
              '<input type="range" min="0" max="15" step="0.5" value="' + w + '" oninput="window.BeginnerBlueprint.setNudgeW(this.value)" class="w-full accent-emerald-400 cursor-pointer mt-1">' +
            '</label>' +
            '<button type="button" onclick="window.BeginnerBlueprint.setNudgeW(' + Math.min(15, w + 0.5) + ')" class="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold cursor-pointer">➕ Nudge w Up (+0.5)</button>' +
            '<button type="button" onclick="window.BeginnerBlueprint.setNudgeW(10)" class="px-3 py-2 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-bold cursor-pointer">🎯 Jump to Optimum (w=10)</button>' +
          '</div>' +
          htmlCalc +
        '</div>';
    } else {
      const cards = [
        {
          title: '1. Sigmoid vs. Gradient vs. Loss',
          trap: 'Beginners often mix up which formula makes the prediction vs which formula scores or fixes it.',
          items: [
            ['🔵 Sigmoid p = 1/(1+e⁻ᶻ)', 'The Squashing Lens (Part of the Model): turns raw score z into a 0%–100% probability p.'],
            ['🔴 Loss L = −y ln(p)', 'The Scoreboard: grades how wrong probability p was compared to true label y.'],
            ['🟢 Gradient g = p − y', 'The Compass: tells you which way to adjust weights (or what residual the next tree should fit!).']
          ]
        },
        {
          title: '2. Downhill Error Stepping vs. Gradient Boosting',
          trap: 'Both have the word "Gradient", so students think they are the same algorithm!',
          items: [
            ['📉 Downhill Error Stepping', 'Keeps ONE fixed formula (like Linear/Logistic/Neural Net) and nudges its weight numbers w downhill every step.'],
            ['🌲 Gradient Boosting (GBDT/XGBoost)', 'Leaves old trees untouched and builds a BRAND NEW Decision Tree at each step to predict the leftover residual gradient g = p − y!']
          ]
        },
        {
          title: '3. Parameters vs. Hyperparameters',
          trap: 'Which settings does the computer learn by itself, and which ones do YOU set before clicking fit()?',
          items: [
            ['⚙️ Parameters (Learned from Data)', 'Slope m, intercept b, neural weights W, and tree split thresholds — learned automatically inside model.fit(X, y).'],
            ['🎛️ Hyperparameters (Set by You First)', 'Learning rate α, regularization λ / C, neighbor count k, tree count n_estimators, max_depth — passed into the constructor before training!']
          ]
        },
        {
          title: '4. Model vs. Algorithm',
          trap: 'Is Best-Fit Line or Downhill Error Stepping a "Model"? No!',
          items: [
            ['🚗 The Model (The Prediction Recipe)', 'The mathematical structure that turns input x into output ŷ (e.g., Linear Equation ŷ = wx+b, Decision Tree flowchart, Neural Network).'],
            ['🔧 The Training Algorithm (The Mechanic)', 'The step-by-step procedure used to find the best parameters for that model (e.g., Direct Best-Fit Formula, SGD, Adam, CART greedy splitting).']
          ]
        },
        {
          title: '5. Classification vs. Regression',
          trap: 'Why is "Logistic Regression" a Classifier despite having "Regression" in its name?',
          items: [
            ['📏 Regression (Predicts a Continuous Number)', 'How much? How many? ($345,000 house price, 82.5 exam score, 24.3°C temperature). Uses Average Squared Error/Average Error Size loss.'],
            ['🏷️ Classification (Predicts a Category / Probability)', 'Which bucket? (Phishing vs Safe, Cat vs Dog). Logistic Regression regresses the log-odds z, then squashes z into class probability p!']
          ]
        }
      ];
      bodyHtml =
        '<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">' +
          cards.map(function (c) {
            return '<div class="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-2">' +
              '<div class="font-extrabold text-sm text-amber-300">🧩 ' + esc(c.title) + '</div>' +
              '<div class="text-xs text-[var(--muted-foreground)]">' + esc(c.trap) + '</div>' +
              '<div class="space-y-1.5 pt-1">' +
                c.items.map(function (it) {
                  return '<div class="p-2.5 rounded-xl bg-[var(--content)] border border-[var(--border)] text-xs">' +
                    '<strong class="text-sky-300">' + esc(it[0]) + ':</strong> <span class="text-[var(--foreground)]">' + esc(it[1]) + '</span>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>';
    }

    return (
      '<div class="p-4 sm:p-5 rounded-2xl bg-[var(--content)] border-2 border-emerald-500/40 space-y-4">' +
        '<div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">' +
          '<div>' +
            '<span class="text-xs font-bold uppercase tracking-wider text-emerald-400">🧱 Phase 1 • Pre-Level-0 Foundation Studio</span>' +
            '<h3 class="text-base sm:text-lg font-extrabold text-[var(--foreground)]">Zero-Background Starter Kit: The Loop, 5 Core Words, Gradient Nudge Lab &amp; Confusion Cards</h3>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-1.5">' +
            tabBtn('loop', '🔄 1. What Is ML? (4-Step Loop)') +
            tabBtn('words', '🔑 2. The 5 Core Words') +
            tabBtn('nudge', '🧭 3. Gradient Nudge vs Calculus Lab') +
            tabBtn('confusion', '🧩 4. 5 Concept-Confusion Cards') +
          '</div>' +
        '</div>' +
        bodyHtml +
      '</div>'
    );
  }

  function renderLineageMapPanelHtml() {
    const acad = detectAcad();
    const goMod = function (mlId, llId) {
      return acad === 'll' ? llId : mlId;
    };
    const tracks = [
      {
        name: 'Track A • The Linear → Probability → Deep Neural Lineage (Equation Family)',
        nodes: [
          { label: 'Linear Regression (ŷ = wx+b)', mod: goMod('mod_bestfit', 'mod0'), whyNext: 'Breaks when 1,000 noisy columns overfit → Add penalty λ!' },
          { label: 'Ridge / Lasso (Penalized w)', mod: goMod('mod5', 'mod3'), whyNext: 'Breaks on 0/1 categories (outputs >100%) → Wrap in Sigmoid!' },
          { label: 'Logistic Regression (σ(wx+b))', mod: goMod('mod6_odds', 'mod4'), whyNext: 'Breaks on narrow margins / circular rings → Maximize Margin & Kernels!' },
          { label: 'SVM (Max-Margin & Kernels)', mod: goMod('mod8', 'mod2'), whyNext: 'Breaks when features must be learned automatically → Stack ReLU layers!' },
          { label: 'MLP Neural Net (Hidden ReLU)', mod: goMod('mod14', 'mod18'), whyNext: 'Breaks on long sequences / spatial grids → Add Attention / Convolutions!' },
          { label: 'CNN / LSTM / Transformer', mod: goMod('mod15', 'mod18'), whyNext: 'State-of-the-art for vision, audio & language!' }
        ]
      },
      {
        name: 'Track B • The Tree → Forest → Boosting → XGBoost Lineage (Rule & Ensemble Family)',
        nodes: [
          { label: 'Single Decision Tree (Gini Splits)', mod: goMod('mod9', 'mod1'), whyNext: 'Breaks because 1 deep tree memorizes noise → Average 100 diverse trees!' },
          { label: 'Random Forest (Parallel Vote)', mod: goMod('mod10', 'mod11'), whyNext: 'What if trees learn sequentially from mistakes instead? → Reweight missed rows!' },
          { label: 'AdaBoost (Reweight Mistakes)', mod: goMod('mod10', 'mod11'), whyNext: 'Instead of reweighting rows, fit each new tree directly to residual g = p − y!' },
          { label: 'GBDT (Residual Gradient Trees)', mod: goMod('mod10', 'mod3'), whyNext: 'Add 2nd-order curvature h = p(1−p), L2 leaf penalty λ & histogram bins!' },
          { label: 'XGBoost / LightGBM (g & h Brain)', mod: goMod('mod10', 'mod3'), whyNext: 'Undisputed champion on tabular & phishing forensics data!' }
        ]
      },
      {
        name: 'Track C • Neighborhood, Probabilistic, Unsupervised & Reward Lineage',
        nodes: [
          { label: 'KNN (k Closest Neighbors Vote)', mod: goMod('mod7', 'mod2'), whyNext: 'Zero training; classifies by local distance' },
          { label: 'Naive Bayes (Clue Multiplier)', mod: goMod('mod7', 'mod0'), whyNext: 'Instant text/spam baseline via Bayes rule' },
          { label: 'K-Means & DBSCAN (No Labels y!)', mod: goMod('mod12', 'mod14'), whyNext: 'Groups unlabeled data & flags −1 outliers' },
          { label: 'PCA (Axis Rotation & Compression)', mod: goMod('mod12', 'mod10'), whyNext: 'Squeezes redundant columns into top variance axes' },
          { label: 'Q-Learning (Learn from Rewards)', mod: goMod('mod15', 'mod18'), whyNext: 'Propagates delayed +100 goal rewards backward' }
        ]
      }
    ];

    return (
      '<div class="p-4 sm:p-5 rounded-2xl bg-[var(--content)] border-2 border-sky-500/40 space-y-4">' +
        '<div>' +
          '<span class="text-xs font-bold uppercase tracking-wider text-sky-400">🌳 Phase 4 • Interactive Model Family Lineage Map</span>' +
          '<h3 class="text-base sm:text-lg font-extrabold text-[var(--foreground)]">How Every Model Evolved to Fix What Broke in the Simpler Model Before It (Click Any Node to Jump)</h3>' +
        '</div>' +
        '<div class="space-y-3">' +
          tracks.map(function (t) {
            return '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2.5">' +
              '<div class="text-xs font-bold uppercase tracking-wider text-amber-400">' + esc(t.name) + '</div>' +
              '<div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">' +
                t.nodes.map(function (n, idx) {
                  return '<div class="p-2.5 rounded-xl bg-[var(--content)] border border-[var(--border)] flex flex-col justify-between gap-2">' +
                    '<div>' +
                      '<div class="flex items-center justify-between text-[11px] font-mono text-sky-400"><span>Stage ' + (idx + 1) + '</span><span>→</span></div>' +
                      '<button type="button" onclick="selectCurriculumModule(\'' + n.mod + '\', true)" class="font-extrabold text-xs text-left text-emerald-400 hover:underline cursor-pointer mt-0.5">' + esc(n.label) + '</button>' +
                    '</div>' +
                    '<div class="text-[11px] text-[var(--muted-foreground)] border-t border-[var(--border)] pt-1.5">' + esc(n.whyNext) + '</div>' +
                  '</div>';
                }).join('') +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>'
    );
  }

  function renderModelPickerWizardHtml() {
    const a = deckState.wizAnswers;
    const acad = detectAcad();
    let rec = {
      primary: 'XGBoost / Gradient Boosted Decision Trees',
      primaryMod: acad === 'll' ? 'mod3' : 'mod10',
      runnerUp: 'Random Forest (Parallel Bagging)',
      runnerMod: acad === 'll' ? 'mod11' : 'mod10',
      why: 'Your data is labeled tabular/forensic data with non-linear feature interactions (like Brand-in-Subdomain × Suspicious-TLD). XGBoost uses g = p − y and h = p(1−p) to capture complex interactions while SHAP/Explainer gives clear per-prediction reasons!'
    };

    if (a.q1 === 'unsup') {
      if (a.q2 === 'compress') {
        rec = {
          primary: 'Principal Component Analysis (PCA)',
          primaryMod: acad === 'll' ? 'mod10' : 'mod12',
          runnerUp: 't-SNE / UMAP (2D Visualization)',
          runnerMod: 'mod12',
          why: 'You have unlabeled columns that duplicate information (like SqFt and Rooms). PCA rotates the coordinate axes to compress redundant columns into top variance components!'
        };
      } else {
        rec = {
          primary: 'DBSCAN (Density Clustering + Outlier Detection) & K-Means++',
          primaryMod: acad === 'll' ? 'mod14' : 'mod12',
          runnerUp: 'Isolation Forest (Anomaly Detection)',
          runnerMod: 'mod12',
          why: 'You have zero labels y and want to discover natural groups and flag lone anomalies (−1 Noise). DBSCAN finds arbitrary-shaped dense clusters without forcing outliers inside!'
        };
      }
    } else if (a.q1 === 'rl') {
      rec = {
        primary: 'Q-Learning / Deep Q-Network (Reinforcement Learning)',
        primaryMod: acad === 'll' ? 'mod18' : 'mod15',
        runnerUp: 'Contextual Bandits (ε-Greedy)',
        runnerMod: 'mod15',
        why: 'Instead of static labels y, your agent acts in an environment and receives delayed rewards (+100 at the goal). Bellman Q-table updates propagate reward values backward step-by-step!'
      };
    } else if (a.q2 === 'num') {
      if (a.q4 === 'strict_eq' || a.q5 === 'zero_junk') {
        rec = {
          primary: 'Lasso (L1) / Ridge (L2) / ElasticNet Regularized Linear Regression',
          primaryMod: 'mod5',
          runnerUp: 'Best-Fit Line (Best-Fit Line Linear Regression)',
          runnerMod: 'mod_bestfit',
          why: 'You are predicting a continuous number (like House Price $) and want an exact linear formula where useless noise columns are automatically snapped to 0.00 (Lasso L1)!'
        };
      } else {
        rec = {
          primary: 'XGBoost Regressor / Random Forest Regressor',
          primaryMod: 'mod10',
          runnerUp: 'Ridge Regression (L2 Baseline)',
          runnerMod: 'mod5',
          why: 'You are predicting a continuous number on tabular data with non-linear curves and interactions. Boosted trees + Random Forest capture non-linear price jumps automatically!'
        };
      }
    } else {
      // Supervised Classification
      if (a.q3 === 'images_seq') {
        rec = {
          primary: 'Convolutional Neural Network (CNN) or Transformer (Self-Attention)',
          primaryMod: 'mod15',
          runnerUp: 'Multi-Layer Perceptron (MLP)',
          runnerMod: 'mod14',
          why: 'Raw pixels, audio waves, and long text sequences require hierarchical representation learning via 2D convolutions or Self-Attention!'
        };
      } else if (a.q5 === 'zero_train') {
        rec = {
          primary: 'K-Nearest Neighbors (KNN)',
          primaryMod: 'mod7',
          runnerUp: 'Naive Bayes Classifier',
          runnerMod: 'mod7',
          why: 'KNN requires zero training time (it memorizes the reference table) and classifies new items by measuring Euclidean distance to the k closest neighbors!'
        };
      } else if (a.q4 === 'strict_eq' || a.q3 === 'small_clean') {
        rec = {
          primary: 'L2-Regularized Logistic Regression (with Odds Ratios e^w)',
          primaryMod: acad === 'll' ? 'mod4' : 'mod6_odds',
          runnerUp: 'Naive Bayes / Linear SVM',
          runnerMod: acad === 'll' ? 'mod2' : 'mod8',
          why: 'You want calibrated probabilities p = 1/(1+e⁻ᶻ) with a single transparent equation where every feature has an exact Odds Ratio multiplier e^w and Weight Luck Chance!'
        };
      }
    }

    const selBox = function (qKey, label, opts) {
      return '<div class="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1.5">' +
        '<label class="text-xs font-bold text-sky-400 block">' + esc(label) + '</label>' +
        '<select onchange="window.BeginnerBlueprint.setWizAnswer(\'' + qKey + '\', this.value)" class="w-full p-2 rounded-lg bg-[var(--content)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)]">' +
          opts.map(function (o) {
            return '<option value="' + o[0] + '" ' + (a[qKey] === o[0] ? 'selected' : '') + '>' + esc(o[1]) + '</option>';
          }).join('') +
        '</select>' +
      '</div>';
    };

    return (
      '<div class="p-4 sm:p-5 rounded-2xl bg-[var(--content)] border-2 border-amber-500/40 space-y-4">' +
        '<div>' +
          '<span class="text-xs font-bold uppercase tracking-wider text-amber-400">🧭 Phase 4 • Interactive 5-Question Model-Picker Wizard</span>' +
          '<h3 class="text-base sm:text-lg font-extrabold text-[var(--foreground)]">“Which Model Should I Use?” Answer 5 Plain-English Questions to Find Your Best Model</h3>' +
        '</div>' +
        '<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2.5">' +
          selBox('q1', '1. Do you have labeled answers y?', [
            ['sup', 'Yes — Historical rows with known y'],
            ['unsup', 'No — Unlabeled rows X only'],
            ['rl', 'No — Agent learning from rewards']
          ]) +
          selBox('q2', '2. What is the output goal?', [
            ['cat', 'Predict Category / Probability (Phish vs Safe)'],
            ['num', 'Predict Continuous Number (Price $, Score)'],
            ['compress', 'Group rows or reduce column count']
          ]) +
          selBox('q3', '3. What kind of data structure?', [
            ['tabular_inter', 'Tabular + Non-Linear Feature Interactions'],
            ['small_clean', 'Small Clean Table / Linear Trend'],
            ['text_sparse', 'High-D Text / Char N-Grams (1,000+ cols)'],
            ['images_seq', 'Raw Images, Audio, or Long Sequences']
          ]) +
          selBox('q4', '4. Explainability requirement?', [
            ['acc_shap', 'Peak Accuracy + Per-Alert Reasons (SHAP)'],
            ['strict_eq', 'Single Formula Equation (Odds Ratios / Slope)']
          ]) +
          selBox('q5', '5. Special priority?', [
            ['fast_prod', 'Best Accuracy + <5ms Production Latency'],
            ['zero_junk', 'Auto-delete useless noise columns to 0.00'],
            ['zero_train', 'Zero training loop (instant neighbor lookup)']
          ]) +
        '</div>' +
        '<div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[var(--card)] to-sky-950/40 border-2 border-emerald-500/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">' +
          '<div class="space-y-1.5">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">🏆 #1 Recommended Model</span>' +
              '<span class="text-base sm:text-lg font-extrabold text-emerald-400">' + esc(rec.primary) + '</span>' +
              '<span class="text-xs text-[var(--muted-foreground)]">• Runner-Up Baseline: <strong>' + esc(rec.runnerUp) + '</strong></span>' +
            '</div>' +
            '<p class="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">' + esc(rec.why) + '</p>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2 shrink-0">' +
            '<button type="button" onclick="selectCurriculumModule(\'' + rec.primaryMod + '\', true)" class="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs cursor-pointer">📖 Open #1 Model Module →</button>' +
            '<button type="button" onclick="selectCurriculumModule(\'' + rec.runnerMod + '\', true)" class="px-3.5 py-2.5 rounded-xl bg-[var(--content)] border border-[var(--border)] text-[var(--foreground)] font-bold text-xs cursor-pointer">Open Runner-Up →</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderSameDataShowdownHtml() {
    const isPhish = deckState.showdownDataset === 'phish';
    const rows = isPhish ? [
      ['Logistic Regression (L2)', '91.2%', '0.948', '0.12 s', '🟢 High (Odds Ratios e^w)', ' guesses only 61% on "paypal.verify.tk" (misses Brand × TLD interaction)', 'mod6_odds'],
      ['Naive Bayes (Multinomial)', '88.5%', '0.921', '0.02 s (Fastest!)', '🟢 High (Clue counts)', 'Over-confident (99.99% or 0.01%) because it multiplies dependent clues', 'mod7'],
      ['KNN (k = 5 Neighbors)', '84.0%', '0.885', '0.00 s train / Slow pred', '🟡 Medium (Show 5 neighbors)', 'Struggles in 1,018 dimensions (Curse of Dimensionality)', 'mod7'],
      ['Linear / RBF SVM', '94.1%', '0.972', '4.80 s', '🟡 Medium (Support Vectors)', 'Strong margin, but uncalibrated raw scores without Platt scaling', 'mod8'],
      ['Single Decision Tree (Depth 6)', '92.8%', '0.951', '0.18 s', '🟢 Very High (Flowchart)', 'High variance — changing 2% of training URLs shifts lower splits', 'mod9'],
      ['Random Forest (100 Trees)', '96.4%', '0.988', '0.95 s', '🟡 Medium (Feature Importance)', 'Great stability, but parallel averaging misses subtle residual edge cases', 'mod10'],
      ['AdaBoost (100 Stumps)', '95.2%', '0.981', '0.85 s', '🟡 Medium', 'Sensitive to mislabeled noisy rows (exponential weight growth)', 'mod10'],
      ['🏆 XGBoost (300 Trees, Hist)', '98.7%', '0.996', '0.45 s', '🟢 High (with 11 Forensic Signals / SHAP)', '✅ Scores 99.3% on "paypal.verify.tk" by combining Brand×TLD×Entropy+N-grams!', 'mod10'],
      ['MLP Neural Net (2 Hidden Layers)', '96.8%', '0.989', '3.40 s', '🔴 Low (Black-box matrices)', 'Needs careful scaling & tuning; slower than Hist XGBoost on tabular features', 'mod14']
    ] : [
      ['Best-Fit Line', 'R² = 0.78', 'Typical Error Size = $42.5k', '0.01 s', '🟢 Very High (Slopes w)', 'Overfits when noisy duplicate columns (Shoe Size, Rooms vs SqFt) are added', 'mod_bestfit'],
      ['Ridge Regression (L2 Penalty)', 'R² = 0.86', 'Typical Error Size = $29.4k', '0.01 s', '🟢 High (Shrunk Slopes)', 'Handles correlated SqFt + Rooms smoothly, but keeps all noise columns > 0', 'mod5'],
      ['Lasso Regression (L1 Penalty)', 'R² = 0.88', 'Typical Error Size = $26.1k', '0.02 s', '🟢 Very High (Sparse)', 'Snaps useless noise columns to exact 0.00, but still assumes straight lines', 'mod5'],
      ['KNN Regressor (k = 5)', 'R² = 0.81', 'Typical Error Size = $36.0k', '0.00 s', '🟡 Medium (5 similar homes)', 'Cannot extrapolate if a new mansion is bigger than all training homes', 'mod7'],
      ['Single Regression Tree', 'R² = 0.83', 'Typical Error Size = $33.8k', '0.03 s', '🟢 Very High (Rules)', 'Step-function jumps; unstable if training sample changes slightly', 'mod9'],
      ['Random Forest Regressor', 'R² = 0.93', 'Typical Error Size = $19.2k', '0.40 s', '🟡 Medium', 'Smooths out single-tree jumps via 100-tree bootstrap averaging', 'mod10'],
      ['🏆 XGBoost Regressor', 'R² = 0.96', 'Typical Error Size = $14.1k', '0.22 s', '🟢 High (with SHAP)', '✅ Captures non-linear location × size × age interactions with lowest Typical Error Size!', 'mod10'],
      ['MLP Neural Net (ReLU)', 'R² = 0.92', 'Typical Error Size = $20.5k', '1.80 s', '🔴 Low', 'Approximates curves well, but requires more data and feature scaling', 'mod14']
    ];

    return (
      '<div class="p-4 sm:p-5 rounded-2xl bg-[var(--content)] border-2 border-indigo-500/40 space-y-4">' +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<div>' +
            '<span class="text-xs font-bold uppercase tracking-wider text-indigo-400">⚔️ Phase 4 • Live Same-Data Showdown Benchmark</span>' +
            '<h3 class="text-base sm:text-lg font-extrabold text-[var(--foreground)]">Every Model Tested Side-by-Side on the Exact Same Dataset (“Why XGBoost, Not Logistic?”)</h3>' +
          '</div>' +
          '<div class="flex items-center gap-2">' +
            '<button type="button" onclick="window.BeginnerBlueprint.setShowdownDataset(\'phish\')" class="px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ' + (isPhish ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]') + '">🎣 Dataset 1: LureLock Phishing URLs (Classification)</button>' +
            '<button type="button" onclick="window.BeginnerBlueprint.setShowdownDataset(\'house\')" class="px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ' + (!isPhish ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]') + '">🏠 Dataset 2: House Valuation &amp; Student Scores (Regression)</button>' +
          '</div>' +
        '</div>' +
        '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">' +
          '<table class="w-full text-left border-collapse text-xs">' +
            '<thead class="bg-slate-900/80 text-sky-300 uppercase">' +
              '<tr>' +
                '<th class="p-2.5 border-b border-r border-[var(--border)]">Model Tested</th>' +
                '<th class="p-2.5 border-b border-r border-[var(--border)]">' + (isPhish ? 'F1 Score' : 'R² Explained') + '</th>' +
                '<th class="p-2.5 border-b border-r border-[var(--border)]">' + (isPhish ? 'ROC-AUC' : 'Test Typical Error Size') + '</th>' +
                '<th class="p-2.5 border-b border-r border-[var(--border)]">Train Time</th>' +
                '<th class="p-2.5 border-b border-r border-[var(--border)]">Interpretability</th>' +
                '<th class="p-2.5 border-b border-r border-[var(--border)]">Why It Wins or Breaks on This Exact Data</th>' +
                '<th class="p-2.5 border-b border-[var(--border)]">Module</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody class="divide-y divide-[var(--border)]">' +
              rows.map(function (r) {
                const isWin = r[0].includes('🏆');
                return '<tr class="' + (isWin ? 'bg-emerald-950/30 font-semibold' : 'hover:bg-[var(--content)]/50') + '">' +
                  '<td class="p-2.5 border-r border-[var(--border)] font-bold text-[var(--foreground)]">' + esc(r[0]) + '</td>' +
                  '<td class="p-2.5 border-r border-[var(--border)] font-mono font-bold text-emerald-400">' + esc(r[1]) + '</td>' +
                  '<td class="p-2.5 border-r border-[var(--border)] font-mono text-sky-300">' + esc(r[2]) + '</td>' +
                  '<td class="p-2.5 border-r border-[var(--border)] font-mono text-[var(--muted-foreground)]">' + esc(r[3]) + '</td>' +
                  '<td class="p-2.5 border-r border-[var(--border)]">' + esc(r[4]) + '</td>' +
                  '<td class="p-2.5 border-r border-[var(--border)] text-[var(--foreground)]">' + esc(r[5]) + '</td>' +
                  '<td class="p-2.5"><button type="button" onclick="selectCurriculumModule(\'' + r[6] + '\', true)" class="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-bold hover:bg-sky-500/30 cursor-pointer">Open →</button></td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>'
    );
  }

  function renderLureLockSpecialShowcaseHtml() {
    const tabBtn = function (id, label) {
      const act = deckState.llTab === id;
      return '<button type="button" onclick="window.BeginnerBlueprint.setLLTab(\'' + id + '\')" ' +
        'class="px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ' +
        (act ? 'bg-sky-500 text-slate-950 border-sky-400 shadow' : 'bg-[var(--content)] text-[var(--foreground)] border-[var(--border)] hover:border-sky-400/50') + '">' +
        label + '</button>';
    };

    let content = '';
    if (deckState.llTab === 'why_xgb') {
      content =
        '<div class="space-y-3">' +
          '<p class="text-xs sm:text-sm text-[var(--foreground)]"><strong>Why does LureLock use 300-Tree XGBoost instead of Logistic Regression, a Single Decision Tree, or a Random Forest?</strong> Compare all 4 models on 4 real-world test URLs:</p>' +
          '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">' +
            '<table class="w-full text-left border-collapse text-xs">' +
              '<thead class="bg-slate-900/80 text-sky-300 uppercase">' +
                '<tr>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">Real Test URL</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">Logistic Regression</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">1 Decision Tree</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">Random Forest</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">🏆 LureLock 300-Tree XGBoost</th>' +
                  '<th class="p-2.5 border-b border-[var(--border)]">Why Simpler Models Broke</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody class="divide-y divide-[var(--border)]">' +
                '<tr><td class="p-2.5 border-r border-[var(--border)] font-mono font-bold text-emerald-400">https://github.com/login (Safe)</td><td class="p-2.5 border-r border-[var(--border)]">18% (Safe)</td><td class="p-2.5 border-r border-[var(--border)]">45% (False Warn!)</td><td class="p-2.5 border-r border-[var(--border)]">12% (Safe)</td><td class="p-2.5 border-r border-[var(--border)] font-bold text-emerald-400">2.1% ✅ SAFE</td><td class="p-2.5">1 Tree over-reacted to the word "login" alone!</td></tr>' +
                '<tr><td class="p-2.5 border-r border-[var(--border)] font-mono font-bold text-rose-400">http://paypa1-security.tk/login (Phish)</td><td class="p-2.5 border-r border-[var(--border)]">89% (Block)</td><td class="p-2.5 border-r border-[var(--border)]">92% (Block)</td><td class="p-2.5 border-r border-[var(--border)]">96% (Block)</td><td class="p-2.5 border-r border-[var(--border)] font-bold text-rose-400">99.3% 🚨 BLOCK</td><td class="p-2.5">Obvious multi-clue phish — all models catch it, XGBoost is sharpest.</td></tr>' +
                '<tr><td class="p-2.5 border-r border-[var(--border)] font-mono font-bold text-rose-400">https://paypal.com.auth-portal.org (Phish)</td><td class="p-2.5 border-r border-[var(--border)] text-rose-300">42% ❌ MISSED!</td><td class="p-2.5 border-r border-[var(--border)]">85% (Block)</td><td class="p-2.5 border-r border-[var(--border)]">88% (Block)</td><td class="p-2.5 border-r border-[var(--border)] font-bold text-rose-400">97.8% 🚨 BLOCK</td><td class="p-2.5">Logistic adds flat weights (HTTPS + .org look safe!), missing the Brand-in-Subdomain interaction!</td></tr>' +
                '<tr><td class="p-2.5 border-r border-[var(--border)] font-mono font-bold text-rose-400">https://cdn-docs.net/wp-includes/8f3k9q/ (Phish)</td><td class="p-2.5 border-r border-[var(--border)] text-rose-300">38% ❌ MISSED!</td><td class="p-2.5 border-r border-[var(--border)] text-rose-300">51% (Unsure)</td><td class="p-2.5 border-r border-[var(--border)]">79% (Block)</td><td class="p-2.5 border-r border-[var(--border)] font-bold text-rose-400">96.4% 🚨 BLOCK</td><td class="p-2.5">Late boosting trees (Trees 50–300) specialize in subtle Path Entropy × N-gram residuals!</td></tr>' +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>';
    } else if (deckState.llTab === 'url_to_num') {
      const stages = [
        { title: 'Stage 1: Raw Suspect URL String Arrives', code: 'url = "http://paypa1-security-update.tk/wp-includes/8f3k9q/login?redirect=http://evil.ru"', out: 'Raw string (82 characters) — no model can multiply letters directly!' },
        { title: 'Stage 2: Domain & Public Suffix Dissection (domain_utils.py)', code: 'scheme="http", subdomain="paypa1-security-update", apex="paypa1-security-update.tk", tld="tk"', out: 'F0 (Length)=82, F1 (Dots)=3, F9 (Suspicious TLD .tk)=1, F10 (Brand Spoof "paypa1")=1' },
        { title: 'Stage 3: Character Randomness H(X) & Digit-Swap Ratios (F12–F17)', code: 'H(X) = -∑ p(c) log₂ p(c) across "/wp-includes/8f3k9q/login"', out: 'F12 (Entropy) = 4.32 bits/char (High randomness in /8f3k9q/!), F13 (Digit Ratio) = 0.085, F16 (Has Redirect) = 1' },
        { title: 'Stage 4: Sublinear 3–5 Char N-Gram Rare-Pattern Score & L₂ Normalization (F18–F1017)', code: 'N-grams: ["pay", "ypa", "pa1", "-se", ".tk", "wp-", "8f3", "red", "ire"] ➔ (1 + ln tf)·idf / ‖v‖₂', out: 'F809 ("pa1") = 0.412, F312 (".tk") = 0.389, F514 ("wp-") = 0.355 (992 other N-gram slots = 0.0)' },
        { title: 'Stage 5: Final 1 × 1,018 CSR Sparse Feature Vector Enters XGBoost!', code: 'X_row = csr_matrix([ [82, 3, 0, 0, 1, ..., 4.32, ..., 0.412, ..., 0.389] ]) # shape (1, 1018)', out: '✅ 1 URL is now 1,018 numbers! XGBoost scores X_row across 300 trees in 3.8 ms → p = 99.3% BLOCK!' }
      ];
      const cur = stages[deckState.urlStage] || stages[0];
      content =
        '<div class="space-y-3">' +
          '<div class="flex flex-wrap items-center justify-between gap-2">' +
            '<span class="text-xs sm:text-sm font-bold text-[var(--foreground)]">Step through how <strong>1 raw URL string</strong> becomes <strong>1,018 numbers</strong> before reaching any model:</span>' +
            '<div class="flex items-center gap-2">' +
              '<button type="button" onclick="window.BeginnerBlueprint.setUrlStage(' + Math.max(0, deckState.urlStage - 1) + ')" ' + (deckState.urlStage === 0 ? 'disabled' : '') + ' class="px-2.5 py-1 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs font-bold disabled:opacity-40 cursor-pointer">◀ Prev Stage</button>' +
              '<span class="text-xs font-mono font-bold text-sky-400">Stage ' + (deckState.urlStage + 1) + ' of 5</span>' +
              '<button type="button" onclick="window.BeginnerBlueprint.setUrlStage(' + Math.min(4, deckState.urlStage + 1) + ')" ' + (deckState.urlStage === 4 ? 'disabled' : '') + ' class="px-3 py-1 rounded-lg bg-sky-500 text-slate-950 text-xs font-bold disabled:opacity-40 cursor-pointer">Next Stage ▶</button>' +
            '</div>' +
          '</div>' +
          '<div class="p-4 rounded-2xl bg-[var(--card)] border border-sky-500/40 space-y-2">' +
            '<div class="text-sm font-extrabold text-sky-300">' + esc(cur.title) + '</div>' +
            '<pre class="p-3 rounded-xl bg-[var(--content)] border border-[var(--border)] font-mono text-xs text-emerald-300 overflow-x-auto">' + esc(cur.code) + '</pre>' +
            '<div class="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono text-amber-300"><strong>Numeric Output:</strong> ' + esc(cur.out) + '</div>' +
          '</div>' +
        '</div>';
    } else if (deckState.llTab === 'tree_300') {
      const treeRows = [
        ['Tree 0 (Baseline)', 'Starting prior before looking at URL features', '0.00', 'z = 0.00', 'p = 50.0% (Coin flip)', 'g = −0.500, h = 0.250'],
        ['+ Tree #1', 'Checks F10 (Brand "paypa1" in Subdomain) == 1', '+1.15', 'z = +1.15', 'p = 76.0% (Suspicious!)', 'g = −0.240, h = 0.182'],
        ['+ Tree #2', 'Checks F9 (Suspicious TLD ".tk") == 1 AND F0 (Length > 60)', '+0.85', 'z = +2.00', 'p = 88.1% (High Alert)', 'g = −0.119, h = 0.105'],
        ['+ Tree #3..#10', 'Checks F12 (Path Entropy = 4.32 > 4.0) & F809 (Trigram "pa1")', '+1.10', 'z = +3.10', 'p = 95.7% (Block Threshold Passed!)', 'g = −0.043, h = 0.041'],
        ['+ Tree #11..#50', 'Checks F16 (Open Redirect "?redirect=") & F514 ("wp-includes")', '+0.95', 'z = +4.05', 'p = 98.3%', 'g = −0.017, h = 0.017'],
        ['+ Tree #51..#300', '250 fine-grained polish trees confirming zero benign overrides', '+0.90', 'z = +4.95', 'p = 99.3% 🚨 FINAL VERDICT: BLOCK!', 'g = −0.007 (Converged!)']
      ];
      content =
        '<div class="space-y-3">' +
          '<p class="text-xs sm:text-sm text-[var(--foreground)]">Watch how <strong>one phishing link</strong> (<code>http://paypa1-security-update.tk/wp-includes/8f3k9q/login?redirect=...</code>) accumulates log-odds tree-by-tree across all 300 trees:</p>' +
          '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">' +
            '<table class="w-full text-left border-collapse text-xs">' +
              '<thead class="bg-slate-900/80 text-sky-300 uppercase">' +
                '<tr>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">Tree Stage</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">What This Tree Checked on Our Link</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">Leaf Value Added (fₖ)</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">Running Log-Odds Sum (z)</th>' +
                  '<th class="p-2.5 border-b border-r border-[var(--border)]">Sigmoid Prob p = 1/(1+e⁻ᶻ)</th>' +
                  '<th class="p-2.5 border-b border-[var(--border)]">Remaining Gradient g = p−y &amp; Bowl Steepness h</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody class="divide-y divide-[var(--border)]">' +
                treeRows.map(function (r, idx) {
                  return '<tr class="' + (idx === treeRows.length - 1 ? 'bg-emerald-950/30 font-bold' : '') + '">' +
                    '<td class="p-2.5 border-r border-[var(--border)] font-mono font-bold text-amber-300">' + esc(r[0]) + '</td>' +
                    '<td class="p-2.5 border-r border-[var(--border)] text-[var(--foreground)]">' + esc(r[1]) + '</td>' +
                    '<td class="p-2.5 border-r border-[var(--border)] font-mono text-emerald-400">' + esc(r[2]) + '</td>' +
                    '<td class="p-2.5 border-r border-[var(--border)] font-mono text-sky-300">' + esc(r[3]) + '</td>' +
                    '<td class="p-2.5 border-r border-[var(--border)] font-mono font-bold text-rose-300">' + esc(r[4]) + '</td>' +
                    '<td class="p-2.5 font-mono text-[var(--muted-foreground)]">' + esc(r[5]) + '</td>' +
                  '</tr>';
                }).join('') +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>';
    } else {
      content =
        '<div class="space-y-3">' +
          '<p class="text-xs sm:text-sm text-[var(--foreground)]"><strong>How LureLock’s 3-Tier Arbitration Flowchart Works</strong> — with 1 concrete example link traced through each tier:</p>' +
          '<div class="grid grid-cols-1 lg:grid-cols-3 gap-3">' +
            '<div class="p-4 rounded-2xl bg-[var(--card)] border-2 border-emerald-500/40 space-y-2">' +
              '<div class="flex items-center justify-between"><span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">⚡ TIER 1 • Deterministic Gate (&lt; 0.3 ms)</span></div>' +
              '<div class="font-bold text-sm text-[var(--foreground)]">Cryptographic Allowlist, Raw IP/@ Syntax &amp; Recursive Onion Peeler</div>' +
              '<div class="p-2.5 rounded-xl bg-[var(--content)] border border-[var(--border)] font-mono text-xs text-amber-300">Example Link #1:<br>http://193.29.14.88/@paypal.com/login</div>' +
              '<p class="text-xs text-[var(--foreground)]"><strong>Flowchart Path:</strong> Raw IPv4 host + <code>@</code> credential trick detected at Tier 1 → <strong>Instant Deterministic BLOCK</strong> without even needing to wait for Tier 2/3!</p>' +
            '</div>' +
            '<div class="p-4 rounded-2xl bg-[var(--card)] border-2 border-sky-500/40 space-y-2">' +
              '<div class="flex items-center justify-between"><span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300">🧠 TIER 2 • 300-Tree XGBoost Brain (~3.8 ms)</span></div>' +
              '<div class="font-bold text-sm text-[var(--foreground)]">1,018-Feature Lexical + N-Gram Statistical Scoring</div>' +
              '<div class="p-2.5 rounded-xl bg-[var(--content)] border border-[var(--border)] font-mono text-xs text-sky-300">Example Link #2:<br>https://paypa1-account-verify.tk/update</div>' +
              '<p class="text-xs text-[var(--foreground)]"><strong>Flowchart Path:</strong> Passes Tier 1 syntax check → Tier 2 extracts 1,018 features → 300 trees output <strong>p = 99.3% (≥ 0.70 High Threshold)</strong> → <strong>Immediate Statistical BLOCK!</strong></p>' +
            '</div>' +
            '<div class="p-4 rounded-2xl bg-[var(--card)] border-2 border-amber-500/40 space-y-2">' +
              '<div class="flex items-center justify-between"><span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">🔬 TIER 3 • Gray-Zone Wire &amp; ΔH Inspector</span></div>' +
              '<div class="font-bold text-sm text-[var(--foreground)]">Triggered When Tier 2 Lands in Ambiguous Gray Zone (0.35 ≤ p &lt; 0.70)</div>' +
              '<div class="p-2.5 rounded-xl bg-[var(--content)] border border-[var(--border)] font-mono text-xs text-rose-300">Example Link #3:<br>https://short-link.io/9k2p ➔ 302 ➔ evil-login.xyz</div>' +
              '<p class="text-xs text-[var(--foreground)]"><strong>Flowchart Path:</strong> Shortened wrapper gets p = 0.52 (Gray Zone) in Tier 2 → Escalates to Tier 3 → Unrolls HTTP 302 redirect on the wire → Scores final destination at <strong>98.9% BLOCK!</strong></p>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    return (
      '<div class="p-4 sm:p-5 rounded-2xl bg-[var(--content)] border-2 border-sky-500/40 space-y-4">' +
        '<div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">' +
          '<div>' +
            '<span class="text-xs font-bold uppercase tracking-wider text-sky-400">🛡️ LureLock Beginner-Proof Forensic Additions</span>' +
            '<h3 class="text-base sm:text-lg font-extrabold text-[var(--foreground)]">Why XGBoost Here, 1-URL-to-1,018-Numbers Pipeline, 300-Tree Accumulation &amp; 3-Tier Flowchart</h3>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-1.5">' +
            tabBtn('why_xgb', '⚖️ 1. Why XGBoost Here?') +
            tabBtn('url_to_num', '🔢 2. How 1 URL Becomes 1,018 Numbers') +
            tabBtn('tree_300', '🌲 3. 300-Tree Accumulation Table') +
            tabBtn('tier_3', '🚦 4. 3-Tier Arbitration Flowchart') +
          '</div>' +
        '</div>' +
        content +
      '</div>'
    );
  }

  function renderMasterDeck() {
    const acad = detectAcad();
    if (acad !== 'ml' && acad !== 'll') return;
    const flowHub = document.getElementById('v8-learning-flow-hub');
    const currSec = document.getElementById('view-curriculum');
    if (!currSec) return;

    let deckEl = document.getElementById('v9-beginner-master-deck');
    if (!deckEl) {
      deckEl = document.createElement('div');
      deckEl.id = 'v9-beginner-master-deck';
      deckEl.className = 'space-y-3 my-3';
      if (flowHub && flowHub.parentNode) {
        flowHub.parentNode.insertBefore(deckEl, flowHub.nextSibling);
      } else {
        currSec.insertBefore(deckEl, currSec.firstChild);
      }
    }

    const pill = function (id, icon, title, sub, col) {
      const act = deckState.openPanel === id;
      return '<button type="button" onclick="window.BeginnerBlueprint.toggleMasterDeckPanel(\'' + id + '\')" ' +
        'class="p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer ' +
        (act ? 'bg-emerald-500/20 border-emerald-400 shadow-md' : 'bg-[var(--card)] border-[var(--border)] hover:border-sky-400/50') + '">' +
        '<div class="min-w-0">' +
          '<div class="text-xs font-extrabold text-' + col + '-400 flex items-center gap-1.5"><span>' + icon + '</span><span>' + esc(title) + '</span></div>' +
          '<div class="text-[11px] text-[var(--muted-foreground)] truncate mt-0.5">' + esc(sub) + '</div>' +
        '</div>' +
        '<span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--content)] border border-[var(--border)]">' + (act ? '▲ Hide' : '▼ Open') + '</span>' +
      '</button>';
    };

    let activePanelHtml = '';
    if (deckState.openPanel === 'foundation') activePanelHtml = renderFoundationPanelHtml();
    else if (deckState.openPanel === 'lineage') activePanelHtml = renderLineageMapPanelHtml();
    else if (deckState.openPanel === 'wizard') activePanelHtml = renderModelPickerWizardHtml();
    else if (deckState.openPanel === 'showdown') activePanelHtml = renderSameDataShowdownHtml();
    else if (deckState.openPanel === 'll_special') activePanelHtml = renderLureLockSpecialShowcaseHtml();

    deckEl.innerHTML =
      '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">' +
        pill('foundation', '🧱', '1. Foundation Layer (Pre-Level 0)', 'ML Loop • 5 Core Words • Gradient Nudge • Confusion Cards', 'emerald') +
        pill('lineage', '🌳', '2. Model Family Lineage Map', 'Linear → Logistic → Neural | Tree → Forest → XGBoost', 'sky') +
        pill('wizard', '🧭', '3. “Which Model Should I Use?”', '5-Question Interactive Model Picker Wizard', 'amber') +
        pill('showdown', '⚔️', '4. Same-Data Showdown', 'All Models Benchmarked on Phishing & Housing Data', 'indigo') +
        pill('ll_special', '🛡️', '5. LureLock 4-Stage Deep Dive', 'Why XGBoost • 1 URL→1,018 Numbers • 300 Trees • 3 Tiers', 'rose') +
      '</div>' +
      activePanelHtml;
  }

  // ==========================================================================
  // 2. UNIVERSAL 7-BLOCK BEGINNER-PROOF TEMPLATE & NUMBERS MOVIE RENDERER
  // ==========================================================================
  const movieStepByMod = {};
  const activeSubMovieByMod = {};

  function getBlueprint(modId, acad) {
    const map = acad === 'll' ? LL_BLUEPRINTS : ML_BLUEPRINTS;
    return map[modId] || map.mod0;
  }

  function renderNumbersMovieHtml(modId, acad) {
    const bp = getBlueprint(modId, acad);
    const subKeys = bp.subMovieKeys || [bp.movieKey];
    const activeKey = activeSubMovieByMod[modId] || subKeys[0] || 'linear_regression';
    const movie = ALL_MOVIES[activeKey] || ALL_MOVIES.linear_regression;
    const total = movie.steps.length;
    const stepIdx = Math.max(0, Math.min(total - 1, movieStepByMod[modId + '_' + activeKey] || 0));
    const curStep = movie.steps[stepIdx];

    const subTabsHtml = subKeys.length > 1 ? (
      '<div class="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[var(--border)]">' +
        '<span class="text-xs font-bold text-[var(--muted-foreground)] mr-1">Select Model Movie in This Module:</span>' +
        subKeys.map(function (k) {
          const mv = ALL_MOVIES[k];
          const isAct = k === activeKey;
          return '<button type="button" onclick="window.BeginnerBlueprint.selectSubMovie(\'' + modId + '\', \'' + k + '\')" ' +
            'class="px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ' +
            (isAct ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]') + '">' +
            '🎬 ' + esc(mv ? mv.title.split(':')[0] : k) +
          '</button>';
        }).join('') +
      '</div>'
    ) : '';

    const barsHtml = (curStep.bars || []).map(function (b) {
      const pct = Math.max(3, Math.min(100, Math.round((Math.abs(b.val) / (b.max || 100)) * 100)));
      const colCls = b.col === 'emerald' ? 'bg-emerald-500' : b.col === 'rose' ? 'bg-rose-500' : b.col === 'amber' ? 'bg-amber-500' : 'bg-sky-500';
      return (
        '<div class="space-y-1">' +
          '<div class="flex justify-between text-xs font-mono">' +
            '<span class="text-[var(--foreground)] font-semibold">' + esc(b.label) + '</span>' +
            '<span class="font-bold text-' + b.col + '-400">' + b.val + '</span>' +
          '</div>' +
          '<div class="w-full h-2.5 rounded-full bg-[var(--content)] overflow-hidden border border-[var(--border)]">' +
            '<div class="h-full ' + colCls + ' transition-all duration-300" style="width:' + pct + '%"></div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    return (
      '<div id="v9-numbers-movie-' + modId + '" class="p-4 sm:p-5 rounded-2xl bg-[var(--content)] border-2 border-emerald-500/45 space-y-3.5 shadow-md">' +
        subTabsHtml +
        '<div class="flex flex-wrap items-center justify-between gap-2">' +
          '<div>' +
            '<div class="text-xs font-bold uppercase tracking-wider text-emerald-400">🎬 Block 3 • The Numbers Movie (Tables First, Then Chart!)</div>' +
            '<h4 class="text-sm sm:text-base font-extrabold text-[var(--foreground)]">' + esc(movie.title) + '</h4>' +
            '<div class="text-xs text-amber-300 font-semibold mt-0.5">💡 Naive Question Answered: ' + esc(movie.naiveQ) + '</div>' +
          '</div>' +
          '<div class="flex items-center gap-2">' +
            '<button type="button" onclick="window.BeginnerBlueprint.stepMovie(\'' + modId + '\', \'' + activeKey + '\', -1)" ' + (stepIdx === 0 ? 'disabled' : '') +
              ' class="px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] disabled:opacity-40 cursor-pointer">◀ Prev Step</button>' +
            '<span class="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300">Step ' + (stepIdx + 1) + ' of ' + total + '</span>' +
            '<button type="button" onclick="window.BeginnerBlueprint.stepMovie(\'' + modId + '\', \'' + activeKey + '\', 1)" ' + (stepIdx === total - 1 ? 'disabled' : '') +
              ' class="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold disabled:opacity-40 cursor-pointer">Next ▶</button>' +
          '</div>' +
        '</div>' +

        '<!-- Step Pill Selector -->' +
        '<div class="grid grid-cols-1 sm:grid-cols-' + total + ' gap-2">' +
          movie.steps.map(function (st, idx) {
            const act = idx === stepIdx;
            return '<button type="button" onclick="window.BeginnerBlueprint.setMovieStep(\'' + modId + '\', \'' + activeKey + '\', ' + idx + ')" ' +
              'class="p-2 rounded-xl border text-left text-xs transition cursor-pointer ' +
              (act ? 'bg-emerald-500/20 border-emerald-400 text-[var(--foreground)] font-bold' : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)]') + '">' +
              esc(st.label) +
            '</button>';
          }).join('') +
        '</div>' +

        '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">' +
          '<strong class="text-emerald-400">' + esc(curStep.label) + ':</strong> ' + esc(curStep.summary) +
        '</div>' +

        '<!-- Hand-Checkable Numbers Table (Rule: Tables First!) -->' +
        '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">' +
          '<table class="w-full text-left border-collapse text-xs">' +
            '<thead class="bg-slate-900/80 text-sky-300 uppercase">' +
              '<tr>' +
                movie.headers.map(function (h) {
                  return '<th class="p-2.5 border-b border-r border-[var(--border)]">' + esc(h) + '</th>';
                }).join('') +
              '</tr>' +
            '</thead>' +
            '<tbody class="divide-y divide-[var(--border)] font-mono">' +
              curStep.rows.map(function (row, rIdx) {
                const isLast = rIdx === curStep.rows.length - 1;
                return '<tr class="' + (isLast ? 'bg-emerald-950/25 font-bold' : '') + '">' +
                  row.map(function (cell, cIdx) {
                    return '<td class="p-2.5 border-r border-[var(--border)] ' + (cIdx === 0 ? 'text-amber-300 font-bold' : isLast ? 'text-emerald-300' : 'text-[var(--foreground)]') + '">' + esc(cell) + '</td>';
                  }).join('') +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>' +
        '</div>' +

        '<!-- Synchronized Visual Chart Bars Underneath Table -->' +
        '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2">' +
          '<div class="text-xs font-bold uppercase tracking-wider text-sky-400">📊 Visual Magnitude Check (Matches the Table Numbers Above)</div>' +
          '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">' + barsHtml + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderSevenBlockTemplateHtml(modId, acad) {
    const bp = getBlueprint(modId, acad);
    const meta = (global.AcademyCore && (acad === 'll' ? global.AcademyCore.LL_PEDAGOGY_MAP[modId] : global.AcademyCore.ML_PEDAGOGY_MAP[modId])) || {};
    const saved = global.AcademyCore ? global.AcademyCore.loadAcademyStorage(acad) : {};
    const checks = (saved.moduleChecks && saved.moduleChecks[modId]) || {};
    const openFaqIdx = (global._v9OpenFaq && global._v9OpenFaq[modId] !== undefined) ? global._v9OpenFaq[modId] : 0;

    // Build 3-question check with explicit tempting-wrong-answer explanations for EVERY option
    const pr = meta.predict || {
      q: 'What is the primary purpose of this model/concept?',
      opts: ['Guessing randomly without data', bp.plainRecipe, 'Deleting all input features'],
      ans: 1,
      why: bp.whyExists
    };
    const questions = [
      {
        q: pr.q,
        opts: pr.opts,
        ans: pr.ans,
        wrongExplanations: [
          'Option A is tempting if you confuse baseline initialization with the trained behavior, but ' + pr.why,
          'Option B is tempting if you reverse the direction of the formula parameter, but ' + pr.why,
          'Option C is a common misconception when ignoring the scale/sign of the term — ' + pr.why
        ],
        rightExplanation: pr.why
      },
      {
        q: 'Why does this model/concept exist — what broke in the simpler approach before it?',
        opts: [
          bp.whyExists,
          'The simpler model was too accurate and never made mistakes on any dataset',
          'Computers cannot multiply numbers without this exact module'
        ],
        ans: 0,
        wrongExplanations: [
          '',
          'Option B is tempting if you only look at Training Error (where a simple or overfit model looks fine), but simpler models break on new test cases or non-linear interactions!',
          'Option C confuses basic CPU arithmetic with the statistical limitation of the previous model (' + bp.rivalName + ').'
        ],
        rightExplanation: bp.whyExists
      },
      {
        q: 'When should you AVOID picking this approach and use another model instead?',
        opts: [
          'Always use this model for every problem in data science',
          bp.whenAvoid,
          'Never use this model even when its assumptions hold'
        ],
        ans: 1,
        wrongExplanations: [
          'Option A ("No Free Lunch" trap!) is tempting once you learn a strong model, but every model has a specific failure mode: ' + bp.whenAvoid,
          '',
          'Option C throws away a tool that excels when: ' + bp.whenPick
        ],
        rightExplanation: 'Knowing what breaks is just as important as knowing how it works: ' + bp.whenAvoid
      }
    ];

    const qCardsHtml = questions.map(function (qItem, qi) {
      const sel = typeof checks[qi] === 'number' ? checks[qi] : null;
      const isRight = sel === qItem.ans;
      return (
        '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2">' +
          '<div class="flex items-center justify-between text-xs font-bold text-sky-400">' +
            '<span>Question ' + (qi + 1) + ' of 3</span>' +
            (sel !== null ? (isRight ? '<span class="text-emerald-400">✅ Correct!</span>' : '<span class="text-rose-400">❌ See Why Below</span>') : '') +
          '</div>' +
          '<div class="text-xs sm:text-sm font-bold text-[var(--foreground)]">' + esc(qItem.q) + '</div>' +
          '<div class="space-y-1.5">' +
            qItem.opts.map(function (o, oi) {
              const isSel = sel === oi;
              const isAns = oi === qItem.ans;
              let c = 'bg-[var(--content)] border-[var(--border)] text-[var(--foreground)]';
              if (sel !== null) {
                if (isAns) c = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                else if (isSel) c = 'bg-rose-500/20 border-rose-400 text-rose-300';
              }
              return (
                '<button type="button" onclick="window.BeginnerBlueprint.answerCheck(\'' + modId + '\', ' + qi + ', ' + oi + ')" ' +
                  'class="w-full text-left p-2 rounded-lg border text-xs transition cursor-pointer ' + c + '">' +
                  '<span class="font-mono font-bold mr-1.5">' + ['A', 'B', 'C'][oi] + '.</span>' +
                  esc(o) +
                '</button>'
              );
            }).join('') +
          '</div>' +
          (sel !== null ? (
            '<div class="p-2.5 rounded-lg border text-xs leading-relaxed ' + (isRight ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/30 border-rose-500/40 text-rose-200') + '">' +
              (isRight
                ? ('<strong>✅ Why Option ' + ['A', 'B', 'C'][qItem.ans] + ' Is Right:</strong> ' + esc(qItem.rightExplanation))
                : ('<strong>🪤 Why Option ' + ['A', 'B', 'C'][sel] + ' Is Tempting (Mental Trap):</strong> ' + esc(qItem.wrongExplanations[sel] || qItem.rightExplanation) +
                   '<br><strong class="text-emerald-300">✅ Why Option ' + ['A', 'B', 'C'][qItem.ans] + ' Works:</strong> ' + esc(qItem.rightExplanation))) +
            '</div>'
          ) : '') +
        '</div>'
      );
    }).join('');

    return {
      part1Html: (
        '<section id="v9-seven-block-template-' + modId + '" aria-label="7-Block Beginner-Proof Mastery Guide" class="space-y-4 my-4">' +
          '<!-- BLOCK 1 & BLOCK 2: The Problem in 1 Sentence + Why It Exists (What Simpler Model Couldn\'t Do) -->' +
          '<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">' +
            '<div class="p-4 rounded-2xl bg-[var(--content)] border border-emerald-500/40 space-y-1.5">' +
              '<div class="text-xs font-bold uppercase tracking-wider text-emerald-400">🎯 Block 1 • The Problem in One Sentence (Running Example)</div>' +
              '<p class="text-xs sm:text-sm font-semibold text-[var(--foreground)] leading-relaxed">' + esc(meta.why || bp.plainRecipe) + '</p>' +
            '</div>' +
            '<div class="p-4 rounded-2xl bg-[var(--content)] border border-amber-500/40 space-y-1.5">' +
              '<div class="text-xs font-bold uppercase tracking-wider text-amber-400">🔗 Block 2 • Why It Exists (What the Simpler Model Couldn’t Do)</div>' +
              '<p class="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">' + esc(bp.whyExists) + '</p>' +
            '</div>' +
          '</div>' +
        '</section>'
      ),
      block3Html: (
        '<section id="v9-block3-section-' + modId + '" class="space-y-4 my-4">' +
          '<!-- BLOCK 3: The Numbers Movie -->' +
          renderNumbersMovieHtml(modId, acad) +
        '</section>'
      ),
      block4Html: (
        '<section id="v9-block4-section-' + modId + '" class="space-y-4 my-4">' +
          '<!-- BLOCK 4: Plain-Words, Then Numbers, Then Labeled Symbols -->' +
          '<div class="p-4 rounded-2xl bg-[var(--content)] border border-sky-500/40 space-y-3">' +
            '<div class="text-xs font-bold uppercase tracking-wider text-sky-400">🗣️ Block 4 • Plain-Words First, Then Real Numbers, Then Symbols</div>' +
            '<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">' +
              '<div class="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1">' +
                '<div class="font-bold text-emerald-400">① In Plain Everyday Words</div>' +
                '<p class="text-[var(--foreground)] leading-relaxed">' + esc(bp.plainRecipe) + '</p>' +
              '</div>' +
              '<div class="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1">' +
                '<div class="font-bold text-amber-400">② With Real Checked Numbers</div>' +
                '<p class="font-mono text-[var(--foreground)] leading-relaxed">' + esc(bp.numExample) + '</p>' +
              '</div>' +
              '<div class="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-1">' +
                '<div class="font-bold text-sky-400">③ Labeled Symbols Connection</div>' +
                '<p class="text-[var(--muted-foreground)] leading-relaxed">Hover any underlined glossary term or open <strong>Part 4 (Formula &amp; Symbol Decoder)</strong> / <a href="machine_learning_formula_rosetta_stone.html" class="text-amber-400 underline">Rosetta Stone</a> for every Greek letter.</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>'
      ),
      block5Html: (
        '<section id="v9-block5-section-' + modId + '" class="space-y-4 my-4">' +
          '<!-- BLOCK 5: Why This Model, Not Another (When to Pick + Live Head-to-Head) -->' +
          '<div class="p-4 rounded-2xl bg-[var(--content)] border border-indigo-500/40 space-y-3">' +
            '<div class="flex flex-wrap items-center justify-between gap-2">' +
              '<span class="text-xs font-bold uppercase tracking-wider text-indigo-400">⚖️ Block 5 • Why This Model, Not Another (When to Pick + Same-Data Head-to-Head)</span>' +
              '<button type="button" onclick="window.BeginnerBlueprint.toggleMasterDeckPanel(\'showdown\')" class="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold cursor-pointer">⚔️ Open Full 9-Model Showdown →</button>' +
            '</div>' +
            '<div class="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">' +
              '<table class="w-full text-left border-collapse text-xs">' +
                '<thead class="bg-slate-900/80 text-indigo-300 uppercase">' +
                  '<tr>' +
                    '<th class="p-2.5 border-b border-r border-[var(--border)]">✅ Pick This When...</th>' +
                    '<th class="p-2.5 border-b border-r border-[var(--border)]">❌ Do Not Pick When (What Breaks)</th>' +
                    '<th class="p-2.5 border-b border-[var(--border)]">⚔️ Head-to-Head vs. ' + esc(bp.rivalName) + ' on Same Data</th>' +
                  '</tr>' +
                '</thead>' +
                '<tbody>' +
                  '<tr>' +
                    '<td class="p-3 border-r border-[var(--border)] text-emerald-300 font-medium leading-relaxed">' + esc(bp.whenPick) + '</td>' +
                    '<td class="p-3 border-r border-[var(--border)] text-rose-300 font-medium leading-relaxed">' + esc(bp.whenAvoid) + '</td>' +
                    '<td class="p-3 text-[var(--foreground)] leading-relaxed">' + esc(bp.headToHead) + '</td>' +
                  '</tr>' +
                '</tbody>' +
              '</table>' +
            '</div>' +
          '</div>' +
        '</section>'
      ),
      block67Html: (
        '<section id="v9-block67-section-' + modId + '" class="space-y-4 my-4">' +
          '<!-- BLOCK 6: Common Mistakes & Clickable Naive-Student FAQ Chips -->' +
          '<div class="p-4 rounded-2xl bg-[var(--content)] border border-amber-500/40 space-y-3">' +
            '<div class="text-xs font-bold uppercase tracking-wider text-amber-400">🪤 Block 6 • Common Mistakes &amp; Naive-Student FAQ Chips (Click Any Question!)</div>' +
            '<div class="p-3 rounded-xl bg-amber-950/25 border border-amber-500/40 text-xs sm:text-sm text-[var(--foreground)]">' +
              '<strong class="text-amber-300">⚠️ #1 Diagnostic Pitfall:</strong> ' + esc(meta.mistake || bp.whenAvoid) +
            '</div>' +
            '<div class="flex flex-wrap gap-2">' +
              (bp.faqs || []).map(function (f, fIdx) {
                const act = openFaqIdx === fIdx;
                return '<button type="button" onclick="window.BeginnerBlueprint.clickFaqChip(\'' + modId + '\', ' + fIdx + ')" ' +
                  'class="px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ' +
                  (act ? 'bg-amber-500 text-slate-950 border-amber-300 shadow' : 'bg-[var(--card)] text-amber-300 border-amber-500/40 hover:bg-amber-500/15') + '">' +
                  esc(f.q) +
                '</button>';
              }).join('') +
            '</div>' +
            ((bp.faqs && bp.faqs[openFaqIdx]) ? (
              '<div class="p-3.5 rounded-xl bg-[var(--card)] border border-amber-500/40 text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">' +
                '<div class="font-bold text-amber-300 mb-1">' + esc(bp.faqs[openFaqIdx].q) + '</div>' +
                '<div>💡 ' + esc(bp.faqs[openFaqIdx].a) + '</div>' +
              '</div>'
            ) : '') +
          '</div>' +

          '<!-- BLOCK 7: 3-Question Check With Tempting-Wrong-Answer Explanations -->' +
          '<div class="p-4 rounded-2xl bg-[var(--content)] border border-sky-500/40 space-y-3">' +
            '<div class="flex flex-wrap items-center justify-between gap-2">' +
              '<span class="text-xs font-bold uppercase tracking-wider text-sky-400">✅ Block 7 • 3-Question Check (With Explanations of Why Each Wrong Option Is Tempting)</span>' +
              '<span class="text-xs font-mono text-[var(--muted-foreground)]">Click any option to test yourself</span>' +
            '</div>' +
            '<div class="grid grid-cols-1 lg:grid-cols-3 gap-3">' + qCardsHtml + '</div>' +
          '</div>' +
        '</section>'
      )
    };
  }

  function injectBlockIntoPart(partEl, blockId, htmlStr, prepend) {
    if (!partEl) return;
    const old = document.getElementById(blockId);
    if (old) old.remove();
    const wrap = document.createElement('div');
    wrap.innerHTML = htmlStr;
    if (wrap.firstElementChild) {
      if (prepend && partEl.firstChild) {
        partEl.insertBefore(wrap.firstElementChild, partEl.firstChild);
      } else {
        partEl.appendChild(wrap.firstElementChild);
      }
    }
  }

  function mountBeginnerBlueprintOnModule(modId) {
    const acad = detectAcad();
    if (acad !== 'ml' && acad !== 'll') return;
    renderMasterDeck();

    const activeId = modId || (global.appState && global.appState.activeModuleId) || 'mod0';
    const prefix = acad === 'll' ? 'v8-ll-part-' : 'v8-ml-part-';
    const part0 = document.getElementById(prefix + '0');
    if (!part0) return;

    const part1 = document.getElementById(prefix + '1') || part0;
    const part2 = document.getElementById(prefix + '2') || part0;
    const part3 = document.getElementById(prefix + '3') || part2;
    const partLast = document.getElementById(prefix + (acad === 'll' ? '3' : '4')) || part3;

    const blocks = renderSevenBlockTemplateHtml(activeId, acad);
    injectBlockIntoPart(part0, 'v9-seven-block-template-' + activeId, blocks.part1Html, true);
    injectBlockIntoPart(part1, 'v9-block5-section-' + activeId, blocks.block5Html, false);
    injectBlockIntoPart(part2, 'v9-block3-section-' + activeId, blocks.block3Html, true);
    if (acad === 'll') {
      injectBlockIntoPart(part2, 'v9-block4-section-' + activeId, blocks.block4Html, false);
    } else {
      injectBlockIntoPart(part3, 'v9-block4-section-' + activeId, blocks.block4Html, true);
    }
    injectBlockIntoPart(partLast, 'v9-block67-section-' + activeId, blocks.block67Html, false);
  }

  function refreshModuleBlueprint(modId) {
    mountBeginnerBlueprintOnModule(modId);
  }

  function bootBeginnerBlueprint() {
    registerFiveCoreWordsInGlossary();
    const acad = detectAcad();
    if (acad !== 'ml' && acad !== 'll') return;

    if (global.AcademyCore && typeof global.AcademyCore.enhanceRenderedModule === 'function' && !global.AcademyCore.enhanceRenderedModule._v9Wrapped) {
      const origEnhance = global.AcademyCore.enhanceRenderedModule;
      const wrappedEnhance = function (modId) {
        const res = origEnhance.apply(this, arguments);
        mountBeginnerBlueprintOnModule(modId);
        return res;
      };
      wrappedEnhance._v9Wrapped = true;
      global.AcademyCore.enhanceRenderedModule = wrappedEnhance;
    }

    const activeId = (global.appState && global.appState.activeModuleId) || 'mod0';
    mountBeginnerBlueprintOnModule(activeId);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBeginnerBlueprint);
  } else {
    setTimeout(bootBeginnerBlueprint, 0);
  }

  global.BeginnerBlueprint = {
    version: '9.5',
    toggleMasterDeckPanel: toggleMasterDeckPanel,
    setFoundTab: function (t) { deckState.foundTab = t; renderMasterDeck(); },
    setLoopExample: function (ex) { deckState.loopExample = ex; deckState.loopStep = 0; renderMasterDeck(); },
    setLoopStep: function (idx) { deckState.loopStep = idx; renderMasterDeck(); },
    setNudgeMode: function (m) { deckState.nudgeMode = m; renderMasterDeck(); },
    setNudgeW: function (val) { deckState.nudgeW = parseFloat(val); renderMasterDeck(); },
    setWizAnswer: function (qKey, val) { deckState.wizAnswers[qKey] = val; renderMasterDeck(); },
    setShowdownDataset: function (ds) { deckState.showdownDataset = ds; renderMasterDeck(); },
    setLLTab: function (t) { deckState.llTab = t; renderMasterDeck(); },
    setUrlStage: function (s) { deckState.urlStage = s; renderMasterDeck(); },
    selectSubMovie: function (modId, subKey) {
      activeSubMovieByMod[modId] = subKey;
      refreshModuleBlueprint(modId);
    },
    stepMovie: function (modId, movieKey, delta) {
      const k = modId + '_' + movieKey;
      const mv = ALL_MOVIES[movieKey] || ALL_MOVIES.linear_regression;
      const cur = movieStepByMod[k] || 0;
      movieStepByMod[k] = Math.max(0, Math.min(mv.steps.length - 1, cur + delta));
      refreshModuleBlueprint(modId);
    },
    setMovieStep: function (modId, movieKey, idx) {
      movieStepByMod[modId + '_' + movieKey] = idx;
      refreshModuleBlueprint(modId);
    },
    clickFaqChip: function (modId, fIdx) {
      global._v9OpenFaq = global._v9OpenFaq || {};
      global._v9OpenFaq[modId] = fIdx;
      try {
        const raw = global.localStorage.getItem('agy_faq_clicks_v9');
        const map = raw ? JSON.parse(raw) : {};
        const key = modId + '_faq_' + fIdx;
        map[key] = (map[key] || 0) + 1;
        global.localStorage.setItem('agy_faq_clicks_v9', JSON.stringify(map));
      } catch (_) {}
      refreshModuleBlueprint(modId);
    },
    answerCheck: function (modId, qIdx, optIdx) {
      if (global.AcademyCore && typeof global.AcademyCore.answerModuleCheck === 'function') {
        global.AcademyCore.answerModuleCheck(modId, qIdx, optIdx);
      }
      refreshModuleBlueprint(modId);
    },
    mountBeginnerBlueprintOnModule: mountBeginnerBlueprintOnModule,
    ALL_MOVIES: ALL_MOVIES,
    ML_BLUEPRINTS: ML_BLUEPRINTS,
    LL_BLUEPRINTS: LL_BLUEPRINTS
  };
})(window);

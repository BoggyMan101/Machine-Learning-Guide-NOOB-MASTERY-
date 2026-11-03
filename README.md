# 🚀 Interactive Machine Learning & LureLock Cybersecurity Academies

A comprehensive, interactive pair of web-based academies designed for zero-to-mastery education in **Machine Learning Engineering** and **Cybersecurity Phishing Threat Forensics**, equipped with **in-browser Pyodide WebAssembly Python 3.12 execution** that runs on **iOS Safari, Android, macOS, Linux, and Windows** without requiring any local backend server!

---

## 🌟 What's Included

### 1. 🧠 [Machine Learning Academy (`ml_interactive_academy.html`)](ml_interactive_academy.html)
- **18 In-Depth Curriculum Modules**: Covering first-principles linear algebra, Bayes MLE/MAP, information theory, cost functions, gradient descent variants, decision trees, ensembling (Random Forest, AdaBoost, GBDT, XGBoost), neural networks, and production pipelines.
- **20 Interactive Formula Dissectors & 8 Dedicated Live Calculators**: Click individual mathematical symbols to reveal their intuitive plain-English rules, real-number traces, and calculations (Curse of Dimensionality, CNN output size, XGBoost split gain, Gini impurity, Sigmoid log-loss, Matthews Correlation Coefficient, and more).
- **5 Interactive Simulators**:
  - Regression & Gradient Descent Trainer
  - 2D Classifier Arena with dynamic Voronoi decision boundaries and canvas drawing
  - Unsupervised K-Means & PCA Visualizer
  - GridWorld Reinforcement Learning Q-Learning Agent
  - Live Matplotlib Figure Studio
- **Bro Code Library Encyclopedia (16+ Libraries & 72 Categories)**: Every class and function has high-energy analogies, runnable code, live stdout terminal boxes, and copy buttons.
- **Progressive Multi-Library Synergies (Tiers 2, 3, and 4)**:
  - *Tier 2 Combos*: Pandas + NumPy, Pandas + Scikit-Learn, Scikit-Learn + XGBoost, Matplotlib + Seaborn, Imbalanced-Learn + Scikit-Learn.
  - *Tier 3 Trios*: Pandas + Scikit-Learn + Matplotlib, Pandas + Imbalanced-Learn + XGBoost.
  - *Tier 4 Full Production System*: Complete Customer Churn & Loan Risk ML Brain combining 6 libraries with live inference on unseen applicants!

---

### 2. 🛡️ [LureLock Phishing Academy (`lurelock_interactive_academy.html`)](lurelock_interactive_academy.html)
- **14 Threat Modules & Forensic Data Cleaning**: Shannon character entropy, sublinear TF-IDF n-grams, 300-tree XGBoost threat scoring, multi-CSV forensic deduplication, and schema detection.
- **4 Dedicated Security Simulators**:
  - **Live URL Forensic Scanner**: Real-time extraction of 18 lexical features (slashes, dots, entropy, @-tricks) and 11 explainable signals.
  - **XGBoost Decision Tree Explorer**: Interactive node-by-node branch visualizer with glowing active paths.
  - **6-Stage Automated Cleaning Funnel**: Real-time visual pipeline demonstrating RAM reduction and float noise removal across 225,000 raw URLs.
  - **Boosting Tug-of-War**: Live margin accumulation and logistic sigmoid S-curve squashing.
- **14 Security & Forensic ML Libraries**: Scikit-Learn, XGBoost, Pandas, NumPy, TLDExtract, Urllib, Levenshtein, DNSPython, Regex, BeautifulSoup, Requests, Cryptography, Imbalanced-Learn, Whois.
- **Multi-Library Threat Defense Pipelines**:
  - *Brand Typosquatting Buster*: TLDExtract + Levenshtein (catches `paypa1.com` vs `paypal.com` with edit distance ≤ 2).
  - *URL Canonicalization & De-obfuscation*: Urllib + Regex (unmasks RFC 3986 `@` trick and double percent-encoding).
  - *Full Working LureLock Production Engine*: Complete 8-library cybersecurity threat intelligence firewall with automated ALLOW / CHALLENGE / BLOCK enforcement!

---

## 📱 How It Runs on iOS Safari & GitHub Pages (No Backend Needed)

Both academies are powered by a **Hybrid Dual Execution Engine**:

1. **Client-Side WebAssembly (iOS / Android / GitHub Pages)**:
   - When opened on an iPhone, iPad, Android phone, or hosted as a static site on GitHub Pages, the application dynamically initializes **Pyodide** (Python 3.12 compiled to WebAssembly).
   - Pressing `▶ Run Code` or `▶ Run Pipeline` executes real Python directly inside the phone's browser, capturing `stdout` and streaming it into the styled retro terminal with **zero backend server required**!
2. **Local Native Backend (Desktop / Fast Mode)**:
   - If you run the local multi-academy server (`python ml_academy_server.py`), requests to `localhost:8765/run` execute native Python 3.14 instantly.
   - When offline or hosted remotely, it automatically and silently falls back to Pyodide WebAssembly!

---

## 🚀 How to Push to GitHub & Enable GitHub Pages in 2 Minutes

### Step 1: Open Terminal in this folder
```bash
git init
git add .
git commit -m "Deploy Complete Machine Learning & LureLock Academies with WebAssembly"
```

### Step 2: Create a GitHub Repository and Push
1. Go to [GitHub](https://github.com/new) and create a new repository (e.g., `interactive-ml-academy`).
2. Link and push your code:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/interactive-ml-academy.git
git push -u origin main
```

### Step 3: Enable GitHub Pages (1-Click)
1. On GitHub, navigate to **Settings** → **Pages** (under "Code and automation" on the left menu).
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
4. In about 30 seconds, GitHub will provide your live URL:
   `https://<YOUR-USERNAME>.github.io/interactive-ml-academy/`

**You can now open that link on your iPhone, iPad, Android, or laptop, share it with friends or recruiters, and test every single simulator and Python code runner live!**

---

## 💻 Local Offline Server (Optional)

If you wish to run with native local Python 3.14 on your PC:
```bash
python ml_academy_server.py
```
Then visit:
- Landing Portal: [http://localhost:8765/index.html](http://localhost:8765/index.html)
- Machine Learning Academy: [http://localhost:8765/ml_interactive_academy.html](http://localhost:8765/ml_interactive_academy.html)
- LureLock Phishing Academy: [http://localhost:8765/lurelock_interactive_academy.html](http://localhost:8765/lurelock_interactive_academy.html)


## 🌱 Updated Beginner-First Pedagogical Progression (No Math Ambush!)
Both `ml_interactive_academy.html` and `lurelock_interactive_academy.html` now enforce a strict **Intuition-First, Math-Later** layout across all curriculum modules:
1. **Stage ① — Everyday AI Applications & Plain-English Intuition:** Introduces real-world applications (Google Directions, Face Tagging, Google Translate, Self-Driving Cars, Agriculture, Finance, Medicine, and Zero-Day Phishing Defense) with zero formulas.
2. **Stage ② — Relatable Human Analogies & Visual Studios:** Explains Supervised Learning (teaching a child to walk), Unsupervised Learning (k-Means voter clustering), Reinforcement Learning (training a pet dog with rewards), and Deep Learning (brain-inspired layers + honest tradeoffs), paired with an interactive **Housing Price Best-Fit Line Extrapolation Studio** right inside Module 0.
3. **Stage ③ — Concrete Numerical Sample Tables & Hand-Worked Traces:** Every table cell contains concrete real-world numbers.
4. **Stage ④ — Gradual Token-by-Token Math Reveal:** Mathematical formulas are placed *after* the intuition, real-world tables, and visual walkthroughs, complete with 4-column Token Dissection Tables and Clean Math boxes.

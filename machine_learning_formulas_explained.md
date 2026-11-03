# Machine Learning Formulas Explained Piece-by-Piece (From Zero)

Machine learning formulas look intimidating only because nobody explains **how math glues letters together** (like why $w$ and $x$ are squished into $wx$, or why $+ b$ is tacked onto the end).

Before we look at any formula, here are the **5 Secret Rules of Math Notation**:

| What You See | The Hidden Rule | What It Actually Means in Plain English | Real-Number Example |
| :--- | :--- | :--- | :--- |
| **$wx$** *(two letters squished together)* | **Invisible Multiplication ($\times$)** | Whenever two letters touch with no symbol between them, it means **multiply them together** ($w \times x$). Why don't we write $w \times x$? Because the multiplication sign $\times$ looks identical to the letter $x$! | If $w = 150$ and $x = 10$, then:<br>$wx = 150 \times 10 = \mathbf{1,500}$ |
| **$wx + b$** *(squished pair plus a letter)* | **Multiply First, Add Second** | You **always** multiply $w$ and $x$ together *first* to get the chunk $wx$, and **then** add $b$ to that result. | If $w=150, x=10, b=500$:<br>1) First: $wx = 150 \times 10 = 1,500$<br>2) Second: $1,500 + 500 = \mathbf{2,000}$ |
| **$x_1, x_2, w_1, w_2$** *(tiny number at the bottom)* | **Subscript = Column Name Tag** | A tiny number at the bottom is **NOT math**—you never multiply by it. It is just a name tag telling you *which column* in your table it belongs to. | $x_1 =$ Column 1 (House Size)<br>$x_2 =$ Column 2 (Bedrooms)<br>$w_1 =$ Weight for Column 1 |
| **$x^{(1)}, x^{(2)}, x^{(i)}$** *(tiny number in parentheses at top)* | **Row Number in the Table** | A number in parentheses at the top tells you **which row (person/house)** we are looking at. *(Without parentheses, like $x^2$, it means squared: $x \times x$).* | $x^{(1)} =$ Row #1 (1st house)<br>$x^{(i)} =$ Whichever row $i$ our loop is on |
| **$\hat{y}$ vs. $y$ vs. $\bar{y}$** *(marks on top of $y$)* | **Hat = Guess<br>Bare = Real Truth<br>Bar = Average** | $y$ is always the target answer (e.g., Price):<br>• **$y$**: The **real truth**.<br>• **$\hat{y}$ ("y-hat")**: The **computer's guess**.<br>• **$\bar{y}$ ("y-bar")**: The **simple average** of all $y$'s. | Real price $y = \$300\text{k}$<br>Computer guess $\hat{y} = \$285\text{k}$<br>Average price $\bar{y} = \$250\text{k}$ |

---

| **$f_\theta(x)$ or $h_\theta(x)$** *(subscript Greek theta)* | **Function Parameterized by $\theta$** | In math, $f(x)$ is a fixed formula. In ML, the formula changes as the computer tunes its dials! The subscript $\theta$ tells you: *"This prediction function is configured by parameter dials $\theta$."* | $f_\theta(x) = \hat{y}$<br>$h_\theta(x)$ = "Hypothesis $h$ with dials $\theta$" |

---

## 0. The Rosetta Stone of ML: What is $w$, $w_1$, $\theta$, and $f_\theta(x)$?

Before diving into complex algorithms, here is the universal decoder ring connecting the two main dialects used in Machine Learning textbooks:

### 1. What is $w$ (The Weight)?
* **$w$ stands for "Weight" (or slope / multiplier).**
* **Plain English definition:** *"How much does $1$ unit of this feature swing the final answer?"*
* Think of it as a volume slider or importance knob:
  * If $w = +3$: Every $1$ unit increase in $x$ pushes the prediction **UP** by $3$. (e.g. Taxi fare: $\$3$ per mile).
  * If $w = -2$: Every $1$ unit increase in $x$ drags the prediction **DOWN** by $2$. (e.g. Car resale value: $-\$2,000$ per year of age).
  * If $w = 0$: $0 \times x = 0$. The feature has **zero influence**—the model ignores it completely!
  * **Magnitude $|w|$:** A weight of $100$ swings predictions $10,000\times$ harder than a weight of $0.01$.

### 2. What is $w_1$ (Subscripted Weight)?
* When your problem has only **one feature** (e.g. predicting taxi fare from just *miles*), we write a single $w$:
  $$\hat{y} = wx + b$$
* But real-world machine learning models ingest **many features at the same time** (like a spreadsheet with many columns):
  * Feature $x_1 =$ House square footage ($2,000\text{ sq ft}$)
  * Feature $x_2 =$ Number of bedrooms ($3\text{ beds}$)
  * Feature $x_3 =$ Distance to nearest school ($5\text{ miles}$)
* **The tiny number $1$ in $w_1$ is NOT math—it is an ID badge!**
  * **$w_1$ (Weight 1):** The rate for Column 1 alone (e.g., $+\$150$ per sq ft).
  * **$w_2$ (Weight 2):** The rate for Column 2 alone (e.g., $+\$20,000$ per bedroom).
  * **$w_3$ (Weight 3):** The rate for Column 3 alone (e.g., $-\$3,000$ per mile to school).
* When the computer predicts the house price, it calculates each column's contribution separately and sums them up:
  $$\hat{y} = \underbrace{w_1 x_1}_{+\$300\text{k}} + \underbrace{w_2 x_2}_{+\$60\text{k}} + \underbrace{w_3 x_3}_{-\$15\text{k}} + \underbrace{b}_{+\$50\text{k (base land)}} = \$395,000$$

### 3. What is $f_\theta(x)$ and $h_\theta(x)$?
* In high school algebra, $f(x) = 2x + 1$ is a static, unchanging formula.
* In Machine Learning, the computer starts with completely random, broken numbers (e.g., $w = -42.8, b = 999$). As it trains on data, it **adjusts its dials** until the line fits the data.
* The Greek letter **$\theta$ ("THAY-tuh")** represents **all the internal dials and knobs of the machine bundled together**.
* When written as a subscript:
  $$f_\theta(x)$$
  It literally reads:
  > **"The prediction function $f$, acting on input $x$, using the dial settings $\theta$."**
* Many university courses (Stanford CS229, Andrew Ng) use the letter $h$ instead of $f$:
  $$h_\theta(x)$$
  where $h$ stands for **Hypothesis** ("the model's current best theory about how the world works").
* **Key Takeaway:** $f_\theta(x)$, $h_\theta(x)$, and $\hat{y}$ are all $100\%$ identical in meaning:
  $$\mathbf{f_\theta(x) \equiv h_\theta(x) \equiv \hat{y} \quad \text{(The Computer's Guess)}}$$

### 4. The Rosetta Stone: The Two Dialects of Machine Learning
Why do some books write $\hat{y} = wx + b$ while others write $f_\theta(x) = \theta^T x$? They are the exact same thing in two different notations:

| Concept | Modern / Engineering Dialect (Deep Learning, PyTorch, Scikit-Learn) | Academic / Mathematical Dialect (Stanford, Andrew Ng, Econometrics) | Plain English Meaning |
| :--- | :--- | :--- | :--- |
| **The Starting Base** | **$b$ (Bias)** | **$\theta_0$ (Theta Zero)** | The meter fee before traveling any miles ($x=0$) |
| **Column 1 Weight** | **$w_1$ (Weight 1)** | **$\theta_1$ (Theta One)** | How much $1$ unit of Feature 1 is worth |
| **Column 2 Weight** | **$w_2$ (Weight 2)** | **$\theta_2$ (Theta Two)** | How much $1$ unit of Feature 2 is worth |
| **All Dials Bundled** | **$(w, b)$ or $[\mathbf{w}, b]$** | **$\theta = [\theta_0, \theta_1, \theta_2, \dots]^T$** | The complete list of learnable parameters |
| **Input Vector** | **$\mathbf{x} = [x_1, x_2, \dots]^T$** | **$\mathbf{x} = [x_0=1, x_1, x_2, \dots]^T$** | The features (with dummy $x_0=1$ for bias) |
| **Final Formula** | **$\hat{y} = \mathbf{w}^T \mathbf{x} + b$** | **$f_\theta(x) = \theta^T \mathbf{x} = \sum_{j=0}^n \theta_j x_j$** | **"Multiply each feature by its dial, and add the base fee!"** |

---

## 1. Linear Regression: $\hat{y} = wx + b$ (Broken Down Piece-by-Piece)

### The Formula:
$$\underbrace{\hat{y}}_{\text{Final Guess}} = \underbrace{\overbrace{w}^{\text{Rate}} \cdot \overbrace{x}^{\text{Amount}}}_{\text{The } wx \text{ Piece}} + \underbrace{b}_{\text{Starting Base}}$$

### Imagine an Uber / Taxi Fare Calculator:
Suppose a taxi charges a **$\$5$ base fee** just to get in the car, plus **$\$3$ per mile**, and you ride **$10\text{ miles}$**.

### What Every Single Piece Means:
1. **$x$ (The Input / Raw Amount):**
   * What it is: The measurement you feed into the computer.
   * Taxi example: **$x = 10\text{ miles}$** (or in a house model, $x = 2,000\text{ sq ft}$).
2. **$w$ (The Weight / Slope / Multiplier):**
   * What it is: **How much $1$ unit of $x$ is worth.** It controls how strongly $x$ pushes the prediction up or down.
   * Taxi example: **$w = \$3\text{ per mile}$** (or in a house model, $w = \$150\text{ per sq ft}$).
   * *What if $w$ is negative?* (e.g., $w = -\$2,000$ per year of house age): Then more $x$ **lowers** the price.
   * *What if $w = 0$?* Then $0 \times x = 0$, meaning the computer completely ignores feature $x$!
3. **$wx$ (The Multiplied Feature Contribution):**
   * What it is: When $w$ and $x$ are squished together as **$wx$**, it means **$w \times x$**. This combined piece tells you **how much money comes purely from feature $x$ alone** (before adding any base fee).
   * Taxi example: **$wx = \$3/\text{mile} \times 10\text{ miles} = \$30$** (the mileage charge by itself).
4. **$+ b$ (The Bias / Intercept / Starting Baseline):**
   * What it is: The starting value when $x = 0$.
   * Taxi example: **$b = \$5$** (even if you travel $x = 0\text{ miles}$, the meter starts at $\$5$). In a house model, $b$ is the value of the empty plot of land with a $0\text{ sq ft}$ house on it.
5. **$wx + b$ (The Complete Calculation):**
   * First multiply $w \times x$, then add $b$:
   * **$(3 \times 10) + 5 = 30 + 5 = \$35$**.
6. **$\hat{y}$ ("y-hat" — The Final Prediction):**
   * What it is: The final number that comes out of $wx + b$ (**$\hat{y} = \$35$**). The little hat $\hat{}$ reminds you: *"This is the model's prediction, not the real receipt $y$."*

### 📊 Visual Graph of Every Piece in $\hat{y} = wx + b$:
![Visual Graph of y-hat = wx + b](formula_graphs/fig00a_wx_plus_b_visual.png)

* **How to read Graph A (Left):**
  * Look at **$x = 10\text{ miles}$** on the bottom axis.
  * The **green bar at the bottom (`+b = $5`)** is the starting base fee (even at $x = 0\text{ miles}$, the blue line starts at height $5$).
  * The **purple triangle (`w = +$3 per 1 mile`)** is the **slope/tilt** of the line: every $1\text{ mile}$ you move right, the line climbs up by $\$3$.
  * The **red vertical arrow (`wx = +$30`)** is the total height added by multiplying $w \times x = 3 \times 10 = 30$.
  * Stacked together ($wx + b = 30 + 5$), you land on the **top red dot (`y-hat = $35`)**!
* **How to read Graph B (Right):**
  * **Knob $b$ is the Elevator:** Changing $b$ from $5$ to $18$ slides the whole line straight UP without changing its tilt.
  * **Knob $w$ is the Steering Wheel / Tilt:** $w > 0$ tilts the line uphill (blue), $w = 0$ makes the line completely flat so $x$ is ignored (orange), and $w < 0$ tilts the line downhill (red).

---

## 2. Multiple Linear Regression: $\hat{y} = w_1 x_1 + w_2 x_2 + w_3 x_3 + b$ (and $\mathbf{w}^\top \mathbf{x} + b$)

What if you have **multiple clues**—like Square Feet ($x_1$), Bedrooms ($x_2$), and Age of House ($x_3$)?

### The Formula:
$$\hat{y} = \underbrace{w_1 x_1}_{\text{Size Chunk}} + \underbrace{w_2 x_2}_{\text{Bedroom Chunk}} + \underbrace{w_3 x_3}_{\text{Age Chunk}} + \underbrace{b}_{\text{Base Land}} \quad\equiv\quad \mathbf{w}^\top \mathbf{x} + b$$

### What Each Piece Means (With Plug-in Numbers):
Suppose a house has **$x_1 = 2,000\text{ sq ft}$**, **$x_2 = 3\text{ bedrooms}$**, and **$x_3 = 10\text{ years old}$**:
* **$w_1 x_1$ (Piece 1 — Size contribution):** Each sq ft adds $w_1 = \$150 \rightarrow 150 \times 2,000 = \mathbf{+\$300,000}$.
* **$w_2 x_2$ (Piece 2 — Bedroom contribution):** Each bedroom adds $w_2 = \$20,000 \rightarrow 20,000 \times 3 = \mathbf{+\$60,000}$.
* **$w_3 x_3$ (Piece 3 — Age contribution):** Each year of age subtracts $w_3 = -\$2,000 \rightarrow -2,000 \times 10 = \mathbf{-\$20,000}$.
* **$+ b$ (Piece 4 — Starting land value):** Empty lot starts at **$b = +\$50,000$**.
* **$\hat{y}$ (Total Prediction):** $\$300,000 + \$60,000 - \$20,000 + \$50,000 = \mathbf{\$390,000}$.
* **What does $\mathbf{w}^\top \mathbf{x}$ (or $Xw$) mean?** Instead of writing $w_1 x_1 + w_2 x_2 + \dots + w_{100} x_{100}$ across the whole page, mathematicians bundle all weights into a list $\mathbf{w}$ and all inputs into a list $\mathbf{x}$. Writing **$\mathbf{w}^\top \mathbf{x}$** (the **Dot Product**) is just a short zip-file that means: *"Multiply matching pairs ($w_1 x_1, w_2 x_2, \dots$) and add them all up!"*

---

## 3. Mean Squared Error (MSE): Measuring How Bad the Mistakes Were

Always read multi-step formulas **from the inside of the parentheses outward**!

### The Formula:
$$\text{MSE} = \underbrace{\frac{1}{m}}_{\text{Step 4: Average}} \;\; \underbrace{\sum_{i=1}^{m}}_{\text{Step 3: Add all rows}} \;\; \Big( \underbrace{\hat{y}^{(i)} - y^{(i)}}_{\text{Step 1: Raw Mistake}} \Big)^{\!\overbrace{2}^{\text{Step 2: Square it}}}$$

### Piece-by-Piece From Inside Out:
1. **$\hat{y}^{(i)} - y^{(i)}$ (Step 1 — The Raw Mistake on Row $i$):**
   * Take the computer's guess $\hat{y}^{(i)}$ (say, $\$280\text{k}$) and subtract the real price $y^{(i)}$ ($\$300\text{k}$).
   * Result: $280 - 300 = \mathbf{-20}$ (we guessed $20$ too low).
2. **$(\hat{y}^{(i)} - y^{(i)})^2$ (Step 2 — The Squared Mistake):**
   * Multiply that mistake by itself: $(-20) \times (-20) = \mathbf{+400}$.
   * *Why square it?* First, negative times negative becomes **positive** (so a $-20$ mistake and a $+20$ mistake don't cancel out to $0$!). Second, it punishes giant blunders extra hard ($10^2 = 100$, vs $2^2 = 4$).
3. **$\sum_{i=1}^{m}$ (Step 3 — The Giant Sigma = "Sum / Add Them All Up"):**
   * Loop from house $i = 1$ to the last house $m$, and add every house's squared mistake into one total pile.
4. **$\frac{1}{m}$ (Step 4 — Divide by $m$ to Get the Average):**
   * Multiplying by $\frac{1}{m}$ is the exact same as **dividing by $m$** (the total number of houses). This gives the **average** squared error per house.

### 📊 Visual Graph of MSE (Why Squared?) & $R^2$ Score:
![Visual Graph of MSE and R2](formula_graphs/fig00b_mse_and_r2_visual.png)

* **How to read Graph A (Left — Why MSE Squares the Error):**
  * Each black dot is the **real truth $y$**, and each white circle on the blue line is the **model's guess $\hat{y}$**.
  * The vertical red line is the raw mistake $(\hat{y} - y)$.
  * When the formula squares it—$(\hat{y} - y)^2$—it literally draws a **geometric red square box** with side length $|\hat{y} - y|$! Because the area of a square box is always positive ($-2 \times -2 = +4$), negative and positive errors never cancel each other out.
* **How to read Graph B (Right — $R^2$ Score):**
  * $R^2 = 1 - \frac{\sum (y - \hat{y})^2}{\sum (y - \bar{y})^2}$ compares your green model's **tiny red error bars** (top of fraction) against a lazy person who just guesses the flat average line $\bar{y}$'s **huge gray dashed error bars** (bottom of fraction).

---

## 4. Gradient Descent: How the Computer Updates $w$ and $b$

### The Formula:
$$\underbrace{w_{\text{new}}}_{\text{Updated weight}} = \underbrace{w_{\text{old}}}_{\text{Current weight}} - \underbrace{\overbrace{\alpha}^{\text{Step size}} \cdot \overbrace{\frac{\partial J}{\partial w}}^{\text{Slope of Error}}}_{\text{The Nudge Chunk}}$$

And for Linear Regression, the **Slope of Error** piece is:
$$\frac{\partial J}{\partial w} = \frac{2}{m} \sum_{i=1}^{m} \underbrace{(\hat{y}^{(i)} - y^{(i)})}_{\text{Mistake}} \cdot \underbrace{x^{(i)}}_{\text{Input}}$$

### What Each Piece Means:
* **$w_{\text{old}}$**: What the weight knob is currently set to.
* **$\frac{\partial J}{\partial w}$ (The Gradient / Slope):** Tells you whether increasing $w$ makes the error $J$ go uphill ($+$) or downhill ($-$). Notice inside it we multiply the **Mistake $(\hat{y} - y)$** by the **Input $x$**—because if $x$ was huge on that row, weight $w$ caused a huge part of the mistake!
* **$\alpha$ (Alpha — The Learning Rate):** A small step-size number (like $0.01$) so we don't over-correct wildly.
* **$\alpha \cdot \frac{\partial J}{\partial w}$ (The Combined Nudge Chunk):** Multiply the step size $\alpha$ by the slope to get the exact amount we will adjust $w$ by.
* **$-$ (The Minus Sign):** Slope points *uphill* (toward more error). We subtract so we walk **downhill** (toward zero error)!

---

## 5. Regularization (Ridge $L_2$ & Lasso $L_1$): The Anti-Cheating Penalty

### The Formulas:
$$\text{Ridge Loss} = \underbrace{\text{MSE}}_{\text{Mistake Score}} + \underbrace{\lambda \sum_{j=1}^{n} w_j^2}_{\text{The } L_2 \text{ Fine}} \qquad\qquad \text{Lasso Loss} = \underbrace{\text{MSE}}_{\text{Mistake Score}} + \underbrace{\lambda \sum_{j=1}^{n} |w_j|}_{\text{The } L_1 \text{ Fine}}$$

### What Each Piece Means:
* **$\text{MSE}$**: The normal prediction error score.
* **$w_j^2$ vs. $|w_j|$**: The size of weight $j$ (either squared $w_j^2$, or absolute value $|w_j|$ which just drops any minus sign).
* **$\sum_{j=1}^{n}$**: Adds up the sizes of all $n$ weights in the model.
* **$\lambda$ (Lambda — The Strictness Tax Rate):** Controls how harshly we fine the model for having huge weights.
* **$\lambda \sum w_j^2$ (The Combined Penalty Chunk):** The extra tax added to the scoreboard. To keep its total score low, the model is forced to keep weights $w_j$ small and simple (**Ridge** shrinks them near zero; **Lasso** snaps useless weights to exact **`0.0`**).

### 📊 Visual Graph of Gradient Descent & Regularization:
![Visual Graph of Gradient Descent and Regularization](formula_graphs/fig00c_gradient_descent_and_regularization_visual.png)

* **How to read Graph A (Left — Gradient Descent):**
  * The blue U-shaped curve is the **Error Bowl $J(w)$**. The bottom of the bowl (green star at $w^* = 2.0$) is where error is lowest.
  * Starting at the red dot ($w_{\text{old}} = 4.8$), the **slope $\frac{\partial J}{\partial w} = +5.6$** points **uphill** to the right.
  * The **minus sign ($-$)** flips our direction **downhill** to the left, and **$\alpha = 0.2$** scales the step so we hop cleanly down the green arrows to the bottom of the bowl!
* **How to read Graph B (Right — Regularization Penalty $\lambda \sum w^2$):**
  * Without the penalty ($\lambda = 0$, red dashed curve), the computer uses gigantic weights ($w = +9,500$) to twist and wiggle through every noisy dot (Overfitting).
  * With the $+\lambda \sum w^2$ fine (green solid curve), big weights are too expensive, forcing the curve to stay smooth and calm!

---

## 6. Logistic Regression: Sigmoid ($\sigma$) & Binary Log-Loss

### A. The Sigmoid Formula (Squishing $wx+b$ into $0\%$ to $100\%$):
$$\hat{p} = \sigma(z) = \frac{1}{1 + e^{-(wx+b)}}$$

* **$z = wx + b$**: First calculate the normal straight-line score $wx + b$.
* **$-(wx + b)$**: Flip its sign (so $+10$ becomes $-10$).
* **$e^{-(wx+b)}$**: Raise Euler's number ($e \approx 2.718$) to that power.
  * When $wx+b$ is a big positive number ($+10$), $e^{-10} \approx 0.000045$ (almost $0$).
  * When $wx+b$ is a big negative number ($-10$), $e^{+10} \approx 22,026$ (huge!).
* **$\frac{1}{1 + e^{-z}}$**: Divide $1$ by $(1 + \text{that number})$.
  * For $+10$: $\frac{1}{1 + 0.000045} = \mathbf{0.99995}$ ($99.995\%$ Yes!).
  * For $0$: $\frac{1}{1 + 1} = \mathbf{0.50}$ ($50\%$ tie!).
  * For $-10$: $\frac{1}{1 + 22026} = \mathbf{0.000045}$ ($0.0045\%$ Yes!).

### B. The Binary Cross-Entropy (Log-Loss) Formula:
$$\text{Loss} = -\Big[\; \underbrace{y \cdot \ln(\hat{p})}_{\text{Switch 1 (if } y=1\text{)}} \;+\; \underbrace{(1 - y) \cdot \ln(1 - \hat{p})}_{\text{Switch 2 (if } y=0\text{)}} \;\Big]$$

* Why are there two pieces added together? Because **$y$ and $(1-y)$ act as On/Off switches**!
  * **When the true answer is $y = 1$:** Switch 1 is $1 \cdot \ln(\hat{p})$ (**ON**), and Switch 2 is $(1-1)\cdot\ln(1-\hat{p}) = 0$ (**OFF**).
  * **When the true answer is $y = 0$:** Switch 1 is $0 \cdot \ln(\hat{p}) = 0$ (**OFF**), and Switch 2 is $(1-0)\cdot\ln(1-\hat{p})$ (**ON**).
* **Why the minus sign $-$ in front?** Because the natural log ($\ln$) of any probability between $0$ and $1$ is a *negative* number (e.g., $\ln(0.5) = -0.693$). Putting a $-$ in front flips it into a $+0.693$ penalty!

---

## 7. Decision Trees, Distances, Scaling & Attention (Piece-by-Piece)

| Formula | Piece-by-Piece Breakdown |
| :--- | :--- |
| **Gini Impurity**<br>$\text{Gini} = 1 - \sum p_c^2$ | • **$p_c$**: Fraction of items in the box belonging to class $c$ (e.g., $50\% = 0.5$).<br>• **$p_c^2$**: Square each class fraction.<br>• **$\sum p_c^2$**: Add them up (equals $1.0$ if the box is $100\%$ pure).<br>• **$1 - \sum p_c^2$**: Subtract from $1$ so a pure box scores **$0.0$** (zero messiness) and a $50/50$ mixed box scores $1 - (0.25+0.25) = \mathbf{0.50}$. |
| **Euclidean Distance**<br>$d = \sqrt{(x_1 - z_1)^2 + (x_2 - z_2)^2}$ | • **$(x_1 - z_1)$**: Difference between Point $x$ and Point $z$ on Feature 1.<br>• **$^2$**: Square each difference so negatives become positive.<br>• **$+$**: Add the squared differences across all features.<br>• **$\sqrt{\dots}$**: Take the square root to get the straight-line ruler distance. |
| **StandardScaler (Z-Score)**<br>$z = \frac{x - \mu}{\sigma}$ | • **$x$**: Original number (e.g., $\$90\text{k}$ salary).<br>• **$\mu$ ("Mu")**: Column average (e.g., $\$60\text{k}$).<br>• **$x - \mu$ (Top)**: How far above/below average ($90 - 60 = +30\text{k}$).<br>• **$\div \sigma$ ("Sigma", Bottom)**: Divide by Standard Deviation ($\$15\text{k}$) $\rightarrow \frac{30}{15} = \mathbf{+2.0}$. |
| **Transformer Self-Attention**<br>$\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$ | • **$QK^\top$**: Multiply Queries ($Q$) by Keys ($K^\top$) to score how much each word relates to every other word.<br>• **$\div \sqrt{d_k}$**: Divide by square root of vector size so numbers don't get too huge.<br>• **$\text{softmax}(\dots)$**: Turn scores into percentages that add up to $100\%$.<br>• **$\cdot V$**: Multiply those percentages by the word Value vectors ($V$). |

### 📊 Visual Graph of Sigmoid $\sigma(z)$ & Euclidean Distance:
![Visual Graph of Sigmoid and Euclidean Distance](formula_graphs/fig00d_sigmoid_logloss_gini_distance_visual.png)

* **How to read Graph A (Left — Sigmoid S-Curve):**
  * The bottom axis is your raw straight-line score $z = wx + b$ (from $-10$ to $+10$).
  * The blue S-curve $\hat{p} = \frac{1}{1 + e^{-z}}$ squishes large negative numbers near $0\%$, hits exactly $50\%$ at $z = 0$ (because $e^0 = 1 \rightarrow \frac{1}{1+1} = 0.5$), and squishes large positive numbers near $100\%$.
* **How to read Graph B (Right — Euclidean Distance):**
  * The formula $d = \sqrt{(x_1 - z_1)^2 + (x_2 - z_2)^2}$ is just a **Right Triangle**!
  * Piece 1 $(x_1 - z_1)^2 = 3^2 = 9$ is the horizontal blue dashed leg squared; Piece 2 $(x_2 - z_2)^2 = 4^2 = 16$ is the vertical green dashed leg squared; and the square root $\sqrt{9 + 16} = \sqrt{25} = 5.0$ is the red diagonal ruler distance!


# The Complete Python Machine Learning & Data Science Library Encyclopedia

![The 6-Layer Python ML Ecosystem](formula_graphs/fig23_ml_library_ecosystem_architecture.png)

This guide explains the **full capabilities**, **internal C/C++/CUDA/Rust mechanics**, **every sub-module**, and **every core class and function** across the entire 6-layer Python Machine Learning ecosystem.

---

## Layer 1: Mathematical, Array, Sparse Matrix & Scientific Computing Foundation (`numpy`, `scipy`)

### 1. `NumPy` (`import numpy as np`) — N-Dimensional Contiguous Array & Linear Algebra Engine
* **Full Capabilities & Internal Architecture:**
  * **Contiguous C Memory (`ndarray`):** Stores homogeneous numeric data (`float64`, `float32`, `int64`, `bool_`) in a single contiguous block of RAM paired with a `shape` tuple and a `strides` tuple (byte steps along each dimension). Because of `strides`, slicing (`X[:100, :]`) and transposing (`X.T`) execute in **$\mathcal{O}(1)$ zero-copy time**.
  * **SIMD & BLAS/LAPACK Vectorization:** Array math (`X @ w + b`) bypasses Python loops completely and runs in multi-threaded C/Fortran OpenBLAS/MKL SIMD registers.
  * **The 3 Rules of Broadcasting:** (1) Prepend `1`s to the shape of the lower-rank array; (2) Axes are compatible if equal or if one is `1`; (3) Size-`1` axes stretch virtually with stride `0` (zero extra RAM).

#### Complete `NumPy` Function Reference by Sub-Category:
1. **Array Creation & Grids:**
   * `np.array(obj, dtype=None, copy=True)`, `np.asarray(a, dtype=None)` (zero-copy if already ndarray).
   * `np.zeros(shape)`, `np.zeros_like(a)`, `np.ones(shape)`, `np.ones_like(a)`, `np.full(shape, fill_value)`, `np.empty(shape)`.
   * `np.eye(N, M=None, k=0)`, `np.identity(n)`, `np.diag(v, k=0)` (extracts diagonal vector from 2D matrix OR builds 2D diagonal matrix from 1D vector).
   * `np.arange(start, stop, step)`, `np.linspace(start, stop, num=50)`, `np.logspace(start, stop, num=50, base=10.0)` (ideal for $\lambda$ grids!), `np.geomspace(start, stop, num)`.
   * `np.meshgrid(*xi, indexing='xy')` (2D coordinate grids for contour/decision boundary plots), `np.triu(m, k=0)`, `np.tril(m, k=0)` (causal attention masks).
2. **Shape, Axis, Stacking & Splitting:**
   * `a.reshape(newshape)` (pass `-1` to auto-infer dimension, e.g., `x.reshape(-1, 1)`), `a.ravel()` (zero-copy 1D view), `a.flatten()` (1D copy).
   * `a.T`, `np.transpose(a, axes)`, `np.swapaxes(a, axis1, axis2)`, `np.moveaxis(a, src, dst)`, `np.squeeze(a, axis)`, `np.expand_dims(a, axis)` / `a[:, np.newaxis]`.
   * `np.concatenate(arrays, axis=0)`, `np.vstack(tup)`, `np.hstack(tup)`, `np.column_stack(tup)`, `np.stack(arrays, axis=0)`, `np.c_[A, B]`, `np.r_[A, B]`.
   * `np.split(ary, indices_or_sections, axis=0)`, `np.array_split(ary, K, axis=0)` (splits unevenly divisible arrays cleanly for $K$-Fold CV!), `np.tile(A, reps)`, `np.repeat(a, repeats, axis)`.
3. **Indexing, Searching, Masking & NaN Handling:**
   * `np.where(cond, x, y)` (vectorized ternary if-else; `np.where(cond)` alone returns indices where True), `np.select(condlist, choicelist, default=0)`.
   * `np.clip(a, a_min, a_max)`, `np.nonzero(a)`, `np.flatnonzero(a)`, `np.argwhere(a)`, `np.searchsorted(a, v)` ($\mathcal{O}(\log m)$ binary search into sorted bins).
   * `np.take(a, indices, axis)`, `np.take_along_axis(arr, indices, axis)`, `np.put_along_axis`.
   * `np.isnan(x)`, `np.isinf(x)`, `np.isfinite(x)`, `np.nan_to_num(x, nan=0.0, posinf=None, neginf=None)`.
   * `np.all(a, axis)`, `np.any(a, axis)`, `np.isclose(a, b)`, `np.allclose(a, b, rtol=1e-5, atol=1e-8)`.
4. **Element-Wise Math (`ufuncs`), Reductions, Statistics, Sorting & Sets:**
   * Math: `np.exp`, `np.expm1` ($e^x - 1$), `np.log`, `np.log2`, `np.log10`, `np.log1p` ($\ln(1+x)$, safe for $x=0$ and right-skewed targets!), `np.logaddexp`, `np.sqrt`, `np.cbrt`, `np.square`, `np.abs`, `np.sign`, `np.floor`, `np.ceil`, `np.round`, `np.sin`, `np.cos`, `np.tanh`, `np.maximum(x1, x2)` (element-wise max, e.g., ReLU `np.maximum(0, z)`), `np.minimum(x1, x2)`.
   * Reductions & Stats (all accept `axis=0` down rows, `axis=1` across columns, `keepdims=True`, and have `np.nan*` counterparts): `np.sum`, `np.prod`, `np.cumsum`, `np.cumprod`, `np.diff`, `np.gradient`, `np.mean`, `np.average(a, weights=w)`, `np.std(a, ddof=0)`, `np.var(a, ddof=0)`, `np.median`, `np.percentile(a, q)`, `np.quantile(a, q)`, `np.min`, `np.max`, `np.argmin`, `np.argmax`.
   * Sorting & Sets: `np.sort`, `np.argsort`, `np.lexsort`, `np.partition(a, kth)`, `np.argpartition(a, kth)` ($\mathcal{O}(m)$ linear-time top-$K$ selection for KNN!), `np.unique(ar, return_counts=True, return_index=True, return_inverse=True)`, `np.bincount(x, weights=None)` (fast $\mathcal{O}(m)$ integer histogram for class voting), `np.isin`, `np.intersect1d`, `np.union1d`, `np.setdiff1d`, `np.histogram`, `np.digitize`, `np.cov(X, rowvar=False)`, `np.corrcoef(X, rowvar=False)`.
5. **Linear Algebra (`numpy.linalg`):**
   * Products: `np.dot(a, b)`, `a @ b` (`np.matmul`), `np.inner`, `np.outer`, `np.tensordot`, `np.kron`, `np.einsum('ij,jk->ik', A, B)` (Einstein summation for arbitrary tensor contractions!).
   * Solvers & Decompositions: `np.linalg.solve(A, b)` (solves $Aw=b$ via LU without inverting $A$!), `np.linalg.lstsq(X, y)` (SVD least squares), `np.linalg.inv(A)`, `np.linalg.pinv(A)` (Moore-Penrose pseudoinverse), `np.linalg.svd(X, full_matrices=False)`, `np.linalg.eigh(Sigma)` (symmetric real eigendecomposition for PCA), `np.linalg.eig(A)`, `np.linalg.cholesky(A)`, `np.linalg.qr(A)`, `np.linalg.norm(x, ord=2, axis=1)`, `np.linalg.det(A)`, `np.linalg.slogdet(A)` ($\ln|\det A|$ without overflow), `np.linalg.matrix_rank(A)`, `np.trace(A)`.
6. **Random Sampling (`numpy.random`) & FFT / Disk I/O:**
   * `rng = np.random.default_rng(seed=42)` $\rightarrow$ `rng.random`, `rng.uniform`, `rng.normal`, `rng.standard_normal`, `rng.multivariate_normal`, `rng.integers`, `rng.choice(a, size, replace=True, p=probs)`, `rng.permutation`, `rng.shuffle`, `rng.binomial`, `rng.poisson`, `rng.beta`, `rng.dirichlet`, `rng.exponential`.
   * FFT & I/O: `np.fft.rfft`, `np.fft.fftfreq`, `np.save('f.npy', a)`, `np.load('f.npy')`, `np.savez_compressed('f.npz', X=X, y=y)`, `np.memmap` (out-of-core disk array mapping).

---

### 2. `SciPy` (`import scipy`) — Sparse Matrices, Statistical Tests, Special Functions & Optimizers
* **`scipy.sparse` (Sparse Matrices for NLP, One-Hot Encoding & Graphs):**
  * `csr_matrix` (Compressed Sparse Row — fast row slicing & matrix-vector dot products), `csc_matrix` (Compressed Sparse Column — fast column slicing), `coo_matrix` (Coordinate format for fast construction), `lil_matrix`, `dia_matrix`.
  * `sparse.hstack([A, B], format='csr')`, `sparse.vstack`, `sparse.eye`, `sparse.diags`, `sparse.save_npz`, `sparse.load_npz`.
  * `sparse.linalg`: `spsolve`, `cg` (Conjugate Gradient), `lsqr`, `svds` (Truncated SVD), `eigsh`.
  * `sparse.csgraph`: `connected_components`, `shortest_path`, `laplacian`, `minimum_spanning_tree`.
* **`scipy.special` (Overflow-Proof ML Math):**
  * `expit(z)` (exact Sigmoid $\sigma(z)$), `logit(p)` ($\ln\frac{p}{1-p}$), `softmax(z, axis=-1)`, `log_softmax(z, axis=-1)`, `logsumexp(a, axis=-1, keepdims=True)` (computes $\ln\sum e^{a_c}$ safely without overflow!), `erf`, `gamma`, `gammaln`, `digamma`, `beta`, `comb`.
* **`scipy.stats` (Distributions, Hypothesis Tests & Drift Detection):**
  * Distributions (`norm`, `uniform`, `loguniform`, `randint`, `expon`, `beta`, `gamma`, `t`, `chi2`, `poisson`, `binom`, `multivariate_normal`): `.pdf(x)`, `.logpdf(x)`, `.cdf(x)`, `.sf(x)` ($p$-value tail), `.ppf(q)` (inverse CDF quantile), `.rvs(size, random_state)`, `.fit(data)`.
  * Hypothesis & Drift Tests: `ttest_1samp`, `ttest_ind`, `ttest_rel`, `mannwhitneyu`, `wilcoxon`, `f_oneway` (ANOVA), `kruskal`, `chi2_contingency`, `fisher_exact`, `ks_2samp` (Kolmogorov-Smirnov 2-sample test for production **Feature Drift**!), `wasserstein_distance` (Earth Mover's Distance), `shapiro`, `normaltest`, `pearsonr`, `spearmanr`, `kendalltau`, `pointbiserialr`.
  * Transforms: `boxcox`, `yeojohnson`, `zscore`, `iqr`, `skew`, `kurtosis`, `entropy(pk, qk)` (Shannon Entropy & KL Divergence!), `gaussian_kde`, `bootstrap`, `permutation_test`.
* **`scipy.optimize` & `scipy.spatial`:**
  * `minimize(fun, x0, method='L-BFGS-B'|'BFGS'|'SLSQP'|'Nelder-Mead', jac, hess, bounds, constraints)`, `least_squares`, `nnls` (non-negative least squares), `lsq_linear`, `curve_fit`, `linprog`, `milp`, `linear_sum_assignment` (Hungarian bipartite matching), `differential_evolution`, `root`, `brentq`.
  * `spatial.distance.cdist(XA, XB, metric='euclidean'|'cityblock'|'cosine'|'mahalanobis')`, `pdist`, `squareform`, `cKDTree` (`.query(x, k)`, `.query_ball_point(x, r)`), `ConvexHull`, `Voronoi`, `Delaunay`.
  * `cluster.hierarchy`: `linkage(X, method='ward')`, `dendrogram`, `fcluster`.

---

## Layer 2: Tabular Data Manipulation & Relational Analytics (`pandas`, `polars`)

### 3. `Pandas` (`import pandas as pd`) & `Polars` (`import polars as pl`)
* **I/O Readers & Writers:** `pd.read_csv(path, usecols, dtype, parse_dates, chunksize)`, `df.to_csv(index=False)`, `pd.read_parquet` / `df.to_parquet` (10x faster columnar storage), `pd.read_excel`, `pd.read_json`, `pd.json_normalize` (flattens nested JSONs), `pd.read_sql`, `pd.read_feather`.
* **Inspection & Profiling:** `df.head()`, `df.tail()`, `df.sample(n, frac, random_state)`, `df.info(memory_usage='deep')`, `df.describe(include='all')`, `df.shape`, `df.dtypes`, `df.select_dtypes(include='number', exclude='object')`, `df.nunique()`, `s.value_counts(normalize=True, dropna=False)`, `df.nlargest(n, col)`, `df.nsmallest(n, col)`, `df.corr()`, `df.cov()`.
* **Indexing & Filtering:** `df.loc[row_labels_or_mask, col_names]` (label-based, inclusive slicing), `df.iloc[row_ints, col_ints]` (0-based integer positions), `df.at[r, c]`, `df.iat[i, j]`, `df.query("age > 21 and city == 'NY'")`, `df.filter(like=, regex=)`, `s.isin([...])`, `s.between(a, b)`, `df.where(cond, other)`, `df.mask(cond, other)`, `df.set_index()`, `df.reset_index(drop=True)`, `df.sort_values(by, ascending)`.
* **Cleaning, Missing Values & Casting:** `df.isna()`, `df.notna()`, `df.dropna(subset=[...], thresh=...)`, `df.fillna(val)`, `df.ffill()` (forward-fill), `df.bfill()`, `df.interpolate(method='linear')`, `df.duplicated()`, `df.drop_duplicates(subset, keep='first')`, `df.replace()`, `df.astype()`, `pd.to_numeric(s, errors='coerce')`, `pd.to_datetime(s, errors='coerce', utc=True)`, `df.clip(lower, upper)`, `df.rename(columns={...})`, `df.drop(columns=[...])`.
* **Feature Engineering & Vectorized `.str` / `.dt` Engines:**
  * `df.assign(new_col=lambda d: ...)`, `s.map(dict_or_fn)`, `df.apply(fn, axis=0)`, `df.pipe(fn)`, `pd.cut(x, bins)` (equal-width bins), `pd.qcut(x, q=4)` (quantile bins), `pd.get_dummies(df, drop_first=True, dtype=int)`, `pd.factorize(s)`.
  * String accessor (`s.str.*`): `.lower()`, `.upper()`, `.strip()`, `.len()`, `.split(pat, expand=True)`, `.replace(pat, repl, regex=True)`, `.contains(pat, case=False, na=False)`, `.extract(r'(\d+)')`, `.slice(0, 3)`, `.startswith()`, `.endswith()`.
  * Datetime accessor (`s.dt.*`): `.year`, `.quarter`, `.month`, `.day`, `.dayofweek`, `.dayofyear`, `.hour`, `.minute`, `.is_month_end`, `.floor('D')`, `.total_seconds()`.
* **GroupBy Split-Apply-Combine, Pivoting, Joins & Windows:**
  * `df.groupby(keys).agg(new_name=('col', 'mean'))` (collapses to 1 row per group) vs. `df.groupby(keys)['col'].transform('mean')` (broadcasts group statistic back to original row length $m$!).
  * `pd.pivot_table(df, values, index, columns, aggfunc='mean', fill_value=0)`, `pd.crosstab(s1, s2, normalize='index')`, `df.pivot`, `df.melt`, `df.stack`, `df.unstack`, `df.explode('list_col')`.
  * `pd.concat([df1, df2], axis=0, ignore_index=True)`, `pd.merge(left, right, how='left'|'inner'|'outer', on='id', validate='many_to_one')`, **`pd.merge_asof(left, right, on='ts', by='id', direction='backward')`** (leak-free point-in-time join!).
  * `df.rolling(window=7, min_periods=1).mean()`, `df.expanding().mean()`, `df.ewm(span=7).mean()`, `df.shift(1)`, `df.diff(1)`, `df.pct_change(1)`, `df.resample('D').sum()`.
* **`Polars` (`import polars as pl`):** Multi-threaded Rust & Arrow engine with lazy query optimization: `pl.scan_parquet('f.parquet').filter(pl.col('x') > 0).with_columns((pl.col('y') - pl.col('y').mean().over('group')).alias('y_diff')).collect()`.

---

## Layer 3: Visualization & Exploratory Data Analysis (`matplotlib`, `seaborn`, `plotly`)

### 4. `Matplotlib` (`import matplotlib.pyplot as plt`), `Seaborn` (`import seaborn as sns`) & `Plotly` (`import plotly.express as px`)
* **`matplotlib.pyplot` (Object-Oriented Figure/Axes Engine):**
  * Setup & Export: `fig, ax = plt.subplots(nrows, ncols, figsize=(w, h), dpi=150)`, `plt.tight_layout()`, `fig.savefig('fig.png', dpi=300, bbox_inches='tight')`, `plt.close(fig)`.
  * 2D Plots on `ax`: `ax.plot`, `ax.step`, `ax.scatter`, `ax.errorbar`, `ax.fill_between(x, y_lo, y_hi, alpha=0.2)`, `ax.bar`, `ax.barh`, `ax.hist`, `ax.boxplot`, `ax.violinplot`, `ax.ecdf`, `ax.imshow`, `ax.pcolormesh`, `ax.contour`, `ax.contourf` (2D decision boundaries!), `fig.colorbar`.
  * Reference Lines & Labels: `ax.axhline`, `ax.axvline`, `ax.axvspan`, `ax.text`, `ax.annotate`, `ax.set_title`, `ax.set_xlabel`, `ax.set_ylabel`, `ax.set_xlim`, `ax.set_ylim`, `ax.set_xscale('log')`, `ax.legend()`, `ax.grid(True)`.
* **`seaborn` (Statistical Data Visualization):**
  * Relational & Regression: `sns.scatterplot(data, x, y, hue, style, size)`, `sns.lineplot(data, x, y, hue, errorbar='sd')`, `sns.relplot`, `sns.regplot`, `sns.lmplot`, `sns.residplot`.
  * Distributions: `sns.histplot(data, x, hue, kde=True)`, `sns.kdeplot(data, x, y, fill=True)`, `sns.ecdfplot`, `sns.displot`.
  * Categorical: `sns.boxplot(data, x, y, hue)`, `sns.violinplot(data, x, y, hue, split=True)`, `sns.stripplot`, `sns.swarmplot`, `sns.barplot`, `sns.pointplot`, `sns.countplot`, `sns.catplot`.
  * Multivariate & Matrices: `sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm')`, `sns.clustermap(df)`, `sns.pairplot(df, hue='target', corner=True)`, `sns.jointplot(data, x, y, kind='hex'|'kde'|'reg')`, `sns.FacetGrid`.
* **`plotly.express` & `plotly.graph_objects` (Interactive Web Charts):**
  * `px.scatter`, `px.scatter_3d` (interactive 3D PCA/t-SNE), `px.line`, `px.histogram`, `px.box`, `px.violin`, `px.imshow`, `px.parallel_coordinates` (hyperparameter visualization), `go.Surface` (3D loss landscapes).

---

## Layer 4: Classical ML, Gradient Boosting Titans, Econometrics & Imbalance (`scikit-learn`, `xgboost`, `lightgbm`, `catboost`, `statsmodels`, `imblearn`)

### 5. `Scikit-Learn` (`import sklearn`) — All 27 Sub-Packages & Every Class/Function
1. **`sklearn.base`:** `BaseEstimator`, `TransformerMixin`, `ClassifierMixin`, `RegressorMixin`, `ClusterMixin`, `OutlierMixin`, `MetaEstimatorMixin`, `clone`, `is_classifier`, `is_regressor`.
2. **`sklearn.preprocessing`:** `StandardScaler`, `MinMaxScaler`, `MaxAbsScaler`, `RobustScaler`, `Normalizer`, `PowerTransformer` (Yeo-Johnson / Box-Cox), `QuantileTransformer`, `FunctionTransformer`, `PolynomialFeatures`, `SplineTransformer` (B-splines), `KBinsDiscretizer`, `OneHotEncoder`, `OrdinalEncoder`, `TargetEncoder` (out-of-fold target encoding), `LabelEncoder`, `LabelBinarizer`, `MultiLabelBinarizer`, `Binarizer`.
3. **`sklearn.impute`:** `SimpleImputer(strategy='mean'|'median'|'most_frequent'|'constant', add_indicator=True)`, `KNNImputer`, `IterativeImputer` (MICE), `MissingIndicator`.
4. **`sklearn.feature_extraction`:** `DictVectorizer`, `FeatureHasher`, `text.CountVectorizer`, `text.TfidfTransformer`, `text.TfidfVectorizer`, `text.HashingVectorizer`, `image.PatchExtractor`.
5. **`sklearn.feature_selection`:** `VarianceThreshold`, `SelectKBest`, `SelectPercentile`, `SelectFpr`, `SelectFdr`, `SelectFwe`, `GenericUnivariateSelect`, `SelectFromModel`, `RFE`, `RFECV`, `SequentialFeatureSelector`, `f_classif`, `f_regression`, `r_regression`, `chi2`, `mutual_info_classif`, `mutual_info_regression`.
6. **`sklearn.compose` & `7. sklearn.pipeline`:** `Pipeline`, `make_pipeline`, `FeatureUnion`, `make_union`, `ColumnTransformer`, `make_column_transformer`, `make_column_selector`, `TransformedTargetRegressor`.
8. **`sklearn.model_selection`:**
   * Splitters: `train_test_split`, `KFold`, `StratifiedKFold`, `GroupKFold`, `StratifiedGroupKFold`, `TimeSeriesSplit(n_splits, gap)`, `RepeatedKFold`, `RepeatedStratifiedKFold`, `LeaveOneOut`, `LeavePOut`, `LeaveOneGroupOut`, `PredefinedSplit`, `ShuffleSplit`, `StratifiedShuffleSplit`, `GroupShuffleSplit`.
   * Tuners & Thresholds: `GridSearchCV`, `RandomizedSearchCV`, `HalvingGridSearchCV`, `HalvingRandomSearchCV`, `ParameterGrid`, `ParameterSampler`, `TunedThresholdClassifierCV`, `FixedThresholdClassifier`.
   * Curves & Validation: `cross_val_score`, `cross_validate`, `cross_val_predict`, `learning_curve`, `validation_curve`, `permutation_test_score`.
9. **`sklearn.linear_model`:** `LinearRegression`, `Ridge`, `RidgeCV`, `Lasso`, `LassoCV`, `LassoLars`, `LassoLarsCV`, `LassoLarsIC`, `Lars`, `LarsCV`, `ElasticNet`, `ElasticNetCV`, `MultiTaskLasso`, `MultiTaskElasticNet`, `OrthogonalMatchingPursuit`, `BayesianRidge`, `ARDRegression`, `HuberRegressor`, `RANSACRegressor`, `TheilSenRegressor`, `QuantileRegressor`, `PoissonRegressor`, `GammaRegressor`, `TweedieRegressor`, `LogisticRegression`, `LogisticRegressionCV`, `RidgeClassifier`, `RidgeClassifierCV`, `SGDClassifier`, `SGDRegressor`, `SGDOneClassSVM`, `Perceptron`, `PassiveAggressiveClassifier`, `PassiveAggressiveRegressor`.
10. **`sklearn.svm` & `11. sklearn.kernel_ridge`:** `SVC`, `NuSVC`, `LinearSVC`, `SVR`, `NuSVR`, `LinearSVR`, `OneClassSVM`, `KernelRidge`.
12. **`sklearn.neighbors`:** `KNeighborsClassifier`, `KNeighborsRegressor`, `RadiusNeighborsClassifier`, `RadiusNeighborsRegressor`, `NearestNeighbors`, `NearestCentroid`, `NeighborhoodComponentsAnalysis` (NCA), `KernelDensity` (KDE), `LocalOutlierFactor` (LOF), `KDTree`, `BallTree`, `kneighbors_graph`, `radius_neighbors_graph`.
13. **`sklearn.naive_bayes` & `14. discriminant_analysis`:** `GaussianNB`, `MultinomialNB`, `ComplementNB`, `BernoulliNB`, `CategoricalNB`, `LinearDiscriminantAnalysis` (LDA), `QuadraticDiscriminantAnalysis` (QDA).
15. **`sklearn.tree` & `16. sklearn.ensemble`:** `DecisionTreeClassifier`, `DecisionTreeRegressor`, `ExtraTreeClassifier`, `ExtraTreeRegressor`, `export_text`, `export_graphviz`, `plot_tree`; `BaggingClassifier`, `BaggingRegressor`, `RandomForestClassifier`, `RandomForestRegressor`, `ExtraTreesClassifier`, `ExtraTreesRegressor`, `RandomTreesEmbedding`, `IsolationForest`, `AdaBoostClassifier`, `AdaBoostRegressor`, `GradientBoostingClassifier`, `GradientBoostingRegressor`, `HistGradientBoostingClassifier`, `HistGradientBoostingRegressor`, `VotingClassifier`, `VotingRegressor`, `StackingClassifier`, `StackingRegressor`.
17. **`sklearn.multiclass`, `multioutput` & `calibration`:** `OneVsRestClassifier`, `OneVsOneClassifier`, `OutputCodeClassifier`, `MultiOutputClassifier`, `MultiOutputRegressor`, `ClassifierChain`, `RegressorChain`, `CalibratedClassifierCV`, `calibration_curve`, `CalibrationDisplay`.
18. **`sklearn.cluster` & `19. sklearn.mixture`:** `KMeans`, `MiniBatchKMeans`, `BisectingKMeans`, `AgglomerativeClustering`, `FeatureAgglomeration`, `Birch`, `DBSCAN`, `HDBSCAN`, `OPTICS`, `MeanShift`, `estimate_bandwidth`, `SpectralClustering`, `AffinityPropagation`, `GaussianMixture`, `BayesianGaussianMixture`.
20. **`sklearn.decomposition`, `21. manifold` & `22. random_projection`:** `PCA`, `IncrementalPCA`, `KernelPCA`, `SparsePCA`, `TruncatedSVD`, `FastICA`, `NMF`, `LatentDirichletAllocation`, `FactorAnalysis`, `DictionaryLearning`, `TSNE`, `Isomap`, `LocallyLinearEmbedding`, `MDS`, `SpectralEmbedding`, `GaussianRandomProjection`, `SparseRandomProjection`.
23. **`sklearn.gaussian_process`, `covariance`, `semi_supervised`, `isotonic` & `neural_network`:** `GaussianProcessRegressor`, `GaussianProcessClassifier`, `kernels.RBF`, `Matern`, `RationalQuadratic`, `ExpSineSquared`, `WhiteKernel`; `EmpiricalCovariance`, `LedoitWolf`, `GraphicalLassoCV`, `MinCovDet`, `EllipticEnvelope`; `SelfTrainingClassifier`, `LabelPropagation`, `LabelSpreading`; `IsotonicRegression`; `MLPClassifier`, `MLPRegressor`, `BernoulliRBM`.
24. **`sklearn.metrics`:**
    * Classification: `accuracy_score`, `balanced_accuracy_score`, `top_k_accuracy_score`, `precision_score`, `recall_score`, `f1_score`, `fbeta_score`, `precision_recall_fscore_support`, `classification_report`, `confusion_matrix`, `multilabel_confusion_matrix`, `cohen_kappa_score`, `matthews_corrcoef` (MCC), `jaccard_score`, `log_loss`, `brier_score_loss`, `hinge_loss`, `roc_curve`, `roc_auc_score`, `precision_recall_curve`, `average_precision_score`, `det_curve`, `auc`.
    * Regression: `mean_squared_error`, `root_mean_squared_error`, `mean_absolute_error`, `mean_absolute_percentage_error`, `median_absolute_error`, `r2_score`, `explained_variance_score`, `max_error`, `mean_squared_log_error`, `mean_pinball_loss`, `mean_poisson_deviance`, `mean_gamma_deviance`, `mean_tweedie_deviance`.
    * Clustering & Pairwise: `silhouette_score`, `silhouette_samples`, `calinski_harabasz_score`, `davies_bouldin_score`, `adjusted_rand_score`, `normalized_mutual_info_score`, `adjusted_mutual_info_score`, `homogeneity_completeness_v_measure`, `pairwise_distances`, `cosine_similarity`, `make_scorer`.
    * Displays: `ConfusionMatrixDisplay`, `RocCurveDisplay`, `PrecisionRecallDisplay`, `PredictionErrorDisplay`, `CalibrationDisplay`, `LearningCurveDisplay`, `ValidationCurveDisplay`.
25. **`sklearn.inspection`, `26. datasets`, `27. dummy` & `utils`:** `permutation_importance`, `partial_dependence`, `PartialDependenceDisplay`, `DecisionBoundaryDisplay`; `load_iris`, `load_digits`, `load_wine`, `load_breast_cancer`, `load_diabetes`, `fetch_california_housing`, `fetch_openml`, `make_classification`, `make_regression`, `make_blobs`, `make_moons`, `make_circles`; `DummyClassifier`, `DummyRegressor`; `sklearn.set_config(transform_output="pandas")`, `compute_class_weight`, `compute_sample_weight`, `resample`, `shuffle`.

---

### 6. `XGBoost` (`xgboost`), `LightGBM` (`lightgbm`), `CatBoost` (`catboost`), `Statsmodels` (`statsmodels`) & `Imbalanced-Learn` (`imblearn`)
* **`xgboost`:** Depth-wise 2nd-order GBDT with sparsity-aware missing-value routing and weighted quantile sketch.
  * Classes & Functions: `XGBClassifier`, `XGBRegressor`, `XGBRanker`, `XGBRFClassifier`, `XGBRFRegressor`, `xgb.DMatrix`, `xgb.QuantileDMatrix`, `xgb.train`, `xgb.cv`, `xgb.plot_importance(importance_type='gain')`, `booster.predict(dtest, pred_contribs=True)` (native TreeSHAP!).
  * Key Params: `n_estimators`, `learning_rate`, `max_depth`, `min_child_weight`, `gamma`, `subsample`, `colsample_bytree`, `reg_alpha`, `reg_lambda`, `scale_pos_weight`, `tree_method='hist'`, `device='cuda'`, `enable_categorical=True`, `monotone_constraints`, `interaction_constraints`.
* **`lightgbm`:** Leaf-wise histogram GBDT with GOSS (Gradient-based One-Side Sampling) and EFB (Exclusive Feature Bundling).
  * Classes & Functions: `LGBMClassifier`, `LGBMRegressor`, `LGBMRanker`, `lgb.Dataset`, `lgb.train`, `lgb.cv`, `lgb.early_stopping(50)`, `lgb.log_evaluation(50)`, `lgb.plot_importance`.
  * Key Params: `num_leaves=31` (main complexity knob; keep `< 2**max_depth`), `max_depth`, `min_child_samples`, `learning_rate`, `boosting_type='gbdt'|'dart'|'goss'`, `subsample`, `subsample_freq=1`, `colsample_bytree`, `cat_smooth`.
* **`catboost`:** Symmetric Oblivious Trees (bitwise table evaluation) + Ordered Target Statistics (leak-free categorical encoding).
  * Classes & Functions: `CatBoostClassifier`, `CatBoostRegressor`, `CatBoostRanker`, `cb.Pool`, `cb.cv`, `cb.sum_models`, `model.get_feature_importance(type='PredictionValuesChange'|'ShapValues'|'Interaction')`.
  * Key Params: `iterations`, `learning_rate`, `depth=6`, `l2_leaf_reg`, `cat_features`, `text_features`, `embedding_features`, `auto_class_weights='Balanced'`.
* **`statsmodels` (`import statsmodels.api as sm`, `import statsmodels.formula.api as smf`):**
  * Models: `sm.OLS(y, X)`, `sm.WLS`, `sm.GLS`, `sm.RLM`, `sm.QuantReg`, `sm.Logit`, `sm.Probit`, `sm.MNLogit`, `sm.Poisson`, `sm.GLM`, `sm.MixedLM`, `sm.add_constant(X)`, `smf.ols('y ~ x1 + C(cat) + x1:x2', data=df).fit(cov_type='HC3')` $\rightarrow$ `.summary()`, `.pvalues`, `.tvalues`, `.conf_int()`, `.get_prediction().summary_frame()`.
  * Diagnostics & Time Series: `variance_inflation_factor(X, j)` (VIF multicollinearity), `het_breuschpagan`, `durbin_watson`, `acorr_ljungbox`, `multipletests(pvals, method='fdr_bh')`, `adfuller` (ADF stationarity test), `kpss`, `acf`, `pacf`, `seasonal_decompose`, `STL`, `ARIMA`, `SARIMAX`, `ExponentialSmoothing` (Holt-Winters), `VAR`.
* **`imbalanced-learn` (`import imblearn`):**
  * Leak-Free Pipeline: `imblearn.pipeline.Pipeline` (resamples *only* during `.fit()`, never during `.predict()`).
  * Over-Samplers: `RandomOverSampler`, `SMOTE`, `SMOTENC`, `SMOTEN`, `BorderlineSMOTE`, `SVMSMOTE`, `ADASYN`.
  * Under-Samplers & Ensembles: `RandomUnderSampler`, `NearMiss`, `TomekLinks`, `EditedNearestNeighbours`, `SMOTETomek`, `SMOTEENN`, `BalancedRandomForestClassifier`, `EasyEnsembleClassifier`, `RUSBoostClassifier`.

---

## Layer 5: Deep Learning & Foundation Models (`torch`, `tensorflow`/`keras`, `jax`, `transformers`, `datasets`, `peft`, `timm`, `spacy`)

### 7. `PyTorch` (`import torch`), `TensorFlow / Keras`, `JAX` & `Hugging Face`
* **`PyTorch` (`torch`):**
  * Tensors & Autograd: `torch.tensor(..., requires_grad=True)`, `torch.from_numpy`, `t.to('cuda')`, `t.detach().cpu().numpy()`, `t.view`, `t.reshape`, `t.permute`, `t.transpose`, `torch.cat`, `torch.stack`, `torch.einsum`, `torch.bmm`, `torch.topk`, `torch.gather`, `loss.backward()`, `torch.no_grad()`, `torch.inference_mode()`, `torch.amp.autocast('cuda', dtype=torch.bfloat16)`, `torch.amp.GradScaler()`, `torch.compile(model)`.
  * `torch.nn` & `torch.nn.functional` (`F`): `nn.Module`, `nn.Sequential`, `nn.ModuleList`, `nn.Parameter`, `nn.Linear`, `nn.Embedding`, `nn.Conv1d`, `nn.Conv2d`, `nn.ConvTranspose2d`, `nn.MaxPool2d`, `nn.AdaptiveAvgPool2d`, `nn.LSTM`, `nn.GRU`, `nn.MultiheadAttention`, `F.scaled_dot_product_attention` (FlashAttention), `nn.BatchNorm1d`, `nn.BatchNorm2d`, `nn.LayerNorm`, `nn.RMSNorm`, `nn.Dropout`, `nn.ReLU`, `nn.GELU`, `nn.SiLU`, `nn.MSELoss`, `nn.HuberLoss`, `nn.BCEWithLogitsLoss`, `nn.CrossEntropyLoss`, `nn.init.kaiming_normal_`, `nn.utils.clip_grad_norm_`.
  * `torch.optim` & `torch.utils.data`: `optim.SGD`, `optim.Adam`, `optim.AdamW`, `optim.LBFGS`, `lr_scheduler.OneCycleLR`, `CosineAnnealingLR`, `ReduceLROnPlateau`; `Dataset`, `TensorDataset`, `DataLoader(dataset, batch_size, shuffle, num_workers, pin_memory=True)`, `WeightedRandomSampler`; `torch.save(model.state_dict())`, `model.load_state_dict()`.
* **`TensorFlow` (`tf`) & `Keras` (`keras`):**
  * `tf.Variable`, `tf.GradientTape`, `@tf.function(jit_compile=True)`, `tf.data.Dataset`, `keras.Sequential`, `keras.Model`, `keras.layers.*`, `model.compile(optimizer, loss, metrics)`, `model.fit(..., callbacks=[EarlyStopping(restore_best_weights=True), ModelCheckpoint, ReduceLROnPlateau])`.
* **`JAX` (`jax`, `flax`, `optax`):**
  * Composable functional transformations: `jax.grad`, `jax.value_and_grad`, `@jax.jit` (XLA compiler), `jax.vmap` (auto-batching), `jax.pmap` (multi-device), `jax.jacrev`, `jax.hessian`, `jax.random.PRNGKey`.
* **Hugging Face (`transformers`, `datasets`, `peft`, `accelerate`) & Vision/NLP (`timm`, `torchvision`, `cv2`, `spacy`):**
  * `AutoTokenizer.from_pretrained`, `AutoModel`, `AutoModelForSequenceClassification`, `AutoModelForCausalLM`, `pipeline`, `Trainer`, `TrainingArguments`, `GenerationConfig`.
  * `peft`: `LoraConfig`, `get_peft_model` (Low-Rank Adaptation $W = W_0 + \frac{\alpha}{r}BA$), `BitsAndBytesConfig(load_in_4bit=True)` (QLoRA).
  * `datasets.load_dataset`, `timm.create_model`, `torchvision.transforms.v2`, `cv2`, `spacy.load('en_core_web_sm')`.

---

## Layer 6: Bayesian Tuning, Explainable AI (XAI) & Production MLOps (`optuna`, `shap`, `lime`, `mlflow`, `onnxruntime`, `joblib`, `fastapi`, `pydantic`)

### 8. `Optuna`, `SHAP`, `LIME`, `MLflow`, `ONNX Runtime`, `Joblib` & `FastAPI`
* **`optuna` (Bayesian TPE Hyperparameter Tuning):** `optuna.create_study(direction='maximize', sampler=TPESampler(), pruner=MedianPruner())`, `study.optimize(objective, n_trials=100)`, `trial.suggest_float(name, low, high, log=True)`, `trial.suggest_int`, `trial.suggest_categorical`, `trial.report`, `trial.should_prune()`.
* **`shap` & `lime` (Explainable AI):**
  * Shapley Additive Explanations ($f(x) = \phi_0 + \sum_{j=1}^n \phi_j(x)$): `shap.TreeExplainer(model)`, `shap.LinearExplainer`, `shap.DeepExplainer`, `shap.KernelExplainer`, `shap.plots.waterfall(shap_values[0])`, `shap.plots.beeswarm(shap_values)`, `shap.plots.bar`, `shap.plots.scatter`, `shap.plots.force`.
  * `lime.lime_tabular.LimeTabularExplainer` (`.explain_instance()`).
* **Serialization, C++ Runtime, Tracking & Serving:**
  * `joblib.dump(pipe, 'model.joblib')`, `joblib.load('model.joblib')`, `joblib.Parallel`, `joblib.delayed`, `safetensors`.
  * `skl2onnx.to_onnx`, `torch.onnx.export`, `onnxruntime.InferenceSession('model.onnx')` (`.run()`).
  * `mlflow.set_experiment`, `mlflow.autolog()`, `mlflow.start_run()`, `mlflow.log_param`, `mlflow.log_metric`, `mlflow.sklearn.log_model`, `mlflow.pyfunc.load_model`.
  * `fastapi.FastAPI` (`@app.post('/predict')`) + `pydantic.BaseModel` (`Field(..., gt=0)` schema validation).

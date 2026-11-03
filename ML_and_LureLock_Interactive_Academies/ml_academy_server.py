# -*- coding: utf-8 -*-
"""
Interactive Machine Learning & LureLock Multi-Academy Local Server
Serves both Academy Applications and provides a live Python 3.14 sandboxed
execution backend for hands-on coding labs and Matplotlib figure generation.
"""

import base64
import contextlib
import io
import json
import math
import os
import re
import sys
import traceback
from collections import Counter
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, urlsplit

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import scipy
import scipy.sparse as sp
import sklearn
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import auc, brier_score_loss, confusion_matrix, roc_auc_score, roc_curve
from sklearn.model_selection import train_test_split
from sklearn.pipeline import FeatureUnion, Pipeline
from sklearn.preprocessing import RobustScaler

try:
    import tldextract
except ImportError:
    tldextract = None

try:
    import xgboost as xgb
except ImportError:
    xgb = None

PORT = 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_HTML_FILE = os.path.join(BASE_DIR, "ml_interactive_academy.html")
LURELOCK_HTML_FILE = os.path.join(BASE_DIR, "lurelock_interactive_academy.html")


PORTAL_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Machine Learning & Cyber ML Interactive Academies</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    body { background-color: #0f172a; color: #f8fafc; font-family: ui-sans-serif, system-ui, sans-serif; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6">
  <div class="max-w-4xl w-full space-y-8">
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400">
        Localhost Python 3.14 Academy Hub
      </div>
      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white">Interactive ML Academies</h1>
      <p class="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
        Select an interactive learning environment below. Both applications are powered by the live local Python 3.14 kernel and Matplotlib plotting engine.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Card 1: Machine Learning Zero to Mastery -->
      <a href="/ml_interactive_academy.html" class="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-500/20">
            ML
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Foundations to Deep Learning</span>
            <h2 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mt-0.5">Machine Learning Zero to Mastery</h2>
          </div>
          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">
            12 progressive modules covering linear algebra, gradient descent, SVMs, random forests, neural networks, and 8 live interactive Canvas simulators.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
          <span>Launch ML Academy &rarr;</span>
          <span class="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30">12 Modules &bull; 8 Labs</span>
        </div>
      </a>

      <!-- Card 2: LureLock Machine Learning & Data Cleaning Bible -->
      <a href="/lurelock_interactive_academy.html" class="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-indigo-500/20">
            LL
          </div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">Cybersecurity & Production ML</span>
            <h2 class="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mt-0.5">LureLock ML & Data Cleaning Bible</h2>
          </div>
          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed">
            From Shannon entropy & piece-by-piece formula anatomy to automated CSV sanitization funnels, 1,018-D feature pipelines, 300-tree XGBoost booster inspection, and 36 mastery exam questions.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
          <span>Launch LureLock Academy &rarr;</span>
          <span class="px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30">14 Modules &bull; 4 Simulators</span>
        </div>
      </a>
    </div>

    <!-- Active Telemetry Status -->
    <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-mono text-slate-300">Python 3.14 Execution Backend Active (:8765)</span>
      </div>
      <div class="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
        <span>NumPy &bull; Pandas &bull; Scikit-Learn &bull; Matplotlib &bull; SciPy</span>
      </div>
    </div>
  </div>
</body>
</html>
"""


class MultiAcademyHandler(SimpleHTTPRequestHandler):
    def _set_cors_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(200)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path in ("/", "/index.html"):
            self._set_cors_headers(200, "text/html; charset=utf-8")
            self.wfile.write(PORTAL_HTML.encode("utf-8"))
            return
        elif path in ("/ml", "/ml.html", "/ml_interactive_academy.html"):
            if os.path.exists(ML_HTML_FILE):
                with open(ML_HTML_FILE, "rb") as f:
                    content = f.read()
                self._set_cors_headers(200, "text/html; charset=utf-8")
                self.wfile.write(content)
                return
        elif path in ("/lurelock", "/lurelock.html", "/lurelock_interactive_academy.html"):
            if os.path.exists(LURELOCK_HTML_FILE):
                with open(LURELOCK_HTML_FILE, "rb") as f:
                    content = f.read()
                self._set_cors_headers(200, "text/html; charset=utf-8")
                self.wfile.write(content)
                return
        elif path == "/health":
            res = {
                "status": "healthy",
                "python_version": sys.version,
                "ml_app": os.path.exists(ML_HTML_FILE),
                "lurelock_app": os.path.exists(LURELOCK_HTML_FILE),
            }
            self._set_cors_headers(200, "application/json")
            self.wfile.write(json.dumps(res).encode("utf-8"))
            return

        return super().do_GET()

    def do_POST(self):
        if self.path == "/run":
            length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(length).decode("utf-8")
            payload = json.loads(raw_body or "{}")
            code = payload.get("code", "")
            lab_id = payload.get("lab_id", None)

            stdout_buf = io.StringIO()
            stderr_buf = io.StringIO()
            img_b64 = None
            success = True

            plt.close("all")
            exec_globals = {
                "__builtins__": __builtins__,
                "np": np,
                "pd": pd,
                "sp": sp,
                "scipy": scipy,
                "sklearn": sklearn,
                "plt": plt,
                "re": re,
                "math": math,
                "Counter": Counter,
                "urlsplit": urlsplit,
                "urlparse": urlparse,
                "tldextract": tldextract,
                "xgb": xgb,
                "RobustScaler": RobustScaler,
                "TfidfVectorizer": TfidfVectorizer,
                "FeatureUnion": FeatureUnion,
                "Pipeline": Pipeline,
                "BaseEstimator": BaseEstimator,
                "TransformerMixin": TransformerMixin,
                "train_test_split": train_test_split,
                "roc_curve": roc_curve,
                "auc": auc,
                "roc_auc_score": roc_auc_score,
                "brier_score_loss": brier_score_loss,
                "confusion_matrix": confusion_matrix,
            }

            try:
                with contextlib.redirect_stdout(stdout_buf), contextlib.redirect_stderr(stderr_buf):
                    exec(code, exec_globals)
                
                # Check for Matplotlib figures
                if plt.get_fignums():
                    png_buf = io.BytesIO()
                    plt.savefig(png_buf, format="png", bbox_inches="tight", dpi=120)
                    png_buf.seek(0)
                    img_b64 = base64.b64encode(png_buf.read()).decode("ascii")
                    plt.close("all")
            except Exception:
                success = False
                stderr_buf.write(traceback.format_exc())

            stdout_val = stdout_buf.getvalue()
            stderr_val = stderr_buf.getvalue()

            if not stdout_val and not stderr_val and success:
                stdout_val = "[OK] Code executed successfully with 0 errors.\n"

            response = {
                "success": success and (not stderr_val),
                "stdout": stdout_val,
                "stderr": stderr_val,
                "output": stdout_val + (f"\nErrors:\n{stderr_val}" if stderr_val else ""),
                "image_base64": img_b64,
            }
            self._set_cors_headers(200, "application/json")
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self._set_cors_headers(404, "application/json")
            self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))


def run_server():
    os.chdir(BASE_DIR)
    server = HTTPServer(("127.0.0.1", PORT), MultiAcademyHandler)
    print(f"[OK] Multi-Academy Hub active at: http://localhost:{PORT}", flush=True)
    print(f"     -> Machine Learning Zero-to-Mastery: http://localhost:{PORT}/ml_interactive_academy.html", flush=True)
    print(f"     -> LureLock ML & Data Cleaning Bible: http://localhost:{PORT}/lurelock_interactive_academy.html", flush=True)
    print(f"     -> Live Execution Kernel: http://localhost:{PORT}/run", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    run_server()

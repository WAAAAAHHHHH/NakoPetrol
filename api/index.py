"""
Farmelster - Root Serverless API Router for Vercel
Directs /api/* requests to FastAPI Application
"""
import sys
import os

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(repo_root, "terramind", "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

handler = app
__all__ = ["app", "handler"]

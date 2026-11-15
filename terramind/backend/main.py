"""
Vercel Serverless Function Entrypoint for FastAPI
"""
import sys
import os

# Add backend directory to Python sys.path so 'app' module is always discoverable
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.main import app

# Export for ASGI servers
__all__ = ["app"]

#!/usr/bin/env python3
"""
FastAPI Authentication System Startup Script
"""
import uvicorn
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Starting FastAPI Authentication System...")
    print("📍 Server will be available at: http://localhost:8080")
    print("📖 API Documentation: http://localhost:8080/docs")
    print("🔧 Interactive API: http://localhost:8080/redoc")
    print("\n🔑 Available endpoints:")
    print("   POST /auth/signup - Create new account")
    print("   POST /auth/signin - Login to account")
    print("   GET  /health - Health check")
    print("\n" + "="*50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
        log_level="info"
    )
#!/usr/bin/env python3
"""
Quick test script to verify endpoints are working
"""
import requests
import json

BASE_URL = "http://localhost:8080"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_signup():
    """Test signup endpoint"""
    try:
        data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "testpass123"
        }
        response = requests.post(f"{BASE_URL}/auth/signup", json=data)
        print(f"✅ Signup test: {response.status_code}")
        if response.status_code == 201:
            print(f"   Token received: {response.json().get('access_token', 'N/A')[:20]}...")
        else:
            print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Signup test failed: {e}")
        return False

def test_signin():
    """Test signin endpoint"""
    try:
        data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        response = requests.post(f"{BASE_URL}/auth/signin", json=data)
        print(f"✅ Signin test: {response.status_code}")
        if response.status_code == 200:
            print(f"   Token received: {response.json().get('access_token', 'N/A')[:20]}...")
        else:
            print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Signin test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing FastAPI endpoints...")
    print("Make sure the server is running on localhost:8080\n")
    
    test_health()
    test_signup()
    test_signin()
    
    print(f"\n📖 Visit {BASE_URL}/docs for interactive API documentation")
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_user_register_and_login():
    email = "teststudent@example.com"
    pwd = "secretpassword123"
    name = "Test Student"

    # 1. Register
    reg_res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": pwd,
        "full_name": name
    })
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == email
    assert reg_data["user"]["full_name"] == name

    token = reg_data["access_token"]

    # 2. Get Me (Authenticated)
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email

    # 3. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": email,
        "password": pwd
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

def test_duplicate_register_fails():
    email = "duplicate@example.com"
    client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "secretpassword123",
        "full_name": "Dup User"
    })
    # Try duplicate
    res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "secretpassword123",
        "full_name": "Dup User"
    })
    assert res.status_code in (400, 422)

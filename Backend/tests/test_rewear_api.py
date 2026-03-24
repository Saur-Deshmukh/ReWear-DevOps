import pytest
import json
import sys, os
from tabulate import tabulate

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app import app

test_results = []

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def record_result(unit_name, input_data, actual, expected, passed):
    result = "PASS" if passed else "FAIL"
    test_results.append([
        unit_name,
        json.dumps(input_data, indent=2),
        str(actual),
        str(expected),
        result
    ])



def test_add_item_missing_field(client, monkeypatch):
    unit = "test_add_item_missing_field"
    data = {
        "title": "T-Shirt",
        "description": "A nice cotton T-shirt",
        "size": "M",
        "points": "20",
        "uploaderUid": "user_001"
    }

    monkeypatch.setattr("cloudinary.uploader.upload", lambda file: {"secure_url": "fake-url"})
    response = client.post("/api/items/add", data=data)
    actual, expected = response.status_code, 400
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_add_item_valid(client, monkeypatch):
    unit = "test_add_item_valid"
    data = {
        "title": "Denim Jacket",
        "description": "Stylish blue denim jacket",
        "category": "Jacket",
        "type": "Clothing",
        "size": "L",
        "condition": "Good",
        "brand": "Zara",
        "color": "Blue",
        "material": "Denim",
        "points": "30",
        "uploaderUid": "user_001"
    }

    monkeypatch.setattr("cloudinary.uploader.upload", lambda file: {"secure_url": "fake-url"})
    mock_insert = lambda x: type("obj", (object,), {"inserted_id": "item_123"})()
    monkeypatch.setattr("db.collections.items.insert_one", mock_insert)
    monkeypatch.setattr("db.collections.users.update_one", lambda *a, **kw: None)

    response = client.post("/api/items/add", data=data)
    actual, expected = response.status_code, 201
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_get_available_items(client, monkeypatch):
    unit = "test_get_available_items"
    data = {}
    monkeypatch.setattr("db.collections.items.find", lambda q: [{"_id": "item_001", "title": "Blue Shirt", "status": "available"}])

    response = client.get("/api/items/available")
    actual, expected = response.status_code, 200
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_get_available_items_db_error(client, monkeypatch):
    unit = "test_get_available_items_db_error"
    data = {}
    monkeypatch.setattr("db.collections.items.find", lambda q: (_ for _ in ()).throw(Exception("DB error")))

    response = client.get("/api/items/available")
    actual, expected = response.status_code, 500
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_redeem_item_missing_fields(client):
    unit = "test_redeem_item_missing_fields"
    data = {}
    response = client.post("/api/swap/redeem", json=data)
    actual, expected = response.status_code, 400
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_redeem_item_user_not_found(client, monkeypatch):
    unit = "test_redeem_item_user_not_found"
    data = {"uid": "user_404", "itemId": "item_001"}
    monkeypatch.setattr("db.collections.users.find_one", lambda q: None)
    response = client.post("/api/swap/redeem", json=data)
    actual, expected = response.status_code, 404
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_get_user_info_missing_uid(client):
    unit = "test_get_user_info_missing_uid"
    data = {}
    response = client.post("/api/users/info", json=data)
    actual, expected = response.status_code, 400
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_get_user_info_success(client, monkeypatch):
    unit = "test_get_user_info_success"
    data = {"uid": "user_123"}
    mock_user = {"name": "Saur", "points": 100, "email": "saur@example.com", "createdAt": "2025-01-01"}
    monkeypatch.setattr("db.collections.users.find_one", lambda q, p: mock_user)

    response = client.post("/api/users/info", json=data)
    actual, expected = response.status_code, 200
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_manage_users_success(client, monkeypatch):
    unit = "test_manage_users_success"
    data = {}
    mock_users = [
        {"uid": "u001", "name": "Saur", "points": 100, "createdAt": "2025-01-01", "role": "user"},
        {"uid": "u002", "name": "Atharva", "points": 150, "createdAt": "2025-01-02", "role": "user"}
    ]
    monkeypatch.setattr("db.collections.users.find", lambda *a, **kw: mock_users)

    response = client.get("/api/admin/manage-users")
    actual, expected = response.status_code, 200
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected


def test_manage_users_db_error(client, monkeypatch):
    unit = "test_manage_users_db_error"
    data = {}
    monkeypatch.setattr("db.collections.users.find", lambda *a, **kw: (_ for _ in ()).throw(Exception("DB error")))
    response = client.get("/api/admin/manage-users")
    actual, expected = response.status_code, 500
    record_result(unit, data, actual, expected, actual == expected)
    assert actual == expected



@pytest.fixture(scope="session", autouse=True)
def display_results(request):
    yield
    print("\n\n" + "=" * 100)
    print("UNIT TEST SUMMARY TABLE")
    print("=" * 100)
    headers = ["Unit Name", "Input", "Actual Output", "Expected Output", "Result"]
    print(tabulate(test_results, headers=headers, tablefmt="grid"))
    print("=" * 100 + "\n")

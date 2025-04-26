# tests/test_trash.py
import io

def test_scan_trash(client):
    # 用一個空白 PNG 模擬上傳
    fake_png = io.BytesIO(b"\x89PNG\r\n\x1a\n")
    response = client.post(
        "/trash/scan_trash",
        files={"image": ("test.png", fake_png, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "Recyclable"
    assert "sub_category" in data

def test_prove_disposal(client):
    fake_png = io.BytesIO(b"\x89PNG\r\n\x1a\n")
    response = client.post(
        "/trash/prove_disposal",
        files={"image": ("test.png", fake_png, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["passed"] is True
    assert "reason" in data

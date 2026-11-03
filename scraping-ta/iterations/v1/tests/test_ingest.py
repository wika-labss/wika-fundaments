from __future__ import annotations

from fastapi.testclient import TestClient

from schema import ChannelResult, ProductRow, utc_now

INGEST_KEY = "test-ingest-key"


def _peya_xhr() -> list[dict]:
    return [{
        "url": "https://www.pedidosya.cl/v2/niles/partners/abc/menus?occasion=DELIVERY",
        "method": "GET",
        "body": {
            "name": "Local Test",
            "sections": [{
                "name": "Promos",
                "products": [{
                    "id": "1",
                    "name": "Promo Box",
                    "description": "",
                    "enabled": True,
                    "price": {"finalPrice": 5000, "originalPrice": 9990},
                }],
            }],
        },
    }]


def _rappi_xhr() -> list[dict]:
    return [{
        "url": "https://services.rappi.cl/api/web-gateway/web/restaurants-bus/store/id/123/",
        "method": "POST",
        "body": {
            "name": "Local Test",
            "corridors": [{
                "name": "Promos",
                "products": [{
                    "id": "1",
                    "name": "Promo Box Rappi",
                    "description": "",
                    "price": 5000,
                    "real_price": 9990,
                }],
            }],
        },
    }]


def _uber_html() -> str:
    state = (
        '{"queries":[{"queryKey":["getStoreV1"],"state":{"data":{'
        '"title":"Local Test",'
        '"catalogSectionsMap":{"s1":{"catalogName":"Promos","catalogItems":['
        '{"uuid":"u1","title":"Promo Box Uber","itemDescription":"","price":500000,"isAvailable":true}'
        "]}}}}}]}"
    )
    return (
        "<html><head></head><body>"
        f'<script id="__REACT_QUERY_STATE__">{state}</script>'
        "</body></html>"
    )


def _client(tmp_path, monkeypatch, auth: str = "0"):
    import app as appmod

    monkeypatch.setenv("INGEST_KEY", INGEST_KEY)
    monkeypatch.setenv("SCRAPING_TA_AUTH", auth)
    monkeypatch.setattr(appmod, "RUNS_DIR", tmp_path)
    with appmod.JOBS_LOCK:
        appmod.JOBS.clear()
    return TestClient(appmod.app), appmod


def _headers() -> dict[str, str]:
    return {"Authorization": f"Bearer {INGEST_KEY}"}


def _open(client: TestClient) -> str:
    created = client.post("/api/jobs")
    assert created.status_code == 200
    assert created.json()["status"] == "collecting"
    return created.json()["run_id"]


def _ingest(client: TestClient, run_id: str, platform: str, url: str, body: str, xhr: list) -> dict:
    res = client.post(
        "/api/ingest",
        headers=_headers(),
        json={"job_id": run_id, "platform": platform, "source_url": url, "body": body, "xhr": xhr},
    )
    assert res.status_code == 200
    return res.json()


def test_ingest_requires_bearer(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    run_id = _open(client)
    res = client.post("/api/ingest", json={
        "job_id": run_id,
        "platform": "peya",
        "source_url": "https://www.pedidosya.cl/restaurantes/x",
        "body": "<html></html>",
        "xhr": _peya_xhr(),
    })
    assert res.status_code == 401


def test_ingest_missing_key_returns_503(tmp_path, monkeypatch):
    import app as appmod

    monkeypatch.delenv("INGEST_KEY", raising=False)
    monkeypatch.setenv("SCRAPING_TA_AUTH", "0")
    monkeypatch.setattr(appmod, "RUNS_DIR", tmp_path)
    client = TestClient(appmod.app)
    res = client.post(
        "/api/ingest",
        headers={"Authorization": "Bearer nope"},
        json={"platform": "peya", "source_url": "https://www.pedidosya.cl/x", "body": "", "xhr": []},
    )
    assert res.status_code == 503


def test_ingest_without_open_report_returns_400(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    res = client.post(
        "/api/ingest",
        headers=_headers(),
        json={
            "platform": "peya",
            "source_url": "https://www.pedidosya.cl/restaurantes/x",
            "body": "",
            "xhr": _peya_xhr(),
        },
    )
    assert res.status_code == 400


def test_ingest_peya_creates_run_and_xlsx(tmp_path, monkeypatch):
    client, appmod = _client(tmp_path, monkeypatch)
    run_id = _open(client)
    data = _ingest(client, run_id, "peya", "https://www.pedidosya.cl/restaurantes/x", "<html></html>", _peya_xhr())
    assert data["run_id"] == run_id
    assert data["status"] == "collecting"
    assert data["ready"] is False
    peya = next(ch for ch in data["channels"] if ch["platform"] == "pedidosya")
    assert peya["item_count"] == 1
    assert peya["skipped"] is False
    assert peya["items"][0]["name"] == "Promo Box"
    assert (tmp_path / f"{run_id}.json").exists()
    assert (tmp_path / f"{run_id}.xlsx").exists()
    xlsx = client.get(f"/api/report/{run_id}.xlsx")
    assert xlsx.status_code == 200
    assert xlsx.content[:2] == b"PK"
    assert appmod.JOBS[run_id]["status"] == "collecting"


def test_create_job_and_ingest_into_run(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    created = client.post("/api/jobs", json={"justo": "https://www.tarragona.cl/pedir"})
    assert created.status_code == 200
    job = created.json()
    assert job["status"] == "collecting"
    run_id = job["run_id"]

    active = client.get("/api/jobs/active")
    assert active.status_code == 200
    assert active.json()["run_id"] == run_id

    data = _ingest(client, run_id, "rappi", "https://www.rappi.cl/restaurantes/x", "", _rappi_xhr())
    assert data["run_id"] == run_id
    rappi = next(ch for ch in data["channels"] if ch["platform"] == "rappi")
    assert rappi["item_count"] == 1
    platforms = [ch["platform"] for ch in data["channels"]]
    assert platforms[:4] == ["pedidosya", "ubereats", "rappi", "justo"]


def test_ingest_uber_react_query(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    run_id = _open(client)
    data = _ingest(client, run_id, "uber", "https://www.ubereats.com/cl/store/x", _uber_html(), [])
    uber = next(ch for ch in data["channels"] if ch["platform"] == "ubereats")
    assert uber["item_count"] == 1
    assert uber["items"][0]["name"] == "Promo Box Uber"
    assert uber["items"][0]["price_clp"] == 5000


def test_ingest_without_signal_records_error(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    run_id = _open(client)
    data = _ingest(client, run_id, "peya", "https://www.pedidosya.cl/restaurantes/x", "<html>challenge</html>", [])
    peya = next(ch for ch in data["channels"] if ch["platform"] == "pedidosya")
    assert peya["error"]
    assert peya["item_count"] == 0


def test_ingest_rejects_justo(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    run_id = _open(client)
    res = client.post(
        "/api/ingest",
        headers=_headers(),
        json={"job_id": run_id, "platform": "justo", "source_url": "https://www.tarragona.cl/pedir", "body": "", "xhr": []},
    )
    assert res.status_code == 400


def test_jobs_active_404_when_empty(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    res = client.get("/api/jobs/active")
    assert res.status_code == 404


def test_justo_cdn_merges_into_collecting(tmp_path, monkeypatch):
    client, appmod = _client(tmp_path, monkeypatch)

    def fake_justo(url: str) -> ChannelResult:
        return ChannelResult(
            platform="justo",
            store="Tarragona test",
            source_url=url,
            native_source="cdn-test",
            items=[ProductRow(
                platform="justo",
                store="Tarragona test",
                section="Promos",
                name="Promo Box Justo",
                description="",
                price_clp=3990,
                price_original_clp=9990,
                available=True,
                source_url=url,
                scraped_at=utc_now(),
            )],
        )

    monkeypatch.setattr(appmod, "_audit_justo", fake_justo)
    created = client.post("/api/jobs").json()
    res = client.post(f"/api/jobs/{created['run_id']}/justo", json={"justo": "https://www.tarragona.cl/pedir"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "collecting"
    justo = next(ch for ch in data["channels"] if ch["platform"] == "justo")
    assert justo["item_count"] == 1


def test_new_job_closes_the_previous_one(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    first = _open(client)
    second = _open(client)
    assert client.get(f"/api/audit/{first}").json()["status"] == "closed"
    active = client.get("/api/jobs/active")
    assert active.status_code == 200
    assert active.json()["run_id"] == second


def test_close_seals_report_and_blocks_later_ingest(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    run_id = _open(client)
    _ingest(client, run_id, "peya", "https://www.pedidosya.cl/x", "", _peya_xhr())
    closed = client.post(f"/api/jobs/{run_id}/close")
    assert closed.status_code == 200
    body = closed.json()
    assert body["status"] == "closed"
    assert body["ready"] is True
    assert body["report_url"] == f"/api/report/{run_id}.xlsx"
    again = client.post(f"/api/jobs/{run_id}/close")
    assert again.status_code == 200
    assert again.json()["status"] == "closed"
    assert client.get("/api/jobs/active").status_code == 404
    rejected = client.post(
        "/api/ingest",
        headers=_headers(),
        json={"job_id": run_id, "platform": "rappi", "source_url": "https://www.rappi.cl/x", "body": "", "xhr": _rappi_xhr()},
    )
    assert rejected.status_code == 409
    xlsx = client.get(body["report_url"])
    assert xlsx.status_code == 200
    assert xlsx.content[:2] == b"PK"


def test_extension_downloads_without_admin_cookie(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch, auth="1")
    headers = _headers()
    assert client.post("/api/jobs").status_code == 401
    assert client.get("/api/reports").status_code == 401
    created = client.post("/api/jobs", headers=headers)
    assert created.status_code == 200
    run_id = created.json()["run_id"]
    ingested = client.post(
        "/api/ingest",
        headers=headers,
        json={
            "job_id": run_id,
            "platform": "peya",
            "source_url": "https://www.pedidosya.cl/restaurantes/x",
            "body": "",
            "xhr": _peya_xhr(),
        },
    )
    assert ingested.status_code == 200
    assert client.get(f"/api/report/{run_id}.xlsx").status_code == 401
    closed = client.post(f"/api/jobs/{run_id}/close", headers=headers)
    assert closed.status_code == 200
    assert closed.json()["ready"] is True
    xlsx = client.get(closed.json()["report_url"], headers=headers)
    assert xlsx.status_code == 200
    assert xlsx.content[:2] == b"PK"
    audit = client.get(f"/api/audit/{run_id}", headers=headers)
    assert audit.status_code == 200
    assert audit.json()["status"] == "closed"
    assert client.get("/api/reports", headers=headers).status_code == 401


def test_ingest_cors_preflight(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch, auth="1")
    res = client.options(
        "/api/ingest",
        headers={
            "Origin": "chrome-extension://abcdefghijklmnopqrstuvwxyz",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )
    assert res.status_code in {200, 204}
    allow = res.headers.get("access-control-allow-origin")
    assert allow in {"*", "chrome-extension://abcdefghijklmnopqrstuvwxyz"}


def test_three_extension_channels_stay_open_until_close(tmp_path, monkeypatch):
    client, _appmod = _client(tmp_path, monkeypatch)
    run_id = _open(client)
    _ingest(client, run_id, "peya", "https://www.pedidosya.cl/x", "", _peya_xhr())
    _ingest(client, run_id, "rappi", "https://www.rappi.cl/x", "", _rappi_xhr())
    last = _ingest(client, run_id, "uber", "https://www.ubereats.com/x", _uber_html(), [])
    assert last["status"] == "collecting"
    assert client.get("/api/jobs/active").status_code == 200
    closed = client.post(f"/api/jobs/{run_id}/close")
    assert closed.json()["status"] == "closed"
    assert client.get("/api/jobs/active").status_code == 404

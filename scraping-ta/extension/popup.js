const DEFAULT_API = "https://ta.vissiuss.com";
const JUSTO_URL = "https://www.tarragona.cl/pedir";

const $ = (id) => document.getElementById(id);

let runId = "";
let runStatus = "";

function detectPlatform(url) {
  const value = String(url || "").toLowerCase();
  if (value.includes("pedidosya.")) return { platform: "peya", label: "PedidosYa" };
  if (value.includes("ubereats.") || value.includes("uber.com")) return { platform: "uber", label: "Uber Eats" };
  if (value.includes("rappi.")) return { platform: "rappi", label: "Rappi" };
  return null;
}

function parseJsonish(value) {
  if (value && typeof value === "object") return value;
  if (typeof value !== "string" || !value.trim()) return null;
  try { return JSON.parse(value); } catch { return null; }
}

function hasNativeSignal(platform, dump) {
  const xhr = dump.xhr || [];
  if (platform === "peya") {
    return xhr.some((entry) => {
      const url = String((entry && entry.url) || "");
      const body = parseJsonish(entry && entry.body);
      return url.includes("/niles/partners/") && url.includes("/menus")
        && body && Array.isArray(body.sections);
    });
  }
  if (platform === "rappi") {
    return xhr.some((entry) => String((entry && entry.url) || "").includes("restaurants-bus/store/id/"));
  }
  if (platform === "uber") {
    return String(dump.body || "").includes("__REACT_QUERY_STATE__");
  }
  return false;
}

function setStatus(text, kind) {
  $("status").textContent = text;
  $("status").className = "meta" + (kind ? " " + kind : "");
}

function fail(err) {
  const raw = String((err && err.message) || err || "");
  if (raw.includes("Failed to fetch")) {
    setStatus("No llega al servidor. Revisá la API (https://ta.vissiuss.com) y que el sitio responda.", "err");
    return;
  }
  setStatus(raw, "err");
}

function apiBase() {
  return ($("api-base").value.trim() || DEFAULT_API).replace(/\/$/, "");
}

function ingestKey() {
  return $("ingest-key").value.trim();
}

function bearer() {
  return { Authorization: `Bearer ${ingestKey()}` };
}

function jsonHeaders() {
  return { ...bearer(), "Content-Type": "application/json" };
}

function paintRun() {
  const open = Boolean(runId) && runStatus === "collecting";
  $("run-label").textContent = runId ? `${runId} · ${runStatus || "…"}` : "—";
  $("send").disabled = !open;
  $("justo").disabled = !open;
  $("close-run").disabled = !open;
  $("download").disabled = !runId || runStatus === "collecting" || runStatus === "queued" || runStatus === "running";
}

function applyJob(job) {
  runId = (job && job.run_id) || "";
  runStatus = (job && job.status) || "";
  paintRun();
}

async function saveSettings() {
  await chrome.storage.local.set({
    ingestKey: ingestKey(),
    apiBase: apiBase(),
    runId,
  });
}

async function readError(res) {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (typeof data.detail === "string") return data.detail;
  } catch { /* html */ }
  return `HTTP ${res.status}`;
}

function sendMessage(tabId, payload) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, payload, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function refreshPageInfo() {
  const tab = await activeTab();
  const info = detectPlatform(tab && tab.url);
  if (!info) {
    $("page").textContent = "Abrí un menú de PedidosYa, Uber Eats o Rappi.";
    $("xhr").textContent = "XHR capturados: —";
    return { tab, info: null };
  }
  $("page").textContent = `Canal: ${info.label}`;
  try {
    const dump = await sendMessage(tab.id, { type: "count" });
    $("xhr").textContent = `XHR capturados: ${(dump && dump.count) || 0}`;
  } catch {
    $("xhr").textContent = "XHR capturados: 0 (recargá el menú)";
  }
  return { tab, info };
}

async function refreshJob() {
  if (!runId || !ingestKey()) return;
  try {
    const res = await fetch(`${apiBase()}/api/audit/${runId}`, { headers: bearer() });
    if (res.status === 404) {
      runId = "";
      runStatus = "";
      paintRun();
      await saveSettings();
      return;
    }
    if (!res.ok) return;
    applyJob(await res.json());
  } catch { /* servidor apagado */ }
}

$("new-run").onclick = async () => {
  $("new-run").disabled = true;
  setStatus("Abriendo informe…");
  try {
    await saveSettings();
    if (!ingestKey()) {
      setStatus("Pegá INGEST_KEY (la misma del servidor).", "err");
      return;
    }
    const res = await fetch(`${apiBase()}/api/jobs`, {
      method: "POST",
      headers: jsonHeaders(),
      body: "{}",
    });
    if (!res.ok) {
      setStatus(await readError(res), "err");
      return;
    }
    applyJob(await res.json());
    await saveSettings();
    setStatus(`Informe ${runId} abierto. Enviá los menús y después cerralo.`, "ok");
  } catch (err) {
    fail(err);
  } finally {
    $("new-run").disabled = false;
    paintRun();
  }
};

$("send").onclick = async () => {
  $("send").disabled = true;
  setStatus("Enviando menú…");
  try {
    await saveSettings();
    if (!ingestKey()) {
      setStatus("Pegá INGEST_KEY (la misma del servidor).", "err");
      return;
    }
    if (!runId || runStatus !== "collecting") {
      setStatus("Abrí un informe nuevo antes de enviar.", "err");
      return;
    }
    const { tab, info } = await refreshPageInfo();
    if (!tab || !info) {
      setStatus("Este sitio no es PedidosYa, Uber Eats ni Rappi.", "err");
      return;
    }
    let dump;
    try {
      dump = await sendMessage(tab.id, { type: "collect" });
    } catch {
      setStatus("No hay captura en esta pestaña. Recargá el menú.", "err");
      return;
    }
    if (!hasNativeSignal(info.platform, dump || {})) {
      setStatus("No está el menú nativo. Recargá el menú y esperá a que cargue.", "err");
      return;
    }
    const res = await fetch(`${apiBase()}/api/ingest`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({
        job_id: runId,
        platform: info.platform,
        source_url: dump.url || tab.url,
        body: dump.body || "",
        xhr: dump.xhr || [],
      }),
    });
    if (!res.ok) {
      setStatus(await readError(res), "err");
      return;
    }
    const data = await res.json();
    applyJob(data);
    const channel = (data.channels || []).find((ch) => {
      const map = { peya: "pedidosya", uber: "ubereats", rappi: "rappi" };
      return ch.platform === map[info.platform];
    });
    if (channel && channel.error) {
      setStatus(channel.error, "err");
      return;
    }
    const count = channel ? (channel.item_count || 0) : 0;
    setStatus(`Enviado. ${count} productos en ${data.run_id}.`, "ok");
    await saveSettings();
  } catch (err) {
    fail(err);
  } finally {
    paintRun();
  }
};

$("justo").onclick = async () => {
  $("justo").disabled = true;
  setStatus("Trayendo Justo…");
  try {
    if (!runId || runStatus !== "collecting") {
      setStatus("Abrí un informe nuevo antes de traer Justo.", "err");
      return;
    }
    const res = await fetch(`${apiBase()}/api/jobs/${runId}/justo`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ justo: JUSTO_URL }),
    });
    if (!res.ok) {
      setStatus(await readError(res), "err");
      return;
    }
    const data = await res.json();
    applyJob(data);
    const justo = (data.channels || []).find((ch) => ch.platform === "justo");
    if (justo && justo.error) {
      setStatus(justo.error, "err");
      return;
    }
    setStatus(`Justo listo · ${(justo && justo.item_count) || 0} productos.`, "ok");
  } catch (err) {
    fail(err);
  } finally {
    paintRun();
  }
};

$("close-run").onclick = async () => {
  $("close-run").disabled = true;
  setStatus("Cerrando informe…");
  try {
    if (!runId) {
      setStatus("No hay un informe abierto.", "err");
      return;
    }
    const res = await fetch(`${apiBase()}/api/jobs/${runId}/close`, {
      method: "POST",
      headers: bearer(),
    });
    if (!res.ok) {
      setStatus(await readError(res), "err");
      return;
    }
    applyJob(await res.json());
    await saveSettings();
    setStatus(`Informe ${runId} cerrado. Ya no recibe envíos. Descargalo cuando quieras.`, "ok");
  } catch (err) {
    fail(err);
  } finally {
    paintRun();
  }
};

$("download").onclick = async () => {
  $("download").disabled = true;
  setStatus("Descargando Excel…");
  try {
    if (!runId) {
      setStatus("No hay informe para descargar.", "err");
      return;
    }
    if (!ingestKey()) {
      setStatus("Pegá INGEST_KEY (la misma del servidor).", "err");
      return;
    }
    const filename = `auditoria-menu-${runId}.xlsx`;
    const res = await fetch(`${apiBase()}/api/report/${runId}.xlsx`, { headers: bearer() });
    if (!res.ok) {
      setStatus(await readError(res), "err");
      return;
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
    setStatus(`Excel descargado · ${runId}.`, "ok");
  } catch (err) {
    fail(err);
  } finally {
    paintRun();
  }
};

["ingest-key", "api-base"].forEach((id) => {
  $(id).addEventListener("change", saveSettings);
});

(async function boot() {
  const stored = await chrome.storage.local.get(["ingestKey", "apiBase", "runId"]);
  $("ingest-key").value = stored.ingestKey || "";
  $("api-base").value = stored.apiBase || DEFAULT_API;
  runId = stored.runId || "";
  paintRun();
  await refreshJob();
  await saveSettings();
  await refreshPageInfo();
})();

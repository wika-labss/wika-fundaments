const KEY = "rd-sku-a-content";
const form = document.getElementById("admin-form");
const status = document.getElementById("admin-status");

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "null");
  if (saved && form) {
    Object.entries(saved).forEach(([name, value]) => {
      if (form.elements[name]) form.elements[name].value = value;
    });
  }
} catch (err) {
  status.textContent = "No se pudo leer el guardado local.";
  status.classList.add("is-error");
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  localStorage.setItem(KEY, JSON.stringify(data));
  status.classList.remove("is-error");
  status.textContent = "Guardado. El schema sigue en 5 líneas; no se pueden añadir SKU sueltos.";
});

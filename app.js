const API_BASE_URL = "http://localhost:8000";
const API_KEY = "mi-clave-secreta-123";
const outputElement = document.getElementById("response-output");

async function fetchProtectedData(method, endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: method,
            headers: {
                "x-api-key": API_KEY // El encabezado con la clave estática[cite: 1]
            }
        });

        // Manejo de errores HTTP (ej. 401 Unauthorized)[cite: 1]
        if (!response.ok) {
            outputElement.textContent = `Error: ${response.status} ${response.statusText}`;
            return;
        }

        const data = await response.json();
        outputElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        outputElement.textContent = `Network Error: ${error.message}`;
    }
}

document.getElementById("btn-get").addEventListener("click", () => {
    fetchProtectedData("GET", "/api/data");
});

document.getElementById("btn-post").addEventListener("click", () => {
    fetchProtectedData("POST", "/api/data");
});
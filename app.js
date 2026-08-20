const API_BASE_URL = "http://localhost:8000";
const outputElement = document.getElementById("response-output");
const apiKeyInput = document.getElementById("api-key-input"); // Capturamos el elemento de la casilla

async function fetchProtectedData(method, endpoint) {
    // Leemos el valor actual escrito en la casilla
    const currentApiKey = apiKeyInput.value;

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: method,
            headers: {
                "x-api-key": currentApiKey // Enviamos lo que el usuario escribió
            }
        });

        // Manejo de errores HTTP[cite: 1]
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
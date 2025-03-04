const inputQuestion = document.getElementById("inputQuestion");
const result = document.getElementById("result");

inputQuestion.addEventListener("keypress", (e) => {
    if (inputQuestion.value && e.key === "Enter")
        sendQuestion();
});

const GEMINI_API_KEY = "AIzaSyAKoWKo1_wdnHZAFhqWNHDHGwF3zpsagIw"; // Substitua pela sua chave de API

function sendQuestion() {
    var sQuestion = inputQuestion.value;

    inputQuestion.value = "Carregando...";
    inputQuestion.disabled = true;

    if (result.value) result.value += "\n\n\n";
    result.value += `Eu: ${sQuestion}`;

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + GEMINI_API_KEY, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: sQuestion }]
            }],
            generationConfig: {
                maxOutputTokens: 2048,
                temperature: 0.5,
            },
        }),
    })
    .then((response) => response.json())
    .then((json) => {
        if (result.value) result.value += "\n";

        // Verifica se há um erro na resposta
        if (json.error?.message) {
            result.value += `Error: ${json.error.message}`;
        }
        // Verifica se há uma resposta válida
        else if (json.candidates?.[0]?.content?.parts?.[0]?.text) {
            var text = json.candidates[0].content.parts[0].text || "Sem resposta";
            result.value += "Gemini: " + text;
        } else {
            result.value += "Gemini: Sem resposta";
        }

        // Rolagem automática para o final do conteúdo
        result.scrollTop = result.scrollHeight;
    })
    .catch((error) => {
        console.error("Error", error);
        result.value += "\nErro ao conectar à API do Gemini.";
    })
    .finally(() => {
        inputQuestion.value = "";
        inputQuestion.disabled = false;
        inputQuestion.focus();
    });
}
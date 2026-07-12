import axios from "axios";


const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8000";

const client = axios.create({
    baseURL: API_BASE,
    timeout: 60000,
    headers: {
        Accept: "application/json",
    },
});

client.interceptors.request.use(async (config) => {
    const openaiKey = localStorage.getItem("esillio_openai_key");
    const anthropicKey = localStorage.getItem("esillio_anthropic_key");
    const geminiKey = localStorage.getItem("esillio_gemini_key");
    const localUrl = localStorage.getItem("esillio_local_url");

    if (openaiKey) config.headers["X-OpenAI-Key"] = openaiKey;
    if (anthropicKey) config.headers["X-Anthropic-Key"] = anthropicKey;
    if (geminiKey) config.headers["X-Gemini-Key"] = geminiKey;
    if (localUrl) config.headers["X-Local-URL"] = localUrl;

    const token = localStorage.getItem("esillio_token") || "guest-token-123";
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {

        if (error.response) {

            console.error(
                "API Error:",
                error.response.data
            );

        } else {

            console.error(
                "Network Error:",
                error.message
            );

        }

        return Promise.reject(error);
    }
);

export default client;
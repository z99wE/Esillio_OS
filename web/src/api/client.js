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
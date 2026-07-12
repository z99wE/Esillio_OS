import client from "./client";

export async function getAISettings() {

    const response =
        await client.get(
            "/settings/ai"
        );

    return response.data;

}

export async function saveAISettings(data) {

    const response =
        await client.post(
            "/settings/ai",
            data
        );

    return response.data;

}
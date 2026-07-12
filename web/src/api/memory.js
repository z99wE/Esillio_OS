import client from "./client";

export async function getMemory() {

    const response =
        await client.get(
            "/memory/"
        );

    return response.data;

}

export async function resetMemory() {

    const response =
        await client.post(
            "/memory/reset"
        );

    return response.data;

}
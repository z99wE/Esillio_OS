import client from "./client";

export async function getEvents() {

    const response =
        await client.get(
            "/events/"
        );

    return response.data;

}
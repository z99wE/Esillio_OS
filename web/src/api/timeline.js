import client from "./client";

export async function getTimeline(category = null) {

    const response =
        await client.get(
            "/timeline/",
            {
                params: {
                    category,
                },
            }
        );

    return response.data;

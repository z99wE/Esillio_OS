import client from "./client";

export async function uploadDocument(file) {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response =
        await client.post(
            "/upload/",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    return response.data;

}
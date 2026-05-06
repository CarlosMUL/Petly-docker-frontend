import { API_MASCOTAS } from "../../../config/api";

export async function getMisMascotas() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_MASCOTAS}/petly/mascotas/mis-mascotas`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );


        if (!response.ok) {
            throw new Error(await response.text());
        }

        return {
            success: true,
            data: await response.json(),
        };

    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}
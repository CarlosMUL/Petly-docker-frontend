export async function registerUser(data) {
    try {

        const response = await fetch("http://localhost:8084/petly/usuarios/registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.json();

        return {
            success: true,
            data: result,
        };

    } catch (error) {

        if (error.message === "Failed to fetch") {
            console.error("Microservicio caído, ruta mal puesto o bloqueo de CORS:");
        } else {
            console.error("Error al registrar usuario:", error);
        }
        return {
            success: false,
            error: error.message,
        };
    }
}
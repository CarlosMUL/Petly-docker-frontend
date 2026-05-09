export async function loginUser(data) {
    try {
        const response = await fetch("http://localhost:8080/petly/auth/login", {
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
            data: result, // aquí debería venir el token
        };

    } catch (error) {

        if (error.message === "Failed to fetch") {
            console.error("Microservicio caído, ruta mal puesta o CORS:");
        } else {
            console.error("Error al iniciar sesión:", error);
        }

        return {
            success: false,
            error: error.message,
        };
    }
}
export async function registerService(Data) {
    try {

        const data = new FormData();
        const token = localStorage.getItem("token");

        data.append(
            "data",
            new Blob(
                [JSON.stringify({
                    chip: Data.chip,
                    nombre: Data.name,
                    sexo: Data.gender,
                    edad: Data.age,
                    tipo: Data.type,
                    color: Data.color,
                    raza: Data.breed,
                    descripcion: Data.description,
                    otroTipo: Data.otherPetType,
                })],
                { type: "application/json" }
            )
        );


        if (Data.photo) {
            data.append("file", Data.photo);
        }

        console.log("=== PAYLOAD ENVIADO ===");
        for (let [key, value] of data.entries()) {
            if (key === "data") {
                value.text().then(text => {
                    console.log(key, JSON.parse(text));
                });
            } else {
                console.log(key, value);
            }
        }

        const response = await fetch(`${import.meta.env.VITE_MASCOTAS_URL || "http://localhost:8080"}/petly/mascotas/registrar`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: data,
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
            console.error("Microservicio caído, endpoint incorrecto o CORS:");
        } else {
            console.error("Error al registrar mascota:", error);
        }

        return {
            success: false,
            error: error.message,
        };
    }
}


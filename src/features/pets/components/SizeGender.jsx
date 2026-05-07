import { GENDERS } from "../constants/constantes";
import Field from "../../../shared/components/Field";

export default function SizeGender({
    formData,
    handleChange,
    handleSelect,
    back,
    error,
}) {
    const isAgeValid = /^\d+$/.test(formData.age);
    const isStep2Valid =
        formData.chip?.trim() &&
        formData.name?.trim() &&
        formData.gender &&
        formData.color?.trim() &&
        formData.breed?.trim() &&
        formData.description?.trim() &&
        formData.age?.toString().trim() &&
        isAgeValid;

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-180px)]">

            {/* Título */}
            <div className="mb-3 shrink-0">
                <h2 className="text-1xl sm:text-3xl font-bold text-white mb-1">
                    Información de la mascota
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                    Ingrese los datos de tu mascota
                </p>
                {error && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Campos en grid de 2 columnas */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 flex-1 overflow-hidden content-start">

                {/* Chip */}
                <Field label="Identificador (Nro. Chip / Otros) *">
                    <>
                        <input
                            type="text"
                            name="chip"
                            placeholder="Ej: 123456789"
                            value={formData.chip}
                            onChange={handleChange}
                        />
                        {!formData.chip?.trim() && (
                            <p className="text-xs text-red-400 mt-0.5">Obligatorio*</p>
                        )}
                    </>
                </Field>

                {/* Nombre */}
                <Field label="Nombre *">
                    <>
                        <input
                            type="text"
                            name="name"
                            placeholder="Ej: Max, Luna, Fluffy"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {!formData.name?.trim() && (
                            <p className="text-xs text-red-400 mt-0.5">Obligatorio*</p>
                        )}
                    </>
                </Field>

                {/* Color */}
                <Field label="Color *">
                    <>
                        <input
                            type="text"
                            name="color"
                            placeholder="Ej: Negro, Blanco"
                            value={formData.color || ""}
                            onChange={handleChange}
                        />
                        {!formData.color?.trim() && (
                            <p className="text-xs text-red-400 mt-0.5">Obligatorio*</p>
                        )}
                    </>
                </Field>

                {/* Edad */}
                <Field label="Edad en años *">
                    <>
                        <input
                            type="text"
                            name="age"
                            placeholder="Ej: 1, 5, 10"
                            value={formData.age || ""}
                            onChange={handleChange}
                        />
                        {!formData.age?.trim() ? (
                            <p className="text-xs text-red-400 mt-0.5">Obligatorio*</p>
                        ) : !isAgeValid ? (
                            <p className="text-xs text-red-400 mt-0.5">Solo números*</p>
                        ):null

                        }
                    </>
                </Field>

                {/* Raza */}
                <Field label="Raza *">
                    <>
                        <input
                            type="text"
                            name="breed"
                            placeholder="Ej: Labrador, Persa"
                            value={formData.breed}
                            onChange={handleChange}
                        />
                        {!formData.breed?.trim() && (
                            <p className="text-xs text-red-400 mt-0.5">Obligatorio*</p>
                        )}
                    </>
                </Field>

                {/* Género — ocupa solo 1 columna con botones más compactos */}
                <Field label="Género *">
                    <>
                        <div className="flex gap-2">
                            {GENDERS.map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => handleSelect("gender", g)}
                                    className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-sm transition-all duration-300 border-2 cursor-pointer ${formData.gender === g
                                        ? "bg-[#369467] border-[#5DCAA5] text-white shadow-lg shadow-[#369467]/50"
                                        : "bg-white/5 border-white/20 text-gray-300 hover:border-white/40 hover:bg-white/10"
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        {!formData.gender && (
                            <p className="text-xs text-red-400 mt-0.5">Selecciona un género</p>
                        )}
                    </>
                </Field>

                {/* Descripción — ocupa las 2 columnas */}
                <div className="col-span-2">
                    <Field label="Descripción *">
                        <>
                            <input
                                className="w-full min-h-16 resize-none"
                                name="description"
                                placeholder="Cuéntanos sobre tu mascota"
                                value={formData.description || ""}
                                onChange={handleChange}
                            />
                            {!formData.description?.trim() && (
                                <p className="text-xs text-red-400 mt-0.5">Obligatorio*</p>
                            )}
                        </>
                    </Field>
                </div>

            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-8 shrink-0 py-2">
                <button
                    type="button"
                    onClick={back}
                    className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold py-2 rounded-lg transition-colors duration-300 border border-white/20 text-sm cursor-pointer"
                >
                    Volver
                </button>
                <button
                    type="submit"
                    disabled={!isStep2Valid}
                    className="flex-1 bg-[#369467] hover:bg-[#2d7a56] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors duration-300 text-sm cursor-pointer"
                >
                    Registrar
                </button>
            </div>
        </div>
    );
}
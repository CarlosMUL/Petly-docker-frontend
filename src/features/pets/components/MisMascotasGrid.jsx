import MyPetCard from "./MiMascotaCard";

export default function MisMascotasGrid({ pets = [], loading, onEdit, onDelete }) {

  if (loading) {
    return (
      <div className="text-white/40 text-center py-20">
        Cargando...
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/50 backdrop-blur-xl">
        <p className="text-lg font-semibold text-white">No tienes mascotas registradas</p>
        <p className="mt-2 text-sm">Cuando registres una mascota, aparecerá en esta página.</p>
      </div>
    );
  }

  return (
    <div className="
      w-full
      flex
      justify-center
    ">
      <div className="
        flex
        flex-wrap
        justify-center
        gap-6
        max-w-5xl
      ">
        {pets.map((pet) => (
          <MyPetCard
            key={pet.chip}
            pet={pet}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
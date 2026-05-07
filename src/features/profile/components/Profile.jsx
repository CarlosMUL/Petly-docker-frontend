import { Link } from "react-router-dom";
import { useAuth } from "../../auth/context/authContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#369467] via-[#1a412f] to-[#0a1a10] px-4 pb-12 pt-20 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl md:p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#5DCAA5]">Perfil / User</p>
          <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center">
            <img
              src="src/assets/pfp.jpg"
              alt="Avatar de usuario"
              className="h-24 w-24 rounded-full border border-white/20 object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                {user?.nombre || "Mi perfil"}
              </h1>
              <p className="mt-2 text-white/60">
                {user?.correo || "Inicia sesión para gestionar tu actividad en Petly."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <ProfileLinkCard
            title="Mis reportes"
            description="Consulta los reportes que publicaste desde tu cuenta."
            to="/mis-reportes"
            icon="📍"
            cta="Ver reportes"
          />
          <ProfileLinkCard
            title="Mis mascotas"
            description="Administra las mascotas registradas en tu perfil."
            to="/mis-mascotas"
            icon="🐾"
            cta="Ver mascotas"
          />
        </div>
      </section>
    </div>
  );
}

function ProfileLinkCard({ title, description, to, icon, cta }) {
  return (
    <Link
      to={to}
      className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[#5DCAA5]/40 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-5xl">{icon}</span>
        <span className="rounded-full border border-[#5DCAA5]/30 bg-[#5DCAA5]/10 px-3 py-1 text-xs font-semibold text-[#5DCAA5] transition group-hover:bg-[#5DCAA5]/20">
          {cta} →
        </span>
      </div>
      <h2 className="mt-8 text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-white/60">{description}</p>
    </Link>
  );
}
import { useNavigate } from "react-router-dom";

export default function AuthGuardModal({ open, onClose }) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-[#0a1a10] border border-white/10 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5">

        <button
          onClick={onClose}
          className="self-end text-white/40 hover:text-white/80 transition cursor-pointer -mt-2 -mr-2"
        >
          ✕
        </button>

        <div className="w-16 h-16 bg-[#5DCAA5]/10 border border-[#5DCAA5]/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-[#5DCAA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="text-center">
          <h2 className="text-white text-xl font-bold mb-2">¡Únete a Petly!</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Identifícate para acceder al total de funcionalidades y ayudar a las mascotas de tu comunidad.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#5DCAA5] hover:bg-[#4bb891] text-[#0a1a10] font-semibold py-2.5 rounded-xl transition cursor-pointer"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full text-white bg-white/10 hover:bg-white/20 border border-white/20 font-semibold py-2.5 rounded-xl transition cursor-pointer"
          >
            Registrarse
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../features/auth/context/authContext";
import { Link } from "react-router-dom";

export default function Header() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-black/30 backdrop-blur fixed w-full top-0 left-0 z-20 border-b border-white/10">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-1">

                {/* IZQUIERDA */}
                <div className="flex items-center">
                    <a href="/" className="flex items-center gap-2">
                        <img src="src/assets/logo.png" className="h-7" alt="Logo" />
                        <span className="text-white text-xl font-semibold">
                            Petly
                        </span>
                    </a>
                </div>

                {/* CENTRO */}
                <ul className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8 text-white">
                    <li><a className="hover:text-[#5DCAA5]" href="/">Home</a></li>
                    <li><a className="hover:text-[#5DCAA5]" href="#">Servicios</a></li>
                    <li><a className="hover:text-[#5DCAA5]" href="#">Contacto</a></li>
                </ul>

                <div className="flex justify-end gap-2">


                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menú"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* DERECHA DINÁMICO */}
                    <div className="hidden md:flex justify-end relative">

                        {!user ? (
                            <section className="flex gap-4">
                                <a
                                    className="text-white bg-white/10 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/20 hover:text-[#5DCAA5]"
                                    href="/register"
                                >
                                    Registrarse
                                </a>
                                <a
                                    className="text-white bg-white/10 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/20 hover:text-[#5DCAA5]"
                                    href="/login"
                                >
                                    Iniciar Sesión
                                </a>
                            </section>
                        ) : (
                            //LOGUEADO
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-2 text-white bg-white/10 px-3 py-2 rounded-lg border border-white/20 
               hover:bg-white/20 transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-[#5DCAA5]/50 cursor-pointer"
                                >
                                    <span className="text-sm font-medium">
                                        {user.nombre}
                                    </span>

                                    <img
                                        src={"src/assets/pfp.jpg"}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover border border-white/20"
                                    />
                                </button>

                                {/* Dropdown */}
                                <div
                                    className={`absolute right-0 mt-2 w-52 rounded-xl border border-white/10 shadow-xl z-50
                bg-black/60 backdrop-blur-lg
                transition-all duration-200 origin-top-right
                ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none "}`}
                                >

                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-white text-sm font-semibold">
                                            {user.nombre}
                                        </p>
                                        <p className="text-white/50 text-xs truncate">
                                            {user.correo}
                                        </p>
                                    </div>

                                    {/* Links */}
                                    <ul className="p-2 text-sm text-white">
                                        <li>
                                            <Link
                                                to="/agregar-mascota"
                                                className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                                            >
                                                Agregar mascota
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/perfil"
                                                className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                                            >
                                                Perfil
                                            </Link>
                                        </li>

                                         <li>
                                            <Link
                                                to="/mis-reportes"
                                                className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                                            >
                                                Mis reportes
                                            </Link>
                                        </li>
                                         <li>
                                            <Link
                                                to="/mis-mascotas"
                                                className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                                            >
                                                Mis mascotas
                                            </Link>
                                        </li>



                                        <li className="mt-1 border-t border-white/10 pt-1">
                                            <button
                                                onClick={logout}
                                                className="w-full text-left px-3 py-2 rounded-lg text-red-300 
                     hover:bg-red-500/20 transition cursor-pointer"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden bg-black/1 backdrop-blur border-t border-white/10 px-4 py-4 flex flex-col gap-4 ">
                    <ul className="flex flex-col gap-2 text-white text-sm">
                        <li><Link className="block py-2 hover:text-[#5DCAA5]" to="/">Home</Link></li>
                        <li><Link className="block py-2 hover:text-[#5DCAA5]" to="/servicios">Servicios</Link></li>
                        <li><Link className="block py-2 hover:text-[#5DCAA5]" to="/contacto">Contacto</Link></li>
                    </ul>

                    <div className="border-t border-white/10 pt-3">
                        {!user ? (
                            <div className="flex flex-col gap-2">
                                <Link className="text-center text-white bg-white/10 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/20" to="/register">
                                    Registrarse
                                </Link>
                                <Link className="text-center text-white bg-white/10 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/20" to="/login">
                                    Iniciar Sesión
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 text-sm text-white">
                                <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                                    <img src="src/assets/pfp.jpg" alt="avatar" className="w-8 h-8 rounded-full object-cover border border-white/20" />
                                    <div>
                                        <p className="font-medium">{user.nombre}</p>
                                        <p className="text-white/50 text-xs">{user.correo}</p>
                                    </div>
                                </div>
                                <Link className="py-2 hover:text-[#5DCAA5]" to="/perfil">
                                    Perfil
                                </Link>
                                <Link className="py-2 hover:text-[#5DCAA5]" to="/mis-reportes">
                                    Mis reportes
                                </Link>
                                <button onClick={logout} className="text-left py-2 text-red-300 hover:text-red-400">
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
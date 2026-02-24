"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Music, Mic2, ListMusic, Users, LogOut, Menu, X, UserCircle } from "lucide-react";

export default function Sidebar({ role }: { role: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Definimos las rutas principales
    const menuItems = [
        { name: "Hallel", href: "/dashboard", icon: Music },
        { name: "Artistas", href: "/artistas", icon: Mic2 },
        { name: "Repertorio", href: "/repertorio", icon: ListMusic },
        { name: "Mi Perfil", href: "/perfil", icon: UserCircle },
    ];

    // Si es superadmin, le agregamos la ruta de usuarios
    if (role === "superadmin") {
        menuItems.push({ name: "Administradores", href: "/usuarios", icon: Users });
    }

    return (
        <>
            {/* Botón flotante para celulares */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md shadow-lg"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Menú Lateral */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6 text-center border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-wider">Panel Admin</h1>
                    <p className="text-xs text-gray-400 mt-1">Gestión de Hallel</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)} // Cierra el menú en móviles al hacer clic
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center w-full gap-3 px-4 py-3 text-red-400 rounded-lg hover:bg-gray-800 hover:text-red-300 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Fondo oscuro para móviles cuando el menú está abierto */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                />
            )}
        </>
    );
}
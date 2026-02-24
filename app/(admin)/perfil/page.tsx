"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react"; // Agregamos useSession
import { Save, Loader2, AlertCircle, CheckCircle2, UserCircle, LogOut, Eye, EyeOff, Mail } from "lucide-react";

export default function PerfilPage() {
    // Obtenemos los datos de la sesión actual (incluyendo el correo)
    const { data: session } = useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim() && !password.trim()) {
            setError("Debes escribir un nuevo correo o una nueva contraseña para actualizar.");
            return;
        }

        if (email.trim()) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/;
            if (!emailRegex.test(email.trim())) {
                setError("Por favor, ingresa un correo electrónico válido (ejemplo: admin@dominio.com).");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const updateData: any = {};
            if (email.trim()) updateData.email = email;
            if (password.trim()) updateData.password = password;

            const response = await fetch("/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ocurrió un error al actualizar el perfil.");
            }

            setSuccess("¡Perfil actualizado correctamente!");
            setEmail("");
            setPassword("");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner">
                    <UserCircle className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Mi Perfil</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Actualiza tus credenciales de acceso al sistema.
                    </p>
                </div>
            </div>

            {/* TARJETA DE INFORMACIÓN ACTUAL */}
            {session?.user?.email && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Mail className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Correo Actual Vinculado</p>
                        <p className="font-bold text-gray-900">{session.user.email}</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3 font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-100 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3 font-bold text-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <p>{success}</p>
                    </div>
                    <p className="text-sm text-green-700 ml-9 font-medium">
                        Por seguridad, es recomendable que cierres sesión y vuelvas a entrar con tus nuevos datos.
                    </p>
                    <div className="ml-9 pt-2">
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all active:scale-95 shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión ahora
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Nuevo Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                placeholder="Deja en blanco para no cambiarlo"
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Deja en blanco para no cambiarla"
                                    minLength={6}
                                    className="appearance-none block w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 font-medium">
                                La contraseña debe tener al menos 6 caracteres. No podemos mostrar la actual por motivos de seguridad criptográfica.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting || (!email.trim() && !password.trim())}
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
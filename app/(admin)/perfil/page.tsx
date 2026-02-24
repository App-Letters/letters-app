"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Save, Loader2, AlertCircle, CheckCircle2, UserCircle, LogOut, Eye, EyeOff } from "lucide-react"; // Agregamos Eye y EyeOff

export default function PerfilPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Nuevo estado para controlar si vemos u ocultamos la contraseña
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
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <UserCircle className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Actualiza tus credenciales de acceso al sistema.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-700 p-6 rounded-lg border border-green-100 space-y-3">
                    <div className="flex items-center gap-3 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p>{success}</p>
                    </div>
                    <p className="text-sm text-green-600 ml-8">
                        Por seguridad, es recomendable que cierres sesión y vuelvas a entrar con tus nuevos datos.
                    </p>
                    <div className="ml-8 pt-2">
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión ahora
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Nuevo Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Deja en blanco para no cambiarlo"
                                className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    // Alternamos el tipo de input entre texto y contraseña
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Deja en blanco para no cambiarla"
                                    minLength={6}
                                    // pr-12 deja espacio a la derecha para que el ícono no se encime con el texto
                                    className="w-full rounded-lg border-gray-300 border px-4 py-2.5 pr-12 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                La contraseña debe tener al menos 6 caracteres.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={isSubmitting || (!email.trim() && !password.trim())}
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
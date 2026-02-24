"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Usamos signIn de NextAuth para validar las credenciales
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Correo o contraseña incorrectos.");
            setIsLoading(false);
            return;
        }

        // Si es exitoso, redirigimos al panel de administración
        router.push("/dashboard");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-full mb-4 shadow-inner">
                        <Lock className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Acceso Administrativo</h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Ingresa tus credenciales para gestionar los cantos y listas.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="appearance-none block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                                placeholder="admin@ejemplo.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Contraseña
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="appearance-none block w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-gray-900 bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors sm:text-sm"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Verificando...
                                </>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors">
                        &larr; Volver a la pantalla pública
                    </Link>
                </div>
            </div>
        </div>
    );
}
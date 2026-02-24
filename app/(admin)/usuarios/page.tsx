"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Users, AlertCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";

interface UserData {
    _id: string;
    email: string;
    role: string;
}

export default function UsuariosPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados del formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; email: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users");
            if (!response.ok) throw new Error("Error al cargar administradores");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError("No se pudieron cargar los usuarios.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al crear el usuario");
            }

            const newUser = await response.json();
            setUsers([...users, newUser]);
            setEmail("");
            setPassword("");
            setRole("admin");
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(""), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestDelete = (id: string, email: string) => {
        setItemToDelete({ id, email });
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/users/${itemToDelete.id}`, { method: "DELETE" });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al eliminar");
            }

            setUsers(users.filter((u) => u._id !== itemToDelete.id));
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.message);
            setIsModalOpen(false);
            setTimeout(() => setError(""), 5000);
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Accesos</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Administra quién tiene acceso a este panel de control.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Formulario para agregar usuario */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Invitar nuevo administrador</h2>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500"
                            required
                            minLength={6}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full rounded-lg border-gray-300 border px-4 py-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="admin">Administrador (Normal)</option>
                            <option value="superadmin">Superadmin (Total)</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <button
                            type="submit"
                            disabled={isSubmitting || !email || !password}
                            className="w-full inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            Agregar
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {users.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No hay usuarios registrados.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <li key={user._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {user.role === 'superadmin' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900 block">{user.email}</span>
                                        <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                    </div>
                                </div>

                                {/* Evitamos que el admin se borre a sí mismo en la UI */}
                                {user.email !== "pablo@admin.com" && (
                                    <button
                                        onClick={() => requestDelete(user._id, user.email)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Revocar acceso"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Revocar acceso"
                message={`¿Estás seguro de que deseas eliminar el acceso a "${itemToDelete?.email}"? Ya no podrá entrar a este panel.`}
                isLoading={isDeleting}
                onCancel={() => {
                    setIsModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
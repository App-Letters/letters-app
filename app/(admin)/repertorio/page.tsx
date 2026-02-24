"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, ListMusic, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";

// Estructura de la lista que recibimos de la base de datos
interface Playlist {
    _id: string;
    title: string;
    date: string;
    isActive: boolean;
    songs: string[]; // Por ahora solo nos interesa contar cuántos IDs hay
}

export default function RepertoriosPage() {
    // 1. TODOS LOS HOOKS HASTA ARRIBA
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados para el Modal de confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar todas las listas
    const fetchPlaylists = async () => {
        try {
            const response = await fetch("/api/playlists");
            if (!response.ok) throw new Error("Error al cargar los repertorios");

            const data = await response.json();
            setPlaylists(data);
        } catch (err) {
            setError("No se pudieron cargar los repertorios.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    // Abre el modal y guarda qué repertorio queremos borrar
    const requestDelete = (id: string, title: string) => {
        setItemToDelete({ id, title: title || "Lista sin título" });
        setIsModalOpen(true);
    };

    // Eliminar un repertorio (Ejecutado desde el Modal)
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/playlists/${itemToDelete.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar");

            setPlaylists(playlists.filter((p) => p._id !== itemToDelete.id));
            setIsModalOpen(false);
        } catch (err) {
            setError("Hubo un problema al intentar eliminar el repertorio.");
            setIsModalOpen(false);
            setTimeout(() => setError(""), 5000);
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    // Cambiar el estado Activo/Inactivo rápidamente
    const toggleActiveStatus = async (playlist: Playlist) => {
        try {
            // Recuerda: configuramos el backend para permitir múltiples listas activas
            const newStatus = !playlist.isActive;

            const response = await fetch(`/api/playlists/${playlist._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (!response.ok) throw new Error("Error al actualizar el estado");

            // Actualizamos solo la lista modificada en la interfaz visual
            setPlaylists(playlists.map(p =>
                p._id === playlist._id ? { ...p, isActive: newStatus } : p
            ));
        } catch (err) {
            setError("Error al cambiar el estado del repertorio.");
            setTimeout(() => setError(""), 5000);
        }
    };

    // 2. RETURN TEMPRANO PARA EL LOADING
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
                    <h1 className="text-2xl font-bold text-gray-900">Repertorios de la Kehila</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Arma y administra las listas de alabanzas para los servicios.
                    </p>
                </div>
                <Link
                    href="/repertorio/nuevo"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Crear Repertorio
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {playlists.length === 0 && !error ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <ListMusic className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No hay repertorios aún</h3>
                        <p className="text-gray-500 mt-1 mb-4 text-sm">
                            Crea tu primera lista para agrupar los cantos del próximo servicio.
                        </p>
                        <Link
                            href="/repertorio/nuevo"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            + Crear lista ahora
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                                    <th className="p-4">Título / Evento</th>
                                    <th className="p-4 hidden sm:table-cell">Fecha</th>
                                    <th className="p-4 text-center">Cantos</th>
                                    <th className="p-4 text-center">Estado</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {playlists.map((playlist) => (
                                    <tr key={playlist._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">
                                            {playlist.title || "Lista sin título"}
                                        </td>
                                        <td className="p-4 text-gray-500 hidden sm:table-cell text-sm">
                                            {new Date(playlist.date).toLocaleDateString("es-MX", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {playlist.songs?.length || 0} cantos
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => toggleActiveStatus(playlist)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${playlist.isActive
                                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                                    }`}
                                                title="Haz clic para cambiar el estado"
                                            >
                                                {playlist.isActive ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Activa (Pública)
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Oculta
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/repertorio/editar/${playlist._id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar repertorio"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => requestDelete(playlist._id, playlist.title)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar repertorio"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 3. MODAL AL FINAL */}
            <ConfirmModal
                isOpen={isModalOpen}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que deseas eliminar el repertorio "${itemToDelete?.title}"? Esta acción no se puede deshacer.`}
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
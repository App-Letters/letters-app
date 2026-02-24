"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2, Music, AlertCircle } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";

// Definimos la estructura de los datos que esperamos recibir
interface Song {
    _id: string;
    title: string;
    artist: { _id: string; name: string };
    createdAt: string;
}

export default function DashboardPage() {
    // 1. TODOS LOS HOOKS VAN HASTA ARRIBA
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados para el Modal de confirmación (MOVIDOS AQUÍ)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Función para cargar las canciones desde nuestra API
    const fetchSongs = async () => {
        try {
            const response = await fetch("/api/songs");
            if (!response.ok) throw new Error("Error al cargar los cantos");

            const data = await response.json();
            setSongs(data);
        } catch (err) {
            setError("No se pudieron cargar los cantos. Intenta recargar la página.");
        } finally {
            setIsLoading(false);
        }
    };

    // Se ejecuta automáticamente al abrir la página
    useEffect(() => {
        fetchSongs();
    }, []);

    // Función que solo abre el modal y guarda qué canto queremos borrar
    const requestDelete = (id: string, title: string) => {
        setItemToDelete({ id, title });
        setIsModalOpen(true);
    };

    // Función que realmente borra cuando el usuario dice "Sí" en el modal
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/songs/${itemToDelete.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar");

            setSongs(songs.filter((song) => song._id !== itemToDelete.id));
            setIsModalOpen(false); // Cerramos el modal al terminar
        } catch (err) {
            setError("Hubo un problema al intentar eliminar el canto.");
            setTimeout(() => setError(""), 5000);
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    // 2. AHORA SÍ, LOS RETURNS TEMPRANOS
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // 3. EL RENDERIZADO PRINCIPAL
    return (
        <div className="space-y-6">
            {/* Encabezado de la página */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Catálogo de Hallel</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Administra todo el repertorio musical para los servicios.
                    </p>
                </div>
                <Link
                    href="/dashboard/nuevo"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Hallel
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Tabla de Cantos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {songs.length === 0 && !error ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Music className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No hay cantos registrados</h3>
                        <p className="text-gray-500 mt-1 mb-4 text-sm">
                            Comienza agregando tu primer canto al repertorio.
                        </p>
                        <Link
                            href="/dashboard/nuevo"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            + Agregar un canto ahora
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                                    <th className="p-4">Título</th>
                                    <th className="p-4">Artista / Autor</th>
                                    <th className="p-4 hidden md:table-cell">Fecha de registro</th>
                                    <th className="p-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {songs.map((song) => (
                                    <tr key={song._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{song.title}</td>
                                        <td className="p-4 text-gray-600">
                                            {/* Aquí leemos el nombre del artista poblado */}
                                            {song.artist?.name || "Desconocido"}
                                        </td>
                                        <td className="p-4 text-gray-500 hidden md:table-cell text-sm">
                                            {new Date(song.createdAt).toLocaleDateString("es-MX", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/editar/${song._id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar canto"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>

                                                <button
                                                    onClick={() => requestDelete(song._id, song.title)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar canto"
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

            <ConfirmModal
                isOpen={isModalOpen}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que deseas eliminar el canto "${itemToDelete?.title}"? Esta acción no se puede deshacer.`}
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
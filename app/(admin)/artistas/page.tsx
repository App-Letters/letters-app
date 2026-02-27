"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Mic2, AlertCircle, Check, X } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";

interface Artist {
    _id: string;
    name: string;
}

export default function ArtistasPage() {
    // 1. TODOS LOS HOOKS HASTA ARRIBA
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Estados para crear un nuevo artista
    const [newArtistName, setNewArtistName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para editar un artista existente
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    // Estados para el Modal de confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Cargar artistas
    const fetchArtists = async () => {
        try {
            const response = await fetch("/api/artists");
            if (!response.ok) throw new Error("Error al cargar los artistas");
            const data = await response.json();
            setArtists(data);
        } catch (err) {
            setError("No se pudieron cargar los artistas.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    // Crear artista
    const handleAddArtist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newArtistName.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/artists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newArtistName }),
            });

            if (!response.ok) throw new Error("Error al crear");

            const newArtist = await response.json();
            setArtists([newArtist, ...artists]); // Lo agregamos al inicio de la lista visual
            setNewArtistName(""); // Limpiamos el input
        } catch (err) {
            setError("Hubo un problema al registrar el artista.");
            setTimeout(() => setError(""), 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Abre el modal y guarda qué artista queremos borrar
    const requestDelete = (id: string, name: string) => {
        setItemToDelete({ id, name });
        setIsModalOpen(true);
    };

    // Eliminar artista (Ejecutado desde el Modal)
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/artists/${itemToDelete.id}`, { method: "DELETE" });

            // Si la respuesta no es OK (por ejemplo, nuestro error 400 por tener cantos)
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error desconocido al eliminar");
            }

            setArtists(artists.filter((artist) => artist._id !== itemToDelete.id));
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.message);
            setIsModalOpen(false); // Cerramos el modal para mostrar el error en la pantalla principal
            setTimeout(() => setError(""), 5000);
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    // Guardar edición
    const handleSaveEdit = async (id: string) => {
        if (!editName.trim()) return;

        try {
            const response = await fetch(`/api/artists/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName }),
            });

            if (!response.ok) throw new Error("Error al editar");

            const updatedArtist = await response.json();
            setArtists(artists.map((a) => (a._id === id ? updatedArtist : a)));
            setEditingId(null); // Salimos del modo edición
        } catch (err) {
            setError("Hubo un error al actualizar el nombre.");
            setTimeout(() => setError(""), 5000);
        }
    };

    // Iniciar edición
    const startEditing = (artist: Artist) => {
        setEditingId(artist._id);
        setEditName(artist.name);
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
                    <h1 className="text-2xl font-bold text-gray-900">Autores e Intérpretes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Registra a los cantantes o bandas antes de agregar sus canciones.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {/* Formulario para agregar un nuevo artista */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Agregar nuevo autor</h2>
                <form onSubmit={handleAddArtist} className="flex gap-3">
                    <input
                        type="text"
                        value={newArtistName}
                        onChange={(e) => setNewArtistName(e.target.value)}
                        placeholder="Ej. Joshua Aaron"
                        // FIX APLICADO: text-gray-900 bg-white placeholder:text-gray-400
                        className="flex-1 rounded-lg border-gray-300 border px-4 py-2 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newArtistName.trim()}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        Guardar
                    </button>
                </form>
            </div>

            {/* Lista de Artistas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {artists.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Mic2 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No hay autores registrados</h3>
                        <p className="text-gray-500 mt-1">Usa el formulario de arriba para agregar el primero.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {artists.map((artist) => (
                            <li key={artist._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                                {/* Si estamos editando este artista, mostramos un input */}
                                {editingId === artist._id ? (
                                    <div className="flex items-center gap-3 flex-1 mr-4">
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            // FIX APLICADO: text-gray-900 bg-white placeholder:text-gray-400
                                            className="flex-1 rounded-md border-gray-300 border px-3 py-1 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleSaveEdit(artist._id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                            title="Guardar"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                                            title="Cancelar"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    /* Modo lectura normal */
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {artist.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">{artist.name}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => startEditing(artist)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar autor"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => requestDelete(artist._id, artist.name)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar autor"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 3. MODAL AL FINAL */}
            <ConfirmModal
                isOpen={isModalOpen}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que deseas eliminar al autor "${itemToDelete?.name}"?`}
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
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertCircle, Search, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface Song {
    _id: string;
    title: string;
    artist: { _id: string; name: string };
}

export default function EditarRepertorioPage() {
    const router = useRouter();
    const params = useParams();
    const playlistId = params.id as string;

    // Estados del formulario general
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Estados de las canciones
    const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

    // Estados del buscador y cargas
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    // 1. Cargar los datos del repertorio Y el catálogo de cantos
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtenemos todas las canciones
                const songsRes = await fetch("/api/songs");
                if (!songsRes.ok) throw new Error("Error al cargar el catálogo");
                const allSongs = await songsRes.json();
                setAvailableSongs(allSongs);

                // Obtenemos el repertorio específico
                const playlistRes = await fetch(`/api/playlists/${playlistId}`);
                if (!playlistRes.ok) throw new Error("No se encontró el repertorio");
                const playlistData = await playlistRes.json();

                // Llenamos el formulario
                setTitle(playlistData.title);
                setIsActive(playlistData.isActive);

                // Formateamos la fecha para que el input type="date" la acepte (YYYY-MM-DD)
                const dateObj = new Date(playlistData.date);
                setDate(dateObj.toISOString().split('T')[0]);

                // Las canciones ya vienen "pobladas" desde el backend con título y artista
                if (playlistData.songs) {
                    setSelectedSongs(playlistData.songs);
                }

            } catch (err: any) {
                setError(err.message || "Ocurrió un error al cargar la información.");
            } finally {
                setIsLoading(false);
            }
        };

        if (playlistId) fetchData();
    }, [playlistId]);

    // Cerrar buscador al dar clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtrar canciones por título o por nombre del artista (ocultando las ya seleccionadas)
    const filteredSongs = availableSongs.filter(song => {
        const searchLower = searchTerm.toLowerCase();

        // 1. ¿El término de búsqueda está en el título?
        const matchesTitle = song.title.toLowerCase().includes(searchLower);

        // 2. ¿El término de búsqueda está en el nombre del artista? 
        const matchesArtist = song.artist?.name?.toLowerCase().includes(searchLower) || false;

        // Si coincide con cualquiera de los dos, es un resultado válido
        const matchesSearch = matchesTitle || matchesArtist;

        // 3. Verificamos que no esté ya en la lista
        const isAlreadySelected = selectedSongs.some(selected => selected._id === song._id);

        return matchesSearch && !isAlreadySelected;
    });

    const handleAddSong = (song: Song) => {
        setSelectedSongs([...selectedSongs, song]);
        setSearchTerm("");
        setIsDropdownOpen(false);
        document.getElementById("song-search")?.focus();
    };

    const handleRemoveSong = (songId: string) => {
        setSelectedSongs(selectedSongs.filter(song => song._id !== songId));
    };

    const moveSong = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === selectedSongs.length - 1) return;

        const newSongs = [...selectedSongs];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSongs[index], newSongs[swapIndex]] = [newSongs[swapIndex], newSongs[index]];
        setSelectedSongs(newSongs);
    };

    // Enviar actualización
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title || !date) {
            setError("Por favor completa el título y la fecha del evento.");
            return;
        }

        if (selectedSongs.length === 0) {
            setError("Debes dejar al menos un canto en el repertorio.");
            return;
        }

        setIsSubmitting(true);

        try {
            const songIds = selectedSongs.map(song => song._id);

            // Usamos PUT en lugar de POST
            const response = await fetch(`/api/playlists/${playlistId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    date,
                    isActive,
                    songs: songIds,
                }),
            });

            if (!response.ok) throw new Error("Ocurrió un error al actualizar el repertorio.");

            router.push("/repertorio");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Cargando repertorio...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/repertorio"
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Editar Repertorio</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Modifica la lista de alabanzas o detalles del evento.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUMNA IZQUIERDA */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">
                            Detalles del evento
                        </h2>

                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Título / Nombre
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                // FIX APLICADO AQUÍ
                                className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                Fecha del evento
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                // FIX APLICADO AQUÍ
                                className="w-full rounded-lg border-gray-300 border px-4 py-2.5 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="space-y-3 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <div>
                                    <span className="block text-sm font-medium text-gray-900">
                                        Marcar como "Lista Activa"
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
                            <span>Cantos del Repertorio</span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                {selectedSongs.length} en la lista
                            </span>
                        </h2>

                        <div className="space-y-2 relative mb-6" ref={dropdownRef}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="song-search"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    placeholder="Buscar cantos para agregar..."
                                    // FIX APLICADO AQUÍ (Mantenemos bg-gray-50 original del buscador pero forzamos el texto)
                                    className="w-full rounded-lg border-gray-300 border pl-10 pr-4 py-3 text-gray-900 bg-gray-50 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                                />
                            </div>

                            {isDropdownOpen && searchTerm.trim() !== "" && (
                                <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto">
                                    {filteredSongs.length > 0 ? (
                                        <ul className="py-2">
                                            {filteredSongs.map((song) => (
                                                <li
                                                    key={song._id}
                                                    onClick={() => handleAddSong(song)}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group border-b border-gray-50 last:border-0"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                                                            {song.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {song.artist?.name || "Autor desconocido"}
                                                        </p>
                                                    </div>
                                                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-6 text-sm text-gray-500 text-center">
                                            No se encontraron cantos con ese nombre.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                                {selectedSongs.map((song, index) => (
                                    <li key={song._id} className="bg-white flex items-center p-3 hover:bg-gray-50 transition-colors group">
                                        <div className="flex flex-col items-center mr-3 text-gray-300">
                                            <button
                                                type="button"
                                                onClick={() => moveSong(index, 'up')}
                                                disabled={index === 0}
                                                className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <span className="text-xs font-medium text-gray-400 my-0.5">{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => moveSong(index, 'down')}
                                                disabled={index === selectedSongs.length - 1}
                                                className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-300"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">{song.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{song.artist?.name}</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSong(song._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-6 mt-auto flex justify-end border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedSongs.length === 0}
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Actualizar Repertorio
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertCircle, Search, Plus, Trash2, Music, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

interface Song {
    _id: string;
    title: string;
    artist: { _id: string; name: string };
}

export default function NuevoRepertorioPage() {
    const router = useRouter();

    // Estados del formulario general
    const [title, setTitle] = useState("");
    // Por defecto, ponemos la fecha de hoy
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isActive, setIsActive] = useState(true);

    // Estados de las canciones
    const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

    // Estados del buscador
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoadingSongs, setIsLoadingSongs] = useState(true);

    // Estados de carga y error
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    // 1. Cargar todas las canciones disponibles al inicio
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch("/api/songs");
                if (!response.ok) throw new Error("Error al cargar los cantos");
                const data = await response.json();
                setAvailableSongs(data);
            } catch (err) {
                setError("No se pudo cargar la lista de cantos.");
            } finally {
                setIsLoadingSongs(false);
            }
        };
        fetchSongs();
    }, []);

    // 2. Cerrar el buscador al hacer clic afuera
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
        // (Usamos song.artist?.name por si algún canto llegara a tener el artista vacío por error en la BD)
        const matchesArtist = song.artist?.name?.toLowerCase().includes(searchLower) || false;

        // Si coincide con cualquiera de los dos, es un resultado válido
        const matchesSearch = matchesTitle || matchesArtist;

        // 3. Verificamos que no esté ya en la lista
        const isAlreadySelected = selectedSongs.some(selected => selected._id === song._id);

        return matchesSearch && !isAlreadySelected;
    });

    // 4. Agregar canción a la lista
    const handleAddSong = (song: Song) => {
        setSelectedSongs([...selectedSongs, song]);
        setSearchTerm(""); // Limpiamos el buscador para la siguiente canción
        setIsDropdownOpen(false);
        // Regresamos el foco al input para buscar otra rápido (opcional)
        document.getElementById("song-search")?.focus();
    };

    // 5. Quitar canción de la lista
    const handleRemoveSong = (songId: string) => {
        setSelectedSongs(selectedSongs.filter(song => song._id !== songId));
    };

    // 6. Mover canción hacia arriba o abajo en la lista
    const moveSong = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === selectedSongs.length - 1) return;

        const newSongs = [...selectedSongs];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Intercambiamos posiciones
        [newSongs[index], newSongs[swapIndex]] = [newSongs[swapIndex], newSongs[index]];
        setSelectedSongs(newSongs);
    };

    // 7. Enviar formulario a la base de datos
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title || !date) {
            setError("Por favor completa el título y la fecha del evento.");
            return;
        }

        if (selectedSongs.length === 0) {
            setError("Debes agregar al menos un canto al repertorio.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Extraemos solo los IDs de las canciones seleccionadas para guardarlos
            const songIds = selectedSongs.map(song => song._id);

            const response = await fetch("/api/playlists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    date,
                    isActive,
                    songs: songIds,
                }),
            });

            if (!response.ok) throw new Error("Ocurrió un error al guardar el repertorio.");

            router.push("/repertorio");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

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
                    <h1 className="text-2xl font-bold text-gray-900">Crear Repertorio</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Prepara la lista de alabanzas para el próximo servicio o evento.
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

                {/* COLUMNA IZQUIERDA: Detalles del Evento */}
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
                                placeholder="Ej. Shabat, Reunión de Jóvenes..."
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
                                    <span className="block text-xs text-gray-500 mt-0.5">
                                        Se mostrará inmediatamente a los hermanos en la pantalla principal.
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Buscador y Lista de Cantos */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
                        <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
                            <span>Cantos del Repertorio</span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                {selectedSongs.length} en la lista
                            </span>
                        </h2>

                        {/* Buscador Interactivo de Cantos */}
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
                                    placeholder={isLoadingSongs ? "Cargando catálogo..." : "Buscar por título de canto..."}
                                    // FIX APLICADO AQUÍ (Forzamos texto oscuro y mantenemos su diseño original)
                                    className="w-full rounded-lg border-gray-300 border pl-10 pr-4 py-3 text-gray-900 bg-gray-50 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                                    disabled={isLoadingSongs}
                                />
                            </div>

                            {/* Menú desplegable de resultados */}
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
                                            No se encontraron cantos disponibles con ese nombre.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Lista visual de canciones seleccionadas */}
                        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            {selectedSongs.length === 0 ? (
                                <div className="h-full min-h-[200px] flex flex-col items-center justify-center p-8 text-center">
                                    <Music className="w-12 h-12 text-gray-300 mb-3" />
                                    <p className="text-sm font-medium text-gray-900">Tu repertorio está vacío</p>
                                    <p className="text-xs text-gray-500 mt-1 max-w-xs">
                                        Usa el buscador de arriba para encontrar y agregar cantos al servicio.
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                                    {selectedSongs.map((song, index) => (
                                        <li key={song._id} className="bg-white flex items-center p-3 hover:bg-gray-50 transition-colors group">

                                            {/* Botones para subir/bajar posición */}
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
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    {song.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {song.artist?.name || "Autor desconocido"}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSong(song._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                                                title="Quitar de la lista"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Botón de Guardar en la parte inferior */}
                        <div className="pt-6 mt-auto flex items-center justify-end border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isSubmitting || selectedSongs.length === 0}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Guardando Repertorio...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Guardar Repertorio ({selectedSongs.length} cantos)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}
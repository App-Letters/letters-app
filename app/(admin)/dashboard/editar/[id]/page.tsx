"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertCircle, Search, Plus } from "lucide-react";

interface Artist {
    _id: string;
    name: string;
}

export default function EditarCantoPage() {
    const router = useRouter();
    const params = useParams();
    const songId = params.id as string;

    // Estados del formulario general
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [artistId, setArtistId] = useState("");
    const [tone, setTone] = useState(""); // <-- NUEVO ESTADO PARA EL TONO

    // Estados para el buscador interactivo de artistas
    const [artists, setArtists] = useState<Artist[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCreatingArtist, setIsCreatingArtist] = useState(false);

    // Estados de carga y error
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cargar los artistas y la canción a editar al inicio
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Cargamos la lista de artistas
                const artistsRes = await fetch("/api/artists");
                if (!artistsRes.ok) throw new Error("Error al cargar los artistas");
                const artistsData = await artistsRes.json();
                setArtists(artistsData);

                // 2. Cargamos los datos de la canción específica
                const songRes = await fetch(`/api/songs/${songId}`);
                if (!songRes.ok) throw new Error("No se encontró el canto solicitado");
                const songData = await songRes.json();

                // 3. Llenamos el formulario con los datos existentes
                setTitle(songData.title);
                setLyrics(songData.lyrics);
                if (songData.tone) setTone(songData.tone); // <-- CARGAMOS EL TONO GUARDADO

                // Como hicimos un .populate('artist') en el backend, artist viene como objeto
                if (songData.artist) {
                    setArtistId(songData.artist._id);
                    setSearchTerm(songData.artist.name);
                }
            } catch (err: any) {
                setError(err.message || "Ocurrió un error al cargar la información.");
            } finally {
                setIsLoading(false);
            }
        };

        if (songId) {
            fetchData();
        }
    }, [songId]);

    // Cerrar el buscador si el usuario hace clic afuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                if (!artistId) {
                    setSearchTerm("");
                } else {
                    const selected = artists.find(a => a._id === artistId);
                    if (selected) setSearchTerm(selected.name);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [artistId, artists]);

    // Filtrar artistas
    const filteredArtists = artists.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exactMatch = artists.find(
        artist => artist.name.toLowerCase() === searchTerm.toLowerCase().trim()
    );

    const handleSelectArtist = (artist: Artist) => {
        setArtistId(artist._id);
        setSearchTerm(artist.name);
        setIsDropdownOpen(false);
    };

    const handleCreateArtist = async () => {
        const newName = searchTerm.trim();
        if (!newName) return;

        setIsCreatingArtist(true);
        try {
            const response = await fetch("/api/artists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) throw new Error("Error al crear el autor");

            const newArtist = await response.json();
            setArtists([...artists, newArtist]);
            setArtistId(newArtist._id);
            setSearchTerm(newArtist.name);
            setIsDropdownOpen(false);
        } catch (err) {
            alert("Hubo un problema al registrar el nuevo autor.");
        } finally {
            setIsCreatingArtist(false);
        }
    };

    // Enviar el formulario para ACTUALIZAR
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title || !artistId || !lyrics) {
            setError("Por favor completa todos los campos y asegúrate de seleccionar un autor.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Usamos el método PUT para actualizar en lugar de POST
            const response = await fetch(`/api/songs/${songId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    artist: artistId,
                    lyrics,
                    tone, // <-- ENVIAMOS EL TONO ACTUALIZADO AL BACKEND
                }),
            });

            if (!response.ok) throw new Error("Ocurrió un error al actualizar el canto.");

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Cargando datos del canto...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard"
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Editar Canto</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Modifica la letra, el autor, el título o el tono de la canción.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Fila del Título ocupa todo el ancho */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Título del Canto
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Buscador Interactivo de Artistas */}
                        <div className="space-y-2 relative" ref={dropdownRef}>
                            <label className="block text-sm font-medium text-gray-700">
                                Autor / Intérprete
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setArtistId("");
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    className="w-full rounded-lg border-gray-300 border pl-10 pr-4 py-2.5 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {isDropdownOpen && (
                                <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                                    {filteredArtists.length > 0 ? (
                                        <ul className="py-1">
                                            {filteredArtists.map((artist) => (
                                                <li
                                                    key={artist._id}
                                                    onClick={() => handleSelectArtist(artist)}
                                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between"
                                                >
                                                    {artist.name}
                                                    {artistId === artist._id && (
                                                        <span className="text-blue-600 text-xs font-medium">Seleccionado</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center border-b border-gray-50">
                                            No se encontraron autores.
                                        </div>
                                    )}

                                    {searchTerm.trim() !== "" && !exactMatch && (
                                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={handleCreateArtist}
                                                disabled={isCreatingArtist}
                                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50"
                                            >
                                                {isCreatingArtist ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                                Agregar "{searchTerm}"
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Campo Tono */}
                        <div className="space-y-2">
                            <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                                Tono (Opcional)
                            </label>
                            <input
                                id="tone"
                                type="text"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                placeholder="Ej. Bm, G, F#m"
                                className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-1">
                            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700">
                                Letra completa
                            </label>
                            <span className="text-xs text-gray-500">
                                Opcional: Escribe los acordes entre corchetes [ ] antes de la sílaba.
                            </span>
                        </div>
                        <textarea
                            id="lyrics"
                            value={lyrics}
                            onChange={(e) => setLyrics(e.target.value)}
                            placeholder={"Escribe o pega la letra aquí...\n\nEjemplo de formato con acordes:\n[G]Bendice a [C]Israel alma [G]mía\n[G]Y YHWH te [C]dará de Su [D]bien\n[G]Bendice a [C]Israel alma [Em]mía [D] [C]\n[Am]No te olvides de [D]Jerusa[G]lén"}
                            rows={12}
                            className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:ring-blue-500 focus:border-blue-500 resize-y"
                            required
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                        <Link
                            href="/dashboard"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || !artistId}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Actualizar Canto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
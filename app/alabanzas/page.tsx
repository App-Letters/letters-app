"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Music, ChevronRight, BookOpen, Sun, Moon, Search, Library, Play } from "lucide-react";

interface Song {
    _id: string;
    title: string;
    artist: { _id: string; name: string };
}

export default function AlabanzasPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleDarkMode = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    };

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch("/api/songs");
                if (!response.ok) throw new Error("Error al cargar las alabanzas");
                const data: Song[] = await response.json();

                // Ordenar alfabéticamente por título para que el catálogo tenga sentido
                const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
                setSongs(sortedData);

            } catch (err) {
                setError("No pudimos cargar el catálogo. Intenta recargar la página.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const normalizeText = (text: string) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredSongs = songs.filter(song => {
        const search = normalizeText(searchQuery);
        const titleMatch = normalizeText(song.title).includes(search);
        const artistMatch = song.artist?.name ? normalizeText(song.artist.name).includes(search) : false;
        return titleMatch || artistMatch;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="font-medium animate-pulse tracking-wide text-gray-500 dark:text-slate-400">
                    Cargando catálogo...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pb-12">
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-500">
                        <BookOpen className="w-6 h-6" />
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Hallel Kehila</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <div className="w-px h-6 bg-gray-200 dark:bg-slate-700"></div>
                        <Link href="/login" className="text-sm font-bold text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Admin
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10 space-y-10">

                {/* Menú de Navegación Público */}
                <div className="flex justify-center">
                    <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 inline-flex transition-colors">
                        <Link href="/" className="px-6 py-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
                            Repertorios
                        </Link>
                        <div className="px-6 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm transition-colors">
                            Alabanzas
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
                        Alabanzas Disponibles
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-slate-400 transition-colors">
                        Explora la biblioteca completa de cantos.
                    </p>
                </div>

                {/* --- Buscador Premium --- */}
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400 dark:text-slate-500" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por título o autor..."
                        className="block w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-lg text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-md hover:shadow-lg placeholder-gray-400 dark:placeholder-slate-500 outline-none"
                    />
                </div>
                {/* ------------------------ */}

                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-100 dark:border-red-900/50">
                        <p className="font-medium">{error}</p>
                    </div>
                ) : filteredSongs.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center flex flex-col items-center transition-colors">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Library className="w-10 h-10 text-gray-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron resultados</h3>
                        <p className="text-gray-500 dark:text-slate-400">
                            Intenta buscar con otras palabras.
                        </p>
                    </div>
                ) : (
                    <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300">

                        <div className="bg-gray-50 dark:bg-slate-800/50 px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center transition-colors">
                            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
                                {filteredSongs.length} Cantos encontrados
                            </span>
                        </div>

                        {/* --- LISTA DE CANCIONES --- */}
                        <ul className="divide-y divide-gray-50 dark:divide-slate-800/50">
                            {filteredSongs.map((song) => (
                                <li key={song._id} className="group">
                                    <Link href={`/canto/${song._id}`} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4 sm:gap-6">

                                            {/* Ícono Musical / Botón Play al hacer hover */}
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                <Music className="w-5 h-5 group-hover:hidden transition-all" />
                                                <Play className="w-5 h-5 hidden group-hover:block transition-all ml-0.5" fill="currentColor" />
                                            </div>

                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-100 text-base sm:text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {song.title}
                                                </p>
                                                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 mt-0.5 transition-colors">
                                                    {song.artist?.name || "Autor desconocido"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Flecha indicadora (Oculta por defecto, aparece al hover) */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </div>
    );
}
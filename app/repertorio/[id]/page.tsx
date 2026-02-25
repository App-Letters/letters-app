"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Music, Calendar, ChevronRight, ArrowLeft, Play } from "lucide-react";
import Footer from "../../../components/shared/Footer";

interface Song {
    _id: string;
    title: string;
    artist: { _id: string; name: string };
}

interface Playlist {
    _id: string;
    title: string;
    date: string;
    songs: Song[];
}

export default function RepertorioDetallePage() {
    const params = useParams();
    const playlistId = params.id as string;

    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`/api/playlists/${playlistId}`);
                if (!response.ok) throw new Error("No se pudo cargar el repertorio");
                const data = await response.json();
                setPlaylist(data);
            } catch (err: any) {
                setError("Repertorio no encontrado o no disponible.");
            } finally {
                setIsLoading(false);
            }
        };

        if (playlistId) fetchPlaylist();
    }, [playlistId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="font-medium animate-pulse tracking-wide text-gray-500 dark:text-slate-400">Abriendo repertorio...</p>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950">
                <p className="text-red-500 font-bold">{error}</p>
                <Link href="/" className="mt-4 text-blue-600 hover:underline">Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pb-12 flex flex-col">

            {/* HEADER DE NAVEGACIÓN */}
            <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-bold bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Volver al inicio
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 space-y-8 flex-grow w-full">

                {/* --- ENCABEZADO ESTILO APPLE MUSIC --- */}
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-xl">

                    {/* Luces de fondo (Glassmorfismo) */}
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm mb-4">
                                {playlist.title}
                            </h1>
                            <div className="flex items-center gap-2 text-blue-100 font-medium">
                                <Calendar className="w-5 h-5 opacity-80" />
                                {new Date(playlist.date).toLocaleDateString("es-MX", {
                                    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
                                }).replace(/^\w/, (c) => c.toUpperCase())}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                            {/* Píldora de cantos */}
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full inline-flex items-center text-sm font-bold border border-white/20 shadow-sm">
                                <Music className="w-4 h-4 mr-2 opacity-80" />
                                {playlist.songs.length} cantos
                            </div>

                            {/* Botón flotante grande de Play */}
                            <button className="hidden sm:flex w-14 h-14 rounded-full bg-white text-blue-600 items-center justify-center shadow-lg hover:scale-105 hover:bg-blue-50 transition-all active:scale-95 cursor-default">
                                <Play className="w-6 h-6 ml-1" fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* ------------------------------------------- */}

                <section className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <ul className="divide-y divide-gray-50 dark:divide-slate-800/50">
                        {playlist.songs.map((song, index) => {
                            if (!song || !song._id) return null;
                            return (
                                <li key={song._id} className="group">
                                    <Link href={`/canto/${song._id}?playlist=${playlist._id}`} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4 sm:gap-6">

                                            {/* Número / Ícono de Play interactivo */}
                                            <div className="w-6 sm:w-8 flex justify-center text-gray-400 dark:text-slate-500">
                                                <span className="text-base sm:text-lg font-bold group-hover:hidden transition-all">
                                                    {index + 1}
                                                </span>
                                                <Play className="w-5 h-5 text-blue-600 dark:text-blue-400 hidden group-hover:block transition-all" fill="currentColor" />
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

                                        {/* Flecha sutil que aparece al hacer hover */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>

            </main>
            <Footer />
        </div>
    );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ZoomIn, ZoomOut, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Song {
    _id: string;
    title: string;
    lyrics: string;
    artist: { _id: string; name: string };
}

// Creamos un componente interno para que Next.js nos permita usar useSearchParams sin errores
function CantoContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const id = params.id as string;
    // Leemos si venimos de un repertorio en específico
    const playlistId = searchParams.get("playlist");

    const [song, setSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [fontSize, setFontSize] = useState(18);

    // Nuevos estados para la navegación del repertorio
    const [prevSongId, setPrevSongId] = useState<string | null>(null);
    const [nextSongId, setNextSongId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Cargar la canción actual
                const response = await fetch(`/api/songs/${id}`);
                if (!response.ok) throw new Error("No se pudo cargar el canto.");
                const data = await response.json();
                setSong(data);

                // 2. Si entramos desde un repertorio, buscamos a sus "vecinos"
                if (playlistId) {
                    const plRes = await fetch(`/api/playlists/${playlistId}`);
                    if (plRes.ok) {
                        const plData = await plRes.json();
                        if (plData.songs) {
                            // Buscamos en qué posición (índice) está la canción actual en la lista
                            const currentIndex = plData.songs.findIndex((s: any) => s._id === id);

                            // Si no es la primera, hay una anterior
                            if (currentIndex > 0) {
                                setPrevSongId(plData.songs[currentIndex - 1]._id);
                            } else {
                                setPrevSongId(null);
                            }

                            // Si no es la última, hay una siguiente
                            if (currentIndex >= 0 && currentIndex < plData.songs.length - 1) {
                                setNextSongId(plData.songs[currentIndex + 1]._id);
                            } else {
                                setNextSongId(null);
                            }
                        }
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, playlistId]);

    const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 40));
    const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 14));

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Abriendo letra...</p>
            </div>
        );
    }

    if (error || !song) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 max-w-md w-full">
                    <AlertCircle className="w-10 h-10 mx-auto mb-3 text-red-500" />
                    <p className="font-medium text-lg">{error || "Canto no encontrado"}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full font-medium shadow-sm"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium bg-gray-50 px-3 sm:px-4 py-2 rounded-lg active:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Lista</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* NUEVO: Controles de Anterior / Siguiente */}
                        {playlistId && (
                            <div className="flex items-center bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-inner">
                                <Link
                                    href={prevSongId ? `/canto/${prevSongId}?playlist=${playlistId}` : '#'}
                                    className={`p-1.5 sm:p-2 rounded-md transition-all ${prevSongId ? 'text-gray-700 hover:text-blue-600 hover:bg-white shadow-sm' : 'text-gray-300 pointer-events-none'}`}
                                    title="Canto anterior"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div className="w-px h-5 bg-gray-200 mx-1"></div>
                                <Link
                                    href={nextSongId ? `/canto/${nextSongId}?playlist=${playlistId}` : '#'}
                                    className={`p-1.5 sm:p-2 rounded-md transition-all ${nextSongId ? 'text-gray-700 hover:text-blue-600 hover:bg-white shadow-sm' : 'text-gray-300 pointer-events-none'}`}
                                    title="Siguiente canto"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        )}

                        {/* Controles de tamaño de letra */}
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-inner hidden sm:flex">
                            <button
                                onClick={decreaseFont}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-all disabled:opacity-30 active:scale-95"
                                disabled={fontSize <= 14}
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <span className="text-xs font-bold text-gray-400 px-2 min-w-[3ch] text-center select-none">
                                {fontSize}
                            </span>
                            <button
                                onClick={increaseFont}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-all disabled:opacity-30 active:scale-95"
                                disabled={fontSize >= 40}
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                        </div>

                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-32">
                <div className="text-center mb-10 sm:mb-14 border-b border-gray-100 pb-8">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                        {song.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-blue-600 font-medium">
                        {song.artist?.name || "Autor desconocido"}
                    </p>
                </div>

                <div
                    className="text-gray-800 leading-relaxed font-medium mx-auto max-w-2xl text-center sm:text-left transition-all duration-200"
                    style={{
                        fontSize: `${fontSize}px`,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word"
                    }}
                >
                    {song.lyrics}
                </div>

                {/* Controles de letra extra para celular (los ponemos al final del canto para mejor accesibilidad) */}
                <div className="mt-16 sm:hidden flex justify-center items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tamaño de Letra</span>
                    <div className="flex items-center gap-2">
                        <button onClick={decreaseFont} disabled={fontSize <= 14} className="p-2 bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"><ZoomOut className="w-5 h-5" /></button>
                        <button onClick={increaseFont} disabled={fontSize >= 40} className="p-2 bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 disabled:opacity-50"><ZoomIn className="w-5 h-5" /></button>
                    </div>
                </div>

            </main>
        </div>
    );
}

// Exportación principal envuelta en Suspense (Requisito de Next.js)
export default function CantoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            </div>
        }>
            <CantoContent />
        </Suspense>
    );
}
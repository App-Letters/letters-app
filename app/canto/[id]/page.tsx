"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, ZoomIn, ZoomOut, AlertCircle, ChevronLeft, ChevronRight, Music } from "lucide-react";

interface Song {
    _id: string;
    title: string;
    lyrics: string;
    artist: { _id: string; name: string };
}

function CantoContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const playlistId = searchParams.get("playlist");

    const [song, setSong] = useState<Song | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [fontSize, setFontSize] = useState(20);

    const [prevSongId, setPrevSongId] = useState<string | null>(null);
    const [nextSongId, setNextSongId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/songs/${id}`);
                if (!response.ok) throw new Error("No se pudo cargar el canto.");
                const data = await response.json();
                setSong(data);

                if (playlistId) {
                    const plRes = await fetch(`/api/playlists/${playlistId}`);
                    if (plRes.ok) {
                        const plData = await plRes.json();
                        if (plData.songs) {
                            const currentIndex = plData.songs.findIndex((s: any) => s._id === id);
                            if (currentIndex > 0) setPrevSongId(plData.songs[currentIndex - 1]._id);
                            else setPrevSongId(null);

                            if (currentIndex >= 0 && currentIndex < plData.songs.length - 1) {
                                setNextSongId(plData.songs[currentIndex + 1]._id);
                            } else setNextSongId(null);
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

    const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 44));
    const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 14));

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500 dark:text-slate-400 font-medium animate-pulse tracking-wide">Abriendo letra...</p>
            </div>
        );
    }

    if (error || !song) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-6">
                <div className="bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 p-8 rounded-3xl text-center shadow-xl border border-red-100 dark:border-red-900/50 max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="font-bold text-xl text-gray-900 dark:text-white mb-2">¡Ups!</p>
                    <p className="font-medium text-gray-500 dark:text-slate-400 mb-8">{error || "Canto no encontrado"}</p>
                    <button onClick={() => router.push('/')} className="px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors w-full font-bold shadow-md shadow-blue-200 dark:shadow-none">
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/40 to-white dark:from-slate-950 dark:to-slate-900 pb-32 transition-colors duration-300">
            <header className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 shadow-sm transition-all">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 font-bold bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-all border border-transparent hover:border-blue-100 dark:hover:border-slate-600 active:scale-95">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Repertorio</span>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {playlistId && (
                            <div className="flex items-center bg-white dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                                <Link href={prevSongId ? `/canto/${prevSongId}?playlist=${playlistId}` : '#'} className={`p-2 rounded-full transition-all ${prevSongId ? 'text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95' : 'text-gray-300 dark:text-slate-600 pointer-events-none'}`}>
                                    <ChevronLeft className="w-5 h-5" />
                                </Link>
                                <div className="w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1"></div>
                                <Link href={nextSongId ? `/canto/${nextSongId}?playlist=${playlistId}` : '#'} className={`p-2 rounded-full transition-all ${nextSongId ? 'text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 active:scale-95' : 'text-gray-300 dark:text-slate-600 pointer-events-none'}`}>
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        )}

                        <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
                            <button onClick={decreaseFont} disabled={fontSize <= 14} className="p-2.5 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-30 active:scale-95">
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 px-2 min-w-[3ch] text-center select-none">{fontSize}</span>
                            <button onClick={increaseFont} disabled={fontSize >= 44} className="p-2.5 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-all disabled:opacity-30 active:scale-95">
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="text-center mb-12 sm:mb-16 relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-6 shadow-sm transition-colors">
                        <Music className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight transition-colors">
                        {song.title}
                    </h1>
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors">
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-semibold tracking-wide">
                            {song.artist?.name || "Autor desconocido"}
                        </p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm sm:bg-white sm:dark:bg-slate-900 sm:shadow-xl sm:border border-gray-100 dark:border-slate-800 rounded-3xl p-6 sm:p-12 transition-all duration-300 max-w-3xl mx-auto">
                    <div className="text-slate-800 dark:text-slate-200 font-medium mx-auto text-center sm:text-left transition-all duration-300" style={{ fontSize: `${fontSize}px`, whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: "1.8" }}>
                        {song.lyrics}
                    </div>
                </div>
            </main>

            <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
                <div className="bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700/50 dark:border-slate-600/50">
                    <button onClick={decreaseFont} disabled={fontSize <= 14} className="p-3 text-white hover:bg-slate-700/50 rounded-full transition-all disabled:opacity-30 active:scale-95">
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <span className="text-xs font-bold text-slate-300 px-2 min-w-[3ch] text-center select-none uppercase tracking-widest">Letra</span>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <button onClick={increaseFont} disabled={fontSize >= 44} className="p-3 text-white hover:bg-slate-700/50 rounded-full transition-all disabled:opacity-30 active:scale-95">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CantoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950 transition-colors"><Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" /></div>}>
            <CantoContent />
        </Suspense>
    );
}
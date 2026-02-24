"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Music, Calendar, ChevronRight, BookOpen, Sun, Moon } from "lucide-react";

interface Song {
  _id: string;
  title: string;
  artist: { _id: string; name: string };
}

interface Playlist {
  _id: string;
  title: string;
  date: string;
  isActive: boolean;
  songs: Song[];
}

export default function HomePage() {
  const [activePlaylists, setActivePlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Al cargar, lee si el <html> global tiene el modo oscuro activado
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  // Función que prende/apaga el <html> global
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
    const fetchActivePlaylists = async () => {
      try {
        const response = await fetch("/api/playlists");
        if (!response.ok) throw new Error("Error al cargar los repertorios");
        const allPlaylists: Playlist[] = await response.json();

        // 1. Filtramos solo los activos
        const filtered = allPlaylists.filter(playlist => playlist.isActive);

        // 2. Ordenamiento Inteligente
        const sorted = filtered.sort((a, b) => {
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0); // Ajustamos a UTC para comparar correctamente

          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          const aIsPast = dateA < today.getTime();
          const bIsPast = dateB < today.getTime();

          // Si uno ya pasó y el otro es futuro/hoy, el futuro sube
          if (aIsPast && !bIsPast) return 1;
          if (!aIsPast && bIsPast) return -1;

          // Si ambos son del futuro (o de hoy), el más próximo va arriba
          if (!aIsPast && !bIsPast) {
            return dateA - dateB;
          }
          // Si ambos son del pasado, el más reciente va arriba
          else {
            return dateB - dateA;
          }
        });

        setActivePlaylists(sorted);
      } catch (err) {
        setError("No pudimos cargar los cantos en este momento. Intenta recargar la página.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePlaylists();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="font-medium animate-pulse tracking-wide text-gray-500 dark:text-slate-400">
          Cargando repertorios...
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14 space-y-10">

        <div className="flex justify-center">
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 inline-flex transition-colors">
            <div className="px-6 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm transition-colors">
              Repertorios
            </div>
            <Link href="/alabanzas" className="px-6 py-2.5 rounded-xl text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
              Todas las Alabanzas
            </Link>
          </div>
        </div>
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
            Repertorios de Shabat
          </h2>
          <p className="text-lg text-gray-500 dark:text-slate-400 transition-colors">
            Selecciona un canto para leer la letra y acompañar la alabanza.
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-100 dark:border-red-900/50 transition-colors">
            <p className="font-medium">{error}</p>
          </div>
        ) : activePlaylists.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center flex flex-col items-center transition-colors">
            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Music className="w-12 h-12 text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hay repertorios activos</h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-sm">
              En este momento no hay ninguna lista de cantos publicada para el servicio.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {activePlaylists.map((playlist) => (
              <section key={playlist._id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight">{playlist.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-blue-100 dark:text-blue-200 text-sm font-semibold">
                      <Calendar className="w-4 h-4" />
                      {new Date(playlist.date).toLocaleDateString("es-MX", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
                      }).replace(/^\w/, (c) => c.toUpperCase())}
                    </div>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl inline-flex items-center w-fit text-sm font-bold border border-white/10">
                    <Music className="w-4 h-4 mr-2" />
                    {playlist.songs.length} cantos
                  </div>
                </div>

                <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                  {playlist.songs.map((song, index) => {
                    if (!song || !song._id) return null;
                    return (
                      <li key={`${playlist._id}-${song._id}`}>
                        <Link href={`/canto/${song._id}?playlist=${playlist._id}`} className="flex items-center justify-between p-5 sm:p-6 hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors active:bg-blue-100 dark:active:bg-slate-800 group">
                          <div className="flex items-center gap-5">
                            <span className="text-xl font-black text-gray-200 dark:text-slate-700 w-8 text-center transition-colors">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-gray-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {song.title}
                              </p>
                              <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-0.5 transition-colors">
                                {song.artist?.name || "Autor desconocido"}
                              </p>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
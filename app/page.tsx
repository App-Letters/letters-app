"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, Music, Calendar, ChevronRight, BookOpen, Sun, Moon } from "lucide-react";
import Footer from "../components/shared/Footer";

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

// --- COMPONENTE ANIMADO AL HACER SCROLL (Animación en cada scroll) ---
function FadeInView({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`w-full transition-all duration-700 ease-out ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12"
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
// ------------------------------------------------

export default function HomePage() {
  const [activePlaylists, setActivePlaylists] = useState<Playlist[]>([]);
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
    const fetchActivePlaylists = async () => {
      try {
        const response = await fetch("/api/playlists");
        if (!response.ok) throw new Error("Error al cargar los repertorios");
        const allPlaylists: Playlist[] = await response.json();

        const filtered = allPlaylists.filter(playlist => playlist.isActive);

        const sorted = filtered.sort((a, b) => {
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          const aIsPast = dateA < today.getTime();
          const bIsPast = dateB < today.getTime();

          if (aIsPast && !bIsPast) return 1;
          if (!aIsPast && bIsPast) return -1;

          if (!aIsPast && !bIsPast) {
            return dateA - dateB;
          } else {
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 pb-12 flex flex-col">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-10 sm:mt-14 space-y-10 flex-grow w-full">

        <FadeInView delay={0}>
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
          <div className="text-center space-y-3 mt-10 mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
              Repertorios
            </h2>
            <p className="text-lg text-gray-500 dark:text-slate-400 transition-colors">
              Selecciona un canto para leer la letra y acompañar la alabanza.
            </p>
          </div>
        </FadeInView>

        {error ? (
          <FadeInView>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl text-center border border-red-100 dark:border-red-900/50 transition-colors">
              <p className="font-medium">{error}</p>
            </div>
          </FadeInView>
        ) : activePlaylists.length === 0 ? (
          <FadeInView delay={100}>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-12 text-center flex flex-col items-center transition-colors">
              <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Music className="w-12 h-12 text-gray-300 dark:text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No hay repertorios activos</h3>
              <p className="text-gray-500 dark:text-slate-400 max-w-sm">
                En este momento no hay ninguna lista de cantos publicada para el servicio.
              </p>
            </div>
          </FadeInView>
        ) : (
          <div className="space-y-10 w-full">
            {activePlaylists.map((playlist, index) => (
              <FadeInView key={playlist._id} delay={index * 150}>
                <section className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300">

                  {/* --- ENCABEZADO ACTUALIZADO: Píldora siempre a la derecha --- */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 p-6 sm:p-8 text-white relative">

                    <div className="pr-20 sm:pr-24">
                      <h3 className="text-2xl font-extrabold tracking-tight">{playlist.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-blue-100 dark:text-blue-200 text-sm font-semibold">
                        <Calendar className="w-4 h-4" />
                        {new Date(playlist.date).toLocaleDateString("es-MX", {
                          weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
                        }).replace(/^\w/, (c) => c.toUpperCase())}
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 bg-white/20 dark:bg-black/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl inline-flex items-center w-fit text-xs sm:text-sm font-bold border border-white/10">
                      <Music className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      {playlist.songs.length} cantos
                    </div>

                  </div>
                  {/* ------------------------------------------------------------- */}

                  <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                    {playlist.songs.map((song, songIndex) => {
                      if (!song || !song._id) return null;
                      return (
                        <li key={`${playlist._id}-${song._id}`}>
                          <Link href={`/canto/${song._id}?playlist=${playlist._id}`} className="flex items-center justify-between p-5 sm:p-6 hover:bg-blue-50 dark:hover:bg-slate-800/50 transition-colors active:bg-blue-100 dark:active:bg-slate-800 group">
                            <div className="flex items-center gap-5">
                              <span className="text-xl font-black text-gray-200 dark:text-slate-700 w-8 text-center transition-colors">
                                {songIndex + 1}
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
              </FadeInView>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
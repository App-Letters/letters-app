"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, Music, Calendar, ChevronRight, BookOpen, Sun, Moon, Play } from "lucide-react";
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

// --- COMPONENTE ANIMADO AL HACER SCROLL ---
function FadeInView({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -50px 0px" }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
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
        setError("No pudimos cargar los cantos en este momento.");
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
                Alabanzas
              </Link>
            </div>
          </div>
          <div className="text-center space-y-3 mt-10 mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
              Repertorios
            </h2>
            <p className="text-lg text-gray-500 dark:text-slate-400 transition-colors">
              Selecciona un evento para ver su lista de cantos.
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
          <div className="space-y-6 w-full">
            {activePlaylists.map((playlist, index) => (
              <FadeInView key={playlist._id} delay={index * 100}>

                {/* --- TODA LA TARJETA ES UN LINK A LA PÁGINA DEL REPERTORIO --- */}
                <Link href={`/repertorio/${playlist._id}`} className="block group outline-none">
                  <section className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-blue-200 dark:group-hover:border-blue-900/50">

                    {/* Encabezado APPLE MUSIC STYLE */}
                    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-6 sm:p-8 text-white overflow-hidden">
                      {/* Efectos de luces de fondo (Glassmorfismo) */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform duration-500 group-hover:scale-110"></div>
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 transition-transform duration-500 group-hover:scale-110"></div>

                      <div className="relative z-10 flex items-start justify-between gap-4">

                        {/* Título y Fecha */}
                        <div className="pr-4">
                          <h3 className="text-3xl font-black tracking-tight drop-shadow-sm mb-2">{playlist.title}</h3>
                          <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                            <Calendar className="w-4 h-4 opacity-80" />
                            {new Date(playlist.date).toLocaleDateString("es-MX", {
                              weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
                            }).replace(/^\w/, (c) => c.toUpperCase())}
                          </div>
                        </div>

                        {/* Controles de la derecha (Píldora y Botón Play) */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                          {/* Píldora X Cantos */}
                          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full inline-flex items-center w-fit text-xs sm:text-sm font-bold border border-white/20 shadow-sm">
                            <Music className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 opacity-80" />
                            {playlist.songs.length} cantos
                          </div>

                          {/* Botón Decorativo Play (Aparece en pantallas grandes o al hacer hover) */}
                          <div className="hidden sm:flex w-12 h-12 rounded-full bg-white text-blue-600 items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-50">
                            <Play className="w-5 h-5 ml-1" fill="currentColor" />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Sección inferior para guiar al usuario a hacer clic */}
                    <div className="px-6 py-4 bg-white dark:bg-slate-900 flex items-center justify-between border-t border-gray-50 dark:border-slate-800/50">
                      <span className="text-sm font-bold text-gray-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Ver repertorio completo
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>

                  </section>
                </Link>
                {/* ----------------------------------------------------------- */}

              </FadeInView>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
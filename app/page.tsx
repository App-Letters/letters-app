"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Music, Calendar, ChevronRight, BookOpen } from "lucide-react";

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

  useEffect(() => {
    const fetchActivePlaylists = async () => {
      try {
        const response = await fetch("/api/playlists");
        if (!response.ok) throw new Error("Error al cargar los repertorios");

        const allPlaylists: Playlist[] = await response.json();

        // Filtramos para mostrar ÚNICAMENTE los repertorios activos
        const filtered = allPlaylists.filter(playlist => playlist.isActive);
        setActivePlaylists(filtered);
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Cargando repertorios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Encabezado Superior */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Hallel Kehila</h1>
          </div>
          {/* Un enlace discreto para que tú puedas ir al panel de control */}
          <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">
            Admin
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 space-y-8">

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Repertorios de Shabat</h2>
          <p className="text-gray-500">Selecciona un canto para leer la letra y acompañar la alabanza.</p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">
            <p>{error}</p>
          </div>
        ) : activePlaylists.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Music className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No hay repertorios activos</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              En este momento no hay ninguna lista de cantos publicada para el servicio.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {activePlaylists.map((playlist) => (
              <section key={playlist._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* Cabecera del Repertorio */}
                <div className="bg-blue-600 p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">{playlist.title}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-blue-100 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(playlist.date).toLocaleDateString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      }).replace(/^\w/, (c) => c.toUpperCase())}
                    </div>
                  </div>
                  <div className="bg-blue-700/50 px-3 py-1.5 rounded-lg inline-flex items-center w-fit text-sm font-medium border border-blue-500/30">
                    <Music className="w-4 h-4 mr-2" />
                    {playlist.songs.length} cantos
                  </div>
                </div>

                {/* Lista de Cantos (Diseñada para dedos en celular) */}
                <ul className="divide-y divide-gray-100">
                  {playlist.songs.map((song, index) => (
                    <li key={`${playlist._id}-${song._id}`}>
                      {/* Enlace al canto individual (Haremos esta pantalla en el siguiente paso) */}
                      <Link
                        href={`/canto/${song._id}?playlist=${playlist._id}`}
                        className="flex items-center justify-between p-4 sm:p-5 hover:bg-blue-50 transition-colors active:bg-blue-100 group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-gray-300 w-6 text-center">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                              {song.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {song.artist?.name || "Autor desconocido"}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>

              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
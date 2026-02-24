import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Playlist from '../../../models/Playlist';
import '../../../models/Song'; // Importamos el modelo Song por si acaso

// GET: Obtener todas las listas
export async function GET() {
    try {
        await dbConnect();

        // AQUÍ ESTÁ LA SOLUCIÓN: Agregamos populate para traer la información
        // completa de las canciones y de sus respectivos artistas.
        const playlists = await Playlist.find({})
            .sort({ date: -1 })
            .populate({
                path: 'songs',
                populate: { path: 'artist' }
            });

        return NextResponse.json(playlists, { status: 200 });
    } catch (error) {
        console.error("Error en GET playlists:", error);
        return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
    }
}

// POST: Crear una nueva lista
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newPlaylist = await Playlist.create(body);
        return NextResponse.json(newPlaylist, { status: 201 });
    } catch (error) {
        // Esto imprimirá en tu terminal el error exacto si Mongoose se vuelve a quejar
        console.error("Error detallado en POST playlists:", error);
        return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
    }
}
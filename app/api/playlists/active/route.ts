import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Playlist from '../../../../models/Playlist';
import '../../../../models/Song';
import '../../../../models/Artist';

// GET: Obtener TODAS las listas activas
export async function GET() {
    try {
        await dbConnect();

        const activePlaylists = await Playlist.find({ isActive: true })
            .populate({
                path: 'songs',
                populate: { path: 'artist' }
            });

        // Si no hay ninguna activa, ahora devolvemos un arreglo vacío [] con status 200
        // Esto es más fácil de manejar en el frontend que un error 404
        return NextResponse.json(activePlaylists, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch active playlists' }, { status: 500 });
    }
}
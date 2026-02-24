import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Playlist from '../../../../models/Playlist';
import '../../../../models/Song';
import '../../../../models/Artist';

type Context = {
    params: Promise<{ id: string }>;
};

// GET: Obtener UN solo repertorio con sus canciones y artistas
export async function GET(request: Request, { params }: Context) {
    try {
        const { id } = await params;
        await dbConnect();

        // Usamos un populate "anidado": traemos las canciones, y de cada canción traemos a su artista
        const playlist = await Playlist.findById(id).populate({
            path: 'songs',
            populate: { path: 'artist' }
        });

        if (!playlist) return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });

        return NextResponse.json(playlist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
    }
}

// PUT: Actualizar el repertorio (cambiar orden, título, estado)
export async function PUT(request: Request, { params }: Context) {
    try {
        const { id } = await params;
        await dbConnect();
        const body = await request.json();

        const updatedPlaylist = await Playlist.findByIdAndUpdate(id, body, { new: true });

        if (!updatedPlaylist) return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
        return NextResponse.json(updatedPlaylist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update playlist' }, { status: 500 });
    }
}

// DELETE: Eliminar un repertorio completo (esto arregla también el botón de borrar de tu tabla principal)
export async function DELETE(request: Request, { params }: Context) {
    try {
        const { id } = await params;
        await dbConnect();

        const deletedPlaylist = await Playlist.findByIdAndDelete(id);

        if (!deletedPlaylist) return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
        return NextResponse.json({ message: 'Playlist deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 });
    }
}
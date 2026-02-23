import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Playlist from '../../../../models/Playlist';

interface Params {
    params: { id: string };
}

// GET: Obtener una lista específica por ID
export async function GET(request: Request, { params }: Params) {
    try {
        await dbConnect();
        const playlist = await Playlist.findById(params.id).populate('songs');

        if (!playlist) {
            return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
        }
        return NextResponse.json(playlist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 });
    }
}

// PUT: Actualizar una lista
export async function PUT(request: Request, { params }: Params) {
    try {
        await dbConnect();
        const body = await request.json();

        const updatedPlaylist = await Playlist.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedPlaylist) {
            return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
        }
        return NextResponse.json(updatedPlaylist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update playlist' }, { status: 500 });
    }
}

// DELETE: Eliminar una lista
export async function DELETE(request: Request, { params }: Params) {
    try {
        await dbConnect();
        const deletedPlaylist = await Playlist.findByIdAndDelete(params.id);

        if (!deletedPlaylist) {
            return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Playlist deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 });
    }
}
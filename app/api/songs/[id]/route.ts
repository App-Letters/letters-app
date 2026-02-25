import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Song from '../../../../models/Song';
import '../../../../models/Artist';

// Actualizamos la interfaz para decirle a TypeScript que params ahora es una Promesa
type Context = {
    params: Promise<{ id: string }>;
};

// GET: Obtener una canción específica por su ID
export async function GET(request: Request, { params }: Context) {
    try {
        const { id } = await params;

        await dbConnect();
        const song = await Song.findById(id).populate('artist');

        if (!song) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 });
        }

        return NextResponse.json(song, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch the song' }, { status: 500 });
    }
}

// PUT: Actualizar una canción
export async function PUT(request: Request, { params }: Context) {
    try {
        const { id } = await params; // <--- Esperamos la promesa

        await dbConnect();
        const body = await request.json();

        const updatedSong = await Song.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).populate('artist');

        if (!updatedSong) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 });
        }

        return NextResponse.json(updatedSong, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
    }
}

// DELETE: Eliminar una canción
export async function DELETE(request: Request, { params }: Context) {
    try {
        const { id } = await params; // <--- Esperamos la promesa

        await dbConnect();
        const deletedSong = await Song.findByIdAndDelete(id);

        if (!deletedSong) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Song deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
    }
}
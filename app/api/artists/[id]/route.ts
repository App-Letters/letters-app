import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Artist from '../../../../models/Artist';
import Song from '../../../../models/Song';

type Context = {
    params: Promise<{ id: string }>;
};

// PUT: Actualizar el nombre del artista
export async function PUT(request: Request, { params }: Context) {
    try {
        const { id } = await params; // <--- Esperamos la promesa

        await dbConnect();
        const body = await request.json();
        const updatedArtist = await Artist.findByIdAndUpdate(id, body, { new: true });

        if (!updatedArtist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        return NextResponse.json(updatedArtist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
    }
}

// DELETE: Eliminar un artista con VALIDACIÓN
export async function DELETE(request: Request, { params }: Context) {
    try {
        const { id } = await params; // <--- Esperamos la promesa

        await dbConnect();

        const linkedSongsCount = await Song.countDocuments({ artist: id });

        if (linkedSongsCount > 0) {
            return NextResponse.json(
                { error: `No se puede eliminar: Este autor tiene ${linkedSongsCount} canto(s) registrado(s).` },
                { status: 400 }
            );
        }

        const deletedArtist = await Artist.findByIdAndDelete(id);

        if (!deletedArtist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        return NextResponse.json({ message: 'Artist deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
    }
}
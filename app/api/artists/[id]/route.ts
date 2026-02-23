import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Artist from '../../../../models/Artist';

interface Params {
    params: { id: string };
}

// GET: Obtener un artista por ID
export async function GET(request: Request, { params }: Params) {
    try {
        await dbConnect();
        const artist = await Artist.findById(params.id);

        if (!artist) {
            return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        }

        return NextResponse.json(artist, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
    }
}

// PUT: Actualizar el nombre de un artista
export async function PUT(request: Request, { params }: Params) {
    try {
        await dbConnect();
        const body = await request.json();

        const updatedArtist = await Artist.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedArtist) {
            return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        }

        return NextResponse.json(updatedArtist, { status: 200 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Artist name already in use' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update artist' }, { status: 500 });
    }
}

// DELETE: Eliminar un artista
export async function DELETE(request: Request, { params }: Params) {
    try {
        await dbConnect();
        const deletedArtist = await Artist.findByIdAndDelete(params.id);

        if (!deletedArtist) {
            return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Artist deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete artist' }, { status: 500 });
    }
}
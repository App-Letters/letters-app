import { NextResponse } from "next/server";
import dbConnet from "../../../../lib/mongodb";
import Song from '../../../../models/Song';

interface Params {
    params: { id: string };
}

// GET: Obtener una canción por ID
export async function GET(request: Request, { params }: Params) {
    try {
        await dbConnet();
        const song = await Song.findById(params.id);
        if (!song) {
            return NextResponse.json({ error: 'Song not found' }, { status: 404 });
        }
        return NextResponse.json(song, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch song' }, { status: 500 });
    }
}

// PUT: Actualizar una canción (Ej. corregir un error en la letra)
export async function PUT(request: Request, { params }: Params) {
    try {
        await dbConnet();
        const body = await request.json();

        const updatedSong = await Song.findByIdAndUpdate(params.id, body, {
            new: true, //Devuelve el documento actualizado
            runValidators: true, // Asegura que se respeten las reglas del modelo
        });
        if (!updatedSong) {
            return NextResponse.json({ error: 'Canción no encontrada ' }, { status: 404 });
        }
        return NextResponse.json(updatedSong, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update song' }, { status: 500 });
    }
}

// DELETE: Eliminar una canción
export async function DELETE(request: Request, { params }: Params) {
    try {
        await dbConnet();
        const deletedSong = await Song.findByIdAndDelete(params.id);
        if (!deletedSong) {
            return NextResponse.json({ error: 'Canción no encontrada ' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Canción eliminada correctamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import dbConnect from '../../../lib/mongodb';
import Song from '../../../models/Song';

// GET: Obtener todas las canciones (Público)
export async function GET() {
    try {
        await dbConnect();
        // Buscamos todas las canciones y las ordenamos por fecha de creación (las más nuevas primero)
        const songs = await Song.find({}).sort({ createdAt: -1 });
        return NextResponse.json(songs, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
    }
}

// POST: Crear una nueva canción (Más adelante lo protegeremos solo para admins)
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const newSong = await Song.create(body);
        return NextResponse.json(newSong, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
    }
}
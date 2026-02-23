import { NextResponse } from "next/server";
import dbConnect from '../../../lib/mongodb';
import Song from '../../../models/Song';
import '../../../models/Artist';

// GET: Obtener todas las canciones (Público)
export async function GET() {
    try {
        await dbConnect();
        // Buscamos todas las canciones y las ordenamos por fecha de creación (las más nuevas primero)
        const songs = await Song.find({})
            .populate('artist')
            .sort({ createdAt: -1 });
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

        let newSong = await Song.create(body);
        //Poblamos el artista en la respuesta para que el front-end reciba el objeto completo
        newSong = await newSong.populate('artist');
        return NextResponse.json(newSong, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create song' }, { status: 500 });
    }
}
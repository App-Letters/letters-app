import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Artist from "../../../models/Artist";

// GET: Obtener todos los artistas
export async function GET() {
    try {
        await dbConnect();
        //Los ordenamos alfabéticamente por nombre (1 = ascendente)
        const artists = await Artist.find({}).sort({ name: 1 });
        return NextResponse.json(artists, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
    }
}

// POST: Crear un nuevo artista
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newArtist = await Artist.create(body);
        return NextResponse.json(newArtist, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "El artista ya existe" }, { status: 400 });
        }
        return NextResponse.json({ error: "Error al crear el artista" }, { status: 500 });
    }
}
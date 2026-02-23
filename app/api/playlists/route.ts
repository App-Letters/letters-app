import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Playlist from '../../../models/Playlist';

//GET: Obtener todas las listas
export async function GET() {
    try {
        await dbConnect();
        const playlists = await Playlist.find({}).sort({ date: -1 });
        return NextResponse.json(playlists, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 });
    }
}

//POST: Crear una nueva lista
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newPlaylist = await Playlist.create(body);
        return NextResponse.json(newPlaylist, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
    }
}
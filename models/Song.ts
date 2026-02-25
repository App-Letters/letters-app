// Modelo Songs, guardara el inventario de las alabanzas

import mongoose, { Schema, Document, model, models } from 'mongoose';
import { IArtist } from './Artist';

// 1. Deifinimos la interfaz de TypeScript
export interface ISong extends Document {
    title: string;
    artist: mongoose.Types.ObjectId | IArtist; //Referencia al modelo Artist
    lyrics: string;
    tone: string;
    createdAt: Date;
}

const SongSchema = new Schema<ISong>({
    title: { type: String, required: [true, 'El titulo es necesario'] },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: [true, 'El Artista es requerido'] },
    lyrics: { type: String, required: [true, 'Lyrics are required'] },
    tone: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

export default models.Song || model<ISong>('Song', SongSchema);
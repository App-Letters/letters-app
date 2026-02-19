// Modelo Songs, guardara el inventario de las alabanzas

import mongoose, { Schema, Document, model, models } from 'mongoose';

// 1. Deifinimos la interfaz de TypeScript
export interface ISong extends Document {
    title: string;
    artist?: string; //Opcional
    lyrics: string;
    createdAt: Date;
}

const SongSchema = new Schema<ISong>({
    title: { type: String, require: [true, 'El titulo es necesario'] },
    artist: { type: String, default: 'Desconocido' },
    lyrics: { type: String, require: [true, 'Lyrics are required'] },
    createdAt: { type: Date, default: Date.now },
});

export default models.Song || model<ISong>('Song', SongSchema);
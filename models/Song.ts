import mongoose, { Schema, Document, model, models } from 'mongoose';
import { IArtist } from './Artist';

export interface ISong extends Document {
    title: string;
    artist: mongoose.Types.ObjectId | IArtist;
    lyrics: string;
    tone?: string;
    url?: string; // <--- NUEVO CAMPO
    createdAt: Date;
}

const SongSchema = new Schema<ISong>({
    title: { type: String, required: [true, 'El titulo es necesario'] },
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: [true, 'El Artista es requerido'] },
    lyrics: { type: String, required: [true, 'Lyrics are required'] },
    tone: { type: String, required: false },
    url: { type: String, required: false }, // <--- NUEVO CAMPO
    createdAt: { type: Date, default: Date.now },
});

export default models.Song || model<ISong>('Song', SongSchema);
import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IArtist extends Document {
    name: string;
    createdAt: Date;
}

const ArtistSchema = new Schema<IArtist>({
    name: {
        type: String,
        required: [true, 'El nombre de artista es requerido'],
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        defualt: Date.now
    },
});

export default models.Artist || model<IArtist>('Artist', ArtistSchema);
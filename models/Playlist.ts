import mongoose, { Schema, Document, model, models } from 'mongoose';
import { ISong } from './Song';

export interface IPlaylist extends Document {
    title: string;
    date: Date;
    songs: mongoose.Types.ObjectId[] | ISong[];
    isActive: boolean
}

const PlaylistSchema = new Schema<IPlaylist>({
    title: {
        type: String,
        required: [true, 'El titulo es necesario']
    },
    date: {
        type: Date,
        default: Date.now
    },
    songs: [{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
});

export default models.Playlist || model<IPlaylist>('Playlist', PlaylistSchema);

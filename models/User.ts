import mongose, { Schema, Document, model, models } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    role: string;
}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true
    },
    password: {
        type: String,
        default: 'admin'
    },
});

export default models.User || model<IUser>('User', UserSchema);

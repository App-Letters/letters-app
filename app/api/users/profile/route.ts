import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

// PUT: Actualizar las propias credenciales (email o contraseña)
export async function PUT(request: Request) {
    try {
        // 1. Verificamos que el usuario haya iniciado sesión
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();
        const { email, password } = body;

        // Obtenemos el ID del usuario desde la sesión actual
        const userId = (session.user as any).id;

        // Preparamos el objeto con los datos a actualizar
        const updateData: any = {};

        if (email) {
            // Si quiere cambiar el email, verificamos que no esté en uso por otro
            const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
            if (existingEmail) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }
            updateData.email = email;
        }

        if (password) {
            // Si quiere cambiar la contraseña, la encriptamos antes de guardarla
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Si no envió ni email ni contraseña, no hay nada que actualizar
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No data provided to update' }, { status: 400 });
        }

        // 2. Actualizamos al usuario en la base de datos
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            email: updatedUser.email
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
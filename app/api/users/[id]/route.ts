import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { authOptions } from '../../../api/auth/[...nextauth]/route'; // Ajusta la ruta a authOptions

type Context = {
    params: Promise<{ id: string }>;
};

// DELETE: Eliminar a un administrador (Solo superadmin)
export async function DELETE(request: Request, { params }: Context) {
    try {
        const { id } = await params; // <-- Corrección Next.js 15
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        // Evitar que el superadmin se borre a sí mismo por accidente
        if ((session.user as any).id === id) {
            return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
        }

        await dbConnect();
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Usuario eliminado exitosamente' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { authOptions } from '../../auth/[...nextauth]/route';

interface Params {
    params: { id: string };
}

// DELETE: Eliminar a un administrador (Solo superadmin)
export async function DELETE(request: Request, { params }: Params) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Evitar que el superadmin se borre a sí mismo por accidente
        if ((session.user as any).id === params.id) {
            return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
        }

        await dbConnect();
        const deletedUser = await User.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
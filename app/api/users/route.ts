import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { authOptions } from '../../api/auth/[...nextauth]/route'; // Ajusta esta ruta si es necesario

// POST: Registrar un nuevo administrador (Solo superadmin)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ error: 'No autorizado. Solo los superadmins pueden crear usuarios.' }, { status: 403 });
        }

        await dbConnect();
        const { email, password, role } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const validRole = role === 'superadmin' ? 'superadmin' : 'admin';

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: validRole,
        });

        return NextResponse.json({
            _id: newUser._id, // Aseguramos enviar _id para que el frontend lo lea bien
            email: newUser.email,
            role: newUser.role
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
    }
}

// GET: Obtener todos los usuarios (Solo superadmin)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        await dbConnect();
        const users = await User.find({}).select('-password');

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error al cargar usuarios' }, { status: 500 });
    }
}
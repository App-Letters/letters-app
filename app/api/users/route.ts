import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { authOptions } from '../auth/[...nextauth]/route'; // Importamos las opciones de sesión

// POST: Registrar un nuevo administrador (Solo superadmin)
export async function POST(request: Request) {
    try {
        // 1. Verificamos quién está haciendo la petición
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized. Only superadmins can create users.' }, { status: 403 });
        }

        await dbConnect();
        const { email, password, role } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // 2. Verificamos si el correo ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
        }

        // 3. Encriptamos la contraseña (10 rondas de seguridad)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Creamos el usuario asegurándonos de que el rol sea válido
        const validRole = role === 'superadmin' ? 'superadmin' : 'admin';

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: validRole,
        });

        // Devolvemos los datos del usuario creado (¡pero nunca la contraseña!)
        return NextResponse.json({
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
// GET: Obtener todos los usuarios (Solo superadmin)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();
        // Buscamos a todos los usuarios, pero excluimos el campo 'password' por seguridad usando el select('-password')
        const users = await User.find({}).select('-password');

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
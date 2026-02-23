import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                await dbConnect();

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                // Buscamos al usuario por su email
                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error('User not found');
                }

                // Comparamos la contraseña ingresada con la encriptada en la base de datos
                const isMatch = await bcrypt.compare(credentials.password, user.password);
                if (!isMatch) {
                    throw new Error('Invalid password');
                }

                // Si todo es correcto, devolvemos los datos que irán dentro del token de sesión
                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role, // Aquí inyectamos el rol (admin o superadmin)
                };
            }
        })
    ],
    callbacks: {
        // 1. Guardamos el rol y el ID en el token JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        // 2. Pasamos esos datos a la sesión para que el Frontend (React) pueda leerlos
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login', // Le decimos a NextAuth que usaremos nuestra propia pantalla de login
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
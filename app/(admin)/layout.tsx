import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Sidebar from "../../components/admin/Sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Obtenemos la sesión actual directamente en el servidor
    const session = await getServerSession(authOptions);

    // 2. Si no hay sesión (no está logueado), lo pateamos a la pantalla de login
    if (!session || !session.user) {
        redirect("/login");
    }

    // Obtenemos el rol para pasárselo al menú
    const role = (session.user as any).role;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Pasamos el rol al Sidebar para que sepa qué botones mostrar */}
            <Sidebar role={role} />

            {/* Área principal donde se cargarán las demás pantallas (Dashboard, etc.) */}
            {/* Le damos un margen izquierdo en pantallas medianas (md:ml-64) para hacer espacio al Sidebar fijo */}
            <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6 md:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
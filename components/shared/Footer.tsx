"use client";

import { useState } from "react";
import { ShieldAlert, X, FileText, Lock } from "lucide-react";

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <footer className="mt-auto py-8 border-t border-gray-200 dark:border-slate-800 text-center transition-colors">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
                Hallel Kehila © {new Date().getFullYear()}
            </p>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full transition-colors active:scale-95"
            >
                <ShieldAlert className="w-4 h-4" />
                Aviso Legal y Privacidad
            </button>

            {/* MODAL FLOTANTE */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col max-h-[85vh] border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">

                        {/* Cabecera del Modal */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 shrink-0">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                Términos Legales y Privacidad
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="p-6 overflow-y-auto space-y-8 text-sm text-slate-600 dark:text-slate-300 custom-scrollbar">

                            {/* SECCIÓN 1: DERECHOS DE AUTOR */}
                            <section className="space-y-3">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    1. Aviso de Propiedad Intelectual y Derechos de Autor
                                </h4>
                                <p className="leading-relaxed text-justify">
                                    <strong>Hallel Kehila</strong> es una herramienta digital de código abierto desarrollada con fines estrictamente <strong>educativos, religiosos y sin fines de lucro</strong>. En cumplimiento con la Ley Federal del Derecho de Autor de los Estados Unidos Mexicanos (específicamente en lo referente a las limitaciones del derecho de autor para fines no lucrativos).
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                                    <li><strong>Contenido de terceros:</strong> Las letras, títulos, y progresiones armónicas (acordes) mostrados en este catálogo son propiedad intelectual de sus respectivos compositores, autores y sellos discográficos. Hallel Kehila no reclama la autoría de dichas obras.</li>
                                    <li><strong>Uso de APIs externas:</strong> La visualización de videos incrustados se realiza a través de la API pública de YouTube (propiedad de Google LLC). Las reproducciones generadas a través de esta plataforma contabilizan directamente a los canales oficiales de los artistas.</li>
                                    <li><strong>Notificación de retiro (Takedown Notice):</strong> Si usted es el titular de los derechos de autor de alguna obra aquí contenida y considera que su exposición vulnera sus derechos, por favor contacte a la administración de la congregación para proceder con su eliminación inmediata de la base de datos.</li>
                                </ul>
                            </section>

                            <hr className="border-gray-100 dark:border-slate-800" />

                            {/* SECCIÓN 2: PRIVACIDAD */}
                            <section className="space-y-3">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-blue-500" />
                                    2. Aviso de Privacidad (LFPDPPP)
                                </h4>
                                <p className="leading-relaxed text-justify">
                                    En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> vigente en México, te informamos sobre el tratamiento de la información recopilada en esta plataforma:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                                    <li><strong>Datos recopilados:</strong> La plataforma pública no recopila datos personales de los visitantes. Únicamente se solicita correo electrónico y contraseña encriptada (mediante algoritmos de hash unidireccionales) a los usuarios con rol de Administrador.</li>
                                    <li><strong>Finalidad:</strong> Los datos de los administradores se utilizan exclusivamente para los procesos de Autenticación, Autorización y protección contra accesos no autorizados al panel de control (Dashboard).</li>
                                    <li><strong>Uso de Cookies y Tokens:</strong> La aplicación utiliza tecnologías de sesión (Tokens JWT mediante NextAuth) y almacenamiento local (Local Storage) con el único fin de mantener la sesión activa del administrador y recordar las preferencias de interfaz (Modo Oscuro/Claro). No se utilizan cookies de rastreo publicitario.</li>
                                    <li><strong>No transferencia de datos:</strong> Garantizamos que ninguna información personal, credencial o metadato almacenado en nuestras bases de datos será vendido, cedido o transferido a agencias de terceros, empresas de marketing o entidades gubernamentales, salvo por mandato judicial explícito.</li>
                                    <li><strong>Derechos ARCO:</strong> Los administradores pueden ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición contactando directamente al desarrollador o al encargado del sistema de la congregación.</li>
                                </ul>
                            </section>

                            <p className="text-xs text-center text-gray-400 dark:text-slate-500 mt-6 font-mono">
                                Última actualización: {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        {/* Botón de cerrar abajo */}
                        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-right shrink-0">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors active:scale-95 shadow-md shadow-blue-200 dark:shadow-none"
                            >
                                Acepto y Entiendo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
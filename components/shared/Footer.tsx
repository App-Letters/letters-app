"use client";

import { useState } from "react";
import { ShieldAlert, X, FileText, Lock } from "lucide-react";

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <footer className="mt-auto py-10 border-t border-gray-200/60 dark:border-slate-800/60 flex flex-col items-center justify-center gap-4 transition-colors">

            <div className="text-center">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-4">
                    Hallel Kehila © {new Date().getFullYear()}
                </p>

                {/* Botón Píldora Elegante */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="group inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700 rounded-full transition-all active:scale-95 border border-transparent dark:border-slate-700/50 hover:shadow-sm"
                >
                    <ShieldAlert className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    Aviso Legal y Privacidad
                </button>
            </div>

            {/* MODAL FLOTANTE PREMIUM */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-300">

                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden text-left flex flex-col max-h-[85vh] border border-white/20 dark:border-white/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

                        {/* Cabecera del Modal */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 shrink-0">
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 shadow-inner">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                Términos y Privacidad
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contenido con scroll */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm text-slate-600 dark:text-slate-300 custom-scrollbar">

                            {/* SECCIÓN 1: DERECHOS DE AUTOR */}
                            <section className="space-y-3">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                    <div className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-blue-500">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    1. Aviso de Propiedad Intelectual
                                </h4>
                                <p className="leading-relaxed text-justify">
                                    <strong>Hallel Kehila</strong> es una herramienta digital de código abierto desarrollada con fines estrictamente <strong>educativos, religiosos y sin fines de lucro</strong>, en cumplimiento con la Ley Federal del Derecho de Autor de los Estados Unidos Mexicanos (específicamente en lo referente a las limitaciones del derecho de autor para fines no lucrativos).
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500/50">
                                    <li><strong>Contenido de terceros:</strong> Las letras, títulos, y progresiones armónicas (acordes) mostrados en este catálogo son propiedad intelectual de sus respectivos compositores, autores y sellos discográficos. Hallel Kehila no reclama la autoría de dichas obras.</li>
                                    <li><strong>Uso de APIs externas:</strong> La visualización de videos incrustados se realiza a través de la API pública de YouTube (propiedad de Google LLC). Las reproducciones generadas a través de esta plataforma contabilizan directamente a los canales oficiales de los artistas.</li>
                                    <li><strong>Notificación de retiro (Takedown Notice):</strong> Si usted es el titular de los derechos de autor de alguna obra aquí contenida y considera que su exposición vulnera sus derechos, por favor contacte a la administración de la congregación para proceder con su eliminación inmediata de la base de datos.</li>
                                </ul>
                            </section>

                            <hr className="border-slate-100 dark:border-slate-800/60" />

                            {/* SECCIÓN 2: PRIVACIDAD */}
                            <section className="space-y-3">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                    <div className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-blue-500">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    2. Aviso de Privacidad (LFPDPPP)
                                </h4>
                                <p className="leading-relaxed text-justify">
                                    En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> vigente en México, te informamos sobre el tratamiento de la información recopilada en esta plataforma:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-blue-500/50">
                                    <li><strong>Datos recopilados:</strong> La plataforma pública no recopila datos personales de los visitantes. Únicamente se solicita correo electrónico y contraseña encriptada (mediante algoritmos de hash unidireccionales) a los usuarios con rol de Administrador.</li>
                                    <li><strong>Finalidad:</strong> Los datos de los administradores se utilizan exclusivamente para los procesos de Autenticación, Autorización y protección contra accesos no autorizados al panel de control (Dashboard).</li>
                                    <li><strong>Uso de Cookies y Tokens:</strong> La aplicación utiliza tecnologías de sesión (Tokens JWT mediante NextAuth) y almacenamiento local (Local Storage) con el único fin de mantener la sesión activa del administrador y recordar las preferencias de interfaz (Modo Oscuro/Claro). No se utilizan cookies de rastreo publicitario.</li>
                                    <li><strong>No transferencia de datos:</strong> Garantizamos que ninguna información personal, credencial o metadato almacenado en nuestras bases de datos será vendido, cedido o transferido a agencias de terceros, empresas de marketing o entidades gubernamentales, salvo por mandato judicial explícito.</li>
                                    <li><strong>Derechos ARCO:</strong> Los administradores pueden ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición contactando directamente al desarrollador o al encargado del sistema de la congregación.</li>
                                </ul>
                            </section>

                            <div className="pt-4 flex justify-center">
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-md">
                                    Última actualización: {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Botón de cerrar abajo */}
                        <div className="p-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 text-right shrink-0">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 dark:shadow-none"
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
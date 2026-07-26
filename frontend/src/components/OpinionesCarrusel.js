"use client";
import { useState, useEffect } from "react"; // 1. Importamos useEffect
import { motion } from "framer-motion";

const opiniones = [
    { id: 1, texto: "Me encantó, excelente acompañamiento" },
    { id: 2, texto: "Muy intuitiva la plataforma, 10/10" },
    { id: 3, texto: "Me ayudó a pulir mi perfil profesional" },
    { id: 4, texto: "Excelente contenido educativo y guía" },
    { id: 5, texto: "Los tests son muy acertados y rápidos" },
    { id: 6, texto: "La mejor inversión para mi carrera" },
    { id: 7, texto: "Estética impecable y fácil de usar" },
    { id: 8, texto: "Brillante atención al detalle de verdad" },
];

export default function OpinionesCarrusel() {
    const [index, setIndex] = useState(0);
    const cardsVisibles = 4;

    // --- MAGIA PARA EL MOVIMIENTO AUTOMÁTICO ---
    useEffect(() => {
        const intervalo = setInterval(() => {
            siguiente();
        }, 3000); // Se mueve cada 3 segundos

        return () => clearInterval(intervalo); // Limpiamos el reloj al salir
    }, [index]); // Se reinicia el reloj cada vez que cambia el index

    const siguiente = () => {
        // Si llega al final, vuelve al principio
        if (index + cardsVisibles >= opiniones.length) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    };

    const anterior = () => {
        if (index > 0) {
            setIndex(index - 1);
        } else {
            // Si está al principio y da atrás, va al final
            setIndex(opiniones.length - cardsVisibles);
        }
    };

    return (
        <div className="z-10 w-full max-w-5xl absolute bottom-24 px-6 drop-shadow-xl">

            <div className="bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-2xl border border-white/10 overflow-hidden">

                <button onClick={anterior} className="text-white bg-white/10 w-8 h-8 rounded-full hover:bg-white/20 transition-all flex items-center justify-center text-xs z-20 active:scale-90">
                    ←
                </button>

                <div className="flex-1 overflow-hidden h-20">
                    <motion.div
                        className="flex gap-3"
                        animate={{ x: `-${index * (100 / cardsVisibles)}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }} // Más suave para el modo automático
                    >
                        {opiniones.map((op) => (
                            <div
                                key={op.id}
                                className="min-w-[calc(25%-9px)] bg-white/5 p-3 rounded-xl border border-white/5 text-white flex flex-col justify-center"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center text-[10px]">👤</div>
                                    <div className="text-yellow-400 text-[8px]">★★★★★</div>
                                </div>
                                <p className="text-[9px] leading-tight opacity-90 italic">
                                    "{op.texto}" <span className="text-cyan-400 font-bold cursor-pointer ml-1">más</span>
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <button onClick={siguiente} className="text-white bg-white/10 w-8 h-8 rounded-full hover:bg-white/20 transition-all flex items-center justify-center text-xs z-20 active:scale-90">
                    →
                </button>
            </div>
        </div>
    );
}
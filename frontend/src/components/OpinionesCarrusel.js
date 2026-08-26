"use client";
import { useState, useEffect } from "react";

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
    const [cardsVisibles, setCardsVisibles] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCardsVisibles(1);
            } else if (window.innerWidth < 1024) {
                setCardsVisibles(2);
            } else {
                setCardsVisibles(4);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const intervalo = setInterval(() => {
            siguiente();
        }, 3500);

        return () => clearInterval(intervalo);
    }, [index, cardsVisibles]);

    const siguiente = () => {
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
            setIndex(opiniones.length - cardsVisibles);
        }
    };

    const offset = -(index * (100 / cardsVisibles));

    return (
        <div className="z-10 w-full max-w-4xl mx-auto absolute left-0 right-0 bottom-16 sm:bottom-20 px-4 sm:px-6 drop-shadow-xl">

            <div className="bg-slate-800/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl flex items-center gap-2 sm:gap-4 shadow-2xl border border-white/10 overflow-hidden">

                <button onClick={anterior} className="text-white bg-white/10 w-8 h-8 rounded-full hover:bg-white/20 transition-all flex items-center justify-center text-xs z-20 active:scale-90 shrink-0">
                    ←
                </button>

                <div className="flex-1 overflow-hidden h-20 flex items-center">
                    <div
                        className="flex gap-3 w-full"
                        style={{
                            transform: `translateX(${offset}%)`,
                            transition: "transform 0.5s ease",
                        }}
                    >
                        {opiniones.map((op) => (
                            <div
                                key={op.id}
                                style={{ minWidth: `calc(${100 / cardsVisibles}% - ${(cardsVisibles - 1) * 12 / cardsVisibles}px)` }}
                                className="bg-white/5 p-3 rounded-xl border border-white/5 text-white flex flex-col justify-center shrink-0 shadow-inner"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 bg-slate-600/80 rounded-full flex items-center justify-center text-[10px]">👤</div>
                                    <div className="text-yellow-400 text-[9px]">★★★★★</div>
                                </div>
                                <p className="text-[10px] sm:text-xs leading-tight opacity-90 italic">
                                    &ldquo;{op.texto}&rdquo; <span className="text-cyan-400 font-bold cursor-pointer ml-1">más</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={siguiente} className="text-white bg-white/10 w-8 h-8 rounded-full hover:bg-white/20 transition-all flex items-center justify-center text-xs z-20 active:scale-90 shrink-0">
                    →
                </button>
            </div>
        </div>
    );
}

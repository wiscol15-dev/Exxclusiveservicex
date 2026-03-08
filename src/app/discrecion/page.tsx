import Link from "next/link";
import { ArrowLeft, EyeOff } from "lucide-react";

export const metadata = {
  title: "Discreción de Datos | exxclusiveservicex",
  description:
    "Nuestro compromiso absoluto con tu anonimato, confidencialidad y la protección de tu identidad.",
};

export default function DiscrecionPage() {
  return (
    <main className="min-h-screen bg-elite-black text-white selection:bg-elite-gold selection:text-elite-black relative overflow-x-hidden pb-20 pt-8 md:pt-12">
      <div className="fixed top-0 inset-x-0 h-screen bg-gradient-to-b from-zinc-900/20 via-elite-black to-elite-black pointer-events-none z-0" />

      <div className="relative z-10 max-w-[800px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/40 hover:text-white font-bold tracking-widest uppercase text-xs transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <EyeOff size={24} className="text-elite-gold opacity-50" />
        </div>

        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white">
            Discreción de <span className="text-elite-gold">Datos</span>
          </h1>
          <p className="text-xs text-elite-gold tracking-widest uppercase font-bold">
            Compromiso de Anonimato Total
          </p>
        </div>

        <div className="space-y-12 text-sm text-white/70 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              1. Navegación Invisible
            </h2>
            <p>
              Garantizamos que el acceso de los visitantes a exxclusiveservicex
              es completamente anónimo. No requerimos registro, creación de
              cuentas ni inicio de sesión para explorar nuestro catálogo
              público. No rastreamos perfiles sociales, no vinculamos
              direcciones IP con identidades físicas y no utilizamos software de
              reconocimiento o perfilamiento de visitantes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              2. Confidencialidad del Anunciante
            </h2>
            <p>
              Entendemos el valor de la privacidad para los profesionales
              listados en nuestra plataforma. Todos los datos de contacto,
              nombres artísticos e información proporcionada durante la creación
              del perfil se tratan bajo estricta confidencialidad. Los métodos
              de contacto reales solo son visibles en la interfaz pública según
              la configuración elegida por el anunciante y jamás se cruzan con
              bases de datos externas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              3. Protección de Medios y Fotografías
            </h2>
            <p>
              Aunque las imágenes publicadas en los perfiles son de dominio
              público dentro de la plataforma, exxclusiveservicex no cede,
              transfiere ni autoriza el uso de estas fotografías a terceros,
              motores de búsqueda de imágenes inversas o redes de afiliados.
              Instamos a nuestros anunciantes a utilizar material con marcas de
              agua propias para una capa adicional de protección personal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              4. Canales de Comunicación Externos
            </h2>
            <p>
              La plataforma no cuenta con un sistema de mensajería interna.
              Todas las comunicaciones y acuerdos se realizan mediante
              plataformas externas elegidas por el anunciante (como Telegram o
              WhatsApp). Esto asegura que exxclusiveservicex no almacene
              historiales de chat, notas de voz ni registros de interacción
              entre usuarios y anunciantes, garantizando un ecosistema de cero
              conocimiento sobre sus acuerdos privados.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              5. Tolerancia Cero al Doxxing
            </h2>
            <p>
              Mantenemos una política estricta y absoluta contra la revelación
              de identidades reales (doxxing), chantaje o acoso. Cualquier
              intento de publicar información privada, nombres legales, o
              ubicaciones no autorizadas en las descripciones de los perfiles
              resultará en la eliminación inmediata y permanente del contenido,
              y el bloqueo irreversible de los medios de pago asociados al
              infractor.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export const metadata = {
  title: "Términos de Servicio | exxclusiveservicex",
  description:
    "Términos y condiciones legales para el uso de nuestra plataforma exclusiva.",
};

export default function TerminosPage() {
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
          <Scale size={24} className="text-elite-gold opacity-50" />
        </div>

        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white">
            Términos de <span className="text-elite-gold">Servicio</span>
          </h1>
          <p className="text-xs text-elite-gold tracking-widest uppercase font-bold">
            Última actualización: Marzo 2026
          </p>
        </div>

        <div className="space-y-12 text-sm text-white/70 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              1. Aceptación y Mayoría de Edad
            </h2>
            <p>
              El acceso y uso de exxclusiveservicex está estrictamente
              restringido a personas que hayan alcanzado la mayoría de edad
              legal en su jurisdicción de residencia (mínimo 18 años). Al
              acceder, navegar o utilizar este sitio web, usted declara bajo
              juramento cumplir con este requisito y acepta quedar vinculado
              incondicionalmente por estos Términos de Servicio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              2. Naturaleza de la Plataforma
            </h2>
            <p>
              exxclusiveservicex opera única y exclusivamente como un directorio
              publicitario y plataforma de clasificados de terceros. No somos
              una agencia, no actuamos como intermediarios, y no empleamos ni
              representamos legalmente a ninguno de los anunciantes listados en
              nuestro catálogo. Todas las interacciones, acuerdos y
              contrataciones se realizan directamente entre el usuario y el
              anunciante de forma privada e independiente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              3. Responsabilidad del Contenido
            </h2>
            <p>
              Los anunciantes son los únicos responsables del contenido,
              imágenes, descripciones y exactitud de la información publicada en
              sus perfiles. Nos reservamos el derecho, pero no la obligación, de
              revisar, editar o eliminar cualquier contenido que viole nuestras
              normativas o que consideremos inapropiado, falso o ilegal, sin
              previo aviso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              4. Pagos y Servicios VIP
            </h2>
            <p>
              La adquisición de pases exclusivos o posiciones VIP dentro de la
              plataforma se realiza mediante pagos procesados de forma segura.
              Debido a la naturaleza digital e inmediata del servicio de
              publicidad y posicionamiento, todos los pagos realizados son
              definitivos y no reembolsables, independientemente del éxito o
              resultado de la publicación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              5. Actividades Prohibidas
            </h2>
            <p>
              Queda terminantemente prohibido utilizar esta plataforma para
              facilitar, promover o coordinar cualquier actividad ilegal según
              las leyes locales o internacionales. Esto incluye, pero no se
              limita a, la explotación de menores, la trata de personas, el
              fraude y la extorsión. Cualquier cuenta que infrinja esta norma
              será eliminada permanentemente y reportada a las autoridades
              competentes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              6. Limitación de Responsabilidad
            </h2>
            <p>
              exxclusiveservicex, sus desarrolladores, propietarios y afiliados
              no serán responsables de ningún daño directo, indirecto,
              incidental o consecuente que surja del uso o la imposibilidad de
              uso de la plataforma, ni de los resultados de los encuentros o
              comunicaciones originados a través de nuestro directorio. El
              usuario asume total responsabilidad y riesgo por el uso del
              servicio.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Políticas de Privacidad | exxclusiveservicex",
  description:
    "Conoce cómo protegemos, encriptamos y manejamos tu información personal y datos de navegación.",
};

export default function PrivacidadPage() {
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
          <ShieldCheck size={24} className="text-elite-gold opacity-50" />
        </div>

        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white">
            Políticas de <span className="text-elite-gold">Privacidad</span>
          </h1>
          <p className="text-xs text-elite-gold tracking-widest uppercase font-bold">
            Última actualización: Marzo 2026
          </p>
        </div>

        <div className="space-y-12 text-sm text-white/70 leading-relaxed font-light">
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              1. Recopilación de Información
            </h2>
            <p>
              En exxclusiveservicex recopilamos únicamente la información
              estrictamente necesaria para el funcionamiento de la plataforma.
              Esto incluye los datos proporcionados voluntariamente por los
              anunciantes al crear un perfil (textos, imágenes, métodos de
              contacto) y datos técnicos anónimos generados al navegar por el
              sitio, como direcciones IP truncadas y tipo de navegador, con
              fines exclusivos de seguridad y prevención de fraudes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              2. Protección de Pagos y Datos Financieros
            </h2>
            <p>
              Nuestra plataforma utiliza tecnología de encriptación de grado
              militar y pasarelas de pago de terceros certificadas a nivel
              mundial (Stripe). exxclusiveservicex no almacena, procesa ni tiene
              acceso en ningún momento a los números de tarjetas de crédito,
              cuentas bancarias o credenciales financieras de nuestros usuarios.
              Toda transacción es gestionada bajo los estándares PCI-DSS de
              máxima seguridad.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              3. Uso de Cookies y Tecnologías Locales
            </h2>
            <p>
              Utilizamos almacenamiento local (LocalStorage) y cookies
              estrictamente necesarias para el correcto funcionamiento del
              sitio, como recordar la verificación de mayoría de edad legal para
              no interrumpir su navegación futura. No empleamos cookies
              invasivas de rastreo publicitario de terceros ni vendemos su
              historial de navegación a entidades externas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              4. Compartición y Venta de Datos
            </h2>
            <p>
              Nuestra política es categórica: no vendemos, alquilamos ni
              comercializamos su información personal o de contacto bajo ninguna
              circunstancia. Los datos de los perfiles son públicos por la
              propia naturaleza del directorio, pero la información interna del
              usuario se mantiene bajo estricta confidencialidad. Solo
              compartiremos información con autoridades gubernamentales si
              existe una orden judicial válida que nos obligue legalmente a
              hacerlo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              5. Enlaces a Sitios de Terceros
            </h2>
            <p>
              Los perfiles publicados pueden contener enlaces a redes sociales,
              sitios web personales o plataformas de mensajería (WhatsApp,
              Telegram). Al hacer clic en estos enlaces y abandonar nuestra
              plataforma, usted se somete a las políticas de privacidad de
              dichos sitios. exxclusiveservicex no tiene control ni asume
              responsabilidad sobre la recolección de datos en plataformas
              externas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-white border-l-2 border-elite-gold pl-4">
              6. Derechos del Usuario y Eliminación
            </h2>
            <p>
              Usted tiene el derecho absoluto de solicitar la modificación,
              ocultamiento o eliminación permanente de su perfil, fotografías y
              datos de contacto de nuestra base de datos en cualquier momento.
              Al procesar una solicitud de baja, la información es borrada
              definitivamente de nuestros servidores sin retención oculta.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

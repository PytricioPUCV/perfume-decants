import { INSTAGRAM_URL, InstagramIcon, WhatsAppIcon } from './BrandIcons';
import { WHATSAPP_PHONE } from '../utils/whatsappFormatter';

const steps = [
  'Arma tu carrito eligiendo perfume y tamaño.',
  'Envía el pedido por WhatsApp con un clic.',
  'Confirmamos stock y coordinamos pago y envío.',
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="font-display text-xl font-semibold">Cómo comprar</h2>
          <ol className="mt-4 space-y-2.5 text-sm text-paper/90">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="font-display font-semibold text-gold">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold">Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 hover:text-gold"
              >
                <WhatsAppIcon className="size-4 text-wa" />
                +56 9 7317 8412
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 hover:text-gold">
                <InstagramIcon className="size-4 text-muted" />
                @decantsdelpuerto
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="border-t border-line px-4 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Decants del Puerto
      </p>
    </footer>
  );
}

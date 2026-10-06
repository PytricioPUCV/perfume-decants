const policies = [
  { term: 'Pago', detail: 'Efectivo o transferencia al momento de la entrega.' },
  { term: 'Envíos', detail: 'A todo Chile, de lunes a viernes, vía Bluexpress.' },
  { term: 'Devoluciones', detail: 'No se aceptan devoluciones.' },
];

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-title"
      className="mx-auto mt-20 grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-16"
    >
      <img
        src="/proceso.jpg"
        alt="Decant siendo llenado con una jeringa desde el frasco original"
        loading="lazy"
        decoding="async"
        className="mx-auto aspect-[9/16] w-full max-w-72 rounded-lg object-cover"
      />

      <div className="max-w-xl">
        <h2 id="about-title" className="font-display text-[2rem] leading-tight font-semibold">
          ¿Qué es un decant?
        </h2>
        <p className="mt-4 leading-relaxed text-paper/90">
          Es una pequeña porción de un perfume 100% auténtico, extraída de su botella original y traspasada a un
          atomizador de 3, 5 o 10 ml. Te permite usar una fragancia de lujo varias veces en tu propia piel antes de
          comprar la botella completa, tener más variedad o llevar tu perfume de viaje.
        </p>

        <h3 className="mt-10 font-display text-xl font-semibold">Nuestras políticas</h3>
        <dl className="mt-4 divide-y divide-line border-y border-line">
          {policies.map((p) => (
            <div key={p.term} className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
              <dt className="text-sm text-muted">{p.term}</dt>
              <dd className="text-sm">{p.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

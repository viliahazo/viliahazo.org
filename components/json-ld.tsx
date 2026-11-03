/**
 * Injecte un bloc JSON-LD (schema.org) dans le HTML rendu côté serveur.
 * Le contenu provient uniquement de constantes locales, jamais d'une saisie
 * utilisateur non échappée.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

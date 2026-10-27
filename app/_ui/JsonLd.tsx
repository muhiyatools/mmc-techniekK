/**
 * Renders a JSON-LD structured-data <script>. `data` is our own controlled
 * object (never user input), and JSON.stringify escapes it — this is the
 * Next.js-recommended pattern for structured data.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

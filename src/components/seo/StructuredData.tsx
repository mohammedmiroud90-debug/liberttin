interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
  /** Must be unique per page — several graphs can render on one route. */
  id?: string;
}

/**
 * Plain <script> rather than next/script: JSON-LD has to be in the initial HTML
 * for crawlers, and next/script dedupes by id across the tree.
 */
export function StructuredData({ data, id = 'structured-data' }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          id={jsonLd.length > 1 ? `${id}-${index}` : id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Prevent a nested </script> in any string field from closing the tag.
            __html: JSON.stringify(item).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}

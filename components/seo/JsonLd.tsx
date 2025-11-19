/**
 * JSON-LD Component
 *
 * Reusable component for injecting JSON-LD structured data into pages.
 * Properly escapes JSON and uses type="application/ld+json" for SEO.
 *
 * Usage:
 * <JsonLd data={schema} />
 * <JsonLd data={[schema1, schema2]} />
 */

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | any[]
}

export function JsonLd({ data }: JsonLdProps) {
  // Handle array of schemas by wrapping in @graph
  const schemaData = Array.isArray(data)
    ? {
        '@context': 'https://schema.org',
        '@graph': data.map(schema => {
          // Remove @context from individual schemas
          const { '@context': _, ...rest } = schema
          return rest
        }),
      }
    : data

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 0),
      }}
    />
  )
}

export default JsonLd

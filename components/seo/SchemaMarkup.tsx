export default function SchemaMarkup({
  type = "Organization",
  data = {},
}: {
  type: string
  data: Record<string, any>
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}


export function SchemaMarkup({ schema }: { schema: Record<string, any> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}

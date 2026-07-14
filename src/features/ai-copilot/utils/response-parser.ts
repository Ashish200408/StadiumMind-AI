export const parseResponse = (rawMarkdown: string): string => {
  // A basic sanitizer for now. In a real application, you might use DOMPurify
  // or a full markdown parser/sanitizer to ensure structural integrity.
  // We want to ensure markdown tables, lists, and headings are clean.

  // Trim excessive whitespace
  let clean = rawMarkdown.trim();

  // Prevent any script injection strings if Gemini somehow produced them (unlikely for Gemini via API, but good practice)
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return clean;
};

import sql from "../config/db.js";

const normalizeSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSlug = async (name) => {
  const baseSlug = normalizeSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await sql`
      SELECT 1 FROM companies WHERE slug = ${slug}
    `;

    if (existing.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};


export { normalizeSlug, generateUniqueSlug };
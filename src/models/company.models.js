import sql from "../config/db.js";

const getCompanySettings = async (companySlug) => {
  try {
    const rows = await sql`
    SELECT
      c.id as company_id,
      c.name as company_name,
      c.slug,
      bt.primary_color,
      bt.secondary_color,
      bt.accent_color,
      bt.logo_url,
      bt.banner_url,
      bt.culture_video_url,
      cs.id as section_id,
      cs.type,
      cs.title,
      cs.content,
      cs.image_url,
      cs.is_visible,
      cs.display_order
    FROM companies c
    LEFT JOIN brand_themes bt ON c.id = bt.company_id
    LEFT JOIN content_sections cs ON c.id = cs.company_id
    WHERE c.slug = ${companySlug} AND (cs.is_deleted = false OR cs.is_deleted IS NULL)
    ORDER BY cs.display_order;
  `;

    if (rows.length === 0) return null;

    const company = {
      companyName: rows[0].company_name,
      slug: rows[0].slug,
      brandTheme: {
        primaryColor: rows[0].primary_color,
        secondaryColor: rows[0].secondary_color,
        accentColor: rows[0].accent_color,
        logoUrl: rows[0].logo_url,
        bannerUrl: rows[0].banner_url,
        cultureVideoUrl: rows[0].culture_video_url,
      },
      sections: rows
        .filter(r => r.section_id)
        .map(r => ({
          id: r.section_id,
          type: r.type,
          title: r.title,
          content: r.content,
          imageUrl: r.image_url,
          isVisible: r.is_visible,
          order: r.display_order,
        })),
    };

    return company;
  } catch (error) {
    throw error
  }
}

const saveCompanyData = async (companySlug, companyName, brandTheme, sections) => {
  return await sql.begin(async (tx) => {
    // 1️ Get company ID
    const companyRows = await tx`
      SELECT id, name FROM companies WHERE slug = ${companySlug}
    `;

    if (companyRows.length === 0) {
      throw new Error('Company not found');
    }

    const companyId = companyRows[0].id;
    // Update company name if changed
    if (companyRows[0].name !== companyName) {
      await tx`
        UPDATE companies
        SET name = ${companyName}
        WHERE id = ${companyId}
      `;
    }
    //Check if brand theme exists for the company
    const brandThemeRows = await tx`
      SELECT company_id FROM brand_themes WHERE company_id = ${companyId}
    `;
    // 2️ Update brand theme
    if (brandThemeRows.length === 0) {
      // Insert new brand theme
      await tx`
        INSERT INTO brand_themes (
          company_id,
          primary_color,
          secondary_color,
          accent_color,
          logo_url,
          banner_url,
          culture_video_url
        ) VALUES (
          ${companyId},
          ${brandTheme.primaryColor},
          ${brandTheme.secondaryColor},
          ${brandTheme.accentColor},
          ${brandTheme.logoUrl},
          ${brandTheme.bannerUrl},
          ${brandTheme.cultureVideoUrl}
        )
      `;
    } else {
      // Update existing brand theme
      await tx`
        UPDATE brand_themes
        SET
        primary_color = ${brandTheme.primaryColor},
        secondary_color = ${brandTheme.secondaryColor},
        accent_color = ${brandTheme.accentColor},
        logo_url = ${brandTheme.logoUrl},
        banner_url = ${brandTheme.bannerUrl},
        culture_video_url = ${brandTheme.cultureVideoUrl}
      WHERE company_id = ${companyId}
    `;
    }
      // 3️ Upsert sections (insert or update)
      const sectionIds = [];

      for (const section of sections) {
        sectionIds.push(section.id);

        await tx`
        INSERT INTO content_sections (
          id,
          company_id,
          type,
          title,
          content,
          image_url,
          is_visible,
          display_order,
          is_deleted
        ) VALUES (
          ${section.id},
          ${companyId},
          ${section.type},
          ${section.title},
          ${section.content},
          ${section.imageUrl || null},
          ${section.isVisible},
          ${section.order},
          false
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          image_url = EXCLUDED.image_url,
          is_visible = EXCLUDED.is_visible,
          display_order = EXCLUDED.display_order,
          is_deleted = false
      `;
      }

      await tx`
      UPDATE content_sections
      SET is_deleted = true
      WHERE company_id = ${companyId}
      AND id NOT IN ${tx(sectionIds)}
    `;

      return { success: true };
    });
};

const getCompanyByName = async (companyName) => {
  try {
    const rows = await sql`
      SELECT id, name, slug FROM companies WHERE name = ${companyName}
    `;
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};
const addNewCompany = async (companyName, companySlug) => {
  try {
    const result = await sql`
      INSERT INTO companies (name, slug)
      VALUES (${companyName}, ${companySlug})
      RETURNING id, name, slug
    `;
    return result[0];
  } catch (error) {
    throw error;
  }
};


export default {
  getCompanySettings,
  saveCompanyData,
  getCompanyByName,
  addNewCompany,
};
import sql from "../config/db.js";

const getJobsByFiltersAndQuery = async (filters, query) => {
  try {
    let baseQuery = sql`SELECT * FROM jobs WHERE 1=1`;

    if (filters.locations?.length) {
      baseQuery = sql`${baseQuery} AND location = ANY(${filters.locations.map(loc => loc.id)})`;
    }

    if (filters.departments?.length) {
      baseQuery = sql`${baseQuery} AND department = ANY(${filters.departments.map(dep => dep.id)})`;
    }

    if (filters.workPlaceTypes?.length) {
      baseQuery = sql`${baseQuery} AND work_policy = ANY(${filters.workPlaceTypes.map(wpt => wpt.id)})`;
    }

    if (filters.employmentTypes?.length) {
      baseQuery = sql`${baseQuery} AND employment_type = ANY(${filters.employmentTypes.map(et => et.id)})`;
    }

    if (query?.trim()) {
      baseQuery = sql`${baseQuery} AND title ILIKE ${'%' + query.trim() + '%'}`;
    }

    const rows = await baseQuery;
    

    return rows;
  } catch (error) {
    throw error;
  }
};

const getAllJobFilterValues = async () => {
  try {
    const locations = await sql`SELECT DISTINCT location FROM jobs`;
    const departments = await sql`SELECT DISTINCT department FROM jobs`;
    const workPlaceTypes = await sql`SELECT DISTINCT work_policy FROM jobs`;
    const employmentTypes = await sql`SELECT DISTINCT employment_type FROM jobs`;
    return {
      locations: locations.map(r => ({ id: r.location, label: r.location })),
      departments: departments.map(r => ({ id: r.department, label: r.department })),
      workPlaceTypes: workPlaceTypes.map(r => ({ id: r.work_policy, label: r.work_policy })),
      employmentTypes: employmentTypes.map(r => ({ id: r.employment_type, label: r.employment_type })),
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getJobsByFiltersAndQuery,
  getAllJobFilterValues,
};
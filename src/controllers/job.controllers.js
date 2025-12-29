import jobModels from "../models/job.models.js";

const getJobsByFiltersAndQuery = async (req, res) => {
  try {
    const {filterValues, query} = req.body;
    const jobs = await jobModels.getJobsByFiltersAndQuery(filterValues, query);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.log(error, 'Error in getJobsByFiltersAndQuery controller');
    res.status(500).json({ success: false, error: error.message });
  }
}

const getAllJobFilterValues = async (req, res) => {
  try {
    const filterValues = await jobModels.getAllJobFilterValues();
    res.status(200).json({ success: true, data: filterValues });
  } catch (error) {
    console.log(error, 'Error in getAllJobFilterValues controller');
    res.status(500).json({ success: false, error: error.message });
  }
}

export default {
  getJobsByFiltersAndQuery,
  getAllJobFilterValues,
};
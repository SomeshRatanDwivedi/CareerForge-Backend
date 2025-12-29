import companyModels from "../models/company.models.js";
import { generateUniqueSlug } from "../utils/index.js";

const getCompanySettings = async (req, res) => {
  try {
    const { companySlug } = req.params;
    const settings = await companyModels.getCompanySettings(companySlug);
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.log(error, 'Error in getCompanySettings controller');
    res.status(500).json({ success: false, error: error.message });
  }
}

const saveCompanyData = async (req, res) => {
  try {
    const { companySlug } = req.params;
    const { brandTheme, sections, companyName } = req.body;

    await companyModels.saveCompanyData(companySlug, companyName, brandTheme, sections);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error, 'Error in saveCompanyData controller');
    res.status(500).json({ success: false, error: error.message });
  }
}

const loginCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    const company = await companyModels.getCompanyByName(companyName);
    if (company) {
      res.status(200).json({ success: true, data: company });
    } else {
     //create new company if not exists
      const companySlug = await generateUniqueSlug(companyName);
      const newCompany = await companyModels.addNewCompany(companyName, companySlug);
      res.status(200).json({ success: true, data: newCompany });
    }
  } catch (error) {
    console.log(error, 'Error in loginCompany controller');
    res.status(500).json({ success: false, error: error.message });
  }
}



export default {
  getCompanySettings,
  saveCompanyData,
  loginCompany,
};
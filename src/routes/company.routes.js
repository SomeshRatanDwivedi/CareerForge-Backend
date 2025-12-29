import express from 'express';
import companyControllers from '../controllers/company.controllers.js';

const router = express.Router();
router.get('/', (req, res) => {
  res.send('Company Routes');
});
router.get('/get-all-data/:companySlug', companyControllers.getCompanySettings);
router.post('/save-all-data/:companySlug', companyControllers.saveCompanyData);
router.post('/login', companyControllers.loginCompany);



export default router;
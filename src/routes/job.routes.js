import express from 'express';
import jobControllers from '../controllers/job.controllers.js';
const router = express.Router();
router.get('/', (req, res) => {
  res.send('Job Routes');
});

router.post('/get-jobs-by-filters/:companySlug', jobControllers.getJobsByFiltersAndQuery);
router.get('/filter-values/:companySlug', jobControllers.getAllJobFilterValues);

export default router;
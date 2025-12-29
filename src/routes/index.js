import express from 'express';
import jobRoutes from './job.routes.js';
import companyRoutes from './company.routes.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

router.use('/companies', companyRoutes);
router.use('/jobs', jobRoutes);

export default router;
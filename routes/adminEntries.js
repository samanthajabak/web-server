import { Router } from 'express';
import * as entriesController from '../controllers/entriesController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.get('/entries', requireAdmin, entriesController.adminIndex);

export default router;
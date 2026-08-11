import { Router } from 'express';
import * as entriesController from '../controllers/entriesController.js';
import { requireLogin } from '../middleware/requireLogin.js';

const router = Router();

router.get('/', entriesController.index);
router.post('/', requireLogin, entriesController.create);
router.post('/classic', requireLogin, entriesController.createClassic);
router.put('/:id', requireLogin, entriesController.update);
router.patch('/:id/favorite', entriesController.toggleFavorite);
router.delete('/:id', requireLogin, entriesController.destroy);

export default router;
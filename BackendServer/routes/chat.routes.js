import Router from 'express';

const router = Router();

router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Chat route is working' });
});

export default router;
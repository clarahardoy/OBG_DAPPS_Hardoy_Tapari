import express from 'express';

const router = express.Router({mergeParams: true});

router.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

export default router;
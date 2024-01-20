import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is characters');
});

router.post('/', (req, res) => {
    res.send('This is characters');
});

export default router;

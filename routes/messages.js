import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is messages');
});

router.post('/', (req, res) => {
    res.send('This is messages');
});

export default router;

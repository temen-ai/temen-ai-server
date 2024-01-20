import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('This is conversations');
});

router.post('/', (req, res) => {
    res.send('This is conversations');
});

export default router;

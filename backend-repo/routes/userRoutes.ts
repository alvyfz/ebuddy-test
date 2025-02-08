const express = require('express');
import { middleware } from '../middleware';
const router = express.Router();


router.get('/', middleware, (req: any, res: any) => {
    res.send('Test user');
});


module.exports = router;

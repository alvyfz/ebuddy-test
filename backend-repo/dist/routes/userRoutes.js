"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const middleware_1 = require("../middleware");
const router = express.Router();
router.get('/', middleware_1.middleware, (req, res) => {
    res.send('Test user');
});
module.exports = router;

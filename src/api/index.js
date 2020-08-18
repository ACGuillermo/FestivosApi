const express = require('express');

const router = express.Router();

const municipios = require('./municipios');
const ccaa = require('./ccaa');

// API entry point
router.get('/', (req, res) => {
    res.json({
        message: 'API entry point 👋👋.'
    })
})

router.use('/municipios', municipios);
router.use('/ccaa', ccaa);

module.exports = router;
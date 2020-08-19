const express = require('express');

const router = express.Router();

const municipios = require('./municipios');
const ccaa = require('./ccaa');
const fechas = require('./dates')

// API entry point
router.get('/', (req, res) => {
    res.json({
        message: 'API entry point 👋👋.'
    })
})

router.use('/municipios', municipios);
router.use('/ccaa', ccaa);
router.use('/fechas', fechas)

module.exports = router;
const express = require('express');

const router = express.Router();

// Todos los festivos de todos los municipios.
router.get('/', (req, res, next) => {
    res.json({
        message: "hello municipios"
    })
});

// Todos los festivos de un municipio.
router.get('/:municipio', (req, res, next) => {
    res.json({
        message: req.params.municipio
    })
})

module.exports = router;
const express = require('express');

const router = express.Router();

// Todos los municipios de todos los festivos.
router.get('/', (req, res, next) => {
    res.json({
        message: "hello municipios"
    })
});

// Todos los municipios donde es fiesta en una fecha.
router.get('/:date', (req, res, next) => {
    res.json({
        message: req.params.date
    })
})

module.exports = router;
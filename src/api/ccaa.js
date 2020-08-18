const express = require('express');

const router = express.Router();

// Todos los festivos de todos los municipios.
router.get('/', (req, res, next) => {
    res.json({
        message: "hello ccaa"
    })
});

module.exports = router;
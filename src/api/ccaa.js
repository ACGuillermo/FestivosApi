const express = require('express');

const router = express.Router();

// Todos los festivos de todos las cca.
router.get('/', (req, res, next) => {
    res.json({
        message: "hello ccaa"
    })
});

// Todos los festivos de una cca.
router.get('/:ccaa', (req, res, next) => {
    res.json({
        message: req.params.ccaa
    })
})

module.exports = router;
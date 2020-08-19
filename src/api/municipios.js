const express = require('express');
const monk = require('monk');

// DB
try {
    const db = monk(process.env.MONGO_URI);
const municipios = db.get('municipios');
} catch (error) {
    next(error)
}

// Loca cache - Not persistent
const municipiosCache = new Map();
const allMunicipiosCache = new Map();

const router = express.Router();

// Todos los festivos de todos los municipios.
router.get('/', async(req, res, next) => {
    if(allMunicipiosCache.has('all')) return res.json(allMunicipiosCache.get('all'))
    try {
        const items = await municipios.find({}, '-_id');
        res.json(items)
        allMunicipiosCache.set('all', items)
        db.close()
    } catch (error) {
        next(error)
    }
});

// Todos los festivos de un municipio.
router.get('/:municipio', async(req, res, next) => {
    const {municipio} = req.params;
    if(municipiosCache.has(municipio)) return res.json(municipiosCache.get(municipio).festivos)
    try {
        const item = await municipios.findOne({name: municipio})
        if(!item) return next()

        res.json(item.festivos)
        municipiosCache.set(municipio, item)
        db.close()
    } catch (error) {
        next(error)
    }
})

module.exports = router;
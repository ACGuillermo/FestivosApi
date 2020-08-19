const express = require('express');
const monk = require('monk');
const { DateTime } = require("luxon");

// DB
const db = monk(process.env.MONGO_URI);
const municipios = db.get('municipios');

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
    let {municipio} = req.params;
    municipio = municipio.replace(/_/g, ' ')

    console.log(municipio);

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

// Siguiente festivo de un municipio, dando la fecha inicial.
router.get('/:municipio/:fecha', async(req, res, next) => {
    const {fecha} = req.params
    let {municipio} = req.params
    municipio = municipio.replace(/_/g, ' ')
    
    try {
        const item = await municipios.findOne({name: municipio})

        if (!item) return next()

        const nextFestivo = item.festivos.find(f => {
            const dateNextFestivo = DateTime.fromISO(f);
            const dateClient = DateTime.fromISO(fecha)
            const diffDates = dateClient.diff(dateNextFestivo, ['months', 'days'])

            if(diffDates.months === 0 && diffDates.days === 0) return f
            else if(dateNextFestivo > dateClient) return f
        })
        res.json(nextFestivo)
    } catch (error) {
        next(error)
    }
})

module.exports = router;
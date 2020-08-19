const express = require('express');
const monk = require('monk');

// DB
try {
    const db = monk(process.env.MONGO_URI);
    const fechas = db.get('fechas');
} catch (error) {
    next(error)
}

// Loca cache - Not persistent
const datesCache = new Map();
const allDatesCache = new Map();

const router = express.Router();

// Todos los municipios de todos los festivos.
router.get('/', async(req, res, next) => {
    if(allDatesCache.has('all')) return res.json(allDatesCache.get('all'));
    try {
        const items = await fechas.find({}, '-_id');
        res.json(items)
        allDatesCache.set('all', items);
        db.close();
    } catch (error) {
        next(error)
    }
});

// Todos los municipios donde es fiesta en una fecha.
router.get('/:date', async(req, res, next) => {
    let {date} = req.params
    date += "T00:00"

    if(datesCache.has(date)) return res.json(datesCache.get(date).municipios);
    try {
        const item = await fechas.findOne({date:date});
        if(!item) return next()

        res.json(item.municipios);
        datesCache.set(date, item)
        db.close
    } catch (error) {
        next(error)
    }
})

module.exports = router;
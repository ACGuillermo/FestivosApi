const express = require('express');
const monk = require('monk');

// DB
const db = monk(process.env.MONGO_URI);
const ccaas = db.get('ccaa');

// Loca cache - Not persistent
const ccaaCache = new Map();
const allCcaaCache = new Map();

const router = express.Router();

// Todos los festivos de todos las cca.
router.get('/', async(req, res, next) => {
    if(allCcaaCache.has('all')) return res.json(allCcaaCache.get('all'))
    try {
        const items = await ccaas.find({}, '-_id');
        res.json(items)
        allCcaaCache.set('all', items)
        db.close()
    } catch (error) {
        next(error)
    }
});

// Todos los festivos de una cca.
router.get('/:ccaa', async(req, res, next) => {
    let {ccaa} = req.params;
    if(ccaaCache.has(ccaa)) return res.json(ccaaCache.get(ccaa))
    try {
        const item = await ccaas.findOne({name: ccaa}, '-_id')
        if(!item) return next()

        res.json(item)
        ccaaCache.set(ccaa, item)
        db.close()
    } catch (error) {
        next(error)
    }
})

module.exports = router;
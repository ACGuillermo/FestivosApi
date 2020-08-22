
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require("path");
const monk = require('monk');

require('dotenv').config();

// DB
const db = monk(process.env.MONGO_URI);
const fechas = db.get('fechas');

const middlewares = require('./middlewares');
const api = require('./api')

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));

app.set('view engine', 'ejs');

// TODO: Fix this mess.
app.get('/', async(req, res, next) => {
    try {

        const item = await fechas.aggregate( {$sample: {size: 1} } );

        let splitDate = item[0].date.split('-');
        splitDate = splitDate[2].replace('T00:00', '') +'/'+ splitDate[1]
        item[0].dateFormatted = splitDate
        let length = 0
        
        for (let i = 0; i < item[0].municipios.length; i++) {
           item[0].municipios[i] = " " + item[0].municipios[i] 
        }
        console.log(item[0].municipios[0])
        if(item[0].municipios.length > 3){
            length = item[0].municipios.length - 3
            item[0].municipios = [item[0].municipios[0], item[0].municipios[3], item[0].municipios[2]]
            item[0].leftOnes = length;
        }
        db.close
        res.render('index', {data: item[0]})

    } catch (error) {
        next(error)
    }
    
})


app.use('/api', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
var http = require('http');
var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

mongoose.connect('mongodb://localhost/pizzeria');

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cors({ origin: 'http://localhost' }));

var Schema = mongoose.Schema;

var Tipo = new Schema({
    tipID: String,
    nombre: String,
    nivel: Number
}, { collection: 'tipo' });

var Ingrediente = new Schema({
    proID: String,
    nombre: String
});

var Precio = new Schema({
    tipo: String,
    valor: Number
});

var Producto = new Schema({
    tipID: String,
    nombre: String,
    ingredientes: [Ingrediente],
    precios: [Precio],
    ingrediente: Boolean
}, { collection: 'producto' });

var tipoModelo = mongoose.model('Tipo', Tipo);
var productoModelo = mongoose.model('Producto', Producto);

app.get('/api/tipo', function (req, res) {
    tipoModelo.find(function (err, tipo) {
        if (!err) {
            res.send(tipo);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/tipo', function (req, res) {
    tipo = new tipoModelo({
        tipID: req.body.tipID,
        nombre: req.body.nombre,
        nivel: req.body.nivel
    });
    tipo.save(function (err) {
        if (!err) {
            console.log("Tipo creado: " + tipo._id);
        } else {
            console.log(err);
        }
    });
    res.json(tipo);
});

app.get('/api/tipo/:tipID', function (req, res) {
    tipoModelo.find({ 'tipID': req.params.tipID }, function (err, tipo) {
        if (!err) {
            res.send(tipo);
        } else {
            console.log(err);
        }
    });
});

app.get('/api/producto', function (req, res) {
    productoModelo.find(function (err, producto) {
        if (!err) {
            res.send(producto);
        } else {
            console.log(err);
        }
    });
});

app.get('/api/producto/:proID', function (req, res) {
    productoModelo.find({ '_id': req.params.proID }, function (err, producto) {
        if (!err) {
            res.send(producto);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/producto/ingrediente', function (req, res) {
    productoModelo.findOne({ '_id': req.body.proID }, function (err, producto) {
        if (!err) {
            producto.ingredientes = req.body.ingredientes;
            producto.save(function (err) {
                if (!err) {
                    console.log(req.body.ingredientes.length + " ingredientes agregados");
                } else {
                    console.log(err);
                }
            });
            res.json(producto);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/producto/precio', function (req, res) {
    productoModelo.findOne({ '_id': req.body.proID }, function (err, producto) {
        if (!err) {
            producto.precios = req.body.precios;
            producto.save(function (err) {
                if (!err) {
                    console.log(req.body.precios.length + " precios agregados");
                } else {
                    console.log(err);
                }
            });
            res.json(producto);
        } else {
            console.log(err);
        }
    });
});

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('Corriendo por puerto: ' + app.get('port'));
});

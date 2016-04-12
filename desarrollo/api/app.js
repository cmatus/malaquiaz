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
app.use(cors());

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

var ComandaPrecio = new Schema({
    tipo: String,
    valor: Number,
    seleccionado: Boolean
});

var ComandaIngrediente = new Schema({
    proID: String,
    nombre: String,
    incluido: Boolean
});

var ComandaItem = new Schema({
    proID: String,
    nombre: String,
    ingredientes: [ComandaIngrediente],
    agregados: [Ingrediente],
    precios: [ComandaPrecio],
    impreso: Boolean
});

var Comanda = new Schema({
    fecha: String,
    garzon: String,
    mesa: String,
    items: [ComandaItem]
}, { collection: 'comanda' });

var CuentaItem = new Schema({
    cantidad: Number,
    proID: String,
    nombre: String,
    valor: Number,
    total: Number
});

var Cuenta = new Schema({
    fecha: String,
    comID: String,
    total: Number,
    items: [CuentaItem]
}, { collection: 'cuenta' });

var Garzon = new Schema({
    rut: String,
    nombre: String,
    activo: Boolean
}, { collection: 'garzon' });

var tipoModelo = mongoose.model('Tipo', Tipo);
var productoModelo = mongoose.model('Producto', Producto);
var comandaModelo = mongoose.model('Comanda', Comanda);
var cuentaModelo = mongoose.model('Cuenta', Cuenta);
var garzonModelo = mongoose.model('Garzon', Garzon);

app.get('/api/garzon', function (req, res) {
    garzonModelo.find().sort('nombre').exec(function (err, garzon) {
        if (!err) {
            res.send(garzon);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/garzon', function (req, res) {
    garzon = new garzonModelo({
        rut: req.body.rut,
        nombre: req.body.nombre,
        activo: true
    });
    garzon.save(function (err) {
        if (!err) {
            console.log("Garzón creado: " + garzon._id);
        } else {
            console.log(err);
        }
    });
    res.json(garzon);
});

app.get('/api/tipo', function (req, res) {
    tipoModelo.find().sort('tipID').sort('nombre').exec(function (err, tipo) {
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
    tipoModelo.find({ 'tipID': req.params.tipID }).sort('nombre').exec(function (err, tipo) {
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

app.post('/api/producto', function (req, res) {
    producto = new productoModelo({
        tipID: req.body.tipID,
        nombre: req.body.nombre,
        ingredientes: null,
        precios: null,
        ingrediente: req.body.ingrediente
    });
    producto.save(function (err) {
        if (!err) {
            console.log("Producto creado: " + producto._id);
        } else {
            console.log(err);
        }
    });
    res.json(producto);
});

app.get('/api/producto/:proID', function (req, res) {
    productoModelo.findOne({ '_id': req.params.proID }).sort('nombre').exec(function (err, producto) {
        if (!err) {
            res.send(producto);
        } else {
            console.log(err);
        }
    });
});

app.get('/api/producto/tipo/:tipID', function (req, res) {
    productoModelo.find({ 'tipID': req.params.tipID }).sort('nombre').exec(function (err, producto) {
        if (!err) {
            res.send(producto);
        } else {
            console.log(err);
        }
    });
});

app.get('/api/producto/ingrediente/:ingrediente', function (req, res) {
    productoModelo.find({ 'ingrediente': req.params.ingrediente }).sort('nombre').exec(function (err, producto) {
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

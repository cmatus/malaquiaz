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

var PedidoPrecio = new Schema({
    tipo: String,
    valor: Number
});

var PedidoIngrediente = new Schema({
    proID: String,
    nombre: String,
    con: Number
});

var PedidoItem = new Schema({
    proID: String,
    tipID: String,
    nombre: String,
    ingredientes: [PedidoIngrediente],
    agregados: [Ingrediente],
    precio: [PedidoPrecio],
    impreso: Boolean
});

var Pedido = new Schema({
    cueID: String,
    fecha: String,
    garzon: String,
    mesa: String,
    items: [PedidoItem]
}, { collection: 'pedido' });

var CuentaItem = new Schema({
    cantidad: Number,
    proID: String,
    nombre: String,
    tipo: String,
    valor: Number,
    total: Number
});

var Cuenta = new Schema({
    fecha: String,
    pedID: String,
    total: Number,
    mesa: Number,
    garzon: String,
    items: [CuentaItem]
}, { collection: 'cuenta' });

var Garzon = new Schema({
    rut: String,
    nombre: String,
    activo: Boolean
}, { collection: 'garzon' });

var Mesa = new Schema({
    numero: Number,
    estado: Number
}, { collection: 'mesa' });

var tipoModelo = mongoose.model('Tipo', Tipo);
var productoModelo = mongoose.model('Producto', Producto);
var pedidoModelo = mongoose.model('Pedido', Pedido);
var cuentaModelo = mongoose.model('Cuenta', Cuenta);
var garzonModelo = mongoose.model('Garzon', Garzon);
var mesaModelo = mongoose.model('Mesa', Mesa);

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

app.get('/api/mesa', function (req, res) {
    mesaModelo.find().sort('numero').exec(function (err, mesa) {
        if (!err) {
            res.json(mesa);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/mesa', function (req, res) {
    mesa = new mesaModelo({
        numero: req.body.numero,
        estado: req.body.estado
    });
    mesa.save(function (err) {
        if (!err) {
            console.log("Mesa creada: " + mesa._id);
        } else {
            console.log(err);
        }
    });
    res.json(mesa);
});

app.post('/api/mesa/:numero', function (req, res) {
    mesaModelo.findOne({ 'numero': req.params.numero }, function (err, mesa) {
        if (!err) {
            mesa.estado = req.body.estado;
            mesa.save(function (err) {
                if (!err) {
                    console.log("Estado de la mesa modificado");
                } else {
                    console.log(err);
                }
            });
            res.json(mesa);
        } else {
            console.log(err);
        }
    });
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

app.post('/api/pedido', function (req, res) {
    pedido = new pedidoModelo({
        fecha: req.body.fecha,
        garzon: req.body.garzon,
        mesa: req.body.mesa,
        items: req.body.items
    });
    pedido.save(function (err) {
        if (!err) {
            console.log("Pedido creado: " + pedido._id);
        } else {
            console.log(err);
        }
    });
    res.json(pedido);
});

app.get('/api/pedido/:pedID', function (req, res) {
    pedidoModelo.findOne({ '_id': req.params.pedID }, function (err, pedido) {
        if (!err) {
            res.json(pedido);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/pedido/:pedID', function (req, res) {
    pedidoModelo.findOne({ '_id': req.body.pedID }, function (err, pedido) {
        if (!err) {
            pedido.cueID = req.body.cueID;
            pedido.items = req.body.items;
            pedido.save(function (err) {
                if (!err) {
                    console.log("Items impresos");
                } else {
                    console.log(err);
                }
            });
            res.json(pedido);
        } else {
            console.log(err);
        }
    });
});

app.get('/api/pedido/mesa/:mesID', function (req, res) {
    pedidoModelo.findOne({ 'mesa': req.params.mesID, 'cueID': '' }, function (err, pedido) {
        if (!err) {
            res.json(pedido);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/cuenta', function (req, res) {
    cuenta = new cuentaModelo({
        fecha: req.body.fecha,
        pedID: req.body.pedID,
        total: req.body.total,
        mesa: req.body.mesa,
        garzon: req.body.garzon,
        items: req.body.items
    });
    cuenta.save(function (err) {
        if (!err) {
            console.log("Cuenta creada: " + cuenta._id);
        } else {
            console.log(err);
        }
    });
    res.json(cuenta);
});

if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('Corriendo por puerto: ' + app.get('port'));
});

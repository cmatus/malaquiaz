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

var Ingrediente = new Schema({
    proID: Number,
    nombre: String
});

var Precio = new Schema({
    tipo: String,
    valor: Number
});

var PedidoPrecio = new Schema({
    tipo: Number,
    valor: Number
});

var PedidoIngrediente = new Schema({
    proID: Number,
    nombre: String,
    con: Number
});

var PedidoItem = new Schema({
    proID: Number,
    tipID: Number,
    nombre: String,
    ingredientes: [PedidoIngrediente],
    agregados: [Ingrediente],
    precio: [PedidoPrecio],
    impreso: Boolean
});

var CuentaItem = new Schema({
    cantidad: Number,
    proID: Number,
    nombre: String,
    tipo: String,
    valor: Number,
    total: Number
});

var Garzon = new Schema({
    _id: Number,
    rut: String,
    nombre: String,
    activo: Boolean
}, { collection: 'garzon', versionKey: false, _id: false });

var Mesa = new Schema({
    _id: Number,
    estado: Number
}, { collection: 'mesa', versionKey: false, _id: false });

var Tipo = new Schema({
    _id: Number,
    tipID: Number,
    nombre: String,
    nivel: Number
}, { collection: 'tipo', versionKey: false, _id: false });

var Producto = new Schema({
    _id: Number,
    tipID: Number,
    nombre: String,
    ingredientes: [Ingrediente],
    precios: [Precio],
    ingrediente: Boolean
}, { collection: 'producto', versionKey: false, _id: false });

var Pedido = new Schema({
    _id: Number,
    cueID: Number,
    fecha: String,
    garzon: String,
    mesa: Number,
    items: [PedidoItem]
}, { collection: 'pedido', versionKey: false, _id: false });

var Cuenta = new Schema({
    _id: Number,
    fecha: String,
    pedID: Number,
    total: Number,
    mesa: Number,
    garzon: String,
    items: [CuentaItem]
}, { collection: 'cuenta', versionKey: false, _id: false });

Garzon.pre('save', function(next) {
    var doc = this;
    if(doc._id == null) {
        var newDoc = garzonModelo.findOne().sort('-_id').exec(function(err, item) {
            doc._id = (item == null ? 0 : item._id) + 1;
            next();
        });
    } else {
        next();
    }
});

Mesa.pre('save', function(next) {
    var doc = this;
    if(doc._id == null) {
        var newDoc = mesaModelo.findOne().sort('-_id').exec(function(err, item) {
            doc._id = (item == null ? 0 : item._id) + 1;
            next();
        });
    } else { 
        next();
    }
});

Tipo.pre('save', function(next) {
    var doc = this;
    if(doc._id == null) {
        var newDoc = tipoModelo.findOne().sort('-_id').exec(function(err, item) {
            doc._id = (item == null ? 0 : item._id) + 1;
            next();
        });
    } else {
        next();
    }
});

Producto.pre('save', function(next) {
    var doc = this;
    if(doc._id == null) {
        var newDoc = productoModelo.findOne().sort('-_id').exec(function(err, item) {
            doc._id = (item == null ? 0 : item._id) + 1;
            next();
        });
    } else {
        next();
    }
});

Pedido.pre('save', function(next) {
    console.log("Pre");
    var doc = this;
    var newDoc = pedidoModelo.findOne().sort('-_id').exec(function(err, item) {
        doc._id = (item == null ? 0 : item._id) + 1;
        next();
    });
});

Cuenta.pre('save', function(next) {
    console.log("Pre");
    var doc = this;
    var newDoc = cuentaModelo.findOne().sort('-_id').exec(function(err, item) {
        doc._id = (item == null ? 0 : item._id) + 1;
        next();
    });
});

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
        estado: req.body.estado
    });
    mesa.save(function (err) {
        if (!err) {
            console.log("Mesa N°" + mesa._id + " creada");
        } else {
            console.log(err);
        }
    });
    res.json(mesa);
});

app.post('/api/mesa/:_id', function (req, res) {
    mesaModelo.findById(req.params._id, function (err, mesa) {
        if (!err) {
            mesa.estado = req.body.estado;
            mesa.save(function (err) {
                if (!err) {
                    console.log("Estado de la mesa N°" + mesa._id + " modificado");
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

app.get('/api/producto/:_id', function (req, res) {
    productoModelo.findById(req.params._id).sort('nombre').exec(function (err, producto) {
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
    productoModelo.findById(req.body.proID, function (err, producto) {
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
    productoModelo.findById(req.body.proID, function (err, producto) {
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

app.post('/api/productos', function (req, res) {
    for(var x = 0; x < req.body.data.length; x++) {
        producto = new productoModelo({
            _id: req.body.data[x]._id,
            tipID: req.body.data[x].tipID,
            nombre: req.body.data[x].nombre,
            ingredientes: null,
            precios: null,
            ingrediente: req.body.data[x].ingrediente
        });
        producto.save(function (err) {
            if (!err) {
                console.log("Producto creado");
            } else {
                console.log(err);
            }
        });
    }
    res.send(req.body.data.length + " registros agregados");
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

app.get('/api/pedido/:_id', function (req, res) {
    pedidoModelo.findById(req.params._id, function (err, pedido) {
        if (!err) {
            res.json(pedido);
        } else {
            console.log(err);
        }
    });
});

app.post('/api/pedido/:_id', function (req, res) {
    pedidoModelo.findById(req.body._id, function (err, pedido) {
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

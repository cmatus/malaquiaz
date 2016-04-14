var gIP = "localhost";
var gPuerto = "3000";
var gURL = "http://" + gIP + ":" + gPuerto + "/api";
var gURLImpresion = "http://" + gIP + "/impresion/wsImprime.asmx";

var jsonGarzon = {};
var jsonTipo = {};
var jsonProducto = {};
var jsonPedidoItem = {};

var jsonGarzones = [];
var jsonTipos = [];
var jsonProductos = [];
var jsonPedido = {};

var jsonEstado = [
    { 'estado': 'Disponible', 'estilo': 'estadoDIS' },
    { 'estado': 'En atención', 'estilo': 'estadoATE' },
    { 'estado': 'Solicitando cuenta', 'estilo': 'estadoCTA' },
    { 'estado': 'Cuenta emitida', 'estilo': 'estadoEMI' }
];

function apiGetGarzon() {
    return apiGET(gURL + "/garzon");
}

function apiGetTipo() {
    return apiGET(gURL + "/tipo");
}

function apiGetTipoID(tipID) {
    return apiGET(gURL + "/tipo/" + tipID);
}

function apiGetProducto() {
    return apiGET(gURL + "/producto");
}

function apiGetProductoID(proID) {
    return apiGET(gURL + "/producto/" + proID);
}

function apiGetProductoPorTipo(tipID) {
    return apiGET(gURL + "/producto/tipo/" + tipID);
}

function apiGetProductoEsIngrediente(ingrediente) {
    return apiGET(gURL + "/producto/ingrediente/" + ingrediente);
}

function apiPostPedido(json) {
	if(json.pedID != "") {
		return apiPOST(gURL + "/pedido/" + json.pedID, json);
	} else {
    	return apiPOST(gURL + "/pedido", json);
	}
}

function apiPostCuenta(json) {
    return apiPOST(gURL + "/cuenta", json);
}

function apiGetPedidoMesa(mesa) {
    return apiGET(gURL + "/pedido/mesa/" + mesa);
}

function apiGetMesa() {
    return apiGET(gURL + "/mesa");
}

function apiPostMesa(mesa, estado) {
    var info = { 'estado': estado }
    return apiPOST(gURL + "/mesa/" + mesa, info);
}
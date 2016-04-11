var jsonTipos = [];
var jsonProducto = {};
var jsonProductos = [];
var jsonPedido = [];
var jsonPedidoItem = {};

var numItem = -1;

$(document).ready(function () {
    nuevo();
});

function nuevo() {
    
    jsonTipos = [];
    jsonProducto = {};
    jsonPedidoItem = {};

    $("#divPedido").css("display", "none");
    $("#divProducto").css("display", "block");
    $("#butNuevo").css("display", "inline-block");
    $("#butAgrega").css("display", "inline-block");

    numItem = -1;
    listarTipos("<inicio>");

}

function agregar() {
    jsonPedidoItem = serializar();
    if (jsonPedidoItem != null) {
        if (numItem >= 0) {
            jsonPedido[numItem] = jsonPedidoItem;
        } else {
            jsonPedido.push(jsonPedidoItem);
        }
        ver();
    }
}

function ver() {

    var cHTML = "";
    $("#divPedido").html("");
    for (var x = 0; x < jsonPedido.length; x++) {
        cHTML += "<button class='pedidoItem' onclick='deSerializar(" + x + ")'>";
        cHTML += "<div class='producto'>" + jsonPedido[x].nombre + " - " + jsonPedido[x].precio.tipo + "</div>";
        for (var y = 0; y < jsonPedido[x].ingredientes.length; y++) {
            if (jsonPedido[x].ingredientes[y].con == 0) {
                cHTML += "<div class='ingrediente'>s/" + jsonPedido[x].ingredientes[y].nombre + "</div>";
            }
        }
        for (var y = 0; y < jsonPedido[x].agregados.length; y++) {
            cHTML += "<div class='ingrediente'>" + jsonPedido[x].agregados[y].nombre + "</div>";
        }
        cHTML += "</button>";
    }

    $("#divPedido").html(cHTML);
    $("#divPedido").css("display", "block");
    $("#divProducto").css("display", "none");

}

function deSerializar(item) {
    try {
        numItem = item;
        var json = jsonPedido[numItem];
        if (json != null) {
            listarTipos(json.tipID);
            desplegarProducto(json._id);
            //despliegaPantalla(4);
            for (var x = 0; x < json.ingredientes.length; x++) {
                $("#butIngredienteItem_" + json.ingredientes[x].proID).removeClass("itemSin");
                $("#butIngredienteItem_" + json.ingredientes[x].proID).removeClass("item");
                $("#butIngredienteItem_" + json.ingredientes[x].proID).addClass((json.ingredientes[x].con == 0 ? "itemSin" : "item"));
            }
            /*
            for (var x = 0; x < json.agregados.length; x++) {
                agregaIngrediente($("#butAgregadoItem_" + json.agregados[x].proID)[0]);
            }
            cambiaPrecio($("#butPrecioItem_" + json.precio.tipo)[0]);
            $("#divPedido").css("display", "none");
            $("#divProducto").css("display", "block");
            */
        }
        return true;
    } catch (e) {
        return false;
    }
}

function serializar() {

    try {

        var retorno = null;
        if (jsonProducto._id != null) {

            var jsonPrecio = {};
            var jsonIngredientes = [];
            var jsonAgregados = [];
            var json = {};

            $("#divPrecios button").each(function () {
                if ($(this).attr("class") == "item") {
                    var prec = $(this).attr("id").split("_");
                    jsonPrecio = {
                        'tipo': prec[1],
                        'valor': prec[2]
                    };
                }
            });

            var jsonIngrediente = {};
            var ing;
            $("#divIngredientes button").each(function () {
                ing = $(this).attr("id").split("_");
                jsonIngrediente = {
                    'proID': ing[1],
                    'nombre': $(this).html(),
                    'con': ($(this).attr("class") == "item" ? 1 : 0)
                };
                jsonIngredientes.push(jsonIngrediente);
            });

            var jsonAgregado = {};
            var agr;
            $("#divAgregados button").each(function () {
                if ($(this).attr("class") == "item") {
                    agr = $(this).attr("id").split("_");
                    jsonAgregado = {
                        'proID': agr[1],
                        'nombre': $(this).html()
                    };
                    jsonAgregados.push(jsonAgregado);
                }
            });

            json = {
                'proID': jsonProducto._id,
                'tipID': jsonProducto.tipID,
                'nombre': jsonProducto.nombre,
                'ingredientes': jsonIngredientes,
                'agregados': jsonAgregados,
                'precio': jsonPrecio
            }
            retorno = json;

        }
        return retorno;

    } catch (e) {
        return null;
    }

}

function listarTipos(tipo) {

    $("#divMenu").html("");
    $("#divIngredientes").html("");
    $("#divAgregados").html("");
    $("#divPrecios").html("");
    
    var json = apiTipoTipID(tipo);
    if (json.length > 0) {
        jsonTipos = json;
        for (var x = 0; x < json.length; x++) {
            $("#divMenu").append("<button class='menu' id='button_" + json[x]._id + "' onclick='listarTipos(\"" + json[x]._id + "\")'>" + json[x].nombre + "</button>");
        }
    } else {
        var json = apiProductoID(tipo);
        if (json != null) {
            jsonProductos = json;
            for (var x = 0; x < json.length; x++) {
                $("#divMenu").append("<button class='menu' id='button_" + json[x]._id + "' onclick='desplegarProducto(\"" + json[x]._id + "\")'>" + json[x].nombre + "</button>");
            }
        }
    }
    
}

function desplegarProducto(id) {
    for(var x = 0; x < jsonProductos.length; x++) {
        if(jsonProductos[x]._id == id) {
            jsonProducto = jsonProductos[x];
        }
    }
    if (jsonProducto.ingredientes != null) {
        for (var x = 0; x < jsonProducto.ingredientes.length; x++) {
            $("#divIngredientes").append("<button id='buttonIngrediente_" + jsonProducto.ingredientes[x]._id + "'>" + jsonProducto.ingredientes[x].nombre + "</button>");
        }
    }
    listarAgregados();
    if (jsonProducto.precios != null) {
        for (var x = 0; x < jsonProducto.precios.length; x++) {
            $("#divPrecios").append("<button id='buttonPrecio_" + jsonProducto.precios[x].tipo + "_" + jsonProducto.precios[x].valor + "'>" + jsonProducto.precios[x].tipo + " $" + jsonProducto.precios[x].valor + "</button>");
        }
    }
    $("#divIngredientes").seleccion(2, true);
    $("#divAgregados").seleccion(2, false);
    $("#divPrecios").seleccion(1, true);
}

function listarAgregados() {
    var json = apiTipoIngrediente();
    for (var x = 0; x < json.length; x++) {
        if (jsonProducto.ingredientes != null) {
            enc = false;
            for (var y = 0; y < jsonProducto.ingredientes.length; y++) {
                if (jsonProducto.ingredientes[y].proID == json[x]._id) {
                    enc = true;
                }
            }
        } else {
            enc = true;
        }
        if (!enc) {
            $("#divAgregados").append("<button id='buttonAgregado_" + json[x]._id + "'>" + json[x].nombre + "</button>");
        }
    }
}

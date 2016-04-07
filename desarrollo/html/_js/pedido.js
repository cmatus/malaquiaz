var jsonTipos = [];
var jsonProducto = {};
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
        cHTML += "<div class='producto'>" + jsonPedido[x].nombre + " - " + jsonPedido[x].precio.catNombre + "</div>";
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
            desplegarProducto(json.id);
            /*
            despliegaPantalla(4);
            for (var x = 0; x < json.ingredientes.length; x++) {
                $("#butIngredienteItem_" + json.ingredientes[x].id).removeClass("itemSin");
                $("#butIngredienteItem_" + json.ingredientes[x].id).removeClass("item");
                $("#butIngredienteItem_" + json.ingredientes[x].id).addClass((json.ingredientes[x].con == 0 ? "itemSin" : "item"));
            }
            for (var x = 0; x < json.agregados.length; x++) {
                agregaIngrediente($("#butAgregadoItem_" + json.agregados[x].id)[0]);
            }
            cambiaPrecio($("#butPrecioItem_" + json.precio.id)[0]);
            */
            $("#divPedido").css("display", "none");
            $("#divProducto").css("display", "block");
        }
        return true;
    } catch (e) {
        return false;
    }
}

function serializar() {

    try {

        var retorno = null;
        if (jsonProducto.ID != null) {

            var jsonPrecio = {};
            var jsonIngredientes = [];
            var jsonAgregados = [];
            var json = {};

            $("#divPrecios button").each(function () {
                if ($(this).attr("class") == "item") {
                    var prec = $(this).attr("id").split("_");
                    jsonPrecio = {
                        'catID': prec[1],
                        'catNombre': prec[2],
                        'catValor': prec[3]
                    };
                }
            });

            var jsonIngrediente = {};
            var ing;
            $("#divIngredientes button").each(function () {
                ing = $(this).attr("id").split("_");
                jsonIngrediente = {
                    'id': ing[1],
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
                        'id': agr[1],
                        'nombre': $(this).html()
                    };
                    jsonAgregados.push(jsonAgregado);
                }
            });

            json = {
                'id': jsonProducto.ID,
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

    $("#divIngredientes").html("");
    $("#divAgregados").html("");
    $("#divPrecios").html("");
    
    var json = apiTipoTipID(tipo);
    if (json != null) {
        jsonTipos = json;
        $("#divMenu").html("");
        for (var x = 0; x < json.length; x++) {
            $("#divMenu").append("<button class='menu' id='button_" + json[x]._id + "' onclick='listarTipos(\"" + json[x]._id + "\")'>" + json[x].nombre + "</button>");
        }
    } else {
        var json = apiTipoID(tipo);
        if (json != null) {
            jsonProducto = json;
            var json = apiTipoTipID(80);
            if (json != null) {
                jsonIngrediente = json;
                desplegarProducto();
            }
        }
    }
    
}

function desplegarProducto() {
    if (jsonProducto.ingredientes != null) {
        for (var x = 0; x < jsonProducto.ingredientes.length; x++) {
            $("#divIngredientes").append("<button id='buttonIngrediente_" + jsonProducto.ingredientes[x].ID + "'>" + jsonProducto.ingredientes[x].nombre + "</button>");
        }
    }
    listarAgregados();
    if (jsonProducto.precios != null) {
        for (var x = 0; x < jsonProducto.precios.length; x++) {
            $("#divPrecios").append("<button id='buttonPrecio_" + jsonProducto.precios[x].catID + "_" + jsonProducto.precios[x].catNombre + "_" + jsonProducto.precios[x].valor + "'>" + jsonProducto.precios[x].catNombre + " $" + jsonProducto.precios[x].valor + "</button>");
        }
    }
    $("#divIngredientes").seleccion(2, true);
    $("#divAgregados").seleccion(2, false);
    $("#divPrecios").seleccion(1, true);
}

function listarAgregados() {
    var enc = false;
    for (var x = 0; x < jsonIngrediente.length; x++) {
        if (jsonProducto.ingredientes != null) {
            enc = false;
            for (var y = 0; y < jsonProducto.ingredientes.length; y++) {
                if (jsonProducto.ingredientes[y].ID == jsonIngrediente[x].ID) {
                    enc = true;
                }
            }
        } else {
            enc = true;
        }
        if (!enc) {
            $("#divAgregados").append("<button id='buttonAgregado_" + jsonIngrediente[x].ID + "'>" + jsonIngrediente[x].nombre + "</button>");
        }
    }
}

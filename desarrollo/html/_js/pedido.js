var numItem = -1;

$(document).ready(function () {
    garzonDesplegar();
    verPantalla(1);
});

function verPantalla(num) {

    $("#divGarzon").css("display", "none");
    $("#divMesa").css("display", "none");
    $("#divPedido").css("display", "none");
    $("#divProducto").css("display", "none");

    $("#butProductoLimpiar").css("display", "none");
    $("#butProductoAgregar1").css("display", "none");
    $("#butProductoAgregar2").css("display", "none");
    $("#butProductoEliminar").css("display", "none");
    $("#butProductoVer").css("display", "none");
    $("#butPedidoLimpiar").css("display", "none");
    $("#butPedidoAgregar").css("display", "none");
    $("#butPedidoEliminar").css("display", "none");
    $("#butPedidoEnviar").css("display", "none");

    switch(num) {
        case 1: /* Garzón */
            $("#divGarzon").css("display", "block");
            break;
        case 2: /* Mesa */
            $("#divMesa").css("display", "block");
            break;
        case 3: /* Producto */
            $("#divProducto").css("display", "block");
            $("#butProductoLimpiar").css("display", "inline-block");
            $("#butProductoAgregar1").css("display", "inline-block");
            $("#butProductoAgregar2").css("display", "inline-block");
            $("#butProductoEliminar").css("display", "inline-block");
            $("#butProductoVer").css("display", "inline-block");
            break;
        case 4: /* Pedido */
            $("#divPedido").css("display", "block");
            $("#butPedidoLimpiar").css("display", "inline-block");
            $("#butPedidoAgregar").css("display", "inline-block");
            $("#butPedidoEliminar").css("display", "inline-block");
            $("#butPedidoEnviar").css("display", "inline-block");
            break;
    }

}

/* Mesa */

function mesaDesplegar(nombre) {
    
    $("#divMesa").html("");
    pedidoLimpiar();
    jsonPedido.garzon = nombre;

    var json = apiGetMesa();
    if(json != null) {
        verPantalla(2);
        for(var x = 0; x <= json.length; x++) {
            $("#divMesa").append("<button onclick='desplegarPedido(" + json[x].numero + ")' class='" + jsonEstado[json[x].estado].estilo + "'>Mesa N°" + json[x].numero + "</button>")
        }
    }

}

function desplegarPedido(mesa) {
    var json = apiGetPedidoMesa(mesa);
    if(json != null) {
        jsonPedido = json;
        jsonPedido.pedID = json._id;
    } else {
        jsonPedido.mesa = mesa;
    }
    pedidoVer();
}

/* Garzón */

function garzonDesplegar() {
    $("#divGarzon").html("");
    jsonGarzones = apiGetGarzon();
    for(var x = 0; x < jsonGarzones.length; x++) {
        $("#divGarzon").append("<button onclick='mesaDesplegar(\"" + jsonGarzones[x].nombre + "\")'>" + jsonGarzones[x].nombre + "</button>")
    }
}

/* Pedido */

function pedidoLimpiar() {
    jsonPedido = {
        'pedID': '',
        'cueID': '',
        'fecha': '',
        'garzon': '',
        'mesa': 0,
        'items': []
    };
    $("#divPedido").html("");
    verPantalla(1);
}

function pedidoAgregar() {
    productoLimpiar(false, -1);
    listarTipos("<inicio>");
    verPantalla(3);
}

function pedidoVer() {
    var cHTML = "";
    var itemsImpresos = 0;
    $("#divPedido").html("");
    for (var x = 0; x < jsonPedido.items.length; x++) {
        itemsImpresos = itemsImpresos + (jsonPedido.items[x].impreso ? 1 : 0);
        cHTML += "<button class='pedidoItem" + (jsonPedido.items[x].impreso ? "Impreso" : "") + "' onclick='deserializarPedidoItem(" + x + ")'>";
        cHTML += "<div class='producto'>" + jsonPedido.items[x].nombre + " - " + jsonPedido.items[x].precio[0].tipo + "</div>";
        for (var y = 0; y < jsonPedido.items[x].ingredientes.length; y++) {
            if (jsonPedido.items[x].ingredientes[y].con == 0) {
                cHTML += "<div class='ingrediente'>s/" + jsonPedido.items[x].ingredientes[y].nombre + "</div>";
            }
        }
        for (var y = 0; y < jsonPedido.items[x].agregados.length; y++) {
            cHTML += "<div class='ingrediente'>" + jsonPedido.items[x].agregados[y].nombre + "</div>";
        }
        cHTML += "</button>";
    }
    $("#divPedido").html(cHTML);
    verPantalla(4);
    if(jsonPedido.items.length > 0) {
        $("#butPedidoEnviar").css("display", "none");
        $("#butPedidoCuenta").css("display", "none");
        if(itemsImpresos == jsonPedido.items.length) {
            $("#butPedidoCuenta").css("display", "inline-block");
        } else {
            $("#butPedidoEnviar").css("display", "inline-block");
        }
    }
}

function deserializarPedidoItem(item) {
    try {
        numItem = item;
        var json = jsonPedido.items[numItem];
        if (json != null) {
            productoLimpiar(false, numItem);
            listarTipos(json.tipID);
            desplegarProducto(json.proID);
            for (var x = 0; x < json.ingredientes.length; x++) {
                $("#buttonIngrediente_" + json.ingredientes[x].proID).removeClass("item");
                if(json.ingredientes[x].con == 1) {
                    $("#buttonIngrediente_" + json.ingredientes[x].proID).addClass("item");
                }
            }
            for (var x = 0; x < json.agregados.length; x++) {
                agregaIngrediente($("#buttonAgregado_" + json.agregados[x].proID));
            }
            cambiaPrecio($("#buttonPrecio_" + json.precio[0].tipo + "_" + json.precio[0].valor));
            $("#divIngredientes").acomoda();
            $("#divAgregados").acomoda();
            $("#divPrecios").acomoda();
            verPantalla(3);
        }
        return true;
    } catch (e) {
        return false;
    }
}

function pedidoEnviar() {
    
    var f = new Date();
    var fecha = zeroFill(f.getDate(), 2) + "/" + zeroFill((f.getMonth() + 1), 2) + "/" + f.getFullYear() + " " + zeroFill(f.getHours(), 2) + ":" + zeroFill(f.getMinutes(), 2);
    jsonPedido.fecha = fecha;
    
    var data = apiPostPedido(jsonPedido);
    if(data._id != null) {
        jsonPedido.pedID = data._id;
        if(pedidoImprimir()) {
            verPantalla(1);
        }
    }
    
}

function pedidoImprimir() {
    
    var retorno = false;
    var imprimir = false;
    if(jsonPedido.items.length > 0) {

        var jsonBoleta = [];

        jsonBoleta.push("----------------- Comanda ----------------");
        jsonBoleta.push("Atendida por: " + jsonPedido.garzon);
        jsonBoleta.push("Mesa N°" + jsonPedido.mesa);
        jsonBoleta.push("Fecha/Hora: " + jsonPedido.fecha);
        jsonBoleta.push("------------------------------------------");
        jsonBoleta.push(" ");

        for(var x = 0; x < jsonPedido.items.length; x++) {
            if(!jsonPedido.items[x].impreso) {
                imprimir = true;
                jsonBoleta.push(jsonPedido.items[x].nombre + " " + jsonPedido.items[x].precio[0].tipo);
                for(var y = 0; y < jsonPedido.items[x].ingredientes.length; y++) {
                    if(jsonPedido.items[x].ingredientes[y].con == 0) {
                        jsonBoleta.push("   s/" + jsonPedido.items[x].ingredientes[y].nombre);
                    }
                }
                if(jsonPedido.items[x].agregados.length > 0) {
                    jsonBoleta.push(" ");
                    for(var y = 0; y < jsonPedido.items[x].agregados.length; y++) {
                        jsonBoleta.push("   + " + jsonPedido.items[x].agregados[y].nombre);
                    }
                }
                jsonBoleta.push(" ");
            }
        }
        jsonBoleta.push("--------------- Fin Comanda---------------");

        if(imprimir) {
            var info = { 
                'texto': jsonBoleta, 
                'corte': true, 
                'apertura': false, 
                'tipo': 'tcp'
            }
            /*
            var parametro = RetornaAJAX(gURLImpresion, "imprimir", JSON.stringify(info), null);
            $.when($.ajax(parametro)).done(function (a) {
                if (a.d != null) {
            */
                    for(var x = 0; x < jsonPedido.items.length; x++) {
                        jsonPedido.items[x].impreso = true;
                    }
                    var data = apiPostPedido(jsonPedido);
                    if(data._id != null) {
                        retorno = true;
                    }
            /*
                }
            });
            */
        } else {
            retorno = true;
        }

    }
    return retorno;

}

function pedidoCuenta() {

    var f = new Date();
    var fecha = zeroFill(f.getDate(), 2) + "/" + zeroFill((f.getMonth() + 1), 2) + "/" + f.getFullYear() + " " + zeroFill(f.getHours(), 2) + ":" + zeroFill(f.getMinutes(), 2);
    var total = 0;

    var jsonCuenta = {
        fecha: fecha,
        pedID: jsonPedido._id,
        total: 0,
        mesa: jsonPedido.mesa,
        garzon: jsonPedido.garzon,
        items: []
    }

    total = 0;
    for(var x = 0; x < jsonPedido.items.length; x++) {
        jsonCuenta.items.push({
            cantidad: 1,
            proID: jsonPedido.items[x].proID,
            nombre: jsonPedido.items[x].nombre,
            tipo: jsonPedido.items[x].precio[0].tipo,
            valor: jsonPedido.items[x].precio[0].valor,
            total: jsonPedido.items[x].precio[0].valor
        });
        total = total + parseInt(jsonPedido.items[x].precio[0].valor);
    }
    jsonCuenta.total = total;
    var data = apiPostCuenta(jsonCuenta);
    if(data._id != null) {
        jsonPedido.cueID = data._id;
        data = apiPostPedido(jsonPedido);
        if(data._id != null) {
            verPantalla(1);
        }
    }

}

/* Producto */

function productoLimpiar(tipo, num) {
    
    jsonTipos = [];
    jsonProducto = {};
    jsonProductos = [];
    jsonPedidoItem = {};
    numItem = num;

    $("#divMenu").html("");
    $("#divIngredientes").html("");
    $("#divAgregados").html("");
    $("#divPrecios").html("");

    if(tipo) {
        listarTipos("<inicio>");
    }

}

function productoAgregar(tipo) {
    jsonPedidoItem = serializarProducto(tipo);
    if (jsonPedidoItem != null) {
        if (numItem >= 0) {
            jsonPedido.items[numItem] = jsonPedidoItem;
        } else {
            jsonPedido.items.push(jsonPedidoItem);
        }
        pedidoVer();
    }
}

function serializarProducto(tipo) {

    try {

        var retorno = null;
        if (jsonProducto._id != null) {

            var jsonPrecio = [];
            var jsonIngredientes = [];
            var jsonAgregados = [];
            var json = {};

            $("#divPrecios button").each(function () {
                if ($(this).attr("class") == "item") {
                    var prec = $(this).attr("id").split("_");
                    jsonPrecio.push({
                        'tipo': prec[1],
                        'valor': prec[2]
                    });
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
                'nombre': (tipo == 2 ? "(1/2)": "") + jsonProducto.nombre,
                'ingredientes': jsonIngredientes,
                'agregados': jsonAgregados,
                'precio': jsonPrecio,
                'impreso': false
            }
            retorno = json;
            
        }
        return retorno;

    } catch (e) {
        return null;
    }

}

function listarTipos(tipID) {
    productoLimpiar(false, numItem);
    var json = apiGetTipoID(tipID);
    if (json.length > 0) {
        jsonTipos = json;
        for (var x = 0; x < json.length; x++) {
            $("#divMenu").append("<button class='menu' id='button_" + json[x]._id + "' onclick='listarTipos(\"" + json[x]._id + "\")'>" + json[x].nombre + "</button>");
        }
    } else {
        var json = apiGetProductoPorTipo(tipID);
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
    var json = apiGetProductoEsIngrediente(true);
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

function agregaIngrediente(obj) {
    if (obj.attr("class") == "item") {
        obj.removeClass("item");
    } else {
        obj.addClass("item");
    }
}

function cambiaPrecio(obj) {
    var objButtons = $("#divPrecios").find("button");
    objButtons.removeClass("item");
    obj.addClass("item");
}
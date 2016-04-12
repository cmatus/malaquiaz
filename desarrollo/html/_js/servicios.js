var gURL = "http://192.168.0.10:3000/api";

function apiTipoTipID(tipID) {
    var retorno = null;
    $.get(gURL + "/tipo/" + tipID, function(data) {
        retorno = data;
    });
	return retorno;
}

function apiProductoID(tipID) {
    var retorno = null;
    $.get(gURL + "/producto/tipo/" + tipID, function(data) {
        retorno = data;
    });
    return retorno;
}

function apiTipoID(id) {
    var retorno = null;
    var parametro = getAJAX(gURL + "/tipo/ID/" + id, null);
    $.when($.ajax(parametro)).done(function (a) {
        if (a != null) {
            retorno = a;
        }
    });
    return retorno;
}

function apiTipoIngrediente() {
    var retorno = null;
    var parametro = getAJAX(gURL + "/producto/ingrediente/true", null);
    $.when($.ajax(parametro)).done(function (a) {
        if (a != null) {
            retorno = a;
        }
    });
    return retorno;
}
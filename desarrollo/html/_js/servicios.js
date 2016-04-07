var gURL = "http://localhost:3000/api/";

function apiTipoTipID(id){
    var retorno = null;
	var parametro = getAJAX(gURL + "tipo/" + id, null);
	$.when($.ajax(parametro)).done(function (a) {
		if (a != null) {
			retorno = a;
		}
	});
	return retorno;
}

function apiTipoID(id) {
    var retorno = null;
    var parametro = getAJAX(gURL + "tipo/ID/" + id, null);
    $.when($.ajax(parametro)).done(function (a) {
        if (a != null) {
            retorno = a;
        }
    });
    return retorno;
}

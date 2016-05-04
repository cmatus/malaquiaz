$(document).ready(function () {
    cajaIniciar();
});

function cajaDesplegarMesas() {
	$("#divCajaMesas").html("");
    var json = apiGetMesa();
    if(json != null) {
        for(var x = 0; x < json.length; x++) {
			$("#divCajaMesas").append("<button onclick='cajaDesplegarPedido(" + (json[x].estado != 0 ? json[x]._id : 0) + ")' class='" + jsonEstado[json[x].estado].estilo + "'>Mesa N°" + json[x]._id + "</button>");
        }
    }
    setTimeout(function() { cajaDesplegarMesas(); }, 1000);
}

function cajaIniciar() {
    cajaLimpiaPantalla();
	cajaDesplegarMesas();
}

function cajaLimpiaPantalla() {
	
	$("#divCajaPedido").html("");
	$("#divCajaCuentaDetalle").html("");

	$("#txtTotalCuenta").val("");
	$("#txtPropina").val("");
	$("#txtTotal").val("");
	$("#txtPaga").val("");
	$("#txtVuelto").val("");

    $("#butCajaCuentaImprimir").unbind("click");
    $("#butCajaCuentaPagar").unbind("click");
    
    $("#txtPropina").unbind("blur");
    $("#txtPaga").unbind("blur");

}

function cajaDesplegarPedido(mesa) {
    
    cajaLimpiaPantalla();
	if(mesa > 0) {

	    var json = apiGetPedidoMesa(mesa);
	    if(json != null) {

		    var cHTML = "";
		    for (var x = 0; x < json.items.length; x++) {
		        cHTML += "<button>";
		        cHTML += "<div>" + json.items[x].nombre + " - " + json.items[x].precio[0].tipo + "</div>";
		        for (var y = 0; y < json.items[x].ingredientes.length; y++) {
		            if (json.items[x].ingredientes[y].con == 0) {
		                cHTML += "<div>&nbsp;&nbsp;&nbsp;s/" + json.items[x].ingredientes[y].nombre + "</div>";
		            }
		        }
		        for (var y = 0; y < json.items[x].agregados.length; y++) {
		            cHTML += "<div>&nbsp;&nbsp;&nbsp;" + json.items[x].agregados[y].nombre + "</div>";
		        }
		        cHTML += "</button>";
		    }
		    $("#divCajaPedido").html(cHTML);

		    if(json.cueID > 0) {
				json = apiGetCuenta(json.cueID);
				if(json != null) {
					
					var total = 0;
				    cHTML = "<table style='width:100%'>";
				    for (var x = 0; x < json.items.length; x++) {
				        cHTML += "<tr><td>&nbsp;" + json.items[x].nombre + "&nbsp;</td><td style='text-align:right'>&nbsp;$&nbsp;" + json.items[x].valor + "&nbsp;</td></tr>";
				        total = total + parseInt(json.items[x].valor);
				    }
				    cHTML += "<tr><td colspan='2'>&nbsp;</td></tr>";
				    cHTML += "</table>";
				    $("#divCajaCuentaDetalle").html(cHTML);
				    $("#txtTotalCuenta").val(total);
				    $("#txtPropina").val("0");
				    cajaCalcularTotal(total);

				    $("#txtPropina").blur(function() { cajaCalcularTotal(total) });
				    $("#txtPaga").blur(function() { cajaCalcularVuelto(); });

				    $("#butCajaCuentaImprimir").click(function(){ cajaCuentaImprimir(json); });
				    $("#butCajaCuentaPagar").click(function(){ cajaCuentaPagar(json); });

				}
		    }

	    }

	}

}

function cajaCalcularTotal(total) {
	$("#txtPaga").val("");
	$("#txtVuelto").val("");
	var propina = parseInt(($("#txtPropina").val() != "" ? $("#txtPropina").val() : "0"));
	$("#txtTotal").val(total + propina);
	$("#txtPaga").focus();
}

function cajaCalcularVuelto() {
	var totalCuenta = parseInt(($("#txtTotalCuenta").val() != "" ? $("#txtTotalCuenta").val() : "0"));
	var propina = parseInt(($("#txtPropina").val() != "" ? $("#txtPropina").val() : "0"));
	var total = totalCuenta + propina;
	var paga = parseInt(($("#txtPaga").val() != "" ? $("#txtPaga").val() : "0"));
	$("#txtVuelto").val(paga - total);
}

function cajaCuentaItem(nombre, valor) {
	nombre = nombre + charFill(" ", 32);
	nombre = nombre.substr(0, 32);
	return nombre + " " + formateaNumero(valor, 0, true, "$");
}

function cajaCuentaImprimir(jsonCuenta) {
	
    var retorno = false;
    if(jsonCuenta.items.length > 0) {

        var jsonBoleta = [];

        jsonBoleta.push("----------------- Cuenta ----------------");
        jsonBoleta.push("Atendida por: " + jsonCuenta.garzon);
        jsonBoleta.push("Mesa N°" + jsonCuenta.mesa);
        jsonBoleta.push("Fecha/Hora: " + jsonCuenta.fecha);
        jsonBoleta.push("------------------------------------------");
        jsonBoleta.push(" ");

        for(var x = 0; x < jsonCuenta.items.length; x++) {
            jsonBoleta.push(cajaCuentaItem(jsonCuenta.items[x].nombre, jsonCuenta.items[x].valor));
        }
        jsonBoleta.push("--------------- Fin Cuenta --------------");

        var info = { 
            'texto': jsonBoleta, 
            'corte': true, 
            'apertura': true, 
            'tipo': 'usb'
        }
        alert(JSON.stringify(info));
        //var parametro = RetornaAJAX(gURLImpresion, "imprimir", JSON.stringify(info), null);
        //$.when($.ajax(parametro)).done(function (a) {
        //    if (a.d != null) {
        //    	retorno = true;
        //    }
        //});

    }
    return retorno;
    
}

function cajaCuentaPagar(jsonCuenta) {
	jsonCuenta.cueID = jsonCuenta._id;
	jsonCuenta.tipoPago = "EF";
	jsonCuenta.propina = parseInt(($("#txtPropina").val() != "" ? $("#txtPropina").val() : "0"));
	var data = apiPostCuenta(jsonCuenta);
	if(data._id != null) {
        var dataMesa = apiPostMesa(data.mesa, 0);
        if(dataMesa._id != null) {
        	cajaIniciar();
        }
	}
}

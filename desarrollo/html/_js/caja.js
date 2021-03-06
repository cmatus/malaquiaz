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
}

function cajaIniciar() {
    cajaLimpiaPantalla();
	cajaDesplegarMesas();
	iniciaOptionSelect();
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

				    $("#txtPropina").blur(function() { evaluaSelector(); });
				    $("#txtPaga").blur(function() { evaluaSelector(); });

				    $("#butCajaCuentaImprimir").click(function(){ cajaCuentaImprimir(json); });
				    $("#butCajaCuentaPagar").click(function(){ cajaCuentaPagar(json); });

					var seleccionado = $(".campoSelector .selectorSel");
					seleccionado.removeClass("selectorSel");
					seleccionado.addClass("selector");
				    $($(".campoSelector .selector")[0]).removeClass("selector").addClass("selectorSel");
				    evaluaSelector();

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
	
	var tipoPago = $(".campoSelector .selectorSel").find("input")[0].value;
	var totalCuenta = 0;
	var propina = 0;
	var total = 0;
	var paga = 0;

	$("#txtVuelto").val(paga - total);
	switch(tipoPago) {
		case "EF":
			totalCuenta = parseInt(($("#txtTotalCuenta").val() != "" ? $("#txtTotalCuenta").val() : "0"));
			propina = parseInt(($("#txtPropina").val() != "" ? $("#txtPropina").val() : "0"));
			total = totalCuenta + propina;
			paga = parseInt(($("#txtPaga").val() != "" ? $("#txtPaga").val() : "0"));
			$("#txtVuelto").val(paga - total);
			break;
    	case "TC":
    	case "TD":
			$("#txtPaga").val($("#txtTotalCuenta").val());
			$("#txtVuelto").val("0");
			break;
	}

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
        jsonBoleta.push("N°: " + jsonCuenta._id);
        jsonBoleta.push("------------------------------------------");
        jsonBoleta.push(" ");

        for(var x = 0; x < jsonCuenta.items.length; x++) {
            jsonBoleta.push(cajaCuentaItem(jsonCuenta.items[x].nombre, jsonCuenta.items[x].valor));
        }
        jsonBoleta.push(" ");
        jsonBoleta.push("Total $ " + jsonCuenta.total);
        jsonBoleta.push("--------------- Fin Cuenta --------------");

        var info = { 
            'texto': jsonBoleta, 
            'corte': true, 
            'apertura': true, 
            'tipo': 'usb'
        }
        //alert(JSON.stringify(info));
        //var parametro = RetornaAJAX(gURLImpresion, "imprimir", JSON.stringify(info), null);
        //$.when($.ajax(parametro)).done(function (a) {
        //    if (a.d != null) {
            	retorno = true;
        //    }
        //});

    }
    return retorno;
    
}

function iniciaOptionSelect() {
    $(".campoSelector .selector").click(function() {
        var seleccionado = $(".campoSelector .selectorSel");
        seleccionado.removeClass("selectorSel");
        seleccionado.addClass("selector");
        $(this).removeClass("selector");
        $(this).addClass("selectorSel");
        evaluaSelector();
    });
}

function evaluaSelector() {
    
	totalCuenta = parseInt(($("#txtTotalCuenta").val() != "" ? $("#txtTotalCuenta").val() : "0"));
	propina = parseInt(($("#txtPropina").val() != "" ? $("#txtPropina").val() : "0"));
	total = totalCuenta + propina;
	$("#txtTotal").val(total + propina);


    var tipoPago = $(".campoSelector .selectorSel").find("input")[0].value;
    switch(tipoPago) {
    	case "TC":
    	case "TD":
    		$("#txtPaga").val($("#txtTotal").val());
    		$("#txtVuelto").val("0");
    		break;
    }
	$("#txtVuelto").val(parseInt(($("#txtPaga").val() == "" ? "0" : $("#txtPaga").val())) - parseInt(($("#txtTotal").val() == "" ? "0" : $("#txtTotal").val())));

}

function cajaCuentaPagar(jsonCuenta) {
	jsonCuenta.cueID = jsonCuenta._id;
	jsonCuenta.tipoPago = $(".campoSelector .selectorSel").find("input")[0].value;
	jsonCuenta.propina = parseInt(($("#txtPropina").val() != "" ? $("#txtPropina").val() : "0"));
	var data = apiPostCuenta(jsonCuenta);
	if(data._id != null) {
        var dataMesa = apiPostMesa(data.mesa, 0);
        if(dataMesa._id != null) {
        	cajaIniciar();
        }
	}
}

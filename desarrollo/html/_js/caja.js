$(document).ready(function () {
    cajaDesplegarMesas();
});

function cajaDesplegarMesas() {
    var json = apiGetMesa();
    if(json != null) {
        for(var x = 0; x < json.length; x++) {
			$("#divCajaMesas").append("<button onclick='cajaDesplegarPedido(" + (json[x].estado != 0 ? json[x]._id : 0) + ")' class='" + jsonEstado[json[x].estado].estilo + "'>Mesa N°" + json[x]._id + "</button>");
        }
    }
}

function cajaDesplegarPedido(mesa) {
    
    $("#divCajaPedido").html("");
	$("#divCajaCuentaDetalle").html("");

    $("#butCajaCuentaImprimir").unbind("click");
    $("#butCajaCuentaPagar").unbind("click");
    
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

				    $("#butCajaCuentaImprimir").click(function(){ cajaCuentaImprimir(json); });
				    $("#butCajaCuentaPagar").click(function(){ cajaCuentaPagar(json); });

				}
		    }

	    }

	}

}

function cajaCuentaImprimir(json) {
	
}

function cajaCuentaPagar(json) {

}